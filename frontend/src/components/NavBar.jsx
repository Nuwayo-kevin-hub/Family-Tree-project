import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import {
  getUnviewedPendingRequests,
} from "../api/requestApi";

import {
  getUnreadNotifications,
} from "../api/notificationApi";

import "./navbar.css";

// Icons
import notificationIcon from "../assets/icons/notification.png";
import requestIcon from "../assets/icons/request.png";

export default function NavBar() {
  const { user, logout } = useAuth();

  const [notificationCount, setNotificationCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  const loadCounts = async () => {
    // =========================
    // REQUESTS
    // =========================

    try {
      const response = await getUnviewedPendingRequests();

      const requests =
        response?.data ||
        response ||
        [];

      setRequestCount(
        Array.isArray(requests)
          ? requests.length
          : 0
      );
    } catch (error) {
      console.error(
        "Request count error:",
        error
      );

      setRequestCount(0);
    }

    // =========================
    // NOTIFICATIONS
    // =========================

    try {
      const response = await getUnreadNotifications();

      const notifications =
        response?.data ||
        response ||
        [];

      setNotificationCount(
        Array.isArray(notifications)
          ? notifications.length
          : 0
      );
    } catch (error) {
      console.error(
        "Notification count error:",
        error
      );

      setNotificationCount(0);
    }
  };

  // =========================
  // LOAD COUNTS
  // =========================

  useEffect(() => {
    if (!user) return;

    loadCounts();

    const interval = setInterval(
      loadCounts,
      30000
    );

    return () => clearInterval(interval);
  }, [user]);

  // =========================
  // NAVBAR
  // =========================

  return (
    <nav className="navbar">

      {/* =========================
          BRAND
      ========================= */}

      <div className="nav-brand">

        <span className="brand-icon">
          🌳
        </span>

        <span className="brand-text">
          FamilyTree
        </span>

        {user && (
          <span className="user-role">
            {user.role}
          </span>
        )}

      </div>


      {/* =========================
          NAV ACTIONS
      ========================= */}

      <div className="nav-actions">

        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <Link
          to="/notifications"
          className="nav-icon"
          title="Notifications"
        >

          <img
            src={notificationIcon}
            alt="Notifications"
            className="nav-action-icon"
          />

          {notificationCount > 0 && (
            <span className="badge">
              {notificationCount > 99
                ? "99+"
                : notificationCount}
            </span>
          )}

        </Link>


        {/* =========================
            REQUESTS
        ========================= */}

        <Link
          to="/root/requests"
          className="nav-icon"
          title="Family Requests"
        >

          <img
            src={requestIcon}
            alt="Family Requests"
            className="nav-action-icon"
          />

          {requestCount > 0 && (
            <span className="badge">
              {requestCount > 99
                ? "99+"
                : requestCount}
            </span>
          )}

        </Link>


        {/* =========================
            USER NAME
        ========================= */}

        <span className="user-name">
          {user?.first_name ||
            user?.username ||
            "Guest"}
        </span>


        {/* =========================
            LOGOUT
        ========================= */}

        <button
          onClick={logout}
          className="logout-btn"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}