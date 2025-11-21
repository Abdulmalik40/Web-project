/**
 * Internationalization (i18n) Module
 * Handles language switching and translations for English and Arabic
 */

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem("language") || "en";
    this.translations = {};
    this.observers = [];
    this.init();
  }

  async init() {
    await this.loadTranslations();
    this.applyLanguage(this.currentLang);
    this.setupLanguageSwitcher();
    console.log("i18n initialized with language:", this.currentLang);
    console.log("Translations loaded:", Object.keys(this.translations));
  }

  async loadTranslations() {
    try {
      console.log('Loading translations from ../locales/');
      const enUrl = '../locales/en.json'; 
      const arUrl = '../locales/ar.json';

      const [enResponse, arResponse] = await Promise.all([
        fetch(enUrl),
        fetch(arUrl),
      ]);

      if (!enResponse.ok) {
        throw new Error(
          `Failed to load en.json: ${enResponse.status} ${enResponse.statusText}`
        );
      }
      if (!arResponse.ok) {
        throw new Error(
          `Failed to load ar.json: ${arResponse.status} ${arResponse.statusText}`
        );
      }

      const [enTranslations, arTranslations] = await Promise.all([
        enResponse.json(),
        arResponse.json(),
      ]);

      this.translations = {
        en: enTranslations,
        ar: arTranslations,
      };
      console.log("Translations loaded successfully:", {
        en: Object.keys(enTranslations),
        ar: Object.keys(arTranslations),
      });
    } catch (error) {
      console.error("Error loading translations:", error);
      console.error("Error details:", error.message, error.stack);
      // Fallback to empty translations
      this.translations = { en: {}, ar: {} };
    }
  }

  t(key, params = {}) {
    const keys = key.split(".");
    let value = this.translations[this.currentLang];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if translation not found
        value = this.translations.en;
        for (const k2 of keys) {
          value = value?.[k2];
        }
        break;
      }
    }

    // Replace parameters if provided
    if (typeof value === "string" && params) {
      Object.keys(params).forEach((param) => {
        value = value.replace(`{{${param}}}`, params[param]);
      });
    }

    return value || key;
  }

  setLanguage(lang) {
    if (lang !== "en" && lang !== "ar") {
      console.warn(`Unsupported language: ${lang}. Defaulting to 'en'.`);
      lang = "en";
    }

    console.log(`Setting language to: ${lang}`);
    this.currentLang = lang;
    localStorage.setItem("language", lang);
    this.applyLanguage(lang);
    this.notifyObservers();
    console.log("Language changed, translations applied");
  }

  getLanguage() {
    return this.currentLang;
  }

  applyLanguage(lang) {
    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update dir attribute for RTL
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.documentElement.dir = "ltr";
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }

    // Translate all elements with data-i18n attribute
    this.translateElements();
  }

  translateElements() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (translation && translation !== key) {
        // Check if element has data-i18n-attr attribute for custom attributes (priority)
        if (element.hasAttribute("data-i18n-attr")) {
          const attr = element.getAttribute("data-i18n-attr");
          element.setAttribute(attr, translation);
        }
        // Check if element is input/textarea placeholder
        else if (
          element.tagName === "INPUT" ||
          element.tagName === "TEXTAREA"
        ) {
          if (element.hasAttribute("placeholder")) {
            element.placeholder = translation;
          } else {
            element.value = translation;
          }
        }
        // Default: set text content
        else {
          element.textContent = translation;
        }
      }
    });

    // Translate elements with data-i18n-html (for HTML content)
    const htmlElements = document.querySelectorAll("[data-i18n-html]");
    htmlElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-html");
      const translation = this.t(key);
      if (translation && translation !== key) {
        element.innerHTML = translation;
      }
    });
  }

  setupLanguageSwitcher() {
    // Wait for DOM to be ready, then setup the switcher
    const setup = () => {
      const switcher = document.getElementById("language-switcher");
      if (switcher) {
        // Remove any existing listeners by cloning the element
        const newSwitcher = switcher.cloneNode(true);
        switcher.parentNode.replaceChild(newSwitcher, switcher);

        newSwitcher.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const newLang = this.currentLang === "en" ? "ar" : "en";
          console.log("Switching language from", this.currentLang, "to", newLang);
          this.setLanguage(newLang);
        });
        console.log("Language switcher button found and handler attached");
        return true;
      }
      return false;
    };

    // Try immediately
    if (!setup()) {
      // If button doesn't exist yet, wait for DOMContentLoaded
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          setup();
        });
      } else {
        // DOM is ready, but button might load later, retry after a delay
        setTimeout(() => {
          if (!setup()) {
            console.warn("Language switcher button not found after retry");
          }
        }, 500);
      }
    }
  }

  // Observer pattern for components that need to react to language changes
  subscribe(callback) {
    this.observers.push(callback);
  }

  unsubscribe(callback) {
    this.observers = this.observers.filter((obs) => obs !== callback);
  }

  notifyObservers() {
    this.observers.forEach((callback) => callback(this.currentLang));
  }

  // Refresh translations (useful after dynamic content is added)
  refresh() {
    this.translateElements();
  }
}

// Create global instance
const i18n = new I18n();

// Expose to window for header component and other scripts
window.i18n = i18n;

// Export for use in other modules
export default i18n;
