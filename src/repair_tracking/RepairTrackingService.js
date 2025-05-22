import UserService from '../services/UserService';
import config from '../config';

class RepairTrackingService {
    static axiosInstance = UserService.axiosInstance;

    // Job Management
    static async getAllJobs() {
        try {
            const response = await this.axiosInstance.get('/jobs');
            return response;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw UserService.handleError(error);
        }
    }

    static async getJobById(jobNumber) {
        try {
            const response = await this.axiosInstance.get(`/job/${jobNumber}`);
            return response;
        } catch (error) {
            console.error('Error fetching job:', error);
            throw UserService.handleError(error);
        }
    }

    static async createJob(jobData) {
        try {
            const response = await this.axiosInstance.post('/job', jobData);
            return response;
        } catch (error) {
            console.error('Error creating job:', error);
            throw UserService.handleError(error);
        }
    }

    static async updateJobStatus(jobNumber, status) {
        try {
            const response = await this.axiosInstance.put(`/job/${jobNumber}/status`, status);
            return response;
        } catch (error) {
            console.error('Error updating job status:', error);
            throw UserService.handleError(error);
        }
    }

    static async deleteJob(jobNumber) {
        try {
            const response = await this.axiosInstance.delete(`/job/${jobNumber}`);
            return response;
        } catch (error) {
            console.error('Error deleting job:', error);
            throw UserService.handleError(error);
        }
    }

    // Status mapping utilities
    static statusMap = {
        1: "In Queue",
        2: "Processing",
        3: "Repaired"
    };

    static reverseStatusMap = {
        "In Queue": 1,
        "Processing": 2,
        "Repaired": 3
    };

    static getStatusText(statusCode) {
        return this.statusMap[statusCode] || "Unknown";
    }

    static getStatusCode(statusText) {
        return this.reverseStatusMap[statusText] || 1;
    }
}

export default RepairTrackingService; 