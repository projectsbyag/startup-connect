/**
 * Main Application
 */
class App {
    constructor() {
        this.currentPage = 'home';
        this.pageHistory = [];
        
        // Initialize app when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }
    
    /**
     * Initialize the application
     */
    init() {
        // Check URL hash for page
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.navigateTo(hash);
        } else {
            this.loadPage('home');
        }
        
        // Setup event listeners for navigation
        this.setupEventListeners();
        
        // Listen for authentication changes
        Auth.addAuthListener(this.handleAuthChange.bind(this));
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-nav').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // User menu toggle
        const userMenuButton = document.getElementById('user-menu-button');
        const userDropdownMenu = document.getElementById('user-dropdown-menu');
        const authButtons = document.getElementById('auth-buttons');
        
        if (userMenuButton) {
            userMenuButton.addEventListener('click', () => {
                userDropdownMenu.classList.toggle('hidden');
            });
            
            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                    userDropdownMenu.classList.add('hidden');
                }
            });
        }

        // Handle login success
        document.addEventListener('loginSuccess', () => {
            if (authButtons) {
                authButtons.classList.add('hidden');
                document.getElementById('user-menu-container')?.classList.remove('hidden');
                document.getElementById('mobile-auth-buttons')?.classList.add('hidden');
                document.getElementById('mobile-user-menu')?.classList.remove('hidden');
            }
        });

        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuButton?.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Auth menu functionality
        this.setupAuthEventListeners();
    }
    
    /**
     * Set up authentication related event listeners
     */
    setupAuthEventListeners() {
        // Login button clicks
        document.getElementById('login-btn').addEventListener('click', () => {
            document.getElementById('login-modal').classList.remove('hidden');
        });
        
        document.getElementById('mobile-login-btn')?.addEventListener('click', () => {
            document.getElementById('login-modal').classList.remove('hidden');
            document.getElementById('mobile-menu').classList.add('hidden');
        });
        
        // Signup button clicks
        document.getElementById('signup-btn').addEventListener('click', () => {
            document.getElementById('signup-modal').classList.remove('hidden');
        });
        
        document.getElementById('mobile-signup-btn')?.addEventListener('click', () => {
            document.getElementById('signup-modal').classList.remove('hidden');
            document.getElementById('mobile-menu').classList.add('hidden');
        });
        
        // Close modal buttons
        document.querySelectorAll('.login-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('login-modal').classList.add('hidden');
            });
        });
        
        document.querySelectorAll('.signup-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('signup-modal').classList.add('hidden');
            });
        });
        
        // Switch between login and signup
        document.getElementById('switch-to-signup').addEventListener('click', () => {
            document.getElementById('login-modal').classList.add('hidden');
            document.getElementById('signup-modal').classList.remove('hidden');
        });
        
        document.getElementById('switch-to-login').addEventListener('click', () => {
            document.getElementById('signup-modal').classList.add('hidden');
            document.getElementById('login-modal').classList.remove('hidden');
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('login-modal')) {
                document.getElementById('login-modal').classList.add('hidden');
            }
            if (e.target === document.getElementById('signup-modal')) {
                document.getElementById('signup-modal').classList.add('hidden');
            }
        });
        
        // Form submissions
        document.getElementById('login-form').addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('signup-form').addEventListener('submit', this.handleSignup.bind(this));
        
        // Logout
        document.getElementById('logout-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
            document.getElementById('user-dropdown-menu').classList.add('hidden');
        });
        
        document.getElementById('mobile-logout-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
            document.getElementById('user-dropdown-menu').classList.add('hidden');
        });
        
        // User menu navigation
        document.getElementById('dashboard-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('dashboard');
            document.getElementById('user-dropdown-menu').classList.add('hidden');
        });
        
        document.getElementById('profile-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('profile');
            document.getElementById('user-dropdown-menu').classList.add('hidden');
        });
        
        document.getElementById('settings-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('settings');
            document.getElementById('user-dropdown-menu').classList.add('hidden');
        });
        
        document.getElementById('mobile-dashboard-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('dashboard');
            document.getElementById('mobile-menu').classList.add('hidden');
        });
        
        document.getElementById('mobile-profile-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('profile');
            document.getElementById('mobile-menu').classList.add('hidden');
        });
        
        document.getElementById('mobile-settings-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('settings');
            document.getElementById('mobile-menu').classList.add('hidden');
        });
    }
    
    /**
     * Handle login form submission
     * @param {Event} e - Form submit event
     */
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Show loading state
        document.getElementById('login-btn-text').textContent = 'Signing in';
        document.getElementById('login-spinner').classList.remove('hidden');
        document.getElementById('login-submit-btn').disabled = true;
        
        try {
            await Auth.login({ email, password });

           document.dispatchEvent(new Event('user:login'));
           document.dispatchEvent(new Event('loginSuccess'));
            // Close modal
            document.getElementById('login-modal').classList.add('hidden');
            
            // Hide auth buttons and show user menu
            document.getElementById('auth-buttons').classList.add('hidden');
            
            document.getElementById('user-menu-container').classList.remove('hidden');
            document.getElementById('mobile-auth-buttons')?.classList.add('hidden');
            document.getElementById('mobile-user-menu')?.classList.remove('hidden');
            
            // Show success message
            this.showToast('Logged in successfully!', 'success');
            
            // Navigate to dashboard
            this.navigateTo('dashboard');
        } catch (error) {
            // Show error
            this.showToast(error.message || 'Login failed', 'error');
        } finally {
            // Reset form state
            document.getElementById('login-btn-text').textContent = 'Sign in';
            document.getElementById('login-spinner').classList.add('hidden');
            document.getElementById('login-submit-btn').disabled = false;
        }
    }
    
    /**
     * Handle signup form submission
     * @param {Event} e - Form submit event
     */
    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const type = document.querySelector('input[name="account-type"]:checked').value;
        const termsAccepted = document.getElementById('terms').checked;
        
        if (!termsAccepted) {
            this.showToast('Please accept the Terms of Service and Privacy Policy', 'error');
            return;
        }
        
        // Show loading state
        document.getElementById('signup-btn-text').textContent = 'Creating account';
        document.getElementById('signup-spinner').classList.remove('hidden');
        document.getElementById('signup-submit-btn').disabled = true;
        
        try {
            await Auth.register({
                name,
                email,
                password,
                userType: type
            });
        
        document.dispatchEvent(new Event('user:signup'));
        document.dispatchEvent(new Event('loginSuccess'));
            // Close modal
            document.getElementById('signup-modal').classList.add('hidden');
            
            
            // Show success message
            this.showToast('Account created successfully!', 'success');
            
            // Navigate to dashboard
            this.navigateTo('dashboard');
        } catch (error) {
            // Show error
            this.showToast(error.message || 'Registration failed', 'error');
        } finally {
            // Reset form state
            document.getElementById('signup-btn-text').textContent = 'Create account';
            document.getElementById('signup-spinner').classList.add('hidden');
            document.getElementById('signup-submit-btn').disabled = false;
        }
    }
    
    /**
     * Logout the current user
     */
    logout() {
        Auth.logout();
        
        // Show success message
        this.showToast('Logged out successfully!', 'success');
        
        // Navigate to home
        this.navigateTo('home');
        document.getElementById('login-btn').classList.remove('hidden');
        document.getElementById('signup-btn').classList.remove('hidden');
        document.getElementById('user-menu-button').classList.add('hidden');
        document.getElementById('user-menu-container').classList.add('hidden');
        document.getElementById('user-dropdown-menu')?.classList.remove('hidden');
    }
    
    /**
     * Handle authentication state change
     * @param {boolean} isAuthenticated - Authentication status
     * @param {Object|null} user - User data or null
     */
    handleAuthChange(isAuthenticated, user) {
        this.updateAuthUI(isAuthenticated, user);
        
        // If on a protected page and logged out, redirect to home
        const authRequired = ['dashboard', 'profile', 'settings'];
        if (!isAuthenticated && authRequired.includes(this.currentPage)) {
            this.navigateTo('home');
        }
    }
    
    /**
     * Update UI based on authentication state
     * @param {boolean} isAuthenticated - Authentication status
     * @param {Object|null} user - User data or null
     */
    updateAuthUI(isAuthenticated, user) {
        // Update elements visibility based on auth state
        if (isAuthenticated && user) {
            // Hide auth buttons, show user menu
            document.getElementById('auth-buttons').classList.add('hidden');
            document.getElementById('user-menu-button').classList.remove('hidden');
            document.getElementById('login-btn').classList.add('hidden');
            document.getElementById('signup-btn').classList.add('hidden');
            
            // Mobile menu
            document.getElementById('mobile-auth-buttons')?.classList.add('hidden');
            document.getElementById('mobile-user-menu')?.classList.remove('hidden');
            
            // Update user initials and info
            const initials = user.name ? 
            user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
            user.email?.charAt(0).toUpperCase() || 'U';
            
            document.getElementById('user-initials').textContent = initials;
            document.getElementById('mobile-user-initials').textContent = initials;
            document.getElementById('mobile-user-name').textContent = user.name;
            document.getElementById('mobile-user-email').textContent = user.email;
        } else {
            // Show auth buttons, hide user menu
            document.getElementById('auth-buttons').classList.remove('hidden');
            document.getElementById('user-menu-button').classList.add('hidden');
            
            // Mobile menu
            document.getElementById('mobile-auth-buttons')?.classList.remove('hidden');
            document.getElementById('mobile-user-menu')?.classList.add('hidden');
        }
    }
    
    /**
     * Navigate to a page
     * @param {string} page - Page name
     */
    navigateTo(page) {
        // Don't reload if already on the page
        if (this.currentPage === page) return;
        
        // Store current page in history
        this.pageHistory.push(this.currentPage);
        
        // Update hash for bookmarking
        window.location.hash = page;
        
        // Load new page
        this.loadPage(page);
    }
    
    /**
     * Go back to previous page
     */
    goBack() {
        if (this.pageHistory.length > 0) {
            const prevPage = this.pageHistory.pop();
            this.loadPage(prevPage);
            window.location.hash = prevPage;
        }
    }
    
    /**
     * Load a page
     * @param {string} page - Page name
     */
    loadPage(page) {
        const contentElement = document.getElementById('page-content');
        
        // Fade out current content
        contentElement.classList.remove('fade-in');
        contentElement.classList.add('fade-out');
        
        // Check auth requirements
        const authRequired = ['dashboard', 'profile', 'settings'];
        if (authRequired.includes(page) && !Auth.isUserAuthenticated()) {
            // Redirect to login if auth required but not logged in
            this.showToast('Please log in to access this page', 'info');
            document.getElementById('login-modal').classList.remove('hidden');
            this.loadPage('home');
            return;
        }
        
        // Update navigation highlighting
        this.updateNavHighlight(page);
        
        // Update current page
        this.currentPage = page;
        
        // Load page content after short delay for transition
        setTimeout(() => {
            // Clear current content
            contentElement.innerHTML = this.getPageContent(page);
            
            // Setup page-specific event handlers
            this.setupPageEventListeners(page);
            
            // Fade in new content
            contentElement.classList.remove('fade-out');
            contentElement.classList.add('fade-in');
        }, 300);
    }
    
    /**
     * Update navigation highlight based on current page
     * @param {string} page - Current page
     */
    updateNavHighlight(page) {
        // Desktop nav
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('border-startup-primary', 'text-startup-primary');
                link.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-300');
            } else {
                link.classList.remove('border-startup-primary', 'text-startup-primary');
                link.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-300');
            }
        });
        
        // Mobile nav
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('bg-startup-primary', 'text-white');
                link.classList.remove('hover:bg-gray-100', 'dark:hover:bg-gray-800');
            } else {
                link.classList.remove('bg-startup-primary', 'text-white');
                link.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-800');
            }
        });
    }
    
    /**
     * Get page content HTML
     * @param {string} page - Page name
     * @returns {string} - HTML content
     */
    getPageContent(page) {
        switch (page) {
            case 'home':
                return PageTemplates.home();
            case 'startups':
                return PageTemplates.startups();
            case 'investors':
                return PageTemplates.investors();
            case 'about':
                return PageTemplates.about();
            case 'dashboard':
                return PageTemplates.dashboard();
            case 'profile':
                return PageTemplates.profile();
            case 'settings':
                return PageTemplates.settings();
            case 'faq':
                return PageTemplates.faq();
            case 'blog':
                return PageTemplates.blog();
            case 'terms':
                return PageTemplates.terms();
            case 'privacy':
                return PageTemplates.privacy();
            default:
                return this.renderNotFoundPage();
        }
    }
    
    /**
     * Set up page-specific event listeners
     * @param {string} page - Current page
     */
    setupPageEventListeners(page) {
        // Generic page setup
        const heroStartupBtn = document.getElementById('hero-startup-btn');
        const heroInvestorBtn = document.getElementById('hero-investor-btn');
        
        if (heroStartupBtn) {
            heroStartupBtn.addEventListener('click', () => {
                if (Auth.isUserAuthenticated()) {
                    this.navigateTo('dashboard');
                } else {
                    document.getElementById('signup-modal').classList.remove('hidden');
                    document.getElementById('account-startup').checked = true;
                }
            });
        }
        
        if (heroInvestorBtn) {
            heroInvestorBtn.addEventListener('click', () => {
                if (Auth.isUserAuthenticated()) {
                    this.navigateTo('dashboard');
                } else {
                    document.getElementById('signup-modal').classList.remove('hidden');
                    document.getElementById('account-investor').checked = true;
                }
            });
        }
        
        // Register startup/investor buttons
        const registerStartupBtn = document.getElementById('register-startup-btn');
        if (registerStartupBtn) {
            registerStartupBtn.addEventListener('click', () => {
                if (Auth.isUserAuthenticated()) {
                    this.navigateTo('dashboard');
                } else {
                    document.getElementById('signup-modal').classList.remove('hidden');
                    document.getElementById('account-startup').checked = true;
                }
            });
        }
        
        const registerInvestorBtn = document.getElementById('register-investor-btn');
        if (registerInvestorBtn) {
            registerInvestorBtn.addEventListener('click', () => {
                if (Auth.isUserAuthenticated()) {
                    this.navigateTo('dashboard');
                } else {
                    document.getElementById('signup-modal').classList.remove('hidden');
                    document.getElementById('account-investor').checked = true;
                }
            });
        }
        
        // Call to action button
        const ctaSignupBtn = document.getElementById('cta-signup-btn');
        if (ctaSignupBtn) {
            ctaSignupBtn.addEventListener('click', () => {
                if (Auth.isUserAuthenticated()) {
                    this.navigateTo('dashboard');
                } else {
                    document.getElementById('signup-modal').classList.remove('hidden');
                }
            });
        }
        
        // Page-specific setup
        switch (page) {
            case 'startups':
                StartupsPage.setupEventListeners(this);
                break;
            case 'investors':
                InvestorsPage.setupEventListeners(this);
                break;
            case 'dashboard':
                DashboardPage.setupEventListeners(this);
                break;
            
            case 'profile':
                ProfilePage.setupEventListeners(this);
                break;
            case 'settings':
                SettingsPage.setupEventListeners(this);
                break;
        }
    }
    
    /**
     * Show toast notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type: success, error, info
     */
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast';
        toast.classList.add(type);
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            // Remove the toast element after the fade-out animation (300ms)
            setTimeout(() => {
                toast.textContent = '';
                toast.className = 'toast';
                // Query and update auth buttons visibility
            }, 300);
        }, 3000);
    }
    
    /**
     * Render 404 Not Found page
     * @returns {string} - HTML content
     */
    renderNotFoundPage() {
        return `
            <div class="flex items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-gray-900">
                <div class="text-center">
                    <h1 class="text-6xl font-bold text-startup-primary">404</h1>
                    <h2 class="text-3xl font-semibold text-startup-dark dark:text-white mt-4">Page Not Found</h2>
                    <p class="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <button onclick="app.navigateTo('home')" class="mt-8 px-6 py-3 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                        Return to Home
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize app
const app = new App();

// Import page modules

// Page Templates object - imported from separate files
const PageTemplates = {
    home: function() {
        return /* HTML content from the template */`
            <!-- Hero Section -->
            <div class="relative bg-white dark:bg-startup-dark">
                <div class="max-w-7xl mx-auto">
                    <div class="relative z-10 pt-14 lg:w-full">
                        <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
                            <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                                <h1 class="text-4xl font-bold tracking-tight text-startup-dark dark:text-white sm:text-6xl">
                                    Connect. Invest. Grow.
                                </h1>
                                <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                    StartupConnect bridges the gap between innovative startups and forward-thinking investors. 
                                    Revolutionizing fundraising in Nigeria and beyond.
                                </p>
                                <div class="mt-10 flex items-center gap-x-6">
                                    <button id="hero-startup-btn" class="rounded-md bg-startup-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                                        I'm a Startup
                                    </button>
                                    <button id="hero-investor-btn" class="rounded-md bg-white dark:bg-startup-dark border border-startup-primary px-6 py-3 text-base font-semibold text-startup-primary shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                        I'm an Investor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Section -->
            <div class="py-12 bg-gray-50 dark:bg-gray-900">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="lg:text-center">
                        <h2 class="text-base text-startup-primary font-semibold tracking-wide uppercase">Features</h2>
                        <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-startup-dark dark:text-white sm:text-4xl">
                            A better way to connect
                        </p>
                        <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                            Our platform provides powerful tools for both startups and investors.
                        </p>
                    </div>

                    <div class="mt-10">
                        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 bg-startup-primary rounded-md p-3">
                                        <i class="fas fa-search text-white"></i>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg leading-6 font-medium text-startup-dark dark:text-white">Intelligent Matching</h3>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <p class="text-md text-gray-500 dark:text-gray-300">
                                        Our algorithm connects startups with investors based on industry, funding stage, and investment criteria.
                                    </p>
                                </div>
                            </div>

                            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 bg-startup-primary rounded-md p-3">
                                        <i class="fas fa-chart-line text-white"></i>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg leading-6 font-medium text-startup-dark dark:text-white">Startup Analytics</h3>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <p class="text-md text-gray-500 dark:text-gray-300">
                                        Comprehensive analytics and metrics to help investors evaluate potential opportunities.
                                    </p>
                                </div>
                            </div>

                            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 bg-startup-primary rounded-md p-3">
                                        <i class="fas fa-comments text-white"></i>
                                    </div>
                                    <div class="ml-4">
                                        <h3 class="text-lg leading-6 font-medium text-startup-dark dark:text-white">Secure Messaging</h3>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <p class="text-md text-gray-500 dark:text-gray-300">
                                        Direct communication between startups and investors in a secure environment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics Section -->
            <div class="py-12 bg-white dark:bg-startup-dark">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div class="text-center">
                            <span class="text-4xl font-extrabold text-startup-primary">500+</span>
                            <p class="mt-2 text-lg text-gray-500 dark:text-gray-300">Startups</p>
                        </div>
                        <div class="text-center">
                            <span class="text-4xl font-extrabold text-startup-primary">200+</span>
                            <p class="mt-2 text-lg text-gray-500 dark:text-gray-300">Investors</p>
                        </div>
                        <div class="text-center">
                            <span class="text-4xl font-extrabold text-startup-primary">$10M+</span>
                            <p class="mt-2 text-lg text-gray-500 dark:text-gray-300">Funding Facilitated</p>
                        </div>
                        <div class="text-center">
                            <span class="text-4xl font-extrabold text-startup-primary">15+</span>
                            <p class="mt-2 text-lg text-gray-500 dark:text-gray-300">Industries</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- How It Works Section -->
            <div class="py-12 bg-gray-50 dark:bg-gray-900">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="lg:text-center">
                        <h2 class="text-base text-startup-primary font-semibold tracking-wide uppercase">Process</h2>
                        <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-startup-dark dark:text-white sm:text-4xl">
                            How It Works
                        </p>
                    </div>

                    <div class="mt-10">
                        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2">
                            <!-- For Startups -->
                            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6">
                                <h3 class="text-2xl font-bold text-startup-dark dark:text-white mb-4">For Startups</h3>
                                <ol class="list-decimal list-inside space-y-4">
                                    <li class="text-gray-500 dark:text-gray-300">
                                        <span class="font-medium text-startup-dark dark:text-white">Create a profile</span> - Showcase your startup's vision, team, traction, and funding needs.
                                    </li>
                                    <li class="text-gray-500 dark:text-gray-300">
                                        <span class="font-medium text-startup-dark dark:text-white">Get discovered</span> - Our matching algorithm connects you with interested investors.
                                    </li>
                                    <li class="text-gray-500 dark:text-gray-300">
                                        <span class="font-medium text-startup-dark dark:text-white">Engage</span> - Communicate directly with investors through our secure messaging system.
                                    </li>
                                    <li class="text-gray-500 dark:text-gray-300">
                                        <span class="font-medium text-startup-dark dark:text-white">Close deals</span> - Finalize investments and grow your business.
                                    </li>
                                </ol>
                                <button id="register-startup-btn" class="mt-6 px-6 py-3 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                                    Register as a Startup
                                </button>
                            </div>

                            <!-- For Investors -->
                            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6">
                                <h3 class="text-2xl font-bold text-startup-dark dark:text-white mb-4">For Investors</h3>
                                <ol class="list-decimal list-inside space-y-4">
                                    <li class="text-gray-500 dark:text-gray-300">
                                        <span class="font-medium text-startup-dark dark:text-white">Create a profile</span> - Specify your investment criteria, interests, and experience.
                                    </li>
                                    <li class="text-gray-500 dark:text-gray-300">
                                        <span class="font-medium text-startup-dark dark:text-white">Discover startups</span> - Browse startups or receive AI-matched recommendations.
                                    </li>
                                    <li class="text-gray-500 dark:text-gray-300">
                                        <span class="font-medium text-startup-dark dark:text-white">Due diligence</span> - Access detailed analytics and documentation for potential investments.
                                    </li>
                                    <li class="text-gray-500 dark:text-gray-300">
                                        <span class="font-medium text-startup-dark dark:text-white">Invest</span> - Connect with founders and finalize investments securely.
                                    </li>
                                </ol>
                                <button id="register-investor-btn" class="mt-6 px-6 py-3 border border-startup-primary text-startup-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    Register as an Investor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Testimonials -->
            <div class="py-12 bg-white dark:bg-startup-dark">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="lg:text-center mb-10">
                        <h2 class="text-base text-startup-primary font-semibold tracking-wide uppercase">Testimonials</h2>
                        <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-startup-dark dark:text-white sm:text-4xl">
                            What Our Users Say
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div class="flex items-center mb-4">
                                <div class="h-12 w-12 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                    <span>JO</span>
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-bold text-startup-dark dark:text-white">James Ojo</h4>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Founder, TechInnovate</p>
                                </div>
                            </div>
                            <p class="text-gray-600 dark:text-gray-300">
                                "StartupConnect helped us secure our seed round in just 3 months. The platform's matching algorithm connected us with investors who perfectly aligned with our vision."
                            </p>
                            <div class="mt-4 flex text-startup-primary">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div class="flex items-center mb-4">
                                <div class="h-12 w-12 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                    <span>SA</span>
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-bold text-startup-dark dark:text-white">Sarah Adeyemi</h4>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Managing Partner, Impact Fund Africa</p>
                                </div>
                            </div>
                            <p class="text-gray-600 dark:text-gray-300">
                                "As an investor, I've found StartupConnect to be invaluable for discovering promising startups in Africa. The detailed analytics and secure communication channels streamline our due diligence process."
                            </p>
                            <div class="mt-4 flex text-startup-primary">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                        
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <div class="flex items-center mb-4">
                                <div class="h-12 w-12 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                    <span>DK</span>
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-bold text-startup-dark dark:text-white">David Kamau</h4>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">CEO, FinPay</p>
                                </div>
                            </div>
                            <p class="text-gray-600 dark:text-gray-300">
                                "The platform's user-friendly interface made it easy to showcase our startup's potential. Within weeks, we were in talks with multiple investors who understood our mission to promote financial inclusion."
                            </p>
                            <div class="mt-4 flex text-startup-primary">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Call to Action -->
            <div class="py-12 bg-startup-primary">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-white mb-4">Ready to transform your startup journey?</h2>
                        <p class="text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto">
                            Join StartupConnect today and connect with a network of investors and startups pushing boundaries.
                        </p>
                        <button id="cta-signup-btn" class="px-8 py-3 bg-white text-startup-primary font-bold rounded-md hover:bg-gray-100 transition-colors">
                            Get Started Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Other page templates will be defined in their respective files
    startups: function() {
        return StartupsPage.render();
    },
    investors: function() {
        return InvestorsPage.render();
    },
    dashboard: function() {
        return DashboardPage.render();
    },
    about: function() {
        // About page template
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white">About StartupConnect</h1>
                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Our mission is to bridge the funding gap for African startups and connect them with investors who believe in their vision.
                        </p>
                    </div>
                    
                    <!-- Our Story -->
                    <div class="mt-12 bg-white dark:bg-gray-800 shadow rounded-lg p-8">
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-4">Our Story</h2>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">
                            StartupConnect was born out of a simple observation: despite the incredible innovation happening across Africa, many startups struggle to connect with investors who can provide the capital and mentorship they need to grow.
                        </p>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">
                            Founded in 2022 by a team of entrepreneurs and investors who experienced these challenges firsthand, we set out to build a platform that makes fundraising more efficient, transparent, and accessible.
                        </p>
                        <p class="text-gray-600 dark:text-gray-300">
                            Today, StartupConnect is the leading platform connecting African startups with global investors, facilitating millions in investments and helping build the future of African innovation.
                        </p>
                    </div>
                    
                    <!-- Team -->
                    <div class="mt-12">
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-8 text-center">Our Team</h2>
                        
                        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                                <div class="mx-auto h-24 w-24 rounded-full bg-startup-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                                    AA
                                </div>
                                <h3 class="text-xl font-bold text-startup-dark dark:text-white">Adebayo Adeyemi</h3>
                                <p class="text-startup-primary font-medium">CEO & Co-founder</p>
                                <p class="mt-4 text-gray-600 dark:text-gray-300">
                                    Serial entrepreneur with 15+ years of experience building tech companies in Africa. Previously founded two successful startups.
                                </p>
                            </div>
                            
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                                <div class="mx-auto h-24 w-24 rounded-full bg-startup-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                                    NM
                                </div>
                                <h3 class="text-xl font-bold text-startup-dark dark:text-white">Ngozi Mbeki</h3>
                                <p class="text-startup-primary font-medium">CTO & Co-founder</p>
                                <p class="mt-4 text-gray-600 dark:text-gray-300">
                                    Software engineer with background at Google and Microsoft. Passionate about building technology that empowers African entrepreneurs.
                                </p>
                            </div>
                            
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
                                <div class="mx-auto h-24 w-24 rounded-full bg-startup-primary text-white flex items-center justify-center text-2xl font-bold mb-4">
                                    RK
                                </div>
                                <h3 class="text-xl font-bold text-startup-dark dark:text-white">Rolake Kalu</h3>
                                <p class="text-startup-primary font-medium">Head of Investments</p>
                                <p class="mt-4 text-gray-600 dark:text-gray-300">
                                    Former investment banker with 10+ years of experience in venture capital. Expert in startup valuation and growth strategies.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Our Values -->
                    <div class="mt-12">
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white mb-8 text-center">Our Values</h2>
                        
                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div class="flex items-center mb-4">
                                    <div class="flex-shrink-0 bg-startup-primary rounded-md p-3">
                                        <i class="fas fa-handshake text-white"></i>
                                    </div>
                                    <h3 class="ml-4 text-lg font-bold text-startup-dark dark:text-white">Trust</h3>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300">
                                    We build trust through transparency, integrity, and security in all our operations.
                                </p>
                            </div>
                            
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div class="flex items-center mb-4">
                                    <div class="flex-shrink-0 bg-startup-primary rounded-md p-3">
                                        <i class="fas fa-rocket text-white"></i>
                                    </div>
                                    <h3 class="ml-4 text-lg font-bold text-startup-dark dark:text-white">Innovation</h3>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300">
                                    We embrace innovation and are constantly improving our platform to better serve our users.
                                </p>
                            </div>
                            
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div class="flex items-center mb-4">
                                    <div class="flex-shrink-0 bg-startup-primary rounded-md p-3">
                                        <i class="fas fa-globe-africa text-white"></i>
                                    </div>
                                    <h3 class="ml-4 text-lg font-bold text-startup-dark dark:text-white">Impact</h3>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300">
                                    We are committed to driving positive economic impact across Africa through entrepreneurship.
                                </p>
                            </div>
                            
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <div class="flex items-center mb-4">
                                    <div class="flex-shrink-0 bg-startup-primary rounded-md p-3">
                                        <i class="fas fa-users text-white"></i>
                                    </div>
                                    <h3 class="ml-4 text-lg font-bold text-startup-dark dark:text-white">Community</h3>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300">
                                    We foster a supportive community of founders, investors, and partners who help each other succeed.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Contact CTA -->
                    <div class="mt-12 bg-startup-primary text-white rounded-lg p-8 text-center">
                        <h2 class="text-2xl font-bold mb-4">Have questions?</h2>
                        <p class="text-lg mb-6 max-w-2xl mx-auto">
                            We'd love to hear from you! Reach out to our team with any questions about StartupConnect.
                        </p>
                        <button class="px-6 py-3 bg-white text-startup-primary font-bold rounded-md hover:bg-gray-100 transition-colors">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    profile: function() {
        return ProfilePage.render();
    },
    settings: function() {
        return SettingsPage.render();
    },
    faq: function() {
        // FAQ page template
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white">Frequently Asked Questions</h1>
                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Find answers to common questions about StartupConnect.
                        </p>
                    </div>
                    
                    <div class="mt-12 max-w-3xl mx-auto">
                        <div class="space-y-6">
                            <!-- FAQ Item -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                                <button class="faq-question w-full px-6 py-4 text-left focus:outline-none">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg font-medium text-startup-dark dark:text-white">Is StartupConnect free to use?</h3>
                                        <i class="fas fa-chevron-down text-startup-primary"></i>
                                    </div>
                                </button>
                                <div class="faq-answer px-6 py-4 bg-gray-50 dark:bg-gray-700 hidden">
                                    <p class="text-gray-600 dark:text-gray-300">
                                        StartupConnect offers both free and premium plans. The basic plan is free and allows startups to create profiles and connect with a limited number of investors. Premium plans offer additional features such as advanced analytics, priority matching, and increased visibility to investors.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- FAQ Item -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                                <button class="faq-question w-full px-6 py-4 text-left focus:outline-none">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg font-medium text-startup-dark dark:text-white">How does the matching algorithm work?</h3>
                                        <i class="fas fa-chevron-down text-startup-primary"></i>
                                    </div>
                                </button>
                                <div class="faq-answer px-6 py-4 bg-gray-50 dark:bg-gray-700 hidden">
                                    <p class="text-gray-600 dark:text-gray-300">
                                        Our proprietary matching algorithm analyzes multiple data points including industry, funding stage, investment criteria, location preferences, and growth metrics. It then identifies the most compatible startup-investor matches based on these factors. The algorithm continuously learns and improves based on user interactions and feedback.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- FAQ Item -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                                <button class="faq-question w-full px-6 py-4 text-left focus:outline-none">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg font-medium text-startup-dark dark:text-white">Does StartupConnect facilitate the actual investment process?</h3>
                                        <i class="fas fa-chevron-down text-startup-primary"></i>
                                    </div>
                                </button>
                                <div class="faq-answer px-6 py-4 bg-gray-50 dark:bg-gray-700 hidden">
                                    <p class="text-gray-600 dark:text-gray-300">
                                        StartupConnect primarily focuses on connecting startups with potential investors and providing a platform for communication and due diligence. While we don't directly handle the transfer of funds or legal documentation, we do provide guidance and resources to help both parties navigate the investment process. For premium users, we offer access to a network of legal and financial advisors who can assist with the final stages of investment.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- FAQ Item -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                                <button class="faq-question w-full px-6 py-4 text-left focus:outline-none">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg font-medium text-startup-dark dark:text-white">How does StartupConnect verify startups and investors?</h3>
                                        <i class="fas fa-chevron-down text-startup-primary"></i>
                                    </div>
                                </button>
                                <div class="faq-answer px-6 py-4 bg-gray-50 dark:bg-gray-700 hidden">
                                    <p class="text-gray-600 dark:text-gray-300">
                                        We implement a rigorous verification process for both startups and investors. For startups, we verify business registration, founder identities, and basic financial information. For investors, we verify identity, investment history, and accreditation status where applicable. This helps ensure a trustworthy ecosystem for all users.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- FAQ Item -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                                <button class="faq-question w-full px-6 py-4 text-left focus:outline-none">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg font-medium text-startup-dark dark:text-white">Is my data secure on StartupConnect?</h3>
                                        <i class="fas fa-chevron-down text-startup-primary"></i>
                                    </div>
                                </button>
                                <div class="faq-answer px-6 py-4 bg-gray-50 dark:bg-gray-700 hidden">
                                    <p class="text-gray-600 dark:text-gray-300">
                                        Absolutely. We take data security very seriously. All data is encrypted both in transit and at rest. We implement industry-standard security protocols and regular security audits. Our platform complies with GDPR and other relevant data protection regulations. Users have full control over what information they share and with whom.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- FAQ Item -->
                            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                                <button class="faq-question w-full px-6 py-4 text-left focus:outline-none">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-lg font-medium text-startup-dark dark:text-white">What kind of startups and investors are on the platform?</h3>
                                        <i class="fas fa-chevron-down text-startup-primary"></i>
                                    </div>
                                </button>
                                <div class="faq-answer px-6 py-4 bg-gray-50 dark:bg-gray-700 hidden">
                                    <p class="text-gray-600 dark:text-gray-300">
                                        StartupConnect hosts a diverse ecosystem of startups and investors. Our startups range from pre-seed to Series B across industries including fintech, healthtech, agritech, edtech, e-commerce, and more. Our investor community includes angel investors, venture capital firms, impact investors, and corporate venture arms looking to invest in African innovation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    blog: function() {
        // Blog page template
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white">Blog</h1>
                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Insights, updates, and stories from the African startup ecosystem
                        </p>
                    </div>
                    
                    <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <!-- Blog Post -->
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div class="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                <i class="fas fa-image text-gray-400 text-4xl"></i>
                            </div>
                            <div class="p-6">
                                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-startup-primary">
                                    Startup Tips
                                </span>
                                <h2 class="mt-3 text-xl font-bold text-startup-dark dark:text-white">Building a Strong Pitch Deck for African Investors</h2>
                                <p class="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
                                    Learn how to create a compelling pitch deck that resonates with investors focused on African markets. From highlighting unique market opportunities to addressing region-specific challenges...
                                </p>
                                <div class="mt-4 flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="h-10 w-10 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                            <span>AA</span>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm font-medium text-startup-dark dark:text-white">Adebayo Adeyemi</p>
                                        <div class="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                            <time datetime="2023-06-15">June 15, 2023</time>
                                            <span aria-hidden="true">&middot;</span>
                                            <span>8 min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Blog Post -->
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div class="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                <i class="fas fa-image text-gray-400 text-4xl"></i>
                            </div>
                            <div class="p-6">
                                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    Investor Insights
                                </span>
                                <h2 class="mt-3 text-xl font-bold text-startup-dark dark:text-white">Due Diligence: What African Investors Look For</h2>
                                <p class="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
                                    An in-depth look at how investors evaluate African startups. From market size analysis to understanding regulatory environments and assessing team capabilities...
                                </p>
                                <div class="mt-4 flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="h-10 w-10 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                            <span>RK</span>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm font-medium text-startup-dark dark:text-white">Rolake Kalu</p>
                                        <div class="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                            <time datetime="2023-05-22">May 22, 2023</time>
                                            <span aria-hidden="true">&middot;</span>
                                            <span>10 min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Blog Post -->
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div class="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                <i class="fas fa-image text-gray-400 text-4xl"></i>
                            </div>
                            <div class="p-6">
                                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    Success Stories
                                </span>
                                <h2 class="mt-3 text-xl font-bold text-startup-dark dark:text-white">From Lagos to Global: The HealthConnect Journey</h2>
                                <p class="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
                                    How a Nigerian healthtech startup secured $2M in funding and expanded to 5 countries. This case study examines the challenges faced, strategies employed...
                                </p>
                                <div class="mt-4 flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="h-10 w-10 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                            <span>NM</span>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm font-medium text-startup-dark dark:text-white">Ngozi Mbeki</p>
                                        <div class="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                            <time datetime="2023-04-10">April 10, 2023</time>
                                            <span aria-hidden="true">&middot;</span>
                                            <span>12 min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Newsletter -->
                    <div class="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                        <div class="max-w-md mx-auto">
                            <h2 class="text-2xl font-bold text-startup-dark dark:text-white text-center">Subscribe to Our Newsletter</h2>
                            <p class="mt-2 text-gray-600 dark:text-gray-300 text-center">
                                Get the latest insights and updates delivered to your inbox.
                            </p>
                            <form class="mt-6">
                                <div class="flex">
                                    <input type="email" placeholder="Your email address" required class="text-base flex-1 appearance-none px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                    <button type="submit" class="flex-shrink-0 px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                        Subscribe
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    terms: function() {
        // Terms of Service page template
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="max-w-3xl mx-auto">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white">Terms of Service</h1>
                        <p class="mt-4 text-gray-600 dark:text-gray-300">Last updated: June 1, 2023</p>
                        
                        <div class="mt-8 prose prose-startup dark:prose-invert max-w-none">
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to StartupConnect. These Terms of Service ("Terms") govern your access to and use of the StartupConnect platform, including any content, functionality, and services offered on or through our website (the "Service").
                            </p>
                            <p>
                                Please read these Terms carefully before using our Service. By using StartupConnect, you agree to be bound and abide by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use our Service.
                            </p>
                            
                            <h2>2. Eligibility</h2>
                            <p>
                                You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
                            </p>
                            <p>
                                If you are using the Service on behalf of a company, organization, or other legal entity, you represent and warrant that you have the authority to bind such entity to these Terms, in which case the term "you" shall refer to such entity.
                            </p>
                            
                            <h2>3. Account Registration</h2>
                            <p>
                                To access certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information and to keep this information updated.
                            </p>
                            <p>
                                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access to or use of your account.
                            </p>
                            <p>
                                We reserve the right to disable any user account at any time if, in our opinion, you have violated any provision of these Terms.
                            </p>
                            
                            <h2>4. User Conduct</h2>
                            <p>
                                You agree not to:
                            </p>
                            <ul>
                                <li>Use the Service in any way that violates applicable laws or regulations</li>
                                <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity</li>
                                <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                                <li>Use the Service to transmit any material that is unlawful, harassing, defamatory, abusive, threatening, or harmful</li>
                                <li>Attempt to gain unauthorized access to any portion of the Service or any other systems or networks connected to the Service</li>
                                <li>Use the Service for any fraudulent or deceptive purpose</li>
                                <li>Collect or store personal data about other users without their consent</li>
                            </ul>
                            
                            <h2>5. Intellectual Property</h2>
                            <p>
                                The Service and its original content, features, and functionality are and will remain the exclusive property of StartupConnect and its licensors. The Service is protected by copyright, trademark, and other laws of both Nigeria and foreign countries.
                            </p>
                            <p>
                                You are granted a limited, non-exclusive, non-transferable, and revocable license to use the Service for its intended purposes subject to these Terms.
                            </p>
                            
                            <h2>6. User Content</h2>
                            <p>
                                "User Content" means any content that users submit, post, or display on or through the Service. You retain all rights in, and are solely responsible for, the User Content you post to StartupConnect.
                            </p>
                            <p>
                                By posting User Content, you grant StartupConnect a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, modify, publicly display, reproduce, and distribute such content on and through the Service.
                            </p>
                            <p>
                                You represent and warrant that:
                            </p>
                            <ul>
                                <li>You own or have the right to use and authorize StartupConnect to use your User Content</li>
                                <li>Your User Content does not violate the rights of any third party, including intellectual property rights and privacy rights</li>
                                <li>Your User Content complies with these Terms and applicable laws</li>
                            </ul>
                            
                            <h2>7. Confidentiality</h2>
                            <p>
                                You acknowledge that the Service involves the exchange of sensitive and confidential information between startups and investors. You agree to:
                            </p>
                            <ul>
                                <li>Keep confidential any non-public information you receive through the Service</li>
                                <li>Not use confidential information for any purpose outside the scope of the Service</li>
                                <li>Take reasonable measures to protect the confidentiality of such information</li>
                            </ul>
                            
                            <h2>8. Disclaimer of Warranties</h2>
                            <p>
                                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, STARTUPCONNECT DISCLAIMS ALL WARRANTIES, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                            </p>
                            <p>
                                STARTUPCONNECT DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
                            </p>
                            
                            <h2>9. Limitation of Liability</h2>
                            <p>
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, STARTUPCONNECT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF THE SERVICE.
                            </p>
                            <p>
                                IN NO EVENT SHALL STARTUPCONNECT'S TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE SERVICE.
                            </p>
                            
                            <h2>10. Indemnification</h2>
                            <p>
                                You agree to indemnify, defend, and hold harmless StartupConnect and its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any rights of another.
                            </p>
                            
                            <h2>11. Governing Law and Jurisdiction</h2>
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction of the courts located in Lagos, Nigeria for the resolution of any disputes arising from these Terms or your use of the Service.
                            </p>
                            
                            <h2>12. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
                            </p>
                            
                            <h2>13. Termination</h2>
                            <p>
                                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
                            </p>
                            
                            <h2>14. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <p>
                                StartupConnect<br>
                                Email: legal@startupconnect.com<br>
                                Address: 123 Innovation Street, Lagos, Nigeria
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    privacy: function() {
        // Privacy Policy page template
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="max-w-3xl mx-auto">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white">Privacy Policy</h1>
                        <p class="mt-4 text-gray-600 dark:text-gray-300">Last updated: June 1, 2023</p>
                        
                        <div class="mt-8 prose prose-startup dark:prose-invert max-w-none">
                            <h2>1. Introduction</h2>
                            <p>
                                At StartupConnect, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                            </p>
                            <p>
                                Please read this Privacy Policy carefully. By accessing or using StartupConnect, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree, you must not access or use our platform.
                            </p>
                            
                            <h2>2. Information We Collect</h2>
                            <h3>2.1 Personal Information</h3>
                            <p>
                                We may collect personal information that you voluntarily provide when using our Service, including:
                            </p>
                            <ul>
                                <li>Contact information (name, email address, phone number)</li>
                                <li>Account credentials (username, password)</li>
                                <li>Profile information (professional background, experience, education)</li>
                                <li>Business information (company name, role, industry, business stage)</li>
                                <li>Financial information (for investors: investment criteria, portfolio size; for startups: funding needs, financial metrics)</li>
                                <li>Documents you upload (pitch decks, business plans, financial statements)</li>
                                <li>Communication data (messages sent through our platform)</li>
                            </ul>
                            
                            <h3>2.2 Automatically Collected Information</h3>
                            <p>
                                When you access or use our Service, we may automatically collect:
                            </p>
                            <ul>
                                <li>Device information (IP address, browser type, operating system)</li>
                                <li>Usage data (pages visited, time spent, clicks, interactions)</li>
                                <li>Location data (country, city)</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                            
                            <h2>3. How We Use Your Information</h2>
                            <p>
                                We may use the information we collect for various purposes, including to:
                            </p>
                            <ul>
                                <li>Provide, maintain, and improve our Service</li>
                                <li>Process and complete transactions</li>
                                <li>Match startups with relevant investors and vice versa</li>
                                <li>Send administrative information, updates, and promotional communications</li>
                                <li>Respond to your inquiries and provide customer support</li>
                                <li>Monitor and analyze usage patterns and trends</li>
                                <li>Detect, prevent, and address technical issues, fraud, or illegal activities</li>
                                <li>Comply with legal obligations</li>
                                <li>Personalize your experience on our platform</li>
                            </ul>
                            
                            <h2>4. Sharing Your Information</h2>
                            <p>
                                We may share your information in the following circumstances:
                            </p>
                            <ul>
                                <li><strong>With Other Users:</strong> Information you provide in your profile or communications may be shared with other users as part of the core functionality of our platform. Startups and investors can view each other's profiles based on matching criteria and mutual interest.</li>
                                <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, service providers, and contractors who perform services on our behalf.</li>
                                <li><strong>For Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                                <li><strong>For Legal Compliance:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                                <li><strong>With Your Consent:</strong> We may share your information with other third parties with your explicit consent.</li>
                            </ul>
                            
                            <h2>5. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect the information we collect and store. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                            </p>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials and for restricting access to your computer or device. We urge you to be careful about sharing sensitive information through our platform.
                            </p>
                            
                            <h2>6. Data Retention</h2>
                            <p>
                                We will retain your information only for as long as necessary to fulfill the purposes for which it was collected, including to comply with our legal obligations, resolve disputes, and enforce our agreements.
                            </p>
                            
                            <h2>7. Your Rights and Choices</h2>
                            <p>
                                Depending on your location, you may have certain rights regarding your personal information, including:
                            </p>
                            <ul>
                                <li>Access, update, or delete your personal information</li>
                                <li>Object to or restrict the processing of your information</li>
                                <li>Data portability (receiving a copy of your information)</li>
                                <li>Withdraw consent where processing is based on consent</li>
                            </ul>
                            <p>
                                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
                            </p>
                            
                            <h2>8. International Data Transfers</h2>
                            <p>
                                Your information may be transferred to and processed in countries other than the one in which you reside. These countries may have data protection laws that differ from those in your country.
                            </p>
                            <p>
                                By using our Service, you consent to the transfer of your information to countries outside your country of residence, including Nigeria, where our primary servers are located.
                            </p>
                            
                            <h2>9. Children's Privacy</h2>
                            <p>
                                Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.
                            </p>
                            
                            <h2>10. Changes to This Privacy Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on this page with an updated "Last updated" date. Your continued use of the Service after such changes constitutes your acceptance of the updated Privacy Policy.
                            </p>
                            
                            <h2>11. Contact Us</h2>
                            <p>
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
                            </p>
                            <p>
                                StartupConnect<br>
                                Email: privacy@startupconnect.com<br>
                                Address: 123 Innovation Street, Lagos, Nigeria
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
};