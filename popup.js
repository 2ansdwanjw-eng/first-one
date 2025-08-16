class RobloxCommunityTracker {
    constructor() {
        this.currentCommunityId = null;
        this.members = [];
        this.isSearching = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadStoredData();
    }
    
    initializeElements() {
        this.communityLinkInput = document.getElementById('communityLink');
        this.searchBtn = document.getElementById('searchBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.status = document.getElementById('status');
        this.progress = document.getElementById('progress');
        this.progressFill = document.getElementById('progressFill');
        this.results = document.getElementById('results');
    }
    
    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.refreshBtn.addEventListener('click', () => this.handleRefresh());
        this.communityLinkInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
    }
    
    loadStoredData() {
        chrome.storage.local.get(['communityId', 'members'], (result) => {
            if (result.communityId) {
                this.currentCommunityId = result.communityId;
                this.communityLinkInput.value = `https://www.roblox.com/communities/${result.communityId}`;
            }
            if (result.members && result.members.length > 0) {
                this.members = result.members;
                this.displayResults();
                this.refreshBtn.style.display = 'inline-block';
            }
        });
    }
    
    extractCommunityId(link) {
        try {
            const url = new URL(link);
            const pathParts = url.pathname.split('/');
            
            // Look for the communities pattern: /communities/{id}/
            const communitiesIndex = pathParts.findIndex(part => part === 'communities');
            if (communitiesIndex !== -1 && pathParts[communitiesIndex + 1]) {
                const communityId = pathParts[communitiesIndex + 1];
                
                // Validate that it's a numeric ID
                if (/^\d+$/.test(communityId)) {
                    return communityId;
                }
            }
            
            throw new Error('Invalid community link format');
        } catch (error) {
            throw new Error('Invalid URL format');
        }
    }
    
    validateCommunityId(communityId) {
        // Basic validation: must be numeric and reasonable length
        return /^\d{1,10}$/.test(communityId);
    }
    
    async handleSearch() {
        const link = this.communityLinkInput.value.trim();
        
        if (!link) {
            this.showStatus('Please enter a community link', 'error');
            return;
        }
        
        try {
            const communityId = this.extractCommunityId(link);
            
            if (!this.validateCommunityId(communityId)) {
                this.showStatus('Invalid community ID format', 'error');
                return;
            }
            
            this.currentCommunityId = communityId;
            this.showStatus('Searching for community members...', 'info');
            this.showProgress();
            
            // Store the community ID
            chrome.storage.local.set({ communityId: communityId });
            
            await this.fetchCommunityMembers(communityId);
            
        } catch (error) {
            this.showStatus(`Error: ${error.message}`, 'error');
            this.hideProgress();
        }
    }
    
    async handleRefresh() {
        if (!this.currentCommunityId) {
            this.showStatus('No community selected', 'error');
            return;
        }
        
        this.showStatus('Refreshing member list...', 'info');
        this.showProgress();
        
        try {
            await this.fetchCommunityMembers(this.currentCommunityId);
        } catch (error) {
            this.showStatus(`Error refreshing: ${error.message}`, 'error');
            this.hideProgress();
        }
    }
    
    async fetchCommunityMembers(communityId) {
        try {
            this.isSearching = true;
            this.searchBtn.disabled = true;
            
            // First, get the community members list
            const members = await this.getCommunityMembers(communityId);
            
            // Then, calculate wealth for each member
            const membersWithWealth = await this.calculateMembersWealth(members);
            
            // Sort by wealth (descending)
            this.members = membersWithWealth.sort((a, b) => b.totalWealth - a.totalWealth);
            
            // Store results
            chrome.storage.local.set({ members: this.members });
            
            this.displayResults();
            this.showStatus(`Found ${this.members.length} members`, 'success');
            this.refreshBtn.style.display = 'inline-block';
            
        } catch (error) {
            throw error;
        } finally {
            this.isSearching = false;
            this.searchBtn.disabled = false;
            this.hideProgress();
        }
    }
    
    async getCommunityMembers(communityId) {
        // This would need to be implemented based on Roblox's actual API
        // For now, we'll simulate the process
        const members = [];
        
        // Simulate API calls to get community members
        // In reality, you'd need to:
        // 1. Fetch the community page
        // 2. Extract member information
        // 3. Handle pagination if there are many members
        
        // For demonstration, we'll create some sample data
        const sampleMembers = [
            { id: 1, username: 'SampleUser1', displayName: 'Sample User 1' },
            { id: 2, username: 'SampleUser2', displayName: 'Sample User 2' },
            { id: 3, username: 'SampleUser3', displayName: 'Sample User 3' }
        ];
        
        // Simulate API delay
        await this.delay(2000);
        
        return sampleMembers;
    }
    
    async calculateMembersWealth(members) {
        const membersWithWealth = [];
        
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            
            // Update progress
            const progress = ((i + 1) / members.length) * 100;
            this.updateProgress(progress);
            
            try {
                const wealth = await this.calculateUserWealth(member.id);
                membersWithWealth.push({
                    ...member,
                    totalWealth: wealth.totalWealth,
                    limitedItems: wealth.limitedItems,
                    itemCount: wealth.itemCount
                });
                
                // Small delay to avoid overwhelming the API
                await this.delay(100);
                
            } catch (error) {
                console.error(`Error calculating wealth for ${member.username}:`, error);
                membersWithWealth.push({
                    ...member,
                    totalWealth: 0,
                    limitedItems: [],
                    itemCount: 0
                });
            }
        }
        
        return membersWithWealth;
    }
    
    async calculateUserWealth(userId) {
        // This would need to be implemented based on Roblox's actual API
        // For now, we'll simulate the process
        
        // In reality, you'd need to:
        // 1. Fetch the user's inventory
        // 2. Filter for limited items
        // 3. Calculate total value based on current market prices
        
        // Simulate API delay
        await this.delay(500);
        
        // Return sample data
        return {
            totalWealth: Math.floor(Math.random() * 1000000) + 10000,
            limitedItems: [],
            itemCount: Math.floor(Math.random() * 50) + 1
        };
    }
    
    displayResults() {
        if (!this.members || this.members.length === 0) {
            this.results.innerHTML = '<div class="loading">No members found</div>';
            return;
        }
        
        const resultsHTML = this.members.map((member, index) => `
            <div class="member-item">
                <div class="member-header">
                    <div class="member-name">${member.displayName || member.username}</div>
                    <div class="member-wealth">${this.formatRobux(member.totalWealth)}</div>
                </div>
                <div class="member-details">
                    <span>Username: @${member.username}</span>
                    <span>Limited Items: ${member.itemCount}</span>
                    <span>Rank: #${index + 1}</span>
                </div>
            </div>
        `).join('');
        
        this.results.innerHTML = resultsHTML;
    }
    
    formatRobux(amount) {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`;
        }
        return amount.toString();
    }
    
    showStatus(message, type = 'info') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        this.status.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.status.style.display = 'none';
            }, 5000);
        }
    }
    
    showProgress() {
        this.progress.style.display = 'block';
        this.updateProgress(0);
    }
    
    hideProgress() {
        this.progress.style.display = 'none';
    }
    
    updateProgress(percentage) {
        this.progressFill.style.width = `${percentage}%`;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the extension when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new RobloxCommunityTracker();
});