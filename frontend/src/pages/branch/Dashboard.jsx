
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import {
    getMyBranchMembers,
    getMyChildren,
    getMyDescendants
} from "../../api/memberApi";

import "./dashboard.css";

export default function Dashboard() {

    const { user } = useAuth();

    const [members, setMembers] = useState([]);
    const [children, setChildren] = useState([]);
    const [descendants, setDescendants] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    membersResponse,
                    childrenResponse,
                    descendantsResponse
                ] = await Promise.all([
                    getMyBranchMembers(),
                    getMyChildren(),
                    getMyDescendants()
                ]);

                /*
                 * Axios responses can look like:
                 *
                 * response.data
                 *
                 * or:
                 *
                 * response.data.data
                 *
                 * depending on your backend.
                 */

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

                setChildren(
                    normalize(childrenResponse)
                );

                setDescendants(
                    normalize(descendantsResponse)
                );

            } catch (err) {

                console.error(
                    "Sub Root Dashboard Error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load dashboard data."
                );

                setMembers([]);
                setChildren([]);
                setDescendants([]);

            } finally {

                setLoading(false);

            }

        };

        if (user) {
            loadDashboard();
        }

    }, [user]);


    if (loading) {

        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );

    }


    return (

        <div className="subroot-dashboard">

            {/* HEADER */}

            <div className="dashboard-header">

                <div>

                    <span className="dashboard-label">
                        FAMILY MANAGEMENT
                    </span>

                    <h1>
                        Sub Root Dashboard
                    </h1>

                    <p>
                        Welcome back,{" "}
                        <strong>
                            {user?.full_name ||
                             user?.username ||
                             "Admin"}
                        </strong>
                    </p>

                </div>

                <span className="role-badge">
                    SUB ROOT ADMIN
                </span>

            </div>


            {/* ERROR */}

            {error && (

                <div className="dashboard-error">
                    {error}
                </div>

            )}


            {/* STATISTICS */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon">
                        👨‍👩‍👧‍👦
                    </div>

                    <div className="stat-info">

                        <span>
                            My Branch
                        </span>

                        <strong>
                            {members.length}
                        </strong>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        👶
                    </div>

                    <div className="stat-info">

                        <span>
                            My Children
                        </span>

                        <strong>
                            {children.length}
                        </strong>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        🌳
                    </div>

                    <div className="stat-info">

                        <span>
                            Descendants
                        </span>

                        <strong>
                            {descendants.length}
                        </strong>

                    </div>

                </div>

            </div>


            {/* QUICK ACTIONS */}

            <section className="dashboard-section">

                <div className="section-title">

                    <div>
                        <span>
                            MANAGEMENT
                        </span>

                        <h2>
                            Quick Actions
                        </h2>
                    </div>

                </div>


                <div className="action-grid">

                    <Link
                        to="/subroot/members"
                        className="action-card"
                    >

                        <div className="action-icon">
                            👨‍👩‍👧‍👦
                        </div>

                        <div>
                            <strong>
                                My Members
                            </strong>

                            <p>
                                Manage members in your branch
                            </p>
                        </div>

                    </Link>


                    <Link
                        to="/subroot/tree"
                        className="action-card"
                    >

                        <div className="action-icon">
                            🌳
                        </div>

                        <div>
                            <strong>
                                Family Tree
                            </strong>

                            <p>
                                View your family structure
                            </p>
                        </div>

                    </Link>


                    <Link
                        to="/subroot/permissions"
                        className="action-card"
                    >

                        <div className="action-icon">
                            🔑
                        </div>

                        <div>
                            <strong>
                                Permissions
                            </strong>

                            <p>
                                Give permissions to your children
                            </p>
                        </div>

                    </Link>

                </div>

            </section>


            {/* CHILDREN */}

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <span>
                            FAMILY
                        </span>

                        <h2>
                            My Children
                        </h2>

                    </div>

                    <Link to="/subroot/permissions">
                        Manage
                    </Link>

                </div>


                {children.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            👶
                        </div>

                        <h3>
                            No children found
                        </h3>

                        <p>
                            Your children will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="member-preview">

                        {children
                            .slice(0, 5)
                            .map((member) => (

                                <div
                                    className="member-row"
                                    key={member.id}
                                >

                                    <div className="avatar">

                                        {member.first_name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "?"}

                                    </div>


                                    <div className="member-info">

                                        <strong>
                                            {member.first_name || ""}
                                            {" "}
                                            {member.middle_name || ""}
                                            {" "}
                                            {member.last_name || ""}
                                        </strong>

                                        <small>
                                            {member.role || "MEMBER"}
                                        </small>

                                    </div>

                                </div>

                            ))}

                    </div>

                )}

            </section>

        </div>

    );

}
