// main.js - Main JavaScript file for portfolio

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized');
    
    // Set current year in footer
    const yearElements = document.querySelectorAll('#current-year');
    if (yearElements.length > 0) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
    
    // Initialize theme
    initTheme();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize active nav links
    initActiveNavLinks();
});

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
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
        
        // Update toggle button if exists
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
            }
        }
    }
    
    // Add event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuButton.querySelector('i');
            
            if (icon) {
                if (isHidden) {
                    icon.className = 'fas fa-bars text-xl';
                } else {
                    icon.className = 'fas fa-times text-xl';
                }
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isHidden ? '' : 'hidden';
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars text-xl';
                }
                document.body.style.overflow = '';
            });
        });
    }
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, href);
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// Active Navigation Links
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function setActiveLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        // Find current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-bold');
            
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('text-blue-600', 'dark:text-blue-400', 'font-bold');
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', setActiveLink);
    
    // Initial call
    setActiveLink();
}

// Export functions for use in other files (if needed)
window.portfolio = {
    initTheme,
    initMobileMenu,
    initSmoothScroll,
    initScrollAnimations,
    initActiveNavLinks
};