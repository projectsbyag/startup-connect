/**
 * Startups Page
 */
const StartupsPage = {
    /**
     * Render startups page
     * @returns {string} - HTML content
     */
    render: function() {
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white">Discover Startups</h1>
                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Explore innovative startups across Africa and find your next investment opportunity.
                        </p>
                    </div>
                    
                    <!-- Loading State -->
                    <div id="startups-loading" class="py-20 text-center">
                        <div class="spinner mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-300">Loading startups<span class="loading-dots"></span></p>
                    </div>
                    
                    <!-- Error State -->
                    <div id="startups-error" class="py-20 text-center hidden">
                        <div class="text-red-500 text-5xl mb-4">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load startups</h2>
                        <p id="startups-error-message" class="text-gray-600 dark:text-gray-300 mb-6">
                            An error occurred while fetching startups.
                        </p>
                        <button id="retry-startups-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90">
                            Try Again
                        </button>
                    </div>
                    
                    <!-- Content (hidden until loaded) -->
                    <div id="startups-content" class="hidden">
                        <!-- Filters -->
                        <div class="mt-10 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 class="text-xl font-bold text-startup-dark dark:text-white mb-4">Filters</h2>
                            <form id="startup-filter-form" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label for="industry-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Industry
                                    </label>
                                    <select id="industry-filter" class="text-base w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                        <option value="">All Industries</option>
                                        <option value="Fintech">Fintech</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Education">Education</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Software">Software</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Logistics">Logistics</option>
                                        <option value="Clean Energy">Clean Energy</option>
                                        <option value="Food & Beverage">Food & Beverage</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label for="stage-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Funding Stage
                                    </label>
                                    <select id="stage-filter" class="text-base w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                        <option value="">All Stages</option>
                                        <option value="Pre-seed">Pre-seed</option>
                                        <option value="Seed">Seed</option>
                                        <option value="Series A">Series A</option>
                                        <option value="Series B">Series B</option>
                                        <option value="Series C">Series C</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label for="location-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <select id="location-filter" class="text-base w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                        <option value="">All Locations</option>
                                        <option value="Lagos">Lagos, Nigeria</option>
                                        <option value="Nairobi">Nairobi, Kenya</option>
                                        <option value="Accra">Accra, Ghana</option>
                                        <option value="Kampala">Kampala, Uganda</option>
                                        <option value="Johannesburg">Johannesburg, South Africa</option>
                                        <option value="Cairo">Cairo, Egypt</option>
                                        <option value="Kigali">Kigali, Rwanda</option>
                                    </select>
                                </div>
                                
                                <div class="md:col-span-3 flex justify-end space-x-4">
                                    <button type="button" id="reset-filters" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
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
                            <h2 id="startups-count" class="text-xl font-bold text-startup-dark dark:text-white mb-6">
                                0 Startups Found
                            </h2>
                            
                            <!-- Sort Options -->
                            <div class="flex items-center">
                                <label for="sort-startups" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                                    Sort by:
                                </label>
                                <select id="sort-startups" class="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-startup-primary focus:border-startup-primary dark:bg-gray-700 dark:text-white">
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="funding-high">Highest Funding</option>
                                    <option value="funding-low">Lowest Funding</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Startups List -->
                        <div id="startups-list" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                            <!-- Startup cards will be loaded here -->
                        </div>
                        
                        <!-- No Results -->
                        <div id="no-startups-found" class="hidden py-12 text-center">
                            <div class="text-5xl text-gray-400 mb-4">
                                <i class="fas fa-search"></i>
                            </div>
                            <h3 class="text-xl font-bold text-startup-dark dark:text-white mb-2">No startups found</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters to find more results.</p>
                            <button id="clear-startup-filters" class="px-4 py-2 border border-startup-primary text-startup-primary rounded-md hover:bg-startup-primary hover:text-white transition-colors">
                                Clear Filters
                            </button>
                        </div>
                        
                        <!-- Pagination -->
                        <div id="startups-pagination" class="mt-10 flex justify-center">
                            <!-- Pagination controls will be added here -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Startup Details Modal -->
            <div id="startup-details-modal" class="fixed inset-0 z-50 overflow-y-auto hidden">
                <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                        <div class="absolute top-0 right-0 pt-4 pr-4">
                            <button type="button" id="close-startup-details-btn" class="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                <span class="sr-only">Close</span>
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div id="startup-details-content" class="p-6">
                            <!-- Startup details will be loaded here -->
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
     * Set up event listeners for the startups page
     * @param {App} app - Main application instance
     */
    setupEventListeners: function(app) {
        // Load startups when page is first displayed
        this.loadStartups();
        
        // Filter form submission
        const filterForm = document.getElementById('startup-filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const industry = document.getElementById('industry-filter').value;
                const stage = document.getElementById('stage-filter').value;
                const location = document.getElementById('location-filter').value;
                
                const filters = {};
                if (industry) filters.industry = industry;
                if (stage) filters.funding = stage;
                if (location) filters.location = location;
                
                this.loadStartups(filters);
            });
        }
        
        // Reset filters button
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.getElementById('industry-filter').value = '';
                document.getElementById('stage-filter').value = '';
                document.getElementById('location-filter').value = '';
                
                this.loadStartups();
            });
        }
        
        // Sort dropdown
        const sortDropdown = document.getElementById('sort-startups');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', () => {
                this.sortStartups(sortDropdown.value);
            });
        }
        
        // Clear filters button (when no results)
        const clearFiltersBtn = document.getElementById('clear-startup-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                document.getElementById('industry-filter').value = '';
                document.getElementById('stage-filter').value = '';
                document.getElementById('location-filter').value = '';
                
                this.loadStartups();
            });
        }
        
        // Retry button (when error occurs)
        const retryBtn = document.getElementById('retry-startups-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadStartups();
            });
        }
        
        // Close startup details modal
        const closeDetailsBtn = document.getElementById('close-startup-details-btn');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => {
                document.getElementById('startup-details-modal').classList.add('hidden');
            });
        }
        
        // Close modal when clicking outside
        const detailsModal = document.getElementById('startup-details-modal');
        if (detailsModal) {
            detailsModal.addEventListener('click', (e) => {
                if (e.target === detailsModal) {
                    detailsModal.classList.add('hidden');
                }
            });
        }
    },
    
    /**
     * Load startups from API
     * @param {Object} filters - Filter parameters
     * @param {number} page - Page number
     */
    loadStartups: async function(filters = {}, page = 1) {
        // Show loading state
        document.getElementById('startups-loading').classList.remove('hidden');
        document.getElementById('startups-error').classList.add('hidden');
        document.getElementById('startups-content').classList.add('hidden');
        
        try {
            // Fetch startups from API with pagination
            const pageSize = 12;
            const apiFilters = { ...filters, page, limit: pageSize };
            const response = await API.getStartups(apiFilters);
            
            // Hide loading state, show content
            document.getElementById('startups-loading').classList.add('hidden');
            document.getElementById('startups-content').classList.remove('hidden');
            
            // Update startups count
            const count = response.total || response.startups.length;
            document.getElementById('startups-count').textContent = `${count} Startups Found`;
            
            // Render startups
            this.renderStartups(response.startups);
            
            // Show no results message if needed
            if (response.startups.length === 0) {
                document.getElementById('no-startups-found').classList.remove('hidden');
                document.getElementById('startups-list').classList.add('hidden');
                document.getElementById('startups-pagination').classList.add('hidden');
            } else {
                document.getElementById('no-startups-found').classList.add('hidden');
                document.getElementById('startups-list').classList.remove('hidden');
                
                // Render pagination if needed
                if (response.total > pageSize) {
                    this.renderPagination(response.total, page, pageSize, filters);
                    document.getElementById('startups-pagination').classList.remove('hidden');
                } else {
                    document.getElementById('startups-pagination').classList.add('hidden');
                }
                
                // Attach event listeners to startup cards
                this.attachStartupCardListeners();
            }
        } catch (error) {
            // Show error state
            document.getElementById('startups-loading').classList.add('hidden');
            document.getElementById('startups-error').classList.remove('hidden');
            document.getElementById('startups-error-message').textContent = error.message || 'An error occurred while fetching startups.';
            console.error('Error loading startups:', error);
        }
    },
    /**
     * Load matches tab content by calling API to get matching startups
     */
    
    /**
     * Render startups list
     * @param {Array} startups - List of startup objects
     */
    renderStartups: function(startups) {
        const container = document.getElementById('startups-list');
        
        if (!container) return;
        
        let html = '';
        
        startups.forEach(startup => {
            html += `
                <div class="startup-card bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden" data-id="${startup._id}">
                    <div class="p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="text-xl font-bold text-startup-dark dark:text-white">${startup.name}</h3>
                                <p class="text-gray-500 dark:text-gray-400">${startup.location}</p>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-startup-primary">
                                ${startup.industry}
                            </span>
                        </div>
                        <p class="mt-4 text-gray-600 dark:text-gray-300">${startup.description}</p>
                        <div class="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Funding Stage</p>
                                <p class="font-medium">${startup.funding}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Funding Amount</p>
                                <p class="font-medium">$${startup.fundingAmount ? startup.fundingAmount.toLocaleString() : '0'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
                                <p class="font-medium">${startup.employees} employees</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Founded</p>
                                <p class="font-medium">${startup.founded}</p>
                            </div>
                        </div>
                        <div class="mt-6">
                            <button class="view-startup-btn px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90 w-full" data-id="${startup._id}">
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
     * Attach event listeners to startup cards
     */
    attachStartupCardListeners: function() {
        // View startup details buttons
        document.querySelectorAll('.view-startup-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const startupId = e.target.dataset.id;
                this.showStartupDetails(startupId);
            });
        });
        
        // Entire card click
        document.querySelectorAll('.startup-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore if clicking on the button (already handled above)
                if (!e.target.classList.contains('view-startup-btn') && !e.target.closest('.view-startup-btn')) {
                    const startupId = card.dataset.id;
                    this.showStartupDetails(startupId);
                }
            });
        });
    },
    
    /**
     * Show startup details in modal
     * @param {string} startupId - Startup ID
     */
    showStartupDetails: async function(startupId) {
        // Show modal with loading state
        const modal = document.getElementById('startup-details-modal');
        const contentContainer = document.getElementById('startup-details-content');
        
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
            // Fetch startup details
            const startup = await API.getStartup(startupId);
            
            // Render startup details
            contentContainer.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-2xl font-bold text-startup-dark dark:text-white">${startup.name}</h2>
                        <p class="text-gray-500 dark:text-gray-400 mb-1">${startup.location}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-startup-primary">
                                ${startup.industry}
                            </span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                ${startup.funding}
                            </span>
                        </div>
                    </div>
                    <div>
                        ${Auth.isUserAuthenticated() && Auth.getCurrentUser().userType === 'investor' ? 
                            `<button id="connect-with-startup-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90" data-id="${startup._id}">
                                Connect
                            </button>` : 
                            ''
                        }
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-2">
                        <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-2">About</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">${startup.description}</p>
                        
                        <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-2">Elevator Pitch</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">${startup.pitch || 'No pitch provided'}</p>
                        
                        ${startup.team && startup.team.length > 0 ? `
                            <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-2">Team</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                ${startup.team.map(member => `
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0">
                                            <div class="h-10 w-10 rounded-full bg-startup-primary text-white flex items-center justify-center">
                                                <span>${member.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm font-medium text-startup-dark dark:text-white">${member.name}</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">${member.role}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-startup-dark dark:text-white mb-4">Details</h3>
                        
                        <div class="space-y-4">
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Founded</p>
                                <p class="font-medium">${startup.founded}</p>
                            </div>
                            
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
                                <p class="font-medium">${startup.employees} employees</p>
                            </div>
                            
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Funding Stage</p>
                                <p class="font-medium">${startup.funding}</p>
                            </div>
                            
                            <div>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Funding Amount</p>
                                <p class="font-medium">$${startup.fundingAmount ? startup.fundingAmount.toLocaleString() : '0'}</p>
                            </div>
                            
                            ${startup.website ? `
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Website</p>
                                    <a href="${startup.website}" target="_blank" class="text-startup-primary hover:underline font-medium">${startup.website}</a>
                                </div>
                            ` : ''}
                            
                            ${startup.socialMedia && Object.keys(startup.socialMedia).length > 0 ? `
                                <div>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Social Media</p>
                                    <div class="flex space-x-2">
                                        ${startup.socialMedia.twitter ? `<a href="${startup.socialMedia.twitter}" target="_blank" class="text-startup-primary hover:text-opacity-80"><i class="fab fa-twitter"></i></a>` : ''}
                                        ${startup.socialMedia.linkedin ? `<a href="${startup.socialMedia.linkedin}" target="_blank" class="text-startup-primary hover:text-opacity-80"><i class="fab fa-linkedin"></i></a>` : ''}
                                        ${startup.socialMedia.facebook ? `<a href="${startup.socialMedia.facebook}" target="_blank" class="text-startup-primary hover:text-opacity-80"><i class="fab fa-facebook"></i></a>` : ''}
                                        ${startup.socialMedia.instagram ? `<a href="${startup.socialMedia.instagram}" target="_blank" class="text-startup-primary hover:text-opacity-80"><i class="fab fa-instagram"></i></a>` : ''}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                ${Auth.isUserAuthenticated() && Auth.getCurrentUser().userType === 'investor' ? `
                    <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <button id="contact-startup-btn" class="px-6 py-3 bg-startup-primary text-white rounded-md hover:bg-opacity-90 mr-4" data-id="${startup._id}">
                            <i class="fas fa-comment mr-2"></i> Contact
                        </button>
                        <button id="save-startup-btn" class="px-6 py-3 border border-startup-primary text-startup-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" data-id="${startup._id}">
                            <i class="far fa-bookmark mr-2"></i> Save
                        </button>
                    </div>
                ` : ''}
            `;
            
            // Add event listeners to buttons in the modal
            this.attachStartupDetailsListeners(startup);
            
        } catch (error) {
            // Show error in modal
            contentContainer.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-red-500 text-5xl mb-4">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h3 class="text-xl font-bold text-startup-dark dark:text-white mb-2">Failed to load startup details</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                        ${error.message || 'An error occurred while fetching startup details.'}
                    </p>
                    <button id="retry-startup-details-btn" class="px-4 py-2 bg-startup-primary text-white rounded-md hover:bg-opacity-90" data-id="${startupId}">
                        Try Again
                    </button>
                </div>
            `;
            
            // Add retry button listener
            document.getElementById('retry-startup-details-btn')?.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.showStartupDetails(id);
            });
            
            console.error('Error loading startup details:', error);
        }
    },
    
    /**
     * Attach event listeners to startup details modal
     * @param {Object} startup - Startup data
     */
    attachStartupDetailsListeners: function(startup) {
        // Connect with startup button
        const connectBtn = document.getElementById('connect-with-startup-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', async (e) => {
                try {
                    // Show loading state
                    const originalText = connectBtn.innerHTML;
                    connectBtn.innerHTML = `
                        <span class="spinner inline-block mr-2"></span>
                        Connecting...
                    `;
                    connectBtn.disabled = true;
                    
                    // Send connection request
                    await API.sendConnectionRequest(startup.userId);
                    
                    // Show success message
                    app.showToast('Connection request sent!', 'success');
                    
                    // Update button
                    connectBtn.innerHTML = `<i class="fas fa-check mr-2"></i> Request Sent`;
                    connectBtn.classList.remove('bg-startup-primary');
                    connectBtn.classList.add('bg-green-500');
                    connectBtn.disabled = true;
                } catch (error) {
                    // Restore button
                    connectBtn.innerHTML = originalText;
                    connectBtn.disabled = false;
                    
                    // Show error
                    app.showToast(error.message || 'Failed to send connection request', 'error');
                    console.error('Error sending connection request:', error);
                }
            });
        }
        
        // Contact startup button
        const contactBtn = document.getElementById('contact-startup-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', async (e) => {
                try {
                    // Show loading state
                    const originalText = contactBtn.innerHTML;
                    contactBtn.innerHTML = `
                        <span class="spinner inline-block mr-2"></span>
                        Starting conversation...
                    `;
                    contactBtn.disabled = true;
                    
                    // Start conversation
                    const conversation = await API.startConversation({
                        recipient: startup.userId,
                        message: `Hi! I'm interested in learning more about ${startup.name}.`
                    });
                    
                    // Show success message
                    app.showToast('Conversation started!', 'success');
                    
                    // Close the modal
                    document.getElementById('startup-details-modal').classList.add('hidden');
                    
                    // Navigate to dashboard messages
                    app.navigateTo('dashboard');
                    // Assuming dashboard has a way to open messages tab
                    // This would need to be implemented in the dashboard page
                } catch (error) {
                    // Restore button
                    contactBtn.innerHTML = originalText;
                    contactBtn.disabled = false;
                    
                    // Show error
                    app.showToast(error.message || 'Failed to start conversation', 'error');
                    console.error('Error starting conversation:', error);
                }
            });
        }
        
        // Save startup button
        const saveBtn = document.getElementById('save-startup-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async (e) => {
                try {
                    // Toggle saved state
                    const isSaved = saveBtn.classList.contains('saved');
                    
                    if (isSaved) {
                        // Remove from saved
                        await API.removeSavedStartup(startup._id);
                        
                        // Update button
                        saveBtn.innerHTML = `<i class="far fa-bookmark mr-2"></i> Save`;
                        saveBtn.classList.remove('saved', 'bg-startup-primary', 'text-white');
                        saveBtn.classList.add('border-startup-primary', 'text-startup-primary');
                        
                        app.showToast('Removed from saved startups', 'info');
                    } else {
                        // Add to saved
                        await API.saveStartup(startup._id);
                        
                        // Update button
                        saveBtn.innerHTML = `<i class="fas fa-bookmark mr-2"></i> Saved`;
                        saveBtn.classList.add('saved', 'bg-startup-primary', 'text-white');
                        saveBtn.classList.remove('border-startup-primary', 'text-startup-primary');
                        
                        app.showToast('Added to saved startups', 'success');
                    }
                } catch (error) {
                    app.showToast(error.message || 'Failed to update saved startups', 'error');
                    console.error('Error updating saved startups:', error);
                }
            });
        }
    },
    
    /**
     * Sort startups list
     * @param {string} sortBy - Sort criteria
     */
    sortStartups: function(sortBy) {
        const container = document.getElementById('startups-list');
        const cards = Array.from(container.querySelectorAll('.startup-card'));
        
        cards.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    // Assuming newer startups have higher IDs
                    return b.dataset.id.localeCompare(a.dataset.id);
                case 'oldest':
                    return a.dataset.id.localeCompare(b.dataset.id);
                case 'funding-high':
                    const fundingA = this.extractFundingAmount(a);
                    const fundingB = this.extractFundingAmount(b);
                    return fundingB - fundingA;
                case 'funding-low':
                    const fundingC = this.extractFundingAmount(a);
                    const fundingD = this.extractFundingAmount(b);
                    return fundingC - fundingD;
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        cards.forEach(card => container.appendChild(card));
    },
    
    /**
     * Extract funding amount from startup card
     * @param {Element} card - Startup card element
     * @returns {number} - Funding amount
     */
    extractFundingAmount: function(card) {
        const fundingText = card.querySelector('p.font-medium:nth-of-type(2)').textContent;
        return parseInt(fundingText.replace(/[^0-9]/g, '')) || 0;
    },
    
    /**
     * Render pagination controls
     * @param {number} total - Total number of items
     * @param {number} currentPage - Current page number
     * @param {number} pageSize - Items per page
     * @param {Object} filters - Current filters
     */
    renderPagination: function(total, currentPage, pageSize, filters) {
        const container = document.getElementById('startups-pagination');
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
                    this.loadStartups(filters, page);
                    
                    // Scroll to top of startups section
                    document.getElementById('startups-content').scrollIntoView({ behavior: 'smooth' });
                });
            }
        });
    }
};