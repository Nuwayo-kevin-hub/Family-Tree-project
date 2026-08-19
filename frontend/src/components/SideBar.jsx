import { NavLink } from "react-router-dom";
import "./sidebar.css";

import useAuth from "../hooks/useAuth";

// Icons
import homeIcon from "../assets/icons/home.png";
import treeIcon from "../assets/icons/tree.png";
import membersIcon from "../assets/icons/members.png";
import permissionIcon from "../assets/icons/permission.png";
import requestIcon from "../assets/icons/request.png";
import addMemberIcon from "../assets/icons/add-member.png";
import profileIcon from "../assets/icons/profile.png";
import logoutIcon from  "../assets/icons/right-arrow.png";
import showIcon from  "../assets/icons/show.png";

export default function SideBar() {
  const { user, logout } = useAuth();

  // Get user initials
  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="sidebar">

      {/* ================================
          LOGO
      ================================= */}

      <div className="sidebar-logo">
        <span>
          <img src={showIcon}/>
        </span>
      </div>


      {/* ================================
          NAVIGATION
      ================================= */}

      <ul className="sidebar-menu">

        {/* ================================
            ROOT ADMIN
        ================================= */}

        {user?.role === "ROOT_ADMIN" && (
          <>
            <li>
              <NavLink
                to="/root/dashboard"
                data-tooltip="Dashboard"
              >
                <img src={homeIcon} alt="Dashboard" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/root/tree"
                data-tooltip="Family Tree"
              >
                <img src={treeIcon} alt="Family Tree" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/root/members"
                data-tooltip="Manage Members"
              >
                <img src={membersIcon} alt="Manage Members" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/root/permissions"
                data-tooltip="Give Permission"
              >
                <img src={permissionIcon} alt="Give Permission" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/root/requests"
                data-tooltip="Requests"
              >
                <img src={requestIcon} alt="Requests" />
              </NavLink>
            </li>
          </>
        )}


        {/* ================================
            SUB ROOT ADMIN
        ================================= */}

        {user?.role === "SUB_ROOT_ADMIN" && (
          <>
            <li>
              <NavLink
                to="/subroot/"
                data-tooltip="Dashboard"
              >
                <img src={homeIcon} alt="Dashboard" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/subroot/members"
                data-tooltip="Members"
              >
                <img src={membersIcon} alt="Members" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/subroot/add-member"
                data-tooltip="Add Member"
              >
                <img src={addMemberIcon} alt="Add Member" />
              </NavLink>
            </li>

            
            <li>
              <NavLink
                to="/subroot/tree"
                data-tooltip="Family Tree"
              >
                <img src={treeIcon} alt="Family Tree" />
              </NavLink>
            </li>
          </>
        )}


        {/* ================================
            BRANCH ADMIN
        ================================= */}

        {user?.role === "BRANCH_ADMIN" && (
          <>
            <li>
              <NavLink
                to="/branch/dashboard"
                data-tooltip="Dashboard"
              >
                <img src={homeIcon} alt="Dashboard" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/branch/members"
                data-tooltip="Members"
              >
                <img src={membersIcon} alt="Members" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/branch/add-member"
                data-tooltip="Add Member"
              >
                <img src={addMemberIcon} alt="Add Member" />
              </NavLink>
            </li>
          </>
        )}


        {/* ================================
            MEMBER
        ================================= */}

        {user?.role === "MEMBER" && (
          <>
            <li>
              <NavLink
                to="/member/dashboard"
                data-tooltip="Dashboard"
              >
                <img src={homeIcon} alt="Dashboard" />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/member/profile"
                data-tooltip="Profile"
              >
                <img src={profileIcon} alt="Profile" />
              </NavLink>
            </li>
          </>
        )}

      </ul>


      {/* ================================
          USER FOOTER
      ================================= */}

      <div className="sidebar-footer">

        <div
          className="avatar"
          title={user?.full_name || "User"}
        >
          {getInitials(user?.full_name)}
        </div>

     <button
className="logout-btn"
onClick={logout}
title="Logout"
type="button"

>

  <img src={logoutIcon} alt="Logout" />
</button>


      </div>

    </div>
  );
}