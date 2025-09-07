// Render Site Title
document.getElementById("site-title").textContent =
  getSiteContent("siteMeta.title");

// Hero Section
document.getElementById("hero-title").textContent =
  getSiteContent("siteMeta.title");
document.getElementById("hero-tagline").textContent =
  getSiteContent("siteMeta.tagline");
document.getElementById("hero-buttons").innerHTML =
  getSiteContent("hero.buttons")
    .map(b => `<a href="${b.url}" class="btn ${b.style}">${b.text}</a>`)
    .join("");

// Parish Intro
document.getElementById("parish-intro").innerHTML =
  getSiteContent("parish.introLines")
    .map(line => `<p>${line}</p>`)
    .join("");

// Events
document.getElementById("events").innerHTML =
  getSiteContent("events")
    .map(
      e => `
      <div class="card">
        <img class="event-card" src="${e.img}" alt="${e.title}">
        <div class="card-content">
          <h3>${e.title}</h3>
          <p>${e.date}</p>
          <p>${e.desc}</p>
        </div>
      </div>`
    )
    .join("");

// Gallery
document.getElementById("gallery").innerHTML =
  getSiteContent("gallery")
    .map(
      g => `<div class="card"><img src="${g.img}" alt="${g.alt}"></div>`
    )
    .join("");

// Contact Info
document.getElementById("contact-info").innerHTML =
  `<h3>${getSiteContent("contact.title")}</h3>
   <p>${getSiteContent("contact.address").join("<br>")}</p>
   <p><b>Phone:</b> ${getSiteContent("contact.phone")}</p>
   <p><b>Email:</b><br>${getSiteContent("contact.emails").join("<br>")}</p>`;

// Footer
document.getElementById("footer-text").textContent =
  getSiteContent("footer.text");
