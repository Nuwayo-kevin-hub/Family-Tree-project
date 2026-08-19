import { useEffect, useState } from "react";

import {
    getFamilyMembers,
    deleteMember,
    updateMember
} from "../../api/memberApi";

import useAuth from "../../hooks/useAuth";

import "./manageMembers.css";

export default function ManageMembers() {

    const { user } = useAuth();

    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {

        if (!user?.family_id) return;

        loadMembers();

    }, [user]);


    const loadMembers = async () => {

        try {

            const data = await getFamilyMembers(
                user.family_id
            );

            const membersData = data.data || data;
            setMembers(membersData);
            setFilteredMembers(membersData);

        }
        catch (error) {

            console.log(error);

        }
        finally {

            setLoading(false);

        }

    };


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
                   (member.email && member.email.toLowerCase().includes(query)) ||
                   (member.phone && member.phone.includes(query)) ||
                   (member.role && member.role.toLowerCase().includes(query));
        });

        setFilteredMembers(filtered);

    };


    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this member?"
        );

        if (!confirmDelete) return;

        try {

            await deleteMember(id);

            const updatedMembers = members.filter(
                member => member.id !== id
            );
            setMembers(updatedMembers);
            setFilteredMembers(updatedMembers);

        }
        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete member"
            );

        }

    };


    // =========================
    // OPEN UPDATE FORM
    // =========================

    const handleEdit = (member) => {

        setEditingMember({
            ...member
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =========================
    // CLOSE UPDATE
    // =========================

    const handleCancelEdit = () => {

        setEditingMember(null);

    };


    // =========================
    // HANDLE FORM
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setEditingMember(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================
    // SAVE UPDATE
    // =========================

    const handleUpdate = async (e) => {

        e.preventDefault();

        if (!editingMember) return;

        setSaving(true);

        try {

            const response = await updateMember(
                editingMember.id,
                {
                    first_name: editingMember.first_name,
                    middle_name: editingMember.middle_name,
                    last_name: editingMember.last_name,
                    gender: editingMember.gender,
                    date_of_birth: editingMember.date_of_birth,
                    phone: editingMember.phone,
                    email: editingMember.email,
                    national_id: editingMember.national_id,
                    father_id: editingMember.father_id,
                    mother_id: editingMember.mother_id,
                    spouse_id: editingMember.spouse_id,
                    role: editingMember.role,
                    is_alive: editingMember.is_alive
                }
            );


            const updatedMembers = members.map(member =>
                member.id === editingMember.id
                    ? { ...member, ...editingMember }
                    : member
            );
            setMembers(updatedMembers);
            setFilteredMembers(updatedMembers);


            alert(
                response?.message ||
                "Member updated successfully"
            );

            setEditingMember(null);

        }
        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update member"
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


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        👨‍👩‍👧 Manage Members
                    </h1>

                    <p>
                        View and manage all family members.
                    </p>

                </div>

                {/* =====================================
                    SEARCH BAR
                ===================================== */}

                <div className="header-search">

                    <input
                        type="text"
                        placeholder="🔍 Search members..."
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


            {/* =====================================
                UPDATE FORM
                ONLY SHOW WHEN UPDATE IS CLICKED
            ===================================== */}

            {editingMember && (

                <div className="member-form-card">

                    <div className="form-header">

                        <div>

                            <h2>
                                ✏️ Update Member
                            </h2>

                            <p>
                                Update all member information.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="close-btn"
                            onClick={handleCancelEdit}
                        >
                            ✕
                        </button>

                    </div>


                    <form onSubmit={handleUpdate}>


                        <div className="form-grid">


                            {/* FIRST NAME */}

                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="first_name"
                                    value={
                                        editingMember.first_name || ""
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* MIDDLE NAME */}

                            <div className="form-group">

                                <label>
                                    Middle Name
                                </label>

                                <input
                                    type="text"
                                    name="middle_name"
                                    value={
                                        editingMember.middle_name || ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* LAST NAME */}

                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="last_name"
                                    value={
                                        editingMember.last_name || ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* GENDER */}

                            <div className="form-group">

                                <label>
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={
                                        editingMember.gender || ""
                                    }
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Gender
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                </select>

                            </div>


                            {/* DATE OF BIRTH */}

                            <div className="form-group">

                                <label>
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={
                                        editingMember.date_of_birth
                                            ? editingMember.date_of_birth.substring(0, 10)
                                            : ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* PHONE */}

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        editingMember.phone || ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        editingMember.email || ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* NATIONAL ID */}

                            <div className="form-group">

                                <label>
                                    National ID
                                </label>

                                <input
                                    type="text"
                                    name="national_id"
                                    value={
                                        editingMember.national_id || ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* FATHER */}

                            <div className="form-group">

                                <label>
                                    Father ID
                                </label>

                                <input
                                    type="number"
                                    name="father_id"
                                    value={
                                        editingMember.father_id || ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* MOTHER */}

                            <div className="form-group">

                                <label>
                                    Mother ID
                                </label>

                                <input
                                    type="number"
                                    name="mother_id"
                                    value={
                                        editingMember.mother_id || ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* SPOUSE */}

                            <div className="form-group">

                                <label>
                                    Spouse ID
                                </label>

                                <input
                                    type="number"
                                    name="spouse_id"
                                    value={
                                        editingMember.spouse_id || ""
                                    }
                                    onChange={handleChange}
                                />

                            </div>


                            {/* ROLE */}

                            <div className="form-group">

                                <label>
                                    Role
                                </label>

                                <select
                                    name="role"
                                    value={
                                        editingMember.role || "MEMBER"
                                    }
                                    onChange={handleChange}
                                >

                                    <option value="MEMBER">
                                        MEMBER
                                    </option>

                                    <option value="SUB_ROOT_ADMIN">
                                        SUB_ROOT_ADMIN
                                    </option>

                                    <option value="ROOT_ADMIN">
                                        ROOT_ADMIN
                                    </option>

                                </select>

                            </div>


                            {/* ALIVE */}

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="is_alive"
                                    value={
                                        editingMember.is_alive
                                            ? "true"
                                            : "false"
                                    }
                                    onChange={(e) =>
                                        setEditingMember(prev => ({
                                            ...prev,
                                            is_alive:
                                                e.target.value === "true"
                                        }))
                                    }
                                >

                                    <option value="true">
                                        Alive
                                    </option>

                                    <option value="false">
                                        Deceased
                                    </option>

                                </select>

                            </div>


                        </div>


                        {/* FORM ACTIONS */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>


                    </form>

                </div>

            )}


            {/* =====================================
                MEMBERS TABLE
            ===================================== */}

            <div className="members-table">

                <table>

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Gender</th>

                            <th>Role</th>

                            <th>Phone</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredMembers.length > 0 ?

                            filteredMembers.map(member => (

                                <tr key={member.id}>

                                    <td>
                                        {member.first_name}{" "}
                                        {member.middle_name || ""}{" "}
                                        {member.last_name || ""}
                                    </td>

                                    <td>
                                        {member.gender}
                                    </td>

                                    <td>
                                        <span className={`role role-${member.role.toLowerCase().replace(/_/g, "-")}`}>
                                            {member.role}
                                        </span>
                                    </td>

                                    <td>
                                        {member.phone || "-"}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                member.is_alive
                                                    ? "status-alive"
                                                    : "status-deceased"
                                            }
                                        >

                                            {member.is_alive
                                                ? "Alive"
                                                : "Deceased"}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="table-actions">

                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    handleEdit(member)
                                                }
                                            >
                                                Update
                                            </button>


                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(member.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td colSpan="6">
                                    {searchQuery
                                        ? `No members found matching "${searchQuery}"`
                                        : "No members found"
                                    }
                                </td>

                            </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}