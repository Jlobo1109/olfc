// Firebase Website Integration
// This script loads content from Firestore for the main website

// Firebase Configuration - Browser-compatible approach
// Configuration is loaded from Firebase Hosting or uses fallback values

// Initialize Firebase with configuration
const firebaseConfig = {
    apiKey: "AIzaSyB4VkZb5Avvz6At_umIMNgsw7u0TbBP5VM",
    authDomain: "olfatimachurch-b8123.firebaseapp.com",
    projectId: "olfatimachurch-b8123",
    storageBucket: "olfatimachurch-b8123.firebasestorage.app",
    messagingSenderId: "148360742215",
    appId: "1:148360742215:web:4caac837a9ff30298ef862",
    measurementId: "G-GW38JPL144"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Content loading functions
class WebsiteContentLoader {
    constructor() {
        this.loadingElements = new Set();
    }

    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading-spinner">Loading...</div>';
            this.loadingElements.add(elementId);
        }
    }

    hideLoading(elementId) {
        this.loadingElements.delete(elementId);
    }

    // Load hero content
    async loadHeroContent() {
        try {
            this.showLoading('hero-content');
            const doc = await db.collection('content').doc('hero').get();

            if (doc.exists) {
                const data = doc.data();
                const heroContent = document.getElementById('hero-content');
                if (heroContent) {
                    heroContent.innerHTML = `
                        <h1>${data.title || 'A Community of Faith and Love'}</h1>
                        <div class="hero-buttons">
                            <a href="about.html" class="btn btn-light">Our History</a>
                        </div>
                    `;
                }
            }
            this.hideLoading('hero-content');
        } catch (error) {
            console.error('Error loading hero content:', error);
            this.hideLoading('hero-content');
        }
    }

    // Load welcome content
    async loadWelcomeContent() {
        try {
            this.showLoading('welcome-content');
            const doc = await db.collection('content').doc('welcome').get();

            if (doc.exists) {
                const data = doc.data();
                const welcomeContent = document.getElementById('welcome-content');
                if (welcomeContent) {
                    welcomeContent.innerHTML = `
                        <h2>${data.title || 'Welcome to Our Parish'}</h2>
                        <div class="welcome-text">
                            ${data.content ? data.content.map(paragraph => `<p>${paragraph}</p>`).join('') : ''}
                        </div>
                    `;
                }
            }
            this.hideLoading('welcome-content');
        } catch (error) {
            console.error('Error loading welcome content:', error);
            this.hideLoading('welcome-content');
        }
    }

    // Load events content
    async loadEventsContent() {
        try {
            this.showLoading('events-content');
            const snapshot = await db.collection('events')
                .where('isPublished', '==', true)
                .orderBy('date', 'desc')
                .limit(3)
                .get();

            const events = [];
            snapshot.forEach(doc => {
                events.push({ id: doc.id, ...doc.data() });
            });

            const eventsContent = document.getElementById('events-content');
            if (eventsContent && events.length > 0) {
                eventsContent.innerHTML = `
                    <h2>Events</h2>
                    <div class="event-cards">
                ${events.map(event => {
                    const imageUrl = event.images && event.images.length > 0 ? getImageUrl(event.images[0]) : '';
                    const shortDescription = event.description ? event.description.slice(0, 50) + '...' : '';
                    
                    return `<div class="card">
                    ${imageUrl ? `<img class="event-card" src="${imageUrl}" alt="${event.title}">` : ''}
                    <div class="card-content">
                        <h3>${event.title}</h3>
                        <p>${event.date}</p>
                        <p>${shortDescription}</p>
                    </div>
                </div>`;
                }).join("")}
                </div>`;
            }
            this.hideLoading('events-content');
        } catch (error) {
            console.error('Error loading events content:', error);
            this.hideLoading('events-content');
        }
    }

    // Load all content for homepage
    async loadHomePageContent() {
        await Promise.all([
            this.loadHeroContent(),
            this.loadWelcomeContent(),
            this.loadEventsContent()
        ]);
    }

    // Load about page content
    async loadAboutContent() {
        try {
            this.showLoading('history-content');
            console.log('Loading about content from Firestore...');
            const doc = await db.collection('content').doc('about').get();

            console.log('About document exists:', doc.exists);
            if (doc.exists) {
                const data = doc.data();
                console.log('About data:', data);
                const aboutContent = document.getElementById('history-content');
                if (aboutContent) {
                    aboutContent.innerHTML = `
                        <h2>${data.title || 'Our History'}</h2>
                        <div class="about-content">
                            ${data.content ? data.content.map(paragraph => `<p>${paragraph}</p>`).join('') : ''}
                        </div>
                    `;
                    console.log('About content loaded successfully');
                } else {
                    console.error('Element with ID "history-content" not found');
                }
            } else {
                console.log('No about content found in Firestore');
                const aboutContent = document.getElementById('history-content');
                if (aboutContent) {
                    aboutContent.innerHTML = '<p>No content available</p>';
                }
            }
            this.hideLoading('history-content');
        } catch (error) {
            console.error('Error loading about content:', error);
            this.hideLoading('history-content');
        }
    }

    // Load mass schedule
    async loadMassSchedule() {
        try {
            this.showLoading('mass');
            const doc = await db.collection('content').doc('mass').get();

            if (doc.exists) {
                const data = doc.data();
                const massContent = document.getElementById('mass');
                if (massContent) {
                    massContent.innerHTML = `
                        <h2>${data.title || 'Mass Schedule'}</h2>
                        <table class="mass-schedule-table">
          <tbody>
            <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Details</th>
            </tr>
            ${data.schedule ? data.schedule.map(body => `<tr><td>${body.day}</td><td>${body.time.replace(', ', ',<br>')}</td><td>${body.details}</td></tr>`).join("") : ""}
          </tbody>
        </table>`;
                }
            }
            this.hideLoading('mass');
        } catch (error) {
            console.error('Error loading mass schedule:', error);
            this.hideLoading('mass');
        }
    }

    // Load parish team
    async loadParishTeam() {
        try {
            this.showLoading('parish-team');
            const snapshot = await db.collection('team')
                .orderBy('order', 'asc')
                .get();

            const team = [];
            snapshot.forEach(doc => {
                team.push({ id: doc.id, ...doc.data() });
            });

            const teamContent = document.getElementById('parish-team');
            if (teamContent && team.length > 0) {
                teamContent.innerHTML = `
                    <h2>Parish Team</h2><br>
                    <div class="event-cards">
                    ${team.map(member => `<div class="card">
                        <img class="team-card" src="${member.image ? getImageUrl(member.image) : 'https://media.istockphoto.com/id/587805156/vector/profile-picture-vector-illustration.jpg?s=612x612&w=0&k=20&c=gkvLDCgsHH-8HeQe7JsjhlOY6vRBJk_sKW9lyaLgmLo='}" alt="${member.name}">
                        <div class="card-content">
                            <h3>${member.name}</h3>
                            <p>${member.role}</p>
                            <p>${member.description}</p>
                        </div>
                    </div>`).join("")}
                    </div>`;
            }
            this.hideLoading('parish-team');
        } catch (error) {
            console.error('Error loading parish team:', error);
            this.hideLoading('parish-team');
        }
    }

    // Load communities
    async loadCommunities() {
        try {
            this.showLoading('communities');
            const snapshot = await db.collection('communities')
                .where('isActive', '==', true)
                .get();

            const communities = [];
            snapshot.forEach(doc => {
                communities.push({ id: doc.id, ...doc.data() });
            });

            const communitiesContent = document.getElementById('communities');
            if (communitiesContent && communities.length > 0) {
                communitiesContent.innerHTML = `
                    <h2>Communities</h2>
                    <div class="communities-grid">
                        ${communities.map(community => `
                            <div class="community-card">
                                <h3>${community.name}</h3>
                                <p>${community.description}</p>
                                <p><strong>Contact:</strong> ${community.contact}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            this.hideLoading('communities');
        } catch (error) {
            console.error('Error loading communities:', error);
            this.hideLoading('communities');
        }
    }

    // Load associations
    async loadAssociations() {
        try {
            this.showLoading('associations');
            const snapshot = await db.collection('associations')
                .where('isActive', '==', true)
                .get();

            const associations = [];
            snapshot.forEach(doc => {
                associations.push({ id: doc.id, ...doc.data() });
            });

            const associationsContent = document.getElementById('associations');
            if (associationsContent && associations.length > 0) {
                associationsContent.innerHTML = `
                    <h2>Associations</h2>
                    <div class="associations-grid">
                        ${associations.map(association => `
                            <div class="association-card">
                                <h3>${association.name}</h3>
                                <p>${association.description}</p>
                                <p><strong>Contact:</strong> ${association.contact}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            this.hideLoading('associations');
        } catch (error) {
            console.error('Error loading associations:', error);
            this.hideLoading('associations');
        }
    }
}

// Image URLs from Firebase Storage
const imageUrls = {
    "hero.webp": "https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/hero.webp",
    "team/assistant_priest.webp": "https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/assistant_priest.webp",
    "team/deacon.webp": "https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/deacon.webp",
    "team/parish_priest.webp": "https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/parish_priest.webp",
    "event.jpeg": "https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/event.jpeg",
    "whatsapp-qr.jpeg": "https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/whatsapp-qr.jpeg"
};

// Helper function to get image URL
function getImageUrl(imagePath) {
    return imageUrls[imagePath] || `https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/${imagePath}`;
}

// Auto-load content based on current page
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing content...');
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);

    // Initialize content loader
    const contentLoader = new WebsiteContentLoader();

    switch (currentPage) {
        case 'index.html':
        case '':
            console.log('Loading homepage content...');
            contentLoader.loadHomePageContent();
            break;
        case 'about.html':
            console.log('Loading about content...');
            contentLoader.loadAboutContent();
            contentLoader.loadMassSchedule();
            break;
        case 'parish.html':
            console.log('Loading parish content...');
            contentLoader.loadParishTeam();
            break;
        case 'associations.html':
            console.log('Loading associations content...');
            contentLoader.loadCommunities();
            contentLoader.loadAssociations();
            break;
        default:
            console.log('Unknown page, loading homepage content...');
            contentLoader.loadHomePageContent();
    }
});
