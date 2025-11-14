// frontend/scripts/modules/qiblaApi.js
class QiblaAPI {
    constructor() {
      this.API_BASE_URL = 'https://api.aladhan.com/v1/qibla';
      this.init();
    }
  
    init() {
      if (document.querySelector('.qibla-container')) {
        this.setupEventListeners();
      }
    }
  
    setupEventListeners() {
      const useLocationBtn = document.getElementById('useLocationBtn');
      const manualBtn = document.getElementById('manualBtn');
  
      if (useLocationBtn) {
        useLocationBtn.addEventListener('click', () => this.useCurrentLocation());
      }
      if (manualBtn) {
        manualBtn.addEventListener('click', () => this.handleManualSubmit());
      }
    }
  
    showError(message) {
      const errorContainer = document.getElementById('errorContainer');
      if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        setTimeout(() => {
          errorContainer.style.display = 'none';
        }, 5000);
      }
    }
  
    updateCompass(direction) {
      const compassNeedle = document.getElementById('compassNeedle');
      const directionText = document.getElementById('directionText');
      
      if (compassNeedle) {
        compassNeedle.style.transform = `translate(-50%, -100%) rotate(${direction}deg)`;
      }
      
      if (directionText) {
        let cardinal = '';
        const deg = direction % 360;
        if (deg >= 337.5 || deg < 22.5) cardinal = 'North';
        else if (deg >= 22.5 && deg < 67.5) cardinal = 'Northeast';
        else if (deg >= 67.5 && deg < 112.5) cardinal = 'East';
        else if (deg >= 112.5 && deg < 157.5) cardinal = 'Southeast';
        else if (deg >= 157.5 && deg < 202.5) cardinal = 'South';
        else if (deg >= 202.5 && deg < 247.5) cardinal = 'Southwest';
        else if (deg >= 247.5 && deg < 292.5) cardinal = 'West';
        else if (deg >= 292.5 && deg < 337.5) cardinal = 'Northwest';
        
        directionText.textContent = `${direction.toFixed(2)}° (${cardinal})`;
      }
    }
  
    async fetchQiblaDirection(lat, lng) {
      const url = `${this.API_BASE_URL}/${lat}/${lng}`;
      const loading = document.getElementById('loading');
      const errorContainer = document.getElementById('errorContainer');
      const resultSection = document.getElementById('resultSection');
      const coordinatesText = document.getElementById('resultCoords');
      
      try {
        if (loading) loading.style.display = 'block';
        if (errorContainer) errorContainer.style.display = 'none';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.code !== 200) {
          throw new Error(data.data?.message || 'Failed to get Qibla direction');
        }
        
        const { direction, latitude, longitude } = data.data;
        if (coordinatesText) {
          coordinatesText.textContent = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
        }
        this.updateCompass(direction);
        if (resultSection) resultSection.style.display = 'block';
        
      } catch (error) {
        console.error('Error fetching Qibla direction:', error);
        this.showError('Failed to calculate Qibla direction. Please check coordinates and try again.');
      } finally {
        if (loading) loading.style.display = 'none';
      }
    }
  
    handleManualSubmit() {
      const latitudeInput = document.getElementById('latitudeInput');
      const longitudeInput = document.getElementById('longitudeInput');
      
      const lat = parseFloat(latitudeInput?.value);
      const lng = parseFloat(longitudeInput?.value);
      
      if (isNaN(lat) || isNaN(lng)) {
        this.showError('Please enter valid latitude and longitude coordinates.');
        return;
      }
      
      if (lat < -90 || lat > 90) {
        this.showError('Latitude must be between -90 and 90.');
        return;
      }
      
      if (lng < -180 || lng > 180) {
        this.showError('Longitude must be between -180 and 180.');
        return;
      }
      
      this.fetchQiblaDirection(lat, lng);
    }
  
    handleLocationSuccess(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const latitudeInput = document.getElementById('latitudeInput');
      const longitudeInput = document.getElementById('longitudeInput');
      
      if (latitudeInput) latitudeInput.value = lat;
      if (longitudeInput) longitudeInput.value = lng;
      this.fetchQiblaDirection(lat, lng);
    }
  
    handleLocationError(error) {
      console.error('Geolocation error:', error);
      let message = 'Unable to get your location.';
      if (error.code === 1) {
        message = 'Please allow location access to use this feature.';
      } else if (error.code === 2) {
        message = 'Location information is unavailable.';
      } else if (error.code === 3) {
        message = 'The request to get your location timed out.';
      }
      this.showError(message);
      const loading = document.getElementById('loading');
      if (loading) loading.style.display = 'none';
    }
  
    useCurrentLocation() {
      if (!navigator.geolocation) {
        this.showError('Geolocation is not supported by your browser.');
        return;
      }
      
      const loading = document.getElementById('loading');
      if (loading) loading.style.display = 'block';
      
      navigator.geolocation.getCurrentPosition(
        (position) => this.handleLocationSuccess(position),
        (error) => this.handleLocationError(error),
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );
    }
  }
  
  // Initialize Qibla API
  document.addEventListener('DOMContentLoaded', () => {
    new QiblaAPI();
  });