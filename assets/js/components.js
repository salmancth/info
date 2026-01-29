/**
 * UI Components Manager
 * Handles header, footer, navigation, and other UI components
 */

/**
 * Header Component
 */
class HeaderComponent {
    constructor() {
        this.header = null;
        this.mobileMenu = null;
        this.mobileMenuBtn = null;
        this.languageToggle = null;
        this.isMobileMenuOpen = false;
        this.lastScrollY = 0;
        this.scrollDirection = 'down';
    }

    init() {
        console.log('🔧 Initializing Header Component...');
        
        this.header = document.querySelector('.header');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.languageToggle = document.getElementById('languageToggle');
        
        if (!this.header) {
            console.warn('⚠️ Header element not found');
            return;
        }
        
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupLanguageToggle();
        this.setupActiveNav();
        
        console.log('✅ Header Component Initialized');
    }

    setupEventListeners() {
        // Click outside mobile menu to close
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Prevent body scroll when menu is open
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('touchmove', (e) => {
                if (this.isMobileMenuOpen) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }

    setupScrollEffects() {
        if (!this.header) return;

        const scrollThreshold = 100;
        const hideThreshold = 200;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;
            const isScrollingDown = currentScrollY > this.lastScrollY;
            
            // Update scroll direction
            if (Math.abs(currentScrollY - this.lastScrollY) > 5) {
                this.scrollDirection = isScrollingDown ? 'down' : 'up';
            }
            
            // Add/remove scrolled class
            if (currentScrollY > scrollThreshold) {
                this.header.classList.add('scrolled');
                
                // Hide header on scroll down, show on scroll up
                if (currentScrollY > hideThreshold) {
                    if (this.scrollDirection === 'down' && !this.isMobileMenuOpen) {
                        this.header.style.transform = 'translateY(-100%)';
                    } else {
                        this.header.style.transform = 'translateY(0)';
                    }
                }
            } else {
                this.header.classList.remove('scrolled');
                this.header.style.transform = 'translateY(0)';
            }
            
            this.lastScrollY = currentScrollY;
        }, { passive: true });
    }

    setupMobileMenu() {
        if (!this.mobileMenuBtn || !this.mobileMenu) return;

        const mobileCloseBtn = document.getElementById('mobileCloseBtn');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const mobileLinks = this.mobileMenu.querySelectorAll('a');

        // Toggle mobile menu
        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close button
        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close menu when clicking links
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    setupLanguageToggle() {
        if (!this.languageToggle) return;

        this.languageToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang || 'en';
            const newLang = currentLang === 'en' ? 'sv' : 'en';
            
            // Update button text
            const toggleText = this.languageToggle.querySelector('span');
            if (toggleText) {
                toggleText.textContent = newLang.toUpperCase();
            }
            
            // Trigger language change
            if (window.portfolioApp) {
                window.portfolioApp.changeLanguage(newLang);
            } else {
                // Fallback if app not available
                document.documentElement.lang = newLang;
                localStorage.setItem('portfolio_language', newLang);
                
                // Show notification
                this.showLanguageNotification(newLang);
            }
        });

        // Set initial language button text
        const currentLang = localStorage.getItem('portfolio_language') || 'en';
        const toggleText = this.languageToggle.querySelector('span');
        if (toggleText) {
            toggleText.textContent = currentLang.toUpperCase();
        }
    }

    setupActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (this.isActiveLink(href, currentPage)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    isActiveLink(href, currentPage) {
        if (!href) return false;
        
        // Handle index page
        if (currentPage === 'index.html' || currentPage === '') {
            return href === './' || href === '/' || href === 'index.html' || href === '#home';
        }
        
        // Handle other pages
        return href.includes(currentPage.replace('.html', ''));
    }

    toggleMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuBtn) return;

        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuBtn) return;

        this.mobileMenu.classList.add('active');
        this.mobileMenuBtn.classList.add('active');
        
        // Show overlay if exists
        const overlay = document.getElementById('mobileOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        this.isMobileMenuOpen = true;
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('mobileMenuOpen'));
    }

    closeMobileMenu() {
        if (!this.mobileMenu || !this.mobileMenuBtn) return;

        this.mobileMenu.classList.remove('active');
        this.mobileMenuBtn.classList.remove('active');
        
        // Hide overlay if exists
        const overlay = document.getElementById('mobileOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        this.isMobileMenuOpen = false;
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('mobileMenuClose'));
    }

    showLanguageNotification(lang) {
        const messages = {
            'en': 'Language changed to English',
            'sv': 'Språk ändrat till Svenska'
        };
        
        const message = messages[lang] || `Language changed to ${lang.toUpperCase()}`;
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.innerHTML = `
            <i class="fas fa-language"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        if (!document.querySelector('#language-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'language-notification-styles';
            styles.textContent = `
                .language-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 0.75rem 1.25rem;
                    background: var(--primary);
                    color: white;
                    border-radius: var(--radius);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 9998;
                    animation: slideInUp 0.3s ease;
                    box-shadow: var(--shadow);
                }
                .language-notification i {
                    font-size: 1.25rem;
                }
                @keyframes slideInUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove
        setTimeout(() => {
            notification.style.animation = 'slideInUp 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updateActiveNav(page) {
        this.setupActiveNav();
    }

    destroy() {
        // Cleanup event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        console.log('🧹 Header Component Cleaned Up');
    }
}

/**
 * Footer Component
 */
class FooterComponent {
    constructor() {
        this.footer = null;
        this.backToTopBtn = null;
        this.currentYearElement = null;
        this.resumeDownloadBtn = null;
    }

    init() {
        console.log('🔧 Initializing Footer Component...');
        
        this.footer = document.querySelector('.footer');
        this.backToTopBtn = document.getElementById('backToTop');
        this.currentYearElement = document.getElementById('currentYear');
        this.resumeDownloadBtn = document.querySelector('.resume-download');
        
        if (!this.footer) {
            console.warn('⚠️ Footer element not found');
            return;
        }
        
        this.setupEventListeners();
        this.updateCurrentYear();
        this.setupBackToTop();
        this.setupResumeDownload();
        this.setupNewsletterForm();
        
        console.log('✅ Footer Component Initialized');
    }

    setupEventListeners() {
        // Social link tracking
        const socialLinks = this.footer.querySelectorAll('.social-icon');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = link.getAttribute('aria-label') || link.querySelector('i').className;
                this.trackSocialClick(platform, link.href);
            });
        });
    }

    updateCurrentYear() {
        if (this.currentYearElement) {
            this.currentYearElement.textContent = new Date().getFullYear();
        }
    }

    setupBackToTop() {
        if (!this.backToTopBtn) return;

        // Show/hide button based on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.backToTopBtn.style.opacity = '1';
                this.backToTopBtn.style.visibility = 'visible';
                this.backToTopBtn.style.transform = 'translateY(0)';
            } else {
                this.backToTopBtn.style.opacity = '0';
                this.backToTopBtn.style.visibility = 'hidden';
                this.backToTopBtn.style.transform = 'translateY(10px)';
            }
        }, { passive: true });

        // Smooth scroll to top
        this.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Track analytics event
            if (window.portfolioApp && window.portfolioApp.components.analytics) {
                window.portfolioApp.components.analytics.trackEvent('footer', 'back_to_top_click');
            }
        });
    }

    setupResumeDownload() {
        if (!this.resumeDownloadBtn) return;

        this.resumeDownloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show download confirmation
            this.showDownloadConfirmation();
            
            // Track download event
            if (window.portfolioApp && window.portfolioApp.components.analytics) {
                window.portfolioApp.components.analytics.trackEvent('footer', 'resume_download_click');
            }
            
            // Simulate download (replace with actual resume URL)
            setTimeout(() => {
                const resumeUrl = 'assets/docs/resume.pdf';
                const link = document.createElement('a');
                link.href = resumeUrl;
                link.download = 'Salman_Yahya_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success notification
                this.showDownloadSuccess();
            }, 500);
        });
    }

    setupNewsletterForm() {
        const newsletterForm = this.footer.querySelector('.newsletter-form');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value.trim();
            
            if (!this.validateEmail(email)) {
                this.showNewsletterError('Please enter a valid email address');
                return;
            }
            
            // Simulate newsletter subscription
            this.subscribeToNewsletter(email);
        });
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    subscribeToNewsletter(email) {
        // Show loading state
        const submitBtn = document.querySelector('.newsletter-btn');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            this.showNewsletterSuccess();
            
            // Clear input
            const emailInput = document.querySelector('.newsletter-input');
            emailInput.value = '';
            
            // Track event
            if (window.portfolioApp && window.portfolioApp.components.analytics) {
                window.portfolioApp.components.analytics.trackEvent('footer', 'newsletter_subscription');
            }
        }, 1500);
    }

    showDownloadConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'download-confirmation';
        confirmation.innerHTML = `
            <i class="fas fa-file-download"></i>
            <span>Preparing your resume download...</span>
        `;
        
        this.addNotificationStyles();
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            confirmation.style.animation = 'slideInUp 0.3s ease reverse';
            setTimeout(() => confirmation.remove(), 300);
        }, 2000);
    }

    showDownloadSuccess() {
        const success = document.createElement('div');
        success.className = 'download-success';
        success.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Resume downloaded successfully!</span>
        `;
        
        this.addNotificationStyles();
        document.body.appendChild(success);
        
        setTimeout(() => {
            success.style.animation = 'slideInUp 0.3s ease reverse';
            setTimeout(() => success.remove(), 300);
        }, 3000);
    }

    showNewsletterError(message) {
        const error = document.createElement('div');
        error.className = 'newsletter-error';
        error.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        this.addNotificationStyles();
        document.body.appendChild(error);
        
        setTimeout(() => {
            error.style.animation = 'slideInUp 0.3s ease reverse';
            setTimeout(() => error.remove(), 300);
        }, 3000);
    }

    showNewsletterSuccess() {
        const success = document.createElement('div');
        success.className = 'newsletter-success';
        success.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Thank you for subscribing!</span>
        `;
        
        this.addNotificationStyles();
        document.body.appendChild(success);
        
        setTimeout(() => {
            success.style.animation = 'slideInUp 0.3s ease reverse';
            setTimeout(() => success.remove(), 300);
        }, 3000);
    }

    addNotificationStyles() {
        if (!document.querySelector('#footer-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'footer-notification-styles';
            styles.textContent = `
                .download-confirmation,
                .download-success,
                .newsletter-error,
                .newsletter-success {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 1rem 1.5rem;
                    background: white;
                    border-radius: var(--radius);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 9998;
                    animation: slideInUp 0.3s ease;
                    box-shadow: var(--shadow-lg);
                    max-width: 90%;
                }
                .download-confirmation {
                    border-left: 4px solid var(--primary);
                }
                .download-confirmation i { color: var(--primary); }
                .download-success {
                    border-left: 4px solid var(--accent);
                }
                .download-success i { color: var(--accent); }
                .newsletter-error {
                    border-left: 4px solid var(--danger);
                }
                .newsletter-error i { color: var(--danger); }
                .newsletter-success {
                    border-left: 4px solid var(--accent);
                }
                .newsletter-success i { color: var(--accent); }
                @keyframes slideInUp {
                    from {
                        transform: translateX(-50%) translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    trackSocialClick(platform, url) {
        console.log(`📱 Social click: ${platform} - ${url}`);
        
        if (window.portfolioApp && window.portfolioApp.components.analytics) {
            window.portfolioApp.components.analytics.trackEvent('social', 'click', platform);
        }
    }

    destroy() {
        // Cleanup event listeners
        window.removeEventListener('scroll', this.handleScroll);
        
        if (this.backToTopBtn) {
            this.backToTopBtn.removeEventListener('click', this.handleBackToTop);
        }
        
        console.log('🧹 Footer Component Cleaned Up');
    }
}

/**
 * Scroll Manager
 */
class ScrollManager {
    constructor() {
        this.scrollElements = new Map();
        this.isScrolling = false;
        this.lastScrollTime = 0;
        this.scrollThrottle = 100; // ms
    }

    init() {
        console.log('🔧 Initializing Scroll Manager...');
        
        this.setupSmoothScroll();
        this.setupScrollAnimations();
        this.setupScrollSpy();
        this.setupScrollProgress();
        
        console.log('✅ Scroll Manager Initialized');
    }

    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            this.scrollToElement(href);
        });
    }

    scrollToElement(selector, offset = 80) {
        const target = document.querySelector(selector);
        if (!target) return;
        
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - offset;
        const duration = Math.min(1000, Math.abs(distance) * 0.5);
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (easeInOutCubic)
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }

    setupScrollAnimations() {
        // Throttled scroll handler
        window.addEventListener('scroll', () => {
            const now = Date.now();
            
            if (now - this.lastScrollTime < this.scrollThrottle) {
                return;
            }
            
            this.lastScrollTime = now;
            
            // Update scroll position classes
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Add classes based on scroll position
            if (scrollY > 100) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
            
            if (scrollY + windowHeight >= documentHeight - 100) {
                document.body.classList.add('scrolled-to-bottom');
            } else {
                document.body.classList.remove('scrolled-to-bottom');
            }
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('scrollThrottled', {
                detail: { scrollY, windowHeight, documentHeight }
            }));
        }, { passive: true });
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Update active nav link
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                    
                    // Update URL hash without scrolling
                    if (history.replaceState) {
                        history.replaceState(null, null, `#${id}`);
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }

    scrollToTop(behavior = 'smooth') {
        window.scrollTo({
            top: 0,
            behavior: behavior
        });
    }

    scrollToBottom(behavior = 'smooth') {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: behavior
        });
    }

    isElementInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        console.log('🧹 Scroll Manager Cleaned Up');
    }
}

/**
 * Modal Manager
 */
class ModalManager {
    constructor() {
        this.modals = new Map();
        this.currentModal = null;
        this.isOpen = false;
        this.scrollPosition = 0;
    }

    init() {
        console.log('🔧 Initializing Modal Manager...');
        
        this.registerModals();
        this.setupEventListeners();
        
        console.log('✅ Modal Manager Initialized');
    }

    registerModals() {
        const modalElements = document.querySelectorAll('.modal');
        
        modalElements.forEach(modal => {
            const id = modal.id || `modal-${Math.random().toString(36).substr(2, 9)}`;
            modal.id = id;
            
            this.modals.set(id, {
                element: modal,
                triggers: document.querySelectorAll(`[data-modal="${id}"]`),
                closeButtons: modal.querySelectorAll('.modal-close, [data-close-modal]'),
                isOpen: false
            });
            
            // Set up triggers
            const modalData = this.modals.get(id);
            modalData.triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal(id);
                });
            });
            
            // Set up close buttons
            modalData.closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.closeModal(id);
                });
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(id);
                }
            });
        });
    }

    setupEventListeners() {
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen && this.currentModal) {
                this.closeModal(this.currentModal);
            }
        });
        
        // Prevent body scroll when modal is open
        document.addEventListener('wheel', (e) => {
            if (this.isOpen) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isOpen) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    openModal(id) {
        const modalData = this.modals.get(id);
        if (!modalData || modalData.isOpen) return;
        
        // Store current modal and scroll position
        this.currentModal = id;
        this.scrollPosition = window.pageYOffset;
        
        // Show modal
        modalData.element.classList.add('active');
        modalData.isOpen = true;
        this.isOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('modalOpen', { 
            detail: { id, element: modalData.element } 
        }));
        
        // Focus trap
        this.setupFocusTrap(modalData.element);
    }

    closeModal(id) {
        const modalData = this.modals.get(id);
        if (!modalData || !modalData.isOpen) return;
        
        // Hide modal
        modalData.element.classList.remove('active');
        modalData.isOpen = false;
        this.isOpen = false;
        this.currentModal = null;
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.scrollPosition);
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('modalClose', { 
            detail: { id, element: modalData.element } 
        }));
    }

    setupFocusTrap(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
        
        // Focus first element
        setTimeout(() => firstElement.focus(), 100);
    }

    createModal(options) {
        const {
            id,
            title,
            content,
            size = 'medium',
            showCloseButton = true,
            closeOnBackdropClick = true
        } = options;
        
        const modalId = id || `modal-${Date.now()}`;
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = `modal modal-${size}`;
        modal.id = modalId;
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    ${title ? `
                        <div class="modal-header">
                            <h3 class="modal-title">${title}</h3>
                            ${showCloseButton ? `
                                <button type="button" class="modal-close" data-close-modal>
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(modal);
        
        // Register modal
        this.modals.set(modalId, {
            element: modal,
            triggers: [],
            closeButtons: modal.querySelectorAll('.modal-close, [data-close-modal]'),
            isOpen: false
        });
        
        // Set up close functionality
        const modalData = this.modals.get(modalId);
        modalData.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal(modalId);
            });
        });
        
        if (closeOnBackdropClick) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modalId);
                }
            });
        }
        
        return modalId;
    }

    showAlert(message, type = 'info') {
        const modalId = this.createModal({
            title: type.charAt(0).toUpperCase() + type.slice(1),
            content: `
                <div class="alert alert-${type}">
                    <i class="fas fa-${this.getAlertIcon(type)}"></i>
                    <p>${message}</p>
                </div>
            `,
            size: 'small',
            showCloseButton: true,
            closeOnBackdropClick: true
        });
        
        this.openModal(modalId);
        return modalId;
    }

    getAlertIcon(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    destroy() {
        // Close all open modals
        this.modals.forEach((modalData, id) => {
            if (modalData.isOpen) {
                this.closeModal(id);
            }
        });
        
        // Clean up event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('🧹 Modal Manager Cleaned Up');
    }
}

/**
 * Form Manager
 */
class FormManager {
    constructor() {
        this.forms = new Map();
        this.validationRules = new Map();
        this.isSubmitting = false;
    }

    init() {
        console.log('🔧 Initializing Form Manager...');
        
        this.registerForms();
        this.setupValidationRules();
        this.setupEventListeners();
        
        console.log('✅ Form Manager Initialized');
    }

    registerForms() {
        const formElements = document.querySelectorAll('form');
        
        formElements.forEach((form, index) => {
            const id = form.id || `form-${index}`;
            form.id = id;
            
            this.forms.set(id, {
                element: form,
                fields: Array.from(form.elements).filter(el => el.tagName !== 'BUTTON'),
                isSubmitting: false,
                isValid: true
            });
            
            // Set up form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(id);
            });
            
            // Set up field validation
            const formData = this.forms.get(id);
            formData.fields.forEach(field => {
                if (field.type !== 'submit' && field.type !== 'button') {
                    field.addEventListener('blur', () => {
                        this.validateField(id, field);
                    });
                    
                    field.addEventListener('input', () => {
                        this.clearFieldError(field);
                    });
                }
            });
        });
    }

    setupValidationRules() {
        // Email validation
        this.validationRules.set('email', {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        });
        
        // Phone validation (international)
        this.validationRules.set('phone', {
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            message: 'Please enter a valid phone number'
        });
        
        // Required field
        this.validationRules.set('required', {
            validator: (value) => value.trim().length > 0,
            message: 'This field is required'
        });
        
        // Minimum length
        this.validationRules.set('minLength', (length) => ({
            validator: (value) => value.trim().length >= length,
            message: `Must be at least ${length} characters`
        }));
        
        // Maximum length
        this.validationRules.set('maxLength', (length) => ({
            validator: (value) => value.trim().length <= length,
            message: `Must be no more than ${length} characters`
        }));
    }

    setupEventListeners() {
        // Global form reset
        document.addEventListener('reset', (e) => {
            if (e.target.tagName === 'FORM') {
                this.resetForm(e.target.id);
            }
        });
    }

    validateField(formId, field) {
        const formData = this.forms.get(formId);
        if (!formData) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Check required
        if (field.required && !this.validationRules.get('required').validator(value)) {
            isValid = false;
            errorMessage = this.validationRules.get('required').message;
        }
        
        // Check type-specific validation
        if (isValid && field.type === 'email' && value) {
            const emailRule = this.validationRules.get('email');
            if (!emailRule.pattern.test(value)) {
                isValid = false;
                errorMessage = emailRule.message;
            }
        }
        
        if (isValid && field.type === 'tel' && value) {
            const phoneRule = this.validationRules.get('phone');
            if (!phoneRule.pattern.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = phoneRule.message;
            }
        }
        
        // Check min/max length
        if (isValid && value) {
            if (field.minLength && value.length < field.minLength) {
                isValid = false;
                errorMessage = this.validationRules.get('minLength')(field.minLength).message;
            }
            
            if (field.maxLength && value.length > field.maxLength) {
                isValid = false;
                errorMessage = this.validationRules.get('maxLength')(field.maxLength).message;
            }
        }
        
        // Check custom validation
        if (isValid && field.dataset.validate) {
            const customValidation = this.customValidation(field);
            if (!customValidation.isValid) {
                isValid = false;
                errorMessage = customValidation.message;
            }
        }
        
        // Show/hide error
        if (!isValid) {
            this.showFieldError(field, errorMessage);
            formData.isValid = false;
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }

    customValidation(field) {
        const validationType = field.dataset.validate;
        const value = field.value.trim();
        
        switch (validationType) {
            case 'url':
                try {
                    new URL(value);
                    return { isValid: true };
                } catch {
                    return { isValid: false, message: 'Please enter a valid URL' };
                }
                
            case 'numeric':
                return /^\d+$/.test(value) 
                    ? { isValid: true }
                    : { isValid: false, message: 'Please enter numbers only' };
                    
            case 'alphabetic':
                return /^[A-Za-z\s]+$/.test(value)
                    ? { isValid: true }
                    : { isValid: false, message: 'Please enter letters only' };
                    
            default:
                return { isValid: true };
        }
    }

    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        
        // Focus field if not already focused
        if (document.activeElement !== field) {
            field.focus();
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    validateForm(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return false;
        
        formData.isValid = true;
        
        // Validate all fields
        formData.fields.forEach(field => {
            if (!this.validateField(formId, field)) {
                formData.isValid = false;
            }
        });
        
        return formData.isValid;
    }

    async handleSubmit(formId) {
        const formData = this.forms.get(formId);
        if (!formData || formData.isSubmitting) return;
        
        // Validate form
        if (!this.validateForm(formId)) {
            this.showFormError(formData.element, 'Please fix the errors above');
            return;
        }
        
        // Set submitting state
        formData.isSubmitting = true;
        this.isSubmitting = true;
        
        // Disable form
        this.disableForm(formId);
        
        // Get form data
        const data = new FormData(formData.element);
        const jsonData = {};
        
        for (let [key, value] of data.entries()) {
            jsonData[key] = value;
        }
        
        try {
            // Show loading state
            this.showLoading(formId);
            
            // Simulate API call (replace with actual endpoint)
            const response = await this.submitFormData(formId, jsonData);
            
            // Handle success
            this.handleSubmitSuccess(formId, response);
            
        } catch (error) {
            // Handle error
            this.handleSubmitError(formId, error);
            
        } finally {
            // Reset submitting state
            formData.isSubmitting = false;
            this.isSubmitting = false;
            this.enableForm(formId);
            this.hideLoading(formId);
        }
    }

    async submitFormData(formId, data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, always succeed
        // In production, replace with actual fetch call:
        /*
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
        */
        
        return {
            success: true,
            message: 'Form submitted successfully!',
            data: data
        };
    }

    handleSubmitSuccess(formId, response) {
        const formData = this.forms.get(formId);
        if (!formData) return;
        
        // Show success message
        this.showFormSuccess(formData.element, response.message || 'Form submitted successfully!');
        
        // Reset form if needed
        if (formData.element.dataset.resetOnSuccess !== 'false') {
            setTimeout(() => {
                formData.element.reset();
                this.resetForm(formId);
            }, 1500);
        }
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('formSubmitSuccess', {
            detail: { formId, response, form: formData.element }
        }));
        
        // Track analytics
        if (window.portfolioApp && window.portfolioApp.components.analytics) {
            window.portfolioApp.components.analytics.trackEvent('form', 'submit_success', formId);
        }
    }

    handleSubmitError(formId, error) {
        const formData = this.forms.get(formId);
        if (!formData) return;
        
        // Show error message
        const errorMessage = error.message || 'An error occurred. Please try again.';
        this.showFormError(formData.element, errorMessage);
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('formSubmitError', {
            detail: { formId, error, form: formData.element }
        }));
        
        // Track analytics
        if (window.portfolioApp && window.portfolioApp.components.analytics) {
            window.portfolioApp.components.analytics.trackEvent('form', 'submit_error', formId);
        }
    }

    disableForm(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;
        
        formData.fields.forEach(field => {
            field.disabled = true;
        });
        
        formData.element.classList.add('disabled');
    }

    enableForm(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;
        
        formData.fields.forEach(field => {
            field.disabled = false;
        });
        
        formData.element.classList.remove('disabled');
    }

    showLoading(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;
        
        const submitButton = formData.element.querySelector('button[type="submit"]');
        if (submitButton) {
            const originalText = submitButton.innerHTML;
            submitButton.dataset.originalText = originalText;
            submitButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span>Submitting...</span>
            `;
            submitButton.disabled = true;
        }
        
        formData.element.classList.add('loading');
    }

    hideLoading(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;
        
        const submitButton = formData.element.querySelector('button[type="submit"]');
        if (submitButton && submitButton.dataset.originalText) {
            submitButton.innerHTML = submitButton.dataset.originalText;
            delete submitButton.dataset.originalText;
            submitButton.disabled = false;
        }
        
        formData.element.classList.remove('loading');
    }

    showFormSuccess(form, message) {
        // Remove existing messages
        this.clearFormMessages(form);
        
        // Create success message
        const successElement = document.createElement('div');
        successElement.className = 'form-success';
        successElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        form.appendChild(successElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            successElement.classList.add('fade-out');
            setTimeout(() => successElement.remove(), 300);
        }, 5000);
    }

    showFormError(form, message) {
        // Remove existing messages
        this.clearFormMessages(form);
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        form.appendChild(errorElement);
    }

    clearFormMessages(form) {
        const messages = form.querySelectorAll('.form-success, .form-error');
        messages.forEach(message => message.remove());
    }

    resetForm(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;
        
        // Clear all errors
        formData.fields.forEach(field => {
            this.clearFieldError(field);
            field.classList.remove('error', 'success');
        });
        
        // Clear form messages
        this.clearFormMessages(formData.element);
        
        // Reset form state
        formData.element.classList.remove('submitted', 'error', 'success');
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('formReset', {
            detail: { formId, form: formData.element }
        }));
    }

    destroy() {
        // Clean up all forms
        this.forms.forEach((formData, formId) => {
            formData.element.removeEventListener('submit', this.handleSubmit);
        });
        
        this.forms.clear();
        
        console.log('🧹 Form Manager Cleaned Up');
    }
}

// Initialize UI Components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Components will be initialized by PortfolioApp
    console.log('🎨 UI Components Ready for Initialization');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HeaderComponent,
        FooterComponent,
        ScrollManager,
        ModalManager,
        FormManager
    };
}