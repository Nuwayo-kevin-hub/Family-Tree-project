import { useEffect, useState } from "react";

import {
    getFamilyMembers,
    givePermission
} from "../../api/memberApi";

import useAuth from "../../hooks/useAuth";

import "./givePermission.css";


export default function GivePermission() {

    const { user } = useAuth();

    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedMember, setSelectedMember] = useState(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {

        if (!user?.family_id) {
            setLoading(false);
            return;
        }


        const loadMembers = async () => {

            try {

                const response =
                    await getFamilyMembers(user.family_id);


                const data =
                    response?.data || response || [];


                /*
                    Only children should receive permission.

                    A child is identified by having
                    father_id or mother_id.
                */

                const children = data.filter(member =>
                    member.id !== user.id &&
                    (
                        member.father_id !== null ||
                        member.mother_id !== null
                    )
                );


                setMembers(children);
                setFilteredMembers(children);

            }
            catch (err) {

                console.log(err);

                setError(
                    err?.response?.data?.message ||
                    "Failed to load family members."
                );

            }
            finally {

                setLoading(false);

            }

        };


        loadMembers();

    }, [user]);


    // =========================
    // SEARCH
    // =========================

    const handleSearch = (e) => {

        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredMembers(members);
            return;
        }

        const filtered = members.filter(member => {
            const fullName = `${member.first_name || ''} ${member.middle_name || ''} ${member.last_name || ''}`.toLowerCase();
            return fullName.includes(query) ||
                   (member.gender && member.gender.toLowerCase().includes(query)) ||
                   (member.role && member.role.toLowerCase().includes(query));
        });

        setFilteredMembers(filtered);

    };


    const openPermission = (member) => {

        setSelectedMember(member);

        setUsername(
            member.username || ""
        );

        setPassword("");

        setConfirmPassword("");

        setMessage("");

        setError("");

    };


    const closePermission = () => {

        setSelectedMember(null);

        setUsername("");

        setPassword("");

        setConfirmPassword("");

        setMessage("");

        setError("");

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!selectedMember) {

            setError("Please select a member.");

            return;

        }


        if (!username.trim()) {

            setError("Username is required.");

            return;

        }


        if (!password) {

            setError("Password is required.");

            return;

        }


        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;

        }


        try {

            setSaving(true);


            /*
                Give permission.

                Backend should:
                1. create the account
                2. save username/password
                3. change MEMBER -> SUB_ROOT_ADMIN
                4. activate the account
            */

            const response = await givePermission(
                selectedMember.id,
                {
                    username,
                    password
                }
            );


            setMessage(
                response?.message ||
                response?.data?.message ||
                "Permission granted successfully."
            );


            /*
                Remove the member from this list because
                they are no longer an ordinary child.
            */

            const updatedMembers = members.filter(
                member => member.id !== selectedMember.id
            );
            setMembers(updatedMembers);
            setFilteredMembers(updatedMembers);


            setTimeout(() => {

                closePermission();

            }, 1200);

        }
        catch (err) {

            console.log(err);

            setError(
                err?.response?.data?.message ||
                "Failed to give permission."
            );

        }
        finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (

            <div className="manage-members">

                <h2>
                    Loading members...
                </h2>

            </div>

        );

    }


    return (

        <div className="manage-members">


            <div className="page-header">

                <div>

                    <h1>
                        🔑 Give Permission
                    </h1>

                    <p>
                        Give a child permission to become a Sub Root Admin.
                    </p>

                </div>

                {/* =====================================
                    SEARCH BAR
                ===================================== */}

                <div className="header-search">

                    <input
                        type="text"
                        placeholder="🔍 Search children..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />

                    {searchQuery && (
                        <span className="search-result-count">
                            {filteredMembers.length} result{filteredMembers.length !== 1 ? 's' : ''}
                        </span>
                    )}

                </div>

            </div>


            {message && (

                <div className="success-message">

                    {message}

                </div>

            )}


            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {!selectedMember && (

                <div className="members-table">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Gender
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Father
                                </th>

                                <th>
                                    Mother
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredMembers.length > 0 ? (

                                filteredMembers.map(member => (

                                    <tr key={member.id}>

                                        <td>

                                            {member.first_name}{" "}

                                            {member.middle_name || ""}{" "}

                                            {member.last_name || ""}

                                        </td>


                                        <td>
                                            {member.gender || "-"}
                                        </td>


                                        <td>

                                            <span className={`role role-${member.role.toLowerCase().replace(/_/g, "-")}`}>
                                                {member.role}
                                            </span>

                                        </td>


                                        <td>
                                            {member.father_id || "-"}
                                        </td>


                                        <td>
                                            {member.mother_id || "-"}
                                        </td>


                                        <td>

                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    openPermission(member)
                                                }
                                            >
                                                🔑 Give Permission
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="6">

                                        {searchQuery
                                            ? `No children found matching "${searchQuery}"`
                                            : "No children available for permission."
                                        }

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            )}


            {selectedMember && (

                <div className="permission-form">

                    <div className="page-header">

                        <h1>
                            🔑 Give Permission
                        </h1>

                        <p>

                            Account for{" "}

                            <strong>
                                {selectedMember.first_name}{" "}
                                {selectedMember.last_name}
                            </strong>

                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>


                        <div className="form-group">

                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                placeholder="Enter username"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter password"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm password"
                                required
                            />

                        </div>


                        <div className="form-actions">

                            <button
                                type="submit"
                                className="view-btn"
                                disabled={saving}
                            >

                                {saving
                                    ? "Giving Permission..."
                                    : "Give Permission"
                                }

                            </button>


                            <button
                                type="button"
                                className="delete-btn"
                                onClick={closePermission}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                        </div>


                    </form>

                </div>

            )}

        </div>

    );

}