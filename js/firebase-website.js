// Firebase Website Integration
// This script loads content from Firestore for the main website

// Simple Firebase initialization - no exposed configuration
let db;

// Initialize Firebase with minimal configuration
// Firebase Hosting will provide the actual configuration automatically
try {
    // Try to initialize with minimal config
    const app = firebase.initializeApp({
        projectId: "olfatimachurch-b8123"
    });
    db = firebase.firestore(app);
} catch (error) {
    // If already initialized, get the existing app
    const app = firebase.app();
    db = firebase.firestore(app);
}

// Content loading functions
class WebsiteContentLoader {
    constructor() {
        this.loadingElements = new Set();
    }

    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
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

    // Load events content (simple version for homepage)
    async loadEventsContent() {
        try {
            // Check if we're on parish page (articles tab) or homepage (events-content)
            const currentPage = window.location.pathname.split('/').pop();
            const targetElementId = currentPage === 'parish.html' ? 'articles' : 'events-content';
            
            this.showLoading(targetElementId);
            
            const snapshot = await db.collection('events')
                .where('isPublished', '==', true)
                .get();

            
            const events = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                events.push({ id: doc.id, ...data });
            });

            // Sort events by date (newest first) and limit to 3
            events.sort((a, b) => {
                let dateA = a.date;
                let dateB = b.date;
                
                // Handle Timestamp objects
                if (dateA && typeof dateA === 'object' && dateA.seconds) {
                    dateA = new Date(dateA.seconds * 1000);
                }
                if (dateB && typeof dateB === 'object' && dateB.seconds) {
                    dateB = new Date(dateB.seconds * 1000);
                }
                
                // Handle string dates
                if (typeof dateA === 'string') {
                    dateA = new Date(dateA);
                }
                if (typeof dateB === 'string') {
                    dateB = new Date(dateB);
                }
                
                return dateB - dateA; // Newest first
            });
            
            const limitedEvents = events.slice(0, 3);

            const eventsContent = document.getElementById(targetElementId);
            
            if (eventsContent) {
                if (limitedEvents.length > 0) {
                    eventsContent.innerHTML = `
                        <h2>Events</h2>
                        <div class="event-cards">
                    ${limitedEvents.map(event => {
                        const imageUrl = event.images && event.images.length > 0 ? getImageUrl(event.images[0]) : '';
                        
                        return `<div class="card event-card-clickable" onclick="console.log('Event card clicked'); showArticlesTab();">
                        ${imageUrl ? `<img class="event-card" src="${imageUrl}" alt="${event.title}">` : ''}
                        <div class="card-content">
                            <h3>${event.title}</h3>
                        </div>
                    </div>`;
                    }).join("")}
                    </div>`;
                } else {
                    eventsContent.innerHTML = '<h2>Events</h2><p>No events available at the moment.</p>';
                }
            }
            this.hideLoading(targetElementId);
        } catch (error) {
            console.error('Error loading events content:', error);
            const eventsContent = document.getElementById(targetElementId);
            if (eventsContent) {
                eventsContent.innerHTML = '<h2>Events</h2><p>Error loading events. Please try again later.</p>';
            }
            this.hideLoading(targetElementId);
        }
    }

    // Load parish events with advanced features (like parish_content.js)
    async loadParishEvents() {
        try {
            
            const snapshot = await db.collection('events')
                .where('isPublished', '==', true)
                .get();

            
            const events = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                events.push({ id: doc.id, ...data });
            });

            // Sort events by date (newest first)
            events.sort((a, b) => {
                let dateA = a.date;
                let dateB = b.date;
                
                // Handle Timestamp objects
                if (dateA && typeof dateA === 'object' && dateA.seconds) {
                    dateA = new Date(dateA.seconds * 1000);
                }
                if (dateB && typeof dateB === 'object' && dateB.seconds) {
                    dateB = new Date(dateB.seconds * 1000);
                }
                
                // Handle string dates
                if (typeof dateA === 'string') {
                    dateA = new Date(dateA);
                }
                if (typeof dateB === 'string') {
                    dateB = new Date(dateB);
                }
                
                return dateB - dateA; // Newest first
            });

            const articlesContent = document.getElementById('articles');
            if (articlesContent) {
                articlesContent.innerHTML = `
                    <h2>Events</h2>
                    <div class="filter-container">
                        <select id="articleFilter">
                            <option value="All">All events</option>
                            <option value="youth">Youth</option>
                            <option value="catechism">Sunday School</option>
                            <option value="community">Community</option>
                        </select>
                        <select id="monthYearFilter">
                            <option value="All">All months</option>
                        </select>
                    </div>
                    <div class="articles-feed" id="articles-feed"></div>
                `;

                // Store events globally for filtering
                window.parishEvents = events;
                window.filteredArticles = events;

                // Populate month-year filter
                this.populateMonthYearFilter(events);

                // Set up event listeners
                this.setupParishEventListeners();
                
                // Render initial events
                this.renderParishArticles();
                
            }
        } catch (error) {
            console.error('Error loading parish events:', error);
            const articlesContent = document.getElementById('articles');
            if (articlesContent) {
                articlesContent.innerHTML = '<h2>Events</h2><p>Error loading events. Please try again later.</p>';
            }
        }
    }

    populateMonthYearFilter(events) {
        const monthYearFilter = document.getElementById('monthYearFilter');
        if (!monthYearFilter) return;

        // Extract unique month-year combinations from events
        const monthYearMap = new Map();
        
        events.forEach(event => {
            if (event.date) {
                try {
                    const eventDate = new Date(event.date);
                    if (!isNaN(eventDate.getTime())) {
                        const monthYear = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
                        const displayText = eventDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                        });
                        
                        // Use Map to avoid duplicates and count events per month
                        if (!monthYearMap.has(monthYear)) {
                            monthYearMap.set(monthYear, { 
                                value: monthYear, 
                                text: displayText,
                                count: 0 
                            });
                        }
                        monthYearMap.get(monthYear).count++;
                    }
                } catch (error) {
                    console.warn('Invalid date format:', event.date);
                }
            }
        });

        // Convert to array and sort by date (newest first)
        const sortedMonthYears = Array.from(monthYearMap.values()).sort((a, b) => b.value.localeCompare(a.value));

        // Clear existing options except "All months"
        monthYearFilter.innerHTML = '<option value="All">All months</option>';

        // Add month-year options (only months that actually have events)
        sortedMonthYears.forEach(({ value, text, count }) => {
            if (count > 0) { // Only add months that have events
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                monthYearFilter.appendChild(option);
            }
        });
    }

    setupParishEventListeners() {
        const articleFilter = document.getElementById('articleFilter');
        const monthYearFilter = document.getElementById('monthYearFilter');
        
        if (articleFilter) {
            articleFilter.addEventListener('change', () => this.applyParishArticleFilters());
        }
        
        if (monthYearFilter) {
            monthYearFilter.addEventListener('change', () => this.applyParishArticleFilters());
        }
    }

    applyParishArticleFilters() {
        const articleFilter = document.getElementById('articleFilter');
        const monthYearFilter = document.getElementById('monthYearFilter');
        
        const selectedCategory = articleFilter ? articleFilter.value : 'All';
        const selectedMonthYear = monthYearFilter ? monthYearFilter.value : 'All';

        window.filteredArticles = window.parishEvents.filter(event => {
            const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
            
            let matchesMonthYear = true;
            if (selectedMonthYear !== 'All' && event.date) {
                try {
                    const eventDate = new Date(event.date);
                    if (!isNaN(eventDate.getTime())) {
                        const eventMonthYear = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
                        matchesMonthYear = eventMonthYear === selectedMonthYear;
                    } else {
                        matchesMonthYear = false;
                    }
                } catch (error) {
                    matchesMonthYear = false;
                }
            }
            
            return matchesCategory && matchesMonthYear;
        });
        this.renderParishArticles();
    }

    renderParishArticles() {
        const articleContainer = document.getElementById('articles-feed');
        if (!articleContainer) return;

        articleContainer.innerHTML = '';

        if (window.filteredArticles.length === 0) {
            articleContainer.innerHTML = '<p>No matching articles found.</p>';
            return;
        }

        window.filteredArticles.forEach(article => {
            
            const card = document.createElement('div');
            card.classList.add('article-card');
            
            // Format date properly
            let displayDate = article.date;
            if (article.date && typeof article.date === 'object' && article.date.seconds) {
                const date = new Date(article.date.seconds * 1000);
                displayDate = date.toLocaleDateString();
            }

            card.innerHTML = `
                <div class="article-header">
                    <h3>${article.title}</h3>
                    <span class="meta">${displayDate} | ${article.author || 'Parish Office'}</span>
                </div>
                ${article.images && article.images.length > 0 ?
                    `<div class="article-gallery">
                        <span class="gallery-prev">&#10092;</span>
                        ${article.images.map((image, index) => {
                            const imageUrl = getImageUrl(image);
                            return `<img src="${imageUrl}" alt="${article.title}" class="gallery-img ${index === 0 ? 'active' : ''}">`;
                        }).join('')}
                        <span class="gallery-next">&#10093;</span>
                    </div>` : ''
                }
                <div class="article-description">
                    ${this.renderArticleDescription(article.description)}
                    <a href="#" class="read-more">Read more</a>
                </div>
            `;

            articleContainer.appendChild(card);
        });

        // Set up gallery navigation and read more functionality
        this.setupArticleInteractions();
    }

    // Render article description with paragraph support
    renderArticleDescription(description) {
        if (!description) return '<p class="short">No description available</p>';
        
        // Handle both array format (new) and string format (legacy)
        let paragraphs = [];
        if (Array.isArray(description)) {
            paragraphs = description;
        } else {
            // Legacy string format - split into paragraphs
            paragraphs = description
                .split(/\n\s*\n/)
                .map(para => para.trim())
                .filter(para => para.length > 0);
        }
        
        if (paragraphs.length === 0) {
            return '<p class="short">No description available</p>';
        }
        
        // Create short preview (first paragraph, truncated)
        const firstParagraph = paragraphs[0];
        const shortText = firstParagraph.length > 200 ? firstParagraph.substring(0, 200) + '...' : firstParagraph;
        
        // Create full content (all paragraphs)
        const fullContent = paragraphs.map(para => `<p>${para}</p>`).join('');
        
        return `
            <p class="short">${shortText}</p>
            <div class="full hidden">${fullContent}</div>
        `;
    }

    setupArticleInteractions() {
        // Gallery navigation
        document.querySelectorAll('.article-card').forEach(card => {
            const images = card.querySelectorAll('.gallery-img');
            let currentIndex = 0;

            const showImage = (index) => {
                images.forEach((img, i) => img.classList.toggle('active', i === index));
            };

            const prevBtn = card.querySelector('.gallery-prev');
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    showImage(currentIndex);
                });
            }

            const nextBtn = card.querySelector('.gallery-next');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % images.length;
                    showImage(currentIndex);
                });
            }
        });

        // Read more toggle
        document.querySelectorAll('.read-more').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const desc = link.closest('.article-description');
                const short = desc.querySelector('.short');
                const full = desc.querySelector('.full');

                if (full.classList.contains('hidden')) {
                    full.classList.remove('hidden');
                    short.style.display = 'none';
                    link.textContent = 'Read less';
                } else {
                    full.classList.add('hidden');
                    short.style.display = 'block';
                    link.textContent = 'Read more';
                }
            });
        });
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
            const doc = await db.collection('content').doc('about').get();

            if (doc.exists) {
                const data = doc.data();
                const aboutContent = document.getElementById('history-content');
                if (aboutContent) {
                    aboutContent.innerHTML = `
                        <h2>${data.title || 'Our History'}</h2>
                        <div class="about-content">
                            ${data.content ? data.content.map(paragraph => `<p>${paragraph}</p>`).join('') : ''}
                        </div>
                    `;
                } else {
                    console.error('Element with ID "history-content" not found');
                }
            } else {
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
                const data = doc.data();
                team.push({ id: doc.id, ...data });
            });


            const teamContent = document.getElementById('parish-team');
            if (teamContent && team.length > 0) {
                teamContent.innerHTML = `
                    <h2>Parish Team</h2><br>
                    <div class="team-cards">
                    ${team.map(member => {
                        
                        // Try different possible image field names
                        const imagePath = member.image || member.img_url || member.image_url;
                        
                        const imageUrl = imagePath ? getImageUrl(imagePath) : 'https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/default-avatar.webp';
                        
                        
                        return `<div class="card">
                            <img class="team-card" src="${imageUrl}" alt="${member.name}">
                            <div class="card-content">
                                <h3>${member.name}</h3>
                                <p>${member.role || member.title}</p>
                                <p>${member.description || member.desc}</p>
                            </div>
                        </div>`;
                    }).join("")}
                    </div>`;
            } else {
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

            console.log('Communities loaded:', communities.length);

            const communitiesContent = document.getElementById('communities');
            console.log('Communities content element:', communitiesContent);
            
            if (communitiesContent) {
                if (communities.length > 0) {
                    communitiesContent.innerHTML = `
                        <h2>Communities</h2><br>
                        <div class="filter-container">
                            <!-- Search Bar -->
                            <input type="text" id="searchInput" placeholder="Search by name, location, PPC, SCC, NYG...">
                        </div>
                        <div class="community-cards" id="event-cards"></div>
                    `;
                    
                    // Set up the interactive functionality
                    this.setupCommunitiesInteractivity(communities);
                    console.log('Communities HTML set successfully');
                } else {
                    communitiesContent.innerHTML = '<h2>Communities</h2><p>No communities available at the moment.</p>';
                    console.log('No communities found, showing fallback message');
                }
            } else {
                console.error('Communities content element not found!');
            }
            this.hideLoading('communities');
        } catch (error) {
            console.error('Error loading communities:', error);
            this.hideLoading('communities');
        }
    }

    // Load associations content
    async loadAssociations() {
        try {
            console.log('Starting to load associations...');
            const snapshot = await db.collection('associations').orderBy('order', 'asc').get();
            console.log('Firestore query completed, snapshot size:', snapshot.size);
            
            if (snapshot.empty) {
                console.log('No associations found');
                return;
            }

            const associations = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                console.log('Association data:', data);
                if (data.isActive) {
                    associations.push({ id: doc.id, ...data });
                }
            });

            console.log('Associations loaded:', associations.length);
            console.log('Associations data:', associations);
            this.renderAssociations(associations);
        } catch (error) {
            console.error('Error loading associations:', error);
        }
    }

    // Render associations into tabs
    renderAssociations(associations) {
        console.log('Rendering associations:', associations);
        
        // Map association titles to tab IDs
        const tabMapping = {
            'Legion of Mary': 'legion',
            'Altar Servers': 'altar-servers',
            'Lectors Ministry': 'liturgy',
            'Music Ministry': 'music',
            'Eucharistic Ministry': 'eucharistic',
            'Ladies Sodality': 'ladies',
            'Charismatic Prayer Group': 'senior'
        };

        associations.forEach(association => {
            console.log('Processing association:', association.title);
            const tabId = tabMapping[association.title];
            console.log('Tab ID for', association.title, ':', tabId);
            
            if (tabId) {
                const loadingElement = document.getElementById(`${tabId}-loading`);
                const contentElement = document.getElementById(`${tabId}-content`);
                
                console.log('Loading element:', loadingElement);
                console.log('Content element:', contentElement);
                
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                    console.log('Hidden loading for', tabId);
                }
                
                if (contentElement) {
                    contentElement.innerHTML = `<p>${association.description}</p>`;
                    console.log('Set content for', tabId);
                }
            } else {
                console.log('No tab mapping found for:', association.title);
            }
        });
    }

    // Setup communities interactivity
    setupCommunitiesInteractivity(communities) {
        let filteredCommunities = [];
        const searchInput = document.getElementById('searchInput');
        const container = document.getElementById('event-cards');

        // Event listeners for search
        searchInput.addEventListener('input', () => applyFilters());

        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase();

            filteredCommunities = communities.filter(community => {
                const matchesSearch =
                    (community.name && community.name.toLowerCase().includes(searchTerm)) ||
                    (community.location && community.location.toLowerCase().includes(searchTerm)) ||
                    (community.ppc && community.ppc.toLowerCase().includes(searchTerm)) ||
                    (community.scc && community.scc.toLowerCase().includes(searchTerm)) ||
                    (community.nyg && community.nyg.toLowerCase().replace(/['\s]/g, "").includes(searchTerm)) ||
                    (community.societies && community.societies.some(soc => soc.toLowerCase().includes(searchTerm)));

                return matchesSearch;
            });

            renderCards();
        }

        // Render cards in container
        function renderCards() {
            container.innerHTML = ""; // clear old results

            if (filteredCommunities.length === 0) {
                container.innerHTML = "<p>No matching communities found.</p>";
                return;
            }

            filteredCommunities.forEach(community => {
                const card = document.createElement("div");
                card.classList.add("community_card");
                
                card.innerHTML = `
                    <div class="area-card-content">
                        <h3>${community.name || 'Community'}</h3>
                        <p>${community.location || 'Location not specified'}</p>
                        <p><b>PPC - </b>${community.ppc || 'Not specified'}</p>
                        <p><b>SCC - </b>${community.scc || 'Not specified'}</p>
                        <p><b>NYG - </b>${community.nyg || 'Not specified'}</p>
                    </div>
                    <!-- Overlay -->
                    <div class="society-overlay">
                        <h4>Societies</h4>
                        <p>${community.societies && community.societies.length > 0 ? 
                            community.societies.map(name => `${name}`).join("<br>") : 
                            'No societies listed'}</p>
                    </div>`;

                // Toggle overlay on card tap
                card.addEventListener("click", (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    const allCards = document.querySelectorAll(".community_card");

                    // Close all other overlays
                    allCards.forEach(c => {
                        if (c !== card) c.classList.remove("show-overlay");
                    });

                    // Toggle this card's overlay
                    card.classList.toggle("show-overlay");
                });

                container.appendChild(card);
            });

            // Close overlay if user clicks outside
            document.addEventListener("click", (e) => {
                if (!e.target.closest(".community_card")) {
                    document.querySelectorAll(".community_card").forEach(c => c.classList.remove("show-overlay"));
                }
            });
        }

        // Show all by default when page loads
        applyFilters();
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
    
    // If it's already a full URL, return as is
    if (imagePath && imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // If it's a relative path, construct the Firebase Storage URL
    if (imagePath) {
        // Encode the path for Firebase Storage
        const encodedPath = encodeURIComponent(imagePath);
        const fullUrl = `https://firebasestorage.googleapis.com/v0/b/olfatimachurch-b8123.firebasestorage.app/o/${encodedPath}?alt=media`;
        return fullUrl;
    }
    
    // Fallback to default image
    return 'https://firebasestorage.googleapis.com/v0/b/olfatimachurch-b8123.firebasestorage.app/o/images%2Fevent.jpeg?alt=media';
}

// Auto-load content based on current page
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page detected:', currentPage);

    // Initialize content loader
    const contentLoader = new WebsiteContentLoader();

    switch (currentPage) {
        case 'index.html':
        case '':
            contentLoader.loadHomePageContent();
            break;
        case 'about.html':
            contentLoader.loadAboutContent();
            contentLoader.loadMassSchedule();
            break;
        case 'parish.html':
            contentLoader.loadParishTeam();
            contentLoader.loadParishEvents();
            contentLoader.loadCommunities();
            // Check if we need to activate a specific tab after navigation
            const tabToActivate = sessionStorage.getItem('activateTab');
            if (tabToActivate) {
                sessionStorage.removeItem('activateTab');
            }
            break;
        case 'associations.html':
            console.log('Loading associations for associations.html');
            contentLoader.loadAssociations();
            break;
        default:
            contentLoader.loadHomePageContent();
    }
});

// Global function for showing specific tab
function showTab(tabName) {
    console.log('Showing tab:', tabName);
    // Check if we're on the parish page
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);
    console.log('Full pathname:', window.location.pathname);
    
    // Check if we're on parish page or if parish page exists in the current path
    if (currentPage === 'parish.html' || window.location.pathname.includes('parish.html')) {
        console.log('Already on parish page, activating tab');
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => activateTab(tabName));
        } else {
            activateTab(tabName);
        }
    } else {
        console.log('Not on parish page, navigating to parish page');
        // If not on parish page, navigate to parish page and then activate tab
        window.location.href = 'parish.html';
        // Store the tab to activate after navigation
        sessionStorage.setItem('activateTab', tabName);
    }
}

function activateTab(tabName) {
    console.log('Activating tab:', tabName);
    // Find the target tab and activate it
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    console.log('Target tab:', targetTab);
    if (targetTab) {
        console.log('Target tab found:', targetTab);
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-link').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to target tab and content
        targetTab.classList.add('active');
        const targetContent = document.getElementById(tabName);
        console.log('Target content:', targetContent);
        if (targetContent) {
            console.log('Target content found:', targetContent);
            targetContent.classList.add('active');
        }
    }
}

// Function specifically for showing articles tab
function showArticlesTab() {
    console.log('Showing articles tab');
    showTab('articles');
}
