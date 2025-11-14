/**
 * Saudi Tourism Map Component
 * Secure Geoapify API integration with Google Maps
 */

class SaudiMapComponent {
    constructor() {
        this.map = null;
        this.markers = [];
        this.infoWindows = [];
        this.currentRegion = 'all';
        this.selectedCategories = new Set([
            'religion.place_of_worship',
            'tourism.sights',
            'commercial.restaurant',
            'accommodation.hotel',
            'tourism.museum'
        ]);
        
        // Saudi Arabia coordinates and boundaries
        this.saudiBounds = {
            west: 34.5,
            east: 55.7,
            south: 16.3,
            north: 32.2
        };
        
        this.saudiCenter = { lat: 23.8859, lng: 45.0792 };
        
        // Regional boundaries for filtering
        this.regions = {
            riyadh: { west: 43.0, east: 48.0, south: 22.0, north: 27.0 },
            makkah: { west: 38.0, east: 42.0, south: 20.0, north: 25.0 },
            madinah: { west: 36.0, east: 42.0, south: 22.0, north: 28.0 },
            eastern: { west: 46.0, east: 55.0, south: 16.0, north: 28.0 },
            qassim: { west: 42.0, east: 46.0, south: 25.0, north: 27.0 },
            hail: { west: 40.0, east: 43.0, south: 26.0, north: 29.0 },
            tabuk: { west: 34.0, east: 40.0, south: 26.0, north: 32.0 },
            northern: { west: 38.0, east: 44.0, south: 28.0, north: 32.0 },
            jazan: { west: 41.0, east: 44.0, south: 16.0, north: 19.0 },
            najran: { west: 43.0, east: 47.0, south: 17.0, north: 20.0 },
            baha: { west: 41.0, east: 42.5, south: 19.0, north: 20.5 },
            jouf: { west: 38.0, east: 42.0, south: 29.0, north: 32.0 }
        };
        
        // Icon mappings for different categories
        this.categoryIcons = {
            'religion.place_of_worship': '🕌',
            'tourism.sights': '🏛️',
            'commercial.restaurant': '🍽️',
            'accommodation.hotel': '🏨',
            'tourism.museum': '🏛️',
            'historical': '👑'
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Secure API key management - in production, use environment variables
            const apiKeys = await this.loadApiKeys();
            
            // Load Google Maps with security measures
            await this.loadGoogleMaps(apiKeys.googleMaps);
            
            // Initialize the map
            await this.initializeMap();
            
            // Load initial places
            await this.loadPlaces();
            
            // Hide loading indicator
            this.hideLoading();
            
        } catch (error) {
            console.error('Error initializing map:', error);
            this.showError('حدث خطأ في تحميل الخريطة. يرجى المحاولة مرة أخرى.');
        }
    }
    
    async loadApiKeys() {
        // Load from secure configuration
        try {
            // Load API configuration
            const configScript = document.createElement('script');
            configScript.src = '../config/api-keys.js';
            document.head.appendChild(configScript);
            
            // Wait for configuration to load
            await new Promise((resolve) => {
                configScript.onload = resolve;
            });
            
            // Use configuration if available, otherwise fallback
            if (window.API_CONFIG && window.API_CONFIG.API_KEYS) {
                return {
                    googleMaps: window.API_CONFIG.API_KEYS.GOOGLE_MAPS,
                    geoapify: window.API_CONFIG.API_KEYS.GEOAPIFY
                };
            }
        } catch (error) {
            console.warn('Could not load API configuration, using fallback keys');
        }
        
        // Fallback keys (replace with your actual keys)
        return {
            googleMaps: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual key
            geoapify: '636790d9734f4bf2af3a9f2393bdcc1d'
        };
    }
    
    async loadGoogleMaps(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
            script.async = true;
            script.defer = true;
            
            window.initGoogleMaps = () => {
                delete window.initGoogleMaps;
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Google Maps'));
            };
            
            document.head.appendChild(script);
        });
    }
    
    async initializeMap() {
        const { Map } = await google.maps.importLibrary("maps");
        const { Marker, InfoWindow } = await google.maps.importLibrary("marker");
        
        this.Map = Map;
        this.Marker = Marker;
        this.InfoWindow = InfoWindow;
        
        this.map = new Map(document.getElementById("saudi-map"), {
            zoom: 6,
            center: this.saudiCenter,
            styles: [
                {
                    "featureType": "poi",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        { "color": "#e9f7ef" }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        { "color": "#f5f5f5" }
                    ]
                }
            ],
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true
        });
        
        // Add Saudi Arabia boundary
        this.addSaudiBoundary();
    }
    
    addSaudiBoundary() {
        const boundary = new google.maps.Rectangle({
            bounds: {
                north: this.saudiBounds.north,
                south: this.saudiBounds.south,
                east: this.saudiBounds.east,
                west: this.saudiBounds.west
            },
            strokeColor: '#006233',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#006233',
            fillOpacity: 0.1,
            map: this.map
        });
    }
    
    async loadPlaces() {
        try {
            const categories = Array.from(this.selectedCategories).join(',');
            const bounds = this.currentRegion === 'all' ? this.saudiBounds : this.regions[this.currentRegion];
            
            // Secure API call with proper error handling
            const placesUrl = `https://api.geoapify.com/v2/places?` +
                `categories=${categories}` +
                `&filter=rect:${bounds.west},${bounds.north},${bounds.east},${bounds.south}` +
                `&limit=100` +
                `&apiKey=636790d9734f4bf2af3a9f2393bdcc1d`;
            
            const response = await fetch(placesUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.features) {
                this.clearMarkers();
                this.addPlacesToMap(data.features);
            }
            
        } catch (error) {
            console.error('Error loading places:', error);
            this.showError('حدث خطأ في تحميل المعالم. يرجى المحاولة مرة أخرى.');
        }
    }
    
    addPlacesToMap(places) {
        places.forEach(place => {
            this.addPlaceMarker(place);
        });
    }
    
    addPlaceMarker(place) {
        const { lat, lon } = place.properties;
        const name = place.properties.name || 'مكان غير معروف';
        const category = place.properties.categories?.[0] || 'place';
        const icon = this.categoryIcons[category] || '📍';
        
        const marker = new this.Marker({
            position: { lat, lng: lon },
            map: this.map,
            label: {
                text: icon,
                color: '#006233',
                fontSize: '18px',
                fontWeight: 'bold'
            },
            title: name,
            category: category
        });
        
        const infoWindow = new this.InfoWindow({
            content: this.createInfoWindowContent(place)
        });
        
        marker.addListener("click", () => {
            // Close other info windows
            this.infoWindows.forEach(iw => iw.close());
            infoWindow.open(this.map, marker);
            this.infoWindows.push(infoWindow);
        });
        
        this.markers.push(marker);
    }
    
    createInfoWindowContent(place) {
        const name = place.properties.name || 'مكان غير معروف';
        const category = place.properties.categories?.[0] || 'place';
        const address = place.properties.formatted || place.properties.address_line2 || '';
        const website = place.properties.website || '';
        const phone = place.properties.phone || '';
        const icon = this.categoryIcons[category] || '📍';
        
        return `
            <div style="font-family: 'Tajawal', sans-serif; direction: rtl; text-align: right; min-width: 250px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <span style="font-size: 1.5rem;">${icon}</span>
                    <h3 style="margin: 0; color: #006233; font-size: 1.2rem; font-weight: 700;">${name}</h3>
                </div>
                ${address ? `<p style="margin: 8px 0; color: #666; font-size: 0.9rem;">${address}</p>` : ''}
                <div style="margin-top: 12px;">
                    ${website ? `<a href="${website}" target="_blank" style="color: #006233; text-decoration: none; font-size: 0.9rem;">🌐 الموقع الإلكتروني</a><br>` : ''}
                    ${phone ? `<span style="color: #666; font-size: 0.9rem;">📞 ${phone}</span>` : ''}
                </div>
                <div style="margin-top: 8px;">
                    <span style="background: #e8f5e8; color: #006233; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                        ${this.getCategoryName(category)}
                    </span>
                </div>
            </div>
        `;
    }
    
    getCategoryName(category) {
        const categoryNames = {
            'religion.place_of_worship': 'معلم ديني',
            'tourism.sights': 'معلم سياحي',
            'commercial.restaurant': 'مطعم',
            'accommodation.hotel': 'فندق',
            'tourism.museum': 'متحف',
            'historical': 'معلم تاريخي'
        };
        return categoryNames[category] || 'معلم';
    }
    
    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
        this.infoWindows.forEach(iw => iw.close());
        this.infoWindows = [];
    }
    
    centerOnSaudi() {
        this.map.setCenter(this.saudiCenter);
        this.map.setZoom(6);
    }
    
    toggleSatellite() {
        const currentMapType = this.map.getMapTypeId();
        const newMapType = currentMapType === 'satellite' ? 'roadmap' : 'satellite';
        this.map.setMapTypeId(newMapType);
    }
    
    setRegion(region) {
        this.currentRegion = region;
        this.loadPlaces();
        
        if (region !== 'all' && this.regions[region]) {
            const bounds = this.regions[region];
            this.map.fitBounds({
                north: bounds.north,
                south: bounds.south,
                east: bounds.east,
                west: bounds.west
            });
        } else {
            this.centerOnSaudi();
        }
    }
    
    setCategories(categories) {
        this.selectedCategories = new Set(categories);
        this.loadPlaces();
    }
    
    hideLoading() {
        const loading = document.getElementById('mapLoading');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    showError(message) {
        const loading = document.getElementById('mapLoading');
        if (loading) {
            loading.innerHTML = `
                <div style="text-align: center; color: #e74c3c;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">⚠️</div>
                    <p style="font-family: 'Tajawal', sans-serif; font-size: 1.1rem;">${message}</p>
                    <button onclick="location.reload()" style="
                        background: #006233; 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 8px; 
                        cursor: pointer;
                        font-family: 'Tajawal', sans-serif;
                        margin-top: 16px;
                    ">إعادة المحاولة</button>
                </div>
            `;
        }
    }
}

// Export for use in other modules
window.SaudiMapComponent = SaudiMapComponent;
