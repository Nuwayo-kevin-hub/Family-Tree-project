import { useEffect, useState, useCallback, useRef } from "react";
import { getFamilyTree } from "../../api/treeApi";
import { getChildren } from "../../api/memberApi";
import "./familyTree.css";

export default function FamilyTree() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [focusedMember, setFocusedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const treeContainerRef = useRef(null);

  // ============================================================
  // LOAD TREE + FETCH CHILDREN
  // ============================================================

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.family_id) {
      setLoading(false);
      return;
    }

    const loadTree = async () => {
      try {
        setLoading(true);

        // ======================================================
        // 1. GET MAIN FAMILY TREE
        // ======================================================

        const data = await getFamilyTree(user.family_id);

        console.log("ORIGINAL TREE DATA:", data);

        if (!data || !data.founder) {
          setTree(data);
          setLoading(false);
          return;
        }

        // ======================================================
        // 2. FETCH CHILDREN FOR ALL EXISTING TREE NODES
        // ======================================================

        const fetchChildrenForTree = async (rootData) => {
          const nodes = [];
          const visited = new Set();

          // ----------------------------------------------------
          // Collect every node already returned by tree API
          // ----------------------------------------------------

          const collectNode = (node) => {
            if (!node || !node.id) return;

            if (visited.has(node.id)) return;

            visited.add(node.id);
            nodes.push(node);

            // Existing children
            if (Array.isArray(node.children)) {
              node.children.forEach(collectNode);
            }

            // Existing spouse
            if (node.spouse) {
              collectNode(node.spouse);
            }

            // Existing parents
            if (node.parents) {
              if (node.parents.father) {
                collectNode(node.parents.father);
              }

              if (node.parents.mother) {
                collectNode(node.parents.mother);
              }
            }
          };

          // Founder
          collectNode(rootData.founder);

          // Founder siblings
          if (Array.isArray(rootData.founder.siblings)) {
            rootData.founder.siblings.forEach(collectNode);
          }

          // ----------------------------------------------------
          // Fetch children from /members/:id/children
          // ----------------------------------------------------

          const childrenResults = await Promise.all(
            nodes.map(async (node) => {
              try {
                const response = await getChildren(node.id);

                /*
                 * Your memberApi returns response.data.
                 * Depending on backend response structure,
                 * support all common formats.
                 */

                const children =
                  response?.data?.data ||
                  response?.data ||
                  response ||
                  [];

                return {
                  id: node.id,
                  children: Array.isArray(children)
                    ? children
                    : [],
                };
              } catch (error) {
                console.error(
                  `GET CHILDREN ERROR FOR MEMBER ${node.id}:`,
                  error
                );

                return {
                  id: node.id,
                  children: Array.isArray(node.children)
                    ? node.children
                    : [],
                };
              }
            })
          );

          // ----------------------------------------------------
          // Create lookup
          // ----------------------------------------------------

          const childrenMap = new Map();

          childrenResults.forEach((item) => {
            childrenMap.set(item.id, item.children);
          });

          // ----------------------------------------------------
          // Merge children recursively
          // ----------------------------------------------------

          const mergeNode = (node, visitedMerge = new Set()) => {
            if (!node || !node.id) {
              return node;
            }

            if (visitedMerge.has(node.id)) {
              return node;
            }

            visitedMerge.add(node.id);

            // ----------------------------------------------
            // IMPORTANT FIX
            //
            // Use children returned by:
            // GET /members/:id/children
            //
            // instead of trusting only tree.children
            // ----------------------------------------------

            const apiChildren = childrenMap.get(node.id);

            const existingChildren = Array.isArray(node.children)
              ? node.children
              : [];

            const finalChildren =
              Array.isArray(apiChildren) && apiChildren.length > 0
                ? apiChildren
                : existingChildren;

            // Remove duplicate children
            const uniqueChildren = [];
            const childIds = new Set();

            finalChildren.forEach((child) => {
              if (!child || !child.id) return;

              if (!childIds.has(child.id)) {
                childIds.add(child.id);

                uniqueChildren.push(
                  mergeNode(child, new Set(visitedMerge))
                );
              }
            });

            // ----------------------------------------------
            // Merge spouse
            // ----------------------------------------------

            let mergedSpouse = node.spouse || null;

            if (mergedSpouse) {
              mergedSpouse = mergeNode(
                mergedSpouse,
                new Set(visitedMerge)
              );
            }

            // ----------------------------------------------
            // Merge parents
            // ----------------------------------------------

            let mergedParents = node.parents || null;

            if (mergedParents) {
              mergedParents = {
                ...mergedParents,

                father: mergedParents.father
                  ? mergeNode(
                      mergedParents.father,
                      new Set(visitedMerge)
                    )
                  : null,

                mother: mergedParents.mother
                  ? mergeNode(
                      mergedParents.mother,
                      new Set(visitedMerge)
                    )
                  : null,
              };
            }

            return {
              ...node,

              children: uniqueChildren,

              spouse: mergedSpouse,

              parents: mergedParents,
            };
          };

          // ----------------------------------------------------
          // Merge founder
          // ----------------------------------------------------

          const mergedFounder = mergeNode(rootData.founder);

          // ----------------------------------------------------
          // Merge siblings separately
          // ----------------------------------------------------

          const mergedSiblings = Array.isArray(
            rootData.founder.siblings
          )
            ? rootData.founder.siblings.map((sibling) =>
                mergeNode(sibling)
              )
            : [];

          return {
            ...rootData,

            founder: {
              ...mergedFounder,

              siblings: mergedSiblings,
            },
          };
        };

        // ======================================================
        // 3. BUILD CORRECT TREE
        // ======================================================

        const completeTree =
          await fetchChildrenForTree(data);

        console.log(
          "COMPLETE TREE WITH CHILDREN:",
          completeTree
        );

        // ======================================================
        // 4. SET TREE
        // ======================================================

        setTree(completeTree);

        // ======================================================
        // 5. INITIAL EXPANDED NODES
        // ======================================================

        const initialExpanded = new Set();

        if (completeTree.founder) {
          initialExpanded.add(
            completeTree.founder.id
          );

          // -----------------------------------------------
          // Expand founder's children
          // -----------------------------------------------

          if (
            completeTree.founder.children &&
            completeTree.founder.children.length > 0
          ) {
            completeTree.founder.children.forEach(
              (child) => {
                initialExpanded.add(child.id);
              }
            );
          }
        }

        // ======================================================
        // 6. EXPAND PARENTS
        // ======================================================

        if (completeTree.founder?.parents) {
          if (
            completeTree.founder.parents.father
          ) {
            initialExpanded.add(
              completeTree.founder.parents.father.id
            );
          }

          if (
            completeTree.founder.parents.mother
          ) {
            initialExpanded.add(
              completeTree.founder.parents.mother.id
            );
          }
        }

        setExpandedNodes(initialExpanded);

        // ======================================================
        // 7. FOCUS FOUNDER
        // ======================================================

        if (completeTree.founder) {
          setFocusedMember(
            completeTree.founder.id
          );

          setBreadcrumbs([
            {
              id: completeTree.founder.id,

              name:
                `${completeTree.founder.first_name || ""} ${
                  completeTree.founder.last_name || ""
                }`.trim() || "Founder",

              role: "Founder",
            },
          ]);
        }
      } catch (error) {
        console.error(
          "LOAD FAMILY TREE ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadTree();
  }, []);

  // ============================================================
  // SEARCH FUNCTIONALITY
  // ============================================================

  const searchMembers = useCallback(
    (query) => {
      if (!query.trim() || !tree) {
        setSearchResults([]);
        return;
      }

      const results = [];

      const searchInNode = (
        node,
        path = []
      ) => {
        if (!node) return;

        const currentPath = [
          ...path,
          {
            id: node.id,

            name:
              `${node.first_name || ""} ${
                node.last_name || ""
              }`.trim() || "Unknown",
          },
        ];

        const fullName =
          `${node.first_name || ""} ${
            node.last_name || ""
          }`.toLowerCase();

        if (
          fullName.includes(
            query.toLowerCase()
          )
        ) {
          results.push({
            id: node.id,

            name:
              `${node.first_name || ""} ${
                node.last_name || ""
              }`.trim() || "Unknown",

            role:
              node.role || "Member",

            path: currentPath,
          });
        }

        // Search children
        if (node.children) {
          node.children.forEach(
            (child) =>
              searchInNode(
                child,
                currentPath
              )
          );
        }

        // Search spouse
        if (node.spouse) {
          const spouseName =
            `${node.spouse.first_name || ""} ${
              node.spouse.last_name || ""
            }`.toLowerCase();

          if (
            spouseName.includes(
              query.toLowerCase()
            )
          ) {
            results.push({
              id: node.spouse.id,

              name:
                `${node.spouse.first_name || ""} ${
                  node.spouse.last_name || ""
                }`.trim() || "Unknown",

              role:
                node.spouse.role ||
                "Spouse",

              path: currentPath,
            });
          }
        }
      };

      // Founder
      if (tree.founder) {
        searchInNode(tree.founder);
      }

      // Siblings
      if (
        tree.founder &&
        tree.founder.siblings
      ) {
        tree.founder.siblings.forEach(
          (sibling) =>
            searchInNode(sibling)
        );
      }

      setSearchResults(
        results.slice(0, 8)
      );
    },
    [tree]
  );

  // ============================================================
  // GET PATH TO MEMBER
  // ============================================================

  const getPathToMember = (
    memberId
  ) => {
    const path = [];

    const findPath = (
      node,
      targetId,
      currentPath = []
    ) => {
      if (!node) return false;

      const newPath = [
        ...currentPath,
        {
          id: node.id,

          name:
            `${node.first_name || ""} ${
              node.last_name || ""
            }`.trim() || "Unknown",

          role:
            node.role || "Member",
        },
      ];

      if (node.id === targetId) {
        path.push(...newPath);
        return true;
      }

      if (node.children) {
        for (
          const child of node.children
        ) {
          if (
            findPath(
              child,
              targetId,
              newPath
            )
          ) {
            return true;
          }
        }
      }

      return false;
    };

    if (
      tree &&
      tree.founder
    ) {
      findPath(
        tree.founder,
        memberId
      );
    }

    return path;
  };

  // ============================================================
  // NAVIGATE TO MEMBER
  // ============================================================

  const navigateToMember = (
    memberId
  ) => {
    const path =
      getPathToMember(memberId);

    if (path.length > 0) {
      const expandIds =
        new Set(expandedNodes);

      path.forEach(
        (member) =>
          expandIds.add(member.id)
      );

      setExpandedNodes(
        expandIds
      );

      setFocusedMember(
        memberId
      );

      setBreadcrumbs(
        path
      );

      setTimeout(() => {
        const memberElement =
          document.querySelector(
            `[data-member-id="${memberId}"]`
          );

        if (memberElement) {
          memberElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  };

  // ============================================================
  // TOGGLE NODE
  // ============================================================

  const toggleNode = (
    nodeId,
    e
  ) => {
    if (e) {
      e.stopPropagation();
    }

    setExpandedNodes(
      (prev) => {
        const newSet =
          new Set(prev);

        if (
          newSet.has(nodeId)
        ) {
          newSet.delete(
            nodeId
          );
        } else {
          newSet.add(
            nodeId
          );
        }

        return newSet;
      }
    );
  };

  // ============================================================
  // ZOOM CONTROLS
  // ============================================================

  const zoomIn = () =>
    setZoomLevel(
      (prev) =>
        Math.min(
          prev + 20,
          200
        )
    );

  const zoomOut = () =>
    setZoomLevel(
      (prev) =>
        Math.max(
          prev - 20,
          60
        )
    );

  const resetZoom = () =>
    setZoomLevel(100);

  // ============================================================
  // FOCUS FOUNDER
  // ============================================================

  const focusFounder = () => {
    if (
      !tree ||
      !tree.founder
    ) {
      return;
    }

    setFocusedMember(
      tree.founder.id
    );

    setBreadcrumbs([
      {
        id: tree.founder.id,

        name:
          `${tree.founder.first_name || ""} ${
            tree.founder.last_name || ""
          }`.trim() ||
          "Founder",

        role: "Founder",
      },
    ]);
  };

  // ============================================================
  // EXPAND / COLLAPSE ALL
  // ============================================================

  const expandAll = () => {
    const allIds =
      new Set();

    const collectIds = (
      node
    ) => {
      if (!node) return;

      allIds.add(
        node.id
      );

      if (
        node.children
      ) {
        node.children.forEach(
          collectIds
        );
      }
    };

    if (
      tree &&
      tree.founder
    ) {
      collectIds(
        tree.founder
      );
    }

    setExpandedNodes(
      allIds
    );
  };

  const collapseAll = () => {
    if (
      tree &&
      tree.founder
    ) {
      setExpandedNodes(
        new Set([
          tree.founder.id,
        ])
      );
    }
  };

  // ============================================================
  // RENDER PERSON CARD
  // ============================================================

  const renderPersonCard = (
    person,
    type = "child"
  ) => {
    if (!person) {
      return null;
    }

    const hasChildren =
      person.children &&
      person.children.length >
        0;

    const isExpanded =
      expandedNodes.has(
        person.id
      );

    const isFocused =
      focusedMember ===
      person.id;

    const childCount =
      person.children
        ? person.children.length
        : 0;

    const personName =
      `${person.first_name || ""} ${
        person.last_name || ""
      }`.trim() ||
      "Unknown";

    return (
      <div
        className={`person-card ${type} ${
          isFocused
            ? "focused"
            : ""
        }`}
        data-member-id={
          person.id
        }
        onClick={() => {
          setFocusedMember(
            person.id
          );

          const newBreadcrumbs =
            getPathToMember(
              person.id
            );

          if (
            newBreadcrumbs.length >
            0
          ) {
            setBreadcrumbs(
              newBreadcrumbs
            );
          } else {
            setBreadcrumbs([
              {
                id: person.id,

                name:
                  personName,

                role:
                  person.role ||
                  "Member",
              },
            ]);
          }
        }}
      >
        <div className="card-header">
          <div className="person-avatar">
            {person.gender ===
            "Male"
              ? "👨"
              : person.gender ===
                "Female"
              ? "👩"
              : person.gender ===
                "MALE"
              ? "👨"
              : person.gender ===
                "FEMALE"
              ? "👩"
              : "👤"}
          </div>

          <div className="person-info">
            <div className="person-name">
              {personName}
            </div>

            <div className="person-details">
              <span className="gender">
                {person.gender ||
                  ""}
              </span>

              {person.date_of_birth && (
                <span className="birth-date">
                  📅{" "}
                  {
                    person.date_of_birth
                  }
                </span>
              )}
            </div>
          </div>

          {hasChildren && (
            <button
              className={`expand-btn ${
                isExpanded
                  ? "expanded"
                  : ""
              }`}
              onClick={(e) =>
                toggleNode(
                  person.id,
                  e
                )
              }
              title={
                isExpanded
                  ? "Collapse"
                  : "Expand"
              }
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          )}
        </div>

        {hasChildren &&
          !isExpanded && (
            <div
              className="collapsed-info"
              onClick={(e) =>
                toggleNode(
                  person.id,
                  e
                )
              }
            >
              <span>
                {childCount} child
                {childCount !== 1
                  ? "ren"
                  : ""}
              </span>
            </div>
          )}

        {!hasChildren &&
          type !==
            "founder" && (
            <div className="no-children-indicator">
              🌱 No children
            </div>
          )}

        {/* Spouse inside card */}
        {person.spouse && (
          <div className="spouse-connection">
            <span className="spouse-icon">
              💑
            </span>

            <span className="spouse-name">
              {person.spouse
                .first_name ||
                ""}{" "}
              {person.spouse
                .last_name ||
                ""}
            </span>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // RENDER CHILDREN
  // ============================================================

  const renderChildren = (
    person
  ) => {
    if (
      !person ||
      !person.children ||
      !expandedNodes.has(
        person.id
      ) ||
      person.children.length ===
        0
    ) {
      return null;
    }

    return (
      <div className="children-section">
        <div className="children-connector"></div>

        <div className="children-grid">
          {person.children.map(
            (child) => (
              <div
                key={child.id}
                className="child-branch"
              >
                <div className="child-content">
                  {renderPersonCard(
                    child,
                    "child"
                  )}
                </div>

                {renderChildren(
                  child
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER SIBLINGS
  // ============================================================

  const renderSiblings = (
    siblings,
    side = "left"
  ) => {
    if (
      !siblings ||
      siblings.length ===
        0
    ) {
      return null;
    }

    return (
      <div
        className={`siblings-${side}`}
      >
        {siblings.map(
          (sibling) => (
            <div
              key={sibling.id}
              className="sibling-branch"
            >
              <div className="sibling-content">
                {renderPersonCard(
                  sibling,
                  "sibling"
                )}
              </div>

              {renderChildren(
                sibling
              )}
            </div>
          )
        )}
      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (loading) {
    return (
      <div className="tree-loading">
        Loading family tree...
      </div>
    );
  }

  if (
    !tree ||
    !tree.founder
  ) {
    return (
      <div className="tree-loading">
        No family tree found.
      </div>
    );
  }

  const founder =
    tree.founder;

  const hasParents =
    founder.parents &&
    (
      founder.parents
        .father ||
      founder.parents
        .mother
    );

  const siblings =
    founder.siblings ||
    [];

  const halfSiblings =
    Math.ceil(
      siblings.length / 2
    );

  const leftSiblings =
    siblings.slice(
      0,
      halfSiblings
    );

  const rightSiblings =
    siblings.slice(
      halfSiblings
    );

  const founderName =
    `${founder.first_name || ""} ${
      founder.last_name || ""
    }`.trim() ||
    "Founder";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="family-tree-app">

      {/* Header Controls */}
      <div className="tree-header">

        <div className="header-left">
          <h1>
            🌳 Family Tree
          </h1>

          <div className="member-count">
            {expandedNodes.size} expanded
          </div>
        </div>

        <div className="header-center">

          <div className="search-container">

            <input
              type="text"
              placeholder="Search family member..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(
                  e.target.value
                );

                searchMembers(
                  e.target.value
                );
              }}
              className="search-input"
            />

            {searchResults.length >
              0 && (
              <div className="search-results">

                {searchResults.map(
                  (result) => (
                    <div
                      key={
                        result.id
                      }
                      className="search-result"
                      onClick={() => {
                        navigateToMember(
                          result.id
                        );

                        setSearchQuery(
                          ""
                        );

                        setSearchResults(
                          []
                        );
                      }}
                    >
                      <span className="result-name">
                        {
                          result.name
                        }
                      </span>

                      <span className="result-role">
                        {
                          result.role
                        }
                      </span>
                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>

        <div className="header-right">

          <div className="zoom-controls">

            <button
              onClick={
                zoomOut
              }
            >
              🔍−
            </button>

            <span>
              {zoomLevel}%
            </span>

            <button
              onClick={
                zoomIn
              }
            >
              🔍+
            </button>

            <button
              onClick={
                resetZoom
              }
            >
              Reset
            </button>

          </div>

          <button
            className="founder-btn"
            onClick={
              focusFounder
            }
          >
            👑 Founder
          </button>

          <button
            className="expand-all-btn"
            onClick={
              expandAll
            }
          >
            📂 All
          </button>

          <button
            className="collapse-all-btn"
            onClick={
              collapseAll
            }
          >
            📁 Collapse
          </button>

        </div>

      </div>

      {/* Breadcrumbs */}
      <div className="breadcrumbs">

        {breadcrumbs.length >
        0 ? (
          breadcrumbs.map(
            (crumb, index) => (
              <span
                key={
                  crumb.id
                }
              >

                <button
                  className="breadcrumb"
                  onClick={() =>
                    navigateToMember(
                      crumb.id
                    )
                  }
                >
                  {
                    crumb.name
                  }
                </button>

                {index <
                  breadcrumbs.length -
                    1 && (
                  <span className="separator">
                    ›
                  </span>
                )}

              </span>
            )
          )
        ) : (
          <span className="breadcrumb-placeholder">
            Click on a member to
            see their path
          </span>
        )}

      </div>

      {/* Main Tree Container */}
      <div
        className="tree-workspace"
        ref={
          treeContainerRef
        }
      >

        <div
          className="tree-canvas"
          style={{
            transform: `scale(${
              zoomLevel / 100
            })`,
          }}
        >

          {/* ===== PARENTS SECTION ===== */}
          {hasParents && (
            <div className="parents-section">

              <div className="section-label">
                👨‍👩‍👧‍👦 Parents
              </div>

              <div className="parents-container">

                {founder.parents
                  .father &&
                  renderPersonCard(
                    founder.parents
                      .father,
                    "parent"
                  )}

                {founder.parents
                  .mother &&
                  renderPersonCard(
                    founder.parents
                      .mother,
                    "parent"
                  )}

              </div>

              <div className="parents-connector"></div>

            </div>
          )}

          {/* ===== FOUNDER & SIBLINGS SECTION ===== */}
          <div className="founder-section">

            <div className="founder-row">

              {/* Left Siblings */}
              {renderSiblings(
                leftSiblings,
                "left"
              )}

              {/* Founder */}
              <div className="founder-center">

                <div className="founder-spouse-wrapper">

                  {renderPersonCard(
                    founder,
                    "founder"
                  )}

                </div>

                {renderChildren(
                  founder
                )}

              </div>

              {/* Right Siblings */}
              {renderSiblings(
                rightSiblings,
                "right"
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}