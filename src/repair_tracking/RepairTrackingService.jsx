const BASE_URL = '/api/jobs';

const getToken = () => localStorage.getItem('token');

const handleErrorResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
    } else {
        const errorText = await response.text();
        try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || 'An error occurred');
        } catch {
            throw new Error(errorText || 'An error occurred');
        }
    }
};

export const getAllJobs = async () => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            await handleErrorResponse(res);
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const createJob = async (jobData) => {
    try {
        const res = await fetch(`${BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(jobData)
        });
        if (!res.ok) {
            await handleErrorResponse(res);
        }
        return res.json();
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

export const updateJobStatus = async (jobNumber, status) => {
    try {
        const res = await fetch(`${BASE_URL}/update/${jobNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ status })
        });
        if (!res.ok) {
            await handleErrorResponse(res);
        }
        return res.json();
    } catch (error) {
        console.error('Error updating job status:', error);
        throw error;
    }
};

export const deleteJob = async (jobNumber) => {
    try {
        const res = await fetch(`${BASE_URL}/delete/${jobNumber}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (!res.ok) {
            await handleErrorResponse(res);
        }
        return res.json();
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
};

export const getJobById = async (jobNumber) => {
    try {
        const res = await fetch(`${BASE_URL}/public/${jobNumber}`);
        if (!res.ok) {
            await handleErrorResponse(res);
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching job:', error);
        throw error;
    }
}; 