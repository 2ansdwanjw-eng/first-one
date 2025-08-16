// Background service worker for the Roblox Community Wealth Tracker extension

class BackgroundService {
    constructor() {
        this.init();
    }
    
    init() {
        // Listen for messages from content scripts and popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'openPopup') {
                this.openExtensionPopup();
            }
            
            if (request.action === 'fetchCommunityData') {
                this.fetchCommunityData(request.communityId)
                    .then(data => sendResponse({ success: true, data }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                return true;
            }
        });
        
        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.onFirstInstall();
            }
        });
        
        // Handle extension startup
        chrome.runtime.onStartup.addListener(() => {
            this.onStartup();
        });
    }
    
    openExtensionPopup() {
        // This would open the extension popup programmatically
        // Note: Chrome doesn't allow direct popup opening from background scripts
        // This is a placeholder for future functionality
        console.log('Extension popup requested to open');
    }
    
    async fetchCommunityData(communityId) {
        try {
            // Fetch community information from Roblox API
            const communityUrl = `https://www.roblox.com/communities/${communityId}`;
            
            const response = await fetch(communityUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Extract community information
            const communityData = this.parseCommunityPage(html);
            
            return communityData;
            
        } catch (error) {
            console.error('Error fetching community data:', error);
            throw new Error('Failed to fetch community data');
        }
    }
    
    parseCommunityPage(html) {
        // Parse the community page HTML to extract relevant information
        // This would need to be updated based on Roblox's actual HTML structure
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract community name, description, member count, etc.
        const communityData = {
            name: this.extractText(doc, 'h1') || 'Unknown Community',
            description: this.extractText(doc, 'meta[name="description"]') || 'No description available',
            memberCount: this.extractMemberCount(doc),
            createdAt: this.extractCreationDate(doc)
        };
        
        return communityData;
    }
    
    extractText(doc, selector) {
        try {
            const element = doc.querySelector(selector);
            return element ? element.textContent.trim() : null;
        } catch (error) {
            return null;
        }
    }
    
    extractMemberCount(doc) {
        // This would need to be implemented based on Roblox's actual HTML structure
        // Look for member count information in the page
        return 'Unknown';
    }
    
    extractCreationDate(doc) {
        // This would need to be implemented based on Roblox's actual HTML structure
        // Look for creation date information in the page
        return 'Unknown';
    }
    
    onFirstInstall() {
        // Set up initial extension state
        chrome.storage.local.set({
            isFirstInstall: true,
            installDate: new Date().toISOString(),
            version: chrome.runtime.getManifest().version
        });
        
        // Open welcome page or show installation message
        console.log('Roblox Community Wealth Tracker extension installed successfully!');
    }
    
    onStartup() {
        // Perform any startup tasks
        console.log('Roblox Community Wealth Tracker extension started');
        
        // Check for updates or perform maintenance tasks
        this.performMaintenance();
    }
    
    async performMaintenance() {
        try {
            // Clean up old data
            const result = await chrome.storage.local.get(['lastCleanup']);
            const lastCleanup = result.lastCleanup || 0;
            const now = Date.now();
            
            // Clean up every 7 days
            if (now - lastCleanup > 7 * 24 * 60 * 60 * 1000) {
                await this.cleanupOldData();
                await chrome.storage.local.set({ lastCleanup: now });
            }
            
        } catch (error) {
            console.error('Error during maintenance:', error);
        }
    }
    
    async cleanupOldData() {
        try {
            // Remove old cached data that's older than 30 days
            const result = await chrome.storage.local.get(['members', 'lastUpdate']);
            const lastUpdate = result.lastUpdate || 0;
            const now = Date.now();
            
            // If data is older than 30 days, remove it
            if (now - lastUpdate > 30 * 24 * 60 * 60 * 1000) {
                await chrome.storage.local.remove(['members']);
                console.log('Cleaned up old member data');
            }
            
        } catch (error) {
            console.error('Error cleaning up old data:', error);
        }
    }
    
    // Helper method to make API requests with proper headers
    async makeRobloxRequest(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        };
        
        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        return fetch(url, finalOptions);
    }
}

// Initialize the background service
new BackgroundService();