// translations.js - For multi-language support

const translations = {
    en: {
        // Navigation
        "nav-home": "Home",
        "nav-about": "About",
        "nav-experience": "Experience",
        "nav-projects": "Projects",
        "nav-contact": "Contact",
        
        // Hero
        "hero-title": "Automation Engineer | IT Support Specialist | .NET Developer",
        
        // About
        "about-title": "About Me",
        
        // Experience
        "experience-title": "Work Experience",
        
        // Projects
        "projects-title": "Featured Projects",
        
        // Contact
        "contact-title": "Get In Touch",
        
        // Footer
        "footer-rights": "All rights reserved"
    },
    
    sv: {
        // Navigation
        "nav-home": "Hem",
        "nav-about": "Om",
        "nav-experience": "Erfarenhet",
        "nav-projects": "Projekt",
        "nav-contact": "Kontakt",
        
        // Hero
        "hero-title": "Automationstekniker | IT-supportspecialist | .NET-utvecklare",
        
        // About
        "about-title": "Om Mig",
        
        // Experience
        "experience-title": "Arbetslivserfarenhet",
        
        // Projects
        "projects-title": "Presenterade Projekt",
        
        // Contact
        "contact-title": "Kom i Kontakt",
        
        // Footer
        "footer-rights": "Alla rättigheter förbehållna"
    }
};

// Language management functions
let currentLanguage = localStorage.getItem('language') || 'en';

function updateTextContent(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updateTextContent(lang);
}

function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'sv' : 'en';
    setLanguage(newLang);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateTextContent(currentLanguage);
});

// Export functions
window.translations = translations;
window.setLanguage = setLanguage;
window.toggleLanguage = toggleLanguage;
window.updateTextContent = updateTextContent;