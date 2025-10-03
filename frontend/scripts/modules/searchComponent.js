/**
 * Search Component for Saudi Tourism Map
 * Handles place search with autocomplete and suggestions
 */

class SearchComponent {
    constructor(mapComponent) {
        this.mapComponent = mapComponent;
        this.searchInput = document.getElementById('placeSearch');
        this.searchBtn = document.getElementById('searchBtn');
        this.suggestionsContainer = document.getElementById('searchSuggestions');
        this.currentQuery = '';
        this.suggestions = [];
        this.selectedIndex = -1;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }
    
    setupEventListeners() {
        // Search input events
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        
        this.searchInput.addEventListener('focus', () => {
            if (this.suggestions.length > 0) {
                this.showSuggestions();
            }
        });
        
        // Search button click
        this.searchBtn.addEventListener('click', () => {
            this.performSearch(this.searchInput.value);
        });
        
        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
        
        // Prevent form submission on Enter in search
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectSuggestion(this.selectedIndex);
                } else {
                    this.performSearch(this.searchInput.value);
                }
            }
        });
    }
    
    setupKeyboardNavigation() {
        this.searchInput.addEventListener('keydown', (e) => {
            if (!this.suggestionsContainer.classList.contains('show')) return;
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateSuggestions(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateSuggestions(-1);
                    break;
                case 'Escape':
                    this.hideSuggestions();
                    break;
            }
        });
    }
    
    async handleSearchInput(query) {
        this.currentQuery = query.trim();
        
        if (this.currentQuery.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        try {
            // Debounce search requests
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(async () => {
                await this.getSuggestions(this.currentQuery);
            }, 300);
            
        } catch (error) {
            console.error('Error getting suggestions:', error);
        }
    }
    
    async getSuggestions(query) {
        try {
            // Search within Saudi Arabia bounds
            const searchUrl = `https://api.geoapify.com/v1/geocode/autocomplete?` +
                `text=${encodeURIComponent(query)}` +
                `&filter=countrycode:sa` +
                `&limit=8` +
                `&apiKey=636790d9734f4bf2af3a9f2393bdcc1d`;
            
            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Search request failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.features) {
                this.suggestions = data.features.map(feature => ({
                    name: feature.properties.formatted || feature.properties.name || 'مكان غير معروف',
                    address: feature.properties.address_line2 || feature.properties.city || '',
                    coordinates: {
                        lat: feature.geometry.coordinates[1],
                        lng: feature.geometry.coordinates[0]
                    },
                    type: this.getLocationType(feature.properties)
                }));
                
                this.displaySuggestions();
            }
            
        } catch (error) {
            console.error('Error getting search suggestions:', error);
            this.suggestions = [];
            this.hideSuggestions();
        }
    }
    
    getLocationType(properties) {
        if (properties.amenity) {
            const amenityTypes = {
                'place_of_worship': 'معلم ديني',
                'restaurant': 'مطعم',
                'hotel': 'فندق',
                'museum': 'متحف',
                'tourist_attraction': 'معلم سياحي'
            };
            return amenityTypes[properties.amenity] || 'مكان';
        }
        
        if (properties.type) {
            const typeNames = {
                'city': 'مدينة',
                'town': 'بلدة',
                'village': 'قرية',
                'state': 'منطقة',
                'country': 'دولة'
            };
            return typeNames[properties.type] || 'مكان';
        }
        
        return 'مكان';
    }
    
    displaySuggestions() {
        if (this.suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.suggestionsContainer.innerHTML = '';
        
        this.suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">${this.getSuggestionIcon(suggestion.type)}</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #006233; font-size: 0.95rem;">
                            ${suggestion.name}
                        </div>
                        ${suggestion.address ? `
                            <div style="font-size: 0.85rem; color: #666; margin-top: 2px;">
                                ${suggestion.address}
                            </div>
                        ` : ''}
                        <div style="font-size: 0.8rem; color: #999; margin-top: 2px;">
                            ${suggestion.type}
                        </div>
                    </div>
                </div>
            `;
            
            suggestionElement.addEventListener('click', () => {
                this.selectSuggestion(index);
            });
            
            suggestionElement.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSuggestionHighlight();
            });
            
            this.suggestionsContainer.appendChild(suggestionElement);
        });
        
        this.selectedIndex = -1;
        this.showSuggestions();
    }
    
    getSuggestionIcon(type) {
        const icons = {
            'معلم ديني': '🕌',
            'مطعم': '🍽️',
            'فندق': '🏨',
            'متحف': '🏛️',
            'معلم سياحي': '🏛️',
            'مدينة': '🏙️',
            'بلدة': '🏘️',
            'قرية': '🏘️',
            'منطقة': '🗺️',
            'مكان': '📍'
        };
        return icons[type] || '📍';
    }
    
    navigateSuggestions(direction) {
        const maxIndex = this.suggestions.length - 1;
        
        if (direction === 1) { // Arrow Down
            this.selectedIndex = this.selectedIndex < maxIndex ? this.selectedIndex + 1 : 0;
        } else { // Arrow Up
            this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : maxIndex;
        }
        
        this.updateSuggestionHighlight();
    }
    
    updateSuggestionHighlight() {
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.style.background = '#e8f5e8';
                item.style.color = '#006233';
            } else {
                item.style.background = '';
                item.style.color = '';
            }
        });
    }
    
    selectSuggestion(index) {
        if (index >= 0 && index < this.suggestions.length) {
            const suggestion = this.suggestions[index];
            this.searchInput.value = suggestion.name;
            this.hideSuggestions();
            this.goToLocation(suggestion.coordinates, suggestion.name);
        }
    }
    
    async performSearch(query) {
        if (!query.trim()) return;
        
        try {
            // Show loading state
            this.searchBtn.innerHTML = '<span>⏳</span>';
            
            // Search for the location
            const searchUrl = `https://api.geoapify.com/v1/geocode/search?` +
                `text=${encodeURIComponent(query)}` +
                `&filter=countrycode:sa` +
                `&limit=1` +
                `&apiKey=636790d9734f4bf2af3a9f2393bdcc1d`;
            
            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Search request failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const coordinates = {
                    lat: feature.geometry.coordinates[1],
                    lng: feature.geometry.coordinates[0]
                };
                
                this.goToLocation(coordinates, feature.properties.formatted || query);
            } else {
                this.showNoResultsMessage(query);
            }
            
        } catch (error) {
            console.error('Error performing search:', error);
            this.showErrorMessage();
        } finally {
            // Reset button state
            this.searchBtn.innerHTML = '<span>🔍</span>';
        }
    }
    
    goToLocation(coordinates, name) {
        // Center map on the location
        this.mapComponent.map.setCenter(coordinates);
        this.mapComponent.map.setZoom(15);
        
        // Add a temporary marker for the searched location
        const marker = new google.maps.Marker({
            position: coordinates,
            map: this.mapComponent.map,
            label: {
                text: '🎯',
                color: '#006233',
                fontSize: '20px',
                fontWeight: 'bold'
            },
            title: name,
            zIndex: 1000
        });
        
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="font-family: 'Tajawal', sans-serif; direction: rtl; text-align: right;">
                    <h3 style="margin: 0; color: #006233; font-size: 1.1rem;">🎯 ${name}</h3>
                    <p style="margin: 8px 0 0 0; color: #666; font-size: 0.9rem;">الموقع المطلوب</p>
                </div>
            `
        });
        
        infoWindow.open(this.mapComponent.map, marker);
        
        // Remove the marker after 5 seconds
        setTimeout(() => {
            marker.setMap(null);
            infoWindow.close();
        }, 5000);
        
        this.hideSuggestions();
    }
    
    showSuggestions() {
        this.suggestionsContainer.classList.add('show');
    }
    
    hideSuggestions() {
        this.suggestionsContainer.classList.remove('show');
        this.selectedIndex = -1;
    }
    
    showNoResultsMessage(query) {
        // You can implement a toast notification or modal here
        console.log(`No results found for: ${query}`);
        
        // For now, just show an alert
        alert(`لم يتم العثور على نتائج لـ: ${query}`);
    }
    
    showErrorMessage() {
        alert('حدث خطأ في البحث. يرجى المحاولة مرة أخرى.');
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.hideSuggestions();
        this.currentQuery = '';
        this.suggestions = [];
    }
}

// Export for use in other modules
window.SearchComponent = SearchComponent;
