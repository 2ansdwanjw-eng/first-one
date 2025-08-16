// Content script that runs on Roblox pages
// This helps with data extraction and provides additional functionality

class RobloxContentScript {
    constructor() {
        this.init();
    }
    
    init() {
        // Listen for messages from the popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getCommunityMembers') {
                this.getCommunityMembers(request.communityId)
                    .then(members => sendResponse({ success: true, members }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                return true; // Keep the message channel open for async response
            }
            
            if (request.action === 'getUserWealth') {
                this.getUserWealth(request.userId)
                    .then(wealth => sendResponse({ success: true, wealth }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                return true;
            }
        });
        
        // Add some helpful features to Roblox pages
        this.addPageEnhancements();
    }
    
    async getCommunityMembers(communityId) {
        try {
            // Navigate to the community page
            const communityUrl = `https://www.roblox.com/communities/${communityId}`;
            
            // Fetch the community page
            const response = await fetch(communityUrl);
            const html = await response.text();
            
            // Parse the HTML to extract member information
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract member information from the page
            // This would need to be updated based on Roblox's actual HTML structure
            const members = this.extractMembersFromPage(doc);
            
            return members;
            
        } catch (error) {
            console.error('Error fetching community members:', error);
            throw new Error('Failed to fetch community members');
        }
    }
    
    extractMembersFromPage(doc) {
        const members = [];
        
        // This is a placeholder implementation
        // In reality, you'd need to analyze Roblox's HTML structure and extract:
        // - Member usernames
        // - Member IDs
        // - Member roles/ranks
        // - Any other relevant information
        
        // For now, return sample data
        return [
            { id: 1, username: 'SampleUser1', displayName: 'Sample User 1' },
            { id: 2, username: 'SampleUser2', displayName: 'Sample User 2' },
            { id: 3, username: 'SampleUser3', displayName: 'Sample User 3' }
        ];
    }
    
    async getUserWealth(userId) {
        try {
            // Fetch user's inventory
            const inventoryUrl = `https://www.roblox.com/users/${userId}/inventory`;
            const response = await fetch(inventoryUrl);
            const html = await response.text();
            
            // Parse the inventory page
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract limited items and their values
            const wealth = this.extractWealthFromInventory(doc);
            
            return wealth;
            
        } catch (error) {
            console.error('Error fetching user wealth:', error);
            throw new Error('Failed to fetch user wealth');
        }
    }
    
    extractWealthFromInventory(doc) {
        // This is a placeholder implementation
        // In reality, you'd need to:
        // 1. Find all limited items in the inventory
        // 2. Get their current market values
        // 3. Filter for items > 10,000 Robux
        // 4. Calculate total wealth
        
        // For now, return sample data
        return {
            totalWealth: Math.floor(Math.random() * 1000000) + 10000,
            limitedItems: [],
            itemCount: Math.floor(Math.random() * 50) + 1
        };
    }
    
    addPageEnhancements() {
        // Add helpful features to Roblox pages
        if (window.location.hostname === 'www.roblox.com') {
            this.addWealthTrackerButton();
        }
    }
    
    addWealthTrackerButton() {
        // Add a button to the page for quick access to wealth tracking
        const button = document.createElement('button');
        button.textContent = '💰 Wealth Tracker';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('click', () => {
            // Open the extension popup
            chrome.runtime.sendMessage({ action: 'openPopup' });
        });
        
        document.body.appendChild(button);
    }
}

// Initialize the content script
new RobloxContentScript();