/**
 * Event Card Component - Reusable event card generator
 * Creates event cards with image, title, description, and ticket button
 * 
 * Usage:
 *   const card = createEventCard({
 *     imageName: 'event1.jpg',
 *     title: 'Event Title',
 *     description: 'Event description...',
 *     category: 'History & Culture',
 *     date: 'Sun 08 Jun 2025',
 *     duration: '2-3 hours',
 *     ticketLink: 'https://tickets.example.com/event1'
 *   });
 *   document.getElementById('events-container').appendChild(card);
 */

(function () {
  'use strict';

  /**
   * Get the correct path for event images based on current page location
   * Supports both events and destinations folders
   */
  function getEventImagePath(imageName, imageFolder = 'events') {
    const currentPath = window.location.pathname;
    const pagesIndex = currentPath.indexOf('/pages/');
    const pathAfterPages = pagesIndex >= 0 
      ? currentPath.substring(pagesIndex + '/pages/'.length)
      : currentPath;
    const pathParts = pathAfterPages.split('/').filter(p => p);
    const isInSubfolder = pathParts.length > 1;
    const pathPrefix = isInSubfolder ? '../../' : '../';
    
    return `${pathPrefix}assets/images/${imageFolder}/${imageName}`;
  }

  /**
   * Create an event card element
   * @param {Object} options - Event card options
   * @param {string} options.imageName - Name of the image file in assets/images/destinations/
   * @param {string} options.title - Event title
   * @param {string} options.description - Event description/paragraph
   * @param {string} [options.date] - Event date (e.g., "Sun 08 Jun 2025")
   * @param {string} [options.ticketLink] - URL for ticket booking
   * @returns {HTMLElement} The event card element
   */
  window.createEventCard = function (options) {
    const {
      imageName,
      title,
      description,
      titleKey,
      descriptionKey,
      date = '',
      ticketLink = '#',
      imageFolder = 'events'
    } = options;

    // Validate required parameters
    if (!imageName || (!title && !titleKey) || (!description && !descriptionKey)) {
      console.error('Event card requires: imageName, and (title or titleKey), and (description or descriptionKey)');
      return null;
    }

    const imagePath = getEventImagePath(imageName, imageFolder);
    const card = document.createElement('article');
    card.className = 'event-card';

    // Build title - use i18n if key provided, otherwise use plain text
    const titleHTML = titleKey 
      ? `<h3 class="event-card__title" data-i18n="${titleKey}">${title || ''}</h3>`
      : `<h3 class="event-card__title">${title}</h3>`;

    // Build description - use i18n if key provided, otherwise use plain text
    const descriptionHTML = descriptionKey
      ? `<p class="event-card__description" data-i18n="${descriptionKey}">${description || ''}</p>`
      : `<p class="event-card__description">${description}</p>`;

    card.innerHTML = `
      <div class="event-card__image-wrapper">
        <img 
          src="${imagePath}" 
          alt="${title || ''}"
          loading="lazy"
          class="event-card__image"
        />
      </div>
      <div class="event-card__content">
        ${titleHTML}
        ${date ? `<p class="event-card__meta">${date}</p>` : ''}
        ${descriptionHTML}
        <div class="event-card__actions">
          <a href="${ticketLink}" class="event-card__btn event-card__btn--primary" data-i18n="events.bookTicket">
            Book Your Ticket
          </a>
        </div>
      </div>
    `;

    // Refresh translations after creating the card
    if (window.i18n) {
      setTimeout(() => {
        window.i18n.refresh();
      }, 100);
    }

    return card;
  };

  /**
   * Create multiple event cards and append them to a container
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Array} events - Array of event objects
   */
  window.createEventCards = function (container, events) {
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;

    if (!containerEl) {
      console.error('Event cards container not found');
      return;
    }

    if (!Array.isArray(events)) {
      console.error('Events must be an array');
      return;
    }

    events.forEach(eventData => {
      const card = window.createEventCard(eventData);
      if (card) {
        containerEl.appendChild(card);
      }
    });
  };

  // Auto-initialize if data attribute is present
  document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-event-cards]');
    containers.forEach(container => {
      try {
        const eventsData = JSON.parse(container.getAttribute('data-event-cards'));
        if (Array.isArray(eventsData)) {
          window.createEventCards(container, eventsData);
        }
      } catch (e) {
        console.error('Error parsing event cards data:', e);
      }
    });
  });
})();

