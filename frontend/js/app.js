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
    async init() {
        // Wait for Auth to be available
        await this.waitForAuth();
        
        // Update Auth UI state
        this.updateAuthUI();

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
     * Wait for Auth to be available (global object from auth.js)
     */
    waitForAuth() {
        return new Promise((resolve) => {
            if (window.Auth) {
                resolve();
            } else {
                const checkAuth = setInterval(() => {
                    if (window.Auth) {
                        clearInterval(checkAuth);
                        resolve();
                    }
                }, 100);
            }
        });
    }
    
    /**
     * Handle authentication state changes
     */
    handleAuthChange() {
        this.updateAuthUI();
        this.loadPage(this.currentPage);
    }

    /**
     * Update Navbar UI according to Auth State
     */
    updateAuthUI() {
        const isAuthenticated = Auth && Auth.isUserAuthenticated();
        const user = Auth ? Auth.getCurrentUser() : null;

        const authButtons = document.getElementById('auth-buttons');
        const userMenuContainer = document.getElementById('user-menu-container');
        const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
        const mobileUserMenu = document.getElementById('mobile-user-menu');

        const userInitials = document.getElementById('user-initials');
        const mobileUserInitials = document.getElementById('mobile-user-initials');
        const mobileUserName = document.getElementById('mobile-user-name');
        const mobileUserEmail = document.getElementById('mobile-user-email');

        if (isAuthenticated && user) {
            // Hide login & signup buttons
            if (authButtons) {
                authButtons.classList.add('hidden');
                authButtons.classList.remove('sm:flex');
            }
            if (mobileAuthButtons) mobileAuthButtons.classList.add('hidden');

            // Show user profile menu
            if (userMenuContainer) {
                userMenuContainer.classList.remove('hidden');
                userMenuContainer.classList.add('sm:flex');
            }
            if (mobileUserMenu) mobileUserMenu.classList.remove('hidden');

            // Set user initials & details
            const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '<i class="fas fa-user"></i>';
            if (userInitials) userInitials.innerHTML = initials;
            if (mobileUserInitials) mobileUserInitials.innerHTML = initials;
            if (mobileUserName) mobileUserName.textContent = user.name || 'User';
            if (mobileUserEmail) mobileUserEmail.textContent = user.email || '';
        } else {
            // Show login & signup buttons
            if (authButtons) {
                authButtons.classList.remove('hidden');
                authButtons.classList.add('sm:flex');
            }
            if (mobileAuthButtons) mobileAuthButtons.classList.remove('hidden');

            // Hide user profile menu
            if (userMenuContainer) {
                userMenuContainer.classList.add('hidden');
                userMenuContainer.classList.remove('sm:flex');
            }
            if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
        }
    }
    
    /**
     * Navigate to a different page
     * @param {string} page - Page name
     */
    navigateTo(page) {
        // Update URL hash
        window.location.hash = page;
        this.loadPage(page);
    }
    
    showLoginModal() {
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        if (signupModal) signupModal.classList.add('hidden');
        if (loginModal) loginModal.classList.remove('hidden');
    }

    showSignupModal() {
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        if (loginModal) loginModal.classList.add('hidden');
        if (signupModal) signupModal.classList.remove('hidden');
    }

    hideModals() {
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        if (loginModal) loginModal.classList.add('hidden');
        if (signupModal) signupModal.classList.add('hidden');
    }
    
    /**
     * Load and render a page
     * @param {string} page - Page name
     */
    async loadPage(page) {
        const container = document.getElementById('page-content');
        
        if (!container) {
            console.error('Page content container not found');
            return;
        }
        
        // Fade out
        container.style.opacity = '0';
        
        setTimeout(() => {
            // Check authentication for protected pages
            if (['dashboard', 'profile', 'settings'].includes(page) && !Auth.isUserAuthenticated()) {
                page = 'home';
            }
            
            // Get and render page content
            const html = this.getPageContent(page);
            container.innerHTML = html;
            
            // Update current page
            this.currentPage = page;
            
            // Update nav active state
            this.updateNavActive(page);
            
            // Setup page-specific event listeners
            this.setupPageEventListeners(page);
            
            // Fade in
            container.style.opacity = '1';
        }, 150);
    }
    
    /**
     * Update navigation active state
     * @param {string} page - Current page
     */
    updateNavActive(page) {
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === page) {
                link.classList.add('border-startup-primary', 'text-startup-primary', 'font-semibold');
                link.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-300', 'bg-startup-primary');
            } else {
                link.classList.remove('border-startup-primary', 'text-startup-primary', 'font-semibold', 'bg-startup-primary');
                link.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-300');
            }
        });
    }
    
    /**
     * Setup main event listeners for navigation
     */
    setupEventListeners() {
        // Nav link listeners
        document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-nav').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
        
        // Auth modal helper functions
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');

        const showLoginModal = () => {
            if (signupModal) signupModal.classList.add('hidden');
            if (loginModal) loginModal.classList.remove('hidden');
        };

        const showSignupModal = () => {
            if (loginModal) loginModal.classList.add('hidden');
            if (signupModal) signupModal.classList.remove('hidden');
        };

        const hideModals = () => {
            if (loginModal) loginModal.classList.add('hidden');
            if (signupModal) signupModal.classList.add('hidden');
        };

        // User Profile Dropdown Toggle
        const userMenuButton = document.getElementById('user-menu-button');
        const userDropdownMenu = document.getElementById('user-dropdown-menu');

        if (userMenuButton && userDropdownMenu) {
            userMenuButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                userDropdownMenu.classList.toggle('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                    userDropdownMenu.classList.add('hidden');
                }
            });
        }

        // Profile Menu Links Navigation
        const profileLink = document.getElementById('profile-link');
        const dashboardLink = document.getElementById('dashboard-link');
        const settingsLink = document.getElementById('settings-link');
        const logoutLink = document.getElementById('logout-link');

        const mobileProfileLink = document.getElementById('mobile-profile-link');
        const mobileDashboardLink = document.getElementById('mobile-dashboard-link');
        const mobileSettingsLink = document.getElementById('mobile-settings-link');
        const mobileLogoutLink = document.getElementById('mobile-logout-link');

        const handleUserNav = (page) => {
            if (userDropdownMenu) userDropdownMenu.classList.add('hidden');
            this.navigateTo(page);
        };

        const handleLogout = async () => {
            if (userDropdownMenu) userDropdownMenu.classList.add('hidden');
            await Auth.logout();
            this.showToast('Logged out successfully', 'info');
            this.navigateTo('home');
        };

        if (profileLink) profileLink.addEventListener('click', (e) => { e.preventDefault(); handleUserNav('profile'); });
        if (dashboardLink) dashboardLink.addEventListener('click', (e) => { e.preventDefault(); handleUserNav('dashboard'); });
        if (settingsLink) settingsLink.addEventListener('click', (e) => { e.preventDefault(); handleUserNav('settings'); });
        if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });

        if (mobileProfileLink) mobileProfileLink.addEventListener('click', (e) => { e.preventDefault(); handleUserNav('profile'); });
        if (mobileDashboardLink) mobileDashboardLink.addEventListener('click', (e) => { e.preventDefault(); handleUserNav('dashboard'); });
        if (mobileSettingsLink) mobileSettingsLink.addEventListener('click', (e) => { e.preventDefault(); handleUserNav('settings'); });
        if (mobileLogoutLink) mobileLogoutLink.addEventListener('click', (e) => { e.preventDefault(); handleLogout(); });

        // Auth button listeners
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const mobileSignupBtn = document.getElementById('mobile-signup-btn');
        
        if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
        if (signupBtn) signupBtn.addEventListener('click', showSignupModal);
        if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', showLoginModal);
        if (mobileSignupBtn) mobileSignupBtn.addEventListener('click', showSignupModal);

        // Modal Close buttons (X exit buttons)
        document.querySelectorAll('.login-close-btn').forEach(btn => {
            btn.addEventListener('click', hideModals);
        });

        document.querySelectorAll('.signup-close-btn').forEach(btn => {
            btn.addEventListener('click', hideModals);
        });

        // Switch between login and signup modals
        const switchToSignup = document.getElementById('switch-to-signup');
        const switchToLogin = document.getElementById('switch-to-login');

        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                showSignupModal();
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                showLoginModal();
            });
        }

        // Close modal on backdrop click
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal || e.target.classList.contains('opacity-75')) {
                    hideModals();
                }
            });
        }

        if (signupModal) {
            signupModal.addEventListener('click', (e) => {
                if (e.target === signupModal || e.target.classList.contains('opacity-75')) {
                    hideModals();
                }
            });
        }

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideModals();
            }
        });

        // Login form submission handler
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                const submitBtn = document.getElementById('login-submit-btn');
                const btnText = document.getElementById('login-btn-text');
                const spinner = document.getElementById('login-spinner');

                if (!emailInput || !passwordInput) return;

                const email = emailInput.value.trim();
                const password = passwordInput.value;

                try {
                    if (submitBtn) submitBtn.disabled = true;
                    if (btnText) btnText.textContent = 'Signing in...';
                    if (spinner) spinner.classList.remove('hidden');

                    await Auth.login({ email, password });

                    hideModals();
                    loginForm.reset();
                    this.showToast('Successfully logged in!', 'success');
                    this.navigateTo('dashboard');
                } catch (error) {
                    console.error('Login submit error:', error);
                    this.showToast(error.message || 'Login failed. Please check your credentials.', 'error');
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnText) btnText.textContent = 'Sign in';
                    if (spinner) spinner.classList.add('hidden');
                }
            });
        }

        // Signup form submission handler
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('name');
                const emailInput = document.getElementById('signup-email');
                const passwordInput = document.getElementById('signup-password');
                const accountTypeInput = document.querySelector('input[name="account-type"]:checked');
                const submitBtn = document.getElementById('signup-submit-btn');
                const btnText = document.getElementById('signup-btn-text');
                const spinner = document.getElementById('signup-spinner');

                if (!nameInput || !emailInput || !passwordInput) return;

                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const role = accountTypeInput ? accountTypeInput.value : 'startup';

                try {
                    if (submitBtn) submitBtn.disabled = true;
                    if (btnText) btnText.textContent = 'Creating account...';
                    if (spinner) spinner.classList.remove('hidden');

                    await Auth.register({ name, email, password, userType: role, role });

                    hideModals();
                    signupForm.reset();
                    this.showToast('Account created successfully!', 'success');
                    this.navigateTo('dashboard');
                } catch (error) {
                    console.error('Signup submit error:', error);
                    this.showToast(error.message || 'Registration failed. Please try again.', 'error');
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnText) btnText.textContent = 'Create account';
                    if (spinner) spinner.classList.add('hidden');
                }
            });
        }
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
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
                if (window.Auth && Auth.isUserAuthenticated()) {
                    this.navigateTo('dashboard');
                } else {
                    document.getElementById('signup-modal').classList.remove('hidden');
                    document.getElementById('account-startup').checked = true;
                }
            });
        }
        
        if (heroInvestorBtn) {
            heroInvestorBtn.addEventListener('click', () => {
                if (window.Auth && Auth.isUserAuthenticated()) {
                    this.navigateTo('dashboard');
                } else {
                    document.getElementById('signup-modal').classList.remove('hidden');
                    document.getElementById('account-investor').checked = true;
                }
            });
        }

        const landingStartupTab = document.getElementById('landing-startup-tab');
        const landingInvestorTab = document.getElementById('landing-investor-tab');
        const landingJourneyContent = document.getElementById('landing-journey-content');

        const setLandingMode = (mode) => {
            if (landingJourneyContent) {
                landingJourneyContent.innerHTML = renderLandingJourneyContent(mode);
            }

            if (landingStartupTab && landingInvestorTab) {
                const activeClasses = ['bg-startup-primary', 'text-white', 'shadow-sm'];
                const inactiveClasses = ['text-gray-600', 'dark:text-gray-300'];

                if (mode === 'startup') {
                    landingStartupTab.classList.add(...activeClasses);
                    landingStartupTab.classList.remove(...inactiveClasses);
                    landingInvestorTab.classList.remove(...activeClasses);
                    landingInvestorTab.classList.add(...inactiveClasses);
                } else {
                    landingInvestorTab.classList.add(...activeClasses);
                    landingInvestorTab.classList.remove(...inactiveClasses);
                    landingStartupTab.classList.remove(...activeClasses);
                    landingStartupTab.classList.add(...inactiveClasses);
                }
            }
        };

        if (landingStartupTab) {
            landingStartupTab.addEventListener('click', () => setLandingMode('startup'));
        }

        if (landingInvestorTab) {
            landingInvestorTab.addEventListener('click', () => setLandingMode('investor'));
        }

        setLandingMode('startup');
        
        // Register startup/investor buttons
        const registerStartupBtn = document.getElementById('register-startup-btn');
        if (registerStartupBtn) {
            registerStartupBtn.addEventListener('click', () => {
                if (window.Auth && Auth.isUserAuthenticated()) {
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
                if (window.Auth && Auth.isUserAuthenticated()) {
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
                if (window.Auth && Auth.isUserAuthenticated()) {
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
            setTimeout(() => {
                toast.textContent = '';
                toast.className = 'toast';
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

// Page Templates object
const PageTemplates = {
    home: function() {
        return `
            <div class="overflow-x-hidden bg-white dark:bg-startup-dark">
                <section class="relative overflow-hidden">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(93,92,222,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(76,205,196,0.12),_transparent_28%)]"></div>
                    <div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                        <div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
                            <div class="max-w-2xl">
                                <div class="inline-flex items-center gap-2 rounded-full border border-startup-primary/15 bg-startup-primary/10 px-4 py-2 text-sm font-medium text-startup-primary">
                                    <span class="h-2 w-2 rounded-full bg-startup-accent"></span>
                                    Trusted marketplace for founders and capital
                                </div>
                                <h1 class="mt-6 text-4xl font-bold tracking-tight text-startup-dark dark:text-white sm:text-6xl">
                                    Connect. Invest. Grow.
                                </h1>
                                <p class="mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                                    StartupConnect helps startups present better and helps investors source faster, with a polished flow for discovery, diligence, and deal execution.
                                </p>
                                <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <button id="hero-startup-btn" class="rounded-xl bg-startup-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-[0_16px_36px_rgba(93,92,222,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                                        I'm a Startup
                                    </button>
                                    <button id="hero-investor-btn" class="rounded-xl bg-white dark:bg-startup-dark border border-startup-primary px-6 py-3 text-base font-semibold text-startup-primary shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-[0_16px_36px_rgba(93,92,222,0.16)] hover:bg-gray-50 dark:hover:bg-gray-800">
                                        I'm an Investor
                                    </button>
                                </div>
                                <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-4 shadow-sm">
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Vetted startups</p>
                                        <p class="mt-2 text-2xl font-bold text-startup-dark dark:text-white">500+</p>
                                    </div>
                                    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-4 shadow-sm">
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Investor network</p>
                                        <p class="mt-2 text-2xl font-bold text-startup-dark dark:text-white">200+</p>
                                    </div>
                                    <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-4 shadow-sm">
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Funding facilitated</p>
                                        <p class="mt-2 text-2xl font-bold text-startup-dark dark:text-white">$10M+</p>
                                    </div>
                                </div>
                            </div>

                            <div class="hidden lg:flex justify-center">
                                <div class="relative w-full max-w-xl rounded-[2rem] border border-white/60 dark:border-white/10 bg-white/70 dark:bg-gray-800/60 backdrop-blur-2xl shadow-[0_30px_90px_rgba(15,23,42,0.12)] p-6">
                                    <div class="absolute -top-6 right-10 h-24 w-24 rounded-full bg-startup-accent/20 blur-3xl"></div>
                                    <div class="absolute -bottom-8 left-8 h-24 w-24 rounded-full bg-startup-primary/15 blur-3xl"></div>
                                    <div class="flex items-center justify-between gap-4">
                                        <div>
                                            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-startup-primary">StartupConnect</p>
                                            <h2 class="mt-2 text-2xl font-bold text-startup-dark dark:text-white">Investor-ready dashboard preview</h2>
                                        </div>
                                        <div class="rounded-full border border-startup-primary/15 bg-startup-primary/10 px-3 py-1 text-xs font-semibold text-startup-primary">Live</div>
                                    </div>
                                    <div class="mt-6 grid grid-cols-2 gap-4">
                                        <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/85 dark:bg-gray-900/70 p-4">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Qualified leads</p>
                                            <p class="mt-3 text-3xl font-bold text-startup-dark dark:text-white">128</p>
                                            <p class="mt-2 text-sm text-emerald-600">+18% this month</p>
                                        </div>
                                        <div class="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/85 dark:bg-gray-900/70 p-4">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Avg. response</p>
                                            <p class="mt-3 text-3xl font-bold text-startup-dark dark:text-white">2.4h</p>
                                            <p class="mt-2 text-sm text-emerald-600">Faster follow-ups</p>
                                        </div>
                                    </div>
                                    <div class="mt-4 rounded-3xl bg-startup-dark dark:bg-black/35 p-5 text-white">
                                        <div class="flex items-end gap-3 h-36 sm:h-40">
                                            <div class="flex-1 h-16 rounded-t-2xl bg-white/15"></div>
                                            <div class="flex-1 h-24 rounded-t-2xl bg-white/20"></div>
                                            <div class="flex-1 h-20 rounded-t-2xl bg-white/15"></div>
                                            <div class="flex-1 h-28 rounded-t-2xl bg-white/25"></div>
                                            <div class="flex-1 h-32 rounded-t-2xl bg-startup-accent/90"></div>
                                            <div class="flex-1 h-40 rounded-t-2xl bg-white/35"></div>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex flex-wrap gap-2">
                                        <span class="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">Investor/startup matching</span>
                                        <span class="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">Secure messaging</span>
                                        <span class="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">Deal flow</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="border-y border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-900/80">
                    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4">
                                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">Credibility</p>
                                <p class="mt-2 text-lg font-bold text-startup-dark dark:text-white">Real startups, real investors</p>
                            </div>
                            <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4">
                                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">Signal</p>
                                <p class="mt-2 text-lg font-bold text-startup-dark dark:text-white">Better matching and faster response times</p>
                            </div>
                            <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4">
                                <p class="text-sm font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">Security</p>
                                <p class="mt-2 text-lg font-bold text-startup-dark dark:text-white">Private messaging and controlled access</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bg-gray-50 py-16 dark:bg-gray-900">
                    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div class="text-center">
                            <h2 class="text-base font-semibold uppercase tracking-wide text-startup-primary">Platform</h2>
                            <p class="mt-2 text-3xl font-bold tracking-tight text-startup-dark dark:text-white sm:text-4xl">A cleaner operating system for startup funding</p>
                            <p class="mx-auto mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300">Everything is designed to feel premium, credible, and fast to understand at a glance.</p>
                        </div>

                        <div class="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
                            <div class="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-200 hover-lift dark:border-gray-700 dark:bg-gray-800 lg:col-span-7">
                                <div class="flex items-start justify-between gap-6">
                                    <div>
                                        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-startup-primary">Matching</p>
                                        <h3 class="mt-2 text-2xl font-bold text-startup-dark dark:text-white">Intelligent investor-startup discovery</h3>
                                        <p class="mt-4 max-w-xl text-gray-600 dark:text-gray-300">Surface the most relevant opportunities using sector, stage, geography, and investment criteria.</p>
                                    </div>
                                    <div class="rounded-2xl bg-startup-primary/10 p-4 text-startup-primary">
                                        <i class="fas fa-search text-2xl"></i>
                                    </div>
                                </div>
                                <div class="mt-6 grid grid-cols-3 gap-3 text-center">
                                    <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/70"><p class="text-2xl font-bold text-startup-dark dark:text-white">95%</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Fit score</p></div>
                                    <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/70"><p class="text-2xl font-bold text-startup-dark dark:text-white">24h</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Avg. response</p></div>
                                    <div class="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/70"><p class="text-2xl font-bold text-startup-dark dark:text-white">128</p><p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Active matches</p></div>
                                </div>
                            </div>

                            <div class="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-200 hover-lift dark:border-gray-700 dark:bg-gray-800 lg:col-span-5">
                                <div class="flex items-center justify-between gap-4">
                                    <div>
                                        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-startup-primary">Insights</p>
                                        <h3 class="mt-2 text-2xl font-bold text-startup-dark dark:text-white">Analytics that answer questions fast</h3>
                                    </div>
                                    <div class="rounded-2xl bg-startup-primary/10 p-4 text-startup-primary">
                                        <i class="fas fa-chart-line text-2xl"></i>
                                    </div>
                                </div>
                                <p class="mt-4 text-gray-600 dark:text-gray-300">Track traction, deal readiness, and funding progress with a simple visual layer for diligence.</p>
                            </div>

                            <div class="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-200 hover-lift dark:border-gray-700 dark:bg-gray-800 lg:col-span-4">
                                <div class="rounded-2xl bg-startup-accent/10 p-4 inline-flex text-startup-accent">
                                    <i class="fas fa-comments text-2xl"></i>
                                </div>
                                <h3 class="mt-5 text-2xl font-bold text-startup-dark dark:text-white">Secure messaging</h3>
                                <p class="mt-3 text-gray-600 dark:text-gray-300">Keep conversations organized with private, context-rich communication.</p>
                            </div>

                            <div class="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-200 hover-lift dark:border-gray-700 dark:bg-gray-800 lg:col-span-4">
                                <div class="rounded-2xl bg-emerald-500/10 p-4 inline-flex text-emerald-600">
                                    <i class="fas fa-shield-alt text-2xl"></i>
                                </div>
                                <h3 class="mt-5 text-2xl font-bold text-startup-dark dark:text-white">Trust and verification</h3>
                                <p class="mt-3 text-gray-600 dark:text-gray-300">Introduce quality controls that make the marketplace feel more credible.</p>
                            </div>

                            <div class="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-200 hover-lift dark:border-gray-700 dark:bg-gray-800 lg:col-span-4">
                                <div class="rounded-2xl bg-blue-500/10 p-4 inline-flex text-blue-600">
                                    <i class="fas fa-handshake text-2xl"></i>
                                </div>
                                <h3 class="mt-5 text-2xl font-bold text-startup-dark dark:text-white">Deal management</h3>
                                <p class="mt-3 text-gray-600 dark:text-gray-300">Streamline the entire deal lifecycle from initial interest through funding completion with built-in tracking.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bg-white py-14 dark:bg-startup-dark">
                    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div class="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <span class="text-3xl font-extrabold text-startup-primary">500+</span>
                                <p class="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Startups</p>
                            </div>
                            <div class="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <span class="text-3xl font-extrabold text-startup-primary">200+</span>
                                <p class="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Investors</p>
                            </div>
                            <div class="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <span class="text-3xl font-extrabold text-startup-primary">$10M+</span>
                                <p class="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Funding</p>
                            </div>
                            <div class="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <span class="text-3xl font-extrabold text-startup-primary">15+</span>
                                <p class="mt-2 text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Industries</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bg-gray-50 py-16 dark:bg-gray-900">
                    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div class="text-center">
                            <h2 class="text-base font-semibold uppercase tracking-wide text-startup-primary">Process</h2>
                            <p class="mt-2 text-3xl font-bold tracking-tight text-startup-dark dark:text-white sm:text-4xl">How it works</p>
                            <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-300">Switch between startup and investor views to see a more personalized journey.</p>
                            <div class="mt-6 inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <button id="landing-startup-tab" data-landing-mode="startup" class="landing-tab-active rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 bg-startup-primary text-white shadow-sm">Startups</button>
                                <button id="landing-investor-tab" data-landing-mode="investor" class="rounded-full px-5 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 dark:text-gray-300">Investors</button>
                            </div>
                        </div>

                        <div id="landing-journey-content" class="mt-10">
                            ${renderLandingJourneyContent('startup')}
                        </div>
                    </div>
                </section>

                <section class="bg-startup-primary py-14">
                    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div class="rounded-3xl bg-white/10 p-8 text-center text-white backdrop-blur-sm sm:p-10">
                            <h2 class="text-3xl font-bold sm:text-4xl">Ready to transform your startup journey?</h2>
                            <p class="mx-auto mt-4 max-w-2xl text-lg text-white/90">Join StartupConnect today and connect with a network of investors and startups pushing boundaries.</p>
                            <button id="cta-signup-btn" class="mt-8 rounded-xl bg-white px-8 py-3 font-bold text-startup-primary transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-lg">
                                Get Started Now
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        `;
    },

    startups: function() {
        return typeof StartupsPage !== 'undefined' ? StartupsPage.render() : `<div class="p-12 text-center">Startups Page Loading...</div>`;
    },

    investors: function() {
        return typeof InvestorsPage !== 'undefined' ? InvestorsPage.render() : `<div class="p-12 text-center">Investors Page Loading...</div>`;
    },

    dashboard: function() {
        return typeof DashboardPage !== 'undefined' ? DashboardPage.render() : `<div class="p-12 text-center">Dashboard Loading...</div>`;
    },

    profile: function() {
        return typeof ProfilePage !== 'undefined' ? ProfilePage.render() : `<div class="p-12 text-center">Profile Loading...</div>`;
    },

    settings: function() {
        return typeof SettingsPage !== 'undefined' ? SettingsPage.render() : `<div class="p-12 text-center">Settings Loading...</div>`;
    },

    about: function() {
        return `
            <div class="bg-white dark:bg-startup-dark py-12 sm:py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center max-w-3xl mx-auto">
                        <span class="text-startup-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
                        <h1 class="mt-2 text-3xl sm:text-5xl font-extrabold text-startup-dark dark:text-white">Connecting Africa's Next Tech Giants with Capital</h1>
                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            StartupConnect was built to democratize fundraising across emerging markets by giving founders direct visibility to qualified, verified investors.
                        </p>
                    </div>

                    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <div class="h-12 w-12 rounded-xl bg-startup-primary/10 flex items-center justify-center text-startup-primary text-xl mb-6">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-startup-dark dark:text-white">Our Mission</h3>
                            <p class="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                                To eliminate deal-sourcing friction and give high-potential startups equal access to growth capital, mentorship, and institutional investor networks.
                            </p>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                            <div class="h-12 w-12 rounded-xl bg-startup-accent/10 flex items-center justify-center text-startup-accent text-xl mb-6">
                                <i class="fas fa-eye"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-startup-dark dark:text-white">Our Vision</h3>
                            <p class="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                                To become Africa’s primary digital ecosystem for venture capital, enabling over $100M in early-stage deals and powering tomorrow's unicorns.
                            </p>
                        </div>
                    </div>

                    <div class="mt-20">
                        <h2 class="text-2xl font-bold text-center text-startup-dark dark:text-white mb-12">Core Principles</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div class="text-center p-6">
                                <i class="fas fa-shield-alt text-4xl text-startup-primary mb-4"></i>
                                <h4 class="text-xl font-bold text-startup-dark dark:text-white">Trust & Verification</h4>
                                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Every investor and startup undergoes structured vetting to ensure high signal and zero spam.</p>
                            </div>
                            <div class="text-center p-6">
                                <i class="fas fa-bolt text-4xl text-startup-primary mb-4"></i>
                                <h4 class="text-xl font-bold text-startup-dark dark:text-white">Speed & Transparency</h4>
                                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Direct connections eliminate middle-man gatekeepers and accelerate diligence timeframes.</p>
                            </div>
                            <div class="text-center p-6">
                                <i class="fas fa-chart-line text-4xl text-startup-primary mb-4"></i>
                                <h4 class="text-xl font-bold text-startup-dark dark:text-white">Data Driven</h4>
                                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Intelligent matching criteria ensures founders meet investors who actively target their sector.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    faq: function() {
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h1 class="text-3xl sm:text-4xl font-extrabold text-startup-dark dark:text-white">Frequently Asked Questions</h1>
                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">Got questions? We're here to help you get the most out of StartupConnect.</p>
                    </div>

                    <div class="mt-12 space-y-6">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white">How does StartupConnect match founders with investors?</h3>
                            <p class="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Our platform analyzes your startup's sector, stage, funding target, and location against investor criteria to present verified matches on your dashboard.
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white">Is my deck and financial data kept secure?</h3>
                            <p class="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Yes. All pitch documents uploaded to your document room are protected by role-based access control. Only investors you accept connection requests from can view your sensitive pitch materials.
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white">Who can create an account on StartupConnect?</h3>
                            <p class="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Early-to-growth stage startups seeking seed or Series A/B capital, as well as angel investors, VC funds, and syndicate leads looking to source African opportunities.
                            </p>
                        </div>

                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-startup-dark dark:text-white">Are there any fees for using the platform?</h3>
                            <p class="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                Basic startup profiles and investor browsing are free. Premium tools for pitch deck analytics, direct messaging, and priority match placement are available on subscription plans.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    blog: function() {
        return `
            <div class="bg-white dark:bg-startup-dark py-12 sm:py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center max-w-3xl mx-auto">
                        <span class="text-startup-primary font-semibold text-sm uppercase tracking-wider">Insights & News</span>
                        <h1 class="mt-2 text-3xl sm:text-4xl font-extrabold text-startup-dark dark:text-white">The StartupConnect Blog</h1>
                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">Expert advice on venture capital, pitch preparation, and African startup growth.</p>
                    </div>

                    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                            <div class="h-48 bg-startup-primary/20 flex items-center justify-center text-startup-primary text-4xl">
                                <i class="fas fa-chart-pie"></i>
                            </div>
                            <div class="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span class="text-xs font-bold text-startup-primary uppercase tracking-wider">Fundraising</span>
                                    <h3 class="mt-2 text-xl font-bold text-startup-dark dark:text-white">5 Pitch Deck Mistakes African Founders Must Avoid</h3>
                                    <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">Key insights on how to present financials and total addressable market to international VCs.</p>
                                </div>
                                <div class="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>5 min read</span>
                                    <span>July 2025</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                            <div class="h-48 bg-startup-accent/20 flex items-center justify-center text-startup-accent text-4xl">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <div class="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span class="text-xs font-bold text-startup-accent uppercase tracking-wider">Investor Relations</span>
                                    <h3 class="mt-2 text-xl font-bold text-startup-dark dark:text-white">Building Long-Term Trust with Angel Syndicates</h3>
                                    <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">Why monthly investor updates matter more than cold outreach when raising follow-on rounds.</p>
                                </div>
                                <div class="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>7 min read</span>
                                    <span>June 2025</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
                            <div class="h-48 bg-purple-500/20 flex items-center justify-center text-purple-600 text-4xl">
                                <i class="fas fa-coins"></i>
                            </div>
                            <div class="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span class="text-xs font-bold text-purple-600 uppercase tracking-wider">Market Trends</span>
                                    <h3 class="mt-2 text-xl font-bold text-startup-dark dark:text-white">Fintech & Agtech Lead 2025 African VC Inflows</h3>
                                    <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">A detailed breakdown of capital deployment across West, East, and North African ecosystems.</p>
                                </div>
                                <div class="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>4 min read</span>
                                    <span>May 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    terms: function() {
        return `
            <div class="bg-white dark:bg-startup-dark py-12 sm:py-16">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 class="text-3xl font-extrabold text-startup-dark dark:text-white">Terms of Service</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Last updated: July 2025</p>

                    <div class="mt-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        <section>
                            <h2 class="text-lg font-bold text-startup-dark dark:text-white">1. Acceptance of Terms</h2>
                            <p class="mt-2">By accessing or using StartupConnect, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                        </section>

                        <section>
                            <h2 class="text-lg font-bold text-startup-dark dark:text-white">2. User Verification & Accounts</h2>
                            <p class="mt-2">Users must provide accurate, current, and complete registration information. Misrepresentation of startup metrics or investor accreditation is grounds for immediate account suspension.</p>
                        </section>

                        <section>
                            <h2 class="text-lg font-bold text-startup-dark dark:text-white">3. Confidentiality & Intellectual Property</h2>
                            <p class="mt-2">Startups retain full ownership of their pitch materials and intellectual property. Investors agree to treat proprietary startup data with strict confidentiality.</p>
                        </section>
                    </div>
                </div>
            </div>
        `;
    },

    privacy: function() {
        return `
            <div class="bg-white dark:bg-startup-dark py-12 sm:py-16">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 class="text-3xl font-extrabold text-startup-dark dark:text-white">Privacy Policy</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Last updated: July 2025</p>

                    <div class="mt-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        <section>
                            <h2 class="text-lg font-bold text-startup-dark dark:text-white">1. Information We Collect</h2>
                            <p class="mt-2">We collect account information (name, email, phone), user profile data, and messaging logs to facilitate seamless platform interactions.</p>
                        </section>

                        <section>
                            <h2 class="text-lg font-bold text-startup-dark dark:text-white">2. How We Use Your Data</h2>
                            <p class="mt-2">Your information is strictly used for identity verification, intelligent investor-startup matching, and secure communication. We do not sell user data to third parties.</p>
                        </section>

                        <section>
                            <h2 class="text-lg font-bold text-startup-dark dark:text-white">3. Data Security</h2>
                            <p class="mt-2">All sensitive communications and uploaded documents are encrypted in transit and at rest using industry-standard protocols.</p>
                        </section>
                    </div>
                </div>
            </div>
        `;
    }
};

/**
 * Render landing journey content based on mode
 * @param {string} mode - 'startup' or 'investor'
 * @returns {string} - HTML content
 */
function renderLandingJourneyContent(mode) {
    if (mode === 'startup') {
        return `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 rounded-full bg-startup-primary/10 flex items-center justify-center text-startup-primary text-lg font-bold">1</div>
                    <h3 class="mt-4 text-lg font-bold text-startup-dark dark:text-white">Create Profile</h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Tell your startup story and highlight your traction.</p>
                </div>
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 rounded-full bg-startup-primary/10 flex items-center justify-center text-startup-primary text-lg font-bold">2</div>
                    <h3 class="mt-4 text-lg font-bold text-startup-dark dark:text-white">Get Discovered</h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Connect with investors actively looking for your sector.</p>
                </div>
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 rounded-full bg-startup-primary/10 flex items-center justify-center text-startup-primary text-lg font-bold">3</div>
                    <h3 class="mt-4 text-lg font-bold text-startup-dark dark:text-white">Engage Investors</h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Have meaningful conversations with qualified leads.</p>
                </div>
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 rounded-full bg-startup-primary/10 flex items-center justify-center text-startup-primary text-lg font-bold">4</div>
                    <h3 class="mt-4 text-lg font-bold text-startup-dark dark:text-white">Close Deals</h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Secure funding and accelerate your growth.</p>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 rounded-full bg-startup-primary/10 flex items-center justify-center text-startup-primary text-lg font-bold">1</div>
                    <h3 class="mt-4 text-lg font-bold text-startup-dark dark:text-white">Build Criteria</h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Define your investment thesis and preferences.</p>
                </div>
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 rounded-full bg-startup-primary/10 flex items-center justify-center text-startup-primary text-lg font-bold">2</div>
                    <h3 class="mt-4 text-lg font-bold text-startup-dark dark:text-white">Discover Startups</h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Browse curated startups that match your interests.</p>
                </div>
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 rounded-full bg-startup-primary/10 flex items-center justify-center text-startup-primary text-lg font-bold">3</div>
                    <h3 class="mt-4 text-lg font-bold text-startup-dark dark:text-white">Due Diligence</h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Review analytics and communicate securely.</p>
                </div>
                <div class="text-center">
                    <div class="mx-auto h-12 w-12 rounded-full bg-startup-primary/10 flex items-center justify-center text-startup-primary text-lg font-bold">4</div>
                    <h3 class="mt-4 text-lg font-bold text-startup-dark dark:text-white">Make Investment</h3>
                    <p class="mt-2 text-gray-600 dark:text-gray-300">Move forward with promising opportunities.</p>
                </div>
            </div>
        `;
    }
}

// Initialize app when script loads
const app = new App();
