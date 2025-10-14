/*-----------------------------Home content-------------------------------*/

//hero
let index_hero = {
    "title": "A Community of Faith and Love"
};

const hero_content = document.getElementById("hero-content");

{/* <a href="parish.html" class="btn btn-dark">Latest News</a> */}
{/* <h1>${index_hero.title}</h1> */}
                
hero_content.innerHTML = `<h1>${index_hero.title}</h1>
                <div class="hero-buttons">
                    <a href="about.html" class="btn btn-light">Our History</a>
                </div>`;

//welcome
let index_welcome = {
    "title": "Welcome to Our Parish",
    "content": [
        "Our Lady of Fatima Church is situated off the Ghodbunder Road at the Majiwada Junction. Around a thousand families reside in this parish which is divided into 24 Small Christian Communities.",
        "Voluntary Church organizations, cells and groups such as Sodality, SVP, Senior Citizens Group, HR Cell, Family Cell, Communications Cell, Prison Ministry, Choir, Extraordinary Ministers of Holy Communion, Social Justice Cell, Legion of Mary, Pre-baptismal Catechesis Team, Lector's Ministry, Sunday School Teachers and Bombay Catholic Sabha work in assigned areas to support the Priest in Charge in Church functions.",
        "A Parish Pastoral Council and an Executive Committee perform the consultative function in administrative duties of the Parish. Other committees such as the Finance Committee, Cemetery Committee are appointed to assist the Priest in Charge.",
        "This site is launched with the purpose of providing a platform for communication between the church and the faithful. The communications cell is committed to keep this site updated with the current information for the benefit of the faithful and others who wish to know about our parish and its activities."
    ]
};

const welcome_content = document.getElementById("welcome-content");

welcome_content.innerHTML = `<h2>${index_welcome.title}</h2>
                ${index_welcome.content.map(para => `<p>${para}</p>`).join("")}`

//upcoming events
let index_events = {
    "title": "Events",
    "content": [
        {
            "url": "images/event.jpeg",
            "name": "Easter Mass",
            "date": "April 20, 2025 | 6:00 PM",
            "description": "Join us for the celebration of the mass"
        },
        {
            "url": "images/event.jpeg",
            "name": "Easter Mass",
            "date": "April 20, 2025 | 6:00 PM",
            "description": "Join us for the celebration of the mass"
        },
        {
            "url": "images/event.jpeg",
            "name": "Easter Mass",
            "date": "April 20, 2025 | 6:00 PM",
            "description": "Join us for the celebration of the mass"
        },
        {
            "url": "images/event.jpeg",
            "name": "Easter Mass",
            "date": "April 20, 2025 | 6:00 PM",
            "description": "Join us for the celebration of the mass"
        }
    ]
};

const events_content = document.getElementById("events-content");

events_content.innerHTML = `<h2>${index_events.title}</h2>
                <div class="event-cards">
                ${index_events.content.map(events => `<div class="card">
                    <img class="event-card" src=${events.url} alt=${events.name}>
                    <div class="card-content">
                        <h3>${events.name}</h3>
                        <p>${events.date}</p>
                        <p>${events.description}</p>
                    </div>
                </div>`).join("")}
                </div>`;

//Parish Gallery
// let index_gallery = {
//     "title": "Parish Gallery",
//     "content": [
//         {
//             "url": "images/event.jpeg",
//             "name": "Coming Soon...",
//         },
//     ]
// };

// const gallery_content = document.getElementById("gallery-grid");

// gallery_content.innerHTML = `<h2>${index_gallery.title}</h2>
//                 <div class="gallery-wrapper">
//                     <button class="scroll-btn left" onclick="scrollGallery(-1)">&#10094;</button>
//                     <div class="gallery-row" id="galleryRow">
//                         ${index_gallery.content.map((content, index) => `<div class="gallery-card"><img src=${content.url} alt=${content.name}
//                             onclick="openLightbox(${index})"></div>`).join("")}
//                             </div>
//                     <button class="scroll-btn right" onclick="scrollGallery(+1)">&#10095;</button>
//                     </div>`;

// let currentIndex = 0;

// function scrollGallery(direction) {
//     const row = document.getElementById("galleryRow");
//     const cardWidth = row.querySelector(".gallery-card").offsetWidth + 16; // card + gap
//     row.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
// }

// function openLightbox(index) {
//     currentIndex = index;
//     document.getElementById("lightbox").style.display = "flex";
//     document.getElementById("lightbox-img").src = index_gallery.content[currentIndex].url;
// }

// function closeLightbox() {
//     document.getElementById("lightbox").style.display = "none";
// }

// function changeSlide(direction) {
//     currentIndex = (currentIndex + direction + index_gallery.content.length) % index_gallery.content.length;
//     document.getElementById("lightbox-img").src = index_gallery.content[currentIndex].url;
// }
