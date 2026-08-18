// Account POC JS - Compact Digital ID Card System & Parishioner Portal

// Demo NoSQL Dataset for User Account
const DEMO_FAMILY_NOSQL = {
    id: "FAM-2024-0892",
    familyId: "FAM-2024-0892",
    communityName: "St. Anthony Community - Zone 3",
    joinedParishDate: "2012-08-15",
    headOfFamily: "Joseph D'Souza",
    address: "B-402, Sacred Heart CHS, Majiwada, Thane (W)",
    contactPhone: "+91 98201 12345",
    email: "joseph.dsouza@example.com",
    members: [
        {
            id: "mem_01",
            name: "Joseph D'Souza",
            relation: "Head of Family",
            gender: "Male",
            dob: "1978-05-14",
            sacraments: [
                { name: "Baptism", date: "1978-06-10", parish: "St. John the Baptist Church, Thane", certId: "CERT-BAP-1978-0412" },
                { name: "First Holy Communion", date: "1987-04-19", parish: "St. John the Baptist Church, Thane", certId: "CERT-FHC-1987-0189" },
                { name: "Confirmation", date: "1993-11-21", parish: "St. John the Baptist Church, Thane", certId: "CERT-CNF-1993-0304" },
                { name: "Holy Matrimony", date: "2006-01-08", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-MAT-2006-0052" }
            ]
        },
        {
            id: "mem_02",
            name: "Mary D'Souza",
            relation: "Spouse",
            gender: "Female",
            dob: "1982-11-03",
            sacraments: [
                { name: "Baptism", date: "1982-12-05", parish: "St. Michael Church, Mahim", certId: "CERT-BAP-1982-0881" },
                { name: "First Holy Communion", date: "1991-05-12", parish: "St. Michael Church, Mahim", certId: "CERT-FHC-1991-0422" },
                { name: "Confirmation", date: "1997-10-26", parish: "St. Michael Church, Mahim", certId: "CERT-CNF-1997-0915" },
                { name: "Holy Matrimony", date: "2006-01-08", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-MAT-2006-0052" }
            ]
        },
        {
            id: "mem_03",
            name: "Kevin D'Souza",
            relation: "Son",
            gender: "Male",
            dob: "2010-09-22",
            sacraments: [
                { name: "Baptism", date: "2010-10-19", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-2010-0114" },
                { name: "First Holy Communion", date: "2019-04-30", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-FHC-2019-0518" }
            ]
        },
        {
            id: "mem_04",
            name: "Sarah D'Souza",
            relation: "Daughter",
            gender: "Female",
            dob: "2017-03-18",
            sacraments: [
                { name: "Baptism", date: "2017-04-13", parish: "Our Lady of Fatima Church, Majiwada", certId: "CERT-BAP-2017-0677" }
            ]
        }
    ]
};

// Default Parish Announcements
const DEFAULT_ANNOUNCEMENTS = [
    {
        id: "notif_ann_01",
        title: "⛪ Parish Mass Schedule Update",
        desc: "Special Evening Mass scheduled for Feast Day this Sunday at 6:30 PM.",
        timestamp: "Today",
        type: "announcement"
    },
    {
        id: "notif_ann_02",
        title: "📜 Confirmation Catechism 2026",
        desc: "Registration for Confirmation 2026 batch candidates is now open at the office.",
        timestamp: "Yesterday",
        type: "announcement"
    }
];

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

// Format Date string
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

function calculateAge(dobStr) {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return null;
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getInitials(name) {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getSacramentIconSvg(sacramentName) {
    const name = (sacramentName || '').toLowerCase();
    if (name.includes('baptism')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
    } else if (name.includes('communion')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><path d="M7 3h10v4a5 5 0 0 1-10 0V3z"/><path d="M12 12v6"/><path d="M8 21h8"/><circle cx="12" cy="3" r="1.5"/></svg>`;
    } else if (name.includes('confirmation')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.5"><path d="M12 2v6"/><path d="M12 8L8 4"/><path d="M12 8l4-4"/><path d="M4 13a8 8 0 0 0 16 0"/><line x1="12" y1="13" x2="12" y2="22"/></svg>`;
    } else if (name.includes('matrimony') || name.includes('marriage')) {
        return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.5"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>`;
    }
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><path d="M12 2v20M7 7h10"/></svg>`;
}

// -------------------------------------------------------------
// PARISHIONER AUTHENTICATION SYSTEM
// -------------------------------------------------------------
function initParishionerAuth() {
    const authOverlay = document.getElementById('parishionerAuthOverlay');
    const loginForm = document.getElementById('parishionerLoginForm');
    const logoutNav = document.getElementById('parishionerLogoutNav');
    const logoutBtn = document.getElementById('parishionerLogoutBtn');

    const authSession = JSON.parse(sessionStorage.getItem('olfc_parishioner_session') || 'null');

    if (authSession) {
        if (authOverlay) authOverlay.style.display = 'none';
        if (logoutNav) logoutNav.style.display = 'inline-block';
        loadFamilyRecord(authSession.familyId || "FAM-2024-0892");
    } else {
        if (authOverlay) authOverlay.style.display = 'flex';
        if (logoutNav) logoutNav.style.display = 'none';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputId = document.getElementById('loginFamilyId').value.trim();
            const password = document.getElementById('loginFamilyPassword').value;

            // Demo authentication check
            if (inputId && password) {
                const sessionData = {
                    familyId: inputId,
                    authenticatedAt: new Date().toISOString()
                };
                sessionStorage.setItem('olfc_parishioner_session', JSON.stringify(sessionData));

                if (authOverlay) authOverlay.style.display = 'none';
                if (logoutNav) logoutNav.style.display = 'inline-block';
                loadFamilyRecord(inputId);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('olfc_parishioner_session');
            if (authOverlay) authOverlay.style.display = 'flex';
            if (logoutNav) logoutNav.style.display = 'none';
        });
    }
}

// Load Family Record
async function loadFamilyRecord(familyId = "FAM-2024-0892") {
    const loadingEl = document.getElementById("account-loading");
    if (loadingEl) loadingEl.style.display = "flex";

    let familyRecord = null;

    // First check localStorage office families if updated
    try {
        const storedFamilies = JSON.parse(localStorage.getItem('olfc_office_families') || '[]');
        familyRecord = storedFamilies.find(f => f.familyId.toLowerCase() === familyId.toLowerCase() || f.id.toLowerCase() === familyId.toLowerCase());
    } catch (e) {}

    if (!familyRecord && db) {
        try {
            const docRef = await db.collection("families").doc(familyId).get();
            if (docRef.exists) {
                familyRecord = { id: docRef.id, ...docRef.data() };
            }
        } catch (e) {}
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
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
                    <div class="card-id-pill">
                        <span class="id-label">UNIQUE ID</span>
                        <span class="id-value">${family.familyId}</span>
                    </div>
                    <button type="button" id="downloadFamilyPdfBtn" title="Download Family Card as PDF" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.22);border-radius:6px;padding:4px 10px;color:#e0a96d;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:700;transition:background 0.2s;">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3v12M7 13l5 5 5-5"/><path d="M4 20h16"/></svg>
                        Download
                    </button>
                </div>
            </div>
            <h2 class="family-head-title">${family.headOfFamily}</h2>
            <p class="community-name">${family.communityName || 'Majiwada Parish Community'}</p>
        </div>

        <!-- Key Meta Grid -->
        <div class="card-meta-grid">
            <div class="meta-item">
                <span class="meta-label">Joined Parish</span>
                <span class="meta-value">${formatDate(family.joinedParishDate || '2012-08-15')}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Contact Phone</span>
                <span class="meta-value">${family.contactPhone || '+91 98201 12345'}</span>
            </div>
            <div class="meta-item full-width">
                <span class="meta-label">Residential Address</span>
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
                ${(family.members || []).map(member => `
                    <div class="member-row-item" data-member-id="${member.id}" tabindex="0" role="button">
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
    });

    // Attach download button inside the re-rendered card
    const downloadBtn = document.getElementById('downloadFamilyPdfBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', triggerFamilyCardPdf);
    }

    renderParishionerNotifications();
}

// Render Back View: Member ID Card
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
                <span class="meta-card-value">${formatDate(member.dob)}</span>
            </div>
            <div class="meta-card">
                <span class="meta-card-label">Sacraments Received</span>
                <span class="meta-card-value highlight">${sacramentsCount} Sacraments</span>
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
                                        ${sac.parish || 'Our Lady of Fatima Church'}
                                    </span>
                                    ${sac.certId ? `
                                        <span class="cert-id-tag">Cert ID: ${sac.certId}</span>
                                    ` : ''}
                                </div>
                                <div style="margin-top: 0.5rem;">
                                    ${(sac.parish || '').toLowerCase().includes('fatima') || (sac.parish || '').toLowerCase().includes('olfc') || !sac.parish ? `
                                        <button type="button" class="btn-request-cert" onclick="window.requestOfficialCertificate('${member.name}', '${sac.name}', '${sac.parish || 'Our Lady of Fatima Church, Majiwada'}')">
                                            📜 Request Official Certificate
                                        </button>
                                    ` : `
                                        <span style="font-size: 0.725rem; color: #64748b; font-style: italic;">
                                            (Certificate issued by ${sac.parish})
                                        </span>
                                    `}
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

    wrapper.classList.add("show-member");
}

function showFamilyCard() {
    const wrapper = document.getElementById("id-card-wrapper");
    if (wrapper) wrapper.classList.remove("show-member");
}

// -------------------------------------------------------------
// PDF DOWNLOAD FUNCTION FOR FAMILY CARD
// -------------------------------------------------------------
function triggerFamilyCardPdf() {
    // Clone only the family-card-front so member card & chrome are excluded
    const cardElement = document.getElementById('family-card-front');
    if (!cardElement) return;

    const familyId = currentFamilyData ? currentFamilyData.familyId : 'FAM-CARD';

    if (typeof html2pdf !== 'undefined') {
        // Build a clean printable clone
        const clone = cardElement.cloneNode(true);
        // Remove download button from clone so it doesn't appear in PDF
        const dlBtn = clone.querySelector('#downloadFamilyPdfBtn');
        if (dlBtn) dlBtn.parentElement.removeChild(dlBtn);

        // Wrap clone in a temporary container matching the card's rendered width
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'width:520px;font-family:Inter,Arial,sans-serif;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:none;';
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        const opt = {
            margin: [8, 8, 8, 8],
            filename: `Parish_Family_Card_${familyId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, width: 520 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(wrapper).save().then(() => {
            document.body.removeChild(wrapper);
        });
    } else {
        window.print();
    }
}

function setupPdfDownload() {
    // PDF download is attached dynamically inside renderFamilyCard()
    // This is kept as a stub for backward compatibility
}

// -------------------------------------------------------------
// TOP-RIGHT NOTIFICATIONS & DISMISS HANDLER
// -------------------------------------------------------------
function renderParishionerNotifications() {
    const notifList = document.getElementById('parishionerNotifList');
    if (!notifList) return;

    const familyId = currentFamilyData ? currentFamilyData.familyId : 'FAM-2024-0892';

    // Fetch dismissed list from localStorage
    const dismissedIds = JSON.parse(localStorage.getItem(`dismissed_notifs_${familyId}`) || '[]');

    // Get Office Approval requests status for current family
    const officeApprovals = JSON.parse(localStorage.getItem('olfc_office_approvals') || '[]');
    const familyApprovals = officeApprovals.filter(a => a.familyId.toLowerCase() === familyId.toLowerCase());

    let notifItems = [];

    // Map approvals into notifications
    familyApprovals.forEach(req => {
        let title = "📌 Request Status Update";
        let desc = "";
        let itemType = "pending";

        if (req.type === 'certificate_request') {
            title = `📜 ${req.details.sacramentName} Certificate Request`;
        } else if (req.type === 'add_member') {
            title = `👤 Member Addition Request (${req.details.memberName})`;
        } else if (req.type === 'new_family' || req.type === 'delete_member') {
            title = `🏠 Family Record Update Request`;
        }

        if (req.status === 'approved') {
            itemType = "approved";
            desc = `<strong>✅ APPROVED BY PARISH OFFICE!</strong> ${req.type === 'certificate_request' ? 'Your certificate is ready. Please visit the Parish Office to collect your printed copy.' : 'Your requested update has been updated in your record.'}`;
        } else if (req.status === 'rejected') {
            itemType = "rejected";
            desc = `<strong>❌ Request Declined.</strong> Please contact the parish office for further details.`;
        } else {
            itemType = "pending";
            desc = `Request ID: ${req.id} is currently under review by Parish Office Admin.`;
        }

        notifItems.push({
            id: req.id,
            title: title,
            desc: desc,
            timestamp: req.timestamp || 'Recent',
            type: itemType
        });
    });

    // Append default parish announcements if not dismissed
    DEFAULT_ANNOUNCEMENTS.forEach(ann => {
        notifItems.push(ann);
    });

    // Filter out dismissed
    notifItems = notifItems.filter(item => !dismissedIds.includes(item.id));

    if (notifItems.length === 0) {
        notifList.innerHTML = `
            <div style="text-align: center; color: #94a3b8; padding: 1.5rem; font-size: 0.85rem; border: 1px dashed #e2e8f0; border-radius: 10px;">
                <i class="fas fa-bell-slash" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block; color: #cbd5e1;"></i>
                No new notifications or pending updates.
            </div>
        `;
        return;
    }

    notifList.innerHTML = notifItems.map(item => `
        <div class="notif-item ${item.type}">
            <button class="btn-dismiss-notif" onclick="window.dismissNotification('${item.id}')" title="Dismiss">&times;</button>
            <div class="notif-item-title">
                <span>${item.title}</span>
            </div>
            <div class="notif-item-desc">${item.desc}</div>
            <div class="notif-item-meta">${item.timestamp}</div>
        </div>
    `).join('');
}

window.dismissNotification = function(notifId) {
    const familyId = currentFamilyData ? currentFamilyData.familyId : 'FAM-2024-0892';
    const dismissedIds = JSON.parse(localStorage.getItem(`dismissed_notifs_${familyId}`) || '[]');
    if (!dismissedIds.includes(notifId)) {
        dismissedIds.push(notifId);
        localStorage.setItem(`dismissed_notifs_${familyId}`, JSON.stringify(dismissedIds));
    }
    renderParishionerNotifications();
};

function setupNotificationActions() {
    const clearAllBtn = document.getElementById('clearAllNotifsBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            const familyId = currentFamilyData ? currentFamilyData.familyId : 'FAM-2024-0892';
            const officeApprovals = JSON.parse(localStorage.getItem('olfc_office_approvals') || '[]');
            const familyApprovals = officeApprovals.filter(a => a.familyId.toLowerCase() === familyId.toLowerCase());

            const allIds = [...familyApprovals.map(a => a.id), ...DEFAULT_ANNOUNCEMENTS.map(a => a.id)];
            localStorage.setItem(`dismissed_notifs_${familyId}`, JSON.stringify(allIds));
            renderParishionerNotifications();
        });
    }
}

// -------------------------------------------------------------
// BOTTOM-RIGHT SERVICE REQUEST — INLINE FORM PANELS
// -------------------------------------------------------------
function buildInlineForm(panelId, fields, onSubmit) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    // Toggle: if already open, close it
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
        return;
    }

    // Close all other panels first
    document.querySelectorAll('.svc-inline-panel').forEach(p => p.style.display = 'none');

    let fieldsHtml = fields.map(f => {
        if (f.type === 'select') {
            return `<div class="svc-form-field">
                <label class="svc-form-label">${f.label}</label>
                <select id="svc_${f.key}" class="svc-form-input">
                    ${f.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
                </select>
            </div>`;
        }
        return `<div class="svc-form-field">
            <label class="svc-form-label">${f.label}</label>
            <input type="${f.type || 'text'}" id="svc_${f.key}" class="svc-form-input" placeholder="${f.placeholder || ''}" value="${f.defaultVal || ''}">
        </div>`;
    }).join('');

    panel.innerHTML = `
        <div class="svc-inline-form">
            ${fieldsHtml}
            <div class="svc-form-actions">
                <button type="button" class="svc-btn-submit" id="svc_submit_${panelId}">Submit Request</button>
                <button type="button" class="svc-btn-cancel" id="svc_cancel_${panelId}">Cancel</button>
            </div>
            <div class="svc-form-success" id="svc_success_${panelId}" style="display:none;"></div>
        </div>
    `;

    panel.style.display = 'block';

    document.getElementById(`svc_submit_${panelId}`).addEventListener('click', () => {
        const values = {};
        fields.forEach(f => {
            values[f.key] = (document.getElementById(`svc_${f.key}`)?.value || '').trim();
        });
        const err = onSubmit(values);
        if (!err) {
            const successEl = document.getElementById(`svc_success_${panelId}`);
            if (successEl) {
                successEl.textContent = '✅ Request submitted! You can track the status in Notifications.';
                successEl.style.display = 'block';
            }
            setTimeout(() => { panel.style.display = 'none'; }, 2400);
        }
    });

    document.getElementById(`svc_cancel_${panelId}`).addEventListener('click', () => {
        panel.style.display = 'none';
    });
}

function setupServiceRequests() {
    // 1. Certificate Request
    document.getElementById('btnReqCertificate')?.addEventListener('click', () => {
        if (!currentFamilyData) return;
        const memberOptions = (currentFamilyData.members || []).map(m => ({ value: m.name, label: m.name }));
        buildInlineForm('panelReqCertificate', [
            { key: 'memberName', label: 'Family Member', type: 'select', options: memberOptions },
            { key: 'sacramentName', label: 'Sacrament', type: 'select', options: [
                { value: 'Baptism', label: 'Baptism' },
                { value: 'First Holy Communion', label: 'First Holy Communion' },
                { value: 'Confirmation', label: 'Confirmation' },
                { value: 'Holy Matrimony', label: 'Holy Matrimony' }
            ]},
            { key: 'purpose', label: 'Purpose', placeholder: 'e.g. School Record, Marriage Preparation', defaultVal: 'Official Verification' }
        ], (vals) => {
            if (!vals.memberName || !vals.sacramentName || !vals.purpose) return 'missing';
            submitParishionerRequest({
                type: 'certificate_request',
                familyId: currentFamilyData.familyId,
                headName: currentFamilyData.headOfFamily,
                requestedBy: `${vals.memberName} (Parishioner Account)`,
                requestedRole: 'parishioner',
                details: { memberName: vals.memberName, sacramentName: vals.sacramentName, parishName: 'Our Lady of Fatima Church, Majiwada', purpose: vals.purpose }
            });
        });
    });

    // 2. Data Update Request
    document.getElementById('btnReqDataUpdate')?.addEventListener('click', () => {
        if (!currentFamilyData) return;
        buildInlineForm('panelReqDataUpdate', [
            { key: 'fieldName', label: 'Field to Update', type: 'select', options: [
                { value: 'Address', label: 'Residential Address' },
                { value: 'Contact Phone', label: 'Contact Phone' },
                { value: 'Email', label: 'Email Address' }
            ]},
            { key: 'newValue', label: 'New Value', placeholder: 'Enter updated information' }
        ], (vals) => {
            if (!vals.newValue) return 'missing';
            let currentValue = currentFamilyData.address;
            if (vals.fieldName === 'Contact Phone') currentValue = currentFamilyData.contactPhone;
            else if (vals.fieldName === 'Email') currentValue = currentFamilyData.email || '';
            submitParishionerRequest({
                type: 'new_family',
                familyId: currentFamilyData.familyId,
                headName: currentFamilyData.headOfFamily,
                requestedBy: `${currentFamilyData.headOfFamily} (Parishioner Account)`,
                requestedRole: 'parishioner',
                details: { fieldName: vals.fieldName, oldValue: currentValue, newValue: vals.newValue, reason: 'Parishioner requested info update from Account Portal' }
            });
        });
    });

    // 3. Add Member Request
    document.getElementById('btnReqAddMember')?.addEventListener('click', () => {
        if (!currentFamilyData) return;
        buildInlineForm('panelReqAddMember', [
            { key: 'memberName', label: 'Full Name', placeholder: 'Enter full name' },
            { key: 'relation', label: 'Relation', type: 'select', options: [
                { value: 'Son', label: 'Son' },
                { value: 'Daughter', label: 'Daughter' },
                { value: 'Spouse', label: 'Spouse' },
                { value: 'Mother', label: 'Mother' },
                { value: 'Father', label: 'Father' },
                { value: 'Other', label: 'Other' }
            ]},
            { key: 'gender', label: 'Gender', type: 'select', options: [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' }
            ]},
            { key: 'dob', label: 'Date of Birth', type: 'date' }
        ], (vals) => {
            if (!vals.memberName || !vals.dob) return 'missing';
            submitParishionerRequest({
                type: 'add_member',
                familyId: currentFamilyData.familyId,
                headName: currentFamilyData.headOfFamily,
                requestedBy: `${currentFamilyData.headOfFamily} (Parishioner Account)`,
                requestedRole: 'parishioner',
                details: { memberName: vals.memberName, relation: vals.relation || 'Member', gender: vals.gender || 'Other', dob: vals.dob || '2010-01-01' }
            });
        });
    });
}

function submitParishionerRequest(reqData) {
    try {
        const officeApprovals = JSON.parse(localStorage.getItem('olfc_office_approvals') || '[]');
        const newReq = {
            id: `REQ-${Date.now().toString().slice(-6)}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status: 'pending',
            ...reqData
        };
        officeApprovals.unshift(newReq);
        localStorage.setItem('olfc_office_approvals', JSON.stringify(officeApprovals));
        renderParishionerNotifications();
    } catch (e) {
        console.error('Failed to submit request', e);
    }
}

// Global window helpers
window.requestOfficialCertificate = function(memberName, sacramentName, parishName) {
    submitParishionerRequest({
        type: 'certificate_request',
        familyId: currentFamilyData ? currentFamilyData.familyId : 'FAM-2024-0892',
        headName: currentFamilyData ? currentFamilyData.headOfFamily : memberName,
        requestedBy: `${memberName} (Parishioner Account)`,
        requestedRole: 'parishioner',
        details: {
            memberName: memberName,
            sacramentName: sacramentName,
            parishName: parishName,
            purpose: 'Official Certificate Verification'
        }
    });
};

// Setup Event Listeners
function setupEventListeners() {
    setupPdfDownload();
    setupNotificationActions();
    setupServiceRequests();

    const backBtn = document.getElementById("back-to-family-btn");
    if (backBtn) {
        backBtn.addEventListener("click", showFamilyCard);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initFirebaseDB();
    initParishionerAuth();
    setupEventListeners();
});
