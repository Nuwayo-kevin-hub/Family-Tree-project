import { useState } from "react";
import {
    searchFamilies,
    submitFamilyRequest
} from "../api/requestApi";
import "./FamilyRequest.css";

export default function FamilyRequest() {
    const [familyName, setFamilyName] = useState("");
    const [families, setFamilies] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [searching, setSearching] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==================================================
    // SEARCH FAMILY
    // ==================================================

    const handleSearchFamily = async () => {
        setError("");
        setSuccess("");
        setSelectedFamily(null);

        if (!familyName.trim()) {
            setError("Please enter a family name.");
            return;
        }

        try {
            setSearching(true);
            const response = await searchFamilies(familyName.trim());

            console.log("SEARCH RESPONSE:", response);

            // Handle different response formats
            const results = response?.families || response?.data || response || [];

            setFamilies(Array.isArray(results) ? results : []);

            if (!results || results.length === 0) {
                setError("No family was found with that name.");
            }
        } catch (err) {
            console.error("Family search error:", err);
            setFamilies([]);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to search family."
            );
        } finally {
            setSearching(false);
        }
    };

    // ==================================================
    // SELECT FAMILY
    // ==================================================

    const handleSelectFamily = (family) => {
        setSelectedFamily(family);
        setFamilies([]);
        setFamilyName(family.family_name);
        setError("");
    };

    // ==================================================
    // SUBMIT REQUEST
    // ==================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!selectedFamily) {
            setError("Please search and select the family you belong to.");
            return;
        }

        if (!fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!phone.trim() && !email.trim()) {
            setError("Please provide your phone or email.");
            return;
        }

        // Validate email format if provided
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            setSubmitting(true);

            const requestData = {
                family_id: selectedFamily.id,
                full_name: fullName.trim(),
                phone: phone.trim() || null,
                email: email.trim() || null,
                description: message.trim() || null
            };

            console.log("SENDING FAMILY REQUEST:", requestData);

            const response = await submitFamilyRequest(requestData);

            console.log("SUBMIT RESPONSE:", response);

            setSuccess(
                response?.message ||
                "Your family request has been sent successfully."
            );

            // RESET FORM
            setFamilyName("");
            setFamilies([]);
            setSelectedFamily(null);
            setFullName("");
            setPhone("");
            setEmail("");
            setMessage("");

        } catch (err) {
            console.error("Create family request error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to send family request."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ==================================================
    // RESET SEARCH
    // ==================================================

    const handleResetSearch = () => {
        setFamilyName("");
        setFamilies([]);
        setSelectedFamily(null);
        setError("");
        setSuccess("");
    };

    return (
        <div className="family-request-page">
            <div className="family-request-card">

                {/* HEADER */}
                <div className="family-request-header">
                    <h1>🔍 Find Your Family</h1>
                    <p>
                        Search for your family by name and send your details 
                        to the family administrator to reconnect.
                    </p>
                </div>

                {/* ======================================
                    FAMILY SEARCH
                ====================================== */}
                <div className="family-search-section">
                    <label>Search for Your Family</label>

                    <div className="family-search-box">
                        <input
                            type="text"
                            value={familyName}
                            placeholder="Enter family name..."
                            onChange={(e) => {
                                setFamilyName(e.target.value);
                                setSelectedFamily(null);
                                setFamilies([]);
                                setError("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSearchFamily();
                                }
                            }}
                            disabled={searching}
                        />

                        <button
                            type="button"
                            onClick={handleSearchFamily}
                            disabled={searching}
                            className="search-btn"
                        >
                            {searching ? "Searching..." : "🔍 Search"}
                        </button>

                        {selectedFamily && (
                            <button
                                type="button"
                                onClick={handleResetSearch}
                                className="clear-btn"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* SEARCH RESULTS */}
                    {families.length > 0 && (
                        <div className="family-search-results">
                            <p className="results-label">
                                Found {families.length} family{ families.length > 1 ? 'ies' : '' }
                            </p>
                            {families.map((family) => (
                                <button
                                    type="button"
                                    key={family.id}
                                    className="family-result"
                                    onClick={() => handleSelectFamily(family)}
                                >
                                    <strong>{family.family_name}</strong>
                                    {family.family_origin && (
                                        <span>📍 {family.family_origin}</span>
                                    )}
                                    {family.family_description && (
                                        <small>{family.family_description}</small>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* SELECTED FAMILY */}
                    {selectedFamily && (
                        <div className="selected-family">
                            <span className="selected-label">✅ Selected Family:</span>
                            <strong>{selectedFamily.family_name}</strong>
                            {selectedFamily.family_origin && (
                                <span className="selected-origin">
                                    📍 {selectedFamily.family_origin}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ======================================
                    ALERTS
                ====================================== */}
                {error && (
                    <div className="request-error">
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div className="request-success">
                        ✅ {success}
                    </div>
                )}

                {/* ======================================
                    REQUEST FORM
                ====================================== */}
                <form onSubmit={handleSubmit} className="family-request-form">

                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            value={fullName}
                            placeholder="Enter your full name"
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={submitting}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                placeholder="Phone number"
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Details / Message</label>
                        <textarea
                            value={message}
                            placeholder="Tell the family administrator anything that can help identify you..."
                            rows={5}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={submitting}
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-request-btn"
                        disabled={submitting || !selectedFamily}
                    >
                        {submitting ? "⏳ Sending..." : "📩 Send Family Request"}
                    </button>

                </form>

            </div>
        </div>
    );
}