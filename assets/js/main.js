/**
 * Portfolio Main Application
 * Handles core functionality and component initialization
 */

class PortfolioApp {
    constructor() {
        this.config = {
            apiEndpoint: null, // Set if using backend
            contactEmail: 'salmanyahya@outlook.com',
            defaultLanguage: 'en',
            debug: false
        };
        
        this.state = {
            currentPage: window.location.pathname.split('/').pop() || 'index.html',
            currentLanguage: localStorage.getItem('portfolio_language') || this.config.defaultLanguage,
            isMobile: window.innerWidth < 992,
            isLoading: false,
            scrollPosition: 0
        };
        
        this.data = null;
        this.components = {};
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('📱 Portfolio App Initializing...');
        
        // Set up initial state
        this.setupInitialState();
        
        // Load components
        this.loadComponents();
        
        // Load portfolio data
        this.loadPortfolioData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize components
        this.initComponents();
        
        // Set up observers
        this.setupObservers();
        
        // Track initial page view
        this.trackPageView();
        
        console.log('✅ Portfolio App Ready!');
    }

    /**
     * Set up initial application state
     */
    setupInitialState() {
        // Set language attribute
        document.documentElement.lang = this.state.currentLanguage;
        
        // Add body classes based on device
        if (this.state.isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.add('desktop');
        }
        
        // Add page-specific class
        const pageClass = this.state.currentPage.replace('.html', '').replace('index', 'home');
        document.body.classList.add(`page-${pageClass}`);
        
        // Store initial scroll position
        this.state.scrollPosition = window.pageYOffset;
    }

    /**
     * Load all components
     */
    loadComponents() {
        this.components = {
            header: new HeaderComponent(),
            footer: new FooterComponent(),
            gallery: document.querySelector('.gallery-grid') ? new GalleryManager() : null,
            modal: new ModalManager(),
            form: new FormManager(),
            scroll: new ScrollManager(),
            analytics: new AnalyticsManager(this.config.debug)
        };
    }

    /**
     * Load portfolio data from JSON file
     */
    async loadPortfolioData() {
        try {
            const response = await fetch('data/portfolio-data.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.data = await response.json();
            console.log('📊 Portfolio data loaded successfully');
            
            // Render data on pages that need it
            this.renderPortfolioData();
            
        } catch (error) {
            console.error('❌ Failed to load portfolio data:', error);
            
            // Use fallback data
            this.data = this.getFallbackData();
            this.renderPortfolioData();
            
            // Show warning in development
            if (this.config.debug) {
                this.showNotification('Using fallback data', 'warning');
            }
        }
    }

    /**
     * Get fallback data when JSON file is unavailable
     */
    getFallbackData() {
        return {
            personal: {
                name: "Salman Yahya",
                title: "Automation Engineer | IT Support Specialist | .NET Developer",
                email: "salmanyahya@outlook.com",
                phone: "+46 70 123 45 67",
                location: "Opalgatan 37, 42162 Västra Frölunda, Sweden",
                bio: "Technically driven and detail-oriented engineer with strong passion for programming, automation, and troubleshooting.",
                summary: "Experienced professional with expertise in automation systems, IT support, and full-stack development.",
                social: {
                    linkedin: "https://linkedin.com/in/salman-yahya",
                    github: "https://github.com/salmancth",
                    portfolio: "https://salmancth.github.io/info"
                }
            },
            experience: [
                {
                    title: "Automation Technician",
                    company: "CATC AB",
                    period: "Jan 2025 - Apr 2025",
                    description: "Worked on industrial automation systems and PLC programming."
                },
                {
                    title: "IT Support Technician",
                    company: "Consultant @ Toyota Material Handling",
                    period: "Mar 2023 - Jun 2024",
                    description: "Provided technical support and network configuration."
                }
            ],
            education: [
                {
                    degree: "Master of Science in Communication Technology",
                    university: "Chalmers University of Technology",
                    period: "2021 - 2023"
                }
            ],
            skills: {
                programming: ["MATLAB/SIMULINK", "Python", "C# / .NET"],
                tools: ["CST Studio", "AWS", "Docker"]
            },
            projects: [
                {
                    title: "Bioinformatics Pipeline",
                    description: "Developed a pipeline for extracting biomedical data."
                }
            ],
            certificates: [
                {
                    name: "AWS Certified Cloud Practitioner",
                    issuer: "Amazon Web Services"
                }
            ]
        };
    }

    /**
     * Render portfolio data on appropriate pages
     */
    renderPortfolioData() {
        if (!this.data) return;

        // Update page title with personal name
        const pageTitle = document.querySelector('title');
        if (pageTitle && this.data.personal && this.data.personal.name) {
            const currentTitle = pageTitle.textContent;
            if (!currentTitle.includes(this.data.personal.name)) {
                pageTitle.textContent = `${this.data.personal.name} | ${currentTitle}`;
            }
        }

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && this.data.personal && this.data.personal.summary) {
            metaDescription.setAttribute('content', this.data.personal.summary);
        }

        // Update Open Graph tags
        this.updateOpenGraphTags();

        // Page-specific data rendering
        switch (this.state.currentPage) {
            case 'about.html':
                this.renderAboutPage();
                break;
            case 'experience.html':
                this.renderExperiencePage();
                break;
            case 'education.html':
                this.renderEducationPage();
                break;
            case 'skills.html':
                this.renderSkillsPage();
                break;
            case 'projects.html':
                this.renderProjectsPage();
                break;
            case 'certificates.html':
                this.renderCertificatesPage();
                break;
            default:
                this.renderHomePage();
        }
    }

    /**
     * Update Open Graph meta tags
     */
    updateOpenGraphTags() {
        if (!this.data.personal) return;

        // Update OG title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && this.data.personal.name) {
            ogTitle.setAttribute('content', `${this.data.personal.name} - ${this.data.personal.title}`);
        }

        // Update OG description
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && this.data.personal.summary) {
            ogDescription.setAttribute('content', this.data.personal.summary);
        }

        // Update Twitter card
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle && this.data.personal.name) {
            twitterTitle.setAttribute('content', `${this.data.personal.name} - ${this.data.personal.title}`);
        }
    }

    /**
     * Render home page specific content
     */
    renderHomePage() {
        if (!this.data) return;

        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && this.data.personal.name) {
            heroTitle.textContent = this.data.personal.name;
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && this.data.personal.title) {
            heroDescription.textContent = this.data.personal.title;
        }

        // Update about preview
        const aboutBio = document.querySelector('.about-content p');
        if (aboutBio && this.data.personal.bio) {
            aboutBio.textContent = this.data.personal.bio;
        }

        // Update contact info
        const contactEmail = document.querySelector('a[href^="mailto:"]');
        if (contactEmail && this.data.personal.email) {
            contactEmail.href = `mailto:${this.data.personal.email}`;
            contactEmail.textContent = this.data.personal.email;
        }
    }

    /**
     * Render about page
     */
    renderAboutPage() {
        if (!this.data || !this.data.personal) return;

        const aboutContainer = document.getElementById('about-content');
        if (!aboutContainer) return;

        // Create about page content
        const aboutHTML = `
            <div class="bio-section">
                <h2>Professional Bio</h2>
                <div class="bio-content">
                    <p>${this.data.personal.bio || ''}</p>
                    ${this.data.personal.summary ? `<p>${this.data.personal.summary}</p>` : ''}
                </div>
            </div>

            <div class="contact-details">
                <h3>Contact Information</h3>
                <div class="contact-grid">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <strong>Email</strong>
                            <a href="mailto:${this.data.personal.email}">${this.data.personal.email}</a>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <strong>Phone</strong>
                            <a href="tel:${this.data.personal.phone}">${this.data.personal.phone}</a>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Location</strong>
                            <span>${this.data.personal.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="social-links">
                <h3>Connect With Me</h3>
                <div class="social-grid">
                    ${this.data.personal.social.linkedin ? `
                        <a href="${this.data.personal.social.linkedin}" target="_blank" class="social-link">
                            <i class="fab fa-linkedin"></i>
                            LinkedIn
                        </a>
                    ` : ''}
                    ${this.data.personal.social.github ? `
                        <a href="${this.data.personal.social.github}" target="_blank" class="social-link">
                            <i class="fab fa-github"></i>
                            GitHub
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        aboutContainer.innerHTML = aboutHTML;
    }

    /**
     * Render experience page
     */
    renderExperiencePage() {
        if (!this.data || !this.data.experience) return;

        const experienceContainer = document.getElementById('experience-list');
        if (!experienceContainer) return;

        if (this.data.experience.length === 0) {
            experienceContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No Experience Data Available</h3>
                    <p>Experience data will be displayed here when available.</p>
                </div>
            `;
            return;
        }

        let experienceHTML = '';
        
        this.data.experience.forEach((exp, index) => {
            experienceHTML += `
                <div class="experience-item ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}">
                    <div class="experience-header">
                        <div>
                            <h3 class="experience-title">${exp.title}</h3>
                            <p class="experience-company">${exp.company}</p>
                        </div>
                        <span class="experience-period">${exp.period}</span>
                    </div>
                    ${exp.description ? `<p class="experience-description">${exp.description}</p>` : ''}
                    ${exp.technologies && exp.technologies.length > 0 ? `
                        <div class="experience-tech">
                            ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        experienceContainer.innerHTML = experienceHTML;
        
        // Initialize reveal animations
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
                observer.observe(el);
            });
        }, 100);
    }

    /**
     * Render education page
     */
    renderEducationPage() {
        if (!this.data || !this.data.education) return;

        const educationContainer = document.getElementById('education-list');
        if (!educationContainer) return;

        if (this.data.education.length === 0) {
            educationContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>No Education Data Available</h3>
                    <p>Education data will be displayed here when available.</p>
                </div>
            `;
            return;
        }

        let educationHTML = '';
        
        this.data.education.forEach((edu, index) => {
            educationHTML += `
                <div class="education-card ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}">
                    <h3 class="education-degree">${edu.degree}</h3>
                    <p class="education-university">${edu.university}</p>
                    <span class="education-period">${edu.period}</span>
                    
                    ${edu.gpa ? `
                        <span class="education-gpa">GPA: ${edu.gpa}</span>
                    ` : ''}
                    
                    ${edu.description ? `
                        <p class="education-description">${edu.description}</p>
                    ` : ''}
                    
                    ${edu.courses && edu.courses.length > 0 ? `
                        <div class="education-courses">
                            <h4>Key Courses:</h4>
                            <div class="course-list">
                                ${edu.courses.map(course => `<span class="course-tag">${course}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        educationContainer.innerHTML = educationHTML;
        
        // Initialize reveal animations
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
                observer.observe(el);
            });
        }, 100);
    }

    /**
     * Render skills page
     */
    renderSkillsPage() {
        if (!this.data || !this.data.skills) return;

        const skillsContainer = document.getElementById('skills-content');
        if (!skillsContainer) return;

        let skillsHTML = '';

        // Programming Languages
        if (this.data.skills.programming && this.data.skills.programming.length > 0) {
            skillsHTML += `
                <div class="skills-category reveal">
                    <h3>Programming Languages</h3>
                    <div class="skills-grid">
                        ${this.data.skills.programming.map(skill => `
                            <div class="skill-card">
                                <div class="skill-header">
                                    <div class="skill-icon">
                                        <i class="fas fa-code"></i>
                                    </div>
                                    <h4>${typeof skill === 'object' ? skill.name : skill}</h4>
                                </div>
                                ${typeof skill === 'object' && skill.level ? `
                                    <div class="skill-level">
                                        <div class="level-bar">
                                            <div class="level-progress" style="width: ${skill.level}%"></div>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Tools & Technologies
        if (this.data.skills.tools && this.data.skills.tools.length > 0) {
            skillsHTML += `
                <div class="skills-category reveal">
                    <h3>Tools & Technologies</h3>
                    <div class="skills-grid">
                        ${this.data.skills.tools.map(tool => `
                            <div class="skill-card">
                                <div class="skill-header">
                                    <div class="skill-icon">
                                        <i class="fas fa-tools"></i>
                                    </div>
                                    <h4>${tool}</h4>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Languages
        if (this.data.skills.languages && this.data.skills.languages.length > 0) {
            skillsHTML += `
                <div class="skills-category reveal">
                    <h3>Languages</h3>
                    <div class="skills-grid">
                        ${this.data.skills.languages.map(lang => `
                            <div class="skill-card">
                                <div class="skill-header">
                                    <div class="skill-icon">
                                        <i class="fas fa-language"></i>
                                    </div>
                                    <div>
                                        <h4>${typeof lang === 'object' ? lang.name : lang}</h4>
                                        ${typeof lang === 'object' && lang.level ? `
                                            <p class="skill-level-text">${lang.level}</p>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        skillsContainer.innerHTML = skillsHTML || `
            <div class="empty-state">
                <i class="fas fa-code"></i>
                <h3>No Skills Data Available</h3>
                <p>Skills data will be displayed here when available.</p>
            </div>
        `;

        // Animate skill progress bars
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        
                        // Animate progress bars
                        const progressBars = entry.target.querySelectorAll('.level-progress');
                        progressBars.forEach(bar => {
                            const width = bar.style.width;
                            bar.style.width = '0';
                            setTimeout(() => {
                                bar.style.width = width;
                            }, 300);
                        });
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        }, 100);
    }

    /**
     * Render projects page
     */
    renderProjectsPage() {
        if (!this.data || !this.data.projects) return;

        const projectsContainer = document.getElementById('projects-list');
        if (!projectsContainer) return;

        if (this.data.projects.length === 0) {
            projectsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-project-diagram"></i>
                    <h3>No Projects Available</h3>
                    <p>Project data will be displayed here when available.</p>
                </div>
            `;
            return;
        }

        let projectsHTML = '';
        
        this.data.projects.forEach((project, index) => {
            projectsHTML += `
                <div class="project-card ${index % 3 === 0 ? 'reveal-left' : index % 3 === 1 ? 'reveal' : 'reveal-right'}">
                    ${project.image ? `
                        <img src="${project.image}" alt="${project.title}" class="project-image">
                    ` : `
                        <div class="project-image-placeholder">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                    `}
                    
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        
                        ${project.organization ? `
                            <span class="project-category">${project.organization}</span>
                        ` : ''}
                        
                        ${project.period ? `
                            <span class="project-period">${project.period}</span>
                        ` : ''}
                        
                        ${project.description ? `
                            <p class="project-description">${project.description}</p>
                        ` : ''}
                        
                        ${project.technologies && project.technologies.length > 0 ? `
                            <div class="project-tech">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="project-links">
                            ${project.link ? `
                                <a href="${project.link}" target="_blank" class="btn btn-sm">
                                    <i class="fas fa-external-link-alt"></i>
                                    View Live
                                </a>
                            ` : ''}
                            
                            ${project.github ? `
                                <a href="${project.github}" target="_blank" class="btn btn-sm btn-outline">
                                    <i class="fab fa-github"></i>
                                    GitHub
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        projectsContainer.innerHTML = projectsHTML;

        // Initialize reveal animations
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
                observer.observe(el);
            });
        }, 100);
    }

    /**
     * Render certificates page
     */
    renderCertificatesPage() {
        if (!this.data || !this.data.certificates) return;

        const certificatesContainer = document.getElementById('certificates-list');
        if (!certificatesContainer) return;

        if (this.data.certificates.length === 0) {
            certificatesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-certificate"></i>
                    <h3>No Certificates Available</h3>
                    <p>Certificate data will be displayed here when available.</p>
                </div>
            `;
            return;
        }

        let certificatesHTML = '';
        
        this.data.certificates.forEach((cert, index) => {
            certificatesHTML += `
                <div class="certificate-card ${index % 3 === 0 ? 'reveal-left' : index % 3 === 1 ? 'reveal' : 'reveal-right'}">
                    ${cert.image ? `
                        <img src="${cert.image}" alt="${cert.name}" class="certificate-img">
                    ` : `
                        <div class="certificate-img-placeholder">
                            <i class="fas fa-certificate"></i>
                        </div>
                    `}
                    
                    <div class="certificate-content">
                        <h3 class="certificate-title">${cert.name}</h3>
                        
                        ${cert.issuer ? `
                            <p class="certificate-issuer">
                                <i class="fas fa-building"></i>
                                ${cert.issuer}
                            </p>
                        ` : ''}
                        
                        ${cert.date ? `
                            <p class="certificate-date">
                                <i class="fas fa-calendar"></i>
                                ${cert.date}
                            </p>
                        ` : ''}
                        
                        ${cert.link ? `
                            <a href="${cert.link}" target="_blank" class="btn btn-sm">
                                <i class="fas fa-external-link-alt"></i>
                                View Credential
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        certificatesContainer.innerHTML = certificatesHTML;

        // Initialize reveal animations
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
                observer.observe(el);
            });
        }, 100);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Beforeunload
        window.addEventListener('beforeunload', () => {
            this.state.scrollPosition = window.pageYOffset;
        });
        
        // Load
        window.addEventListener('load', this.handleLoad.bind(this));
        
        // Error handling
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const isMobile = window.innerWidth < 992;
        
        if (isMobile !== this.state.isMobile) {
            this.state.isMobile = isMobile;
            
            // Update body classes
            document.body.classList.toggle('mobile', isMobile);
            document.body.classList.toggle('desktop', !isMobile);
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('deviceChange', { 
                detail: { isMobile } 
            }));
        }
    }

    /**
     * Handle window load
     */
    handleLoad() {
        console.log('🚀 Page loaded successfully');
        
        // Update loading state
        this.state.isLoading = false;
        document.body.classList.remove('loading');
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('pageLoaded'));
        
        // Track performance
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.startTime;
                console.log(`⏱️ Page loaded in ${loadTime.toFixed(2)}ms`);
                
                if (this.components.analytics) {
                    this.components.analytics.trackPerformance(loadTime);
                }
            }
        }
    }

    /**
     * Handle JavaScript errors
     */
    handleError(event) {
        console.error('❌ JavaScript Error:', event.error);
        
        // Log to analytics if available
        if (this.components.analytics) {
            this.components.analytics.trackError(event.error);
        }
        
        // Show user-friendly error in development
        if (this.config.debug) {
            this.showNotification('A JavaScript error occurred', 'error');
        }
        
        // Prevent default if it's a serious error
        if (event.error instanceof SyntaxError) {
            event.preventDefault();
        }
    }

    /**
     * Handle unhandled promise rejections
     */
    handlePromiseRejection(event) {
        console.error('❌ Unhandled Promise Rejection:', event.reason);
        
        // Log to analytics if available
        if (this.components.analytics) {
            this.components.analytics.trackError(event.reason);
        }
    }

    /**
     * Initialize all components
     */
    initComponents() {
        Object.values(this.components).forEach(component => {
            if (component && typeof component.init === 'function') {
                component.init();
            }
        });
    }

    /**
     * Set up observers (IntersectionObserver, etc.)
     */
    setupObservers() {
        // Intersection Observer for animations
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    this.animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.animationObserver.observe(el);
        });

        // Mutation Observer for dynamic content
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Re-initialize animations for new elements
                            node.querySelectorAll('.animate-on-scroll').forEach(el => {
                                this.animationObserver.observe(el);
                            });
                        }
                    });
                }
            });
        });

        // Start observing the document body for changes
        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Track page view for analytics
     */
    trackPageView() {
        const page = this.state.currentPage;
        const referrer = document.referrer;
        
        console.log(`📄 Page View: ${page}${referrer ? ` (from: ${referrer})` : ''}`);
        
        if (this.components.analytics) {
            this.components.analytics.trackPageView(page, referrer);
        }
        
        // Update navigation active state
        this.updateNavigationActiveState();
    }

    /**
     * Update navigation active state
     */
    updateNavigationActiveState() {
        const currentPage = this.state.currentPage;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && (href === './' || href === '/' || href === 'index.html')) ||
                (href && href.includes(currentPage.replace('.html', '')))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: var(--radius);
                    background: white;
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    z-index: 9999;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                    min-width: 300px;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }
                .notification i {
                    font-size: 1.25rem;
                }
                .notification-info {
                    border-left: 4px solid var(--primary);
                }
                .notification-info i { color: var(--primary); }
                .notification-success {
                    border-left: 4px solid var(--accent);
                }
                .notification-success i { color: var(--accent); }
                .notification-warning {
                    border-left: 4px solid var(--warning);
                }
                .notification-warning i { color: var(--warning); }
                .notification-error {
                    border-left: 4px solid var(--danger);
                }
                .notification-error i { color: var(--danger); }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--gray);
                    cursor: pointer;
                    padding: 0.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notification-close:hover {
                    color: var(--dark);
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideInRight 0.3s ease reverse';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
        
        return notification;
    }

    /**
     * Get icon for notification type
     */
    getNotificationIcon(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    /**
     * Change language
     */
    changeLanguage(lang) {
        if (lang === this.state.currentLanguage) return;
        
        // Update state
        this.state.currentLanguage = lang;
        localStorage.setItem('portfolio_language', lang);
        document.documentElement.lang = lang;
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('languageChange', { 
            detail: { language: lang } 
        }));
        
        // Show notification
        this.showNotification(`Language changed to ${lang.toUpperCase()}`, 'success');
        
        // Reload data for new language if needed
        this.loadPortfolioData();
    }

    /**
     * Get current page data
     */
    getPageData() {
        return this.data;
    }

    /**
     * Get component instance
     */
    getComponent(name) {
        return this.components[name];
    }

    /**
     * Cleanup method
     */
    destroy() {
        // Disconnect observers
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        // Destroy components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('load', this.handleLoad);
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
        
        console.log('🧹 Portfolio App Cleaned Up');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading state to body
    document.body.classList.add('loading');
    
    // Initialize app
    window.portfolioApp = new PortfolioApp();
    
    // Make app globally available for debugging
    if (window.portfolioApp.config.debug) {
        console.log('🔧 Debug mode enabled');
        console.log('📱 App instance available as window.portfolioApp');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}