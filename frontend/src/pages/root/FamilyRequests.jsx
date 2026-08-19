
import { useEffect, useState } from "react";

import {
    getPendingRequests,
    approveRequest,
    rejectRequest
} from "../../api/requestApi";

import "./familyRequests.css";


export default function FamilyRequests() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [processingId, setProcessingId] = useState(null);


    // ==========================================
    // LOAD PENDING REQUESTS
    // ==========================================

    const loadRequests = async () => {

        try {

            setLoading(true);

            const response = await getPendingRequests();

            console.log("FAMILY REQUESTS:", response);

            /*
             * Backend should already return only requests
             * belonging to the logged-in ROOT_ADMIN family.
             *
             * Example backend query:
             *
             * WHERE family_id = req.user.family_id
             *
             * Therefore this component does NOT need to
             * send or select a family_id.
             */

            const data =
                response?.data ??
                response ??
                [];

            setRequests(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (error) {

            console.error(
                "Family Requests Error:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
            );

            setRequests([]);

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadRequests();

    }, []);


    // ==========================================
    // APPROVE
    // ==========================================

    const handleApprove = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to approve this family request?"
        );

        if (!confirmed) {
            return;
        }


        try {

            setProcessingId(id);

            await approveRequest(id);


            setRequests(prev =>
                prev.filter(
                    request => request.id !== id
                )
            );


            alert(
                "Family request approved successfully."
            );

        }
        catch (error) {

            console.error(
                "Approve Error:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                "Failed to approve request."
            );

        }
        finally {

            setProcessingId(null);

        }

    };


    // ==========================================
    // REJECT
    // ==========================================

    const handleReject = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to reject this family request?"
        );

        if (!confirmed) {
            return;
        }


        try {

            setProcessingId(id);

            await rejectRequest(id);


            setRequests(prev =>
                prev.filter(
                    request => request.id !== id
                )
            );


            alert(
                "Family request rejected successfully."
            );

        }
        catch (error) {

            console.error(
                "Reject Error:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                "Failed to reject request."
            );

        }
        finally {

            setProcessingId(null);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="family-requests-page">

                <div className="page-header">

                    <div>

                        <h1>
                            📩 Family Requests
                        </h1>

                        <p>
                            Loading family requests...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="family-requests-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        📩 Family Requests
                    </h1>

                    <p>
                        Review requests from people
                        looking for their family.
                    </p>

                </div>


                <div className="request-count">

                    <strong>
                        {requests.length}
                    </strong>

                    <span>
                        Pending
                    </span>

                </div>

            </div>


            {/* ==================================
                REQUESTS
            ================================== */}

            <div className="requests-container">


                {requests.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📭
                        </div>

                        <h2>
                            No Pending Requests
                        </h2>

                        <p>
                            There are currently no family
                            requests waiting for approval.
                        </p>

                    </div>

                ) : (

                    requests.map(request => (

                        <div
                            className="request-card"
                            key={request.id}
                        >


                            {/* =========================
                                TOP
                            ========================= */}

                            <div className="request-info">


                                <div className="request-title">

                                    <div>

                                        <h2>
                                            {request.requester_name ||
                                                "Unknown Person"}
                                        </h2>

                                        <span className="request-id">
                                            Request #{request.id}
                                        </span>

                                    </div>


                                    <span className="status pending">
                                        {request.status ||
                                            "PENDING"}
                                    </span>

                                </div>


                                {/* =========================
                                    PERSON INFORMATION
                                ========================= */}

                                <div className="request-details">


                                    <div>

                                        <label>
                                            👤 Full Name
                                        </label>

                                        <p>
                                            {request.requester_name ||
                                                "Not provided"}
                                        </p>

                                    </div>


                                    <div>

                                        <label>
                                            📱 Phone
                                        </label>

                                        <p>
                                            {request.requester_phone ||
                                                "Not provided"}
                                        </p>

                                    </div>


                                    <div>

                                        <label>
                                            📧 Email
                                        </label>

                                        <p>
                                            {request.requester_email ||
                                                "Not provided"}
                                        </p>

                                    </div>


                                    <div>

                                        <label>
                                            📅 Requested
                                        </label>

                                        <p>

                                            {request.created_at
                                                ? new Date(
                                                    request.created_at
                                                ).toLocaleString()
                                                : "Not available"}

                                        </p>

                                    </div>


                                    <div>

                                        <label>
                                            📊 Status
                                        </label>

                                        <p>
                                            {request.status ||
                                                "PENDING"}
                                        </p>

                                    </div>


                                    <div>

                                        <label>
                                            🆔 Request ID
                                        </label>

                                        <p>
                                            {request.id}
                                        </p>

                                    </div>


                                    {/* =================================
                                        FAMILY ID
                                        ================================= */}

                                    <div>

                                        <label>
                                            👨‍👩‍👧‍👦 Family ID
                                        </label>

                                        <p>
                                            {request.family_id ||
                                                "Not provided"}
                                        </p>

                                    </div>


                                </div>


                                {/* =========================
                                    MESSAGE
                                ========================= */}

                                <div className="request-message">

                                    <label>
                                        💬 Message
                                    </label>


                                    <p>

                                        {request.message ||
                                            "No message provided."}

                                    </p>

                                </div>


                            </div>


                            {/* =========================
                                ACTIONS
                            ========================= */}

                            <div className="request-actions">


                                <button
                                    className="approve-btn"

                                    disabled={
                                        processingId ===
                                        request.id
                                    }

                                    onClick={() =>
                                        handleApprove(
                                            request.id
                                        )
                                    }
                                >

                                    {processingId ===
                                    request.id
                                        ? "Processing..."
                                        : "✓ Approve"}

                                </button>


                                <button
                                    className="reject-btn"

                                    disabled={
                                        processingId ===
                                        request.id
                                    }

                                    onClick={() =>
                                        handleReject(
                                            request.id
                                        )
                                    }
                                >

                                    {processingId ===
                                    request.id
                                        ? "Processing..."
                                        : "✕ Reject"}

                                </button>


                            </div>


                        </div>

                    ))

                )}


            </div>


        </div>

    );

}