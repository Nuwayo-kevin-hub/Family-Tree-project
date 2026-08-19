// frontend/src/api/requestApi.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ============================================================
// SEARCH FAMILIES (Public)
// ============================================================

export const searchFamilies = async (query) => {
    const response = await axios.get(`${API_URL}/requests/search`, {
        params: { query }
    });
    return response.data;
};

// ============================================================
// SUBMIT FAMILY REQUEST (Public)
// ============================================================

export const submitFamilyRequest = async (data) => {
    const response = await axios.post(`${API_URL}/requests`, {
        family_id: data.family_id,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        description: data.description
    });
    return response.data;
};

// ============================================================
// GET REQUESTS FOR ROOT ADMIN (Authenticated)
// ============================================================

export const getRequestsForRootAdmin = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/requests/my-requests`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ============================================================
// GET PENDING REQUESTS (Authenticated)
// ============================================================

export const getPendingRequests = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/requests/pending/list`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ============================================================
// GET UNVIEWED PENDING REQUESTS (Authenticated)
// ============================================================

export const getUnviewedPendingRequests = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/requests/pending/unviewed`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ============================================================
// GET REQUEST BY ID (Authenticated)
// ============================================================

export const getRequestById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/requests/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ============================================================
// APPROVE REQUEST (Authenticated)
// ============================================================

export const approveRequest = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
        `${API_URL}/requests/${id}/approve`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

// ============================================================
// REJECT REQUEST (Authenticated)
// ============================================================

export const rejectRequest = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
        `${API_URL}/requests/${id}/reject`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

// ============================================================
// MARK REQUEST AS VIEWED (Authenticated)
// ============================================================

export const markRequestViewed = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
        `${API_URL}/requests/${id}/view`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};