import { useEffect, useState } from "react";

import {
    getMyChildren,
    giveBranchPermission
} from "../../api/memberApi";



export default function SubRootPermissions() {

    const [children, setChildren] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedMember, setSelectedMember] =
        useState(null);

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");


    const loadChildren = async () => {

        try {

            setLoading(true);

            const response =
                await getMyChildren();

            setChildren(
                response?.data ||
                response ||
                []
            );

        } catch (error) {

            console.error(
                "Load children:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadChildren();

    }, []);


    const openPermission = (member) => {

        setSelectedMember(member);

        setUsername("");

        setPassword("");

    };


    const closePermission = () => {

        setSelectedMember(null);

        setUsername("");

        setPassword("");

    };


    const handlePermission = async (e) => {

        e.preventDefault();

        if (!username || !password) {

            alert(
                "Username and password are required"
            );

            return;

        }


        try {

            await giveBranchPermission(
                selectedMember.id,
                {
                    username,
                    password
                }
            );


            alert(
                "Branch Admin permission granted successfully."
            );


            closePermission();

            await loadChildren();

        } catch (error) {

            alert(
                error?.response?.data?.message ||
                "Failed to grant permission"
            );

        }

    };


    return (

        <div className="subroot-page">

            <div className="page-header">

                <div>

                    <h1>
                        Manage Permissions
                    </h1>

                    <p>
                        Give Branch Admin permission to your children
                    </p>

                </div>

            </div>


            {loading ? (

                <div className="loading">
                    Loading children...
                </div>

            ) : children.length === 0 ? (

                <div className="empty-card">
                    You currently have no children.
                </div>

            ) : (

                <div className="permission-grid">

                    {children.map(member => (

                        <div
                            className="permission-card"
                            key={member.id}
                        >

                            <div className="avatar large">
                                {member.first_name?.[0]}
                            </div>


                            <h3>

                                {member.first_name}{" "}

                                {member.last_name || ""}

                            </h3>


                            <p>
                                {member.gender || "Unknown"}
                            </p>


                            <span className="role-pill">

                                {member.role}

                            </span>


                            {member.has_account ? (

                                <div className="account-active">
                                    ✓ Account already active
                                </div>

                            ) : (

                                <button
                                    className="primary-btn"
                                    onClick={() =>
                                        openPermission(member)
                                    }
                                >
                                    Give Permission
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            )}


            {selectedMember && (

                <div className="modal-overlay">

                    <div className="modal">

                        <h2>
                            Give Branch Admin Permission
                        </h2>


                        <p>

                            Create an account for{" "}

                            <strong>
                                {selectedMember.first_name}{" "}
                                {selectedMember.last_name || ""}
                            </strong>

                        </p>


                        <form
                            onSubmit={handlePermission}
                        >

                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter username"
                            />


                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter password"
                            />


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    onClick={closePermission}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    Give Permission
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}