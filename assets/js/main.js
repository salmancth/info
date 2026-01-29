// main.js - Fixed version
// Component Inclusion
function includeComponents() {
    const includes = document.querySelectorAll('[data-include]');
    
    includes.forEach(async (element) => {
        const file = element.getAttribute('data-include');
        
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            element.innerHTML = html;
            
            // Re-initialize scripts for included components
            initComponents();
        } catch (error) {
            console.error(`Error loading component: ${file}`, error);
            // Create fallback content for critical components
            if (file.includes('header')) {
                element.innerHTML = createFallbackHeader();
            } else if (file.includes('footer')) {
                element.innerHTML = createFallbackFooter();
            } else if (file.includes('meta')) {
                element.innerHTML = createFallbackMeta();
            }
        }
    });
}

// Fallback components
function createFallbackHeader() {
    return `
        <header class="header fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
            <nav class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <a href="index.html" class="flex items-center text-blue-600 dark:text-blue-400">
                        <span class="text-2xl font-bold">SY</span>
                        <span class="text-xl font-semibold ml-2">Portfolio</span>
                    </a>
                    <button id="mobile-menu-button" class="md:hidden text-gray-800 dark:text-gray-200">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </nav>
        </header>
    `;
}

function createFallbackFooter() {
    const year = new Date().getFullYear();
    return `
        <footer class="bg-gray-900 text-gray-300 py-12">
            <div class="container mx-auto px-4 text-center">
                <p>&copy; ${year} Salman Yahya. All rights reserved.</p>
                <p class="text-sm text-gray-400 mt-2">Gothenburg, Sweden</p>
            </div>
        </footer>
    `;
}

function createFallbackMeta() {
    return `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Salman Yahya - Automation Engineer | IT Support Specialist | .NET Developer">
        <link rel="icon" href="assets/img/favicon.ico">
    `;
}

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get current theme
    let currentTheme = localStorage.getItem('theme') || 
                      (prefersDark.matches ? 'dark' : 'light');
    
    // Apply theme
    applyTheme(currentTheme);
    
    // Theme toggle function
    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    }
    
    // Apply theme to document
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Update toggle buttons
        [themeToggle, mobileThemeToggle].forEach(toggle => {
            if (toggle) toggle.classList.toggle('active', theme === 'dark');
        });
    }
    
    // Add event listeners
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
}

// Language Management - Simplified
function initLanguage() {
    const langToggle = document.getElementById('language-toggle');
    const mobileLangToggle = document.getElementById('mobile-language-toggle');
    
    // Load translations if available
    if (typeof translations !== 'undefined') {
        let currentLang = localStorage.getItem('language') || 'en';
        
        function updateLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('language', lang);
            if (window.updateTextContent) {
                window.updateTextContent(lang);
            }
            
            // Update toggle buttons
            [langToggle, mobileLangToggle].forEach(toggle => {
                if (toggle) toggle.classList.toggle('active', lang === 'sv');
            });
        }
        
        function toggleLanguage() {
            const newLang = currentLang === 'en' ? 'sv' : 'en';
            updateLanguage(newLang);
        }
        
        // Add event listeners
        if (langToggle) langToggle.addEventListener('click', toggleLanguage);
        if (mobileLangToggle) mobileLangToggle.addEventListener('click', toggleLanguage);
        
        // Initialize with saved language
        updateLanguage(currentLang);
    }
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
            }
        });
    }
}

// Typewriter Effect
function initTypewriter() {
    const elements = document.querySelectorAll('.typewriter-text');
    elements.forEach((element, index) => {
        const text = element.textContent;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transition = 'opacity 1s ease';
            element.style.opacity = '1';
        }, 1000 + (index * 500));
    });
}

// Load Featured Projects
async function loadFeaturedProjects() {
    const container = document.getElementById('featured-projects');
    if (!container) return;
    
    try {
        // Try to load from portfolio-data.js
        if (typeof portfolioData !== 'undefined' && portfolioData.projects) {
            const featured = portfolioData.projects.filter(p => p.featured).slice(0, 3);
            
            featured.forEach(project => {
                const title = window.currentLanguage === 'sv' && project.titleSv ? project.titleSv : project.title;
                const category = window.currentLanguage === 'sv' && project.categorySv ? project.categorySv : project.category;
                const description = window.currentLanguage === 'sv' && project.descriptionSv ? project.descriptionSv : project.description;
                
                const projectHTML = `
                    <div class="project-card animate-on-scroll">
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <span class="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                        ${category}
                                    </span>
                                </div>
                                <i class="fas fa-star text-yellow-500"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-3">${title}</h3>
                            <p class="text-gray-600 dark:text-gray-400 mb-4">${description}</p>
                            <div class="flex flex-wrap gap-2 mb-6">
                                ${project.technologies.map(tech => 
                                    `<span class="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                        ${tech}
                                    </span>`
                                ).join('')}
                            </div>
                            <a href="${project.link}" target="_blank" class="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                                View Project <i class="fas fa-arrow-right ml-2"></i>
                            </a>
                        </div>
                    </div>
                `;
                container.innerHTML += projectHTML;
            });
        } else {
            // Fallback hardcoded projects
            container.innerHTML = `
                <div class="project-card animate-on-scroll">
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-3">Bioinformatics Pipeline</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">Developed a pipeline for extracting biomedical data from scientific publications.</p>
                        <a href="http://addcell.org" target="_blank" class="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                            View Project <i class="fas fa-arrow-right ml-2"></i>
                        </a>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Initialize all components
function initComponents() {
    initTheme();
    initLanguage();
    initMobileMenu();
    initTypewriter();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Include components first
    includeComponents();
    
    // Then initialize everything else
    setTimeout(() => {
        initComponents();
        loadFeaturedProjects();
    }, 100);
});

// Export functions for use in other files
window.portfolio = {
    includeComponents,
    initComponents,
    loadFeaturedProjects
};