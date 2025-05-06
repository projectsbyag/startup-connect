/**
 * Authentication Service - Handles user authentication and session management
 */
class AuthService {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.authListeners = [];
        
        // Initialize auth state from local storage
        this.initAuthState();
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
            const userData = await API.getCurrentUser();
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
            const result = await API.register(userData);
            API.setToken(result.token);
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
            const result = await API.login(credentials);
            API.setToken(result.token);
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
    logout() {
        API.setToken(null);
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
            const updatedUser = await API.updateProfile(userData);
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
            return await API.changePassword(passwordData);
        } catch (error) {
            console.error('Password change failed:', error);
            throw error;
        }
    }
}

// Create and export Auth instance
const Auth = new AuthService();