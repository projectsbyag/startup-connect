/**
 * Investors Page
 */
const InvestorsPage = {
    /**
     * Render investors page
     * @returns {string} - HTML content
     */
    render: function() {
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white">Meet Investors</h1>
                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Connect with investors who are actively looking for opportunities in Africa.
                        </p>
                    </div>
                    
                    <!-- Loading State -->
                    <div id="investors-loading" class="py-20 text-center">
                        <div class="spinner mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-300">Loading investors<span class="loading-dots"></span></p>
                    </div>
                    
                    <!-- Error State -->
                    <div id="investors-error" class="py-20 text-center hidden">
                        <div class="text-red-500 text-5xl mb-4">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load investors</h2>
                        <p id="investors-error-message" class="text-gray-600 dark:text-gray-300 mb-6">
                            An error occurred while fetching investors.
                        </p>
                        <button id="retry-investors-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            Try Again
                        </button>
                    </div>
                    
                    <!-- Content (hidden until loaded) -->
                    <div id="investors-content" class="hidden">
                        <!-- Filters -->
                        <div class="mt-10 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-4">Filters</h2>
                            <form id="investor-filter-form" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label for="focus-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Investment Focus
                                    </label>
                                    <select id="focus-filter" class="text-base w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                        <option value="">All Focus Areas</option>
                                        <option value="Fintech">Fintech</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Education">Education</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Software">Software</option>
                                        <option value="AI">AI</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Energy">Energy</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label for="inv-stage-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Investment Stage
                                    </label>
                                    <select id="inv-stage-filter" class="text-base w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                        <option value="">All Stages</option>
                                        <option value="Pre-seed">Pre-seed</option>
                                        <option value="Seed">Seed</option>
                                        <option value="Series A">Series A</option>
                                        <option value="Series B">Series B</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label for="inv-location-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <select id="inv-location-filter" class="text-base w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                        <option value="">All Locations</option>
                                        <option value="Lagos">Lagos, Nigeria</option>
                                        <option value="Nairobi">Nairobi, Kenya</option>
                                        <option value="Accra">Accra, Ghana</option>
                                        <option value="Johannesburg">Johannesburg, South Africa</option>
                                        <option value="Cairo">Cairo, Egypt</option>
                                        <option value="London">London, UK</option>
                                        <option value="New York">New York, USA</option>
                                    </select>
                                </div>
                                
                                <div class="md:col-span-3 flex justify-end space-x-4">
                                    <button type="button" id="reset-inv-filters" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                                        Reset
                                    </button>
                                    <button type="submit" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                                        Apply Filters
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <!-- Results Count -->
                        <div class="mt-10 flex justify-between items-center">
                            <h2 id="investors-count" class="text-xl font-bold text-startup-dark dark:text-white mb-6">
                                0 Investors Found
                            </h2>
                            
                            <!-- Sort Options -->
                            <div class="flex items-center">
                                <label for="sort-investors" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                                    Sort by:
                                </label>
                                <select id="sort-investors" class="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                    <option value="portfolio-high">Portfolio Size (High to Low)</option>
                                    <option value="portfolio-low">Portfolio Size (Low to High)</option>
                                    <option value="investment-high">Investment Range (High to Low)</option>
                                    <option value="investment-low">Investment Range (Low to High)</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Investors List -->
                        <div id="investors-list" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                            <!-- Investor cards will be loaded here -->
                        </div>
                        
                        <!-- No Results -->
                        <div id="no-investors-found" class="hidden py-12 text-center">
                            <div class="text-5xl text-gray-400 mb-4">
                                <i class="fas fa-search"></i>
                            </div>
                            <h3 class="text-xl font-bold text-startup-dark dark:text-white mb-2">No investors found</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters to find more results.</p>
                            <button id="clear-investor-filters" class="px-4 py-2 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                                Clear Filters
                            </button>
                        </div>
                        
                        <!-- Pagination -->
                        <div id="investors-pagination" class="mt-10 flex justify-center">
                            <!-- Pagination controls will be added here -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Investor Details Modal -->
            <div id="investor-details-modal" class="fixed inset-0 z-50 overflow-y-auto hidden">
                <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                        <div class="absolute top-0 right-0 pt-4 pr-4">
                            <button type="button" id="close-investor-details-btn" class="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                <span class="sr-only">Close</span>
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div id="investor-details-content" class="p-6">
                            <!-- Investor details will be loaded here -->
                            <div class="animate-pulse">
                                <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
                                <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                <div class="grid grid-cols-2 gap-4 mb-4">
                                    <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Set up event listeners for the investors page
     * @param {App} app - Main application instance
     */
    setupEventListeners: function(app) {
        // Store app instance
        this.app = app;
        // Load investors when page is first displayed
        this.loadInvestors();
        
        // Filter form submission
        const filterForm = document.getElementById('investor-filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const focus = document.getElementById('focus-filter').value;
                const stage = document.getElementById('inv-stage-filter').value;
                const location = document.getElementById('inv-location-filter').value;
                
                const filters = {};
                if (focus) filters.focus = focus;
                if (stage) filters.stage = stage;
                if (location) filters.location = location;
                
                this.loadInvestors(filters);
            });
        }
        
        // Reset filters button
        const resetBtn = document.getElementById('reset-inv-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.getElementById('focus-filter').value = '';
                document.getElementById('inv-stage-filter').value = '';
                document.getElementById('inv-location-filter').value = '';
                
                this.loadInvestors();
            });
        }
        
        // Sort dropdown
        const sortDropdown = document.getElementById('sort-investors');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', () => {
                this.sortInvestors(sortDropdown.value);
            });
        }
        
        // Clear filters button (when no results)
        const clearFiltersBtn = document.getElementById('clear-investor-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                document.getElementById('focus-filter').value = '';
                document.getElementById('inv-stage-filter').value = '';
                document.getElementById('inv-location-filter').value = '';
                
                this.loadInvestors();
            });
        }
        
        // Retry button (when error occurs)
        const retryBtn = document.getElementById('retry-investors-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadInvestors();
            });
        }
        
        // Close investor details modal
        const closeDetailsBtn = document.getElementById('close-investor-details-btn');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => {
                document.getElementById('investor-details-modal').classList.add('hidden');
            });
        }
        
        // Close modal when clicking outside
        const detailsModal = document.getElementById('investor-details-modal');
        if (detailsModal) {
            detailsModal.addEventListener('click', (e) => {
                if (e.target === detailsModal) {
                    detailsModal.classList.add('hidden');
                }
            });
        }
    },
    
    /**
     * Load investors from API
     * @param {Object} filters - Filter parameters
     * @param {number} page - Page number
     */
    loadInvestors: async function(filters = {}, page = 1) {
        // Show loading state
        document.getElementById('investors-loading').classList.remove('hidden');
        document.getElementById('investors-error').classList.add('hidden');
        document.getElementById('investors-content').classList.add('hidden');
        
        try {
            // Fetch investors from API with pagination
            const pageSize = 12;
            const apiFilters = { ...filters, page, limit: pageSize };
            const response = await API.getInvestors(apiFilters);
            
            // Hide loading state, show content
            document.getElementById('investors-loading').classList.add('hidden');
            document.getElementById('investors-content').classList.remove('hidden');
            
            // Update investors count
            const count = response.total || response.investors.length;
            document.getElementById('investors-count').textContent = `${count} Investors Found`;
            
            // Render investors
            this.renderInvestors(response.investors);
            
            // Show no results message if needed
            if (response.investors.length === 0) {
                document.getElementById('no-investors-found').classList.remove('hidden');
                document.getElementById('investors-list').classList.add('hidden');
                document.getElementById('investors-pagination').classList.add('hidden');
            } else {
                document.getElementById('no-investors-found').classList.add('hidden');
                document.getElementById('investors-list').classList.remove('hidden');
                
                // Render pagination if needed
                if (response.total > pageSize) {
                    this.renderPagination(response.total, page, pageSize, filters);
                    document.getElementById('investors-pagination').classList.remove('hidden');
                } else {
                    document.getElementById('investors-pagination').classList.add('hidden');
                }
                
                // Attach event listeners to investor cards
                this.attachInvestorCardListeners();
            }
        } catch (error) {
            // Show error state
            document.getElementById('investors-loading').classList.add('hidden');
            document.getElementById('investors-error').classList.remove('hidden');
            document.getElementById('investors-error-message').textContent = error.message || 'An error occurred while fetching investors.';
            console.error('Error loading investors:', error);
        }
    },
    
    /**
     * Render investors list
     * @param {Array} investors - List of investor objects
     */
    renderInvestors: function(investors) {
        const container = document.getElementById('investors-list');
        
        if (!container) return;
        
        let html = '';
        
        investors.forEach(investor => {
            html += `
                <div class="investor-card bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden" data-id="${investor._id}">
                    <div class="p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="text-xl font-bold text-startup-dark dark:text-white">${investor.firm || investor.name}</h3>
                                <p class="text-gray-500 dark:text-gray-400">${investor.location}</p>
                            </div>
                        </div>
                        <p class="mt-4 text-gray-600 dark:text-gray-300">${investor.description || (investor.bio ? investor.bio.substring(0, 120) + '...' : 'No description available')}</p>
                        <div class="mt-6">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Investment Focus</p>
                            <div class="flex flex-wrap gap-2 mt-1">
                                ${Array.isArray(investor.investmentFocus || investor.focus) ? (investor.investmentFocus || investor.focus).map(f => `
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-startup-primary">
                                        ${f}
                                    </span>
                                `).join('') : ''}
                            </div>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Investment Stage</p>
                            <div class="flex flex-wrap gap-2 mt-1">
                                ${Array.isArray(investor.investmentStage || investor.stage) ? (investor.investmentStage || investor.stage).map(s => `
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        ${s}
                                    </span>
                                `).join('') : ''}
                            </div>
                        </div>
                        <div class="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Investment Range</p>
                                <p class="font-medium">$${(investor.minInvestment || investor.min || 0).toLocaleString()} - $${(investor.maxInvestment || investor.max || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Portfolio Size</p>
                                <p class="font-medium">${investor.portfolioSize || investor.portfolio || 0} companies</p>
                            </div>
                        </div>
                        <div class="mt-6">
                            <button class="view-investor-btn px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90 w-full" data-id="${investor._id}">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },
    
    /**
     * Attach event listeners to investor cards
     */
    attachInvestorCardListeners: function() {
        // View investor details buttons
        document.querySelectorAll('.view-investor-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const investorId = e.target.dataset.id;
                this.showInvestorDetails(investorId);
            });
        });
        
        // Entire card click
        document.querySelectorAll('.investor-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore if clicking on the button (already handled above)
                if (!e.target.classList.contains('view-investor-btn') && !e.target.closest('.view-investor-btn')) {
                    const investorId = card.dataset.id;
                    this.showInvestorDetails(investorId);
                }
            });
        });
    },
    
    /**
     * Show investor details in modal
     * @param {string} investorId - Investor ID
     */
    showInvestorDetails: async function(investorId) {
        // Get or dynamically inject modal container
        let modal = document.getElementById('investor-details-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'investor-details-modal';
            modal.className = 'fixed inset-0 z-50 overflow-y-auto hidden bg-black bg-opacity-50 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 relative shadow-xl">
                    <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 text-xl font-bold" onclick="document.getElementById('investor-details-modal').classList.add('hidden')">&times;</button>
                    <div id="investor-details-content"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        let contentContainer = document.getElementById('investor-details-content');
        if (!contentContainer) {
            contentContainer = modal.querySelector('#investor-details-content');
        }
        
        modal.classList.remove('hidden');
        contentContainer.innerHTML = `
            <div class="animate-pulse">
                <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
                <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        `;
        
        try {
            // Fetch investor details
            const response = await API.getInvestor(investorId);
        
            if (!response.success || !response.investor) {
                throw new Error('Failed to load investor details');
            }
            
            const investor = response.investor;
            
            // Render investor details
            contentContainer.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white">${investor.firm || investor.name}</h2>
                        <p class="text-gray-500 dark:text-gray-400 mb-4">${investor.location}</p>
                    </div>
                    <div>
                        ${Auth.isUserAuthenticated() && Auth.getCurrentUser().userType === 'startup' ? 
                            `<button id="connect-with-investor-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90" data-id="${investor._id}">
                                Connect
                            </button>` : 
                            ''
                        }
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-2">
                        <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-2">About</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">${investor.description || investor.bio || 'No description available'}</p>
                        
                        <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-2">Investment Focus</h3>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${Array.isArray(investor.investmentFocus || investor.focus) ? (investor.investmentFocus || investor.focus).map(f => `
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-startup-primary">
                                    ${f}
                                </span>
                            `).join('') : ''}
                        </div>
                        
                        <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-2">Investment Stage</h3>
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${Array.isArray(investor.investmentStage || investor.stage) ? (investor.investmentStage || investor.stage).map(s => `
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    ${s}
                                </span>
                            `).join('') : ''}
                        </div>
                        
                        ${investor.portfolio && investor.portfolio.length > 0 ? `
                            <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-2">Portfolio Companies</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                ${investor.portfolio.map(company => `
                                    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <h4 class="font-medium text-startup-dark dark:text-white">${company.name}</h4>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">${company.description || ''}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-4">Details</h3>
                        
                        <div class="space-y-4">
                            ${investor.position ? `
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Position</p>
                                    <p class="font-medium">${investor.position}</p>
                                </div>
                            ` : ''}
                            
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Investment Range</p>
                                <p class="font-medium">$${(investor.minInvestment || investor.min || 0).toLocaleString()} - $${(investor.maxInvestment || investor.max || 0).toLocaleString()}</p>
                            </div>
                            
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Portfolio Size</p>
                                <p class="font-medium">${investor.portfolioSize || investor.portfolio ? (Array.isArray(investor.portfolio) ? investor.portfolio.length : investor.portfolioSize) : 0} companies</p>
                            </div>
                            
                            ${investor.website ? `
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Website</p>
                                    <a href="${investor.website}" target="_blank" class="text-startup-primary hover:underline font-medium">${investor.website}</a>
                                </div>
                            ` : ''}
                            
                            ${investor.socialMedia && Object.keys(investor.socialMedia).length > 0 ? `
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Social Media</p>
                                    <div class="flex space-x-2">
                                        ${investor.socialMedia.twitter ? `<a href="${investor.socialMedia.twitter}" target="_blank" class="text-startup-primary hover:text-opacity-80"><i class="fab fa-twitter"></i></a>` : ''}
                                        ${investor.socialMedia.linkedin ? `<a href="${investor.socialMedia.linkedin}" target="_blank" class="text-startup-primary hover:text-opacity-80"><i class="fab fa-linkedin"></i></a>` : ''}
                                        ${investor.socialMedia.facebook ? `<a href="${investor.socialMedia.facebook}" target="_blank" class="text-startup-primary hover:text-opacity-80"><i class="fab fa-facebook"></i></a>` : ''}
                                        ${investor.socialMedia.instagram ? `<a href="${investor.socialMedia.instagram}" target="_blank" class="text-startup-primary hover:text-opacity-80"><i class="fab fa-instagram"></i></a>` : ''}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                ${Auth.isUserAuthenticated() && Auth.getCurrentUser().userType === 'startup' ? `
                    <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <button id="contact-investor-btn" class="px-6 py-3 bg-startup-primary text-white rounded-md hover:bg-opacity-90 mr-4" data-id="${investor._id}">
                            <i class="fas fa-comment mr-2"></i> Contact
                        </button>
                        <button id="save-investor-btn" class="px-6 py-3 border border-startup-primary text-startup-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" data-id="${investor._id}">
                            <i class="far fa-bookmark mr-2"></i> Save
                        </button>
                    </div>
                ` : ''}
            `;
            
            // Add event listeners to buttons in the modal
            this.attachInvestorDetailsListeners(investor);
            
        } catch (error) {
            // Show error in modal
            contentContainer.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-red-500 text-5xl mb-4">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h3 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load investor details</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                        ${error.message || 'An error occurred while fetching investor details.'}
                    </p>
                    <button id="retry-investor-details-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90" data-id="${investorId}">
                        Try Again
                    </button>
                </div>
            `;
            
            // Add retry button listener
            document.getElementById('retry-investor-details-btn')?.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.showInvestorDetails(id);
            });
            
            console.error('Error loading investor details:', error);
        }
    },
    
    /**
     * Attach event listeners to investor details modal
     * @param {Object} investor - Investor data
     */
    /**
     * Attach event listeners to investor details modal
     * @param {Object} investor - Investor data
     */
    attachInvestorDetailsListeners: function(investor) {
        // Connect with investor button
        const connectBtn = document.getElementById('connect-with-investor-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const originalText = connectBtn.innerHTML;
                try {
                    // Prevent duplicate requests
                    if (connectBtn.classList.contains('connected') ||
                        connectBtn.classList.contains('pending')) {
                        return;
                    }

                    // Show loading state
                    connectBtn.innerHTML = `
                        <span class="spinner inline-block mr-2"></span>
                        Connecting...
                    `;
                    connectBtn.disabled = true;
                    try {
                        // Send connection request
                        await API.sendConnectionRequest(investor.userId || investor._id);

                        // Show success message
                        this.app.showToast('Connection request sent!', 'success');

                        // Update button
                        connectBtn.innerHTML = `<i class="fas fa-check mr-2"></i> Request Sent`;
                        connectBtn.classList.remove('bg-startup-primary');
                        connectBtn.classList.add('bg-green-500', 'pending');
                        connectBtn.disabled = true;
                    } catch (error) {
                        // Already connected or pending
                        if (error.message &&
                            (error.message.includes('Connection request already exists') ||
                             error.message.includes('users are already connected'))) {
                            connectBtn.innerHTML = `<i class="fas fa-check mr-2"></i> Connected`;
                            connectBtn.classList.remove('bg-startup-primary');
                            connectBtn.classList.add('bg-green-500', 'connected');
                            connectBtn.disabled = true;
                            this.app.showToast('Already connected with this investor', 'info');
                        } else {
                            connectBtn.innerHTML = originalText;
                            connectBtn.disabled = false;
                            this.app.showToast(error.message || 'Failed to send connection request', 'error');
                            console.error('Error sending connection request:', error);
                        }
                    }
                } catch (error) {
                    connectBtn.innerHTML = originalText;
                    connectBtn.disabled = false;
                    this.app.showToast(error.message || 'Failed to send connection request', 'error');
                    console.error('Error sending connection request:', error);
                }
            });
        }

        // Contact investor button
        const contactBtn = document.getElementById('contact-investor-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const originalText = contactBtn.innerHTML;
                try {
                    contactBtn.innerHTML = `
                        <span class="spinner inline-block mr-2"></span>
                        Starting conversation...
                    `;
                    contactBtn.disabled = true;

                    // Start conversation
                    await API.startConversation({
                        recipient: investor.userId || investor._id,
                        message: `Hi! I'm interested in connecting with ${investor.firm || investor.name}.`
                    });

                    this.app.showToast('Conversation started!', 'success');
                    // Hide the modal
                    document.getElementById('investor-details-modal').classList.add('hidden');

                    // Go to the conversation page for this investor
                    try {
                        // Get the conversation ID for this investor (API should return it or you may need to fetch it)
                        const conversation = await API.getConversationWithUser(investor.userId || investor._id);
                        if (conversation && conversation._id) {
                            this.app.navigateTo(`conversations/${conversation._id}`);
                        } else {
                            // fallback: go to dashboard if conversation not found
                            this.app.navigateTo('messages');
                        }
                    } catch (err) {
                        // fallback: go to dashboard if error
                        this.app.navigateTo('dashboard');
                    }
                    this.app.navigateTo('dashboard');
                } catch (error) {
                    contactBtn.innerHTML = originalText;
                    contactBtn.disabled = false;
                    this.app.showToast(error.message || 'Failed to start conversation', 'error');
                    console.error('Error starting conversation:', error);
                }
            });
        }

        // Save investor button
        const saveBtn = document.getElementById('save-investor-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const isSaved = saveBtn.classList.contains('saved');
                    if (isSaved) {
                        await API.removeSavedInvestor(investor._id);
                        saveBtn.innerHTML = `<i class="far fa-bookmark mr-2"></i> Save`;
                        saveBtn.classList.remove('saved', 'bg-startup-primary', 'text-white');
                        saveBtn.classList.add('border-startup-primary', 'text-startup-primary');
                        this.app.showToast('Removed from saved investors', 'info');
                    } else {
                        await API.saveInvestor(investor._id);
                        saveBtn.innerHTML = `<i class="fas fa-bookmark mr-2"></i> Saved`;
                        saveBtn.classList.add('saved', 'bg-startup-primary', 'text-white');
                        saveBtn.classList.remove('border-startup-primary', 'text-startup-primary');
                        this.app.showToast('Added to saved investors', 'success');
                    }
                } catch (error) {
                    this.app.showToast(error.message || 'Failed to update saved investors', 'error');
                    console.error('Error updating saved investors:', error);
                }
            });
        }

        // Retry button in modal (if present)
        const retryBtn = document.getElementById('retry-investor-details-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = retryBtn.dataset.id;
                this.showInvestorDetails(id);
            });
        }
    },
    /**
     * Sort investors list
     * @param {string} sortBy - Sort criteria
     */
    sortInvestors: function(sortBy) {
        const container = document.getElementById('investors-list');
        const cards = Array.from(container.querySelectorAll('.investor-card'));
        
        cards.sort((a, b) => {
            switch (sortBy) {
                case 'portfolio-high':
                    const portfolioA = this.extractPortfolioSize(a);
                    const portfolioB = this.extractPortfolioSize(b);
                    return portfolioB - portfolioA;
                case 'portfolio-low':
                    const portfolioC = this.extractPortfolioSize(a);
                    const portfolioD = this.extractPortfolioSize(b);
                    return portfolioC - portfolioD;
                case 'investment-high':
                    const investmentA = this.extractInvestmentMax(a);
                    const investmentB = this.extractInvestmentMax(b);
                    return investmentB - investmentA;
                case 'investment-low':
                    const investmentC = this.extractInvestmentMax(a);
                    const investmentD = this.extractInvestmentMax(b);
                    return investmentC - investmentD;
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        cards.forEach(card => container.appendChild(card));
    },
    
    /**
     * Extract portfolio size from investor card
     * @param {Element} card - Investor card element
     * @returns {number} - Portfolio size
     */
    extractPortfolioSize: function(card) {
        const portfolioText = card.querySelector('p.font-medium:nth-of-type(2)').textContent;
        return parseInt(portfolioText.replace(/[^0-9]/g, '')) || 0;
    },
    
    /**
     * Extract maximum investment amount from investor card
     * @param {Element} card - Investor card element
     * @returns {number} - Maximum investment amount
     */
    extractInvestmentMax: function(card) {
        const investmentText = card.querySelector('p.font-medium:nth-of-type(1)').textContent;
        const parts = investmentText.split('-');
        if (parts.length > 1) {
            return parseInt(parts[1].replace(/[^0-9]/g, '')) || 0;
        }
        return 0;
    },
    
    /**
     * Render pagination controls
     * @param {number} total - Total number of items
     * @param {number} currentPage - Current page number
     * @param {number} pageSize - Items per page
     * @param {Object} filters - Current filters
     */
    renderPagination: function(total, currentPage, pageSize, filters) {
        const container = document.getElementById('investors-pagination');
        const totalPages = Math.ceil(total / pageSize);
        
        let html = `
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        `;
        
        // Previous page button
        html += `
            <button ${currentPage === 1 ? 'disabled' : ''} 
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                    currentPage === 1 
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }" 
                data-page="${currentPage - 1}">
                <span class="sr-only">Previous</span>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        const maxDisplayedPages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
        let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
        
        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxDisplayedPages) {
            startPage = Math.max(1, endPage - maxDisplayedPages + 1);
        }
        
        // First page (if not in range)
        if (startPage > 1) {
            html += `
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" data-page="1">
                    1
                </button>
            `;
            
            if (startPage > 2) {
                html += `
                    <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                        ...
                    </span>
                `;
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button class="relative inline-flex items-center px-4 py-2 border ${
                    i === currentPage 
                    ? 'border-startup-primary bg-startup-primary bg-opacity-10 text-startup-primary' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } text-sm font-medium" data-page="${i}">
                    ${i}
                </button>
            `;
        }
        
        // Last page (if not in range)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `
                    <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                        ...
                    </span>
                `;
            }
            
            html += `
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" data-page="${totalPages}">
                    ${totalPages}
                </button>
            `;
        }
        
        // Next page button
        html += `
            <button ${currentPage === totalPages ? 'disabled' : ''} 
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${
                    currentPage === totalPages 
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }" 
                data-page="${currentPage + 1}">
                <span class="sr-only">Next</span>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        html += `</nav>`;
        
        container.innerHTML = html;
        
        // Add event listeners to pagination buttons
        container.querySelectorAll('button[data-page]').forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', (e) => {
                    const page = parseInt(e.currentTarget.dataset.page);
                    this.loadInvestors(filters, page);
                    
                    // Scroll to top of investors section
                    document.getElementById('investors-content').scrollIntoView({ behavior: 'smooth' });
                });
            }
        });
    }
};