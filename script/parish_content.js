
/*-----------------------------Parish content-------------------------------*/

//team
let parish_team = {
    "title": "Parish Team",
    "content": [
        {
            "img_url": "./images/team/parish_priest.JPG",
            "name": "Fr. Christopher Pereira",
            "title": "Parish Priest",
            "desc": "Our parish priest leads the spiritual life of our community, celebrating Mass, administering sacraments, and providing pastoral care to all parishioners."
        },
        {
            "img_url": "./images/team/assistant_priest.JPG",
            "name": "Fr. Ashton Pinto",
            "title": "Assistant Priest",
            "desc": "Assists the parish priest in various pastoral duties and liturgical celebrations."
        },
        {
            "img_url": "./images/team/deacon.JPG",
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
            "category": "All",
            "images": ["images/hero.jpg", "images/event.jpeg"],
            "desc": "The Easter Celebration at OLFC includes a solemn vigil mass, a procession, choir hymns, and community fellowship. Families come together to share joy and renew their faith. After the mass, there will be refreshments in the parish hall.",
        },
        {
            "title": "Christmas Midnight Mass",
            "date": "December 24, 2024",
            "author": "Fr. Ashton",
            "category": "All",
            "images": [],
            "desc": "The Christmas Midnight Mass is one of the most awaited celebrations. It begins with carols sung by the parish choir, followed by the solemn liturgy. Families gather to celebrate, share joy, and strengthen their faith. The church is beautifully decorated for the occasion.",
        },
        {
            "title": "Youth Retreat",
            "date": "May 15, 2025",
            "author": "Chris Ferrao",
            "category": "youth",
            "images": [],
            "desc": "The Youth Ministry of OLFC organized a vibrant retreat bringing together young members of the parish for a day filled with prayer, music, and laughter. The program began with a short prayer service, followed by engaging sessions where participants reflected on faith and personal growth. Games and team activities added an energetic spirit, helping the youth bond with one another while learning the value of teamwork and friendship. Music and hymns lifted the atmosphere, creating a balance of fun and spirituality. Group discussions allowed everyone to share experiences and challenges, deepening their understanding of how faith can guide them in everyday life. The retreat ended with a joyful celebration, leaving the youth inspired, connected, and renewed in their commitment to walk with Christ."
        },
        {
            "title": "Sunday School Annual Day",
            "date": "Feb 2, 2025",
            "author": "Sunday School Teachers",
            "category": "catechism",
            "images": [],
            "desc": "Children of Sunday School will present skits, songs, and dances as part of the Annual Day celebration. Prizes will also be distributed."
        }
    ]
};

const articles_content = document.getElementById("articles");

articles_content.innerHTML = `<h2>${parish_events.title}</h2><br>
                <div class="filter-container">
                    <!-- Filters -->
                    <select id="articleFilter">
                        <option value="All">All events</option>
                        <option value="youth">Youth</option>
                        <option value="catechism">Sunday School</option>
                        <option value="community">Community</option>
                        <option value="ppc">PPC</option>
                        <!-- Add more events -->
                    </select>
                </div>

                <div class="articles-feed" id="articles-feed"></div>`;

let filteredArticles = [];

// DOM elements
const articleFilter = document.getElementById("articleFilter");

// Event listeners for search + filter
articleFilter.addEventListener("change", applyArticleFilters);

function applyArticleFilters() {
    const article = articleFilter.value;

    // For now, just log since array is empty
    filteredArticles = parish_events.content.filter(area => {
        const matchesArticle = article === "All" || area.category === article;

        return matchesArticle;
    });

    renderArticles();
}

const articleContainer = document.getElementById("articles-feed");

// Render cards in container
function renderArticles() {
    articleContainer.innerHTML = ""; // clear old results

    if (filteredArticles.length === 0) {
        articleContainer.innerHTML = "<p>No matching articles found.</p>";
        return;
    }

    filteredArticles.forEach(article => {
        const card = document.createElement("div");
        card.classList.add("article-card");
        /* <h3><i>${area.families_count}</i></h3> */
        card.innerHTML =
            `<div class="article-header">
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
                    </div>`;

        articleContainer.appendChild(card);
    });

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
}

// Show all by default when page loads
applyArticleFilters();


//notices
let parish_communities = {
    "title": "Communities",
    "content": [
        { "name": "ST. ALPHONSA", "location": "Waghbil", "feast_day": "28 July", "ppc": "Darwin Aranha", "scc": "Albert Castelino", "families_count": "families_count", "nyg": "Youth Force", "societies": ["Om Manusmriti", "Devdarshan Phase I", "Devdarshan Phase II", "Prime Rose", "Mariegold", "Rosewood", "Lotus", "Pinewood", "Carnation", "Orchid", "Silver Oak", "Hill View"] },
        { "name": "ST. ANTHONY", "location": "Highland", "feast_day": "13 June", "ppc": "Marie Cunningham", "scc": "Lynn Braganza", "families_count": "families_count", "nyg": "God's Clan", "societies": ["Chabhaiya Park", "Cosmos Habitat", "Rewale Talao", "Vardhaman Gardens", "JVM Orchid", "Sai Darshan Complex", "Shri Ganesh Prasad Apartments", "Kailash Nagar", "Yashasvi Nagar", "MHADA Colony", "Brighton", "Yamuna Apartments", "Brighland CHS (Phase 1 & 2)", "Shreenath Park", "Kalpavriksha Gardens", "Highland Annex", "Highland Residency (Phase 1 & 2)", "Twinkle Towers", "Highland Gardens", "Highland Springs", "The Icon"] },
        { "name": "ST. AUGUSTINE", "location": "Majiwada", "feast_day": "28 August", "ppc": "Immaculate Fernandes", "scc": "Christina Curel", "families_count": "families_count", "nyg": "Morning Star", "societies": ["Kalpataru Towers", "Vailankanni Building", "Curel house (Old Kannada School)", "178, Dumu Munes house", "Gajkesari Bulding", "Silver Arcade", "Sai Ganesh Darshan", "Gulmohar Tower", "Yash Plaza", "Mavli Apartment", "Shiv darshan", "New Indrajeet Apartment", "New Raje Apartment", "New Parijat Building", "173, Curel House", "Durga Parmeshwari CHS", "Om Guru Darshan"] },
        { "name": "ST. CLAIRE", "location": "Dhokali", "feast_day": "15 August (Assumption of St. Claire)", "ppc": "Bensi Michael", "scc": "Vanitha Xavier", "families_count": "families_count", "nyg": "God's Clan", "societies": ["Dhokali Gaun", "Swami Krupa", "Vakrathunda"] },
        { "name": "ST. DOMINIC SAVIO", "location": "Majiwada", "feast_day": "6 May", "ppc": "Precilla Dias", "scc": "Brenda Ferrao", "families_count": "families_count", "nyg": "Morning Star", "societies": ["Khan Sadan", "Bent Cottage", "Abode Residency", "Orchids Complex", "Jaydeep Park A B C", "Bharat Tower", "Sachinam", "Hill View", "Runwal Bldg", "Parmeshwari Paradise B and C", "Shiv Sai Paradise A, B, C,D,E,F"] },
        { "name": "ST. FAUSTINA DIVINE", "location": "Hiranandani Estate", "feast_day": "5 October", "ppc": "Jacinta Sequiera", "scc": "", "families_count": "families_count", "nyg": "Tongues of Flames", "societies": ["Capri", "Cassia", "Caviana", "Greenwich", "Tribeca A, B", "Broadway", "Eden 1, 2", "Hillgrange A, B, C", "Park Plaza", "Stanford", "Waldorf", "Polaris A, B", "Princeton A, B", "Springhill", "Wellington", "Avon", "Crown", "Fiona", "FLORA A, B, C", "Carlton", "Bhoomi Acres - Phase I, Phase-II", "FERNS OROVIA, WAGHBILL", "INDIGO VIJAY OROVIAM WAGHBIL", "PALACIA, HIRANANDANI", "Rosa Oasis", "VIJAY ORIVIA VIJAY NAGARI", "VIJAY OROVIAM WAGHBIL", "EAGLERIDGE OPP. KENORA", "Kenora", "ARALIA", "ARALIA FORTUNANEAR PLANET HOLIWOOD", "ARALIA. HIRANANDANI ESTATE", "Pelican", "Pelican, SKY LARK HIRANANDANI", "Solitaire", "Winona", "BANKSTON", "CARDINAL", "Cardinal", "EVA RODAS", "Paloma", "Rodas - Royce", "Rodas - Sanrays", "WOODVILLE RODAS ENCLAVE", "Burlington", "Canary", "FEDORA", "Gold Craft", "Lavinia CHS", "Riviera", "Villa rica", "VILLA ROYAL", "FORTUNA WALK", "VENTANA, WALK", "Valentina", "Vittoria WALK", "BWING CASTALIA THE WALK", "Phoenix", "ENGLEWOOD, HIRANANDANI", "Spenta", "Eureka", "Apollo A, B, C", "ASTRA", "Casa Marina", "Jasper", "Queens Gate", "ROCK CASTLE, PLATINUM HERITAGE"] },
        { "name": "ST. FRANCIS XAVIER", "location": "Majiwada", "feast_day": "3 December", "ppc": "Dazina Serrao", "scc": "Angelina D'Souza", "families_count": "families_count", "nyg": "Morning Star", "societies": [] },
        { "name": "ST. JOSEPH THE WORKER", "location": "Anand Nagar", "feast_day": "1 May", "ppc": "Janis Gomes", "scc": "David J  Kanjiraparayil", "families_count": "families_count", "nyg": "Little Flower", "societies": ["Lalani Residency", "Kanchanpusph Complex", "Coral Heights", "Cosmos Park", "Sadguru Gardens", "Swastik Residency", "Vijay Garden", "Vijay Vatika", "Vijay Vilas", "Vijay Residency", "Vijay Orion", "Siddhi CHSL", "Purushottam Park", "Regency Towers", "Sai Baba Vihar Complex", "Panchamrut", "Charnamrut", "Soman House", "Unique Greens", "Cosmos Jewels", "Rutu Enclave", "Unnati Woods", "Sukur Sapphire", "Aakruti Aangan", "Shree Srushti CHSL", "Sanghvi Hills", "Bhawani Nagar", "Grand Square", "Bhakti Park", "Park View", "Ratnatej Tower", "Saket Nagari", "Sukur Residency", "Sukur Enclave", "Green Square Residency", "Sagar Residency", "Parkwoods"] },
        { "name": "ST. JOAQUIM & ANNE", "location": "Balkum", "feast_day": "26 July", "ppc": "Stanny Dmello", "scc": "Banis Fernandes", "families_count": "families_count", "nyg": "Little Flower", "societies": [] },
        { "name": "ST. JOHN THE BAPTIST", "location": "Majiwada", "feast_day": "24 June", "ppc": "Rocky D'souza", "scc": "Bona Rodrigues", "families_count": "families_count", "nyg": "Morning Star", "societies": ["Sai Aditya CHS", "Samruddhi Apartment", "Kashinath Mulundkar Chawl", "D'Souza Villa", "William Mansion", "Sydney Ver House", "Cathrine Gomes Building", "Mathew Villa", "Sai Deep Building", "Esther Mansion", "Krishna Koyna Building", "Rayon Apartment", "Sebastine Ver House", "Royal Corner Building", "Mariam Apartments"] },
        { "name": "ST. JUDE", "location": "Brahmand", "feast_day": "28 October", "ppc": "Gracy David", "scc": "Shalini Dsouza", "families_count": "families_count", "nyg": "Tongues of Flames", "societies": [] },
        { "name": "ST. LUKE", "location": "Kolshet", "feast_day": "18 October", "ppc": "Slavia Monterio", "scc": "Smita Dcosta", "families_count": "families_count", "nyg": "God's Clan", "societies": ["Cosmos Nest", "Kavya Dhara", "Siddeshwar Garden", "Everest World", "Solitaire", "Viraj Green Valley", "Pride Palms", "Platina", "Lodha Sterling"] },
        { "name": "ST. LAWRENCE", "location": "Dhokali", "feast_day": "10 August", "ppc": "Janet Sequiera", "scc": "Ceena Binu", "families_count": "families_count", "nyg": "God's Clan", "societies": ["Ashar Sapphire", "Highland park", "Vardhaman Vatika", "Ashar Enclave", "Shrey Anand", "Shruti Park", "Dev Ashish", "Sukur Garden", "Swami Krupa Phase 2"] },
        { "name": "ST. MARIE GORETTI", "location": "Manorama Nagar", "feast_day": "6 July", "ppc": "", "scc": "Sundarama Verappogu", "families_count": "families_count", "nyg": "Tongues of Flames", "societies": [] },
        { "name": "ST. PETER & PAUL", "location": "Majiwada", "feast_day": "29 June", "ppc": "Joulene Chettiar", "scc": "Mary Pereira", "families_count": "families_count", "nyg": "Morning Star", "societies": [] },
        { "name": "ST. THOMAS", "location": "Brahmand", "feast_day": "3 July", "ppc": "Sandra Joseph", "scc": "Rupinder Pereira", "families_count": "families_count", "nyg": "Tongues of Flames", "societies": ["Shreeji Splendor", "Brahmand all phases", "Swatik Palms", "Vaibhav Laxmi", "Nandanvan", "TMC Building", "Raj Ratna Park", "Prakruti Park", "Charms Residency", "Raj Residency", "Kabra Galaxy", "Swastik Enclave"] },
        { "name": "ST. THERESA OF CHILD JESUS", "location": "Lodha Paradise", "feast_day": "1 October", "ppc": "Darlette Menezes", "scc": "Glen Crasto", "families_count": "families_count", "nyg": "Morning Star", "societies": ["Astrea, Rustomjee", "Rustomjee Athena", "Shivneri Society", "Vaibhav Villas", "Vesta,Lodha Paradise", "Athene ,Lodha Paradise", "Aristo,Lodha Paradise", "Aphrodite,Lodha Paradise", "Fortuna,Lodha Paradise", "Olympia,Lodha Paradise", "Jupiter,Lodha Paradise", "Atlas, Lodha Paradise", "Valentina,VFVA Society", "Florentina,VFVA Society", "Victoria,VFVA Society", "Alexandra,VFVA Society", "Odyssey ,Lodha Paradise", "Maximus,Lodha Paradise", "Hercules,Lodha Paradise", "Iris,Lodha Paradise", "Westgate,Lodha Luxuria", "Fairfield, Lodha Luxuria", "Claremont ,Lodha Luxuria", "Copernicus,Lodha Priva", "Michelangelo, Lodha Priva", "Govanni, Lodha Priva", "Lodha Crown Viva", "Lodha Casa Viva", "Lodha Crown Quality Homes"] },
        { "name": "ST. VALENTINE", "location": "Balkum", "feast_day": "14 February", "ppc": "Alina Florence", "scc": "Augustine Coutinho", "families_count": "families_count", "nyg": "God's Clan", "societies": ["Raheja complex", "Dadlani Park", "Ashok Nagar", "Willows", "Shivlok", "Gajanan Park", "Runwal eirene", "Runwal garden", "Lodha regalia", "Highland haven", "Dosti west County, balkum", "Piramal vaikunth, balkum", "Ng regency"] },
        { "name": "DON BOSCO", "location": "Waghbil", "feast_day": "31 January", "ppc": "Praveen Rodriques", "scc": "Delphine Mendonca", "families_count": "families_count", "nyg": "Youth Force", "societies": ["VASANT LEELA"] },
        { "name": "INFANT JESUS", "location": "Patlipada", "feast_day": "25 December", "ppc": "Joy Chozhiyath", "scc": "Maggie Joy", "families_count": "families_count", "nyg": "Youth Force", "societies": [] },
        { "name": "MARY OUR HELP", "location": "Vijaynagari", "feast_day": "24 May", "ppc": "Flora Periera", "scc": "Ellena Lazrado", "families_count": "families_count", "nyg": "Youth Force", "societies": ["Aakar Residency", "Amruta", "Anunagar", "Cosmos Regency", "Cosmos Residency", "Fufane Compound/Kingkong Nagar", "Galaxy Tower", "Gangotri Glacier", "Green Acres I", "Green Acres II", "Green Acres III", "Manas Anand", "Om Sai Chawl", "Pooja Galaxy", "Pooja Pushp", "Prachi, Shri Sai Shradha CHS", "Sukhsagar Residency", "Swastik Regalia", "Vijay Enclave", "Vijay Galaxy Tower", "Vijay Nagari"] },
        { "name": "OUR LADY OF HOPE", "location": "Kasarvadavali", "feast_day": "24 August", "ppc": "Rayan Britto", "scc": "Jason Monis", "families_count": "families_count", "nyg": "Little Flower", "societies": ["Vijay Park, Yashraj Park, Shree Shrusthi, Everest Countryside, Hoizon Prime, Metropolis Aquaris, Metropolis Rivera, Ace Square, Cosmos Enclave, Rosa Classique, Manas Residency", "Krishna Greenland, Puranik City, Haware Estate, Cosmos Springs, Vegas Plaza, Fiama Residency, Horizon Classique, Kailash Tower, Sree Prastha", "Lodha Splendora, Imperial Square, Sudarshan Sky Heights", "Kavya Residency, Pride Residency, Haware Citi, Platinum Lawns, Atlantis, Unnati Greens, Tokyo Bay, Sarvam, Raunak Heights, Vihang Valley, Mahavir Kalpavriksha, Parijat Gardens, Rosa Gardenia, Ace Avenue, Ashok Smruti, Harmony Horizon, Dedhia Elita, Pushpanjali Residency, Horizon Palms, Vihang Hills, JVM Sky Court, Godej Emerald, Rumah Bali, Puranik Hometown,"] },
        { "name": "OUR LADY OF IMMACULATE CONCEPTION", "location": "Kolshet", "feast_day": "8 December", "ppc": "Ramona Tellis", "scc": "Noreen Fernandes", "families_count": "families_count", "nyg": "God's Clan", "societies": ["Kalpataru Sunrise", "Kalpataru Immensa", "Lodha Amara", "Devashree", "Yashodeep", "Sripath Sadan Bldg", "Pange Chawl", "Indraprast Bldg", "Dasrath Patil Chawl"] },
        { "name": "OUR LADY OF MERCY", "location": "RMall", "feast_day": "24 September", "ppc": "James D'souza", "scc": "Flavia Bonamis", "families_count": "families_count", "nyg": "Tongues of Flames", "societies": ["Runwal Estate", "Runwal Pearl", "Pride Park"] },
        { "name": "OUR LADY OF VELLANKANI", "location": "Manpada", "feast_day": "8 September", "ppc": "Rita Mani", "scc": "Roseline Kaundar", "families_count": "families_count", "nyg": "Tongues of Flames", "societies": ["Sahyog complex", "Soham Garden", "Azad Nagar area", "Manpada Area"] }
    ]
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
            area.societies.some(soc => soc.toLowerCase().includes(searchTerm)) ||
            area.nyg.toLowerCase().replace(/['\s]/g, "").includes(searchTerm);

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
        card.classList.add("community_card");
        /* <h3><i>${area.families_count}</i></h3> */
                // <p><b>Feast Day - </b>${area.feast_day}</p>
        card.innerHTML =
            `<div class="area-card-content">
                <h3>${area.name}</h3>
                <p>${area.location}</p>
                <p><b>PPC - </b>${area.ppc}</p>
                <p><b>SCC - </b>${area.scc}</p>
                <p><b>NYG - </b>${area.nyg}</p>
            </div>
            <!-- Overlay -->
            <div class="society-overlay">
                <h4>Societies</h4>
                <p>${area.societies.map(name => `${name}`).join("<br>")}</p>
            </div>`;

        // Toggle overlay on card tap
        card.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent event bubbling
            const allCards = document.querySelectorAll(".community_card");

            // Close all other overlays
            allCards.forEach(c => {
                if (c !== card) c.classList.remove("show-overlay");
            });

            // Toggle this card’s overlay
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