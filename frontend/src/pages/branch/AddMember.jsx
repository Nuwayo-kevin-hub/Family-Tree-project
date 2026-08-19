import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { createMemberByAdmin } from "../../api/memberApi";
import "./addMember.css";

export default function AddMember() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        relationship: "CHILD",
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        phone: "",
        email: "",
        national_id: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // RELATIONSHIP
    // ONLY CHILD + SPOUSE
    // =====================================================

    const selectRelationship = (relationship) => {
        setForm((prev) => ({
            ...prev,
            relationship
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // RESET
    // =====================================================

    const resetForm = () => {
        setForm({
            relationship: "CHILD",
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

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // =================================================
        // USER
        // =================================================

        if (!user) {
            setError("You must be logged in.");
            return;
        }

        // =================================================
        // ROLE
        // =================================================

        if (user.role !== "SUB_ROOT_ADMIN") {
            setError(
                "Only Sub Root Admin can use this page."
            );
            return;
        }

        // =================================================
        // FAMILY ID
        //
        // IMPORTANT:
        // We do NOT ask the admin to enter family_id.
        //
        // We take it from the logged-in user.
        // =================================================

        if (!user.family_id) {
            console.error(
                "Logged-in USER has no family_id:",
                user
            );

            setError(
                "Your account does not contain family information."
            );

            return;
        }

        // =================================================
        // RELATIONSHIP
        // =================================================

        if (
            !["CHILD", "SPOUSE"].includes(
                form.relationship
            )
        ) {
            setError(
                "Sub Root Admin can only add Child or Spouse."
            );

            return;
        }

        // =================================================
        // FIRST NAME
        // =================================================

        if (!form.first_name.trim()) {
            setError("First name is required.");
            return;
        }

        // =================================================
        // GENDER
        // =================================================

        if (!form.gender) {
            setError("Gender is required.");
            return;
        }

        // =================================================
        // DATA
        // =================================================
        //
        // family_id is NOT entered by the user.
        //
        // It comes from the logged-in account.
        //
        // Backend already checks:
        //
        // data.family_id === admin.family_id
        //
        // =================================================

        const data = {
            family_id: Number(user.family_id),

            first_name:
                form.first_name.trim(),

            middle_name:
                form.middle_name.trim() || null,

            last_name:
                form.last_name.trim() || null,

            gender:
                form.gender
                    .trim()
                    .toUpperCase(),

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

        // =================================================
        // DEBUG
        // =================================================

        console.log(
            "======================================"
        );

        console.log(
            "SUB ROOT ADMIN ADD MEMBER"
        );

        console.log(
            "LOGGED USER:",
            user
        );

        console.log(
            "LOGGED USER FAMILY ID:",
            user.family_id
        );

        console.log(
            "DATA SENT TO /members/add:",
            data
        );

        console.log(
            "RELATIONSHIP:",
            form.relationship
        );

        console.log(
            "======================================"
        );

        // =================================================
        // CREATE MEMBER
        // =================================================

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

        } catch (err) {
            console.error(
                "CREATE MEMBER ERROR:",
                err
            );

            console.error(
                "BACKEND RESPONSE:",
                err?.response?.data
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to create family member.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="add-member-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="add-member-header">

                <div>

                    <span className="page-label">
                        SUB ROOT ADMIN
                    </span>

                    <h1>
                        Add Family Member
                    </h1>

                    <p>
                        Add your child or spouse to
                        your family tree.
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
                ADMIN INFO
            ================================================= */}

            <div className="admin-info-card">

                <div className="admin-info-icon">
                    👤
                </div>

                <div>

                    <strong>
                        Sub Root Admin
                    </strong>

                    <p>
                        Logged in as{" "}
                        <strong>
                            {user?.username ||
                                user?.full_name ||
                                "Admin"}
                        </strong>
                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
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


            {/* =================================================
                SUCCESS
            ================================================= */}

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
                            Sub Root Admin can only add
                            a child or spouse.
                        </p>

                    </div>


                    <div className="relationship-grid">

                        {/* =================================================
                            CHILD
                        ================================================= */}

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


                        {/* =================================================
                            SPOUSE
                        ================================================= */}

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

                    </div>


                    {/* =================================================
                        HELP
                    ================================================= */}

                    <div className="relationship-help">

                        <span>
                            ℹ️
                        </span>

                        <p>

                            {form.relationship === "CHILD"
                                ? "The new child will automatically be connected to you. If you have a spouse, the backend will connect your spouse as the other parent."

                                : "The new person will automatically be connected to you as your spouse."
                            }

                        </p>

                    </div>

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
                    CONTACT
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
                    ACCOUNT INFO
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
                            The new member will be created
                            without a login account. An
                            account can be created later
                            through permission management.
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
                        disabled={loading}
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