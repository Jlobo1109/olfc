// Website Analytics and Traffic Insights
class WebsiteAnalytics {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        // Initialize Firebase if not already done
        if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
            firebase.initializeApp({ projectId: "olfatimachurch-b8123" });
        }
        
        if (typeof firebase !== 'undefined') {
            this.db = firebase.firestore();
            await this.trackPageView();
        }
    }

    async trackPageView() {
        try {
            const visitorData = await this.getVisitorData();
            const pageData = this.getPageData();
            
            const analyticsData = {
                ...visitorData,
                ...pageData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                sessionId: this.getSessionId(),
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct',
                isNewVisitor: this.isNewVisitor()
            };

            // Store in Firestore
            await this.db.collection('analytics').add(analyticsData);
            
            // Update session data
            this.updateSessionData(analyticsData);
            
        } catch (error) {
            console.error('Error tracking page view:', error);
        }
    }

    async getVisitorData() {
        try {
            // Get IP address using a free IP service
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            
            // Get location data
            const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
            const locationData = await locationResponse.json();
            
            return {
                ipAddress: ipData.ip,
                country: locationData.country_name || 'Unknown',
                region: locationData.region || 'Unknown',
                city: locationData.city || 'Unknown',
                timezone: locationData.timezone || 'Unknown',
                isp: locationData.org || 'Unknown'
            };
        } catch (error) {
            console.error('Error getting visitor data:', error);
            return {
                ipAddress: 'Unknown',
                country: 'Unknown',
                region: 'Unknown',
                city: 'Unknown',
                timezone: 'Unknown',
                isp: 'Unknown'
            };
        }
    }

    getPageData() {
        return {
            page: window.location.pathname,
            pageTitle: document.title,
            url: window.location.href,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            colorDepth: screen.colorDepth,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        };
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    isNewVisitor() {
        const hasVisited = localStorage.getItem('has_visited_olfc');
        if (!hasVisited) {
            localStorage.setItem('has_visited_olfc', 'true');
            return true;
        }
        return false;
    }

    updateSessionData(analyticsData) {
        const sessionData = {
            lastPage: analyticsData.page,
            lastVisit: new Date().toISOString(),
            pageViews: (parseInt(sessionStorage.getItem('page_views') || '0') + 1).toString()
        };
        
        sessionStorage.setItem('page_views', sessionData.pageViews);
        sessionStorage.setItem('last_page', analyticsData.page);
        sessionStorage.setItem('last_visit', sessionData.lastVisit);
    }

    // Track custom events
    async trackEvent(eventName, eventData = {}) {
        try {
            const event = {
                eventName,
                eventData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                sessionId: this.getSessionId(),
                page: window.location.pathname
            };
            
            await this.db.collection('analytics_events').add(event);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    // Track button clicks
    trackButtonClick(buttonName, page) {
        this.trackEvent('button_click', {
            buttonName,
            page
        });
    }

    // Track form submissions
    trackFormSubmission(formName, page) {
        this.trackEvent('form_submission', {
            formName,
            page
        });
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.analytics = new WebsiteAnalytics();
    
    // Track button clicks
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
            const buttonName = button.textContent.trim() || button.getAttribute('aria-label') || 'Unknown Button';
            window.analytics.trackButtonClick(buttonName, window.location.pathname);
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', function(e) {
        const formName = e.target.getAttribute('name') || e.target.id || 'Unknown Form';
        window.analytics.trackFormSubmission(formName, window.location.pathname);
    });
});
