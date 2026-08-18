// Account POC JS - Compact Digital ID Card System

// Demo NoSQL Dataset for User Account
const DEMO_FAMILY_NOSQL = {
    id: "FAM-2024-0892",
    familyId: "FAM-2024-0892",
    communityName: "St. Anthony Community - Zone 3",
    joinedParishDate: "2012-08-15",
    headOfFamily: "Joseph D'Souza",
    address: "B-402, Sacred Heart CHS, Majiwada, Thane (W)",
    contactPhone: "+91 98201 12345",
    members: [
        {
            id: "mem_01",
            name: "Joseph D'Souza",
            relation: "Head of Family",
            gender: "Male",
            dob: "1978-05-14",
            sacraments: [
                { name: "Baptism", date: "1978-06-10", parish: "St. John the Baptist Church, Thane", icon: "💧", certId: "CERT-BAP-1978-0412" },
                { name: "First Holy Communion", date: "1987-04-19", parish: "St. John the Baptist Church, Thane", icon: "🍞", certId: "CERT-FHC-1987-0189" },
                { name: "Confirmation", date: "1993-11-21", parish: "St. John the Baptist Church, Thane", icon: "🕊️", certId: "CERT-CNF-1993-0304" },
                { name: "Holy Matrimony", date: "2006-01-08", parish: "Our Lady of Fatima Church, Majiwada", icon: "💍", certId: "CERT-MAT-2006-0052" }
            ]
        },
        {
            id: "mem_02",
            name: "Mary D'Souza",
            relation: "Spouse",
            gender: "Female",
            dob: "1982-11-03",
            sacraments: [
                { name: "Baptism", date: "1982-12-05", parish: "St. Michael Church, Mahim", icon: "💧", certId: "CERT-BAP-1982-0881" },
                { name: "First Holy Communion", date: "1991-05-12", parish: "St. Michael Church, Mahim", icon: "🍞", certId: "CERT-FHC-1991-0422" },
                { name: "Confirmation", date: "1997-10-26", parish: "St. Michael Church, Mahim", icon: "🕊️", certId: "CERT-CNF-1997-0915" },
                { name: "Holy Matrimony", date: "2006-01-08", parish: "Our Lady of Fatima Church, Majiwada", icon: "💍", certId: "CERT-MAT-2006-0052" }
            ]
        },
        {
            id: "mem_03",
            name: "Kevin D'Souza",
            relation: "Son",
            gender: "Male",
            dob: "2008-09-22",
            sacraments: [
                { name: "Baptism", date: "2008-10-19", parish: "Our Lady of Fatima Church, Majiwada", icon: "💧", certId: "CERT-BAP-2008-0114" },
                { name: "First Holy Communion", date: "2017-04-30", parish: "Our Lady of Fatima Church, Majiwada", icon: "🍞", certId: "CERT-FHC-2017-0518" },
                { name: "Confirmation", date: "2023-11-12", parish: "Our Lady of Fatima Church, Majiwada", icon: "🕊️", certId: "CERT-CNF-2023-0240" }
            ]
        },
        {
            id: "mem_04",
            name: "Sarah D'Souza",
            relation: "Daughter",
            gender: "Female",
            dob: "2014-03-18",
            sacraments: [
                { name: "Baptism", date: "2014-04-13", parish: "Our Lady of Fatima Church, Majiwada", icon: "💧", certId: "CERT-BAP-2014-0677" },
                { name: "First Holy Communion", date: "2022-05-08", parish: "Our Lady of Fatima Church, Majiwada", icon: "🍞", certId: "CERT-FHC-2022-0310" }
            ]
        }
    ]
};

// Active State
let currentFamilyData = null;
let db = null;

// Firebase Firestore Initializer
function initFirebaseDB() {
    try {
        if (typeof firebase !== 'undefined') {
            let app;
            try {
                app = firebase.initializeApp({ projectId: "olfatimachurch-b8123" });
            } catch (e) {
                app = firebase.app();
            }
            db = firebase.firestore(app);
            if (location.hostname === "localhost") {
                db.useEmulator("localhost", 8080);
            }
        }
    } catch (err) {
        console.warn("Offline or Firebase disconnected. Using local NoSQL data.", err);
    }
}

// Format Date string nicely (e.g. 2012-08-15 -> 15th August 2012)
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const day = date.getDate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
        (day % 10 === 2 && day !== 12) ? "nd" :
        (day % 10 === 3 && day !== 13) ? "rd" : "th";

    return `${day}${suffix} ${month} ${year}`;
}

// Calculate Age from DOB
function calculateAge(dobStr) {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return null;
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Helper to render member avatar initials
function getInitials(name) {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// Helper to render vector SVG icons for Sacraments
function getSacramentIconSvg(sacramentName) {
    const name = (sacramentName || '').toLowerCase();
    if (name.includes('baptism')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
    } else if (name.includes('communion')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10v4a5 5 0 0 1-10 0V3z"/><path d="M12 12v6"/><path d="M8 21h8"/><circle cx="12" cy="3" r="1.5"/></svg>`;
    } else if (name.includes('confirmation')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"/><path d="M12 8L8 4"/><path d="M12 8l4-4"/><path d="M4 13a8 8 0 0 0 16 0"/><line x1="12" y1="13" x2="12" y2="22"/></svg>`;
    } else if (name.includes('matrimony') || name.includes('marriage')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>`;
    }
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M7 7h10"/></svg>`;
}

// Load Family Record (from Firestore if available, else DEMO_FAMILY_NOSQL)
async function loadFamilyRecord(familyId = "FAM-2024-0892") {
    const loadingEl = document.getElementById("account-loading");
    if (loadingEl) loadingEl.style.display = "flex";

    let familyRecord = null;

    if (db) {
        try {
            const docRef = await db.collection("families").doc(familyId).get();
            if (docRef.exists) {
                familyRecord = { id: docRef.id, ...docRef.data() };
            }
        } catch (e) {
            console.log("Firestore fallback to local NoSQL dataset");
        }
    }

    if (!familyRecord) {
        familyRecord = DEMO_FAMILY_NOSQL;
    }

    currentFamilyData = familyRecord;

    if (loadingEl) loadingEl.style.display = "none";
    renderFamilyCard(familyRecord);
}

// Render Front View: Family ID Card
function renderFamilyCard(family) {
    const frontEl = document.getElementById("family-card-front");
    if (!frontEl) return;

    frontEl.innerHTML = `
        <!-- Compact Header Banner -->
        <div class="card-header">
            <div class="header-top-row">
                <span class="card-badge">PARISH FAMILY CARD</span>
                <div class="card-id-pill">
                    <span class="id-label">UNIQUE ID</span>
                    <span class="id-value">${family.familyId}</span>
                </div>
            </div>
            <h2 class="family-head-title">${family.headOfFamily} & Family</h2>
            <div class="community-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${family.communityName}</span>
            </div>
        </div>

        <!-- Meta Details Row -->
        <div class="card-meta-row">
            <div class="meta-item">
                <span class="meta-label">Date Joined Parish</span>
                <span class="meta-value">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    ${formatDate(family.joinedParishDate)}
                </span>
            </div>

            <div class="meta-item">
                <span class="meta-label">Address</span>
                <span class="meta-value">${family.address}</span>
            </div>
        </div>

        <!-- Family Members Vertical List Section -->
        <div class="card-members-section">
            <div class="section-title-bar">
                <h3>Family Members</h3>
                <span class="hint-text">Tap a member to view ID card</span>
            </div>

            <div class="members-vertical-list">
                ${family.members.map(member => `
                    <div class="member-row-item" data-member-id="${member.id}" tabindex="0" role="button" aria-label="View member card for ${member.name}">
                        <div class="member-avatar ${member.gender === 'Female' ? 'female' : 'male'}">
                            ${getInitials(member.name)}
                        </div>
                        <span class="member-name">${member.name}</span>
                        <span class="member-relation-badge">${member.relation}</span>
                        <div class="member-row-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Attach click listeners to member rows
    frontEl.querySelectorAll('.member-row-item').forEach(item => {
        item.addEventListener('click', () => {
            const memberId = item.getAttribute('data-member-id');
            openMemberCard(memberId);
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const memberId = item.getAttribute('data-member-id');
                openMemberCard(memberId);
            }
        });
    });
}

// Render Back View: Member ID Card (Replaces Family Card with Animation)
function openMemberCard(memberId) {
    if (!currentFamilyData || !currentFamilyData.members) return;

    const member = currentFamilyData.members.find(m => m.id === memberId);
    if (!member) return;

    const contentEl = document.getElementById("member-card-content");
    const wrapper = document.getElementById("id-card-wrapper");
    if (!contentEl || !wrapper) return;

    const age = calculateAge(member.dob);
    const sacramentsCount = member.sacraments ? member.sacraments.length : 0;

    contentEl.innerHTML = `
        <!-- Member Profile Header -->
        <div class="member-id-profile-header">
            <div class="member-avatar-lg ${member.gender === 'Female' ? 'female' : 'male'}">
                ${getInitials(member.name)}
            </div>
            <div class="member-details-main">
                <h2>${member.name}</h2>
                <div class="member-tags">
                    <span class="tag-relation">${member.relation}</span>
                    <span class="tag-gender">${member.gender}</span>
                    ${age !== null ? `<span class="tag-age">${age} Yrs</span>` : ''}
                </div>
            </div>
        </div>

        <!-- Meta Cards Grid -->
        <div class="member-id-meta-grid">
            <div class="meta-card">
                <span class="meta-card-label">Date of Birth (DOB)</span>
                <span class="meta-card-value">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    ${formatDate(member.dob)}
                </span>
            </div>
            <div class="meta-card">
                <span class="meta-card-label">Sacraments Received</span>
                <span class="meta-card-value highlight">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" style="vertical-align: middle; margin-right: 4px;"><path d="M12 2v20M7 7h10"/></svg>
                    ${sacramentsCount} Sacraments
                </span>
            </div>
        </div>

        <!-- Sacramental Records Timeline -->
        <div class="member-sacraments-section">
            <h3 class="sacraments-title">Sacramental Records</h3>

            ${member.sacraments && member.sacraments.length > 0 ? `
                <div class="sacraments-timeline">
                    ${member.sacraments.map(sac => `
                        <div class="timeline-item">
                            <div class="timeline-icon">${getSacramentIconSvg(sac.name)}</div>
                            <div class="timeline-content">
                                <div class="sacrament-header">
                                    <h4 class="sacrament-name">${sac.name}</h4>
                                    <span class="sacrament-date">${formatDate(sac.date)}</span>
                                </div>
                                <div class="sacrament-sub-info">
                                    <span class="sacrament-parish">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                        ${sac.parish || 'Our Lady of Fatima Church'}
                                    </span>
                                    ${sac.certId ? `
                                        <span class="cert-id-tag">
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                            Cert ID: ${sac.certId}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="empty-sacraments">
                    <p>No sacramental records recorded yet.</p>
                </div>
            `}
        </div>
    `;

    // Trigger card replace animation
    wrapper.classList.add("show-member");
    
    // Smooth scroll to top of card if needed
    const rect = wrapper.getBoundingClientRect();
    if (rect.top < 0 || rect.top > 100) {
        window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'smooth' });
    }
}

// Return to Family Card
function showFamilyCard() {
    const wrapper = document.getElementById("id-card-wrapper");
    if (wrapper) {
        wrapper.classList.remove("show-member");
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Navbar Hamburger Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Back to Family Card button
    const backBtn = document.getElementById("back-to-family-btn");
    if (backBtn) {
        backBtn.addEventListener("click", showFamilyCard);
    }

    // Keyboard navigation (Escape key returns to Family Card)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            showFamilyCard();
        }
    });
}

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    initFirebaseDB();
    setupEventListeners();
    loadFamilyRecord();
});
