
/*-----------------------------Parish content-------------------------------*/

//team
let parish_team = {
    "title": "Parish Team",
    "content": [
        {
            "img_url": "images/event.jpeg",
            "name": "Fr. Christopher Pereira",
            "title": "Parish Priest",
            "desc": "Our parish priest leads the spiritual life of our community, celebrating Mass, administering sacraments, and providing pastoral care to all parishioners."
        },
        {
            "img_url": "images/event.jpeg",
            "name": "Fr. Ashton Pinto",
            "title": "Assistant Priest",
            "desc": "Assists the parish priest in various pastoral duties and liturgical celebrations."
        },
        {
            "img_url": "images/event.jpeg",
            "name": "Dcn. Everest Mascarenhas",
            "title": "Deacon",
            "desc": "Assists the parish priest in various pastoral duties and liturgical celebrations."
        },
    ],
};

const team_content = document.getElementById("parish-team");

team_content.innerHTML = `<h2>${parish_team.title}</h2><br><div class="event-cards">
                    ${parish_team.content.map(details => `<div class="card">
                        <img class="team-card" src="${details.img_url}" alt="${details.name}">
                        <div class="card-content">
                            <h3>${details.name}</h3>
                            <p>${details.title}</p>
                            <p>${details.desc}</p>
                        </div>
                    </div>`).join("")}
                    </div>`;


//notices
let parish_notices = {
    "title": "News/Notices",
    "content": [
        {
            "title": "July 7, 2025",
            "desc": "Parish Feast Novena begins. All are welcome!",
        },
        {
            "title": "July 7, 2025",
            "desc": "Parish Feast Novena begins. All are welcome!",
        },
        {
            "title": "July 7, 2025",
            "desc": "Parish Feast Novena begins. All are welcome!",
        },
        {
            "title": "July 7, 2025",
            "desc": "Parish Feast Novena begins. All are welcome!",
        },
        {
            "title": "July 7, 2025",
            "desc": "Parish Feast Novena begins. All are welcome!",
        },
        {
            "title": "July 7, 2025",
            "desc": "Parish Feast Novena begins. All are welcome!",
        },
    ],
};

const news_content = document.getElementById("news");

news_content.innerHTML = `<h2>${parish_notices.title}</h2><br>
                <ul class="news-list">
                    ${parish_notices.content.map(item => `<li><strong>${item.title}:</strong> ${item.desc}</li>`).join("")}
                </ul>`;


//events
let parish_events = {
    "title": "Events",
    "content": [
        {
            "title": "Easter Celebration",
            "date": "April 20, 2025",
            "author": "Parish Office",
            "images": ["images/hero.jpg", "images/event.jpeg",],
            "desc": "The Easter Celebration at OLFC includes a solemn vigil mass, a procession, choir hymns, and community fellowship. Families come together to share joy and renew their faith. After the mass, there will be refreshments in the parish hall.",
        },
        {
            "title": "Christmas Midnight Mass",
            "date": "December 24, 2024",
            "author": "Fr. Ashton",
            "images": [],
            "desc": "The Christmas Midnight Mass is one of the most awaited celebrations. It begins with carols sung by the parish choir, followed by the solemn liturgy. Families gather to celebrate, share joy, and strengthen their faith. The church is beautifully decorated for the occasion.",
        },
    ],
};
const articles_content = document.getElementById("articles");

articles_content.innerHTML = `<h2>${parish_events.title}</h2><br>
                <div class="articles-feed">
                ${parish_events.content.map(article =>
    `<div class="article-card">
                        <div class="article-header">
                            <h3>${article.title}</h3>
                            <span class="meta">${article.date} | ${article.author}</span>
                        </div>
                        ${article.images && article.images.length > 0 ?
        `<div class="article-gallery">
                            <span class="gallery-prev">&#10092;</span>
                            ${article.images.map((image, index) => `<img src=${image} alt=${article.title} class="gallery-img ${index === 0 ? 'active' : ''}">`).join("")}
                            <span class="gallery-next">&#10093;</span>
                        </div>`
        : ""
    }
                        <div class="article-description">
                            <p class="short">${article.desc.substring(0, 200)}...</p>
                            <p class="full hidden">${article.desc}</p>
                            <a href="#" class="read-more">Read more</a>
                        </div>
                    </div>`).join("")}
                </div>`;

// Gallery navigation
document.querySelectorAll(".article-card").forEach(card => {
    const images = card.querySelectorAll(".gallery-img");
    let currentIndex = 0;

    const showImage = (index) => {
        images.forEach((img, i) => img.classList.toggle("active", i === index));
    };

    const prevBtn = card.querySelector(".gallery-prev");
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });
    }

    const nextBtn = card.querySelector(".gallery-next");
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
    }

});

// Read more toggle
document.querySelectorAll(".read-more").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const desc = link.closest(".article-description");
        const short = desc.querySelector(".short");
        const full = desc.querySelector(".full");

        if (full.classList.contains("hidden")) {
            full.classList.remove("hidden");
            short.style.display = "none";
            link.textContent = "Read less";
        } else {
            full.classList.add("hidden");
            short.style.display = "block";
            link.textContent = "Read more";
        }
    });
});


//notices
let parish_communities = {
    "title": "Communities",
    "content": [
        { name: "ST. ALPHONSA", location: "Waghbil", feast_day: "date", ppc: "Darwin", scc: "Albert", families_count: "families_count", nyg: "Youth Force" },
        { name: "ST. ANTHONY", location: "Highland", feast_day: "date", ppc: "Marie", scc: "Lynn", families_count: "families_count", nyg: "God\'s Clan" },
        { name: "ST. AUGUSTINE", location: "Majiwada", feast_day: "date", ppc: "Immaculate", scc: "Christina", families_count: "families_count", nyg: "Morning Star" },
        { name: "ST. CLAIRE", location: "Dhokali", feast_day: "date", ppc: "Bensi", scc: "Vanitha", families_count: "families_count", nyg: "God\'s Clan" },
        { name: "ST. DOMINIC SAVIO", location: "Majiwada", feast_day: "date", ppc: "Precilla", scc: "Brenda", families_count: "families_count", nyg: "Morning Star" },
        { name: "ST. FAUSTINA DIVINE", location: "Hiranandani Estate", feast_day: "date", ppc: "Jacinta", scc: "John", families_count: "families_count", nyg: "Tongues of Flames" },
        { name: "ST. FRANCIS XAVIER", location: "Majiwada", feast_day: "date", ppc: "Dazina", scc: "Angelina", families_count: "families_count", nyg: "Morning Star" },
        { name: "ST. JOSEPH THE WORKER", location: "Kavesar", feast_day: "date", ppc: "Janis", scc: "Vishaka", families_count: "families_count", nyg: "Little Flower" },
        { name: "ST. JOAQUIUM & ANNE", location: "Balkum", feast_day: "date", ppc: "Stanny", scc: "Banis", families_count: "families_count", nyg: "Little Flower" },
        { name: "ST. JOHN THE BAPTIST", location: "Majiwada", feast_day: "date", ppc: "Rocky", scc: "Bona", families_count: "families_count", nyg: "Morning Star" },
        { name: "ST. JUDE", location: "Brahmand", feast_day: "date", ppc: "Gracy", scc: "Shalini", families_count: "families_count", nyg: "Tongues of Flames" },
        { name: "ST. LUKE", location: "Kolshet", feast_day: "date", ppc: "Slavia", scc: "Smita", families_count: "families_count", nyg: "God\'s Clan" },
        { name: "ST. LAWRENCE", location: "Dhokali", feast_day: "date", ppc: "Janet", scc: "Ceena", families_count: "families_count", nyg: "God\'s Clan" },
        { name: "ST. MARIE GORETTI", location: "Manorama Nagar", feast_day: "date", ppc: "Richard", scc: "Sundarama", families_count: "families_count", nyg: "Tongues of Flames" },
        { name: "ST. PETER & PAUL", location: "Majiwada", feast_day: "date", ppc: "Joulene", scc: "Mary", families_count: "families_count", nyg: "Morning Star" },
        { name: "ST. THOMAS", location: "Brahmand", feast_day: "date", ppc: "Sandra", scc: "Rupinder", families_count: "families_count", nyg: "Tongues of Flames" },
        { name: "ST. THERESA OF CHILD JESUS", location: "Lodha Paradise", feast_day: "date", ppc: "Darlette", scc: "Glen", families_count: "families_count", nyg: "Morning Star" },
        { name: "ST. VALENTINE", location: "Balkum", feast_day: "date", ppc: "Alina", scc: "Augustine", families_count: "families_count", nyg: "God\'s Clan" },
        { name: "DON BOSCO", location: "Waghbil", feast_day: "date", ppc: "Praveen", scc: "Delphine", families_count: "families_count", nyg: "Youth Force" },
        { name: "INFANT JESUS", location: "Patlipada", feast_day: "date", ppc: "Joy", scc: "Maggie", families_count: "families_count", nyg: "Youth Force" },
        { name: "MARY OUR HELP", location: "Vijaynagari", feast_day: "date", ppc: "Flora", scc: "Ellena", families_count: "families_count", nyg: "Youth Force" },
        { name: "OUR LADY OF HOPE", location: "Bhayandarpada", feast_day: "date", ppc: "Ryan", scc: "Jason", families_count: "families_count", nyg: "Little Flower" },
        { name: "OUR LADY OF IMMACULATE CONCEPTION", location: "Kolshet", feast_day: "date", ppc: "Ramona", scc: "Noreen", families_count: "families_count", nyg: "God\'s Clan" },
        { name: "OUR LADY OF MERCY", location: "RMall", feast_day: "date", ppc: "James", scc: "Flavia", families_count: "families_count", nyg: "Tongues of Flames" },
        { name: "OUR LADY OF VELLANKANI", location: "Manpada", feast_day: "date", ppc: "Rita", scc: "Roseline", families_count: "families_count", nyg: "Tongues of Flames" }
    ],
};

const communities_content = document.getElementById("communities");

communities_content.innerHTML = `<h2>${parish_communities.title}</h2><br>
                <div class="filter-container">
                    <!-- Search Bar -->
                    <input type="text" id="searchInput" placeholder="Search by name, location, PPC, SCC...">

                    <!-- Filters -->
                    <select id="locationFilter">
                        <option value="">All Locations</option>
                        <option value="Waghbil">Waghbil</option>
                        <option value="Highland">Highland</option>
                        <option value="Majiwada">Majiwada</option>
                        <option value="Dhokali">Dhokali</option>
                        <!-- Add more locations -->
                    </select>
                </div>

                <div class="event-cards" id="event-cards"></div>`;

let filteredCommunities = [];

// DOM elements
const searchInput = document.getElementById("searchInput");
const locationFilter = document.getElementById("locationFilter");

// Event listeners for search + filter
searchInput.addEventListener("input", applyFilters);
locationFilter.addEventListener("change", applyFilters);

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const location = locationFilter.value;

    // For now, just log since array is empty
    filteredCommunities = parish_communities.content.filter(area => {
        const matchesSearch =
            area.name.toLowerCase().includes(searchTerm) ||
            area.location.toLowerCase().includes(searchTerm) ||
            area.ppc.toLowerCase().includes(searchTerm) ||
            area.scc.toLowerCase().includes(searchTerm) ||
            area.nyg.toLowerCase().replace("\'", "").includes(searchTerm);

        const matchesLocation = location === "" || area.location === location;

        return matchesSearch && matchesLocation;
    });

    renderCards();
}

const container = document.getElementById("event-cards");

// Render cards in container
function renderCards() {
    container.innerHTML = ""; // clear old results

    if (filteredCommunities.length === 0) {
        container.innerHTML = "<p>No matching communities found.</p>";
        return;
    }

    filteredCommunities.forEach(area => {
        const card = document.createElement("div");
        card.classList.add("card");
        /* <h3><i>${area.families_count}</i></h3> */
        card.innerHTML =
            `<div class="area-card-content">
                <h3>${area.name}</h3>
                <p><i>${area.location}</i></p>
                <p><b>Feast Day - </b><i>${area.feast_day}</i></p>
                <p><b>PPC - </b><i>${area.ppc}</i></p>
                <p><b>SCC - </b><i>${area.scc}</i></p>
                <p><b>NYG - </b><i>${area.nyg}</i></p>
            </div>`;

        container.appendChild(card);
    });
}

// Show all by default when page loads
applyFilters();