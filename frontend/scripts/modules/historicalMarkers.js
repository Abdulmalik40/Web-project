/**
 * Historical Markers Component for Saudi Tourism Map
 * Adds custom markers for historical sites mentioned in the history page
 */

class HistoricalMarkers {
    constructor(mapComponent) {
        this.mapComponent = mapComponent;
        this.historicalMarkers = [];
        this.historicalSites = [];
        
        this.init();
    }
    
    init() {
        this.loadHistoricalSites();
        this.addHistoricalMarkers();
    }
    
    loadHistoricalSites() {
        // Historical sites data based on the history page content
        this.historicalSites = [
            {
                id: 'diriyah',
                name: 'الدرعية',
                nameEn: 'Diriyah',
                coordinates: { lat: 24.7314, lng: 46.5706 },
                period: 'الدولة السعودية الأولى',
                periodEn: 'First Saudi State',
                description: 'عاصمة الدولة السعودية الأولى (1139-1233هـ / 1727-1818م)',
                descriptionEn: 'Capital of the First Saudi State (1727-1818)',
                significance: 'تأسست الدولة السعودية الأولى على يد الإمام محمد بن سعود و عاصمتها الدرعية في قلب الجزيرة العربية',
                significanceEn: 'The First Saudi State was established by Imam Mohammed bin Saud with Diriyah as its capital in the heart of the Arabian Peninsula',
                type: 'historical',
                icon: '👑',
                color: '#8B4513'
            },
            {
                id: 'riyadh',
                name: 'الرياض',
                nameEn: 'Riyadh',
                coordinates: { lat: 24.7136, lng: 46.6753 },
                period: 'الدولة السعودية الثانية',
                periodEn: 'Second Saudi State',
                description: 'عاصمة الدولة السعودية الثانية (1240-1309هـ / 1824-1891م)',
                descriptionEn: 'Capital of the Second Saudi State (1824-1891)',
                significance: 'أسس الإمام تركي بن عبد الله الدولة السعودية الثانية و عاصمتها الرياض',
                significanceEn: 'Imam Turki bin Abdullah established the Second Saudi State with Riyadh as its capital',
                type: 'historical',
                icon: '🏛️',
                color: '#8B4513'
            },
            {
                id: 'makkah',
                name: 'مكة المكرمة',
                nameEn: 'Makkah Al-Mukarramah',
                coordinates: { lat: 21.3891, lng: 39.8579 },
                period: 'جميع العصور',
                periodEn: 'All Periods',
                description: 'أقدس الأماكن في الإسلام ومركز الحج والعمرة',
                descriptionEn: 'The holiest place in Islam and center of Hajj and Umrah',
                significance: 'مدينة مقدسة منذ فجر الإسلام، وتضم الكعبة المشرفة والمسجد الحرام',
                significanceEn: 'Sacred city since the dawn of Islam, home to the Kaaba and the Grand Mosque',
                type: 'religious',
                icon: '🕌',
                color: '#006233'
            },
            {
                id: 'madinah',
                name: 'المدينة المنورة',
                nameEn: 'Madinah Al-Munawwarah',
                coordinates: { lat: 24.5247, lng: 39.5692 },
                period: 'جميع العصور',
                periodEn: 'All Periods',
                description: 'مدينة النبي صلى الله عليه وسلم والمسجد النبوي الشريف',
                descriptionEn: 'The city of the Prophet (PBUH) and the Prophet\'s Mosque',
                significance: 'هجرة النبي صلى الله عليه وسلم إليها وبداية الدولة الإسلامية',
                significanceEn: 'The Prophet\'s (PBUH) migration to it and the beginning of the Islamic state',
                type: 'religious',
                icon: '🕌',
                color: '#006233'
            },
            {
                id: 'masmak',
                name: 'قصر المصمك',
                nameEn: 'Masmak Fortress',
                coordinates: { lat: 24.6389, lng: 46.7131 },
                period: 'المملكة الحديثة',
                periodEn: 'Modern Kingdom',
                description: 'حصن تاريخي في الرياض، رمز توحيد المملكة',
                descriptionEn: 'Historical fortress in Riyadh, symbol of the Kingdom\'s unification',
                significance: 'استرد الملك عبدالعزيز الرياض من هذا الموقع عام 1319هـ (1902م)',
                significanceEn: 'King Abdulaziz recaptured Riyadh from this site in 1902',
                type: 'historical',
                icon: '🏰',
                color: '#8B4513'
            },
            {
                id: 'at_turaif',
                name: 'حي الطريف',
                nameEn: 'At-Turaif District',
                coordinates: { lat: 24.7314, lng: 46.5706 },
                period: 'الدولة السعودية الأولى',
                periodEn: 'First Saudi State',
                description: 'حي تاريخي في الدرعية، موقع تراث عالمي',
                descriptionEn: 'Historical district in Diriyah, UNESCO World Heritage site',
                significance: 'مركز الحكم في الدولة السعودية الأولى ومقر الأئمة',
                significanceEn: 'Center of government in the First Saudi State and residence of the Imams',
                type: 'historical',
                icon: '🏛️',
                color: '#8B4513'
            },
            {
                id: 'jeddah',
                name: 'جدة',
                nameEn: 'Jeddah',
                coordinates: { lat: 21.4858, lng: 39.1925 },
                period: 'جميع العصور',
                periodEn: 'All Periods',
                description: 'بوابة الحرمين وميناء الحجاج',
                descriptionEn: 'Gateway to the Two Holy Mosques and pilgrims\' port',
                significance: 'مدينة تاريخية مهمة على البحر الأحمر وميناء رئيسي للحج',
                significanceEn: 'Important historical city on the Red Sea and major port for Hajj',
                type: 'historical',
                icon: '⚓',
                color: '#0066CC'
            },
            {
                id: 'hail',
                name: 'حائل',
                nameEn: 'Hail',
                coordinates: { lat: 27.5114, lng: 41.6900 },
                period: 'الدولة السعودية الثانية',
                periodEn: 'Second Saudi State',
                description: 'منطقة تاريخية في شمال المملكة',
                descriptionEn: 'Historical region in the north of the Kingdom',
                significance: 'مركز مهم في الدولة السعودية الثانية',
                significanceEn: 'Important center in the Second Saudi State',
                type: 'historical',
                icon: '🏜️',
                color: '#8B4513'
            },
            {
                id: 'unification_spot',
                name: 'موقع إعلان التوحيد',
                nameEn: 'Unification Declaration Site',
                coordinates: { lat: 24.7136, lng: 46.6753 },
                period: 'المملكة الحديثة',
                periodEn: 'Modern Kingdom',
                description: 'إعلان توحيد المملكة العربية السعودية عام 1351هـ (1932م)',
                descriptionEn: 'Declaration of the unification of the Kingdom of Saudi Arabia in 1932',
                significance: 'صدر الأمر الملكي للإعلان عن توحيد البلاد وتسميتها باسم "المملكة العربية السعودية"',
                significanceEn: 'Royal decree issued to declare the unification of the country and name it "Kingdom of Saudi Arabia"',
                type: 'historical',
                icon: '👑',
                color: '#8B4513'
            }
        ];
    }
    
    addHistoricalMarkers() {
        this.historicalSites.forEach(site => {
            this.addHistoricalMarker(site);
        });
    }
    
    addHistoricalMarker(site) {
        const marker = new google.maps.Marker({
            position: site.coordinates,
            map: this.mapComponent.map,
            label: {
                text: site.icon,
                color: site.color,
                fontSize: '20px',
                fontWeight: 'bold'
            },
            title: `${site.name} - ${site.period}`,
            siteData: site
        });
        
        // Create custom info window content
        const infoWindow = new google.maps.InfoWindow({
            content: this.createHistoricalInfoWindow(site)
        });
        
        marker.addListener("click", () => {
            // Close other info windows
            this.historicalMarkers.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
            });
            
            infoWindow.open(this.mapComponent.map, marker);
            marker.infoWindow = infoWindow;
        });
        
        // Store marker reference
        this.historicalMarkers.push({
            marker: marker,
            infoWindow: infoWindow,
            site: site
        });
    }
    
    createHistoricalInfoWindow(site) {
        return `
            <div style="font-family: 'Tajawal', sans-serif; direction: rtl; text-align: right; min-width: 300px; max-width: 400px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 2px solid #e8f5e8; padding-bottom: 12px;">
                    <span style="font-size: 2rem;">${site.icon}</span>
                    <div>
                        <h3 style="margin: 0; color: #006233; font-size: 1.3rem; font-weight: 700;">${site.name}</h3>
                        <h4 style="margin: 4px 0 0 0; color: #666; font-size: 1rem; font-weight: 500;">${site.period}</h4>
                    </div>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <h4 style="margin: 0 0 8px 0; color: #006233; font-size: 1rem; font-weight: 600;">الوصف:</h4>
                    <p style="margin: 0; color: #333; font-size: 0.95rem; line-height: 1.5;">${site.description}</p>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <h4 style="margin: 0 0 8px 0; color: #006233; font-size: 1rem; font-weight: 600;">الأهمية التاريخية:</h4>
                    <p style="margin: 0; color: #333; font-size: 0.9rem; line-height: 1.5;">${site.significance}</p>
                </div>
                
                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e8f5e8;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="background: #e8f5e8; color: #006233; padding: 6px 12px; border-radius: 16px; font-size: 0.8rem; font-weight: 600;">
                            ${this.getTypeName(site.type)}
                        </span>
                        <button onclick="window.historicalMarkers.showDetailedInfo('${site.id}')" style="
                            background: #006233; 
                            color: white; 
                            border: none; 
                            padding: 8px 16px; 
                            border-radius: 8px; 
                            cursor: pointer;
                            font-family: 'Tajawal', sans-serif;
                            font-size: 0.85rem;
                            font-weight: 500;
                        ">المزيد من التفاصيل</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getTypeName(type) {
        const typeNames = {
            'historical': 'معلم تاريخي',
            'religious': 'معلم ديني',
            'cultural': 'معلم ثقافي'
        };
        return typeNames[type] || 'معلم';
    }
    
    showDetailedInfo(siteId) {
        const site = this.historicalSites.find(s => s.id === siteId);
        if (!site) return;
        
        // Create detailed modal content
        const modalContent = `
            <div style="font-family: 'Tajawal', sans-serif; direction: rtl; text-align: right;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <span style="font-size: 3rem;">${site.icon}</span>
                    <div>
                        <h2 style="margin: 0; color: #006233; font-size: 1.8rem; font-weight: 700;">${site.name}</h2>
                        <h3 style="margin: 8px 0 0 0; color: #666; font-size: 1.2rem; font-weight: 500;">${site.period}</h3>
                        <p style="margin: 4px 0 0 0; color: #999; font-size: 1rem;">${site.nameEn}</p>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0; color: #006233; font-size: 1.1rem; font-weight: 600;">الوصف التفصيلي:</h4>
                    <p style="margin: 0; color: #333; font-size: 1rem; line-height: 1.6;">${site.description}</p>
                </div>
                
                <div style="background: #fff3cd; padding: 16px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                    <h4 style="margin: 0 0 12px 0; color: #856404; font-size: 1.1rem; font-weight: 600;">الأهمية التاريخية:</h4>
                    <p style="margin: 0; color: #856404; font-size: 1rem; line-height: 1.6;">${site.significance}</p>
                </div>
                
                <div style="background: #e8f5e8; padding: 16px; border-radius: 12px;">
                    <h4 style="margin: 0 0 12px 0; color: #006233; font-size: 1.1rem; font-weight: 600;">معلومات الموقع:</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <strong>الإحداثيات:</strong><br>
                            <span style="font-size: 0.9rem; color: #666;">
                                ${site.coordinates.lat.toFixed(6)}, ${site.coordinates.lng.toFixed(6)}
                            </span>
                        </div>
                        <div>
                            <strong>النوع:</strong><br>
                            <span style="font-size: 0.9rem; color: #666;">${this.getTypeName(site.type)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show in modal
        this.showModal(modalContent, site.name);
    }
    
    showModal(content, title) {
        const modal = document.getElementById('infoModal');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = content;
        modal.classList.add('show');
        
        // Close modal when clicking outside or on close button
        const closeModal = document.getElementById('closeModal');
        closeModal.onclick = () => modal.classList.remove('show');
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        };
    }
    
    // Method to filter historical markers by period
    filterByPeriod(period) {
        this.historicalMarkers.forEach(item => {
            const isVisible = period === 'all' || item.site.period === period;
            item.marker.setVisible(isVisible);
        });
    }
    
    // Method to highlight specific historical site
    highlightSite(siteId) {
        const item = this.historicalMarkers.find(item => item.site.id === siteId);
        if (item) {
            // Center map on the site
            this.mapComponent.map.setCenter(item.site.coordinates);
            this.mapComponent.map.setZoom(15);
            
            // Open info window
            item.infoWindow.open(this.mapComponent.map, item.marker);
            
            // Add temporary highlight effect
            item.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => {
                item.marker.setAnimation(null);
            }, 2000);
        }
    }
    
    // Method to get all historical sites data
    getAllSites() {
        return this.historicalSites;
    }
    
    // Method to get sites by period
    getSitesByPeriod(period) {
        return this.historicalSites.filter(site => site.period === period);
    }
    
    // Method to get sites by type
    getSitesByType(type) {
        return this.historicalSites.filter(site => site.type === type);
    }
}

// Export for use in other modules
window.HistoricalMarkers = HistoricalMarkers;
