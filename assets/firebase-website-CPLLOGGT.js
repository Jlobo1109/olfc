class b{constructor(){this.db=null,this.init()}async init(){typeof firebase<"u"&&firebase.apps.length===0&&firebase.initializeApp({projectId:"olfatimachurch-b8123"}),typeof firebase<"u"&&(this.db=firebase.firestore(),await this.trackPageView())}async trackPageView(){try{const t=await this.getVisitorData(),e=this.getPageData(),n={...t,...e,timestamp:firebase.firestore.FieldValue.serverTimestamp(),sessionId:this.getSessionId(),userAgent:navigator.userAgent,referrer:document.referrer||"direct",isNewVisitor:this.isNewVisitor()};await this.db.collection("analytics").add(n),this.updateSessionData(n)}catch(t){console.error("Error tracking page view:",t)}}async getVisitorData(){try{const e=await(await fetch("https://api.ipify.org?format=json")).json(),i=await(await fetch(`https://ipapi.co/${e.ip}/json/`)).json();return{ipAddress:e.ip,country:i.country_name||"Unknown",region:i.region||"Unknown",city:i.city||"Unknown",timezone:i.timezone||"Unknown",isp:i.org||"Unknown"}}catch(t){return console.error("Error getting visitor data:",t),{ipAddress:"Unknown",country:"Unknown",region:"Unknown",city:"Unknown",timezone:"Unknown",isp:"Unknown"}}}getPageData(){return{page:window.location.pathname,pageTitle:document.title,url:window.location.href,screenResolution:`${screen.width}x${screen.height}`,viewportSize:`${window.innerWidth}x${window.innerHeight}`,colorDepth:screen.colorDepth,language:navigator.language,platform:navigator.platform,cookieEnabled:navigator.cookieEnabled,onlineStatus:navigator.onLine}}getSessionId(){let t=sessionStorage.getItem("analytics_session_id");return t||(t="session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9),sessionStorage.setItem("analytics_session_id",t)),t}isNewVisitor(){return localStorage.getItem("has_visited_olfc")?!1:(localStorage.setItem("has_visited_olfc","true"),!0)}updateSessionData(t){const e={lastPage:t.page,lastVisit:new Date().toISOString(),pageViews:(parseInt(sessionStorage.getItem("page_views")||"0")+1).toString()};sessionStorage.setItem("page_views",e.pageViews),sessionStorage.setItem("last_page",t.page),sessionStorage.setItem("last_visit",e.lastVisit)}async trackEvent(t,e={}){try{const n={eventName:t,eventData:e,timestamp:firebase.firestore.FieldValue.serverTimestamp(),sessionId:this.getSessionId(),page:window.location.pathname};await this.db.collection("analytics_events").add(n)}catch(n){console.error("Error tracking event:",n)}}trackButtonClick(t,e){this.trackEvent("button_click",{buttonName:t,page:e})}trackFormSubmission(t,e){this.trackEvent("form_submission",{formName:t,page:e})}}document.addEventListener("DOMContentLoaded",function(){window.analytics=new b,document.addEventListener("click",function(r){if(r.target.tagName==="BUTTON"||r.target.closest("button")){const t=r.target.tagName==="BUTTON"?r.target:r.target.closest("button"),e=t.textContent.trim()||t.getAttribute("aria-label")||"Unknown Button";window.analytics.trackButtonClick(e,window.location.pathname)}}),document.addEventListener("submit",function(r){const t=r.target.getAttribute("name")||r.target.id||"Unknown Form";window.analytics.trackFormSubmission(t,window.location.pathname)})});let h;try{const r=firebase.initializeApp({projectId:"olfatimachurch-b8123"});h=firebase.firestore(r)}catch{const t=firebase.app();h=firebase.firestore(t)}location.hostname==="localhost"&&(console.log("Using Firebase Emulators"),h.useEmulator("localhost",8080));class L{constructor(){this.loadingElements=new Set}showLoading(t){const e=document.getElementById(t);e&&(e.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>',this.loadingElements.add(t))}hideLoading(t){this.loadingElements.delete(t)}async loadHeroContent(){try{this.showLoading("hero-content");const t=await h.collection("content").doc("hero").get();if(t.exists){const e=t.data(),n=document.getElementById("hero-content");n&&(n.innerHTML=`
                        <h1>${e.title||"A Community of Faith and Love"}</h1>
                        <div class="hero-buttons">
                            <a href="about.html" class="btn btn-light">Our History</a>
                        </div>
                    `)}this.hideLoading("hero-content")}catch(t){console.error("Error loading hero content:",t);const e=document.getElementById("hero-content");e&&(e.innerHTML=`
                    <h1>Welcome to Our Lady of Fatima Church</h1>
                    <div class="hero-buttons">
                        <a href="about.html" class="btn btn-light">Our History</a>
                    </div>
                `),this.hideLoading("hero-content")}}async loadWelcomeContent(){try{this.showLoading("welcome-content");const t=await h.collection("content").doc("welcome").get();if(t.exists){const e=t.data(),n=document.getElementById("welcome-content");n&&(n.innerHTML=`
                        <h2>${e.title||"Welcome to Our Parish"}</h2>
                        <div class="welcome-text">
                            ${e.content?e.content.map(i=>`<p>${i}</p>`).join(""):""}
                        </div>
                    `)}this.hideLoading("welcome-content")}catch(t){console.error("Error loading welcome content:",t);const e=document.getElementById("welcome-content");e&&(e.innerHTML='<div class="error-message"><p>Unable to load welcome message. Please check back later.</p></div>'),this.hideLoading("welcome-content")}}async loadEventsContent(){try{const e=window.location.pathname.split("/").pop()==="parish.html"?"articles":"events-content";this.showLoading(e);const n=await h.collection("events").where("isPublished","==",!0).get(),i=[];n.forEach(o=>{const a=o.data();i.push({id:o.id,...a})}),i.sort((o,a)=>{let l=o.date,d=a.date;return l&&typeof l=="object"&&l.seconds&&(l=new Date(l.seconds*1e3)),d&&typeof d=="object"&&d.seconds&&(d=new Date(d.seconds*1e3)),typeof l=="string"&&(l=new Date(l)),typeof d=="string"&&(d=new Date(d)),d-l});const c=i.slice(0,3),s=document.getElementById(e);if(s)if(c.length>0){const o=`
                        <h2>Events</h2>
                        <div class="event-cards">
                    ${c.map(a=>{const l=a.images&&a.images.length>0?f(a.images[0]):"";return`<div class="card event-card-clickable" onclick="handleEventCardClick()" style="cursor: pointer;">
                        ${l?`<img class="event-card" src="${l}" alt="${a.title}">`:""}
                        <div class="card-content">
                            <h3>${a.title}</h3>
                        </div>
                    </div>`}).join("")}
                    </div>`;s.innerHTML=o}else s.innerHTML="<h2>Events</h2><p>No events available at the moment.</p>";this.hideLoading(e)}catch(t){console.error("Error loading events content:",t);const e=document.getElementById(targetElementId);e&&(e.innerHTML="<h2>Events</h2><p>Error loading events. Please try again later.</p>"),this.hideLoading(targetElementId)}}async loadParishEvents(){try{const t=await h.collection("events").where("isPublished","==",!0).get(),e=[];t.forEach(i=>{const c=i.data();e.push({id:i.id,...c})}),e.sort((i,c)=>{let s=i.date,o=c.date;return s&&typeof s=="object"&&s.seconds&&(s=new Date(s.seconds*1e3)),o&&typeof o=="object"&&o.seconds&&(o=new Date(o.seconds*1e3)),typeof s=="string"&&(s=new Date(s)),typeof o=="string"&&(o=new Date(o)),o-s});const n=document.getElementById("articles");n&&(n.innerHTML=`
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
                `,window.parishEvents=e,window.filteredArticles=e,this.populateMonthYearFilter(e),this.setupParishEventListeners(),this.renderParishArticles())}catch(t){console.error("Error loading parish events:",t);const e=document.getElementById("articles");e&&(e.innerHTML="<h2>Events</h2><p>Error loading events. Please try again later.</p>")}}populateMonthYearFilter(t){const e=document.getElementById("monthYearFilter");if(!e)return;const n=new Map;t.forEach(c=>{if(c.date)try{const s=new Date(c.date);if(!isNaN(s.getTime())){const o=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`,a=s.toLocaleDateString("en-US",{year:"numeric",month:"long"});n.has(o)||n.set(o,{value:o,text:a,count:0}),n.get(o).count++}}catch{console.warn("Invalid date format:",c.date)}});const i=Array.from(n.values()).sort((c,s)=>s.value.localeCompare(c.value));e.innerHTML='<option value="All">All months</option>',i.forEach(({value:c,text:s,count:o})=>{if(o>0){const a=document.createElement("option");a.value=c,a.textContent=s,e.appendChild(a)}})}setupParishEventListeners(){const t=document.getElementById("articleFilter"),e=document.getElementById("monthYearFilter");t&&t.addEventListener("change",()=>this.applyParishArticleFilters()),e&&e.addEventListener("change",()=>this.applyParishArticleFilters())}applyParishArticleFilters(){const t=document.getElementById("articleFilter"),e=document.getElementById("monthYearFilter"),n=t?t.value:"All",i=e?e.value:"All";window.filteredArticles=window.parishEvents.filter(c=>{const s=n==="All"||c.category===n;let o=!0;if(i!=="All"&&c.date)try{const a=new Date(c.date);isNaN(a.getTime())?o=!1:o=`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}`===i}catch{o=!1}return s&&o}),this.renderParishArticles()}renderParishArticles(){const t=document.getElementById("articles-feed");if(t){if(t.innerHTML="",window.filteredArticles.length===0){t.innerHTML="<p>No matching articles found.</p>";return}window.filteredArticles.forEach(e=>{const n=document.createElement("div");n.classList.add("article-card"),n.id=`event-${e.id}`,n.dataset.eventId=e.id;let i=e.date;e.date&&typeof e.date=="object"&&e.date.seconds&&(i=new Date(e.date.seconds*1e3).toLocaleDateString()),n.innerHTML=`
                <div class="article-header">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h3>${e.title}</h3>
                        <button type="button" class="btn-share" onclick="handleEventShare('${e.id}', '${e.title.replace(/'/g,"\\'")}')" title="Share Event" style="background: none; border: none; cursor: pointer; padding: 5px; color: var(--accent-color); display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                        </button>
                    </div>
                    <span class="meta">${i} | ${e.author||"Parish Office"}</span>
                </div>
                ${e.images&&e.images.length>0?`<div class="article-gallery">
                        <span class="gallery-prev">&#10092;</span>
                        ${e.images.map((c,s)=>`<img src="${f(c)}" alt="${e.title}" class="gallery-img ${s===0?"active":""}">`).join("")}
                        <span class="gallery-next">&#10093;</span>
                    </div>`:""}
                <div class="article-description">
                    ${this.renderArticleDescription(e.description)}
                    <a href="#" class="read-more">Read more</a>
                </div>
            `,t.appendChild(n)}),this.setupArticleInteractions()}}renderArticleDescription(t){if(!t)return'<p class="short">No description available</p>';let e=[];if(Array.isArray(t)?e=t:e=t.split(/\n\s*\n/).map(s=>s.trim()).filter(s=>s.length>0),e.length===0)return'<p class="short">No description available</p>';const n=e[0],i=n.length>200?n.substring(0,200)+"...":n,c=e.map(s=>`<p>${s}</p>`).join("");return`
            <p class="short">${i}</p>
            <div class="full hidden">${c}</div>
        `}setupArticleInteractions(){document.querySelectorAll(".article-card").forEach(t=>{const e=t.querySelectorAll(".gallery-img");let n=0;const i=o=>{e.forEach((a,l)=>a.classList.toggle("active",l===o))},c=t.querySelector(".gallery-prev");c&&c.addEventListener("click",()=>{n=(n-1+e.length)%e.length,i(n)});const s=t.querySelector(".gallery-next");s&&s.addEventListener("click",()=>{n=(n+1)%e.length,i(n)})}),document.querySelectorAll(".read-more").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const n=t.closest(".article-description"),i=n.querySelector(".short"),c=n.querySelector(".full");c.classList.contains("hidden")?(c.classList.remove("hidden"),i.style.display="none",t.textContent="Read less"):(c.classList.add("hidden"),i.style.display="block",t.textContent="Read more")})})}async loadHomePageContent(){await Promise.all([this.loadHeroContent(),this.loadWelcomeContent(),this.loadEventsContent()])}async loadAboutContent(){try{this.showLoading("history-content");const t=await h.collection("content").doc("about").get();if(t.exists){const e=t.data(),n=document.getElementById("history-content");n?n.innerHTML=`
                        <h2>${e.title||"Our History"}</h2>
                        <div class="about-content">
                            ${e.content?e.content.map(i=>`<p>${i}</p>`).join(""):""}
                        </div>
                    `:console.error('Element with ID "history-content" not found')}else{const e=document.getElementById("history-content");e&&(e.innerHTML="<p>No content available</p>")}this.hideLoading("history-content")}catch(t){console.error("Error loading about content:",t),this.hideLoading("history-content")}}async loadMassSchedule(){try{this.showLoading("mass");const t=await h.collection("content").doc("mass").get();if(t.exists){const e=t.data(),n=document.getElementById("mass");n&&(n.innerHTML=`
                        <h2>${e.title||"Mass Schedule"}</h2>
                        <table class="mass-schedule-table">
          <tbody>
            <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Details</th>
            </tr>
            ${e.schedule?e.schedule.map(i=>`<tr><td>${i.day}</td><td>${i.time.replace(", ",",<br>")}</td><td>${i.details}</td></tr>`).join(""):""}
          </tbody>
        </table>`)}this.hideLoading("mass")}catch(t){console.error("Error loading mass schedule:",t);const e=document.getElementById("mass");e&&(e.innerHTML='<p class="error-message">Unable to load mass schedule. Please contact the parish office for details.</p>'),this.hideLoading("mass")}}async loadParishTeam(){try{this.showLoading("parish-team");const t=await h.collection("team").orderBy("order","asc").get(),e=[];t.forEach(s=>{const o=s.data();e.push({id:s.id,...o})});const n=e.filter(s=>s.role&&(s.role.toLowerCase().includes("priest")||s.role.toLowerCase().includes("deacon"))),i=e.filter(s=>s.role&&s.role.toLowerCase().includes("sister")),c=document.getElementById("parish-team");if(c&&e.length>0){let s="<h2>Parish Team</h2><br>";if(n.length>0&&(s+=`<div class="team-cards">
                        ${n.map(o=>{const a=o.image||o.img_url||o.image_url;return`<div class="card">
                                <img class="team-card" src="${a?f(a):"https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/default-avatar.webp"}" alt="${o.name}">
                                <div class="card-content">
                                    <h3>${o.name}</h3>
                                    <p>${o.role||o.title}</p>
                                    <p>${o.description||o.desc}</p>
                                </div>
                            </div>`}).join("")}
                    </div>`),i.length>0)try{const o=await h.collection("content").doc("sisters").get(),a=o.exists?o.data():null,l=(a==null?void 0:a.title)||"Helpers of Mary",d=(a==null?void 0:a.description)||"The Helpers of Mary are dedicated sisters who serve our parish community with love and devotion. They live in Seva Sadan house in Dhokali and provide spiritual guidance and support to our parishioners.";s+=`
                            <div class="sisters-section" style="margin-top: 40px;">
                                <h2>${l}</h2>
                                <p style="text-align: center; margin: 20px 0; font-size: 1.1rem; color: #666;">
                                    ${d}
                                </p>
                                <div class="team-cards">
                                    ${i.map(g=>{const y=g.image||g.img_url||g.image_url;return`<div class="card">
                                            <img class="team-card" src="${y?f(y):"https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/default-avatar.webp"}" alt="${g.name}">
                                            <div class="card-content">
                                                <h3>${g.name}</h3>
                                                <p>${g.role||g.title}</p>
                                                <p>${g.description||g.desc}</p>
                                            </div>
                                        </div>`}).join("")}
                                </div>
                            </div>
                        `}catch(o){console.error("Error loading sisters content:",o),s+=`
                            <div class="sisters-section" style="margin-top: 40px;">
                                <h2>Helpers of Mary</h2>
                                <p style="text-align: center; margin: 20px 0; font-size: 1.1rem; color: #666;">
                                    The Helpers of Mary are dedicated sisters who serve our parish community with love and devotion. 
                                    They live in Seva Sadan house in Dhokali and provide spiritual guidance and support to our parishioners.
                                </p>
                                <div class="team-cards">
                                    ${i.map(a=>{const l=a.image||a.img_url||a.image_url;return`<div class="card">
                                            <img class="team-card" src="${l?f(l):"https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/default-avatar.webp"}" alt="${a.name}">
                                            <div class="card-content">
                                                <h3>${a.name}</h3>
                                                <p>${a.role||a.title}</p>
                                                <p>${a.description||a.desc}</p>
                                            </div>
                                        </div>`}).join("")}
                                </div>
                            </div>
                        `}c.innerHTML=s}this.hideLoading("parish-team")}catch(t){console.error("Error loading parish team:",t);const e=document.getElementById("parish-team");e&&(e.innerHTML='<p class="error-message">Unable to load parish team info.</p>'),this.hideLoading("parish-team")}}async loadCommunities(){try{this.showLoading("communities");const t=await h.collection("communities").where("isActive","==",!0).get(),e=[];t.forEach(i=>{e.push({id:i.id,...i.data()})});const n=document.getElementById("communities");n?e.length>0?(n.innerHTML=`
                        <h2>Communities</h2><br>
                        <div class="filter-container">
                            <!-- Search Bar -->
                            <input type="text" id="searchInput" placeholder="Search by name, location, PPC, SCC, NYG...">
                        </div>
                        <div class="community-cards" id="event-cards"></div>
                    `,this.setupCommunitiesInteractivity(e)):n.innerHTML="<h2>Communities</h2><p>No communities available at the moment.</p>":console.error("Communities content element not found!"),this.hideLoading("communities")}catch(t){console.error("Error loading communities:",t);const e=document.getElementById("communities");e&&(e.innerHTML='<p class="error-message">Unable to load communities.</p>'),this.hideLoading("communities")}}async loadAssociations(){try{const t=await h.collection("associations").orderBy("order","asc").get();if(t.empty){this.hidePageLoading();return}const e=[];t.forEach(n=>{const i=n.data();i.isActive&&e.push({id:n.id,...i})}),this.renderAssociations(e),this.hidePageLoading()}catch(t){console.error("Error loading associations:",t),this.hidePageLoading()}}hidePageLoading(){const t=document.getElementById("page-loading"),e=document.getElementById("associations-container");t&&(t.style.display="none"),e&&(e.style.display="flex")}renderAssociations(t){const e={"Parish Youth Council":"pyc","Legion of Mary":"legion","Altar Servers":"altar-servers","Lectors Ministry":"liturgy","Music Ministry":"music","Extraordinary Ministers of Holy Communion":"eucharistic","Ladies Sodality":"ladies","Charismatic Prayer Group":"senior"};t.forEach(n=>{const i=e[n.title];if(i){const c=document.querySelector(`[data-tab="${i}"]`);c&&(c.textContent=n.title);const s=document.querySelector(`#${i} h2`);s&&(s.textContent=n.title);const o=document.getElementById(`${i}-content`);o&&(i==="pyc"?o.innerHTML=n.description:o.innerHTML=`<p>${n.description}</p>`)}})}setupCommunitiesInteractivity(t){let e=[];const n=document.getElementById("searchInput"),i=document.getElementById("event-cards");n.addEventListener("input",()=>c());function c(){const o=n.value.toLowerCase();e=t.filter(a=>a.name&&a.name.toLowerCase().includes(o)||a.location&&a.location.toLowerCase().includes(o)||a.ppc&&a.ppc.toLowerCase().includes(o)||a.scc&&a.scc.toLowerCase().includes(o)||a.nyg&&a.nyg.toLowerCase().replace(/['\s]/g,"").includes(o)||a.societies&&a.societies.some(d=>d.toLowerCase().includes(o))),s()}function s(){if(i.innerHTML="",e.length===0){i.innerHTML="<p>No matching communities found.</p>";return}e.forEach(o=>{const a=document.createElement("div");a.classList.add("community_card"),a.innerHTML=`
                    <div class="area-card-content">
                        <h3>${o.name||"Community"}</h3>
                        <p>${o.location||"Location not specified"}</p>
                        <p><b>PPC - </b>${o.ppc||"Not specified"}</p>
                        <p><b>SCC - </b>${o.scc||"Not specified"}</p>
                        <p><b>NYG - </b>${o.nyg||"Not specified"}</p>
                    </div>
                    <!-- Overlay -->
                    <div class="society-overlay">
                        <h4>Societies</h4>
                        <p>${o.societies&&o.societies.length>0?o.societies.map(l=>`${l}`).join("<br>"):"No societies listed"}</p>
                    </div>`,a.addEventListener("click",l=>{l.stopPropagation(),document.querySelectorAll(".community_card").forEach(g=>{g!==a&&g.classList.remove("show-overlay")}),a.classList.toggle("show-overlay")}),i.appendChild(a)}),document.addEventListener("click",o=>{o.target.closest(".community_card")||document.querySelectorAll(".community_card").forEach(a=>a.classList.remove("show-overlay"))})}c()}}function f(r){return r&&r.startsWith("http")?r:r?`https://firebasestorage.googleapis.com/v0/b/olfatimachurch-b8123.firebasestorage.app/o/${encodeURIComponent(r)}?alt=media`:"https://firebasestorage.googleapis.com/v0/b/olfatimachurch-b8123.firebasestorage.app/o/images%2Fevent.jpeg?alt=media"}function E(){const r=document.getElementById("menu-toggle"),t=document.getElementById("nav-links"),e=document.querySelector(".navbar");!r||!t||r.addEventListener("click",()=>{t.classList.toggle("active"),e.classList.toggle("active")})}function C(){const r=document.querySelectorAll(".navbar .nav-links a"),t=window.location.pathname.split("/").pop()||"index.html";r.forEach(e=>{const n=e.getAttribute("href"),i=n?n.split("#")[0]:"",c=n&&n.includes("#")?"#"+n.split("#")[1]:"",s=t==="index.html"||t==="",o=i==="index.html"||i==="";s&&o&&c?window.location.hash===c?e.classList.add("active"):e.classList.remove("active"):i===t||s&&o&&!c?e.classList.add("active"):e.classList.remove("active")})}function I(){document.addEventListener("click",r=>{const t=r.target.closest(".tab-link");if(t&&t.dataset.tab){m(t.dataset.tab);const e=t.closest(".tab-menu");if(e){const n=t.getBoundingClientRect().right,i=e.getBoundingClientRect().right,c=t.getBoundingClientRect().left,s=e.getBoundingClientRect().left,o=5;n>=i-o?e.scrollBy({left:t.offsetWidth+10,behavior:"smooth"}):c<=s+o&&e.scrollBy({left:-t.offsetWidth-10,behavior:"smooth"})}}})}let u=0,p=[];function $(r){const t=document.getElementById("lightbox"),e=document.getElementById("lightbox-img");t&&e&&(e.src=r,t.style.display="flex",p=Array.from(document.querySelectorAll(".gallery-card img, .event-card")).map(n=>n.src),u=p.indexOf(r),u===-1&&(p=[r],u=0))}function S(){const r=document.getElementById("lightbox");r&&(r.style.display="none")}function T(r){if(p.length<=1)return;u=(u+r+p.length)%p.length;const t=document.getElementById("lightbox-img");t&&(t.src=p[u])}window.openLightbox=$;window.closeLightbox=S;window.changeSlide=T;document.addEventListener("DOMContentLoaded",function(){const r=window.location.pathname.split("/").pop()||"index.html",t=new L;switch(E(),C(),I(),r){case"index.html":case"":t.loadHomePageContent();break;case"about.html":t.loadAboutContent(),t.loadMassSchedule();break;case"parish.html":t.loadParishTeam(),t.loadParishEvents().then(()=>{const i=new URLSearchParams(window.location.search).get("event");i&&(m("articles"),setTimeout(()=>{const c=document.getElementById(`event-${i}`);c&&(c.scrollIntoView({behavior:"smooth",block:"center"}),c.style.boxShadow="0 0 20px rgba(var(--accent-rgb), 0.5)",setTimeout(()=>{c.style.boxShadow=""},3e3))},300))}),t.loadCommunities();const e=sessionStorage.getItem("activateTab");e&&(sessionStorage.removeItem("activateTab"),setTimeout(()=>{m(e)},500));break;case"associations.html":t.loadAssociations();break;default:t.loadHomePageContent()}});function w(r){window.location.pathname.split("/").pop()==="parish.html"||window.location.pathname.includes("parish.html")?document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>m(r)):m(r):(window.location.href="parish.html",sessionStorage.setItem("activateTab",r))}window.showTab=w;function m(r){requestAnimationFrame(()=>{const t=document.querySelector(`[data-tab="${r}"]`);if(t){document.querySelectorAll(".tab-link").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(n=>n.classList.remove("active")),t.classList.add("active");const e=document.getElementById(r);e&&e.classList.add("active")}else setTimeout(()=>{document.querySelector(`[data-tab="${r}"]`)&&m(r)},100)})}window.activateTab=m;function v(){w("articles")}window.showArticlesTab=v;function k(){try{typeof v=="function"?v():window.location.href="parish.html"}catch(r){console.error("Error handling event card click:",r),window.location.href="parish.html"}}window.handleEventCardClick=k;window.handleEventShare=function(r,t){const e=`${window.location.origin}/parish.html?event=${r}`,n=`Check out this event at Our Lady of Fatima Church: ${t}`;navigator.share?navigator.share({title:"Our Lady of Fatima Church Event",text:n,url:e}).catch(i=>{console.error("Error sharing:",i)}):navigator.clipboard.writeText(`${n}
${e}`).then(()=>{alert("Event link copied to clipboard!")}).catch(i=>{console.error("Failed to copy text: ",i),prompt("Copy this link to share:",e)})};
