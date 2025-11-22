/**
 * Authentication Service - Handles user authentication and session management
 */

class AuthService {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.authListeners = [];
        
        //wait for API to be available before initializing
        this.waitForAPI().then(() => {
            this.initAuthState();
        });
    }
    
    /**
     * Wait for API to be available
     */
    async waitForAPI() {
        return new Promise((resolve, reject) => {
            if (typeof window.API !== 'undefined' && window.API) {
                resolve();
                return;
            }
            
            let attempts = 0;
            const maxAttempts = 500; // 5 seconds max wait
            
            const checkAPI = setInterval(() => {
                attempts++;
                if (typeof window.API !== 'undefined' && window.API) {
                    clearInterval(checkAPI);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkAPI);
                    reject(new Error('API failed to load within timeout'));
                }
            }, 10);
        });
    }

    /**
     * Initialize authentication state from localStorage
     */
    initAuthState() {
        const token = localStorage.getItem('token');
        if (token) {
            // Token exists, fetch current user
            this.fetchCurrentUser();
        }
    }
    
    /**
     * Fetch current user data
     */
    async fetchCurrentUser() {
        try {
            await this.waitForAPI();
            const userData = await window.API.getCurrentUser();
            this.setUser(userData);
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            this.logout();
        }
    }
    
    /**
     * Set current user and update authentication state
     * @param {Object} userData - User data
     */
    setUser(userData) {
        this.user = userData;
        this.isAuthenticated = !!userData;
        this.notifyListeners();
    }
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - Registration result
     */
    async register(userData) {
        try {
            // Ensure API is available
            await this.waitForAPI();
            const result = await window.API.register(userData);
            window.API.setToken(result.token);
            this.setUser(result.user);
            return result;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    
    /**
     * Login a user
     * @param {Object} credentials - Login credentials
     * @returns {Promise} - Login result
     */
    async login(credentials) {
        try {
            // Ensure API is available
            await this.waitForAPI();
            const result = await window.API.login(credentials);
            window.API.setToken(result.token);
            this.setUser(result.user);
            return result;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }
    
    /**
     * Logout the current user
     */
    async logout() {
        await this.waitForAPI();
        window.API.setToken(null);
        this.setUser(null);
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean} - Authentication status
     */
    isUserAuthenticated() {
        return this.isAuthenticated;
    }
    
    /**
     * Get current user
     * @returns {Object|null} - Current user data or null
     */
    getCurrentUser() {
        return this.user;
    }
    
    /**
     * Add authentication state change listener
     * @param {Function} listener - Callback function
     */
    addAuthListener(listener) {
        this.authListeners.push(listener);
        
        // Call the listener immediately with current state
        listener(this.isAuthenticated, this.user);
    }
    
    /**
     * Remove authentication state change listener
     * @param {Function} listener - Callback function to remove
     */
    removeAuthListener(listener) {
        this.authListeners = this.authListeners.filter(l => l !== listener);
    }
    
    /**
     * Notify all listeners about authentication state change
     */
    notifyListeners() {
        this.authListeners.forEach(listener => {
            listener(this.isAuthenticated, this.user);
        });
    }
    
    /**
     * Update user profile
     * @param {Object} userData - Updated user data
     * @returns {Promise} - Updated user data
     */
    async updateProfile(userData) {
        try {
            const updatedUser = await window.API.updateProfile(userData);
            this.setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    }
    
    /**
     * Change user password
     * @param {Object} passwordData - Old and new password
     * @returns {Promise} - Success message
     */
    async changePassword(passwordData) {
        try {
            return await window.API.changePassword(passwordData);
        } catch (error) {
            console.error('Password change failed:', error);
            throw error;
        }
    }
}

// Create and export Auth instance - wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const Auth = new AuthService();
        window.Auth = Auth;
    });
} else {
    // DOM is already ready
    const Auth = new AuthService();
    window.Auth = Auth;
}