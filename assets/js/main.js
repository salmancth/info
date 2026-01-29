// Component Inclusion
function includeComponents() {
    const includes = document.querySelectorAll('[data-include]');
    
    includes.forEach(async (element) => {
        const file = element.getAttribute('data-include');
        
        try {
            const response = await fetch(file);
            const html = await response.text();
            element.innerHTML = html;
            
            // Re-initialize scripts for included components
            initComponents();
        } catch (error) {
            console.error(`Error loading component: ${file}`, error);
        }
    });
}

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get current theme from localStorage or system preference
    let currentTheme = localStorage.getItem('theme') || 
                      (prefersDark.matches ? 'dark' : 'light');
    
    // Apply theme
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    
    // Update toggle buttons
    [themeToggle, mobileThemeToggle].forEach(toggle => {
        if (toggle) {
            toggle.classList.toggle('active', currentTheme === 'dark');
        }
    });
    
    // Theme toggle event
    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', currentTheme);
        
        [themeToggle, mobileThemeToggle].forEach(toggle => {
            if (toggle) toggle.classList.toggle('active');
        });
    }
    
    // Add event listeners
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
}

// Language Management
function initLanguage() {
    const langToggle = document.getElementById('language-toggle');
    const mobileLangToggle = document.getElementById('mobile-language-toggle');
    
    let currentLang = localStorage.getItem('language') || 'en';
    
    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        
        // Update toggle buttons
        [langToggle, mobileLangToggle].forEach(toggle => {
            if (toggle) toggle.classList.toggle('active', lang === 'sv');
        });
        
        // Update text content
        updateTextContent(lang);
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

// Mobile Menu
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.innerHTML = isHidden ? 
                '<i class="fas fa-bars text-xl"></i>' : 
                '<i class="fas fa-times text-xl"></i>';
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isHidden ? '' : 'hidden';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!mobileMenu.contains(event.target) && 
                !mobileMenuButton.contains(event.target) && 
                !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                document.body.style.overflow = '';
            }
        });
    }
}

// Typewriter Effect
function initTypewriter() {
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    
    typewriterElements.forEach((element, index) => {
        const text = element.textContent;
        element.style.width = '0';
        element.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50);
                }
            };
            type();
        }, 1000 + (index * 2000));
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// Load Featured Projects
async function loadFeaturedProjects() {
    const container = document.getElementById('featured-projects');
    if (!container) return;
    
    try {
        const response = await fetch('data/portfolio-data.js');
        // This would need proper JSON data structure
        // For now, we'll create dummy data
        const projects = [
            {
                title: "Bioinformatics Pipeline",
                category: "Software Development",
                description: "Developed a pipeline for extracting biomedical data from scientific publications.",
                technologies: ["C#", "Blazor", "AWS"],
                link: "http://addcell.org",
                featured: true
            },
            {
                title: "Vehicle Radar Component",
                category: "Embedded Systems",
                description: "Designed and simulated waveguide components for 77GHz automotive radar systems.",
                technologies: ["CST", "MATLAB", "RF Design"],
                link: "#",
                featured: true
            },
            {
                title: "Industrial Automation System",
                category: "Automation",
                description: "PLC programming and system integration for manufacturing automation.",
                technologies: ["PLC", "CODESYS", "SCADA"],
                link: "#",
                featured: true
            }
        ];
        
        projects.forEach(project => {
            const projectHTML = `
                <div class="project-card">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <span class="text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                    ${project.category}
                                </span>
                            </div>
                            <i class="fas fa-star text-yellow-500"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-3">${project.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">${project.description}</p>
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
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load Recent Experience
function loadRecentExperience() {
    const container = document.getElementById('recent-experience');
    if (!container) return;
    
    const experiences = [
        {
            title: "Automation Engineer",
            company: "CATC AB",
            period: "Jan 2025 - Apr 2025",
            description: "System integration and configuration of industrial automation systems.",
            type: "left"
        },
        {
            title: "IT Support Technician",
            company: "Toyota Material Handling",
            period: "Mar 2023 - Jun 2024",
            description: "Technical support, network configuration and troubleshooting.",
            type: "right"
        },
        {
            title: "System Developer",
            company: "Chalmers University of Technology",
            period: "Jan 2023 - Jun 2023",
            description: "Software development for bioinformatics research applications.",
            type: "left"
        }
    ];
    
    experiences.forEach((exp, index) => {
        const timelineHTML = `
            <div class="timeline-item ${exp.type === 'left' ? 'timeline-item-left' : 'timeline-item-right'}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-bold">${exp.title}</h3>
                        <span class="text-sm text-blue-600 font-medium bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                            ${exp.period}
                        </span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 font-medium mb-3">${exp.company}</p>
                    <p class="text-gray-700 dark:text-gray-300">${exp.description}</p>
                </div>
            </div>
        `;
        container.innerHTML += timelineHTML;
    });
}

// Initialize all components
function initComponents() {
    initTheme();
    initLanguage();
    initMobileMenu();
}

// Export functions for use in other files
window.portfolio = {
    includeComponents,
    initTheme,
    initLanguage,
    initMobileMenu,
    initTypewriter,
    initScrollAnimations,
    loadFeaturedProjects,
    loadRecentExperience,
    initComponents
};