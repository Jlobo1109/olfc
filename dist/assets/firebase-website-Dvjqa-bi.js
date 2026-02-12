(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function e(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=e(o);fetch(o.href,r)}})();class y{constructor(){this.db=null,this.init()}async init(){typeof firebase<"u"&&firebase.apps.length===0&&firebase.initializeApp({projectId:"olfatimachurch-b8123"}),typeof firebase<"u"&&(this.db=firebase.firestore(),await this.trackPageView())}async trackPageView(){try{const t=await this.getVisitorData(),e=this.getPageData(),n={...t,...e,timestamp:firebase.firestore.FieldValue.serverTimestamp(),sessionId:this.getSessionId(),userAgent:navigator.userAgent,referrer:document.referrer||"direct",isNewVisitor:this.isNewVisitor()};await this.db.collection("analytics").add(n),this.updateSessionData(n)}catch(t){console.error("Error tracking page view:",t)}}async getVisitorData(){try{const e=await(await fetch("https://api.ipify.org?format=json")).json(),o=await(await fetch(`https://ipapi.co/${e.ip}/json/`)).json();return{ipAddress:e.ip,country:o.country_name||"Unknown",region:o.region||"Unknown",city:o.city||"Unknown",timezone:o.timezone||"Unknown",isp:o.org||"Unknown"}}catch(t){return console.error("Error getting visitor data:",t),{ipAddress:"Unknown",country:"Unknown",region:"Unknown",city:"Unknown",timezone:"Unknown",isp:"Unknown"}}}getPageData(){return{page:window.location.pathname,pageTitle:document.title,url:window.location.href,screenResolution:`${screen.width}x${screen.height}`,viewportSize:`${window.innerWidth}x${window.innerHeight}`,colorDepth:screen.colorDepth,language:navigator.language,platform:navigator.platform,cookieEnabled:navigator.cookieEnabled,onlineStatus:navigator.onLine}}getSessionId(){let t=sessionStorage.getItem("analytics_session_id");return t||(t="session_"+Date.now()+"_"+Math.random().toString(36).substr(2,9),sessionStorage.setItem("analytics_session_id",t)),t}isNewVisitor(){return localStorage.getItem("has_visited_olfc")?!1:(localStorage.setItem("has_visited_olfc","true"),!0)}updateSessionData(t){const e={lastPage:t.page,lastVisit:new Date().toISOString(),pageViews:(parseInt(sessionStorage.getItem("page_views")||"0")+1).toString()};sessionStorage.setItem("page_views",e.pageViews),sessionStorage.setItem("last_page",t.page),sessionStorage.setItem("last_visit",e.lastVisit)}async trackEvent(t,e={}){try{const n={eventName:t,eventData:e,timestamp:firebase.firestore.FieldValue.serverTimestamp(),sessionId:this.getSessionId(),page:window.location.pathname};await this.db.collection("analytics_events").add(n)}catch(n){console.error("Error tracking event:",n)}}trackButtonClick(t,e){this.trackEvent("button_click",{buttonName:t,page:e})}trackFormSubmission(t,e){this.trackEvent("form_submission",{formName:t,page:e})}}document.addEventListener("DOMContentLoaded",function(){window.analytics=new y,document.addEventListener("click",function(c){if(c.target.tagName==="BUTTON"||c.target.closest("button")){const t=c.target.tagName==="BUTTON"?c.target:c.target.closest("button"),e=t.textContent.trim()||t.getAttribute("aria-label")||"Unknown Button";window.analytics.trackButtonClick(e,window.location.pathname)}}),document.addEventListener("submit",function(c){const t=c.target.getAttribute("name")||c.target.id||"Unknown Form";window.analytics.trackFormSubmission(t,window.location.pathname)})});let h;try{const c=firebase.initializeApp({projectId:"olfatimachurch-b8123"});h=firebase.firestore(c)}catch{const t=firebase.app();h=firebase.firestore(t)}location.hostname==="localhost"&&(console.log("Using Firebase Emulators"),h.useEmulator("localhost",8080));class w{constructor(){this.loadingElements=new Set}showLoading(t){const e=document.getElementById(t);e&&(e.innerHTML='<div class="loading-spinner"><div class="spinner"></div></div>',this.loadingElements.add(t))}hideLoading(t){this.loadingElements.delete(t)}async loadHeroContent(){try{this.showLoading("hero-content");const t=await h.collection("content").doc("hero").get();if(t.exists){const e=t.data(),n=document.getElementById("hero-content");n&&(n.innerHTML=`
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
                            ${e.content?e.content.map(o=>`<p>${o}</p>`).join(""):""}
                        </div>
                    `)}this.hideLoading("welcome-content")}catch(t){console.error("Error loading welcome content:",t);const e=document.getElementById("welcome-content");e&&(e.innerHTML='<div class="error-message"><p>Unable to load welcome message. Please check back later.</p></div>'),this.hideLoading("welcome-content")}}async loadEventsContent(){try{const e=window.location.pathname.split("/").pop()==="parish.html"?"articles":"events-content";this.showLoading(e);const n=await h.collection("events").where("isPublished","==",!0).get(),o=[];n.forEach(a=>{const i=a.data();o.push({id:a.id,...i})}),o.sort((a,i)=>{let l=a.date,d=i.date;return l&&typeof l=="object"&&l.seconds&&(l=new Date(l.seconds*1e3)),d&&typeof d=="object"&&d.seconds&&(d=new Date(d.seconds*1e3)),typeof l=="string"&&(l=new Date(l)),typeof d=="string"&&(d=new Date(d)),d-l});const r=o.slice(0,3),s=document.getElementById(e);if(s)if(r.length>0){const a=`
                        <h2>Events</h2>
                        <div class="event-cards">
                    ${r.map(i=>{const l=i.images&&i.images.length>0?m(i.images[0]):"";return`<div class="card event-card-clickable" onclick="handleEventCardClick()" style="cursor: pointer;">
                        ${l?`<img class="event-card" src="${l}" alt="${i.title}">`:""}
                        <div class="card-content">
                            <h3>${i.title}</h3>
                        </div>
                    </div>`}).join("")}
                    </div>`;s.innerHTML=a}else s.innerHTML="<h2>Events</h2><p>No events available at the moment.</p>";this.hideLoading(e)}catch(t){console.error("Error loading events content:",t);const e=document.getElementById(targetElementId);e&&(e.innerHTML="<h2>Events</h2><p>Error loading events. Please try again later.</p>"),this.hideLoading(targetElementId)}}async loadParishEvents(){try{const t=await h.collection("events").where("isPublished","==",!0).get(),e=[];t.forEach(o=>{const r=o.data();e.push({id:o.id,...r})}),e.sort((o,r)=>{let s=o.date,a=r.date;return s&&typeof s=="object"&&s.seconds&&(s=new Date(s.seconds*1e3)),a&&typeof a=="object"&&a.seconds&&(a=new Date(a.seconds*1e3)),typeof s=="string"&&(s=new Date(s)),typeof a=="string"&&(a=new Date(a)),a-s});const n=document.getElementById("articles");n&&(n.innerHTML=`
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
                `,window.parishEvents=e,window.filteredArticles=e,this.populateMonthYearFilter(e),this.setupParishEventListeners(),this.renderParishArticles())}catch(t){console.error("Error loading parish events:",t);const e=document.getElementById("articles");e&&(e.innerHTML="<h2>Events</h2><p>Error loading events. Please try again later.</p>")}}populateMonthYearFilter(t){const e=document.getElementById("monthYearFilter");if(!e)return;const n=new Map;t.forEach(r=>{if(r.date)try{const s=new Date(r.date);if(!isNaN(s.getTime())){const a=`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`,i=s.toLocaleDateString("en-US",{year:"numeric",month:"long"});n.has(a)||n.set(a,{value:a,text:i,count:0}),n.get(a).count++}}catch{console.warn("Invalid date format:",r.date)}});const o=Array.from(n.values()).sort((r,s)=>s.value.localeCompare(r.value));e.innerHTML='<option value="All">All months</option>',o.forEach(({value:r,text:s,count:a})=>{if(a>0){const i=document.createElement("option");i.value=r,i.textContent=s,e.appendChild(i)}})}setupParishEventListeners(){const t=document.getElementById("articleFilter"),e=document.getElementById("monthYearFilter");t&&t.addEventListener("change",()=>this.applyParishArticleFilters()),e&&e.addEventListener("change",()=>this.applyParishArticleFilters())}applyParishArticleFilters(){const t=document.getElementById("articleFilter"),e=document.getElementById("monthYearFilter"),n=t?t.value:"All",o=e?e.value:"All";window.filteredArticles=window.parishEvents.filter(r=>{const s=n==="All"||r.category===n;let a=!0;if(o!=="All"&&r.date)try{const i=new Date(r.date);isNaN(i.getTime())?a=!1:a=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}`===o}catch{a=!1}return s&&a}),this.renderParishArticles()}renderParishArticles(){const t=document.getElementById("articles-feed");if(t){if(t.innerHTML="",window.filteredArticles.length===0){t.innerHTML="<p>No matching articles found.</p>";return}window.filteredArticles.forEach(e=>{const n=document.createElement("div");n.classList.add("article-card");let o=e.date;e.date&&typeof e.date=="object"&&e.date.seconds&&(o=new Date(e.date.seconds*1e3).toLocaleDateString()),n.innerHTML=`
                <div class="article-header">
                    <h3>${e.title}</h3>
                    <span class="meta">${o} | ${e.author||"Parish Office"}</span>
                </div>
                ${e.images&&e.images.length>0?`<div class="article-gallery">
                        <span class="gallery-prev">&#10092;</span>
                        ${e.images.map((r,s)=>`<img src="${m(r)}" alt="${e.title}" class="gallery-img ${s===0?"active":""}">`).join("")}
                        <span class="gallery-next">&#10093;</span>
                    </div>`:""}
                <div class="article-description">
                    ${this.renderArticleDescription(e.description)}
                    <a href="#" class="read-more">Read more</a>
                </div>
            `,t.appendChild(n)}),this.setupArticleInteractions()}}renderArticleDescription(t){if(!t)return'<p class="short">No description available</p>';let e=[];if(Array.isArray(t)?e=t:e=t.split(/\n\s*\n/).map(s=>s.trim()).filter(s=>s.length>0),e.length===0)return'<p class="short">No description available</p>';const n=e[0],o=n.length>200?n.substring(0,200)+"...":n,r=e.map(s=>`<p>${s}</p>`).join("");return`
            <p class="short">${o}</p>
            <div class="full hidden">${r}</div>
        `}setupArticleInteractions(){document.querySelectorAll(".article-card").forEach(t=>{const e=t.querySelectorAll(".gallery-img");let n=0;const o=a=>{e.forEach((i,l)=>i.classList.toggle("active",l===a))},r=t.querySelector(".gallery-prev");r&&r.addEventListener("click",()=>{n=(n-1+e.length)%e.length,o(n)});const s=t.querySelector(".gallery-next");s&&s.addEventListener("click",()=>{n=(n+1)%e.length,o(n)})}),document.querySelectorAll(".read-more").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const n=t.closest(".article-description"),o=n.querySelector(".short"),r=n.querySelector(".full");r.classList.contains("hidden")?(r.classList.remove("hidden"),o.style.display="none",t.textContent="Read less"):(r.classList.add("hidden"),o.style.display="block",t.textContent="Read more")})})}async loadHomePageContent(){await Promise.all([this.loadHeroContent(),this.loadWelcomeContent(),this.loadEventsContent()])}async loadAboutContent(){try{this.showLoading("history-content");const t=await h.collection("content").doc("about").get();if(t.exists){const e=t.data(),n=document.getElementById("history-content");n?n.innerHTML=`
                        <h2>${e.title||"Our History"}</h2>
                        <div class="about-content">
                            ${e.content?e.content.map(o=>`<p>${o}</p>`).join(""):""}
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
            ${e.schedule?e.schedule.map(o=>`<tr><td>${o.day}</td><td>${o.time.replace(", ",",<br>")}</td><td>${o.details}</td></tr>`).join(""):""}
          </tbody>
        </table>`)}this.hideLoading("mass")}catch(t){console.error("Error loading mass schedule:",t);const e=document.getElementById("mass");e&&(e.innerHTML='<p class="error-message">Unable to load mass schedule. Please contact the parish office for details.</p>'),this.hideLoading("mass")}}async loadParishTeam(){try{this.showLoading("parish-team");const t=await h.collection("team").orderBy("order","asc").get(),e=[];t.forEach(s=>{const a=s.data();e.push({id:s.id,...a})});const n=e.filter(s=>s.role&&(s.role.toLowerCase().includes("priest")||s.role.toLowerCase().includes("deacon"))),o=e.filter(s=>s.role&&s.role.toLowerCase().includes("sister")),r=document.getElementById("parish-team");if(r&&e.length>0){let s="<h2>Parish Team</h2><br>";if(n.length>0&&(s+=`<div class="team-cards">
                        ${n.map(a=>{const i=a.image||a.img_url||a.image_url;return`<div class="card">
                                <img class="team-card" src="${i?m(i):"https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/default-avatar.webp"}" alt="${a.name}">
                                <div class="card-content">
                                    <h3>${a.name}</h3>
                                    <p>${a.role||a.title}</p>
                                    <p>${a.description||a.desc}</p>
                                </div>
                            </div>`}).join("")}
                    </div>`),o.length>0)try{const a=await h.collection("content").doc("sisters").get(),i=a.exists?a.data():null,l=(i==null?void 0:i.title)||"Helpers of Mary",d=(i==null?void 0:i.description)||"The Helpers of Mary are dedicated sisters who serve our parish community with love and devotion. They live in Seva Sadan house in Dhokali and provide spiritual guidance and support to our parishioners.";s+=`
                            <div class="sisters-section" style="margin-top: 40px;">
                                <h2>${l}</h2>
                                <p style="text-align: center; margin: 20px 0; font-size: 1.1rem; color: #666;">
                                    ${d}
                                </p>
                                <div class="team-cards">
                                    ${o.map(p=>{const f=p.image||p.img_url||p.image_url;return`<div class="card">
                                            <img class="team-card" src="${f?m(f):"https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/default-avatar.webp"}" alt="${p.name}">
                                            <div class="card-content">
                                                <h3>${p.name}</h3>
                                                <p>${p.role||p.title}</p>
                                                <p>${p.description||p.desc}</p>
                                            </div>
                                        </div>`}).join("")}
                                </div>
                            </div>
                        `}catch(a){console.error("Error loading sisters content:",a),s+=`
                            <div class="sisters-section" style="margin-top: 40px;">
                                <h2>Helpers of Mary</h2>
                                <p style="text-align: center; margin: 20px 0; font-size: 1.1rem; color: #666;">
                                    The Helpers of Mary are dedicated sisters who serve our parish community with love and devotion. 
                                    They live in Seva Sadan house in Dhokali and provide spiritual guidance and support to our parishioners.
                                </p>
                                <div class="team-cards">
                                    ${o.map(i=>{const l=i.image||i.img_url||i.image_url;return`<div class="card">
                                            <img class="team-card" src="${l?m(l):"https://storage.googleapis.com/olfatimachurch-b8123.firebasestorage.app/images/team/default-avatar.webp"}" alt="${i.name}">
                                            <div class="card-content">
                                                <h3>${i.name}</h3>
                                                <p>${i.role||i.title}</p>
                                                <p>${i.description||i.desc}</p>
                                            </div>
                                        </div>`}).join("")}
                                </div>
                            </div>
                        `}r.innerHTML=s}this.hideLoading("parish-team")}catch(t){console.error("Error loading parish team:",t);const e=document.getElementById("parish-team");e&&(e.innerHTML='<p class="error-message">Unable to load parish team info.</p>'),this.hideLoading("parish-team")}}async loadCommunities(){try{this.showLoading("communities");const t=await h.collection("communities").where("isActive","==",!0).get(),e=[];t.forEach(o=>{e.push({id:o.id,...o.data()})});const n=document.getElementById("communities");n?e.length>0?(n.innerHTML=`
                        <h2>Communities</h2><br>
                        <div class="filter-container">
                            <!-- Search Bar -->
                            <input type="text" id="searchInput" placeholder="Search by name, location, PPC, SCC, NYG...">
                        </div>
                        <div class="community-cards" id="event-cards"></div>
                    `,this.setupCommunitiesInteractivity(e)):n.innerHTML="<h2>Communities</h2><p>No communities available at the moment.</p>":console.error("Communities content element not found!"),this.hideLoading("communities")}catch(t){console.error("Error loading communities:",t);const e=document.getElementById("communities");e&&(e.innerHTML='<p class="error-message">Unable to load communities.</p>'),this.hideLoading("communities")}}async loadAssociations(){try{const t=await h.collection("associations").orderBy("order","asc").get();if(t.empty){this.hidePageLoading();return}const e=[];t.forEach(n=>{const o=n.data();o.isActive&&e.push({id:n.id,...o})}),this.renderAssociations(e),this.hidePageLoading()}catch(t){console.error("Error loading associations:",t),this.hidePageLoading()}}hidePageLoading(){const t=document.getElementById("page-loading"),e=document.getElementById("associations-container");t&&(t.style.display="none"),e&&(e.style.display="flex")}renderAssociations(t){const e={"Parish Youth Council":"pyc","Legion of Mary":"legion","Altar Servers":"altar-servers","Lectors Ministry":"liturgy","Music Ministry":"music","Extraordinary Ministers of Holy Communion":"eucharistic","Ladies Sodality":"ladies","Charismatic Prayer Group":"senior"};t.forEach(n=>{const o=e[n.title];if(o){const r=document.querySelector(`[data-tab="${o}"]`);r&&(r.textContent=n.title);const s=document.querySelector(`#${o} h2`);s&&(s.textContent=n.title);const a=document.getElementById(`${o}-content`);a&&(o==="pyc"?a.innerHTML=n.description:a.innerHTML=`<p>${n.description}</p>`)}})}setupCommunitiesInteractivity(t){let e=[];const n=document.getElementById("searchInput"),o=document.getElementById("event-cards");n.addEventListener("input",()=>r());function r(){const a=n.value.toLowerCase();e=t.filter(i=>i.name&&i.name.toLowerCase().includes(a)||i.location&&i.location.toLowerCase().includes(a)||i.ppc&&i.ppc.toLowerCase().includes(a)||i.scc&&i.scc.toLowerCase().includes(a)||i.nyg&&i.nyg.toLowerCase().replace(/['\s]/g,"").includes(a)||i.societies&&i.societies.some(d=>d.toLowerCase().includes(a))),s()}function s(){if(o.innerHTML="",e.length===0){o.innerHTML="<p>No matching communities found.</p>";return}e.forEach(a=>{const i=document.createElement("div");i.classList.add("community_card"),i.innerHTML=`
                    <div class="area-card-content">
                        <h3>${a.name||"Community"}</h3>
                        <p>${a.location||"Location not specified"}</p>
                        <p><b>PPC - </b>${a.ppc||"Not specified"}</p>
                        <p><b>SCC - </b>${a.scc||"Not specified"}</p>
                        <p><b>NYG - </b>${a.nyg||"Not specified"}</p>
                    </div>
                    <!-- Overlay -->
                    <div class="society-overlay">
                        <h4>Societies</h4>
                        <p>${a.societies&&a.societies.length>0?a.societies.map(l=>`${l}`).join("<br>"):"No societies listed"}</p>
                    </div>`,i.addEventListener("click",l=>{l.stopPropagation(),document.querySelectorAll(".community_card").forEach(p=>{p!==i&&p.classList.remove("show-overlay")}),i.classList.toggle("show-overlay")}),o.appendChild(i)}),document.addEventListener("click",a=>{a.target.closest(".community_card")||document.querySelectorAll(".community_card").forEach(i=>i.classList.remove("show-overlay"))})}r()}}function m(c){return c&&c.startsWith("http")?c:c?`https://firebasestorage.googleapis.com/v0/b/olfatimachurch-b8123.firebasestorage.app/o/${encodeURIComponent(c)}?alt=media`:"https://firebasestorage.googleapis.com/v0/b/olfatimachurch-b8123.firebasestorage.app/o/images%2Fevent.jpeg?alt=media"}document.addEventListener("DOMContentLoaded",function(){const c=window.location.pathname.split("/").pop(),t=new w;switch(c){case"index.html":case"":t.loadHomePageContent();break;case"about.html":t.loadAboutContent(),t.loadMassSchedule();break;case"parish.html":t.loadParishTeam(),t.loadParishEvents(),t.loadCommunities();const e=sessionStorage.getItem("activateTab");e&&(sessionStorage.removeItem("activateTab"),setTimeout(()=>{g(e)},500));break;case"associations.html":t.loadAssociations();break;default:t.loadHomePageContent()}});function v(c){window.location.pathname.split("/").pop()==="parish.html"||window.location.pathname.includes("parish.html")?document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>g(c)):g(c):(window.location.href="parish.html",sessionStorage.setItem("activateTab",c))}window.showTab=v;function g(c){requestAnimationFrame(()=>{const t=document.querySelector(`[data-tab="${c}"]`);if(t){document.querySelectorAll(".tab-link").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(n=>n.classList.remove("active")),t.classList.add("active");const e=document.getElementById(c);e&&e.classList.add("active")}else setTimeout(()=>{document.querySelector(`[data-tab="${c}"]`)&&g(c)},100)})}window.activateTab=g;function u(){v("articles")}window.showArticlesTab=u;function L(){try{typeof u=="function"?u():window.location.href="parish.html"}catch(c){console.error("Error handling event card click:",c),window.location.href="parish.html"}}window.handleEventCardClick=L;
