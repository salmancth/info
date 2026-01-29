// Portfolio Main JavaScript
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize components
        this.loadComponents();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.initSmoothScrolling();
        this.setupTheme();
        this.setupAnalytics();
    }

    loadComponents() {
        // Load header and footer components
        this.loadComponent('header', 'components/header.html');
        this.loadComponent('footer', 'components/footer.html');
        
        // Load data if available
        this.loadData();
    }

    async loadComponent(elementId, url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        } catch (error) {
            console.error(`Failed to load component ${url}:`, error);
        }
    }

    async loadData() {
        try {
            const response = await fetch('data/portfolio-data.json');
            this.data = await response.json();
            this.renderData();
        } catch (error) {
            console.error('Failed to load portfolio data:', error);
            // Fallback to inline data
            this.data = this.getFallbackData();
        }
    }

    getFallbackData() {
        return {
            "personal": {
                "name": "Salman Yahya",
                "title": "Automation Engineer | IT Support Specialist | .NET Developer",
                "email": "salmanyahya@outlook.com",
                "phone": "+46 70 123 45 67",
                "location": "Opalgatan 37, 42162 Västra Frölunda, Sweden",
                "bio": "Technically driven and detail-oriented engineer with strong passion for programming, automation, and troubleshooting. Seeking a challenging role where I can apply my expertise and problem-solving skills to contribute to innovative solutions.",
                "social": {
                    "linkedin": "https://linkedin.com/in/salman-yahya",
                    "github": "https://github.com/salmancth"
                }
            },
            "experience": [
                {
                    "title": "Automation Technician",
                    "company": "CATC AB",
                    "period": "Jan 2025 - Apr 2025",
                    "description": "Worked on industrial automation systems and PLC programming."
                },
                {
                    "title": "IT Support Technician",
                    "company": "Consultant @ Toyota Material Handling",
                    "period": "Mar 2023 - Jun 2024",
                    "description": "Provided technical support and network configuration."
                },
                {
                    "title": "System Developer",
                    "company": "Chalmers University of Technology",
                    "period": "Jan 2023 - Jun 2023",
                    "description": "Developed systems and applications for university projects."
                }
            ],
            "education": [
                {
                    "degree": "Master of Science in Communication Technology",
                    "university": "Chalmers University of Technology",
                    "period": "2021 - 2023"
                },
                {
                    "degree": "Master of Science in Robotics and Automation",
                    "university": "University West",
                    "period": "2020 - 2021"
                },
                {
                    "degree": "Fullstack Development in C#.Net",
                    "university": "Lexicon",
                    "period": "2023 - 2024"
                },
                {
                    "degree": "Bachelor of Science in Electrical and Electronic Engineering",
                    "university": "International Islamic University of Chittagong",
                    "period": "2013 - 2017"
                }
            ],
            "skills": {
                "programming": ["MATLAB/SIMULINK", "Python", "C# / .NET", "Blazor", "PLC / CODESYS", "PowerShell", "Linux", "HTML/CSS"],
                "tools": ["CST Studio", "AWS", "Docker", "Git", "Visual Studio", "VS Code", "JIRA", "Confluence"],
                "languages": ["Swedish", "English", "Bengali"]
            },
            "projects": [
                {
                    "title": "Bioinformatics Pipeline",
                    "organization": "Chalmers University of Technology",
                    "description": "Developed a pipeline for extracting biomedical data from scientific publications using C#, Blazor and Entity Framework, deployed on AWS.",
                    "link": "http://addcell.org"
                },
                {
                    "title": "Vehicle Radar Component Simulation",
                    "organization": "Gapwaves AB (Thesis Project)",
                    "description": "Designed and simulated a microstrip-to-double-ridge waveguide transition for 77 GHz automotive radar systems using CST Studio Suite, focusing on gap waveguide technology."
                }
            ],
            "certificates": [
                {
                    "name": "AWS Certified Cloud Practitioner",
                    "issuer": "Amazon Web Services",
                    "date": "2024"
                },
                {
                    "name": "Microsoft Certified: Azure Fundamentals",
                    "issuer": "Microsoft",
                    "date": "2023"
                }
            ]
        };
    }

    renderData() {
        // This will be implemented in individual pages
        console.log('Portfolio data loaded:', this.data);
    }

    setupEventListeners() {
        // Setup event listeners for dynamic content
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleGlobalClick(e) {
        // Handle global click events
        const target = e.target;
        
        // Handle external links
        if (target.matches('a[href^="http"]') && !target.href.includes(window.location.hostname)) {
            this.trackOutboundLink(target.href);
        }
        
        // Handle download links
        if (target.matches('.resume-download')) {
            e.preventDefault();
            this.downloadResume();
        }
    }

    handleResize() {
        // Handle responsive behavior
        this.adjustLayout();
    }

    adjustLayout() {
        // Adjust layout based on screen size
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile-view', isMobile);
    }

    setupIntersectionObserver() {
        // Setup intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    }

    initSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL
                    history.pushState(null, null, href);
                }
            });
        });
    }

    setupTheme() {
        // Theme switching functionality
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            });
        }

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    setupAnalytics() {
        // Basic analytics tracking
        this.trackPageView();
        this.setupPerformanceMonitoring();
    }

    trackPageView() {
        const page = window.location.pathname;
        console.log('Page view:', page);
        // Here you can integrate with Google Analytics or other tracking services
    }

    trackOutboundLink(url) {
        console.log('Outbound link clicked:', url);
        // Track external link clicks
    }

    setupPerformanceMonitoring() {
        // Monitor page performance
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }

    downloadResume() {
        // Resume download functionality
        const resumeUrl = 'assets/docs/resume.pdf';
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = 'Salman_Yahya_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Track download
        console.log('Resume downloaded');
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}