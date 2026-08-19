import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
    createMemberByAdmin,
    getFamilyMembers
} from "../../api/memberApi";
import "./addMember.css";

export default function RootAddMember() {

    const { user } = useAuth();
    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [members, setMembers] = useState([]);

    const [form, setForm] = useState({
        relationship: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        phone: "",
        email: "",
        national_id: ""
    });

    const [loadingMembers, setLoadingMembers] = useState(true);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // LOAD FAMILY MEMBERS
    // =========================================================

    useEffect(() => {

        const loadMembers = async () => {

            if (!user?.family_id) {
                setLoadingMembers(false);
                return;
            }

            try {

                setLoadingMembers(true);

                const response =
                    await getFamilyMembers(user.family_id);

                const data =
                    response?.data?.data ||
                    response?.data ||
                    response ||
                    [];

                setMembers(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "LOAD FAMILY MEMBERS ERROR:",
                    err
                );

                setMembers([]);

            } finally {

                setLoadingMembers(false);

            }
        };

        if (user) {
            loadMembers();
        }

    }, [user]);

    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // =========================================================
    // SELECT RELATIONSHIP
    // =========================================================

    const selectRelationship = (relationship) => {

        setForm(previous => ({
            ...previous,
            relationship,
            gender:
                relationship === "PARENT"
                    ? ""
                    : previous.gender
        }));

        setError("");
        setSuccess("");
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {

        setForm({
            relationship: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            gender: "",
            date_of_birth: "",
            phone: "",
            email: "",
            national_id: ""
        });
    };

    // =========================================================
    // RELATIONSHIP DESCRIPTION
    // =========================================================

    const getRelationshipDescription = () => {

        switch (form.relationship) {

            case "CHILD":

                return (
                    "The new child will automatically be connected to you. If you have a spouse, your spouse will be connected as the other parent."
                );

            case "SPOUSE":

                return (
                    "The new person will automatically be connected to you as your spouse."
                );

            case "PARENT":

                return (
                    "Create your father or mother. Select Father or Mother below."
                );

            case "SIBLING":

                return (
                    "The new sibling will automatically receive the same father and mother as you."
                );

            case "OTHER":

                return (
                    "Add this person to the family without creating a direct parent or spouse relationship."
                );

            default:

                return (
                    "Choose a relationship first."
                );
        }
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------------------
        // USER
        // -----------------------------------------------------

        if (!user) {

            setError(
                "You must be logged in to add a family member."
            );

            return;
        }

        // -----------------------------------------------------
        // FAMILY
        // -----------------------------------------------------

        if (!user.family_id) {

            setError(
                "Family information is missing from your account."
            );

            return;
        }

        // -----------------------------------------------------
        // RELATIONSHIP
        // -----------------------------------------------------

        if (!form.relationship) {

            setError(
                "Please select a relationship."
            );

            return;
        }

        // -----------------------------------------------------
        // FIRST NAME
        // -----------------------------------------------------

        if (!form.first_name.trim()) {

            setError(
                "First name is required."
            );

            return;
        }

        // -----------------------------------------------------
        // GENDER
        // -----------------------------------------------------

        if (!form.gender) {

            setError(
                "Gender is required."
            );

            return;
        }

        // -----------------------------------------------------
        // PARENT VALIDATION
        // -----------------------------------------------------

        if (
            form.relationship === "PARENT" &&
            !["MALE", "FEMALE"].includes(form.gender)
        ) {

            setError(
                "Please select Father or Mother."
            );

            return;
        }

        // =====================================================
        // DATA
        // =====================================================

        const data = {

            family_id:
                Number(user.family_id),

            first_name:
                form.first_name.trim(),

            middle_name:
                form.middle_name.trim() || null,

            last_name:
                form.last_name.trim() || null,

            gender:
                form.gender,

            date_of_birth:
                form.date_of_birth || null,

            phone:
                form.phone.trim() || null,

            email:
                form.email.trim() || null,

            national_id:
                form.national_id.trim() || null,

            relationship:
                form.relationship
        };

        console.log(
            "CREATE MEMBER DATA:",
            data
        );

        // =====================================================
        // CREATE MEMBER
        // =====================================================

        try {

            setLoading(true);

            const response =
                await createMemberByAdmin(data);

            console.log(
                "CREATE MEMBER RESPONSE:",
                response
            );

            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                `${form.first_name} was added successfully as ${form.relationship.toLowerCase()}.`
            );

            resetForm();

            // =================================================
            // RELOAD FAMILY MEMBERS
            // =================================================

            try {

                const updatedResponse =
                    await getFamilyMembers(
                        user.family_id
                    );

                const updatedData =
                    updatedResponse?.data?.data ||
                    updatedResponse?.data ||
                    updatedResponse ||
                    [];

                setMembers(
                    Array.isArray(updatedData)
                        ? updatedData
                        : []
                );

            } catch (reloadError) {

                console.error(
                    "RELOAD MEMBERS ERROR:",
                    reloadError
                );
            }

        } catch (err) {

            console.error(
                "CREATE MEMBER ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create family member."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="add-member-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="add-member-header">

                <div>

                    <span className="page-label">
                        FAMILY ADMIN
                    </span>

                    <h1>
                        Add Family Member
                    </h1>

                    <p>
                        Add a new person to your family tree.
                    </p>

                </div>

                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                >
                    ← Back
                </button>

            </div>


            {/* =================================================
                ADMIN INFORMATION
            ================================================= */}

            <div className="admin-info-card">

                <div className="admin-info-icon">
                    👤
                </div>

                <div>

                    <strong>
                        {user?.role === "SUB_ROOT_ADMIN"
                            ? "Sub Root Admin"
                            : "Root Admin"}
                    </strong>

                    <p>
                        You are adding a member to family{" "}
                        <strong>
                            #{user?.family_id}
                        </strong>
                    </p>

                </div>

            </div>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

                <div className="form-alert error">

                    <span>
                        ⚠️
                    </span>

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {success && (

                <div className="form-alert success">

                    <span>
                        ✓
                    </span>

                    <span>
                        {success}
                    </span>

                </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="member-form"
                onSubmit={handleSubmit}
            >

                {/* =================================================
                    RELATIONSHIP
                ================================================= */}

                <section className="form-section">

                    <div className="section-heading">

                        <h2>
                            Relationship
                        </h2>

                        <p>
                            Choose how this person is connected
                            to you.
                        </p>

                    </div>


                    <div className="relationship-grid">

                        {/* CHILD */}

                        <button
                            type="button"
                            className={
                                `relationship-card ${
                                    form.relationship === "CHILD"
                                        ? "selected"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                selectRelationship("CHILD")
                            }
                            disabled={loading}
                        >

                            <span>
                                👶
                            </span>

                            <strong>
                                Child
                            </strong>

                            <small>
                                Add your child
                            </small>

                        </button>


                        {/* SPOUSE */}

                        <button
                            type="button"
                            className={
                                `relationship-card ${
                                    form.relationship === "SPOUSE"
                                        ? "selected"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                selectRelationship("SPOUSE")
                            }
                            disabled={loading}
                        >

                            <span>
                                💍
                            </span>

                            <strong>
                                Spouse
                            </strong>

                            <small>
                                Add your spouse
                            </small>

                        </button>


                        {/* PARENT */}

                        <button
                            type="button"
                            className={
                                `relationship-card ${
                                    form.relationship === "PARENT"
                                        ? "selected"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                selectRelationship("PARENT")
                            }
                            disabled={loading}
                        >

                            <span>
                                👨‍👩‍👧
                            </span>

                            <strong>
                                Parent
                            </strong>

                            <small>
                                Add father or mother
                            </small>

                        </button>


                        {/* SIBLING */}

                        <button
                            type="button"
                            className={
                                `relationship-card ${
                                    form.relationship === "SIBLING"
                                        ? "selected"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                selectRelationship("SIBLING")
                            }
                            disabled={loading}
                        >

                            <span>
                                🧑‍🤝‍🧑
                            </span>

                            <strong>
                                Sibling
                            </strong>

                            <small>
                                Add brother or sister
                            </small>

                        </button>


                        {/* OTHER */}

                        <button
                            type="button"
                            className={
                                `relationship-card ${
                                    form.relationship === "OTHER"
                                        ? "selected"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                selectRelationship("OTHER")
                            }
                            disabled={loading}
                        >

                            <span>
                                👤
                            </span>

                            <strong>
                                Other
                            </strong>

                            <small>
                                Add family member
                            </small>

                        </button>

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    {form.relationship && (

                        <div className="relationship-help">

                            <span>
                                ℹ️
                            </span>

                            <p>
                                {getRelationshipDescription()}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        PARENT TYPE
                    ================================================= */}

                    {form.relationship === "PARENT" && (

                        <div className="parent-type-grid">

                            {/* FATHER */}

                            <button
                                type="button"
                                className={
                                    `parent-type-card ${
                                        form.gender === "MALE"
                                            ? "selected"
                                            : ""
                                    }`
                                }
                                onClick={() =>
                                    setForm(previous => ({
                                        ...previous,
                                        gender: "MALE"
                                    }))
                                }
                                disabled={loading}
                            >

                                <span>
                                    👨
                                </span>

                                <strong>
                                    Father
                                </strong>

                            </button>


                            {/* MOTHER */}

                            <button
                                type="button"
                                className={
                                    `parent-type-card ${
                                        form.gender === "FEMALE"
                                            ? "selected"
                                            : ""
                                    }`
                                }
                                onClick={() =>
                                    setForm(previous => ({
                                        ...previous,
                                        gender: "FEMALE"
                                    }))
                                }
                                disabled={loading}
                            >

                                <span>
                                    👩
                                </span>

                                <strong>
                                    Mother
                                </strong>

                            </button>

                        </div>

                    )}

                </section>


                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <section className="form-section">

                    <div className="section-heading">

                        <h2>
                            Personal Information
                        </h2>

                        <p>
                            Basic information about the new
                            family member.
                        </p>

                    </div>


                    <div className="form-grid">

                        {/* FIRST NAME */}

                        <div className="form-group">

                            <label>
                                First Name *
                            </label>

                            <input
                                type="text"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                                disabled={loading}
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
                                value={form.middle_name}
                                onChange={handleChange}
                                placeholder="Enter middle name"
                                disabled={loading}
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
                                value={form.last_name}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                disabled={loading}
                            />

                        </div>


                        {/* GENDER */}

                        {form.relationship !== "PARENT" && (

                            <div className="form-group">

                                <label>
                                    Gender *
                                </label>

                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >

                                    <option value="">
                                        Select gender
                                    </option>

                                    <option value="MALE">
                                        Male
                                    </option>

                                    <option value="FEMALE">
                                        Female
                                    </option>

                                </select>

                            </div>

                        )}


                        {/* DATE OF BIRTH */}

                        <div className="form-group">

                            <label>
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="date_of_birth"
                                value={form.date_of_birth}
                                onChange={handleChange}
                                disabled={loading}
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    CONTACT INFORMATION
                ================================================= */}

                <section className="form-section">

                    <div className="section-heading">

                        <h2>
                            Contact Information
                        </h2>

                        <p>
                            Optional contact information.
                        </p>

                    </div>


                    <div className="form-grid">

                        {/* PHONE */}

                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+250..."
                                disabled={loading}
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
                                value={form.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                disabled={loading}
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
                                value={form.national_id}
                                onChange={handleChange}
                                placeholder="National ID"
                                disabled={loading}
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <section className="form-section account-info">

                    <div className="account-icon">
                        👤
                    </div>

                    <div>

                        <h3>
                            Login Account
                        </h3>

                        <p>
                            This member will be created without
                            a login account. Permission or an
                            account can be configured later.
                        </p>

                    </div>

                </section>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={
                            loading ||
                            loadingMembers
                        }
                    >

                        {loading
                            ? "Adding Member..."
                            : "Add Family Member"
                        }

                    </button>

                </div>

            </form>

        </div>
    );
}