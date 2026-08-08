// Account POC JS - Firebase NoSQL Integration & Sliding Bottom Sheet

// Demo NoSQL Dataset for Firebase Firestore Fallback
const DEMO_FAMILIES_NOSQL = [
    {
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
                    { name: "Baptism", date: "1978-06-10", parish: "St. John the Baptist Church, Thane", icon: "💧" },
                    { name: "First Holy Communion", date: "1987-04-19", parish: "St. John the Baptist Church, Thane", icon: "🍞" },
                    { name: "Confirmation", date: "1993-11-21", parish: "St. John the Baptist Church, Thane", icon: "🕊️" },
                    { name: "Holy Matrimony", date: "2006-01-08", parish: "Our Lady of Fatima Church, Majiwada", icon: "💍" }
                ]
            },
            {
                id: "mem_02",
                name: "Mary D'Souza",
                relation: "Spouse",
                gender: "Female",
                dob: "1982-11-03",
                sacraments: [
                    { name: "Baptism", date: "1982-12-05", parish: "St. Michael Church, Mahim", icon: "💧" },
                    { name: "First Holy Communion", date: "1991-05-12", parish: "St. Michael Church, Mahim", icon: "🍞" },
                    { name: "Confirmation", date: "1997-10-26", parish: "St. Michael Church, Mahim", icon: "🕊️" },
                    { name: "Holy Matrimony", date: "2006-01-08", parish: "Our Lady of Fatima Church, Majiwada", icon: "💍" }
                ]
            },
            {
                id: "mem_03",
                name: "Kevin D'Souza",
                relation: "Son",
                gender: "Male",
                dob: "2008-09-22",
                sacraments: [
                    { name: "Baptism", date: "2008-10-19", parish: "Our Lady of Fatima Church, Majiwada", icon: "💧" },
                    { name: "First Holy Communion", date: "2017-04-30", parish: "Our Lady of Fatima Church, Majiwada", icon: "🍞" },
                    { name: "Confirmation", date: "2023-11-12", parish: "Our Lady of Fatima Church, Majiwada", icon: "🕊️" }
                ]
            },
            {
                id: "mem_04",
                name: "Sarah D'Souza",
                relation: "Daughter",
                gender: "Female",
                dob: "2014-03-18",
                sacraments: [
                    { name: "Baptism", date: "2014-04-13", parish: "Our Lady of Fatima Church, Majiwada", icon: "💧" },
                    { name: "First Holy Communion", date: "2022-05-08", parish: "Our Lady of Fatima Church, Majiwada", icon: "🍞" }
                ]
            }
        ]
    },
    {
        id: "FAM-2021-0415",
        familyId: "FAM-2021-0415",
        communityName: "St. Francis Xavier Community - Zone 1",
        joinedParishDate: "2018-03-20",
        headOfFamily: "Francis Fernandes",
        address: "A-101, Fatima Heights, Majiwada, Thane (W)",
        contactPhone: "+91 98192 88776",
        members: [
            {
                id: "mem_05",
                name: "Francis Fernandes",
                relation: "Head of Family",
                gender: "Male",
                dob: "1975-01-30",
                sacraments: [
                    { name: "Baptism", date: "1975-02-28", parish: "Holy Cross Church, Kurla", icon: "💧" },
                    { name: "First Holy Communion", date: "1984-05-06", parish: "Holy Cross Church, Kurla", icon: "🍞" },
                    { name: "Confirmation", date: "1990-12-16", parish: "Holy Cross Church, Kurla", icon: "🕊️" },
                    { name: "Holy Matrimony", date: "2003-12-28", parish: "Our Lady of Fatima Church, Majiwada", icon: "💍" }
                ]
            },
            {
                id: "mem_06",
                name: "Anita Fernandes",
                relation: "Spouse",
                gender: "Female",
                dob: "1979-08-12",
                sacraments: [
                    { name: "Baptism", date: "1979-09-09", parish: "St. Andrew Church, Bandra", icon: "💧" },
                    { name: "First Holy Communion", date: "1988-04-24", parish: "St. Andrew Church, Bandra", icon: "🍞" },
                    { name: "Confirmation", date: "1994-11-20", parish: "St. Andrew Church, Bandra", icon: "🕊️" },
                    { name: "Holy Matrimony", date: "2003-12-28", parish: "Our Lady of Fatima Church, Majiwada", icon: "💍" }
                ]
            },
            {
                id: "mem_07",
                name: "Aaron Fernandes",
                relation: "Son",
                gender: "Male",
                dob: "2005-11-05",
                sacraments: [
                    { name: "Baptism", date: "2005-12-11", parish: "Our Lady of Fatima Church, Majiwada", icon: "💧" },
                    { name: "First Holy Communion", date: "2014-05-04", parish: "Our Lady of Fatima Church, Majiwada", icon: "🍞" },
                    { name: "Confirmation", date: "2021-10-24", parish: "Our Lady of Fatima Church, Majiwada", icon: "🕊️" }
                ]
            }
        ]
    }
];

// Active State
let currentFamilyData = null;
let currentSelectedMember = null;
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
        console.warn("Firebase not connected or running offline. Falling back to Demo NoSQL Dataset.", err);
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

// Render Family Selector Buttons
function renderFamilySelector() {
    const container = document.getElementById("family-selector-options");
    if (!container) return;

    container.innerHTML = DEMO_FAMILIES_NOSQL.map((fam, idx) => `
        <button class="selector-btn ${idx === 0 ? 'active' : ''}" data-fam-id="${fam.familyId}">
            <span class="btn-fam-id">${fam.familyId}</span>
            <span class="btn-fam-head">${fam.headOfFamily}</span>
        </button>
    `).join('');

    container.querySelectorAll('.selector-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            container.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const famId = btn.getAttribute('data-fam-id');
            loadFamilyRecord(famId);
        });
    });
}

// Load Family Record (from Firestore NoSQL if available, else Demo data)
async function loadFamilyRecord(familyId) {
    const loadingEl = document.getElementById("account-loading");
    const containerEl = document.getElementById("family-card-container");
    if (loadingEl) loadingEl.style.display = "flex";

    let familyRecord = null;

    if (db) {
        try {
            const docRef = await db.collection("families").doc(familyId).get();
            if (docRef.exists) {
                familyRecord = { id: docRef.id, ...docRef.data() };
            }
        } catch (e) {
            console.log("Firestore fetch fallback to local NoSQL dataset");
        }
    }

    if (!familyRecord) {
        familyRecord = DEMO_FAMILIES_NOSQL.find(f => f.familyId === familyId) || DEMO_FAMILIES_NOSQL[0];
    }

    currentFamilyData = familyRecord;

    if (loadingEl) loadingEl.style.display = "none";
    renderFamilyCard(familyRecord);
}

// Render Family Card UI
function renderFamilyCard(family) {
    const container = document.getElementById("family-card-container");
    if (!container) return;

    const memberCount = family.members ? family.members.length : 0;

    container.innerHTML = `
        <div class="family-card">
            <!-- Header Banner -->
            <div class="card-header">
                <div class="card-title-group">
                    <span class="card-badge">Family Card</span>
                    <h2 class="family-head-title">${family.headOfFamily} & Family</h2>
                    <div class="community-tag">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>${family.communityName}</span>
                    </div>
                </div>

                <div class="card-id-pill">
                    <span class="id-label">UNIQUE FAMILY ID</span>
                    <span class="id-value">${family.familyId}</span>
                </div>
            </div>

            <!-- Meta Stats Row -->
            <div class="card-meta-row">
                <div class="meta-item">
                    <span class="meta-label">Date Joined Parish</span>
                    <span class="meta-value">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${formatDate(family.joinedParishDate)}
                    </span>
                </div>

                <div class="meta-item">
                    <span class="meta-label">Parish Address</span>
                    <span class="meta-value">${family.address}</span>
                </div>

                <div class="meta-item">
                    <span class="meta-label">Registered Members</span>
                    <span class="meta-value badge-count">${memberCount} Members</span>
                </div>
            </div>

            <!-- Members Section -->
            <div class="card-members-section">
                <div class="section-title-bar">
                    <h3>Family Members</h3>
                    <span class="hint-text">💡 Tap any member to view Sacraments & Info</span>
                </div>

                <div class="members-grid">
                    ${family.members.map(member => `
                        <div class="member-card-item" data-member-id="${member.id}" tabindex="0" role="button" aria-label="View info for ${member.name}">
                            <div class="member-avatar ${member.gender === 'Female' ? 'female' : 'male'}">
                                ${getInitials(member.name)}
                            </div>
                            <div class="member-info-preview">
                                <span class="member-name">${member.name}</span>
                                <span class="member-relation-badge">${member.relation}</span>
                            </div>
                            <div class="member-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Attach click event handlers for member cards
    container.querySelectorAll('.member-card-item').forEach(item => {
        item.addEventListener('click', () => {
            const memberId = item.getAttribute('data-member-id');
            openMemberSheet(memberId);
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const memberId = item.getAttribute('data-member-id');
                openMemberSheet(memberId);
            }
        });
    });
}

// Open Bottom Sliding Sheet for Member Sacraments & Info
function openMemberSheet(memberId) {
    if (!currentFamilyData || !currentFamilyData.members) return;

    const member = currentFamilyData.members.find(m => m.id === memberId);
    if (!member) return;

    currentSelectedMember = member;

    const sheetContent = document.getElementById("sheet-content");
    const backdrop = document.getElementById("bottom-sheet-backdrop");
    const sheet = document.getElementById("bottom-sheet");

    if (!sheetContent || !backdrop || !sheet) return;

    const age = calculateAge(member.dob);
    const sacramentsCount = member.sacraments ? member.sacraments.length : 0;

    sheetContent.innerHTML = `
        <div class="sheet-member-header">
            <div class="sheet-avatar ${member.gender === 'Female' ? 'female' : 'male'}">
                ${getInitials(member.name)}
            </div>
            <div class="sheet-member-title">
                <h2 id="member-modal-name">${member.name}</h2>
                <div class="sheet-tags">
                    <span class="relation-tag">${member.relation}</span>
                    <span class="gender-tag">${member.gender}</span>
                    ${age !== null ? `<span class="age-tag">${age} Years Old</span>` : ''}
                </div>
            </div>
        </div>

        <div class="sheet-info-grid">
            <div class="sheet-info-card">
                <span class="info-label">Date of Birth (DOB)</span>
                <span class="info-value">
                    🎂 ${formatDate(member.dob)}
                </span>
            </div>
            <div class="sheet-info-card">
                <span class="info-label">Sacraments Completed</span>
                <span class="info-value highlight">
                    ✝️ ${sacramentsCount} Sacraments
                </span>
            </div>
        </div>

        <div class="sheet-sacraments-section">
            <h3>Sacramental Records & Timeline</h3>
            
            ${member.sacraments && member.sacraments.length > 0 ? `
                <div class="sacraments-timeline">
                    ${member.sacraments.map(sac => `
                        <div class="timeline-item">
                            <div class="timeline-icon">${sac.icon || '✝️'}</div>
                            <div class="timeline-content">
                                <div class="sacrament-header">
                                    <h4 class="sacrament-name">${sac.name}</h4>
                                    <span class="sacrament-date">${formatDate(sac.date)}</span>
                                </div>
                                <div class="sacrament-parish">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                    <span>${sac.parish || 'Our Lady of Fatima Church'}</span>
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

    // Show backdrop & slide sheet up from bottom
    backdrop.classList.add("active");
    sheet.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent scrolling behind sheet
}

// Close Bottom Sheet Modal
function closeMemberSheet() {
    const backdrop = document.getElementById("bottom-sheet-backdrop");
    const sheet = document.getElementById("bottom-sheet");

    if (sheet) sheet.classList.remove("open");
    if (backdrop) backdrop.classList.remove("active");

    document.body.style.overflow = ""; // Restore body scrolling
}

// Bind Global UI Listeners & Hamburger Toggle
function setupEventListeners() {
    // Menu Toggle (Hamburger)
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Sheet close button
    const closeBtn = document.getElementById("sheet-close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeMemberSheet);
    }

    // Backdrop click close
    const backdrop = document.getElementById("bottom-sheet-backdrop");
    if (backdrop) {
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) {
                closeMemberSheet();
            }
        });
    }

    // Escape key press to close sheet
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMemberSheet();
        }
    });

    // Touch Swipe Down support to dismiss bottom sheet on mobile devices
    const sheet = document.getElementById("bottom-sheet");
    let touchStartY = 0;
    let touchCurrentY = 0;

    if (sheet) {
        sheet.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        sheet.addEventListener('touchmove', (e) => {
            touchCurrentY = e.touches[0].clientY;
            const diffY = touchCurrentY - touchStartY;
            if (diffY > 0 && sheet.scrollTop <= 0) {
                sheet.style.transform = `translateY(${diffY}px)`;
            }
        }, { passive: true });

        sheet.addEventListener('touchend', () => {
            const diffY = touchCurrentY - touchStartY;
            sheet.style.transform = '';
            if (diffY > 100) {
                closeMemberSheet();
            }
            touchStartY = 0;
            touchCurrentY = 0;
        });
    }
}

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    initFirebaseDB();
    renderFamilySelector();
    setupEventListeners();
    loadFamilyRecord(DEMO_FAMILIES_NOSQL[0].familyId);
});
