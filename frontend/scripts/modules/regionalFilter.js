/**
 * Regional Filter Component for Saudi Tourism Map
 * Handles filtering by Saudi provinces and regions
 */

class RegionalFilter {
    constructor(mapComponent) {
        this.mapComponent = mapComponent;
        this.regionFilter = document.getElementById('regionFilter');
        this.currentRegion = 'all';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.populateRegionOptions();
    }
    
    setupEventListeners() {
        this.regionFilter.addEventListener('change', (e) => {
            this.handleRegionChange(e.target.value);
        });
    }
    
    populateRegionOptions() {
        // Saudi provinces data with Arabic names and coordinates
        const saudiProvinces = [
            {
                id: 'all',
                name: 'جميع المناطق',
                nameEn: 'All Regions',
                center: { lat: 23.8859, lng: 45.0792 },
                zoom: 6
            },
            {
                id: 'riyadh',
                name: 'منطقة الرياض',
                nameEn: 'Riyadh Region',
                center: { lat: 24.7136, lng: 46.6753 },
                zoom: 8,
                bounds: { west: 43.0, east: 48.0, south: 22.0, north: 27.0 }
            },
            {
                id: 'makkah',
                name: 'منطقة مكة المكرمة',
                nameEn: 'Makkah Region',
                center: { lat: 21.3891, lng: 39.8579 },
                zoom: 8,
                bounds: { west: 38.0, east: 42.0, south: 20.0, north: 25.0 }
            },
            {
                id: 'madinah',
                name: 'منطقة المدينة المنورة',
                nameEn: 'Madinah Region',
                center: { lat: 24.5247, lng: 39.5692 },
                zoom: 8,
                bounds: { west: 36.0, east: 42.0, south: 22.0, north: 28.0 }
            },
            {
                id: 'eastern',
                name: 'المنطقة الشرقية',
                nameEn: 'Eastern Province',
                center: { lat: 26.4282, lng: 50.0647 },
                zoom: 8,
                bounds: { west: 46.0, east: 55.0, south: 16.0, north: 28.0 }
            },
            {
                id: 'qassim',
                name: 'منطقة القصيم',
                nameEn: 'Qassim Region',
                center: { lat: 26.3260, lng: 43.9750 },
                zoom: 9,
                bounds: { west: 42.0, east: 46.0, south: 25.0, north: 27.0 }
            },
            {
                id: 'hail',
                name: 'منطقة حائل',
                nameEn: 'Hail Region',
                center: { lat: 27.5114, lng: 41.6900 },
                zoom: 9,
                bounds: { west: 40.0, east: 43.0, south: 26.0, north: 29.0 }
            },
            {
                id: 'tabuk',
                name: 'منطقة تبوك',
                nameEn: 'Tabuk Region',
                center: { lat: 28.3838, lng: 36.5550 },
                zoom: 8,
                bounds: { west: 34.0, east: 40.0, south: 26.0, north: 32.0 }
            },
            {
                id: 'northern',
                name: 'المنطقة الشمالية',
                nameEn: 'Northern Borders Region',
                center: { lat: 30.9753, lng: 41.0381 },
                zoom: 8,
                bounds: { west: 38.0, east: 44.0, south: 28.0, north: 32.0 }
            },
            {
                id: 'jazan',
                name: 'منطقة جازان',
                nameEn: 'Jazan Region',
                center: { lat: 16.8892, lng: 42.5511 },
                zoom: 9,
                bounds: { west: 41.0, east: 44.0, south: 16.0, north: 19.0 }
            },
            {
                id: 'najran',
                name: 'منطقة نجران',
                nameEn: 'Najran Region',
                center: { lat: 17.4917, lng: 44.1277 },
                zoom: 9,
                bounds: { west: 43.0, east: 47.0, south: 17.0, north: 20.0 }
            },
            {
                id: 'baha',
                name: 'منطقة الباحة',
                nameEn: 'Al Baha Region',
                center: { lat: 20.0129, lng: 41.4687 },
                zoom: 10,
                bounds: { west: 41.0, east: 42.5, south: 19.0, north: 20.5 }
            },
            {
                id: 'jouf',
                name: 'منطقة الجوف',
                nameEn: 'Al Jouf Region',
                center: { lat: 29.8114, lng: 40.2095 },
                zoom: 9,
                bounds: { west: 38.0, east: 42.0, south: 29.0, north: 32.0 }
            }
        ];
        
        // Clear existing options except the first one
        this.regionFilter.innerHTML = '<option value="all">جميع المناطق</option>';
        
        // Add province options
        saudiProvinces.slice(1).forEach(province => {
            const option = document.createElement('option');
            option.value = province.id;
            option.textContent = province.name;
            option.dataset.center = JSON.stringify(province.center);
            option.dataset.zoom = province.zoom;
            option.dataset.bounds = JSON.stringify(province.bounds);
            this.regionFilter.appendChild(option);
        });
    }
    
    handleRegionChange(regionId) {
        this.currentRegion = regionId;
        
        if (regionId === 'all') {
            this.showAllRegions();
        } else {
            this.showSpecificRegion(regionId);
        }
        
        // Update map component region
        this.mapComponent.setRegion(regionId);
        
        // Add visual feedback
        this.showRegionChangeFeedback(regionId);
    }
    
    showAllRegions() {
        // Center on Saudi Arabia
        this.mapComponent.map.setCenter(this.mapComponent.saudiCenter);
        this.mapComponent.map.setZoom(6);
        
        // Fit to Saudi Arabia bounds
        const saudiBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(this.mapComponent.saudiBounds.south, this.mapComponent.saudiBounds.west),
            new google.maps.LatLng(this.mapComponent.saudiBounds.north, this.mapComponent.saudiBounds.east)
        );
        
        this.mapComponent.map.fitBounds(saudiBounds);
    }
    
    showSpecificRegion(regionId) {
        const option = this.regionFilter.querySelector(`option[value="${regionId}"]`);
        
        if (option && option.dataset.center && option.dataset.zoom) {
            const center = JSON.parse(option.dataset.center);
            const zoom = parseInt(option.dataset.zoom);
            
            // Center on the region
            this.mapComponent.map.setCenter(center);
            this.mapComponent.map.setZoom(zoom);
            
            // If bounds are available, fit to bounds
            if (option.dataset.bounds) {
                const bounds = JSON.parse(option.dataset.bounds);
                const regionBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(bounds.south, bounds.west),
                    new google.maps.LatLng(bounds.north, bounds.east)
                );
                
                this.mapComponent.map.fitBounds(regionBounds);
            }
        }
    }
    
    showRegionChangeFeedback(regionId) {
        // Add a subtle animation to the filter
        this.regionFilter.style.transform = 'scale(1.05)';
        this.regionFilter.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            this.regionFilter.style.transform = 'scale(1)';
        }, 200);
        
        // Show region name in a temporary notification
        const regionName = this.regionFilter.options[this.regionFilter.selectedIndex].text;
        this.showRegionNotification(regionName);
    }
    
    showRegionNotification(regionName) {
        // Create temporary notification element
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
        
        notification.textContent = `عرض: ${regionName}`;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    getCurrentRegion() {
        return this.currentRegion;
    }
    
    getCurrentRegionName() {
        return this.regionFilter.options[this.regionFilter.selectedIndex].text;
    }
    
    resetToAllRegions() {
        this.regionFilter.value = 'all';
        this.handleRegionChange('all');
    }
    
    // Method to get region statistics (optional feature)
    async getRegionStatistics(regionId) {
        if (regionId === 'all') {
            return {
                name: 'جميع المناطق',
                totalPlaces: this.mapComponent.markers.length,
                categories: this.getCategoryBreakdown()
            };
        }
        
        // For specific regions, you could implement additional statistics
        return {
            name: this.getCurrentRegionName(),
            totalPlaces: this.mapComponent.markers.filter(marker => 
                this.isMarkerInRegion(marker, regionId)
            ).length
        };
    }
    
    getCategoryBreakdown() {
        const breakdown = {};
        
        this.mapComponent.markers.forEach(marker => {
            const category = marker.category || 'unknown';
            breakdown[category] = (breakdown[category] || 0) + 1;
        });
        
        return breakdown;
    }
    
    isMarkerInRegion(marker, regionId) {
        const option = this.regionFilter.querySelector(`option[value="${regionId}"]`);
        
        if (!option || !option.dataset.bounds) {
            return false;
        }
        
        const bounds = JSON.parse(option.dataset.bounds);
        const position = marker.getPosition();
        
        return position.lat() >= bounds.south && 
               position.lat() <= bounds.north &&
               position.lng() >= bounds.west && 
               position.lng() <= bounds.east;
    }
}

// Export for use in other modules
window.RegionalFilter = RegionalFilter;
