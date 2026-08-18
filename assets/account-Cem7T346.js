import"./style-CdAmugBQ.js";const g={id:"FAM-2024-0892",familyId:"FAM-2024-0892",communityName:"St. Anthony Community - Zone 3",joinedParishDate:"2012-08-15",headOfFamily:"Joseph D'Souza",address:"B-402, Sacred Heart CHS, Majiwada, Thane (W)",contactPhone:"+91 98201 12345",email:"joseph.dsouza@example.com",members:[{id:"mem_01",name:"Joseph D'Souza",relation:"Head of Family",gender:"Male",dob:"1978-05-14",sacraments:[{name:"Baptism",date:"1978-06-10",parish:"St. John the Baptist Church, Thane",certId:"CERT-BAP-1978-0412"},{name:"First Holy Communion",date:"1987-04-19",parish:"St. John the Baptist Church, Thane",certId:"CERT-FHC-1987-0189"},{name:"Confirmation",date:"1993-11-21",parish:"St. John the Baptist Church, Thane",certId:"CERT-CNF-1993-0304"},{name:"Holy Matrimony",date:"2006-01-08",parish:"Our Lady of Fatima Church, Majiwada",certId:"CERT-MAT-2006-0052"}]},{id:"mem_02",name:"Mary D'Souza",relation:"Spouse",gender:"Female",dob:"1982-11-03",sacraments:[{name:"Baptism",date:"1982-12-05",parish:"St. Michael Church, Mahim",certId:"CERT-BAP-1982-0881"},{name:"First Holy Communion",date:"1991-05-12",parish:"St. Michael Church, Mahim",certId:"CERT-FHC-1991-0422"},{name:"Confirmation",date:"1997-10-26",parish:"St. Michael Church, Mahim",certId:"CERT-CNF-1997-0915"},{name:"Holy Matrimony",date:"2006-01-08",parish:"Our Lady of Fatima Church, Majiwada",certId:"CERT-MAT-2006-0052"}]},{id:"mem_03",name:"Kevin D'Souza",relation:"Son",gender:"Male",dob:"2010-09-22",sacraments:[{name:"Baptism",date:"2010-10-19",parish:"Our Lady of Fatima Church, Majiwada",certId:"CERT-BAP-2010-0114"},{name:"First Holy Communion",date:"2019-04-30",parish:"Our Lady of Fatima Church, Majiwada",certId:"CERT-FHC-2019-0518"}]},{id:"mem_04",name:"Sarah D'Souza",relation:"Daughter",gender:"Female",dob:"2017-03-18",sacraments:[{name:"Baptism",date:"2017-04-13",parish:"Our Lady of Fatima Church, Majiwada",certId:"CERT-BAP-2017-0677"}]}]},v=[{id:"notif_ann_01",title:"⛪ Parish Mass Schedule Update",desc:"Special Evening Mass scheduled for Feast Day this Sunday at 6:30 PM.",timestamp:"Today",type:"announcement"},{id:"notif_ann_02",title:"📜 Confirmation Catechism 2026",desc:"Registration for Confirmation 2026 batch candidates is now open at the office.",timestamp:"Yesterday",type:"announcement"}];let o=null,u=null;function w(){try{if(typeof firebase<"u"){let e;try{e=firebase.initializeApp({projectId:"olfatimachurch-b8123"})}catch{e=firebase.app()}u=firebase.firestore(e),location.hostname==="localhost"&&u.useEmulator("localhost",8080)}}catch(e){console.warn("Offline or Firebase disconnected. Using local NoSQL data.",e)}}function h(e){if(!e)return"N/A";const t=new Date(e);if(isNaN(t.getTime()))return e;const i=t.getDate(),n=["January","February","March","April","May","June","July","August","September","October","November","December"][t.getMonth()],r=t.getFullYear(),s=i%10===1&&i!==11?"st":i%10===2&&i!==12?"nd":i%10===3&&i!==13?"rd":"th";return`${i}${s} ${n} ${r}`}function C(e){if(!e)return null;const t=new Date(e);if(isNaN(t.getTime()))return null;const i=Date.now()-t.getTime(),a=new Date(i);return Math.abs(a.getUTCFullYear()-1970)}function b(e){return e?e.split(" ").map(t=>t[0]).join("").substring(0,2).toUpperCase():"??"}function I(e){const t=(e||"").toLowerCase();return t.includes("baptism")?'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>':t.includes("communion")?'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><path d="M7 3h10v4a5 5 0 0 1-10 0V3z"/><path d="M12 12v6"/><path d="M8 21h8"/><circle cx="12" cy="3" r="1.5"/></svg>':t.includes("confirmation")?'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.5"><path d="M12 2v6"/><path d="M12 8L8 4"/><path d="M12 8l4-4"/><path d="M4 13a8 8 0 0 0 16 0"/><line x1="12" y1="13" x2="12" y2="22"/></svg>':t.includes("matrimony")||t.includes("marriage")?'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.5"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>':'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5"><path d="M12 2v20M7 7h10"/></svg>'}function M(){const e=document.getElementById("parishionerAuthOverlay"),t=document.getElementById("parishionerLoginForm"),i=document.getElementById("parishionerLogoutNav"),a=document.getElementById("parishionerLogoutBtn"),n=JSON.parse(sessionStorage.getItem("olfc_parishioner_session")||"null");n?(e&&(e.style.display="none"),i&&(i.style.display="inline-block"),y(n.familyId||"FAM-2024-0892")):(e&&(e.style.display="flex"),i&&(i.style.display="none")),t&&t.addEventListener("submit",r=>{r.preventDefault();const s=document.getElementById("loginFamilyId").value.trim(),l=document.getElementById("loginFamilyPassword").value;if(s&&l){const d={familyId:s,authenticatedAt:new Date().toISOString()};sessionStorage.setItem("olfc_parishioner_session",JSON.stringify(d)),e&&(e.style.display="none"),i&&(i.style.display="inline-block"),y(s)}}),a&&a.addEventListener("click",()=>{sessionStorage.removeItem("olfc_parishioner_session"),e&&(e.style.display="flex"),i&&(i.style.display="none")})}async function y(e="FAM-2024-0892"){const t=document.getElementById("account-loading");t&&(t.style.display="flex");let i=null;try{i=JSON.parse(localStorage.getItem("olfc_office_families")||"[]").find(n=>n.familyId.toLowerCase()===e.toLowerCase()||n.id.toLowerCase()===e.toLowerCase())}catch{}if(!i&&u)try{const a=await u.collection("families").doc(e).get();a.exists&&(i={id:a.id,...a.data()})}catch{}i||(i=g),o=i,t&&(t.style.display="none"),F(i)}function F(e){const t=document.getElementById("family-card-front");if(!t)return;t.innerHTML=`
        <!-- Compact Header Banner -->
        <div class="card-header">
            <div class="header-top-row">
                <span class="card-badge">PARISH FAMILY CARD</span>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
                    <div class="card-id-pill">
                        <span class="id-label">UNIQUE ID</span>
                        <span class="id-value">${e.familyId}</span>
                    </div>
                    <button type="button" id="downloadFamilyPdfBtn" title="Download Family Card as PDF" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.22);border-radius:6px;padding:4px 10px;color:#e0a96d;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:700;transition:background 0.2s;">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3v12M7 13l5 5 5-5"/><path d="M4 20h16"/></svg>
                        Download
                    </button>
                </div>
            </div>
            <h2 class="family-head-title">${e.headOfFamily}</h2>
            <p class="community-name">${e.communityName||"Majiwada Parish Community"}</p>
        </div>

        <!-- Key Meta Details -->
        <div class="card-meta-details">
            <div class="card-meta-row-item">
                <div class="card-meta-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div class="card-meta-text">
                    <span class="card-meta-label">Joined Parish</span>
                    <span class="card-meta-value">${h(e.joinedParishDate||"2012-08-15")}</span>
                </div>
            </div>
            <div class="card-meta-divider"></div>
            <div class="card-meta-row-item">
                <div class="card-meta-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.66 5.66l.86-.86a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21.22 16z"/></svg>
                </div>
                <div class="card-meta-text">
                    <span class="card-meta-label">Contact Phone</span>
                    <span class="card-meta-value">${e.contactPhone||"+91 98201 12345"}</span>
                </div>
            </div>
            <div class="card-meta-divider"></div>
            <div class="card-meta-row-item">
                <div class="card-meta-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div class="card-meta-text">
                    <span class="card-meta-label">Residential Address</span>
                    <span class="card-meta-value">${e.address}</span>
                </div>
            </div>
        </div>


        <!-- Family Members Vertical List Section -->
        <div class="card-members-section">
            <div class="section-title-bar">
                <h3>Family Members</h3>
                <span class="hint-text">Tap a member to view ID card</span>
            </div>

            <div class="members-vertical-list">
                ${(e.members||[]).map(a=>`
                    <div class="member-row-item" data-member-id="${a.id}" tabindex="0" role="button">
                        <div class="member-avatar ${a.gender==="Female"?"female":"male"}">
                            ${b(a.name)}
                        </div>
                        <span class="member-name">${a.name}</span>
                        <span class="member-relation-badge">${a.relation}</span>
                        <div class="member-row-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `,t.querySelectorAll(".member-row-item").forEach(a=>{a.addEventListener("click",()=>{const n=a.getAttribute("data-member-id");E(n)})});const i=document.getElementById("downloadFamilyPdfBtn");i&&i.addEventListener("click",S),p()}function E(e){if(!o||!o.members)return;const t=o.members.find(s=>s.id===e);if(!t)return;const i=document.getElementById("member-card-content"),a=document.getElementById("id-card-wrapper");if(!i||!a)return;const n=C(t.dob),r=t.sacraments?t.sacraments.length:0;i.innerHTML=`
        <!-- Member Profile Header -->
        <div class="member-id-profile-header">
            <div class="member-avatar-lg ${t.gender==="Female"?"female":"male"}">
                ${b(t.name)}
            </div>
            <div class="member-details-main">
                <h2>${t.name}</h2>
                <div class="member-tags">
                    <span class="tag-relation">${t.relation}</span>
                    <span class="tag-gender">${t.gender}</span>
                    ${n!==null?`<span class="tag-age">${n} Yrs</span>`:""}
                </div>
            </div>
        </div>

        <!-- Meta Cards Grid -->
        <div class="member-id-meta-grid">
            <div class="meta-card">
                <span class="meta-card-label">Date of Birth (DOB)</span>
                <span class="meta-card-value">${h(t.dob)}</span>
            </div>
            <div class="meta-card">
                <span class="meta-card-label">Sacraments Received</span>
                <span class="meta-card-value highlight">${r} Sacraments</span>
            </div>
        </div>

        <!-- Sacramental Records Timeline -->
        <div class="member-sacraments-section">
            <h3 class="sacraments-title">Sacramental Records</h3>

            ${t.sacraments&&t.sacraments.length>0?`
                <div class="sacraments-timeline">
                    ${t.sacraments.map(s=>`
                        <div class="timeline-item">
                            <div class="timeline-icon">${I(s.name)}</div>
                            <div class="timeline-content">
                                <div class="sacrament-header">
                                    <h4 class="sacrament-name">${s.name}</h4>
                                    <span class="sacrament-date">${h(s.date)}</span>
                                </div>
                                <div class="sacrament-sub-info">
                                    <span class="sacrament-parish">
                                        ${s.parish||"Our Lady of Fatima Church"}
                                    </span>
                                    ${s.certId?`
                                        <span class="cert-id-tag">Cert ID: ${s.certId}</span>
                                    `:""}
                                </div>
                                <div style="margin-top: 0.5rem;">
                                    ${(s.parish||"").toLowerCase().includes("fatima")||(s.parish||"").toLowerCase().includes("olfc")||!s.parish?`
                                        <button type="button" class="btn-request-cert" onclick="window.requestOfficialCertificate('${t.name}', '${s.name}', '${s.parish||"Our Lady of Fatima Church, Majiwada"}')">
                                            📜 Request Official Certificate
                                        </button>
                                    `:`
                                        <span style="font-size: 0.725rem; color: #64748b; font-style: italic;">
                                            (Certificate issued by ${s.parish})
                                        </span>
                                    `}
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `:`
                <div class="empty-sacraments">
                    <p>No sacramental records recorded yet.</p>
                </div>
            `}
        </div>
    `,a.classList.add("show-member")}function $(){const e=document.getElementById("id-card-wrapper");e&&e.classList.remove("show-member")}function S(){const e=document.getElementById("family-card-front");if(!e)return;const t=o?o.familyId:"FAM-CARD";if(typeof html2pdf<"u"){const i=e.cloneNode(!0),a=i.querySelector("#downloadFamilyPdfBtn");a&&a.parentElement.removeChild(a);const n=document.createElement("div");n.style.cssText="width:520px;font-family:Inter,Arial,sans-serif;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:none;",n.appendChild(i),document.body.appendChild(n);const r={margin:[8,8,8,8],filename:`Parish_Family_Card_${t}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0,width:520},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};html2pdf().set(r).from(n).save().then(()=>{document.body.removeChild(n)})}else window.print()}function p(){const e=document.getElementById("parishionerNotifList");if(!e)return;const t=o?o.familyId:"FAM-2024-0892",i=JSON.parse(localStorage.getItem(`dismissed_notifs_${t}`)||"[]"),n=JSON.parse(localStorage.getItem("olfc_office_approvals")||"[]").filter(s=>s.familyId.toLowerCase()===t.toLowerCase());let r=[];if(n.forEach(s=>{let l="📌 Request Status Update",d="",c="pending";s.type==="certificate_request"?l=`📜 ${s.details.sacramentName} Certificate Request`:s.type==="add_member"?l=`👤 Member Addition Request (${s.details.memberName})`:(s.type==="new_family"||s.type==="delete_member")&&(l="🏠 Family Record Update Request"),s.status==="approved"?(c="approved",d=`<strong>✅ APPROVED BY PARISH OFFICE!</strong> ${s.type==="certificate_request"?"Your certificate is ready. Please visit the Parish Office to collect your printed copy.":"Your requested update has been updated in your record."}`):s.status==="rejected"?(c="rejected",d="<strong>❌ Request Declined.</strong> Please contact the parish office for further details."):(c="pending",d=`Request ID: ${s.id} is currently under review by Parish Office Admin.`),r.push({id:s.id,title:l,desc:d,timestamp:s.timestamp||"Recent",type:c})}),v.forEach(s=>{r.push(s)}),r=r.filter(s=>!i.includes(s.id)),r.length===0){e.innerHTML=`
            <div style="text-align: center; color: #94a3b8; padding: 1.5rem; font-size: 0.85rem; border: 1px dashed #e2e8f0; border-radius: 10px;">
                <i class="fas fa-bell-slash" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block; color: #cbd5e1;"></i>
                No new notifications or pending updates.
            </div>
        `;return}e.innerHTML=r.map(s=>`
        <div class="notif-item ${s.type}">
            <button class="btn-dismiss-notif" onclick="window.dismissNotification('${s.id}')" title="Dismiss">&times;</button>
            <div class="notif-item-title">
                <span>${s.title}</span>
            </div>
            <div class="notif-item-desc">${s.desc}</div>
            <div class="notif-item-meta">${s.timestamp}</div>
        </div>
    `).join("")}window.dismissNotification=function(e){const t=o?o.familyId:"FAM-2024-0892",i=JSON.parse(localStorage.getItem(`dismissed_notifs_${t}`)||"[]");i.includes(e)||(i.push(e),localStorage.setItem(`dismissed_notifs_${t}`,JSON.stringify(i))),p()};function B(){const e=document.getElementById("clearAllNotifsBtn");e&&e.addEventListener("click",()=>{const t=o?o.familyId:"FAM-2024-0892",n=[...JSON.parse(localStorage.getItem("olfc_office_approvals")||"[]").filter(r=>r.familyId.toLowerCase()===t.toLowerCase()).map(r=>r.id),...v.map(r=>r.id)];localStorage.setItem(`dismissed_notifs_${t}`,JSON.stringify(n)),p()})}function f(e,t,i){const a=document.getElementById(e);if(!a)return;if(a.style.display==="block"){a.style.display="none";return}document.querySelectorAll(".svc-inline-panel").forEach(r=>r.style.display="none");let n=t.map(r=>r.type==="select"?`<div class="svc-form-field">
                <label class="svc-form-label">${r.label}</label>
                <select id="svc_${r.key}" class="svc-form-input">
                    ${r.options.map(s=>`<option value="${s.value}">${s.label}</option>`).join("")}
                </select>
            </div>`:`<div class="svc-form-field">
            <label class="svc-form-label">${r.label}</label>
            <input type="${r.type||"text"}" id="svc_${r.key}" class="svc-form-input" placeholder="${r.placeholder||""}" value="${r.defaultVal||""}">
        </div>`).join("");a.innerHTML=`
        <div class="svc-inline-form">
            ${n}
            <div class="svc-form-actions">
                <button type="button" class="svc-btn-submit" id="svc_submit_${e}">Submit Request</button>
                <button type="button" class="svc-btn-cancel" id="svc_cancel_${e}">Cancel</button>
            </div>
            <div class="svc-form-success" id="svc_success_${e}" style="display:none;"></div>
        </div>
    `,a.style.display="block",document.getElementById(`svc_submit_${e}`).addEventListener("click",()=>{const r={};if(t.forEach(l=>{var d;r[l.key]=(((d=document.getElementById(`svc_${l.key}`))==null?void 0:d.value)||"").trim()}),!i(r)){const l=document.getElementById(`svc_success_${e}`);l&&(l.textContent="✅ Request submitted! You can track the status in Notifications.",l.style.display="block"),setTimeout(()=>{a.style.display="none"},2400)}}),document.getElementById(`svc_cancel_${e}`).addEventListener("click",()=>{a.style.display="none"})}function N(){var e,t,i;(e=document.getElementById("btnReqCertificate"))==null||e.addEventListener("click",()=>{if(!o)return;const a=(o.members||[]).map(n=>({value:n.name,label:n.name}));f("panelReqCertificate",[{key:"memberName",label:"Family Member",type:"select",options:a},{key:"sacramentName",label:"Sacrament",type:"select",options:[{value:"Baptism",label:"Baptism"},{value:"First Holy Communion",label:"First Holy Communion"},{value:"Confirmation",label:"Confirmation"},{value:"Holy Matrimony",label:"Holy Matrimony"}]},{key:"purpose",label:"Purpose",placeholder:"e.g. School Record, Marriage Preparation",defaultVal:"Official Verification"}],n=>{if(!n.memberName||!n.sacramentName||!n.purpose)return"missing";m({type:"certificate_request",familyId:o.familyId,headName:o.headOfFamily,requestedBy:`${n.memberName} (Parishioner Account)`,requestedRole:"parishioner",details:{memberName:n.memberName,sacramentName:n.sacramentName,parishName:"Our Lady of Fatima Church, Majiwada",purpose:n.purpose}})})}),(t=document.getElementById("btnReqDataUpdate"))==null||t.addEventListener("click",()=>{o&&f("panelReqDataUpdate",[{key:"fieldName",label:"Field to Update",type:"select",options:[{value:"Address",label:"Residential Address"},{value:"Contact Phone",label:"Contact Phone"},{value:"Email",label:"Email Address"}]},{key:"newValue",label:"New Value",placeholder:"Enter updated information"}],a=>{if(!a.newValue)return"missing";let n=o.address;a.fieldName==="Contact Phone"?n=o.contactPhone:a.fieldName==="Email"&&(n=o.email||""),m({type:"new_family",familyId:o.familyId,headName:o.headOfFamily,requestedBy:`${o.headOfFamily} (Parishioner Account)`,requestedRole:"parishioner",details:{fieldName:a.fieldName,oldValue:n,newValue:a.newValue,reason:"Parishioner requested info update from Account Portal"}})})}),(i=document.getElementById("btnReqAddMember"))==null||i.addEventListener("click",()=>{o&&f("panelReqAddMember",[{key:"memberName",label:"Full Name",placeholder:"Enter full name"},{key:"relation",label:"Relation",type:"select",options:[{value:"Son",label:"Son"},{value:"Daughter",label:"Daughter"},{value:"Spouse",label:"Spouse"},{value:"Mother",label:"Mother"},{value:"Father",label:"Father"},{value:"Other",label:"Other"}]},{key:"gender",label:"Gender",type:"select",options:[{value:"Male",label:"Male"},{value:"Female",label:"Female"}]},{key:"dob",label:"Date of Birth",type:"date"}],a=>{if(!a.memberName||!a.dob)return"missing";m({type:"add_member",familyId:o.familyId,headName:o.headOfFamily,requestedBy:`${o.headOfFamily} (Parishioner Account)`,requestedRole:"parishioner",details:{memberName:a.memberName,relation:a.relation||"Member",gender:a.gender||"Other",dob:a.dob||"2010-01-01"}})})})}function m(e){try{const t=JSON.parse(localStorage.getItem("olfc_office_approvals")||"[]"),i={id:`REQ-${Date.now().toString().slice(-6)}`,timestamp:new Date().toISOString().replace("T"," ").slice(0,16),status:"pending",...e};t.unshift(i),localStorage.setItem("olfc_office_approvals",JSON.stringify(t)),p()}catch(t){console.error("Failed to submit request",t)}}window.requestOfficialCertificate=function(e,t,i){m({type:"certificate_request",familyId:o?o.familyId:"FAM-2024-0892",headName:o?o.headOfFamily:e,requestedBy:`${e} (Parishioner Account)`,requestedRole:"parishioner",details:{memberName:e,sacramentName:t,parishName:i,purpose:"Official Certificate Verification"}})};function A(){B(),N();const e=document.getElementById("back-to-family-btn");e&&e.addEventListener("click",$)}document.addEventListener("DOMContentLoaded",()=>{w(),M(),A()});
