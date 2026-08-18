import { officeDB } from './office-db.js';

// Application State
let currentRole = 'admin'; // 'admin' | 'office_member'
let currentSection = 'dashboard';
let charts = {};

// Current Date Context
const CURRENT_DATE = new Date();
const CURRENT_YEAR = CURRENT_DATE.getFullYear();
const CURRENT_MONTH = CURRENT_DATE.getMonth(); // 0-11 (May is 4)

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initRoleSwitcher();
    renderAll();
    setupEventListeners();
});

// Role Switcher Setup
function initRoleSwitcher() {
    const roleSelect = document.getElementById('roleSelect');
    const rolePill = document.getElementById('rolePill');

    if (roleSelect) {
        roleSelect.value = currentRole;
        roleSelect.addEventListener('change', (e) => {
            currentRole = e.target.value;
            updateRoleUI();
            renderAll();
            showToast(`Role switched to ${currentRole === 'admin' ? 'Admin (Priest)' : 'Office Member'}`, 'success');
        });
    }
    updateRoleUI();
}

function updateRoleUI() {
    const rolePill = document.getElementById('rolePill');
    if (rolePill) {
        if (currentRole === 'admin') {
            rolePill.className = 'role-pill admin';
            rolePill.innerHTML = `<i class="fas fa-user-shield"></i> Admin (Priest)`;
        } else {
            rolePill.className = 'role-pill member';
            rolePill.innerHTML = `<i class="fas fa-user"></i> Office Member`;
        }
    }

    // Toggle staff section visibility
    const staffNavLink = document.getElementById('nav-staff');
    if (staffNavLink) {
        if (currentRole === 'admin') {
            staffNavLink.style.display = 'flex';
        } else {
            staffNavLink.style.display = 'flex'; // Visible but displays permission notice inside
        }
    }
}

// Navigation & Section Switching
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });

    // Mobile sidebar toggle
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('officeSidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

function switchSection(sectionId) {
    currentSection = sectionId;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.section-panel').forEach(s => s.classList.remove('active'));

    const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    const activeSection = document.getElementById(`section-${sectionId}`);

    if (activeLink) activeLink.classList.add('active');
    if (activeSection) activeSection.classList.add('active');

    // Update Topbar Title
    const titleMap = {
        'dashboard': 'Analytics & Demographics Dashboard',
        'families': 'Family & Parishioner Directory',
        'bulk-upload': 'Bulk User Data Upload',
        'approvals': 'Approval Requests Queue',
        'reports': 'Sacramental Eligibility Reports',
        'staff': 'Staff & Access Control'
    };
    const topbarTitle = document.getElementById('topbarTitle');
    if (topbarTitle) topbarTitle.textContent = titleMap[sectionId] || 'Office Dashboard';

    // Render section specific data/charts if needed
    if (sectionId === 'dashboard') {
        renderAnalyticsCharts();
    }
}

// Main Render Dispatcher
function renderAll() {
    updateBadgeCounters();
    renderDashboardStats();
    renderAnalyticsCharts();
    renderFamiliesTable();
    renderApprovalsTable();
    renderEligibilityReports();
    renderStaffTable();
}

function updateBadgeCounters() {
    const approvals = officeDB.getApprovals();
    const pendingCount = approvals.filter(a => a.status === 'pending').length;
    const badge = document.getElementById('approvalBadge');
    if (badge) {
        badge.textContent = pendingCount;
        badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
}

// -------------------------------------------------------------
// 1. DASHBOARD & ANALYTICS
// -------------------------------------------------------------
function renderDashboardStats() {
    const families = officeDB.getFamilies();
    let totalMembersCount = 0;
    let kidsCount = 0;
    let youthCount = 0;

    families.forEach(f => {
        (f.members || []).forEach(m => {
            totalMembersCount++;
            const age = calculateAge(m.dob);
            if (age <= 12) kidsCount++;
            else if (age >= 13 && age <= 19) youthCount++;
        });
    });

    const approvals = officeDB.getApprovals();
    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;

    document.getElementById('statTotalFamilies').textContent = families.length;
    document.getElementById('statTotalMembers').textContent = totalMembersCount;
    document.getElementById('statPendingRequests').textContent = pendingApprovals;
    document.getElementById('statYouthCount').textContent = youthCount;
}

function renderAnalyticsCharts() {
    if (typeof Chart === 'undefined') return;

    const families = officeDB.getFamilies();

    // Zone Breakdown Data
    const zoneCounts = {};
    const ageGroups = { '0-12 (Children)': 0, '13-19 (Youth)': 0, '20-35 (Young Adults)': 0, '36-60 (Adults)': 0, '60+ (Seniors)': 0 };
    const sacramentsCount = { 'Baptism': 0, 'First Holy Communion': 0, 'Confirmation': 0, 'Holy Matrimony': 0 };

    families.forEach(f => {
        const zone = f.communityName || 'Unassigned Zone';
        zoneCounts[zone] = (zoneCounts[zone] || 0) + (f.members || []).length;

        (f.members || []).forEach(m => {
            const age = calculateAge(m.dob);
            if (age <= 12) ageGroups['0-12 (Children)']++;
            else if (age <= 19) ageGroups['13-19 (Youth)']++;
            else if (age <= 35) ageGroups['20-35 (Young Adults)']++;
            else if (age <= 60) ageGroups['36-60 (Adults)']++;
            else ageGroups['60+ (Seniors)']++;

            (m.sacraments || []).forEach(s => {
                if (sacramentsCount[s.name] !== undefined) {
                    sacramentsCount[s.name]++;
                }
            });
        });
    });

    // Destroy existing charts before re-rendering
    if (charts.zoneChart) charts.zoneChart.destroy();
    if (charts.ageChart) charts.ageChart.destroy();
    if (charts.sacramentChart) charts.sacramentChart.destroy();

    // Chart 1: Zone Distribution
    const ctxZone = document.getElementById('zoneChartCtx');
    if (ctxZone) {
        charts.zoneChart = new Chart(ctxZone, {
            type: 'bar',
            data: {
                labels: Object.keys(zoneCounts),
                datasets: [{
                    label: 'Parishioners',
                    data: Object.values(zoneCounts),
                    backgroundColor: 'rgba(217, 119, 6, 0.7)',
                    borderColor: '#d97706',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }

    // Chart 2: Age Demographics
    const ctxAge = document.getElementById('ageChartCtx');
    if (ctxAge) {
        charts.ageChart = new Chart(ctxAge, {
            type: 'doughnut',
            data: {
                labels: Object.keys(ageGroups),
                datasets: [{
                    data: Object.values(ageGroups),
                    backgroundColor: ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa'],
                    borderWidth: 2,
                    borderColor: '#1e293b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
            }
        });
    }

    // Chart 3: Sacramental Readiness
    const ctxSac = document.getElementById('sacramentChartCtx');
    if (ctxSac) {
        charts.sacramentChart = new Chart(ctxSac, {
            type: 'bar',
            data: {
                labels: Object.keys(sacramentsCount),
                datasets: [{
                    label: 'Completed Sacraments',
                    data: Object.values(sacramentsCount),
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                }
            }
        });
    }
}

// -------------------------------------------------------------
// 2. FAMILY & MEMBER DIRECTORY
// -------------------------------------------------------------
function renderFamiliesTable() {
    const tableBody = document.getElementById('familiesTableBody');
    if (!tableBody) return;

    const families = officeDB.getFamilies();
    const searchVal = (document.getElementById('familySearchInput')?.value || '').toLowerCase();
    const zoneVal = document.getElementById('familyZoneFilter')?.value || 'all';

    const filtered = families.filter(f => {
        const matchesSearch = f.familyId.toLowerCase().includes(searchVal) ||
            f.headOfFamily.toLowerCase().includes(searchVal) ||
            f.address.toLowerCase().includes(searchVal);
        const matchesZone = zoneVal === 'all' || f.communityName === zoneVal;
        return matchesSearch && matchesZone;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">No family records matching criteria.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filtered.map(f => `
        <tr>
            <td><strong style="color: #fbbf24;">${f.familyId}</strong></td>
            <td><strong>${f.headOfFamily}</strong></td>
            <td>${f.communityName || 'N/A'}</td>
            <td>${f.address}</td>
            <td>${f.contactPhone}</td>
            <td><span class="status-badge active">${(f.members || []).length} Members</span></td>
            <td>
                <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-secondary btn-sm" onclick="window.viewFamilyDetails('${f.familyId}')">
                        <i class="fas fa-eye"></i> Details
                    </button>
                    ${currentRole === 'admin' ? `
                        <button class="btn btn-danger btn-sm" onclick="window.deleteFamilyRecord('${f.familyId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : `
                        <button class="btn btn-secondary btn-sm" onclick="window.requestDeleteFamily('${f.familyId}', '${f.headOfFamily}')" title="Request Deletion">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    `}
                </div>
            </td>
        </tr>
    `).join('');
}

window.viewFamilyDetails = function(familyId) {
    const family = officeDB.getFamilyById(familyId);
    if (!family) return;

    const modal = document.getElementById('familyDetailModal');
    const modalBody = document.getElementById('familyDetailModalBody');

    modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem; background: rgba(15,23,42,0.6); padding: 1.2rem; border-radius: 10px; border: 1px solid var(--office-card-border);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="color: white; font-size: 1.1rem;">Family ID: <span style="color: #fbbf24;">${family.familyId}</span></h4>
                <span class="status-badge active">${family.communityName}</span>
            </div>
            <p><strong>Head of Family:</strong> ${family.headOfFamily}</p>
            <p><strong>Address:</strong> ${family.address}</p>
            <p><strong>Phone:</strong> ${family.contactPhone} | <strong>Email:</strong> ${family.email || 'N/A'}</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="color: white;">Family Members (${(family.members || []).length})</h4>
            <button class="btn btn-primary btn-sm" onclick="window.openAddMemberModal('${family.familyId}')">
                <i class="fas fa-user-plus"></i> ${currentRole === 'admin' ? 'Add Member' : 'Submit Add Member Request'}
            </button>
        </div>

        <div class="table-responsive">
            <table class="office-table">
                <thead>
                    <tr>
                        <th>Member Name</th>
                        <th>Relation</th>
                        <th>Gender</th>
                        <th>Age / DOB</th>
                        <th>Sacraments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${(family.members || []).map(m => `
                        <tr>
                            <td><strong>${m.name}</strong></td>
                            <td>${m.relation}</td>
                            <td>${m.gender}</td>
                            <td>${calculateAge(m.dob)} yrs (${m.dob})</td>
                            <td>
                                <div style="display: flex; flex-wrap: wrap; gap: 0.2rem;">
                                    ${(m.sacraments || []).map(s => `
                                        <span class="status-badge approved" title="${s.parish} (${s.date})">
                                            ${s.name} ${s.certId ? '📜' : ''}
                                        </span>
                                    `).join('') || '<span style="color: #64748b;">None</span>'}
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-secondary btn-sm" onclick="window.openCertRequestModal('${family.familyId}', '${m.name}')" title="Request Certificate">
                                    📜 Cert
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    modal.classList.add('active');
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
};

window.deleteFamilyRecord = function(familyId) {
    if (confirm(`Are you sure you want to permanently delete Family "${familyId}"?`)) {
        officeDB.deleteFamily(familyId);
        renderAll();
        showToast(`Family ${familyId} deleted successfully.`, 'success');
    }
};

window.requestDeleteFamily = function(familyId, headName) {
    officeDB.addApprovalRequest({
        type: 'delete_member',
        familyId: familyId,
        headName: headName,
        requestedBy: 'Office Staff',
        requestedRole: 'office_member',
        details: {
            memberName: `Entire Family (${headName})`,
            reason: 'Office member submitted family deletion request'
        }
    });
    renderAll();
    showToast(`Deletion request submitted to Parish Admin approval queue.`, 'success');
};

// -------------------------------------------------------------
// 3. BULK UPLOAD & CSV TEMPLATE GENERATOR
// -------------------------------------------------------------
function setupBulkUpload() {
    const downloadTemplateBtn = document.getElementById('downloadCsvTemplateBtn');
    if (downloadTemplateBtn) {
        downloadTemplateBtn.addEventListener('click', downloadCsvTemplate);
    }

    const dropzone = document.getElementById('bulkDropzone');
    const fileInput = document.getElementById('bulkFileInput');

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleBulkFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleBulkFile(e.target.files[0]);
            }
        });
    }
}

function downloadCsvTemplate() {
    const headers = [
        "Family ID", "Head of Family", "Zone / Community", "Address", "Contact Phone", "Email",
        "Member Name", "Relation", "Gender", "Date of Birth (YYYY-MM-DD)",
        "Baptism Date", "Baptism Parish", "Communion Date", "Communion Parish", "Confirmation Date", "Confirmation Parish"
    ];

    const sampleRow1 = [
        "FAM-2026-101", "Anthony D'Silva", "St. Anthony Community - Zone 3", "Flat 302, Green Valley, Majiwada", "+91 98200 11223", "anthony@example.com",
        "Anthony D'Silva", "Head of Family", "Male", "1980-06-15",
        "1980-07-20", "St. John Baptist Church", "1989-05-10", "St. John Baptist Church", "1996-11-04", "St. John Baptist Church"
    ];

    const sampleRow2 = [
        "FAM-2026-101", "Anthony D'Silva", "St. Anthony Community - Zone 3", "Flat 302, Green Valley, Majiwada", "+91 98200 11223", "anthony@example.com",
        "Grace D'Silva", "Daughter", "Female", "2017-04-12",
        "2017-05-10", "Our Lady of Fatima Church, Majiwada", "", "", "", ""
    ];

    const csvContent = "data:text/csv;charset=utf-8," +
        [headers.join(","), sampleRow1.map(v => `"${v}"`).join(","), sampleRow2.map(v => `"${v}"`).join(",")].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "olfc_family_bulk_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function handleBulkFile(file) {
    if (!file.name.endsWith('.csv')) {
        showToast('Please upload a valid CSV file.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        parseAndPreviewCsv(text);
    };
    reader.readAsText(file);
}

function parseAndPreviewCsv(csvText) {
    const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) {
        showToast('CSV file is empty or only contains headers.', 'error');
        return;
    }

    const parsedFamilies = {};
    let errorCount = 0;

    for (let i = 1; i < lines.length; i++) {
        // Simple CSV splitter handling quoted values
        const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());

        const familyId = cols[0];
        const headOfFamily = cols[1];
        const communityName = cols[2];
        const address = cols[3];
        const contactPhone = cols[4];
        const email = cols[5];
        const memberName = cols[6];
        const relation = cols[7];
        const gender = cols[8];
        const dob = cols[9];

        if (!familyId || !headOfFamily || !memberName) {
            errorCount++;
            continue;
        }

        if (!parsedFamilies[familyId]) {
            parsedFamilies[familyId] = {
                id: familyId,
                familyId: familyId,
                headOfFamily: headOfFamily,
                communityName: communityName || 'St. Anthony Community - Zone 3',
                address: address || 'Majiwada, Thane (W)',
                contactPhone: contactPhone || '+91 90000 00000',
                email: email || '',
                members: []
            };
        }

        const sacraments = [];
        if (cols[10]) sacraments.push({ name: 'Baptism', date: cols[10], parish: cols[11] || 'Our Lady of Fatima Church, Majiwada' });
        if (cols[12]) sacraments.push({ name: 'First Holy Communion', date: cols[12], parish: cols[13] || 'Our Lady of Fatima Church, Majiwada' });
        if (cols[14]) sacraments.push({ name: 'Confirmation', date: cols[14], parish: cols[15] || 'Our Lady of Fatima Church, Majiwada' });

        parsedFamilies[familyId].members.push({
            id: `mem_bulk_${i}`,
            name: memberName,
            relation: relation || 'Member',
            gender: gender || 'Other',
            dob: dob || '2000-01-01',
            sacraments: sacraments
        });
    }

    const familyList = Object.values(parsedFamilies);

    const previewContainer = document.getElementById('bulkPreviewContainer');
    if (previewContainer) {
        previewContainer.style.display = 'block';
        previewContainer.innerHTML = `
            <div style="background: var(--office-card-bg); border: 1px solid var(--office-card-border); padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="color: white;"><i class="fas fa-file-invoice"></i> Bulk Data Preview (${familyList.length} Families Parsed)</h3>
                    <button class="btn btn-success" id="confirmBulkImportBtn">
                        <i class="fas fa-check-circle"></i> Confirm & Import ${familyList.length} Families
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="office-table">
                        <thead>
                            <tr>
                                <th>Family ID</th>
                                <th>Head of Family</th>
                                <th>Zone</th>
                                <th>Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${familyList.map(f => `
                                <tr>
                                    <td><strong style="color: #fbbf24;">${f.familyId}</strong></td>
                                    <td>${f.headOfFamily}</td>
                                    <td>${f.communityName}</td>
                                    <td>${f.members.map(m => m.name).join(', ')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('confirmBulkImportBtn')?.addEventListener('click', () => {
            let imported = 0;
            familyList.forEach(fam => {
                try {
                    officeDB.addFamily(fam);
                    imported++;
                } catch (e) {
                    console.warn(`Skipped ${fam.familyId}: `, e.message);
                }
            });
            renderAll();
            previewContainer.style.display = 'none';
            showToast(`Bulk upload complete! Successfully imported ${imported} families.`, 'success');
            switchSection('families');
        });
    }
}

// -------------------------------------------------------------
// 4. APPROVAL REQUESTS QUEUE
// -------------------------------------------------------------
function renderApprovalsTable() {
    const tableBody = document.getElementById('approvalsTableBody');
    if (!tableBody) return;

    const approvals = officeDB.getApprovals();
    const filterVal = document.getElementById('approvalFilterSelect')?.value || 'all';

    const filtered = approvals.filter(a => filterVal === 'all' || a.status === filterVal);

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">No approval requests in queue.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filtered.map(req => {
        let reqTypeLabel = req.type;
        if (req.type === 'add_member') reqTypeLabel = '➕ Add Member';
        else if (req.type === 'delete_member') reqTypeLabel = '❌ Remove Member';
        else if (req.type === 'new_family') reqTypeLabel = '🏠 New Family Reg.';
        else if (req.type === 'certificate_request') reqTypeLabel = '📜 Sacrament Cert';

        let detailsText = '';
        if (req.type === 'add_member') detailsText = `${req.details.memberName} (${req.details.relation})`;
        else if (req.type === 'delete_member') detailsText = `${req.details.memberName} - ${req.details.reason || 'Requested'}`;
        else if (req.type === 'new_family') detailsText = `Head: ${req.details.headOfFamily}`;
        else if (req.type === 'certificate_request') detailsText = `${req.details.sacramentName} Cert for ${req.details.memberName}`;

        return `
            <tr>
                <td><strong>${req.id}</strong></td>
                <td><span class="status-badge active">${reqTypeLabel}</span></td>
                <td><strong style="color: #fbbf24;">${req.familyId}</strong></td>
                <td>${req.requestedBy}</td>
                <td>${detailsText}</td>
                <td><span class="status-badge ${req.status}">${req.status.toUpperCase()}</span></td>
                <td>
                    ${req.status === 'pending' ? `
                        ${currentRole === 'admin' ? `
                            <div style="display: flex; gap: 0.4rem;">
                                <button class="btn btn-success btn-sm" onclick="window.processRequest('${req.id}', 'approve')">
                                    <i class="fas fa-check"></i> Approve
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="window.processRequest('${req.id}', 'reject')">
                                    <i class="fas fa-times"></i> Reject
                                </button>
                            </div>
                        ` : `
                            <span style="font-size: 0.75rem; color: #94a3b8;"><i class="fas fa-lock"></i> Pending Admin Approval</span>
                        `}
                    ` : `
                        <span style="font-size: 0.75rem; color: #94a3b8;">Processed by ${req.reviewedBy || 'Admin'}</span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

window.processRequest = function(reqId, action) {
    if (currentRole !== 'admin') {
        showToast("Only Parish Priests / Admin can approve or reject requests.", "error");
        return;
    }
    officeDB.processApproval(reqId, action, "Fr. Michael D'Costa (Parish Priest)");
    renderAll();
    showToast(`Request ${reqId} has been ${action}d.`, 'success');
};

// -------------------------------------------------------------
// 5. SACRAMENTAL ELIGIBILITY REPORTS (Communion & Confirmation)
// -------------------------------------------------------------
function renderEligibilityReports() {
    const yearSelect = document.getElementById('reportYearSelect');
    const selectedYear = parseInt(yearSelect?.value || CURRENT_YEAR);

    // Dynamic annual rollover: Communion age = 9, Confirmation age = 16
    const communionCandidates = [];
    const confirmationCandidates = [];

    const families = officeDB.getFamilies();
    families.forEach(fam => {
        (fam.members || []).forEach(mem => {
            if (!mem.dob) return;
            const birthYear = parseInt(mem.dob.substring(0, 4));
            const ageInTargetYear = selectedYear - birthYear;

            // Sacraments completed checks
            const hasCommunion = (mem.sacraments || []).some(s => s.name === 'First Holy Communion');
            const hasConfirmation = (mem.sacraments || []).some(s => s.name === 'Confirmation');

            // Communion Candidate: turning 9 in target year & hasn't completed Communion
            if (ageInTargetYear === 9 && !hasCommunion) {
                communionCandidates.push({
                    name: mem.name,
                    familyId: fam.familyId,
                    community: fam.communityName,
                    dob: mem.dob,
                    parent: fam.headOfFamily,
                    phone: fam.contactPhone
                });
            }

            // Confirmation Candidate: turning 16 in target year & hasn't completed Confirmation
            if (ageInTargetYear === 16 && !hasConfirmation) {
                confirmationCandidates.push({
                    name: mem.name,
                    familyId: fam.familyId,
                    community: fam.communityName,
                    dob: mem.dob,
                    parent: fam.headOfFamily,
                    phone: fam.contactPhone
                });
            }
        });
    });

    // Render Communion Table
    const communionTableBody = document.getElementById('communionReportTableBody');
    if (communionTableBody) {
        if (communionCandidates.length === 0) {
            communionTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 1.5rem;">No candidates turning age 9 for First Holy Communion in ${selectedYear}.</td></tr>`;
        } else {
            communionTableBody.innerHTML = communionCandidates.map(c => `
                <tr>
                    <td><strong>${c.name}</strong></td>
                    <td><strong style="color: #fbbf24;">${c.familyId}</strong></td>
                    <td>${c.community}</td>
                    <td>${c.dob} (Age 9 in ${selectedYear})</td>
                    <td>${c.parent}</td>
                    <td>${c.phone}</td>
                </tr>
            `).join('');
        }
    }

    // Render Confirmation Table
    const confirmationTableBody = document.getElementById('confirmationReportTableBody');
    if (confirmationTableBody) {
        if (confirmationCandidates.length === 0) {
            confirmationTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 1.5rem;">No candidates turning age 16 for Confirmation in ${selectedYear}.</td></tr>`;
        } else {
            confirmationTableBody.innerHTML = confirmationCandidates.map(c => `
                <tr>
                    <td><strong>${c.name}</strong></td>
                    <td><strong style="color: #fbbf24;">${c.familyId}</strong></td>
                    <td>${c.community}</td>
                    <td>${c.dob} (Age 16 in ${selectedYear})</td>
                    <td>${c.parent}</td>
                    <td>${c.phone}</td>
                </tr>
            `).join('');
        }
    }
}

// -------------------------------------------------------------
// 6. STAFF & ACCESS CONTROL
// -------------------------------------------------------------
function renderStaffTable() {
    const tableBody = document.getElementById('staffTableBody');
    if (!tableBody) return;

    const staffList = officeDB.getStaff();

    if (currentRole !== 'admin') {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #f87171; padding: 2rem;"><i class="fas fa-lock"></i> Restricted: Only Parish Priests (Admins) can manage office staff credentials.</td></tr>`;
        return;
    }

    tableBody.innerHTML = staffList.map(s => `
        <tr>
            <td><strong>${s.name}</strong></td>
            <td>${s.designation}</td>
            <td>${s.email}</td>
            <td><span class="role-pill ${s.role}">${s.role === 'admin' ? 'Admin (Priest)' : 'Office Member'}</span></td>
            <td>
                ${s.id !== 'STAFF-001' ? `
                    <button class="btn btn-danger btn-sm" onclick="window.removeStaffMember('${s.id}')">
                        <i class="fas fa-user-minus"></i> Remove
                    </button>
                ` : `<span style="font-size: 0.75rem; color: #64748b;">Primary Admin</span>`}
            </td>
        </tr>
    `).join('');
}

window.removeStaffMember = function(staffId) {
    if (confirm("Are you sure you want to remove this staff member?")) {
        officeDB.deleteStaff(staffId);
        renderAll();
        showToast("Staff member removed successfully.", "success");
    }
};

// -------------------------------------------------------------
// MODALS AND FORM HANDLERS
// -------------------------------------------------------------
function setupEventListeners() {
    setupBulkUpload();

    // Year Selector for Reports
    document.getElementById('reportYearSelect')?.addEventListener('change', () => {
        renderEligibilityReports();
    });

    // Search and filters
    document.getElementById('familySearchInput')?.addEventListener('input', renderFamiliesTable);
    document.getElementById('familyZoneFilter')?.addEventListener('change', renderFamiliesTable);
    document.getElementById('approvalFilterSelect')?.addEventListener('change', renderApprovalsTable);

    // Create New Family Form
    document.getElementById('createFamilyForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const familyId = document.getElementById('newFamilyId').value.trim();
        const headName = document.getElementById('newHeadName').value.trim();
        const community = document.getElementById('newCommunity').value;
        const address = document.getElementById('newAddress').value.trim();
        const phone = document.getElementById('newPhone').value.trim();

        if (currentRole === 'admin') {
            try {
                officeDB.addFamily({
                    id: familyId,
                    familyId: familyId,
                    headOfFamily: headName,
                    communityName: community,
                    address: address,
                    contactPhone: phone,
                    members: [{
                        id: `mem_${Date.now().toString().slice(-4)}`,
                        name: headName,
                        relation: 'Head of Family',
                        gender: 'Male',
                        dob: '1980-01-01',
                        sacraments: []
                    }]
                });
                renderAll();
                closeModal('addFamilyModal');
                showToast(`Family "${familyId}" created successfully!`, 'success');
            } catch (err) {
                showToast(err.message, 'error');
            }
        } else {
            // Office Member -> Submit to Approval Queue
            officeDB.addApprovalRequest({
                type: 'new_family',
                familyId: familyId,
                headName: headName,
                requestedBy: 'Rita Sharma (Office Member)',
                requestedRole: 'office_member',
                details: {
                    familyId: familyId,
                    headOfFamily: headName,
                    communityName: community,
                    address: address,
                    contactPhone: phone
                }
            });
            renderAll();
            closeModal('addFamilyModal');
            showToast(`New family registration sent to Parish Admin for approval.`, 'success');
        }
    });

    // Add Staff Member Form
    document.getElementById('addStaffForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('staffName').value.trim();
        const email = document.getElementById('staffEmail').value.trim();
        const designation = document.getElementById('staffDesignation').value.trim();
        const role = document.getElementById('staffRole').value;

        officeDB.addStaff({ name, email, designation, role });
        renderAll();
        closeModal('addStaffModal');
        showToast(`Staff member "${name}" added successfully.`, 'success');
    });
}

// Dialog openers
window.openAddFamilyModal = function() {
    document.getElementById('addFamilyModal')?.classList.add('active');
};

window.openAddStaffModal = function() {
    if (currentRole !== 'admin') {
        showToast("Only Parish Priests (Admins) can add staff.", "error");
        return;
    }
    document.getElementById('addStaffModal')?.classList.add('active');
};

window.openAddMemberModal = function(familyId) {
    const name = prompt("Enter Member Full Name:");
    if (!name) return;
    const relation = prompt("Enter Relation (e.g. Son, Daughter, Spouse, Mother):", "Son");
    const dob = prompt("Enter Date of Birth (YYYY-MM-DD):", "2015-05-20");

    if (currentRole === 'admin') {
        const family = officeDB.getFamilyById(familyId);
        if (family) {
            family.members = family.members || [];
            family.members.push({
                id: `mem_${Date.now().toString().slice(-4)}`,
                name: name,
                relation: relation || 'Member',
                gender: 'Other',
                dob: dob || '2010-01-01',
                sacraments: []
            });
            officeDB.updateFamily(familyId, family);
            renderAll();
            window.viewFamilyDetails(familyId);
            showToast(`Member ${name} added to family!`, 'success');
        }
    } else {
        officeDB.addApprovalRequest({
            type: 'add_member',
            familyId: familyId,
            headName: 'Family Member',
            requestedBy: 'Office Staff',
            requestedRole: 'office_member',
            details: {
                memberName: name,
                relation: relation || 'Member',
                gender: 'Other',
                dob: dob || '2010-01-01'
            }
        });
        renderAll();
        showToast(`Member addition request submitted for approval.`, 'success');
    }
};

window.openCertRequestModal = function(familyId, memberName) {
    const sacramentName = prompt("Select Sacrament (Baptism / First Holy Communion / Confirmation / Holy Matrimony):", "Baptism");
    if (!sacramentName) return;

    // Requirement: Certificate generated through ONLY Our Lady of Fatima parish
    const parish = prompt("Enter Parish where sacrament was celebrated:", "Our Lady of Fatima Church, Majiwada");
    if (!parish) return;

    if (!parish.toLowerCase().includes("fatima")) {
        showToast("Certificates can only be issued for sacraments celebrated at Our Lady of Fatima parish.", "error");
        return;
    }

    officeDB.addApprovalRequest({
        type: 'certificate_request',
        familyId: familyId,
        headName: 'Family Record',
        requestedBy: 'Office Staff',
        requestedRole: 'office_member',
        details: {
            memberName: memberName,
            sacramentName: sacramentName,
            parishName: parish,
            purpose: 'Official Certificate Verification'
        }
    });

    renderAll();
    showToast(`Certificate request for ${memberName} sent to Parish Admin for approval.`, 'success');
};

// Utilities
function calculateAge(dobStr) {
    if (!dobStr) return 0;
    const dob = new Date(dobStr);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
