/**
 * Profile Page
 */
const ProfilePage = {
    /**
     * Render profile page
     * @returns {string} - HTML content
     */
    render: function() {
        // Check if user is authenticated
        if (!Auth.isUserAuthenticated()) {
            return `
                <div class="flex items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-gray-900">
                    <div class="text-center">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white mb-4">Authentication Required</h1>
                        <p class="text-gray-600 dark:text-gray-300 max-w-md mb-8">
                            Please log in or sign up to access your profile.
                        </p>
                        <div class="flex flex-col sm:flex-row justify-center gap-4">
                            <button id="profile-login-btn" class="px-6 py-3 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                                Log In
                            </button>
                            <button id="profile-signup-btn" class="px-6 py-3 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Loading state for initial load
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div id="profile-loading" class="py-20 text-center">
                        <div class="spinner mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-300">Loading profile<span class="loading-dots"></span></p>
                    </div>
                    
                    <div id="profile-error" class="py-20 text-center hidden">
                        <div class="text-red-500 text-5xl mb-4">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load profile</h2>
                        <p id="profile-error-message" class="text-gray-600 dark:text-gray-300 mb-6">
                            An error occurred while loading your profile.
                        </p>
                        <button id="retry-profile-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            Try Again
                        </button>
                    </div>
                    
                    <div id="profile-content" class="hidden">
                        <!-- Profile content will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Set up event listeners for the profile page
     * @param {App} app - Main application instance
     */
    setupEventListeners: function(app) {
        // Handle profile login/signup buttons for unauthenticated users
        const loginBtn = document.getElementById('profile-login-btn');
        const signupBtn = document.getElementById('profile-signup-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                // Initialize and show login modal through the app instance
                app.showLoginModal();
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                // Initialize and show signup modal through the app instance
                app.showSignupModal();
            });
        }
        
        // If user is authenticated, load profile content
        if (Auth.isUserAuthenticated()) {
            this.loadProfileContent(app);
        }
        
        // Retry button
        const retryBtn = document.getElementById('retry-profile-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadProfileContent(app);
            });
        }
    },
    
    /**
     * Load profile content
     * @param {App} app - Main application instance
     */
    loadProfileContent: async function(app) {
        // Show loading state
        document.getElementById('profile-loading').classList.remove('hidden');
        document.getElementById('profile-error').classList.add('hidden');
        document.getElementById('profile-content').classList.add('hidden');
        
        try {
            // Get current user data
            const user = Auth.getCurrentUser();
            
            // Load additional profile data based on user type
            let profileData = null;
            
            if (user.userType === 'startup') {
                // Load startup profile
                try {
                    const response = await API.getStartupByUserId(user._id);
                    profileData = response.startup;
                } catch (error) {
                    // Startup profile might not exist yet
                    console.warn('No startup profile found. User may need to complete profile setup.');
                }
                
                // Render startup profile
                document.getElementById('profile-content').innerHTML = this.renderStartupProfile(user, profileData);
                
            } else if (user.userType === 'investor') {
                // Load investor profile
                try {
                    const response = await API.getInvestorByUserId(user._id);
                    profileData = response.investor;
                } catch (error) {
                    // Investor profile might not exist yet
                    console.warn('No investor profile found. User may need to complete profile setup.');
                }
                
                // Render investor profile
                document.getElementById('profile-content').innerHTML = this.renderInvestorProfile(user, profileData);
                
            } else {
                // Unknown user type
                document.getElementById('profile-content').innerHTML = this.renderUserProfile(user);
            }
            
            // Hide loading, show content
            document.getElementById('profile-loading').classList.add('hidden');
            document.getElementById('profile-content').classList.remove('hidden');
            
            // Setup form event listeners
            this.setupProfileFormListeners(app, user, profileData);
            
        } catch (error) {
            // Show error state
            document.getElementById('profile-loading').classList.add('hidden');
            document.getElementById('profile-error').classList.remove('hidden');
            document.getElementById('profile-error-message').textContent = error.message || 'An error occurred while loading your profile.';
            
            console.error('Error loading profile:', error);
        }
    },
    
    /**
     * Render startup profile
     * @param {Object} user - User data
     * @param {Object|null} startup - Startup profile data
     * @returns {string} - HTML content
     */
    renderStartupProfile: function(user, startup) {
        return `
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <!-- Profile header -->
                <div class="bg-startup-primary h-32 relative">
                    <div class="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-center">
                        <div class="h-24 w-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 flex items-center justify-center text-startup-primary text-3xl font-bold">
                            ${user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </div>
                    </div>
                </div>
                
                <div class="pt-16 px-6 pb-6">
                    <div class="text-center mb-6">
                        <h1 class="text-2xl font-bold text-startup-dark dark:text-white">${user.name}</h1>
                        <p class="text-gray-500 dark:text-gray-400">${user.email}</p>
                        ${startup ? `<p class="text-startup-primary font-medium mt-1">${startup.name} • ${startup.industry}</p>` : ''}
                    </div>
                    
                    <div class="flex justify-center mb-8">
                        <button id="edit-profile-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90 mr-4">
                            <i class="fas fa-edit mr-2"></i> Edit Profile
                        </button>
                        <button id="go-to-dashboard-btn" class="px-4 py-2 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                            <i class="fas fa-th-large mr-2"></i> Dashboard
                        </button>
                    </div>
                    
                    <!-- Profile content tabs -->
                    <div class="border-b border-gray-200 dark:border-gray-700">
                        <nav class="-mb-px flex space-x-8">
                            <a href="#" class="profile-tab-link border-startup-primary text-startup-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-tab="account">
                                Account Information
                            </a>
                            <a href="#" class="profile-tab-link border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-tab="security">
                                Security
                            </a>
                            ${startup ? `
                                <a href="#" class="profile-tab-link border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-tab="startup">
                                    Startup Profile
                                </a>
                            ` : ''}
                        </nav>
                    </div>
                    
                    <!-- Tab content -->
                    <div id="account-tab" class="profile-tab py-6">
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-6">Account Information</h2>
                        
                        <form id="account-form" class="space-y-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <div class="mt-1">
                                    <input type="text" name="name" id="name" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.name || ''}">
                                </div>
                            </div>
                            
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>
                                <div class="mt-1">
                                    <input type="email" name="email" id="email" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.email || ''}" readonly>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your email address cannot be changed.</p>
                                </div>
                            </div>
                            
                            <div>
                                <label for="user-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Account Type
                                </label>
                                <div class="mt-1">
                                    <input type="text" name="user-type" id="user-type" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.userType === 'startup' ? 'Startup' : 'Investor'}" readonly>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account type cannot be changed.</p>
                                </div>
                            </div>
                            
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number (optional)
                                </label>
                                <div class="mt-1">
                                    <input type="tel" name="phone" id="phone" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.phone || ''}">
                                </div>
                            </div>
                            
                            <div>
                                <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Bio (optional)
                                </label>
                                <div class="mt-1">
                                    <textarea id="bio" name="bio" rows="3" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">${user.bio || ''}</textarea>
                                </div>
                                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Brief description for your profile.</p>
                            </div>
                            
                            <div class="flex justify-end">
                                <button type="submit" id="save-account-btn" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                    <span id="save-account-btn-text">Save Changes</span>
                                    <span id="save-account-spinner" class="spinner ml-2 hidden"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div id="security-tab" class="profile-tab hidden py-6">
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-6">Security</h2>
                        
                        <form id="security-form" class="space-y-6">
                            <div>
                                <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Current Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="current-password" id="current-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="new-password" id="new-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm New Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="confirm-password" id="confirm-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div class="flex justify-end">
                                <button type="submit" id="change-password-btn" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                    <span id="change-password-btn-text">Change Password</span>
                                    <span id="change-password-spinner" class="spinner ml-2 hidden"></span>
                                </button>
                            </div>
                        </form>
                        
                        <div class="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Two-Factor Authentication</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                            <button id="enable-2fa-btn" class="px-4 py-2 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                                Enable 2FA
                            </button>
                        </div>
                        
                        <div class="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <button id="delete-account-btn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete Account
                            </button>
                        </div>
                    </div>
                    
                    ${startup ? `
                        <div id="startup-tab" class="profile-tab hidden py-6">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-xl font-bold text-startup-dark dark:text-white">Startup Profile</h2>
                                <a href="#" id="view-startup-profile-btn" class="text-startup-primary hover:underline">
                                    <i class="fas fa-external-link-alt mr-1"></i> View Public Profile
                                </a>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <h3 class="text-lg font-bold text-startup-dark dark:text-white">${startup.name}</h3>
                                        <p class="text-gray-500 dark:text-gray-400">${startup.industry} • ${startup.location}</p>
                                    </div>
                                    <div class="mt-4 sm:mt-0">
                                        <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-startup-primary">
                                            ${startup.funding}
                                        </span>
                                    </div>
                                </div>
                                <p class="mt-4 text-gray-600 dark:text-gray-300">${startup.description}</p>
                                <div class="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Funding Raised</p>
                                        <p class="font-medium">$${(startup.fundingAmount || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
                                        <p class="font-medium">${startup.employees || 0} employees</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p class="text-gray-600 dark:text-gray-300 mb-4">
                                To edit your startup profile, please go to the <a href="#" id="go-to-startup-dashboard" class="text-startup-primary hover:underline">Dashboard</a>.
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    /**
     * Render investor profile
     * @param {Object} user - User data
     * @param {Object|null} investor - Investor profile data
     * @returns {string} - HTML content
     */
    renderInvestorProfile: function(user, investor) {
        return `
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <!-- Profile header -->
                <div class="bg-startup-primary h-32 relative">
                    <div class="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-center">
                        <div class="h-24 w-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 flex items-center justify-center text-startup-primary text-3xl font-bold">
                            ${user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </div>
                    </div>
                </div>
                
                <div class="pt-16 px-6 pb-6">
                    <div class="text-center mb-6">
                        <h1 class="text-2xl font-bold text-startup-dark dark:text-white">${user.name}</h1>
                        <p class="text-gray-500 dark:text-gray-400">${user.email}</p>
                        ${investor ? `<p class="text-startup-primary font-medium mt-1">${investor.position}${investor.firm ? ` at ${investor.firm}` : ''}</p>` : ''}
                    </div>
                    
                    <div class="flex justify-center mb-8">
                        <button id="edit-profile-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90 mr-4">
                            <i class="fas fa-edit mr-2"></i> Edit Profile
                        </button>
                        <button id="go-to-dashboard-btn" class="px-4 py-2 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                            <i class="fas fa-th-large mr-2"></i> Dashboard
                        </button>
                    </div>
                    
                    <!-- Profile content tabs -->
                    <div class="border-b border-gray-200 dark:border-gray-700">
                        <nav class="-mb-px flex space-x-8">
                            <a href="#" class="profile-tab-link border-startup-primary text-startup-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-tab="account">
                                Account Information
                            </a>
                            <a href="#" class="profile-tab-link border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-tab="security">
                                Security
                            </a>
                            ${investor ? `
                                <a href="#" class="profile-tab-link border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-tab="investor">
                                    Investor Profile
                                </a>
                            ` : ''}
                        </nav>
                    </div>
                    
                    <!-- Tab content -->
                    <div id="account-tab" class="profile-tab py-6">
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-6">Account Information</h2>
                        
                        <form id="account-form" class="space-y-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <div class="mt-1">
                                    <input type="text" name="name" id="name" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.name || ''}">
                                </div>
                            </div>
                            
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>
                                <div class="mt-1">
                                    <input type="email" name="email" id="email" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.email || ''}" readonly>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your email address cannot be changed.</p>
                                </div>
                            </div>
                            
                            <div>
                                <label for="user-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Account Type
                                </label>
                                <div class="mt-1">
                                    <input type="text" name="user-type" id="user-type" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.userType === 'startup' ? 'Startup' : 'Investor'}" readonly>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account type cannot be changed.</p>
                                </div>
                            </div>
                            
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number (optional)
                                </label>
                                <div class="mt-1">
                                    <input type="tel" name="phone" id="phone" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.phone || ''}">
                                </div>
                            </div>
                            
                            <div>
                                <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Bio (optional)
                                </label>
                                <div class="mt-1">
                                    <textarea id="bio" name="bio" rows="3" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">${user.bio || ''}</textarea>
                                </div>
                                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Brief description for your profile.</p>
                            </div>
                            
                            <div class="flex justify-end">
                                <button type="submit" id="save-account-btn" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                    <span id="save-account-btn-text">Save Changes</span>
                                    <span id="save-account-spinner" class="spinner ml-2 hidden"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div id="security-tab" class="profile-tab hidden py-6">
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-6">Security</h2>
                        
                        <form id="security-form" class="space-y-6">
                            <div>
                                <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Current Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="current-password" id="current-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="new-password" id="new-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm New Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="confirm-password" id="confirm-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div class="flex justify-end">
                                <button type="submit" id="change-password-btn" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                    <span id="change-password-btn-text">Change Password</span>
                                    <span id="change-password-spinner" class="spinner ml-2 hidden"></span>
                                </button>
                            </div>
                        </form>
                        
                        <div class="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Two-Factor Authentication</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                            <button id="enable-2fa-btn" class="px-4 py-2 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                                Enable 2FA
                            </button>
                        </div>
                        
                        <div class="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <button id="delete-account-btn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete Account
                            </button>
                        </div>
                    </div>
                    
                    ${investor ? `
                        <div id="investor-tab" class="profile-tab hidden py-6">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-xl font-bold text-startup-dark dark:text-white">Investor Profile</h2>
                                <a href="#" id="view-investor-profile-btn" class="text-startup-primary hover:underline">
                                    <i class="fas fa-external-link-alt mr-1"></i> View Public Profile
                                </a>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <h3 class="text-lg font-bold text-startup-dark dark:text-white">${investor.firm || user.name}</h3>
                                        <p class="text-gray-500 dark:text-gray-400">${investor.position || 'Investor'} • ${investor.location || ''}</p>
                                    </div>
                                </div>
                                <p class="mt-4 text-gray-600 dark:text-gray-300">${investor.bio || ''}</p>
                                <div class="mt-4">
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Investment Focus</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${investor.focus && investor.focus.length > 0 ? investor.focus.map(focus => `
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-startup-primary">
                                                ${focus}
                                            </span>
                                        `).join('') : 'No focus areas specified'}
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Investment Stage</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${investor.stage && investor.stage.length > 0 ? investor.stage.map(stage => `
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                ${stage}
                                            </span>
                                        `).join('') : 'No stages specified'}
                                    </div>
                                </div>
                                <div class="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Investment Range</p>
                                        <p class="font-medium">$${(investor.min || 0).toLocaleString()} - $${(investor.max || 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Portfolio Size</p>
                                        <p class="font-medium">${investor.portfolioSize || 0} companies</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p class="text-gray-600 dark:text-gray-300 mb-4">
                                To edit your investor profile, please go to the <a href="#" id="go-to-investor-dashboard" class="text-startup-primary hover:underline">Dashboard</a>.
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    /**
     * Render user profile (generic for users without specific profiles)
     * @param {Object} user - User data
     * @returns {string} - HTML content
     */
    renderUserProfile: function(user) {
        return `
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <!-- Profile header -->
                <div class="bg-startup-primary h-32 relative">
                    <div class="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-center">
                        <div class="h-24 w-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 flex items-center justify-center text-startup-primary text-3xl font-bold">
                            ${user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </div>
                    </div>
                </div>
                
                <div class="pt-16 px-6 pb-6">
                    <div class="text-center mb-6">
                        <h1 class="text-2xl font-bold text-startup-dark dark:text-white">${user.name}</h1>
                        <p class="text-gray-500 dark:text-gray-400">${user.email}</p>
                    </div>
                    
                    <div class="flex justify-center mb-8">
                        <button id="edit-profile-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            <i class="fas fa-edit mr-2"></i> Edit Profile
                        </button>
                    </div>
                    
                    <!-- Profile content tabs -->
                    <div class="border-b border-gray-200 dark:border-gray-700">
                        <nav class="-mb-px flex space-x-8">
                            <a href="#" class="profile-tab-link border-startup-primary text-startup-primary whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-tab="account">
                                Account Information
                            </a>
                            <a href="#" class="profile-tab-link border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" data-tab="security">
                                Security
                            </a>
                        </nav>
                    </div>
                    
                    <!-- Tab content -->
                    <div id="account-tab" class="profile-tab py-6">
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-6">Account Information</h2>
                        
                        <form id="account-form" class="space-y-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <div class="mt-1">
                                    <input type="text" name="name" id="name" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.name || ''}">
                                </div>
                            </div>
                            
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>
                                <div class="mt-1">
                                    <input type="email" name="email" id="email" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.email || ''}" readonly>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your email address cannot be changed.</p>
                                </div>
                            </div>
                            
                            <div>
                                <label for="user-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Account Type
                                </label>
                                <div class="mt-1">
                                    <input type="text" name="user-type" id="user-type" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.userType || 'User'}" readonly>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your account type cannot be changed.</p>
                                </div>
                            </div>
                            
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Phone Number (optional)
                                </label>
                                <div class="mt-1">
                                    <input type="tel" name="phone" id="phone" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" value="${user.phone || ''}">
                                </div>
                            </div>
                            
                            <div>
                                <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Bio (optional)
                                </label>
                                <div class="mt-1">
                                    <textarea id="bio" name="bio" rows="3" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">${user.bio || ''}</textarea>
                                </div>
                                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Brief description for your profile.</p>
                            </div>
                            
                            <div class="flex justify-end">
                                <button type="submit" id="save-account-btn" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                    <span id="save-account-btn-text">Save Changes</span>
                                    <span id="save-account-spinner" class="spinner ml-2 hidden"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div id="security-tab" class="profile-tab hidden py-6">
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-6">Security</h2>
                        
                        <form id="security-form" class="space-y-6">
                            <div>
                                <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Current Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="current-password" id="current-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="new-password" id="new-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm New Password
                                </label>
                                <div class="mt-1">
                                    <input type="password" name="confirm-password" id="confirm-password" class="text-base shadow-sm focus:ring-startup-primary focus:border-startup-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div class="flex justify-end">
                                <button type="submit" id="change-password-btn" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                    <span id="change-password-btn-text">Change Password</span>
                                    <span id="change-password-spinner" class="spinner ml-2 hidden"></span>
                                </button>
                            </div>
                        </form>
                        
                        <div class="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Two-Factor Authentication</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                            <button id="enable-2fa-btn" class="px-4 py-2 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                                Enable 2FA
                            </button>
                        </div>
                        
                        <div class="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <button id="delete-account-btn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Set up profile form event listeners
     * @param {App} app - Main application instance
     * @param {Object} user - User data
     * @param {Object|null} profileData - Additional profile data
     */
    setupProfileFormListeners: function(app, user, profileData) {
        // Tab navigation
        const tabLinks = document.querySelectorAll('.profile-tab-link');
        const tabContents = document.querySelectorAll('.profile-tab');
        
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get tab ID
                const tabId = link.dataset.tab;
                
                // Remove active class from all links
                tabLinks.forEach(item => {
                    item.classList.remove('border-startup-primary', 'text-startup-primary');
                    item.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
                });
                
                // Add active class to current link
                link.classList.add('border-startup-primary', 'text-startup-primary');
                link.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
                
                // Hide all tab contents
                tabContents.forEach(tab => {
                    tab.classList.add('hidden');
                });
                
                // Show current tab content
                document.getElementById(`${tabId}-tab`)?.classList.remove('hidden');
            });
        });
        
        // Edit profile button
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                // Open first tab
                document.querySelector('.profile-tab-link').click();
            });
        }
        
        // Go to dashboard button
        const dashboardBtn = document.getElementById('go-to-dashboard-btn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                app.navigateTo('dashboard');
            });
        }
        
        // Account form submission
        const accountForm = document.getElementById('account-form');
        if (accountForm) {
            accountForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('name').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const bio = document.getElementById('bio').value.trim();
                
                // Show loading state
                const btnText = document.getElementById('save-account-btn-text');
                const btnSpinner = document.getElementById('save-account-spinner');
                const submitBtn = document.getElementById('save-account-btn');
                
                btnText.textContent = 'Saving...';
                btnSpinner.classList.remove('hidden');
                submitBtn.disabled = true;
                
                try {
                    // Update user profile
                    const updatedUser = await API.updateProfile({
                        name,
                        phone,
                        bio
                    });
                    
                    // Update Auth user data
                    Auth.setUser(updatedUser);
                    
                    // Show success message
                    app.showToast('Profile updated successfully!', 'success');
                    
                    // Reset button state
                    btnText.textContent = 'Save Changes';
                    btnSpinner.classList.add('hidden');
                    submitBtn.disabled = false;
                    location.reload();
                } catch (error) {
                    // Show error
                    app.showToast(error.message || 'Failed to update profile', 'error');
                    console.error('Error updating profile:', error);
                    
                    // Reset button state
                    btnText.textContent = 'Save Changes';
                    btnSpinner.classList.add('hidden');
                    submitBtn.disabled = false;
                }
            });
        }
        
        // Security form submission (change password)
        const securityForm = document.getElementById('security-form');
        if (securityForm) {
            securityForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Get form data
                const currentPassword = document.getElementById('current-password').value;
                const newPassword = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                // Validate passwords
                if (newPassword !== confirmPassword) {
                    app.showToast('New passwords do not match', 'error');
                    return;
                }
                
                if (newPassword.length < 8) {
                    app.showToast('Password must be at least 8 characters long', 'error');
                    return;
                }
                
                // Show loading state
                const btnText = document.getElementById('change-password-btn-text');
                const btnSpinner = document.getElementById('change-password-spinner');
                const submitBtn = document.getElementById('change-password-btn');
                
                btnText.textContent = 'Changing...';
                btnSpinner.classList.remove('hidden');
                submitBtn.disabled = true;
                
                try {
                    // Change password
                    await API.changePassword({
                        currentPassword,
                        newPassword
                    });
                    
                    // Show success message
                    app.showToast('Password changed successfully!', 'success');
                    
                    // Reset form
                    securityForm.reset();
                    
                    // Reset button state
                    btnText.textContent = 'Change Password';
                    btnSpinner.classList.add('hidden');
                    submitBtn.disabled = false;
                    
                } catch (error) {
                    // Show error
                    app.showToast(error.message || 'Failed to change password', 'error');
                    console.error('Error changing password:', error);
                    
                    // Reset button state
                    btnText.textContent = 'Change Password';
                    btnSpinner.classList.add('hidden');
                    submitBtn.disabled = false;
                }
            });
        }
        
        // Delete account button
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                // Show confirmation dialog
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    this.deleteAccount(app);
                }
            });
        }
        
        // 2FA button
        const enable2FABtn = document.getElementById('enable-2fa-btn');
        if (enable2FABtn) {
            enable2FABtn.addEventListener('click', () => {
                app.showToast('Two-factor authentication feature coming soon!', 'info');
            });
        }
        
        // Startup/Investor profile specific links
        const viewStartupProfileBtn = document.getElementById('view-startup-profile-btn');
        if (viewStartupProfileBtn && profileData) {
            viewStartupProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // This would typically link to a public profile page
                // For now, show a message
                app.showToast('Public profile viewing coming soon!', 'info');
            });
        }
        
        const viewInvestorProfileBtn = document.getElementById('view-investor-profile-btn');
        if (viewInvestorProfileBtn && profileData) {
            viewInvestorProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // This would typically link to a public profile page
                // For now, show a message
                app.showToast('Public profile viewing coming soon!', 'info');
            });
        }
        
        const goToStartupDashboardBtn = document.getElementById('go-to-startup-dashboard');
        if (goToStartupDashboardBtn) {
            goToStartupDashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                app.navigateTo('dashboard');
            });
        }
        
        const goToInvestorDashboardBtn = document.getElementById('go-to-investor-dashboard');
        if (goToInvestorDashboardBtn) {
            goToInvestorDashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                app.navigateTo('dashboard');
            });
        }
    },
    
    /**
     * Delete user account
     * @param {App} app - Main application instance
     */
    deleteAccount: async function(app) {
        try {
            // Delete account via API
            await API.deleteAccount();
            
            // Logout user
            Auth.logout();
            
            // Show success message
            app.showToast('Account deleted successfully', 'success');
            
            // Navigate to home
            app.navigateTo('home');
            
        } catch (error) {
            // Show error
            app.showToast(error.message || 'Failed to delete account', 'error');
            console.error('Error deleting account:', error);
        }
    }
};

