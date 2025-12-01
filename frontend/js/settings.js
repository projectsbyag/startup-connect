const SettingsPage = {
    render: function() {
        return `
            <div class="bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="max-w-3xl mx-auto">
                        <h1 class="text-3xl font-bold text-startup-dark dark:text-white mb-8">Settings</h1>
                        
                        <!-- Settings Navigation -->
                        <div class="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
                            <nav class="flex space-x-4 p-4" id="settings-nav">
                                <button class="px-4 py-2 rounded-md text-sm font-medium text-startup-primary bg-gray-100 dark:bg-gray-700" data-tab="account">
                                    Account Settings
                                </button>
                                <button class="px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-startup-primary" data-tab="notifications">
                                    Notifications
                                </button>
                                <button class="px-4 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-startup-primary" data-tab="privacy">
                                    Privacy & Security
                                </button>
                            </nav>
                        </div>

                        <!-- Settings Content -->
                        <div id="settings-content">
                            <!-- Account Settings Tab -->
                            <div id="account-settings" class="settings-tab">
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                                    <!-- Profile Information -->
                                    <div class="p-6">
                                        <h3 class="text-lg font-medium text-startup-dark dark:text-white mb-4">Profile Information</h3>
                                        <form id="profile-form" class="space-y-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                                <input type="text" id="profile-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-startup-primary focus:ring-startup-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                                <input type="email" id="profile-email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-startup-primary focus:ring-startup-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            </div>
                                            <div>
                                                <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <!-- Change Password -->
                                    <div class="p-6">
                                        <h3 class="text-lg font-medium text-startup-dark dark:text-white mb-4">Change Password</h3>
                                        <form id="password-form" class="space-y-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                                                <input type="password" id="current-password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-startup-primary focus:ring-startup-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                                <input type="password" id="new-password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-startup-primary focus:ring-startup-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                                                <input type="password" id="confirm-password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-startup-primary focus:ring-startup-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            </div>
                                            <div>
                                                <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-startup-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-startup-primary">
                                                    Update Password
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <!-- Delete Account -->
                
                                </div>
                            </div>

                            <!-- Notifications Tab -->
                            <div id="notifications-settings" class="settings-tab hidden">
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                    <h3 class="text-lg font-medium text-startup-dark dark:text-white mb-6">Email Notifications</h3>
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">New Messages</h4>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Get notified when you receive a new message</p>
                                            </div>
                                            <label class="switch">
                                                <input type="checkbox" id="new-messages-toggle" checked>
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">New Matches</h4>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Get notified when you have a new startup/investor match</p>
                                            </div>
                                            <label class="switch">
                                                <input type="checkbox" id="new-matches-toggle" checked>
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Platform Updates</h4>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Receive updates about new features and improvements</p>
                                            </div>
                                            <label class="switch">
                                                <input type="checkbox" id="updates-toggle">
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Privacy & Security Tab -->
                            <div id="privacy-settings" class="settings-tab hidden">
                                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                    <h3 class="text-lg font-medium text-startup-dark dark:text-white mb-6">Privacy Settings</h3>
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Visibility</h4>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Control who can see your profile</p>
                                            </div>
                                            <select id="profile-visibility" class="rounded-md border-gray-300 shadow-sm focus:border-startup-primary focus:ring-startup-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                <option value="public">Public</option>
                                                <option value="matches">Matches Only</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    setupEventListeners: function(app) {
        // Settings navigation
        const settingsNav = document.getElementById('settings-nav');
        const tabs = document.querySelectorAll('.settings-tab');
        
        settingsNav?.addEventListener('click', (e) => {
            if (e.target.matches('[data-tab]')) {
                const tabId = e.target.dataset.tab;
                
                // Update navigation highlighting
                settingsNav.querySelectorAll('button').forEach(btn => {
                    if (btn.dataset.tab === tabId) {
                        btn.classList.add('text-startup-primary', 'bg-gray-100', 'dark:bg-gray-700');
                        btn.classList.remove('text-gray-500', 'dark:text-gray-400');
                    } else {
                        btn.classList.remove('text-startup-primary', 'bg-gray-100', 'dark:bg-gray-700');
                        btn.classList.add('text-gray-500', 'dark:text-gray-400');
                    }
                });
                
                // Show selected tab
                tabs.forEach(tab => {
                    if (tab.id === `${tabId}-settings`) {
                        tab.classList.remove('hidden');
                    } else {
                        tab.classList.add('hidden');
                    }
                });
            }
        });

        // Profile form submission
        // Inside setupEventListeners:
document.getElementById('password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (newPassword !== confirmPassword) {
        app.showToast('New passwords do not match', 'error');
        return;
    }
    
    try {
        await Auth.changePassword({
            currentPassword,
            newPassword
        });
        app.showToast('Password updated successfully!', 'success');
        e.target.reset();
    } catch (error) {
        app.showToast(error.message || 'Failed to update password', 'error');
    }
});

document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    
    try {
        await Auth.updateProfile({ name, email });
        app.showToast('Profile updated successfully!', 'success');
    } catch (error) {
        app.showToast(error.message || 'Failed to update profile', 'error');
    }
});
        // Delete account
        

        // Load current user data
        const user = Auth.getCurrentUser();
        if (user) {
            document.getElementById('profile-name').value = user.name;
            document.getElementById('profile-email').value = user.email;
        }

        // Notification toggles
        ['new-messages-toggle', 'new-matches-toggle', 'updates-toggle'].forEach(id => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.addEventListener('change', async () => {
                    try {
                        await API.updateNotificationSettings({
                            [id.replace('-toggle', '')]: toggle.checked
                        });
                        app.showToast('Notification settings updated', 'success');
                    } catch (error) {
                        app.showToast('Failed to update notification settings', 'error');
                        toggle.checked = !toggle.checked; // Revert change
                    }
                });
            }
        });

        // Profile visibility
        document.getElementById('profile-visibility')?.addEventListener('change', async (e) => {
            try {
                await API.updatePrivacySettings({
                    profileVisibility: e.target.value
                });
                app.showToast('Privacy settings updated', 'success');
            } catch (error) {
                app.showToast('Failed to update privacy settings', 'error');
            }
        });

        // 2FA setup
        document.getElementById('setup-2fa-btn')?.addEventListener('click', () => {
            // TODO: Implement 2FA setup flow
            app.showToast('2FA setup coming soon', 'info');
        });
    }
};
