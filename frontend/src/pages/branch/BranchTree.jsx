
import { useEffect, useState } from "react";
import {
    getMyAncestors,
    getMyDescendants,
    getMyBranchMembers
} from "../../api/memberApi";

import "./BranchTree.css";

export default function SubRootFamilyTree() {

    const [members, setMembers] = useState([]);
    const [ancestors, setAncestors] = useState([]);
    const [descendants, setDescendants] = useState([]);

    const [activeSection, setActiveSection] = useState("branch");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadTree = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    membersResponse,
                    ancestorsResponse,
                    descendantsResponse
                ] = await Promise.all([
                    getMyBranchMembers(),
                    getMyAncestors(),
                    getMyDescendants()
                ]);

                const normalize = (response) => {

                    const data = response?.data ?? response;

                    if (Array.isArray(data)) {
                        return data;
                    }

                    if (Array.isArray(data?.data)) {
                        return data.data;
                    }

                    return [];
                };

                setMembers(
                    normalize(membersResponse)
                );

                setAncestors(
                    normalize(ancestorsResponse)
                );

                setDescendants(
                    normalize(descendantsResponse)
                );

            } catch (err) {

                console.error(
                    "Family tree error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load family tree."
                );

            } finally {

                setLoading(false);

            }

        };

        loadTree();

    }, []);


    const renderMembers = (list) => {

        if (!list || list.length === 0) {

            return (
                <div className="branch-tree-empty">

                    <div className="branch-tree-empty-icon">
                        👨‍👩‍👧‍👦
                    </div>

                    <h3>
                        No members found
                    </h3>

                    <p>
                        There are no members to display.
                    </p>

                </div>
            );

        }


        return (

            <div className="branch-tree-members">

                {list.map((member) => {

                    const fullName = [
                        member.first_name,
                        member.middle_name,
                        member.last_name
                    ]
                        .filter(Boolean)
                        .join(" ");


                    return (

                        <div
                            className="branch-tree-member"
                            key={member.id}
                        >

                            <div className="branch-tree-avatar">

                                {member.first_name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "?"}

                            </div>


                            <div className="branch-tree-member-info">

                                <strong>
                                    {fullName || "Unknown Member"}
                                </strong>

                                <span>
                                    {member.role || "MEMBER"}
                                </span>

                                {member.gender && (
                                    <small>
                                        {member.gender}
                                    </small>
                                )}

                            </div>

                        </div>

                    );

                })}

            </div>

        );

    };


    if (loading) {

        return (

            <div className="branch-tree-page">

                <div className="branch-tree-loading">

                    <div className="branch-tree-spinner"></div>

                    <p>
                        Loading family tree...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="branch-tree-page">

            {/* HEADER */}

            <div className="branch-tree-header">

                <div>

                    <span className="branch-tree-label">
                        FAMILY MANAGEMENT
                    </span>

                    <h1>
                        Family Tree
                    </h1>

                    <p>
                        Explore your family branch,
                        ancestors and descendants.
                    </p>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="branch-tree-error">
                    {error}
                </div>

            )}


            {/* BUTTONS */}

            <div className="branch-tree-tabs">

                <button
                    type="button"
                    className={
                        activeSection === "ancestors"
                            ? "branch-tree-tab active"
                            : "branch-tree-tab"
                    }
                    onClick={() =>
                        setActiveSection("ancestors")
                    }
                >
                    <span>⬆️</span>

                    <div>
                        <strong>
                            Ancestors
                        </strong>

                        <small>
                            {ancestors.length} members
                        </small>
                    </div>

                </button>


                <button
                    type="button"
                    className={
                        activeSection === "branch"
                            ? "branch-tree-tab active"
                            : "branch-tree-tab"
                    }
                    onClick={() =>
                        setActiveSection("branch")
                    }
                >
                    <span>🌳</span>

                    <div>
                        <strong>
                            My Branch
                        </strong>

                        <small>
                            {members.length} members
                        </small>
                    </div>

                </button>


                <button
                    type="button"
                    className={
                        activeSection === "descendants"
                            ? "branch-tree-tab active"
                            : "branch-tree-tab"
                    }
                    onClick={() =>
                        setActiveSection("descendants")
                    }
                >
                    <span>⬇️</span>

                    <div>
                        <strong>
                            Descendants
                        </strong>

                        <small>
                            {descendants.length} members
                        </small>
                    </div>

                </button>

            </div>


            {/* CONTENT */}

            <section className="branch-tree-content">

                {activeSection === "ancestors" && (

                    <div>

                        <div className="branch-tree-section-header">

                            <div>

                                <span>
                                    FAMILY HISTORY
                                </span>

                                <h2>
                                    ⬆️ My Ancestors
                                </h2>

                            </div>

                            <strong>
                                {ancestors.length}
                            </strong>

                        </div>


                        {renderMembers(ancestors)}

                    </div>

                )}


                {activeSection === "branch" && (

                    <div>

                        <div className="branch-tree-section-header">

                            <div>

                                <span>
                                    CURRENT BRANCH
                                </span>

                                <h2>
                                    🌳 My Branch
                                </h2>

                            </div>

                            <strong>
                                {members.length}
                            </strong>

                        </div>


                        {renderMembers(members)}

                    </div>

                )}


                {activeSection === "descendants" && (

                    <div>

                        <div className="branch-tree-section-header">

                            <div>

                                <span>
                                    FAMILY DESCENDANTS
                                </span>

                                <h2>
                                    ⬇️ My Descendants
                                </h2>

                            </div>

                            <strong>
                                {descendants.length}
                            </strong>

                        </div>


                        {renderMembers(descendants)}

                    </div>

                )}

            </section>

        </div>

    );

}
