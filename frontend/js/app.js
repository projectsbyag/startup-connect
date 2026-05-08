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
        // Reload current page if authentication state changes
        this.loadPage(this.currentPage);
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
                link.classList.add('border-startup-primary', 'text-startup-primary', 'bg-startup-primary');
                link.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-300');
            } else {
                link.classList.remove('border-startup-primary', 'text-startup-primary', 'bg-startup-primary');
                link.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-300');
            }
        });
    }
    
    /**
     * Setup main event listeners for navigation
     */
    setupEventListeners() {
        // Nav link listeners
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
        
        // Auth button listeners
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const mobileSignupBtn = document.getElementById('mobile-signup-btn');
        
        if (loginBtn) loginBtn.addEventListener('click', () => document.getElementById('login-modal').classList.remove('hidden'));
        if (signupBtn) signupBtn.addEventListener('click', () => document.getElementById('signup-modal').classList.remove('hidden'));
        if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => document.getElementById('login-modal').classList.remove('hidden'));
        if (mobileSignupBtn) mobileSignupBtn.addEventListener('click', () => document.getElementById('signup-modal').classList.remove('hidden'));
        
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
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>Startups page</p></div>`;
    },

    investors: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>Investors page</p></div>`;
    },

    about: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>About page</p></div>`;
    },

    dashboard: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>Dashboard page</p></div>`;
    },

    profile: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>Profile page</p></div>`;
    },

    settings: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>Settings page</p></div>`;
    },

    faq: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>FAQ page</p></div>`;
    },

    blog: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>Blog page</p></div>`;
    },

    terms: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>Terms of Service</p></div>`;
    },

    privacy: function() {
        return `<div class="min-h-[70vh] flex items-center justify-center"><p>Privacy Policy</p></div>`;
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
