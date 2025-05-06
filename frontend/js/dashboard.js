/**
 * Dashboard Page
 */
const DashboardPage = {
    /**
     * Render dashboard page
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
                            Please log in or sign up to access your dashboard.
                        </p>
                        <div class="flex flex-col sm:flex-row justify-center gap-4">
                            <button id="dashboard-login-btn" class="px-6 py-3 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                                Log In
                            </button>
                            <button id="dashboard-signup-btn" class="px-6 py-3 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Get user data
        const user = Auth.getCurrentUser();
        
        // Check if profile is complete
        const isStartup = user.userType === 'startup';
        const isInvestor = user.userType === 'investor';
        
        // Load appropriate dashboard based on user type
        if (isStartup) {
            return this.renderStartupDashboard(user);
        } else if (isInvestor) {
            return this.renderInvestorDashboard(user);
        }
        
        // Default dashboard if user type is not recognized
        return `
            <div class="flex items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-gray-900">
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-startup-dark dark:text-white mb-4">Welcome to your Dashboard</h1>
                    <p class="text-gray-600 dark:text-gray-300 max-w-md mb-8">
                        Your account type is not recognized. Please contact support for assistance.
                    </p>
                </div>
            </div>
        `;
    },
    
    /**
     * Render startup dashboard
     * @param {Object} user - User data
     * @returns {string} - HTML content
     */
    renderStartupDashboard: function(user) {
        // Loading state for initial load
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-6">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div id="dashboard-loading" class="py-20 text-center">
                        <div class="spinner mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-300">Loading dashboard<span class="loading-dots"></span></p>
                    </div>
                    
                    <div id="dashboard-error" class="py-20 text-center hidden">
                        <div class="text-red-500 text-5xl mb-4">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load dashboard</h2>
                        <p id="dashboard-error-message" class="text-gray-600 dark:text-gray-300 mb-6">
                            An error occurred while loading your dashboard data.
                        </p>
                        <button id="retry-dashboard-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            Try Again
                        </button>
                    </div>
                    
                    <div id="dashboard-content" class="hidden bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        <!-- Dashboard content will be loaded here -->
                    </div>
                    
                    <div id="profile-completion" class="hidden bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-4">Complete Your Startup Profile</h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            Please provide some information about your startup to get started. This will help investors find and connect with you.
                        </p>
                        
                        <form id="profile-completion-form" class="space-y-6">
                            <div>
                                <label for="startup-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Startup Name
                                </label>
                                <div class="mt-1">
                                    <input id="startup-name" name="startup-name" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label for="startup-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Short Description
                                </label>
                                <div class="mt-1">
                                    <input id="startup-description" name="startup-description" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="E.g., AI-powered project management tools">
                                </div>
                            </div>
                            
                            <div>
                                <label for="startup-industry" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Industry
                                </label>
                                <div class="mt-1">
                                    <select id="startup-industry" name="startup-industry" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                        <option value="">Select an industry</option>
                                        <option value="Fintech">Fintech</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Education">Education</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Software">Software</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Clean Energy">Clean Energy</option>
                                        <option value="Logistics">Logistics</option>
                                        <option value="Food & Beverage">Food & Beverage</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="funding-stage" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Funding Stage
                                    </label>
                                    <div class="mt-1">
                                        <select id="funding-stage" name="funding-stage" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                            <option value="">Select stage</option>
                                            <option value="Pre-seed">Pre-seed</option>
                                            <option value="Seed">Seed</option>
                                            <option value="Series A">Series A</option>
                                            <option value="Series B">Series B</option>
                                            <option value="Series C">Series C</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="funding-amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Funding Raised So Far (USD)
                                    </label>
                                    <div class="mt-1">
                                        <input id="funding-amount" name="funding-amount" type="number" min="0" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="0">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="team-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Team Size
                                    </label>
                                    <div class="mt-1">
                                        <input id="team-size" name="team-size" type="number" min="1" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="1">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="founded-year" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Founded Year
                                    </label>
                                    <div class="mt-1">
                                        <input id="founded-year" name="founded-year" type="number" min="2000" max="${new Date().getFullYear()}" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="2022">
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Location
                                </label>
                                <div class="mt-1">
                                    <input id="location" name="location" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="City, Country">
                                </div>
                            </div>
                            
                            <div>
                                <label for="pitch" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Elevator Pitch
                                </label>
                                <div class="mt-1">
                                    <textarea id="pitch" name="pitch" rows="4" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="Describe your startup in a few sentences..."></textarea>
                                </div>
                            </div>
                            
                            <div class="flex justify-end">
                                <button type="submit" id="complete-profile-btn" class="px-6 py-3 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                                    <span id="complete-profile-btn-text">Complete Profile</span>
                                    <span id="complete-profile-spinner" class="spinner ml-2 hidden"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render investor dashboard
     * @param {Object} user - User data
     * @returns {string} - HTML content
     */
    renderInvestorDashboard: function(user) {
        // Loading state for initial load
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-6">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div id="dashboard-loading" class="py-20 text-center">
                        <div class="spinner mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-300">Loading dashboard<span class="loading-dots"></span></p>
                    </div>
                    
                    <div id="dashboard-error" class="py-20 text-center hidden">
                        <div class="text-red-500 text-5xl mb-4">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load dashboard</h2>
                        <p id="dashboard-error-message" class="text-gray-600 dark:text-gray-300 mb-6">
                            An error occurred while loading your dashboard data.
                        </p>
                        <button id="retry-dashboard-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            Try Again
                        </button>
                    </div>
                    
                    <div id="dashboard-content" class="hidden bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        <!-- Dashboard content will be loaded here -->
                    </div>
                    
                    <div id="profile-completion" class="hidden bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-4">Complete Your Investor Profile</h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            Please provide some information about your investment preferences to get started. This will help startups find and connect with you.
                        </p>
                        
                        <form id="investor-profile-completion-form" class="space-y-6">
                            <div>
                                <label for="firm-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Firm Name (if applicable)
                                </label>
                                <div class="mt-1">
                                    <input id="firm-name" name="firm-name" type="text" class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                </div>
                            </div>
                            
                            <div>
                                <label for="position" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Position/Title
                                </label>
                                <div class="mt-1">
                                    <input id="position" name="position" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="E.g., Managing Partner, Angel Investor">
                                </div>
                            </div>
                            
                            <div>
                                <label for="investment-focus" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Investment Focus (select multiple)
                                </label>
                                <div class="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="focus-fintech" name="investment-focus" value="Fintech" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="focus-fintech" class="font-medium text-gray-700 dark:text-gray-300">Fintech</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="focus-healthcare" name="investment-focus" value="Healthcare" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="focus-healthcare" class="font-medium text-gray-700 dark:text-gray-300">Healthcare</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="focus-education" name="investment-focus" value="Education" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="focus-education" class="font-medium text-gray-700 dark:text-gray-300">Education</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="focus-agriculture" name="investment-focus" value="Agriculture" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="focus-agriculture" class="font-medium text-gray-700 dark:text-gray-300">Agriculture</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="focus-software" name="investment-focus" value="Software" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="focus-software" class="font-medium text-gray-700 dark:text-gray-300">Software</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="focus-ai" name="investment-focus" value="AI" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="focus-ai" class="font-medium text-gray-700 dark:text-gray-300">AI</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="focus-ecommerce" name="investment-focus" value="E-commerce" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="focus-ecommerce" class="font-medium text-gray-700 dark:text-gray-300">E-commerce</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="focus-energy" name="investment-focus" value="Energy" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="focus-energy" class="font-medium text-gray-700 dark:text-gray-300">Energy</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label for="investment-stage" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Investment Stage (select multiple)
                                </label>
                                <div class="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="stage-preseed" name="investment-stage" value="Pre-seed" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="stage-preseed" class="font-medium text-gray-700 dark:text-gray-300">Pre-seed</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="stage-seed" name="investment-stage" value="Seed" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="stage-seed" class="font-medium text-gray-700 dark:text-gray-300">Seed</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="stage-seriesa" name="investment-stage" value="Series A" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="stage-seriesa" class="font-medium text-gray-700 dark:text-gray-300">Series A</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="stage-seriesb" name="investment-stage" value="Series B" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded">
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="stage-seriesb" class="font-medium text-gray-700 dark:text-gray-300">Series B</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="min-investment" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Minimum Investment (USD)
                                    </label>
                                    <div class="mt-1">
                                        <input id="min-investment" name="min-investment" type="number" min="0" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="10000">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="max-investment" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Maximum Investment (USD)
                                    </label>
                                    <div class="mt-1">
                                        <input id="max-investment" name="max-investment" type="number" min="0" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="100000">
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label for="portfolio-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Current Portfolio Size (number of companies)
                                </label>
                                <div class="mt-1">
                                    <input id="portfolio-size" name="portfolio-size" type="number" min="0" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="0">
                                </div>
                            </div>
                            
                            <div>
                                <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Location
                                </label>
                                <div class="mt-1">
                                    <input id="investor-location" name="investor-location" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="City, Country">
                                </div>
                            </div>
                            
                            <div>
                                <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Bio/Description
                                </label>
                                <div class="mt-1">
                                    <textarea id="bio" name="bio" rows="4" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="Describe your investment approach and interests..."></textarea>
                                </div>
                            </div>
                            
                            <div class="flex justify-end">
                                <button type="submit" id="complete-investor-profile-btn" class="px-6 py-3 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                                    <span id="complete-investor-profile-btn-text">Complete Profile</span>
                                    <span id="complete-investor-profile-spinner" class="spinner ml-2 hidden"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render startup dashboard content after profile is complete
     * @param {Object} profile - Startup profile data
     * @returns {string} - HTML content
     */
    renderStartupDashboardContent: function(profile) {
        return `
            <div class="flex flex-col md:flex-row">
                <!-- Sidebar -->
                <div class="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white">${profile.name}</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${profile.industry}</p>
                    </div>
                    <nav class="py-4">
                        <a href="#" class="dashboard-nav active flex items-center px-4 py-3 text-startup-primary bg-purple-50 dark:bg-gray-800" data-tab="overview">
                            <i class="fas fa-tachometer-alt w-5 mr-2"></i>
                            <span>Overview</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="profile">
                            <i class="fas fa-building w-5 mr-2"></i>
                            <span>Startup Profile</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="matches">
                            <i class="fas fa-handshake w-5 mr-2"></i>
                            <span>Investor Matches</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="messages">
                            <i class="fas fa-comment-alt w-5 mr-2"></i>
                            <span>Messages</span>
                            <span id="message-count" class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">0</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="connections">
                            <i class="fas fa-user-friends w-5 mr-2"></i>
                            <span>Connections</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="documents">
                            <i class="fas fa-file-alt w-5 mr-2"></i>
                            <span>Documents</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="analytics">
                            <i class="fas fa-chart-line w-5 mr-2"></i>
                            <span>Analytics</span>
                        </a>
                    </nav>
                </div>
                
                <!-- Main content -->
                <div class="flex-1">
                    <!-- Tab content -->
                    <div id="overview-tab" class="dashboard-tab">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Dashboard Overview</h2>
                            
                            <!-- Stats -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 dashboard-card">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-startup-primary bg-opacity-10 rounded-full p-3">
                                            <i class="fas fa-eye text-startup-primary"></i>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Views</p>
                                            <p class="text-2xl font-bold text-startup-dark dark:text-white">${profile.stats?.profileViews || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 dashboard-card">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-green-100 rounded-full p-3">
                                            <i class="fas fa-handshake text-green-600"></i>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Connections</p>
                                            <p class="text-2xl font-bold text-startup-dark dark:text-white">${profile.stats?.connections || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 dashboard-card">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-blue-100 rounded-full p-3">
                                            <i class="fas fa-comment-alt text-blue-600"></i>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Messages</p>
                                            <p class="text-2xl font-bold text-startup-dark dark:text-white">${profile.stats?.messages || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 dashboard-card">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                                            <i class="fas fa-star text-yellow-600"></i>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Match Score</p>
                                            <p class="text-2xl font-bold text-startup-dark dark:text-white">${profile.stats?.matchScore || '-'}/10</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Activity and Suggested Investors -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Recent Activity -->
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                    <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Recent Activity</h3>
                                    <div class="space-y-4">
                                        ${profile.activity && profile.activity.length > 0 ? profile.activity.map(item => `
                                            <div class="flex items-start">
                                                <div class="flex-shrink-0 mt-1">
                                                    <div class="h-8 w-8 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                                        <i class="fas ${item.icon || 'fa-bell'}"></i>
                                                    </div>
                                                </div>
                                                <div class="ml-4">
                                                    <p class="text-sm font-medium text-startup-dark dark:text-white">${item.message}</p>
                                                    <p class="text-xs text-gray-500 dark:text-gray-400">${new Date(item.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        `).join('') : `
                                            <p class="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
                                        `}
                                    </div>
                                    <div class="mt-4 text-center">
                                        <a href="#" class="text-sm text-startup-primary hover:underline">View All Activity</a>
                                    </div>
                                </div>
                                
                                <!-- Suggested Investors -->
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                    <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Suggested Investors</h3>
                                    <div class="space-y-4">
                                        <div id="suggested-investors-loading" class="py-4 text-center hidden">
                                            <div class="spinner mx-auto mb-2"></div>
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Loading suggestions<span class="loading-dots"></span></p>
                                        </div>
                                        
                                        <div id="suggested-investors-error" class="py-4 text-center hidden">
                                            <p class="text-sm text-red-500 mb-2">Failed to load suggestions</p>
                                            <button id="retry-suggestions-btn" class="text-xs text-startup-primary hover:underline">Try Again</button>
                                        </div>
                                        
                                        <div id="suggested-investors-content">
                                            ${profile.suggestedInvestors && profile.suggestedInvestors.length > 0 ? profile.suggestedInvestors.map(investor => `
                                                <div class="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <div class="flex-shrink-0 mt-1">
                                                        <div class="h-10 w-10 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                                            <span>${investor.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <div class="ml-4 flex-1">
                                                        <div class="flex justify-between">
                                                            <div>
                                                                <p class="text-sm font-medium text-startup-dark dark:text-white">${investor.name}</p>
                                                                <p class="text-xs text-gray-500 dark:text-gray-400">${investor.firm || 'Individual Investor'}</p>
                                                            </div>
                                                            <div class="text-xs text-white bg-startup-primary px-2 py-1 rounded-full">
                                                                ${investor.matchScore}/10
                                                            </div>
                                                        </div>
                                                        <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">${investor.focus.join(', ')}</p>
                                                        <div class="mt-2 flex">
                                                            <button class="text-xs bg-startup-primary text-white px-2 py-1 rounded hover:bg-opacity-90 investor-connect-btn" data-id="${investor._id}">
                                                                Connect
                                                            </button>
                                                            <button class="text-xs border border-startup-primary text-startup-primary px-2 py-1 rounded ml-2 hover:bg-startup-primary hover:text-white transition-colors investor-details-btn" data-id="${investor._id}">
                                                                Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            `).join('') : `
                                                <p class="text-gray-500 dark:text-gray-400 text-center py-4">No suggested investors yet</p>
                                            `}
                                        </div>
                                    </div>
                                    <div class="mt-4 text-center">
                                        <a href="#" class="text-sm text-startup-primary hover:underline" id="view-all-investors-btn">View All Investors</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Profile Completion -->
                            <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Profile Completion</h3>
                                <div class="mb-2 flex justify-between">
                                    <p class="text-sm text-gray-600 dark:text-gray-300">Complete your profile to increase visibility to investors</p>
                                    <span class="text-sm font-medium text-startup-primary">${profile.completionPercentage || 60}%</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div class="bg-startup-primary h-2.5 rounded-full" style="width: ${profile.completionPercentage || 60}%"></div>
                                </div>
                                <div class="mt-4">
                                    <ul class="space-y-2 text-sm">
                                        ${!profile.pitch ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Add an elevator pitch</li>` : ''}
                                        ${!profile.team || profile.team.length === 0 ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Add team members</li>` : ''}
                                        ${!profile.documents || profile.documents.length === 0 ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Upload pitch deck or business plan</li>` : ''}
                                        ${!profile.socialMedia || Object.keys(profile.socialMedia).length === 0 ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Add social media links</li>` : ''}
                                        ${!profile.website ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Add website URL</li>` : ''}
                                    </ul>
                                </div>
                                <div class="mt-4">
                                    <button id="complete-profile-items-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                                        Complete Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Other tab contents will be loaded dynamically -->
                    <div id="profile-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Startup Profile</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading profile content...</p>
                        </div>
                    </div>
                    
                    <div id="matches-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Investor Matches</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading matches content...</p>
                        </div>
                    </div>
                    
                    <div id="messages-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Messages</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading messages content...</p>
                        </div>
                    </div>
                    
                    <div id="connections-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Connections</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading connections content...</p>
                        </div>
                    </div>
                    
                    <div id="documents-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Documents</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading documents content...</p>
                        </div>
                    </div>
                    
                    <div id="analytics-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Analytics</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading analytics content...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Render investor dashboard content after profile is complete
     * @param {Object} profile - Investor profile data
     * @returns {string} - HTML content
     */
    renderInvestorDashboardContent: function(profile) {
        return `
            <div class="flex flex-col md:flex-row">
                <!-- Sidebar -->
                <div class="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white">${profile.firm || profile.name}</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${profile.position || 'Investor'}</p>
                    </div>
                    <nav class="py-4">
                        <a href="#" class="dashboard-nav active flex items-center px-4 py-3 text-startup-primary bg-purple-50 dark:bg-gray-800" data-tab="overview">
                            <i class="fas fa-tachometer-alt w-5 mr-2"></i>
                            <span>Overview</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="profile">
                            <i class="fas fa-user w-5 mr-2"></i>
                            <span>Investor Profile</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="startups">
                            <i class="fas fa-rocket w-5 mr-2"></i>
                            <span>Startup Opportunities</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="messages">
                            <i class="fas fa-comment-alt w-5 mr-2"></i>
                            <span>Messages</span>
                            <span id="message-count" class="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">0</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="connections">
                            <i class="fas fa-user-friends w-5 mr-2"></i>
                            <span>Connections</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="portfolio">
                            <i class="fas fa-briefcase w-5 mr-2"></i>
                            <span>Portfolio</span>
                        </a>
                        <a href="#" class="dashboard-nav flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" data-tab="analytics">
                            <i class="fas fa-chart-line w-5 mr-2"></i>
                            <span>Analytics</span>
                        </a>
                    </nav>
                </div>
                
                <!-- Main content -->
                <div class="flex-1">
                    <!-- Tab content -->
                    <div id="overview-tab" class="dashboard-tab">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Dashboard Overview</h2>
                            
                            <!-- Stats -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 dashboard-card">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-startup-primary bg-opacity-10 rounded-full p-3">
                                            <i class="fas fa-rocket text-startup-primary"></i>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Startup Matches</p>
                                            <p class="text-2xl font-bold text-startup-dark dark:text-white">${profile.stats?.matches || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 dashboard-card">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-green-100 rounded-full p-3">
                                            <i class="fas fa-handshake text-green-600"></i>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Connections</p>
                                            <p class="text-2xl font-bold text-startup-dark dark:text-white">${profile.stats?.connections || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 dashboard-card">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-blue-100 rounded-full p-3">
                                            <i class="fas fa-comment-alt text-blue-600"></i>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Messages</p>
                                            <p class="text-2xl font-bold text-startup-dark dark:text-white">${profile.stats?.messages || 0}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 dashboard-card">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                                            <i class="fas fa-briefcase text-yellow-600"></i>
                                        </div>
                                        <div class="ml-4">
                                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio</p>
                                            <p class="text-2xl font-bold text-startup-dark dark:text-white">${profile.portfolioSize || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Activity and Suggested Startups -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Recent Activity -->
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                    <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Recent Activity</h3>
                                    <div class="space-y-4">
                                        ${profile.activity && profile.activity.length > 0 ? profile.activity.map(item => `
                                            <div class="flex items-start">
                                                <div class="flex-shrink-0 mt-1">
                                                    <div class="h-8 w-8 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                                        <i class="fas ${item.icon || 'fa-bell'}"></i>
                                                    </div>
                                                </div>
                                                <div class="ml-4">
                                                    <p class="text-sm font-medium text-startup-dark dark:text-white">${item.message}</p>
                                                    <p class="text-xs text-gray-500 dark:text-gray-400">${new Date(item.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        `).join('') : `
                                            <p class="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
                                        `}
                                    </div>
                                    <div class="mt-4 text-center">
                                        <a href="#" class="text-sm text-startup-primary hover:underline">View All Activity</a>
                                    </div>
                                </div>
                                
                                <!-- Suggested Startups -->
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                    <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Suggested Startups</h3>
                                    <div class="space-y-4">
                                        <div id="suggested-startups-loading" class="py-4 text-center hidden">
                                            <div class="spinner mx-auto mb-2"></div>
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Loading suggestions<span class="loading-dots"></span></p>
                                        </div>
                                        
                                        <div id="suggested-startups-error" class="py-4 text-center hidden">
                                            <p class="text-sm text-red-500 mb-2">Failed to load suggestions</p>
                                            <button id="retry-startup-suggestions-btn" class="text-xs text-startup-primary hover:underline">Try Again</button>
                                        </div>
                                        
                                        <div id="suggested-startups-content">
                                            ${profile.suggestedStartups && profile.suggestedStartups.length > 0 ? profile.suggestedStartups.map(startup => `
                                                <div class="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <div class="flex-shrink-0 mt-1">
                                                        <div class="h-10 w-10 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                                            <span>${startup.name.substring(0, 2).toUpperCase()}</span>
                                                        </div>
                                                    </div>
                                                    <div class="ml-4 flex-1">
                                                        <div class="flex justify-between">
                                                            <div>
                                                                <p class="text-sm font-medium text-startup-dark dark:text-white">${startup.name}</p>
                                                                <p class="text-xs text-gray-500 dark:text-gray-400">${startup.industry}</p>
                                                            </div>
                                                            <div class="text-xs text-white bg-startup-primary px-2 py-1 rounded-full">
                                                                ${startup.matchScore}/10
                                                            </div>
                                                        </div>
                                                        <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">${startup.description}</p>
                                                        <div class="mt-2 flex">
                                                            <button class="text-xs bg-startup-primary text-white px-2 py-1 rounded hover:bg-opacity-90 startup-connect-btn" data-id="${startup._id}">
                                                                Connect
                                                            </button>
                                                            <button class="text-xs border border-startup-primary text-startup-primary px-2 py-1 rounded ml-2 hover:bg-startup-primary hover:text-white transition-colors startup-details-btn" data-id="${startup._id}">
                                                                Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            `).join('') : `
                                                <p class="text-gray-500 dark:text-gray-400 text-center py-4">No suggested startups yet</p>
                                            `}
                                        </div>
                                    </div>
                                    <div class="mt-4 text-center">
                                        <a href="#" class="text-sm text-startup-primary hover:underline" id="view-all-startups-btn">View All Startups</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Profile Completion -->
                            <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Profile Completion</h3>
                                <div class="mb-2 flex justify-between">
                                    <p class="text-sm text-gray-600 dark:text-gray-300">Complete your profile to get better startup matches</p>
                                    <span class="text-sm font-medium text-startup-primary">${profile.completionPercentage || 70}%</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div class="bg-startup-primary h-2.5 rounded-full" style="width: ${profile.completionPercentage || 70}%"></div>
                                </div>
                                <div class="mt-4">
                                    <ul class="space-y-2 text-sm">
                                        ${!profile.bio ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Add a detailed bio</li>` : ''}
                                        ${!profile.portfolio || profile.portfolio.length === 0 ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Add portfolio companies</li>` : ''}
                                        ${!profile.socialMedia || Object.keys(profile.socialMedia).length === 0 ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Add social media links</li>` : ''}
                                        ${!profile.website ? `<li class="flex items-center text-gray-600 dark:text-gray-300"><i class="fas fa-times-circle text-red-500 mr-2"></i> Add website URL</li>` : ''}
                                    </ul>
                                </div>
                                <div class="mt-4">
                                    <button id="complete-investor-profile-items-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                                        Complete Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Other tab contents will be loaded dynamically -->
                    <div id="profile-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Investor Profile</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading profile content...</p>
                        </div>
                    </div>
                    
                    <div id="startups-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Startup Opportunities</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading startup opportunities...</p>
                        </div>
                    </div>
                    
                    <div id="messages-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Messages</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading messages content...</p>
                        </div>
                    </div>
                    
                    <div id="connections-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Connections</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading connections content...</p>
                        </div>
                    </div>
                    
                    <div id="portfolio-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Portfolio</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading portfolio content...</p>
                        </div>
                    </div>
                    
                    <div id="analytics-tab" class="dashboard-tab hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Analytics</h2>
                            <p class="text-gray-500 dark:text-gray-400">Loading analytics content...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Set up event listeners for the dashboard page
     * @param {App} app - Main application instance
     */
    setupEventListeners: function(app) {
        // Handle dashboard login/signup buttons for unauthenticated users
        const loginBtn = document.getElementById('dashboard-login-btn');
        const signupBtn = document.getElementById('dashboard-signup-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                document.getElementById('login-modal').classList.remove('hidden');
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                document.getElementById('signup-modal').classList.remove('hidden');
            });
        }
        
        // If user is authenticated, load dashboard content
        if (Auth.isUserAuthenticated()) {
            this.loadDashboardContent(app);
        }
    },
    
    /**
     * Load dashboard content based on user type
     * @param {App} app - Main application instance
     */
    loadDashboardContent: async function(app) {
        // Show loading state
        document.getElementById('dashboard-loading')?.classList.remove('hidden');
        document.getElementById('dashboard-error')?.classList.add('hidden');
        document.getElementById('dashboard-content')?.classList.add('hidden');
        document.getElementById('profile-completion')?.classList.add('hidden');
        
        try {
            const user = Auth.getCurrentUser();
            
            // Check user type
            if (user.userType === 'startup') {
                // Load startup profile
                const startupProfile = await this.loadStartupProfile(user);
                
                // Check if profile exists
                if (startupProfile) {
                    // Profile exists, show dashboard content
                    document.getElementById('dashboard-content').innerHTML = this.renderStartupDashboardContent(startupProfile);
                    document.getElementById('dashboard-content').classList.remove('hidden');
                    
                    // Setup dashboard tab navigation
                    this.setupDashboardTabs();
                    
                    // Setup dashboard-specific event listeners
                    this.setupStartupDashboardEventListeners(app, startupProfile);
                } else {
                    // Profile doesn't exist, show completion form
                    document.getElementById('profile-completion').classList.remove('hidden');
                    
                    // Setup profile completion form
                    this.setupStartupProfileCompletionForm(app);
                }
            } else if (user.userType === 'investor') {
                // Load investor profile
                const investorProfile = await this.loadInvestorProfile(user);
                
                // Check if profile exists
                if (investorProfile) {
                    // Profile exists, show dashboard content
                    document.getElementById('dashboard-content').innerHTML = this.renderInvestorDashboardContent(investorProfile);
                    document.getElementById('dashboard-content').classList.remove('hidden');
                    
                    // Setup dashboard tab navigation
                    this.setupDashboardTabs();
                    
                    // Setup dashboard-specific event listeners
                    this.setupInvestorDashboardEventListeners(app, investorProfile);
                } else {
                    // Profile doesn't exist, show completion form
                    document.getElementById('profile-completion').classList.remove('hidden');
                    
                    // Setup profile completion form
                    this.setupInvestorProfileCompletionForm(app);
                }
            }
            
            // Hide loading state
            document.getElementById('dashboard-loading').classList.add('hidden');
            
        } catch (error) {
            // Show error state
            document.getElementById('dashboard-loading').classList.add('hidden');
            document.getElementById('dashboard-error').classList.remove('hidden');
            document.getElementById('dashboard-error-message').textContent = error.message || 'An error occurred while loading your dashboard.';
            
            console.error('Error loading dashboard:', error);
            
            // Add retry event listener
            document.getElementById('retry-dashboard-btn')?.addEventListener('click', () => {
                this.loadDashboardContent(app);
            });
        }
    },
    
    /**
     * Load startup profile
     * @param {Object} user - User data
     * @returns {Promise<Object|null>} - Startup profile or null if not found
     */
    loadStartupProfile: async function(user) {
        try {
            // First check if user has a startup profile
            const response = await API.getStartupByUserId(user._id);
            return response.startup;
        } catch (error) {
            // If 404, profile doesn't exist yet
            if (error.message && error.message.includes('not found')) {
                return null;
            }
            throw error;
        }
    },
    
    /**
     * Load investor profile
     * @param {Object} user - User data
     * @returns {Promise<Object|null>} - Investor profile or null if not found
     */
    loadInvestorProfile: async function(user) {
        try {
            // First check if user has an investor profile
            const response = await API.getInvestorByUserId(user._id);
            return response.investor;
        } catch (error) {
            // If 404, profile doesn't exist yet
            if (error.message && error.message.includes('not found')) {
                return null;
            }
            throw error;
        }
    },
    
    /**
     * Setup startup profile completion form
     * @param {App} app - Main application instance
     */
    setupStartupProfileCompletionForm: function(app) {
        const form = document.getElementById('profile-completion-form');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const startupName = document.getElementById('startup-name').value.trim();
            const description = document.getElementById('startup-description').value.trim();
            const industry = document.getElementById('startup-industry').value;
            const fundingStage = document.getElementById('funding-stage').value;
            const fundingAmount = parseFloat(document.getElementById('funding-amount').value);
            const teamSize = parseInt(document.getElementById('team-size').value);
            const foundedYear = parseInt(document.getElementById('founded-year').value);
            const location = document.getElementById('location').value.trim();
            const pitch = document.getElementById('pitch').value.trim();
            
            // Show loading state
            const btnText = document.getElementById('complete-profile-btn-text');
            const btnSpinner = document.getElementById('complete-profile-spinner');
            const submitBtn = document.getElementById('complete-profile-btn');
            
            btnText.textContent = 'Creating profile...';
            btnSpinner.classList.remove('hidden');
            submitBtn.disabled = true;
            
            try {
                // Create startup profile
                const startupProfile = await API.saveStartupProfile({
                    name: startupName,
                    description: description,
                    industry: industry,
                    funding: fundingStage,
                    fundingAmount: fundingAmount,
                    employees: teamSize,
                    founded: foundedYear.toString(),
                    location: location,
                    pitch: pitch
                });
                
                // Show success message
                app.showToast('Startup profile created successfully!', 'success');
                
                // Reload dashboard content
                this.loadDashboardContent(app);
                
            } catch (error) {
                // Show error
                app.showToast(error.message || 'Failed to create startup profile', 'error');
                console.error('Error creating startup profile:', error);
                
                // Reset button state
                btnText.textContent = 'Complete Profile';
                btnSpinner.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    },
    
    /**
     * Setup investor profile completion form
     * @param {App} app - Main application instance
     */
    setupInvestorProfileCompletionForm: function(app) {
        const form = document.getElementById('investor-profile-completion-form');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const firmName = document.getElementById('firm-name').value.trim();
            const position = document.getElementById('position').value.trim();
            
            // Get investment focus (checkboxes)
            const focusCheckboxes = document.querySelectorAll('input[name="investment-focus"]:checked');
            const investmentFocus = Array.from(focusCheckboxes).map(cb => cb.value);
            
            // Get investment stage (checkboxes)
            const stageCheckboxes = document.querySelectorAll('input[name="investment-stage"]:checked');
            const investmentStage = Array.from(stageCheckboxes).map(cb => cb.value);
            
            const minInvestment = parseFloat(document.getElementById('min-investment').value);
            const maxInvestment = parseFloat(document.getElementById('max-investment').value);
            const portfolioSize = parseInt(document.getElementById('portfolio-size').value);
            const location = document.getElementById('investor-location').value.trim();
            const bio = document.getElementById('bio').value.trim();
            
            // Validate required fields
            if (investmentFocus.length === 0) {
                app.showToast('Please select at least one investment focus area', 'error');
                return;
            }
            
            if (investmentStage.length === 0) {
                app.showToast('Please select at least one investment stage', 'error');
                return;
            }
            
            // Show loading state
            const btnText = document.getElementById('complete-investor-profile-btn-text');
            const btnSpinner = document.getElementById('complete-investor-profile-spinner');
            const submitBtn = document.getElementById('complete-investor-profile-btn');
            
            btnText.textContent = 'Creating profile...';
            btnSpinner.classList.remove('hidden');
            submitBtn.disabled = true;
            
            try {
                // Create investor profile
                const investorProfile = await API.saveInvestorProfile({
                    firm: firmName,
                    position: position,
                    focus: investmentFocus,
                    stage: investmentStage,
                    min: minInvestment,
                    max: maxInvestment,
                    portfolioSize: portfolioSize,
                    location: location,
                    bio: bio
                });
                
                // Show success message
                app.showToast('Investor profile created successfully!', 'success');
                
                // Reload dashboard content
                this.loadDashboardContent(app);
                
            } catch (error) {
                // Show error
                app.showToast(error.message || 'Failed to create investor profile', 'error');
                console.error('Error creating investor profile:', error);
                
                // Reset button state
                btnText.textContent = 'Complete Profile';
                btnSpinner.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    },
    
    /**
     * Setup dashboard tabs navigation
     */
    setupDashboardTabs: function() {
        const navLinks = document.querySelectorAll('.dashboard-nav');
        const tabContents = document.querySelectorAll('.dashboard-tab');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get tab ID
                const tabId = link.dataset.tab;
                
                // Remove active class from all links
                navLinks.forEach(item => {
                    item.classList.remove('active', 'text-startup-primary', 'bg-purple-50', 'dark:bg-gray-800');
                    item.classList.add('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
                });
                
                // Add active class to current link
                link.classList.add('active', 'text-startup-primary', 'bg-purple-50', 'dark:bg-gray-800');
                link.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
                
                // Hide all tab contents
                tabContents.forEach(tab => {
                    tab.classList.add('hidden');
                });
                
                // Show current tab content
                document.getElementById(`${tabId}-tab`)?.classList.remove('hidden');
                
                // Load tab content if needed
                this.loadTabContent(tabId);
            });
        });
    },
    
    /**
     * Load tab content as needed
     * @param {string} tabId - Tab ID
     */
    loadTabContent: function(tabId) {
        // Based on tab ID, load specific content
        switch (tabId) {
            case 'profile':
                // Load profile tab content
                this.loadProfileTabContent();
                break;
            case 'matches':
            case 'startups':
                // Load matches/opportunities tab content
                this.loadMatchesTabContent();
                break;
            case 'messages':
                // Load messages tab content
                this.loadMessagesTabContent();
                break;
            case 'connections':
                // Load connections tab content
                this.loadConnectionsTabContent();
                break;
            case 'documents':
                // Load documents tab content
                this.loadDocumentsTabContent();
                break;
            case 'portfolio':
                // Load portfolio tab content
                this.loadPortfolioTabContent();
                break;
            case 'analytics':
                // Load analytics tab content
                this.loadAnalyticsTabContent();
                break;
        }
    },
    
    /**
     * Load profile tab content
     */
    loadProfileTabContent: function() {
        const tabContent = document.getElementById('profile-tab');
        
        if (!tabContent) return;
        
        // Show loading state
        tabContent.innerHTML = `
            <div class="p-6">
                <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Profile</h2>
                <div class="py-4 text-center">
                    <div class="spinner mx-auto mb-4"></div>
                    <p class="text-gray-600 dark:text-gray-300">Loading profile data<span class="loading-dots"></span></p>
                </div>
            </div>
        `;
        
        // Load profile data
        const user = Auth.getCurrentUser();
        
        if (user.userType === 'startup') {
            this.loadStartupProfileTab(tabContent);
        } else if (user.userType === 'investor') {
            this.loadInvestorProfileTab(tabContent);
        }
    },
    
    /**
     * Load startup profile tab content
     * @param {HTMLElement} container - Tab content container
     */
    loadStartupProfileTab: async function(container) {
        try {
            // Load startup profile
            const user = Auth.getCurrentUser();
            const response = await API.getStartupByUserId(user._id);
            const profile = response.startup;
            
            // Render profile form
            container.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white">Edit Startup Profile</h2>
                        <button id="save-startup-profile-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            <span id="save-startup-profile-btn-text">Save Changes</span>
                            <span id="save-startup-profile-spinner" class="spinner ml-2 hidden"></span>
                        </button>
                    </div>
                    
                    <form id="edit-startup-profile-form" class="space-y-6">
                        <input type="hidden" id="startup-id" value="${profile._id}">
                        
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Basic Information</h3>
                            
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="edit-startup-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Startup Name
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-startup-name" name="name" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" value="${profile.name}">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="edit-startup-industry" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Industry
                                    </label>
                                    <div class="mt-1">
                                        <select id="edit-startup-industry" name="industry" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                            <option value="Fintech" ${profile.industry === 'Fintech' ? 'selected' : ''}>Fintech</option>
                                            <option value="Healthcare" ${profile.industry === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
                                            <option value="Education" ${profile.industry === 'Education' ? 'selected' : ''}>Education</option>
                                            <option value="Agriculture" ${profile.industry === 'Agriculture' ? 'selected' : ''}>Agriculture</option>
                                            <option value="Software" ${profile.industry === 'Software' ? 'selected' : ''}>Software</option>
                                            <option value="E-commerce" ${profile.industry === 'E-commerce' ? 'selected' : ''}>E-commerce</option>
                                            <option value="Clean Energy" ${profile.industry === 'Clean Energy' ? 'selected' : ''}>Clean Energy</option>
                                            <option value="Logistics" ${profile.industry === 'Logistics' ? 'selected' : ''}>Logistics</option>
                                            <option value="Food & Beverage" ${profile.industry === 'Food & Beverage' ? 'selected' : ''}>Food & Beverage</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6">
                                <label for="edit-startup-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Short Description
                                </label>
                                <div class="mt-1">
                                    <input id="edit-startup-description" name="description" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="E.g., AI-powered project management tools" value="${profile.description}">
                                </div>
                            </div>
                            
                            <div class="mt-6">
                                <label for="edit-startup-pitch" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Elevator Pitch
                                </label>
                                <div class="mt-1">
                                    <textarea id="edit-startup-pitch" name="pitch" rows="4" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="Describe your startup in a few sentences...">${profile.pitch || ''}</textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Business Details</h3>
                            
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="edit-funding-stage" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Funding Stage
                                    </label>
                                    <div class="mt-1">
                                        <select id="edit-funding-stage" name="funding" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                            <option value="Pre-seed" ${profile.funding === 'Pre-seed' ? 'selected' : ''}>Pre-seed</option>
                                            <option value="Seed" ${profile.funding === 'Seed' ? 'selected' : ''}>Seed</option>
                                            <option value="Series A" ${profile.funding === 'Series A' ? 'selected' : ''}>Series A</option>
                                            <option value="Series B" ${profile.funding === 'Series B' ? 'selected' : ''}>Series B</option>
                                            <option value="Series C" ${profile.funding === 'Series C' ? 'selected' : ''}>Series C</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="edit-funding-amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Funding Raised So Far (USD)
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-funding-amount" name="fundingAmount" type="number" min="0" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="0" value="${profile.fundingAmount || 0}">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="edit-team-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Team Size
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-team-size" name="employees" type="number" min="1" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="1" value="${profile.employees || 1}">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="edit-founded-year" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Founded Year
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-founded-year" name="founded" type="number" min="2000" max="${new Date().getFullYear()}" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="2022" value="${profile.founded || new Date().getFullYear()}">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6">
                                <label for="edit-location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Location
                                </label>
                                <div class="mt-1">
                                    <input id="edit-location" name="location" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="City, Country" value="${profile.location || ''}">
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Online Presence</h3>
                            
                            <div>
                                <label for="edit-website" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Website URL
                                </label>
                                <div class="mt-1">
                                    <input id="edit-website" name="website" type="url" class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="https://example.com" value="${profile.website || ''}">
                                </div>
                            </div>
                            
                            <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="edit-linkedin" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        LinkedIn URL
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-linkedin" name="linkedin" type="url" class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="https://linkedin.com/company/..." value="${profile.socialMedia?.linkedin || ''}">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="edit-twitter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Twitter URL
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-twitter" name="twitter" type="url" class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="https://twitter.com/..." value="${profile.socialMedia?.twitter || ''}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            `;
            
            // Setup form submission
            const form = document.getElementById('edit-startup-profile-form');
            const saveBtn = document.getElementById('save-startup-profile-btn');
            
            if (form && saveBtn) {
                saveBtn.addEventListener('click', async () => {
                    // Show loading state
                    const btnText = document.getElementById('save-startup-profile-btn-text');
                    const btnSpinner = document.getElementById('save-startup-profile-spinner');
                    
                    btnText.textContent = 'Saving...';
                    btnSpinner.classList.remove('hidden');
                    saveBtn.disabled = true;
                    
                    try {
                        // Get form data
                        const startupId = document.getElementById('startup-id').value;
                        const name = document.getElementById('edit-startup-name').value.trim();
                        const industry = document.getElementById('edit-startup-industry').value;
                        const description = document.getElementById('edit-startup-description').value.trim();
                        const pitch = document.getElementById('edit-startup-pitch').value.trim();
                        const funding = document.getElementById('edit-funding-stage').value;
                        const fundingAmount = parseFloat(document.getElementById('edit-funding-amount').value);
                        const employees = parseInt(document.getElementById('edit-team-size').value);
                        const founded = document.getElementById('edit-founded-year').value;
                        const location = document.getElementById('edit-location').value.trim();
                        const website = document.getElementById('edit-website').value.trim();
                        const linkedin = document.getElementById('edit-linkedin').value.trim();
                        const twitter = document.getElementById('edit-twitter').value.trim();
                        
                        // Create social media object
                        const socialMedia = {};
                        if (linkedin) socialMedia.linkedin = linkedin;
                        if (twitter) socialMedia.twitter = twitter;
                        
                        // Update startup profile
                        await API.saveStartupProfile({
                            _id: startupId,
                            name,
                            industry,
                            description,
                            pitch,
                            funding,
                            fundingAmount,
                            employees,
                            founded,
                            location,
                            website,
                            socialMedia
                        });
                        
                        // Show success message
                        app.showToast('Profile updated successfully!', 'success');
                        
                        // Reset button state
                        btnText.textContent = 'Save Changes';
                        btnSpinner.classList.add('hidden');
                        saveBtn.disabled = false;
                        
                    } catch (error) {
                        // Show error
                        app.showToast(error.message || 'Failed to update profile', 'error');
                        console.error('Error updating startup profile:', error);
                        
                        // Reset button state
                        btnText.textContent = 'Save Changes';
                        btnSpinner.classList.add('hidden');
                        saveBtn.disabled = false;
                    }
                });
            }
            
        } catch (error) {
            // Show error in container
            container.innerHTML = `
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Profile</h2>
                    <div class="text-center py-8">
                        <div class="text-red-500 text-5xl mb-4">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h3 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load profile</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            ${error.message || 'An error occurred while loading your profile.'}
                        </p>
                        <button id="retry-profile-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
            
            // Add retry button listener
            document.getElementById('retry-profile-btn')?.addEventListener('click', () => {
                this.loadProfileTabContent();
            });
            
            console.error('Error loading startup profile tab:', error);
        }
    },
    
    /**
     * Load investor profile tab content
     * @param {HTMLElement} container - Tab content container
     */
    loadInvestorProfileTab: async function(container) {
        // Implementation similar to loadStartupProfileTab but for investor profiles
        try {
            // Load investor profile
            const user = Auth.getCurrentUser();
            const response = await API.getInvestorByUserId(user._id);
            const profile = response.investor;
            
            // Render profile form
            container.innerHTML = `
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white">Edit Investor Profile</h2>
                        <button id="save-investor-profile-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            <span id="save-investor-profile-btn-text">Save Changes</span>
                            <span id="save-investor-profile-spinner" class="spinner ml-2 hidden"></span>
                        </button>
                    </div>
                    
                    <form id="edit-investor-profile-form" class="space-y-6">
                        <input type="hidden" id="investor-id" value="${profile._id}">
                        
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Basic Information</h3>
                            
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="edit-firm-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Firm Name (if applicable)
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-firm-name" name="firm" type="text" class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" value="${profile.firm || ''}">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="edit-position" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Position/Title
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-position" name="position" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="E.g., Managing Partner, Angel Investor" value="${profile.position || ''}">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6">
                                <label for="edit-bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Bio/Description
                                </label>
                                <div class="mt-1">
                                    <textarea id="edit-bio" name="bio" rows="4" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="Describe your investment approach and interests...">${profile.bio || ''}</textarea>
                                </div>
                            </div>
                            
                            <div class="mt-6">
                                <label for="edit-location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Location
                                </label>
                                <div class="mt-1">
                                    <input id="edit-location" name="location" type="text" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="City, Country" value="${profile.location || ''}">
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Investment Preferences</h3>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Investment Focus (select multiple)
                                </label>
                                <div class="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-focus-fintech" name="investment-focus" value="Fintech" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.focus && profile.focus.includes('Fintech') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-focus-fintech" class="font-medium text-gray-700 dark:text-gray-300">Fintech</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-focus-healthcare" name="investment-focus" value="Healthcare" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.focus && profile.focus.includes('Healthcare') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-focus-healthcare" class="font-medium text-gray-700 dark:text-gray-300">Healthcare</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-focus-education" name="investment-focus" value="Education" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.focus && profile.focus.includes('Education') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-focus-education" class="font-medium text-gray-700 dark:text-gray-300">Education</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-focus-agriculture" name="investment-focus" value="Agriculture" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.focus && profile.focus.includes('Agriculture') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-focus-agriculture" class="font-medium text-gray-700 dark:text-gray-300">Agriculture</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-focus-software" name="investment-focus" value="Software" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.focus && profile.focus.includes('Software') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-focus-software" class="font-medium text-gray-700 dark:text-gray-300">Software</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-focus-ai" name="investment-focus" value="AI" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.focus && profile.focus.includes('AI') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-focus-ai" class="font-medium text-gray-700 dark:text-gray-300">AI</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-focus-ecommerce" name="investment-focus" value="E-commerce" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.focus && profile.focus.includes('E-commerce') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-focus-ecommerce" class="font-medium text-gray-700 dark:text-gray-300">E-commerce</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-focus-energy" name="investment-focus" value="Energy" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.focus && profile.focus.includes('Energy') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-focus-energy" class="font-medium text-gray-700 dark:text-gray-300">Energy</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Investment Stage (select multiple)
                                </label>
                                <div class="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-stage-preseed" name="investment-stage" value="Pre-seed" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.stage && profile.stage.includes('Pre-seed') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-stage-preseed" class="font-medium text-gray-700 dark:text-gray-300">Pre-seed</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-stage-seed" name="investment-stage" value="Seed" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.stage && profile.stage.includes('Seed') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-stage-seed" class="font-medium text-gray-700 dark:text-gray-300">Seed</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-stage-seriesa" name="investment-stage" value="Series A" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.stage && profile.stage.includes('Series A') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-stage-seriesa" class="font-medium text-gray-700 dark:text-gray-300">Series A</label>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                            <input id="edit-stage-seriesb" name="investment-stage" value="Series B" type="checkbox" class="h-4 w-4 text-startup-primary focus:ring-startup-primary border-gray-300 rounded" ${profile.stage && profile.stage.includes('Series B') ? 'checked' : ''}>
                                        </div>
                                        <div class="ml-3 text-sm">
                                            <label for="edit-stage-seriesb" class="font-medium text-gray-700 dark:text-gray-300">Series B</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="edit-min-investment" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Minimum Investment (USD)
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-min-investment" name="min" type="number" min="0" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="10000" value="${profile.min || 0}">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="edit-max-investment" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Maximum Investment (USD)
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-max-investment" name="max" type="number" min="0" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="100000" value="${profile.max || 0}">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6">
                                <label for="edit-portfolio-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Current Portfolio Size (number of companies)
                                </label>
                                <div class="mt-1">
                                    <input id="edit-portfolio-size" name="portfolioSize" type="number" min="0" required class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="0" value="${profile.portfolioSize || 0}">
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white mb-4">Online Presence</h3>
                            
                            <div>
                                <label for="edit-website" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Website URL
                                </label>
                                <div class="mt-1">
                                    <input id="edit-website" name="website" type="url" class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="https://example.com" value="${profile.website || ''}">
                                </div>
                            </div>
                            
                            <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label for="edit-linkedin" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        LinkedIn URL
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-linkedin" name="linkedin" type="url" class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="https://linkedin.com/in/..." value="${profile.socialMedia?.linkedin || ''}">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="edit-twitter" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Twitter URL
                                    </label>
                                    <div class="mt-1">
                                        <input id="edit-twitter" name="twitter" type="url" class="text-base appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white" placeholder="https://twitter.com/..." value="${profile.socialMedia?.twitter || ''}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            `;
            
            // Setup form submission
            const form = document.getElementById('edit-investor-profile-form');
            const saveBtn = document.getElementById('save-investor-profile-btn');
            
            if (form && saveBtn) {
                saveBtn.addEventListener('click', async () => {
                    // Show loading state
                    const btnText = document.getElementById('save-investor-profile-btn-text');
                    const btnSpinner = document.getElementById('save-investor-profile-spinner');
                    
                    btnText.textContent = 'Saving...';
                    btnSpinner.classList.remove('hidden');
                    saveBtn.disabled = true;
                    
                    try {
                        // Get form data
                        const investorId = document.getElementById('investor-id').value;
                        const firm = document.getElementById('edit-firm-name').value.trim();
                        const position = document.getElementById('edit-position').value.trim();
                        const bio = document.getElementById('edit-bio').value.trim();
                        const location = document.getElementById('edit-location').value.trim();
                        
                        // Get investment focus (checkboxes)
                        const focusCheckboxes = document.querySelectorAll('input[name="investment-focus"]:checked');
                        const focus = Array.from(focusCheckboxes).map(cb => cb.value);
                        
                        // Get investment stage (checkboxes)
                        const stageCheckboxes = document.querySelectorAll('input[name="investment-stage"]:checked');
                        const stage = Array.from(stageCheckboxes).map(cb => cb.value);
                        
                        const min = parseFloat(document.getElementById('edit-min-investment').value);
                        const max = parseFloat(document.getElementById('edit-max-investment').value);
                        const portfolioSize = parseInt(document.getElementById('edit-portfolio-size').value);
                        const website = document.getElementById('edit-website').value.trim();
                        const linkedin = document.getElementById('edit-linkedin').value.trim();
                        const twitter = document.getElementById('edit-twitter').value.trim();
                        
                        // Create social media object
                        const socialMedia = {};
                        if (linkedin) socialMedia.linkedin = linkedin;
                        if (twitter) socialMedia.twitter = twitter;
                        
                        // Validate required fields
                        if (focus.length === 0) {
                            app.showToast('Please select at least one investment focus area', 'error');
                            
                            // Reset button state
                            btnText.textContent = 'Save Changes';
                            btnSpinner.classList.add('hidden');
                            saveBtn.disabled = false;
                            
                            return;
                        }
                        
                        if (stage.length === 0) {
                            app.showToast('Please select at least one investment stage', 'error');
                            
                            // Reset button state
                            btnText.textContent = 'Save Changes';
                            btnSpinner.classList.add('hidden');
                            saveBtn.disabled = false;
                            
                            return;
                        }
                        
                        // Update investor profile
                        await API.saveInvestorProfile({
                            _id: investorId,
                            firm,
                            position,
                            bio,
                            location,
                            focus,
                            stage,
                            min,
                            max,
                            portfolioSize,
                            website,
                            socialMedia
                        });
                        
                        // Show success message
                        app.showToast('Profile updated successfully!', 'success');
                        
                        // Reset button state
                        btnText.textContent = 'Save Changes';
                        btnSpinner.classList.add('hidden');
                        saveBtn.disabled = false;
                        
                    } catch (error) {
                        // Show error
                        app.showToast(error.message || 'Failed to update profile', 'error');
                        console.error('Error updating investor profile:', error);
                        
                        // Reset button state
                        btnText.textContent = 'Save Changes';
                        btnSpinner.classList.add('hidden');
                        saveBtn.disabled = false;
                    }
                });
            }
            
        } catch (error) {
            // Show error in container
            container.innerHTML = `
                <div class="p-6">
                    <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-6">Profile</h2>
                    <div class="text-center py-8">
                        <div class="text-red-500 text-5xl mb-4">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h3 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load profile</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            ${error.message || 'An error occurred while loading your profile.'}
                        </p>
                        <button id="retry-profile-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
            
            // Add retry button listener
            document.getElementById('retry-profile-btn')?.addEventListener('click', () => {
                this.loadProfileTabContent();
            });
            
            console.error('Error loading investor profile tab:', error);
        }
    },
    
    loadMatchesTabContent: async function() {
        const container = document.getElementById('matches-tab-content');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
            <div class="py-20 text-center">
                <div class="spinner mx-auto mb-4"></div>
                <p class="text-gray-600 dark:text-gray-300">Loading matches<span class="loading-dots"></span></p>
            </div>
        `;

        try {
            // Get matches from API
            const matches = await API.getMatches();

            if (matches.length === 0) {
                // Show empty state
                container.innerHTML = `
                    <div class="py-20 text-center">
                        <div class="text-gray-400 text-5xl mb-4">
                            <i class="fas fa-handshake"></i>
                        </div>
                        <h3 class="text-xl font-bold text-startup-dark dark:text-white mb-2">No matches found</h3>
                        <p class="text-gray-600 dark:text-gray-300">Update your preferences to find matching startups.</p>
                    </div>
                `;
                return;
            }

            // Render matches
            container.innerHTML = `
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    ${matches.map(match => `
                        <div class="startup-card bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden" data-id="${match._id}">
                            <div class="p-6">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h3 class="text-xl font-bold text-startup-dark dark:text-white">${match.name}</h3>
                                        <p class="text-gray-500 dark:text-gray-400">${match.location}</p>
                                    </div>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-startup-primary">
                                        ${match.industry}
                                    </span>
                                </div>
                                <p class="mt-4 text-gray-600 dark:text-gray-300">${match.description}</p>
                                <div class="mt-6">
                                    <button class="view-startup-btn px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90 w-full" data-id="${match._id}">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            // Attach event listeners
            this.attachStartupCardListeners();

        } catch (error) {
            // Show error state
            container.innerHTML = `
                <div class="py-20 text-center">
                    <div class="text-red-500 text-5xl mb-4">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h3 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load matches</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">${error.message || 'An error occurred while fetching matches.'}</p>
                    <button id="retry-matches-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                        Try Again
                    </button>
                </div>
            `;

            // Add retry button listener
            document.getElementById('retry-matches-btn')?.addEventListener('click', () => {
                this.loadMatchesTabContent();
            });

            console.error('Error loading matches:', error);
        }
    },

    /**
     * Set up startup dashboard event listeners
     * @param {App} app - Main application instance
     * @param {Object} profile - Startup profile data
     */
    setupStartupDashboardEventListeners: function(app, profile) {
        // Dashboard navigation handled by setupDashboardTabs
        
        // Complete profile button
        const completeProfileBtn = document.getElementById('complete-profile-items-btn');
        if (completeProfileBtn) {
            completeProfileBtn.addEventListener('click', () => {
                // Navigate to profile tab
                document.querySelector('.dashboard-nav[data-tab="profile"]')?.click();
            });
        }
        
        // View all investors button
        const viewAllInvestorsBtn = document.getElementById('view-all-investors-btn');
        if (viewAllInvestorsBtn) {
            viewAllInvestorsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                app.navigateTo('investors');
            });
        }
        
        // Connect with investor buttons
        document.querySelectorAll('.investor-connect-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const investorId = e.target.dataset.id;
                
                // Show loading state
                const originalText = e.target.innerHTML;
                e.target.innerHTML = `
                    <span class="spinner inline-block mr-1"></span>
                    Connecting...
                `;
                e.target.disabled = true;
                
                try {
                    // Send connection request
                    await API.sendConnectionRequest(investorId);
                    
                    // Show success message
                    app.showToast('Connection request sent!', 'success');
                    
                    // Update button
                    e.target.innerHTML = `<i class="fas fa-check mr-1"></i> Sent`;
                    e.target.classList.remove('bg-startup-primary');
                    e.target.classList.add('bg-green-500');
                    e.target.disabled = true;
                } catch (error) {
                    // Show error
                    app.showToast(error.message || 'Failed to send connection request', 'error');
                    console.error('Error sending connection request:', error);
                    
                    // Restore button
                    e.target.innerHTML = originalText;
                    e.target.disabled = false;
                }
            });
        });
        
        // Investor details buttons
        document.querySelectorAll('.investor-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const investorId = e.target.dataset.id;
                InvestorsPage.showInvestorDetails(investorId);
            });
        });
        
        // Retry suggestions button
        const retrySuggestionsBtn = document.getElementById('retry-suggestions-btn');
        if (retrySuggestionsBtn) {
            retrySuggestionsBtn.addEventListener('click', () => {
                this.loadSuggestedInvestors(profile._id);
            });
        }
    },
    
    /**
     * Set up investor dashboard event listeners
     * @param {App} app - Main application instance
     * @param {Object} profile - Investor profile data
     */
    setupInvestorDashboardEventListeners: function(app, profile) {
        // Dashboard navigation handled by setupDashboardTabs
        
        // Complete profile button
        const completeProfileBtn = document.getElementById('complete-investor-profile-items-btn');
        if (completeProfileBtn) {
            completeProfileBtn.addEventListener('click', () => {
                // Navigate to profile tab
                document.querySelector('.dashboard-nav[data-tab="profile"]')?.click();
            });
        }
        
        // View all startups button
        const viewAllStartupsBtn = document.getElementById('view-all-startups-btn');
        if (viewAllStartupsBtn) {
            viewAllStartupsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                app.navigateTo('startups');
            });
        }
        
        // Connect with startup buttons
        document.querySelectorAll('.startup-connect-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const startupId = e.target.dataset.id;
                
                // Show loading state
                const originalText = e.target.innerHTML;
                e.target.innerHTML = `
                    <span class="spinner inline-block mr-1"></span>
                    Connecting...
                `;
                e.target.disabled = true;
                
                try {
                    // Send connection request
                    await API.sendConnectionRequest(startupId);
                    
                    // Show success message
                    app.showToast('Connection request sent!', 'success');
                    
                    // Update button
                    e.target.innerHTML = `<i class="fas fa-check mr-1"></i> Sent`;
                    e.target.classList.remove('bg-startup-primary');
                    e.target.classList.add('bg-green-500');
                    e.target.disabled = true;
                } catch (error) {
                    // Show error
                    app.showToast(error.message || 'Failed to send connection request', 'error');
                    console.error('Error sending connection request:', error);
                    
                    // Restore button
                    e.target.innerHTML = originalText;
                    e.target.disabled = false;
                }
            });
        });
        
        // Startup details buttons
        document.querySelectorAll('.startup-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const startupId = e.target.dataset.id;
                StartupsPage.showStartupDetails(startupId);
            });
        });
        
        // Retry suggestions button
        const retryStartupSuggestionsBtn = document.getElementById('retry-startup-suggestions-btn');
        if (retryStartupSuggestionsBtn) {
            retryStartupSuggestionsBtn.addEventListener('click', () => {
                this.loadSuggestedStartups(profile._id);
            });
        }
    },
    
    // Additional tab content loading methods would be implemented here
    // (loadMessagesTabContent, loadConnectionsTabContent, etc.)
};