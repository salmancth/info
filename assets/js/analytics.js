/**
 * Analytics Manager
 * Handles tracking user interactions, page views, and performance metrics
 */

class AnalyticsManager {
    constructor(debug = false) {
        this.debug = debug;
        this.config = {
            enabled: true,
            trackPageViews: true,
            trackEvents: true,
            trackErrors: true,
            trackPerformance: true,
            anonymizeIP: true,
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            localStorageKey: 'portfolio_analytics',
            endpoint: null // Set if using custom analytics endpoint
        };
        
        this.session = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: 0,
            events: [],
            lastActivity: Date.now()
        };
        
        this.user = {
            id: this.getOrCreateUserId(),
            firstVisit: this.getFirstVisitDate(),
            lastVisit: Date.now(),
            visits: this.getVisitCount(),
            preferences: {}
        };
        
        this.queue = [];
        this.isSending = false;
        
        // Page metadata
        this.page = {
            url: window.location.href,
            path: window.location.pathname,
            referrer: document.referrer,
            title: document.title,
            loadTime: null
        };
    }

    init() {
        if (!this.config.enabled) {
            console.log('📊 Analytics disabled');
            return;
        }
        
        console.log('🔧 Initializing Analytics Manager...');
        
        this.setupEventListeners();
        this.setupSessionManagement();
        this.trackInitialPageView();
        this.setupPerformanceTracking();
        this.setupErrorTracking();
        
        // Process any queued events
        this.processQueue();
        
        console.log('✅ Analytics Manager Initialized');
        console.log(`👤 User ID: ${this.user.id}`);
        console.log(`📅 First visit: ${new Date(this.user.firstVisit).toLocaleDateString()}`);
        console.log(`🔄 Visit count: ${this.user.visits}`);
    }

    setupEventListeners() {
        // Track clicks on external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
                this.trackOutboundLink(link);
            }
        });
        
        // Track downloads
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[download]');
            if (link) {
                this.trackDownload(link);
            }
        });
        
        // Track form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.trackFormSubmit(e.target);
            }
        });
        
        // Track social media clicks
        document.addEventListener('click', (e) => {
            const socialLink = e.target.closest('a[href*="linkedin"], a[href*="github"], a[href*="twitter"], a[href*="facebook"]');
            if (socialLink) {
                this.trackSocialClick(socialLink);
            }
        });
        
        // Update last activity on user interaction
        ['click', 'scroll', 'keydown', 'mousemove'].forEach(eventType => {
            window.addEventListener(eventType, () => {
                this.session.lastActivity = Date.now();
            }, { passive: true });
        });
    }

    setupSessionManagement() {
        // Check session expiration
        setInterval(() => {
            const timeSinceLastActivity = Date.now() - this.session.lastActivity;
            
            if (timeSinceLastActivity > this.config.sessionTimeout) {
                this.endSession();
                this.startNewSession();
            }
        }, 60000); // Check every minute
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('session', 'page_hidden');
            } else {
                this.trackEvent('session', 'page_visible');
                this.session.lastActivity = Date.now();
            }
        });
        
        // Handle beforeunload
        window.addEventListener('beforeunload', () => {
            this.endSession();
            this.flushQueue();
        });
    }

    setupPerformanceTracking() {
        if (!this.config.trackPerformance) return;
        
        window.addEventListener('load', () => {
            // Use Performance API if available
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                if (perfData) {
                    const metrics = {
                        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
                        tcp: perfData.connectEnd - perfData.connectStart,
                        request: perfData.responseEnd - perfData.requestStart,
                        response: perfData.responseEnd - perfData.responseStart,
                        domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        load: perfData.loadEventEnd - perfData.loadEventStart,
                        total: perfData.loadEventEnd - perfData.startTime
                    };
                    
                    this.page.loadTime = metrics.total;
                    
                    this.trackPerformance(metrics);
                }
            }
            
            // Fallback: measure load time manually
            if (!this.page.loadTime) {
                const now = Date.now();
                const loadTime = now - performance.timing.navigationStart;
                this.page.loadTime = loadTime;
                
                this.trackPerformance({ total: loadTime });
            }
        }, { once: true });
    }

    setupErrorTracking() {
        if (!this.config.trackErrors) return;
        
        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            this.trackError({
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });
        });
        
        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackError({
                type: 'unhandledrejection',
                reason: e.reason
            });
        });
        
        // Track console errors
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.trackError({
                type: 'console_error',
                message: args.join(' ')
            });
            originalConsoleError.apply(console, args);
        };
    }

    trackInitialPageView() {
        if (!this.config.trackPageViews) return;
        
        // Update visit count
        this.user.visits++;
        this.user.lastVisit = Date.now();
        this.saveUserData();
        
        // Track page view
        this.trackPageView(this.page.path, this.page.referrer);
    }

    // Core tracking methods
    trackPageView(path, referrer) {
        if (!this.config.trackPageViews) return;
        
        const event = {
            type: 'pageview',
            timestamp: Date.now(),
            data: {
                path: path || this.page.path,
                referrer: referrer || this.page.referrer,
                title: this.page.title,
                sessionId: this.session.id,
                userId: this.user.id
            }
        };
        
        this.session.pageViews++;
        this.queueEvent(event);
        
        if (this.debug) {
            console.log('📄 Page View:', event.data);
        }
        
        // Send to analytics endpoint if configured
        this.sendToEndpoint(event);
    }

    trackEvent(category, action, label = null, value = null) {
        if (!this.config.trackEvents) return;
        
        const event = {
            type: 'event',
            timestamp: Date.now(),
            data: {
                category,
                action,
                label,
                value,
                path: this.page.path,
                sessionId: this.session.id,
                userId: this.user.id
            }
        };
        
        this.session.events.push(event);
        this.queueEvent(event);
        
        if (this.debug) {
            console.log('🎯 Event:', event.data);
        }
        
        // Send to analytics endpoint if configured
        this.sendToEndpoint(event);
    }

    trackPerformance(metrics) {
        if (!this.config.trackPerformance) return;
        
        const event = {
            type: 'performance',
            timestamp: Date.now(),
            data: {
                metrics,
                path: this.page.path,
                sessionId: this.session.id,
                userId: this.user.id
            }
        };
        
        this.queueEvent(event);
        
        if (this.debug) {
            console.log('⚡ Performance:', metrics);
        }
        
        // Send to analytics endpoint if configured
        this.sendToEndpoint(event);
    }

    trackError(error) {
        if (!this.config.trackErrors) return;
        
        const event = {
            type: 'error',
            timestamp: Date.now(),
            data: {
                error: {
                    message: error.message || String(error),
                    type: error.type || 'javascript',
                    stack: error.error ? error.error.stack : null,
                    filename: error.filename,
                    lineno: error.lineno,
                    colno: error.colno
                },
                path: this.page.path,
                sessionId: this.session.id,
                userId: this.user.id
            }
        };
        
        this.queueEvent(event);
        
        if (this.debug) {
            console.error('❌ Error tracked:', error);
        }
        
        // Send to analytics endpoint if configured
        this.sendToEndpoint(event);
    }

    // Specific event tracking
    trackOutboundLink(link) {
        const url = link.href;
        const text = link.textContent.trim() || link.getAttribute('aria-label') || 'Unknown';
        
        this.trackEvent('outbound', 'click', text, url);
        
        // Add delay to ensure tracking is sent
        setTimeout(() => {
            window.location.href = url;
        }, 150);
    }

    trackDownload(link) {
        const filename = link.getAttribute('download') || 'unknown';
        const url = link.href;
        
        this.trackEvent('download', 'click', filename, url);
    }

    trackFormSubmit(form) {
        const formId = form.id || form.name || 'unknown';
        const fields = Array.from(form.elements)
            .filter(el => el.name && (el.type !== 'submit' && el.type !== 'button'))
            .map(el => ({
                name: el.name,
                type: el.type,
                value: el.type === 'password' ? '***' : el.value
            }));
        
        this.trackEvent('form', 'submit', formId, {
            fieldCount: fields.length,
            fields: this.config.anonymizeIP ? fields.map(f => ({ ...f, value: '***' })) : fields
        });
    }

    trackSocialClick(link) {
        const url = link.href;
        let platform = 'unknown';
        
        if (url.includes('linkedin')) platform = 'linkedin';
        else if (url.includes('github')) platform = 'github';
        else if (url.includes('twitter')) platform = 'twitter';
        else if (url.includes('facebook')) platform = 'facebook';
        
        this.trackEvent('social', 'click', platform, url);
    }

    // Session management
    startNewSession() {
        this.session = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: 0,
            events: [],
            lastActivity: Date.now()
        };
        
        this.trackEvent('session', 'start');
        
        if (this.debug) {
            console.log('🔄 New session started:', this.session.id);
        }
    }

    endSession() {
        const duration = Date.now() - this.session.startTime;
        
        this.trackEvent('session', 'end', null, {
            duration,
            pageViews: this.session.pageViews,
            eventCount: this.session.events.length
        });
        
        if (this.debug) {
            console.log('🔚 Session ended:', {
                duration: `${Math.round(duration / 1000)}s`,
                pageViews: this.session.pageViews,
                events: this.session.events.length
            });
        }
    }

    // Queue management
    queueEvent(event) {
        this.queue.push(event);
        
        // If queue gets too large, process it
        if (this.queue.length > 50) {
            this.processQueue();
        }
        
        // Also save to localStorage for persistence
        this.saveToLocalStorage();
    }

    async processQueue() {
        if (this.isSending || this.queue.length === 0) return;
        
        this.isSending = true;
        
        try {
            // Process events in batches
            const batchSize = 10;
            const batch = this.queue.splice(0, batchSize);
            
            // Here you would typically send to your analytics server
            // For now, we'll just log them in debug mode
            if (this.debug && batch.length > 0) {
                console.log(`📦 Processing ${batch.length} analytics events`);
            }
            
            // Clear processed events from localStorage
            this.saveToLocalStorage();
            
        } catch (error) {
            console.error('Failed to process analytics queue:', error);
            
            // Put events back in queue
            this.queue.unshift(...batch);
        } finally {
            this.isSending = false;
            
            // Process next batch if any
            if (this.queue.length > 0) {
                setTimeout(() => this.processQueue(), 1000);
            }
        }
    }

    flushQueue() {
        // Try to send all remaining events
        if (this.queue.length > 0 && navigator.sendBeacon) {
            const data = JSON.stringify({
                events: this.queue,
                sessionId: this.session.id,
                userId: this.user.id
            });
            
            if (this.config.endpoint) {
                navigator.sendBeacon(this.config.endpoint, data);
            }
            
            this.queue = [];
            this.clearLocalStorage();
        }
    }

    // User management
    getOrCreateUserId() {
        let userId = localStorage.getItem('portfolio_user_id');
        
        if (!userId) {
            userId = this.generateUserId();
            localStorage.setItem('portfolio_user_id', userId);
        }
        
        return userId;
    }

    getFirstVisitDate() {
        const firstVisit = localStorage.getItem('portfolio_first_visit');
        
        if (!firstVisit) {
            const now = Date.now();
            localStorage.setItem('portfolio_first_visit', now);
            return now;
        }
        
        return parseInt(firstVisit);
    }

    getVisitCount() {
        const visits = localStorage.getItem('portfolio_visit_count');
        return visits ? parseInt(visits) : 0;
    }

    saveUserData() {
        localStorage.setItem('portfolio_visit_count', this.user.visits.toString());
        localStorage.setItem('portfolio_last_visit', this.user.lastVisit.toString());
    }

    // Local storage management
    saveToLocalStorage() {
        try {
            const data = {
                queue: this.queue,
                session: this.session,
                user: this.user,
                timestamp: Date.now()
            };
            
            localStorage.setItem(this.config.localStorageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save analytics data to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const data = JSON.parse(localStorage.getItem(this.config.localStorageKey));
            
            if (data && data.timestamp) {
                // Only load data from last 24 hours
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    this.queue = data.queue || [];
                    this.session = data.session || this.session;
                    this.user = data.user || this.user;
                    
                    if (this.debug && this.queue.length > 0) {
                        console.log(`📥 Loaded ${this.queue.length} queued events from localStorage`);
                    }
                } else {
                    this.clearLocalStorage();
                }
            }
        } catch (error) {
            console.warn('Failed to load analytics data from localStorage:', error);
        }
    }

    clearLocalStorage() {
        try {
            localStorage.removeItem(this.config.localStorageKey);
        } catch (error) {
            console.warn('Failed to clear analytics data from localStorage:', error);
        }
    }

    // ID generation
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Analytics endpoint integration
    async sendToEndpoint(event) {
        if (!this.config.endpoint) return;
        
        try {
            // Prepare data
            const data = {
                event,
                userAgent: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            
            // Anonymize IP if configured
            if (this.config.anonymizeIP) {
                data.ip = 'anonymized';
            }
            
            // Send via fetch (with fallback to sendBeacon)
            if (navigator.sendBeacon) {
                navigator.sendBeacon(this.config.endpoint, JSON.stringify(data));
            } else {
                await fetch(this.config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    keepalive: true // Keep request alive for page unload
                });
            }
        } catch (error) {
            if (this.debug) {
                console.warn('Failed to send analytics event to endpoint:', error);
            }
        }
    }

    // Analytics reporting
    getSessionReport() {
        return {
            sessionId: this.session.id,
            duration: Date.now() - this.session.startTime,
            pageViews: this.session.pageViews,
            events: this.session.events.length,
            user: {
                id: this.user.id,
                visits: this.user.visits,
                firstVisit: new Date(this.user.firstVisit).toISOString(),
                lastVisit: new Date(this.user.lastVisit).toISOString()
            }
        };
    }

    getEventSummary(category = null) {
        let events = this.session.events;
        
        if (category) {
            events = events.filter(event => event.data.category === category);
        }
        
        const summary = {};
        events.forEach(event => {
            const key = `${event.data.category}.${event.data.action}`;
            summary[key] = (summary[key] || 0) + 1;
        });
        
        return summary;
    }

    // Opt-in/opt-out functionality
    enableAnalytics() {
        this.config.enabled = true;
        localStorage.setItem('portfolio_analytics_enabled', 'true');
        this.init();
        
        this.trackEvent('analytics', 'enabled');
    }

    disableAnalytics() {
        this.config.enabled = false;
        localStorage.setItem('portfolio_analytics_enabled', 'false');
        
        // Clear all analytics data
        this.queue = [];
        this.clearLocalStorage();
        
        this.trackEvent('analytics', 'disabled');
    }

    isAnalyticsEnabled() {
        const savedSetting = localStorage.getItem('portfolio_analytics_enabled');
        return savedSetting !== 'false';
    }

    // Privacy compliance
    anonymizeData(data) {
        if (!this.config.anonymizeIP) return data;
        
        const anonymized = { ...data };
        
        // Remove or hash personally identifiable information
        if (anonymized.ip) {
            anonymized.ip = 'anonymized';
        }
        
        if (anonymized.userAgent) {
            // Remove detailed browser/OS info
            anonymized.userAgent = anonymized.userAgent.split(' ')[0];
        }
        
        return anonymized;
    }

    // GDPR/CCPA compliance
    exportUserData() {
        return {
            user: this.user,
            sessions: [this.getSessionReport()],
            events: this.session.events,
            collectedAt: new Date().toISOString()
        };
    }

    deleteUserData() {
        // Clear all user data
        localStorage.removeItem('portfolio_user_id');
        localStorage.removeItem('portfolio_first_visit');
        localStorage.removeItem('portfolio_visit_count');
        localStorage.removeItem('portfolio_last_visit');
        localStorage.removeItem('portfolio_analytics');
        localStorage.removeItem('portfolio_analytics_enabled');
        
        // Reset user data
        this.user = {
            id: this.generateUserId(),
            firstVisit: Date.now(),
            lastVisit: Date.now(),
            visits: 1,
            preferences: {}
        };
        
        // Start new session
        this.startNewSession();
        
        console.log('🗑️ All user analytics data deleted');
    }

    destroy() {
        // End current session
        this.endSession();
        
        // Flush remaining events
        this.flushQueue();
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        
        console.log('🧹 Analytics Manager Cleaned Up');
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if analytics should be enabled
    const analyticsEnabled = localStorage.getItem('portfolio_analytics_enabled') !== 'false';
    
    if (analyticsEnabled) {
        // Initialize analytics manager
        const debugMode = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
        
        window.analyticsManager = new AnalyticsManager(debugMode);
        window.analyticsManager.init();
        
        // Make analytics helper functions available
        window.trackEvent = function(category, action, label, value) {
            if (window.analyticsManager) {
                window.analyticsManager.trackEvent(category, action, label, value);
            }
        };
        
        console.log('📊 Analytics helper available as window.trackEvent(category, action, label, value)');
    } else {
        console.log('📊 Analytics disabled by user preference');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsManager;
}