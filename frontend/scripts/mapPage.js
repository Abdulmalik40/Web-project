/**
 * Saudi Tourism Map Page Controller
 * Main controller that initializes and coordinates all map components
 */
import { addPlaceToTrip } from "./trip-details.js";

class MapPageController {
    constructor() {
        this.mapComponent = null;
        this.searchComponent = null;
        this.regionalFilter = null;
        this.historicalMarkers = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                this.initializeComponents();
            }
        } catch (error) {
            console.error('Error initializing map page:', error);
            this.showError('حدث خطأ في تحميل الصفحة. يرجى إعادة تحميل الصفحة.');
        }
    }
    
    async initializeComponents() {
        try {
            // Initialize map component first
            this.mapComponent = new SaudiMapComponent();
            
            // Wait for map to be ready
            await this.waitForMapReady();
            
            // Initialize other components
            this.initializeSearchComponent();
            this.initializeRegionalFilter();
            this.initializeHistoricalMarkers();
            this.initializeCategoryFilters();
            this.initializeMapControls();
            
            this.isInitialized = true;
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Error initializing components:', error);
            this.showError('حدث خطأ في تحميل مكونات الخريطة. يرجى المحاولة مرة أخرى.');
        }
    }
    
    async waitForMapReady() {
        return new Promise((resolve) => {
            const checkMapReady = () => {
                if (this.mapComponent && this.mapComponent.map) {
                    resolve();
                } else {
                    setTimeout(checkMapReady, 100);
                }
            };
            checkMapReady();
        });
    }
    
    initializeSearchComponent() {
        this.searchComponent = new SearchComponent(this.mapComponent);
    }
    
    initializeRegionalFilter() {
        this.regionalFilter = new RegionalFilter(this.mapComponent);
    }
    
    initializeHistoricalMarkers() {
        this.historicalMarkers = new HistoricalMarkers(this.mapComponent);
        
        // Make historicalMarkers available globally for modal interactions
        window.historicalMarkers = this.historicalMarkers;
    }
    
    initializeCategoryFilters() {
        const categoryCheckboxes = document.querySelectorAll('.category-filters input[type="checkbox"]');
        
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCategoryFilters();
            });
        });
    }
    
    updateCategoryFilters() {
        const selectedCategories = Array.from(
            document.querySelectorAll('.category-filters input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);
        
        this.mapComponent.setCategories(selectedCategories);
        this.updateLegendVisibility(selectedCategories);
    }
    
    updateLegendVisibility(selectedCategories) {
        const legendItems = document.querySelectorAll('.legend-item');
        
        legendItems.forEach(item => {
            const icon = item.querySelector('.legend-icon').textContent;
            const category = this.getCategoryFromIcon(icon);
            
            if (selectedCategories.includes(category)) {
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0.4';
            }
        });
    }
    
    getCategoryFromIcon(icon) {
        const iconToCategory = {
            '🕌': 'religion.place_of_worship',
            '🏛️': 'tourism.sights',
            '🍽️': 'commercial.restaurant',
            '🏨': 'accommodation.hotel',
            '👑': 'historical'
        };
        return iconToCategory[icon] || '';
    }
    
    initializeMapControls() {
        // Center on Saudi Arabia button
        const centerBtn = document.getElementById('centerSaudi');
        if (centerBtn) {
            centerBtn.addEventListener('click', () => {
                this.mapComponent.centerOnSaudi();
                this.showNotification('تم التركيز على المملكة العربية السعودية');
            });
        }
        
        // Toggle satellite view button
        const satelliteBtn = document.getElementById('toggleSatellite');
        if (satelliteBtn) {
            satelliteBtn.addEventListener('click', () => {
                this.mapComponent.toggleSatellite();
                const isSatellite = this.mapComponent.map.getMapTypeId() === 'satellite';
                satelliteBtn.innerHTML = `<span>${isSatellite ? '🗺️' : '🛰️'}</span> ${isSatellite ? 'عرض الخريطة' : 'عرض القمر الصناعي'}`;
            });
        }
        
        // Reset filters button
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAllFilters();
            });
        }
    }
    
    resetAllFilters() {
        // Reset region filter
        this.regionalFilter.resetToAllRegions();
        
        // Reset category filters
        const categoryCheckboxes = document.querySelectorAll('.category-filters input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Reset search
        this.searchComponent.clearSearch();
        
        // Update map
        this.updateCategoryFilters();
        
        this.showNotification('تم إعادة تعيين جميع المرشحات');
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #006233;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Tajawal', sans-serif;
            font-size: 0.9rem;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 98, 51, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showSuccessMessage() {
        this.showNotification('تم تحميل الخريطة بنجاح! استكشف معالم المملكة العربية السعودية');
    }
    
    showError(message) {
        const loadingElement = document.getElementById('mapLoading');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <div style="text-align: center; color: #e74c3c;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">⚠️</div>
                    <p style="font-family: 'Tajawal', sans-serif; font-size: 1.1rem; margin-bottom: 16px;">${message}</p>
                    <button onclick="location.reload()" style="
                        background: #006233; 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 8px; 
                        cursor: pointer;
                        font-family: 'Tajawal', sans-serif;
                        margin-right: 8px;
                    ">إعادة تحميل الصفحة</button>
                    <button onclick="window.history.back()" style="
                        background: #6c757d; 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 8px; 
                        cursor: pointer;
                        font-family: 'Tajawal', sans-serif;
                    ">العودة</button>
                </div>
            `;
        }
    }
    
    // Public methods for external access
    getMapComponent() {
        return this.mapComponent;
    }
    
    getSearchComponent() {
        return this.searchComponent;
    }
    
    getRegionalFilter() {
        return this.regionalFilter;
    }
    
    getHistoricalMarkers() {
        return this.historicalMarkers;
    }
    
    // Method to highlight specific historical period
    highlightHistoricalPeriod(period) {
        if (this.historicalMarkers) {
            this.historicalMarkers.filterByPeriod(period);
            this.showNotification(`تم عرض المعالم التاريخية لـ: ${period}`);
        }
    }
    
    // Method to search for specific historical site
    searchHistoricalSite(siteName) {
        if (this.searchComponent) {
            this.searchComponent.searchInput.value = siteName;
            this.searchComponent.performSearch(siteName);
        }
    }
    
    // Method to get current map statistics
    getMapStatistics() {
        if (!this.isInitialized) return null;
        
        return {
            totalMarkers: this.mapComponent.markers.length,
            historicalSites: this.historicalMarkers.getAllSites().length,
            currentRegion: this.regionalFilter.getCurrentRegionName(),
            selectedCategories: Array.from(this.mapComponent.selectedCategories)
        };
    }
}

// Initialize the map page controller when the script loads
let mapPageController;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mapPageController = new MapPageController();
        window.mapPageController = mapPageController;
    });
} else {
    mapPageController = new MapPageController();
    window.mapPageController = mapPageController;
}

// Export for global access
window.MapPageController = MapPageController;
