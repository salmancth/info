/**
 * Translations Manager
 * Handles multi-language support for the portfolio website
 */

class TranslationsManager {
    constructor() {
        this.translations = {
            en: this.getEnglishTranslations(),
            sv: this.getSwedishTranslations()
        };
        
        this.currentLanguage = localStorage.getItem('portfolio_language') || 'en';
        this.fallbackLanguage = 'en';
        this.translationElements = new Map();
        
        // Language change observers
        this.observers = [];
    }

    init() {
        console.log('🔧 Initializing Translations Manager...');
        
        this.detectBrowserLanguage();
        this.setupLanguageSwitcher();
        this.scanForTranslations();
        this.applyTranslations();
        
        console.log('✅ Translations Manager Initialized');
        console.log(`🌐 Current language: ${this.currentLanguage.toUpperCase()}`);
    }

    detectBrowserLanguage() {
        // Get browser language
        const browserLang = navigator.language || navigator.userLanguage;
        
        if (browserLang) {
            const langCode = browserLang.split('-')[0].toLowerCase();
            
            // Check if we support this language
            if (this.translations[langCode]) {
                this.currentLanguage = langCode;
                localStorage.setItem('portfolio_language', langCode);
            }
        }
    }

    setupLanguageSwitcher() {
        const languageToggle = document.getElementById('languageToggle');
        const mobileLanguageSelect = document.querySelector('.mobile-language-select');
        
        // Desktop toggle
        if (languageToggle) {
            const toggleText = languageToggle.querySelector('span');
            if (toggleText) {
                toggleText.textContent = this.currentLanguage.toUpperCase();
            }
            
            languageToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
        
        // Mobile select
        if (mobileLanguageSelect) {
            mobileLanguageSelect.value = this.currentLanguage;
            
            mobileLanguageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    scanForTranslations() {
        // Find all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            this.translationElements.set(element, key);
        });
        
        console.log(`📝 Found ${elements.length} translatable elements`);
    }

    applyTranslations() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Apply translations to elements
        this.translationElements.forEach((key, element) => {
            this.translateElement(element, key);
        });
        
        // Update meta tags
        this.updateMetaTags();
        
        // Update language switcher
        this.updateLanguageSwitcher();
        
        // Notify observers
        this.notifyObservers();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    translateElement(element, key) {
        const translation = this.getTranslation(key);
        
        if (translation) {
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder) {
                    element.placeholder = translation;
                }
            } else if (element.tagName === 'IMG') {
                if (element.alt) {
                    element.alt = translation;
                }
            } else {
                // Check if element has HTML content
                const hasHTML = /<[a-z][\s\S]*>/i.test(translation);
                
                if (hasHTML) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        }
    }

    getTranslation(key, language = this.currentLanguage) {
        // Split key by dots to navigate nested objects
        const keys = key.split('.');
        let value = this.translations[language];
        
        // Try to get translation from current language
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                value = null;
                break;
            }
        }
        
        // Fallback to English if translation not found
        if (!value && language !== this.fallbackLanguage) {
            return this.getTranslation(key, this.fallbackLanguage);
        }
        
        return value;
    }

    updateMetaTags() {
        // Update page title if translation exists
        const titleKey = 'meta.title';
        const titleTranslation = this.getTranslation(titleKey);
        
        if (titleTranslation && document.title) {
            // Check if title already contains personal name
            const currentTitle = document.title;
            if (!currentTitle.includes('Salman Yahya')) {
                document.title = titleTranslation;
            }
        }
        
        // Update meta description
        const descriptionKey = 'meta.description';
        const descriptionTranslation = this.getTranslation(descriptionKey);
        
        if (descriptionTranslation) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', descriptionTranslation);
            }
            
            // Update Open Graph description
            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) {
                ogDescription.setAttribute('content', descriptionTranslation);
            }
            
            // Update Twitter description
            const twitterDescription = document.querySelector('meta[property="twitter:description"]');
            if (twitterDescription) {
                twitterDescription.setAttribute('content', descriptionTranslation);
            }
        }
    }

    updateLanguageSwitcher() {
        // Update desktop toggle
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            const toggleText = languageToggle.querySelector('span');
            if (toggleText) {
                toggleText.textContent = this.currentLanguage.toUpperCase();
            }
        }
        
        // Update mobile select
        const mobileLanguageSelect = document.querySelector('.mobile-language-select');
        if (mobileLanguageSelect) {
            mobileLanguageSelect.value = this.currentLanguage;
        }
        
        // Update button text for next language
        const nextLanguage = this.currentLanguage === 'en' ? 'sv' : 'en';
        const switchButtons = document.querySelectorAll('[data-switch-language]');
        switchButtons.forEach(button => {
            button.textContent = this.getTranslation(`languages.${nextLanguage}`);
        });
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'sv' : 'en';
        this.setLanguage(newLanguage);
    }

    setLanguage(language) {
        if (!this.translations[language]) {
            console.warn(`⚠️ Language "${language}" not supported, falling back to "${this.fallbackLanguage}"`);
            language = this.fallbackLanguage;
        }
        
        if (language === this.currentLanguage) return;
        
        this.currentLanguage = language;
        localStorage.setItem('portfolio_language', language);
        
        // Apply translations
        this.applyTranslations();
        
        // Show notification
        this.showLanguageNotification();
        
        // Track analytics
        if (window.portfolioApp && window.portfolioApp.components.analytics) {
            window.portfolioApp.components.analytics.trackEvent('language', 'change', language);
        }
    }

    showLanguageNotification() {
        const message = this.getTranslation('languageChanged');
        
        if (window.portfolioApp) {
            window.portfolioApp.showNotification(message, 'success', 3000);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = 'language-notification';
            notification.innerHTML = `
                <i class="fas fa-language"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    // Observer pattern for language changes
    addObserver(callback) {
        this.observers.push(callback);
    }

    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers() {
        this.observers.forEach(callback => {
            callback(this.currentLanguage);
        });
    }

    // Translation data
    getEnglishTranslations() {
        return {
            // Navigation
            nav: {
                home: "Home",
                about: "About",
                experience: "Experience",
                education: "Education",
                skills: "Skills",
                projects: "Projects",
                gallery: "Gallery",
                certificates: "Certificates",
                contact: "Contact"
            },
            
            // Hero section
            hero: {
                title: "Automation Engineer | IT Support Specialist | .NET Developer",
                subtitle: "Hello, I'm",
                description: "Building innovative solutions through technology and automation",
                ctaProjects: "View Projects",
                ctaContact: "Contact Me"
            },
            
            // About section
            about: {
                title: "About Me",
                subtitle: "Get to know me better",
                bio: "I'm a detail-oriented engineer with strong passion for programming, automation, and troubleshooting. I thrive in challenging environments where I can apply my expertise to create innovative solutions.",
                location: "Location",
                email: "Email",
                status: "Status",
                statusText: "Open to Opportunities",
                readFullBio: "Read Full Bio"
            },
            
            // Experience section
            experience: {
                title: "Experience",
                subtitle: "My professional journey",
                present: "Present"
            },
            
            // Education section
            education: {
                title: "Education",
                subtitle: "My academic background"
            },
            
            // Skills section
            skills: {
                title: "Skills",
                subtitle: "Technical competencies",
                programming: "Programming Languages",
                tools: "Tools & Technologies",
                languages: "Languages",
                softSkills: "Soft Skills"
            },
            
            // Projects section
            projects: {
                title: "Projects",
                subtitle: "My recent work",
                viewDetails: "View Details",
                viewAll: "View All Projects",
                liveDemo: "Live Demo",
                sourceCode: "Source Code"
            },
            
            // Gallery section
            gallery: {
                title: "Gallery",
                subtitle: "Visual portfolio",
                searchPlaceholder: "Search images...",
                noResults: "No images found",
                clearSearch: "Clear Search"
            },
            
            // Certificates section
            certificates: {
                title: "Certificates",
                subtitle: "Professional certifications",
                viewCredential: "View Credential"
            },
            
            // Contact section
            contact: {
                title: "Contact",
                subtitle: "Get in touch",
                name: "Name",
                email: "Email",
                subject: "Subject",
                message: "Message",
                sendMessage: "Send Message",
                sending: "Sending...",
                success: "Message sent successfully!",
                error: "Failed to send message. Please try again."
            },
            
            // Footer
            footer: {
                tagline: "Building innovative solutions through technology",
                quickLinks: "Quick Links",
                resources: "Resources",
                contactInfo: "Contact Info",
                sendMessage: "Send Message",
                backToTop: "Back to Top",
                copyright: "All rights reserved",
                privacy: "Privacy Policy",
                terms: "Terms of Use"
            },
            
            // Form validation
            form: {
                required: "This field is required",
                emailInvalid: "Please enter a valid email address",
                phoneInvalid: "Please enter a valid phone number",
                minLength: "Must be at least {length} characters",
                maxLength: "Must be no more than {length} characters"
            },
            
            // Notifications
            notifications: {
                languageChanged: "Language changed successfully",
                resumeDownloaded: "Resume downloaded successfully",
                newsletterSubscribed: "Thank you for subscribing!",
                formSubmitted: "Form submitted successfully!"
            },
            
            // Languages
            languages: {
                en: "English",
                sv: "Svenska"
            },
            
            // Meta tags
            meta: {
                title: "Salman Yahya - Professional Portfolio",
                description: "Professional portfolio showcasing skills in automation, embedded systems, and software development."
            }
        };
    }

    getSwedishTranslations() {
        return {
            // Navigation
            nav: {
                home: "Hem",
                about: "Om mig",
                experience: "Erfarenhet",
                education: "Utbildning",
                skills: "Kompetenser",
                projects: "Projekt",
                gallery: "Galleri",
                certificates: "Certifikat",
                contact: "Kontakt"
            },
            
            // Hero section
            hero: {
                title: "Automationsingenjör | IT-supportspecialist | .NET-utvecklare",
                subtitle: "Hej, jag är",
                description: "Bygger innovativa lösningar genom teknik och automation",
                ctaProjects: "Visa Projekt",
                ctaContact: "Kontakta Mig"
            },
            
            // About section
            about: {
                title: "Om Mig",
                subtitle: "Lär känna mig bättre",
                bio: "Jag är en detaljorienterad ingenjör med stark passion för programmering, automation och felsökning. Jag trivs i utmanande miljöer där jag kan tillämpa min expertis för att skapa innovativa lösningar.",
                location: "Plats",
                email: "E-post",
                status: "Status",
                statusText: "Öppen för Möjligheter",
                readFullBio: "Läs Fullständig Bio"
            },
            
            // Experience section
            experience: {
                title: "Erfarenhet",
                subtitle: "Min professionella resa",
                present: "Nuvarande"
            },
            
            // Education section
            education: {
                title: "Utbildning",
                subtitle: "Min akademiska bakgrund"
            },
            
            // Skills section
            skills: {
                title: "Kompetenser",
                subtitle: "Tekniska färdigheter",
                programming: "Programmeringsspråk",
                tools: "Verktyg & Teknologier",
                languages: "Språk",
                softSkills: "Mjuka färdigheter"
            },
            
            // Projects section
            projects: {
                title: "Projekt",
                subtitle: "Mitt senaste arbete",
                viewDetails: "Visa Detaljer",
                viewAll: "Visa Alla Projekt",
                liveDemo: "Live Demo",
                sourceCode: "Källkod"
            },
            
            // Gallery section
            gallery: {
                title: "Galleri",
                subtitle: "Visuellt portfolio",
                searchPlaceholder: "Sök bilder...",
                noResults: "Inga bilder hittades",
                clearSearch: "Rensa Sökning"
            },
            
            // Certificates section
            certificates: {
                title: "Certifikat",
                subtitle: "Professionella certifieringar",
                viewCredential: "Visa Bevis"
            },
            
            // Contact section
            contact: {
                title: "Kontakt",
                subtitle: "Kom i kontakt",
                name: "Namn",
                email: "E-post",
                subject: "Ämne",
                message: "Meddelande",
                sendMessage: "Skicka Meddelande",
                sending: "Skickar...",
                success: "Meddelandet skickades framgångsrikt!",
                error: "Misslyckades att skicka meddelande. Försök igen."
            },
            
            // Footer
            footer: {
                tagline: "Bygger innovativa lösningar genom teknik",
                quickLinks: "Snabblänkar",
                resources: "Resurser",
                contactInfo: "Kontaktinformation",
                sendMessage: "Skicka Meddelande",
                backToTop: "Tillbaka till Toppen",
                copyright: "Alla rättigheter förbehållna",
                privacy: "Integritetspolicy",
                terms: "Användarvillkor"
            },
            
            // Form validation
            form: {
                required: "Detta fält är obligatoriskt",
                emailInvalid: "Ange en giltig e-postadress",
                phoneInvalid: "Ange ett giltigt telefonnummer",
                minLength: "Måste vara minst {length} tecken",
                maxLength: "Får inte vara mer än {length} tecken"
            },
            
            // Notifications
            notifications: {
                languageChanged: "Språk ändrat framgångsrikt",
                resumeDownloaded: "CV nedladdat framgångsrikt",
                newsletterSubscribed: "Tack för att du prenumererar!",
                formSubmitted: "Formulär skickat framgångsrikt!"
            },
            
            // Languages
            languages: {
                en: "English",
                sv: "Svenska"
            },
            
            // Meta tags
            meta: {
                title: "Salman Yahya - Professionellt Portfolio",
                description: "Professionellt portfolio som visar färdigheter inom automation, inbyggda system och programvaruutveckling."
            }
        };
    }

    // Utility methods
    formatTranslation(text, params = {}) {
        let formattedText = text;
        
        // Replace parameters {key} with values
        Object.keys(params).forEach(key => {
            const placeholder = `{${key}}`;
            formattedText = formattedText.replace(placeholder, params[key]);
        });
        
        return formattedText;
    }

    getAvailableLanguages() {
        return Object.keys(this.translations).map(code => ({
            code,
            name: this.getTranslation(`languages.${code}`, code) || code.toUpperCase()
        }));
    }

    // For dynamic content that needs translation after page load
    translateDynamicContent(key, element) {
        const translation = this.getTranslation(key);
        
        if (translation && element) {
            element.textContent = translation;
            this.translationElements.set(element, key);
        }
    }

    // Add new translation at runtime
    addTranslation(key, translations) {
        Object.keys(translations).forEach(lang => {
            if (!this.translations[lang]) {
                this.translations[lang] = {};
            }
            
            // Split key by dots and create nested structure
            const keys = key.split('.');
            let current = this.translations[lang];
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = translations[lang];
        });
        
        // Re-apply translations if needed
        if (this.translationElements.size > 0) {
            this.applyTranslations();
        }
    }

    destroy() {
        // Clean up observers
        this.observers = [];
        
        // Clear translation elements map
        this.translationElements.clear();
        
        console.log('🧹 Translations Manager Cleaned Up');
    }
}

// Initialize translations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize translations manager
    window.translationsManager = new TranslationsManager();
    window.translationsManager.init();
    
    // Make it globally available
    window.translate = function(key, params) {
        if (window.translationsManager) {
            const translation = window.translationsManager.getTranslation(key);
            if (translation && params) {
                return window.translationsManager.formatTranslation(translation, params);
            }
            return translation;
        }
        return key;
    };
    
    console.log('🌐 Translation helper available as window.translate(key, params)');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TranslationsManager;
}