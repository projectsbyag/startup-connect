/**
 * API Service - Handles all API requests
 */
class ApiService {
    constructor() {
        // API base URL - change this to your actual backend URL in production
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api`
            : 'https://startup-connect-7y5d.onrender.com/api';
        this.token = localStorage.getItem('token') || null;
    }

    /**
     * Set authentication token
     * @param {string} token - JWT token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    /**
     * Get request headers
     * @returns {Object} - Headers object
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Handle API response
     * @param {Response} response - Fetch API response
     * @returns {Promise} - Parsed response data
     */
    async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            // If response includes a message, use it for the error
            const errorMessage = data.message || 'An error occurred';
            
            // If token is invalid or expired, clear it
            if (response.status === 401) {
                this.setToken(null);
            }
            
            throw new Error(errorMessage);
        }

        return data;
    }

    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Response data
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`GET request to ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request payload
     * @returns {Promise} - Response data
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`POST request to ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Make a PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request payload
     * @returns {Promise} - Response data
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`PUT request to ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Make a DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} - Response data
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`DELETE request to ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Upload a file
     * @param {string} endpoint - API endpoint
     * @param {FormData} formData - Form data with file
     * @returns {Promise} - Response data
     */
    async uploadFile(endpoint, formData) {
        try {
            const headers = {};
            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`File upload to ${endpoint} failed:`, error);
            throw error;
        }
    }
    
    // Authentication endpoints
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - Response with user and token
     */
    async register(userData) {
        return this.post('/users/register', userData);
    }
    
    /**
     * Login a user
     * @param {Object} credentials - Login credentials
     * @returns {Promise} - Response with user and token
     */
    async login(credentials) {
        return this.post('/users/login', credentials);
    }
    
    /**
     * Get current user profile
     * @returns {Promise} - User data
     */
    async getCurrentUser() {
        return this.get('/users/me');
    }
    
    /**
     * Update user profile
     * @param {Object} userData - Updated user data
     * @returns {Promise} - Updated user data
     */
    async updateProfile(userData) {
        return this.put('/users/me', userData);
    }
    
    /**
     * Change password
     * @param {Object} passwordData - Old and new password
     * @returns {Promise} - Success message
     */
    async changePassword(passwordData) {
        return this.put('/users/change-password', passwordData);
    }
    
    // Startup endpoints
    
    /**
     * Get all startups
     * @param {Object} filters - Optional filter parameters
     * @returns {Promise} - List of startups
     */
    async getStartups(filters = {}) {
        let queryString = '';
        
        if (Object.keys(filters).length > 0) {
            queryString = '?' + new URLSearchParams(filters).toString();
        }
        
        return this.get(`/startups${queryString}`);
    }
    async createStartup(startupData) {
    try {
        let existingStartup = null;
        try {
            existingStartup = await this.get('/startups/user/current');
        } catch (error) {
            // Only log unexpected errors
            if (!error.message.includes('No startup profile found')) {
                console.error('API Error:', error);
                throw error;
            }
            // Suppress "No startup profile found" error
        }

        if (existingStartup && existingStartup.success && existingStartup.data) {
            // Update existing profile
            const response = await this.put(`/startups/${existingStartup.data._id}`, startupData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to update startup');
            }
            return response.data;
        } else {
            // Create new profile
            const response = await this.post('/startups/create', startupData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to create startup');
            }
            return response.startup || response.data;
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
    /**
     * Get a specific startup
     * @param {string} id - Startup ID
     * @returns {Promise} - Startup data
     */
    async getStartup(startupId) {
        return this.get(`/startups/${startupId}`);
    }

    /**
     * Get startup by user ID
     * @param {string} userId - User ID
     * @returns {Promise} - Startup data
     */
    async getStartupByUserId(userId) {
    try {
        const response = await this.get(`/startups/user/${userId}`);
        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch startup profile');
        }
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
    async updateStartup(startupId, startupData) {
    try {
        const response = await this.put(`/startups/${startupId}`, startupData);
        if (!response.success) {
            throw new Error(response.message || 'Failed to update startup profile');
        }
        return response.startup;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
    
    /**
     * Create or update startup profile
     * @param {Object} startupData - Startup profile data
     * @returns {Promise} - Created/updated startup data
     */

    /**
     * Create a new message
     * @param {Object} messageData - Message data
     * @returns {Promise} - Created message
     */
    async createMessage(messageData) {
        return this.post('/messages', messageData);
    }
async saveInvestor(investorId) {
    return this.post('/investors/save-investor', { investorId });
}
async removeSavedInvestor(investorId) {
    return this.post('/investors/remove-saved-investor', { investorId });
}
async saveStartup(startupId) {
    return this.post('/startups/save-startup', { startupId });
}
async removeSavedStartup(startupId) {
    return this.post('/startups/remove-saved-startup', { startupId });
}
    
    /**
     * Upload startup document
     * @param {FormData} formData - Form data with file
     * @returns {Promise} - Document data
     */
    async uploadStartupDocument(formData) {
        return this.uploadFile('/startups/documents', formData);
    }
    
    // Investor endpoints
    
    /**
     * Get all investors
     * @param {Object} filters - Optional filter parameters
     * @returns {Promise} - List of investors
     */
    async getInvestors(filters = {}) {
        let queryString = '';
        
        if (Object.keys(filters).length > 0) {
            queryString = '?' + new URLSearchParams(filters).toString();
        }
        
        return this.get(`/investors${queryString}`);
    }
    
    /**
     * Get a specific investor
     * @param {string} id - Investor ID
     * @returns {Promise} - Investor data
     */
    async getInvestor(investorId) {
        try {
            console.log('Fetching investor:', investorId);
            const response = await this.get(`/investors/${investorId}`);
            
            if (!response || !response.investor) {
                throw new Error('Invalid investor data received');
            }
            
            return response;
        } catch (error) {
            console.error('Error fetching investor:', error);
            throw error;
        }
    }

    /**
     * Get investor by user ID
     * @param {string} userId - User ID
     * @returns {Promise} - Investor data
     */
    async getInvestorByUserId(userId) {
        return this.get(`/investors/user/${userId}`);
    }
    
    /**
     * Create or update investor profile
     * @param {Object} investorData - Investor profile data
     * @returns {Promise} - Created/updated investor data
     */
    async saveInvestorProfile(investorData) {
        if (investorData._id) {
            return this.put(`/investors/${investorData._id}`, investorData);
        } else {
            return this.post('/investors', investorData);
        }
    }
    
    // Message endpoints
    
    /**
     * Get all conversations
     * @returns {Promise} - List of conversations
     */
    async getConversations() {
        return this.get('/messages/conversations');
    }
    
    /**
     * Get messages for a specific conversation
     * @param {string} conversationId - Conversation ID
     * @returns {Promise} - List of messages
     */
    async getMessages(id) {
        return this.get(`/messages/conversations/${id}`);
    }
    
    /**
     * Send a message
     * @param {Object} messageData - Message data
     * @returns {Promise} - Created message
     */
    async sendMessage(messageData) {
        return this.post('/messages', messageData);
    }
    
    /**
     * Start a new conversation
     * @param {Object} conversationData - Conversation data (recipient, etc.)
     * @returns {Promise} - Created conversation
     */
    async startConversation(conversationData) {
        return this.post('/messages/conversations', conversationData);
    }
    
    // Connection endpoints
    
    /**
     * Send a connection request
     * @param {string} recipientId - Recipient user ID
     * @returns {Promise} - Created connection
     */
    async sendConnectionRequest(recipientId) {
        return this.post('/connections/request', { recipient: recipientId });
    }
    
    /**
     * Get all connection requests
     * @returns {Promise} - List of connection requests
     */
    async getConnectionRequests() {
        return this.get('/connections/requests');
    }
    
    /**
     * Accept a connection request
     * @param {string} connectionId - Connection ID
     * @returns {Promise} - Updated connection
     */
    async acceptConnection(connectionId) {
        return this.put(`/connections/${connectionId}/accept`, {});
    }
    
    /**
     * Reject a connection request
     * @param {string} connectionId - Connection ID
     * @returns {Promise} - Success message
     */
    async rejectConnection(connectionId) {
        return this.put(`/connections/${connectionId}/reject`, {});
    }
    
    /**
     * Get all connections
     * @returns {Promise} - List of connections
     */
    async getConnections() {
        return this.get('/connections');
    }

    /**
     * Get all documents
     * @returns {Promise} - List of documents
     */
    async getDocuments() {
        return this.get('/startups/user/documents');
    }

    /**
     * Get analytics data
     * @returns {Promise} - Analytics data
     */
    async getAnalytics() {
        return this.get('/startups/user/analytics');
    }

/**
 * Save an investor to user's saved list
 * @param {string} investorId - Investor ID to save
 * @returns {Promise} - Success message
 */


/**
 * Remove an investor from user's saved list
 * @param {string} investorId - Investor ID to remove
 * @returns {Promise} - Success message
 */


async getPortfolio() {
    return this.get('/investors/user/portfolio');
}
async addPortfolioCompany(company) {
    return this.post('/investors/user/portfolio', company);
}
async editPortfolioCompany(companyId, data) {
    return this.put(`/investors/user/portfolio/${companyId}`, data);
}
async getStartupOpportunities() {
    return this.get('/investors/user/startup-opportunities');
}
}
// Create and export API instance
const API = new ApiService();