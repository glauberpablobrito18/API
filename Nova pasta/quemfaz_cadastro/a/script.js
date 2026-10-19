const $ = (selector) => document.querySelector(selector);

function applyPageConfig() {
  $("#eyebrow").textContent = PAGE_CONFIG.eyebrow;
  $("#heroTitle").innerHTML = `${escapeHtml(PAGE_CONFIG.titleStart)} <span>${escapeHtml(PAGE_CONFIG.titleHighlight)}</span>`;
  $("#heroDescription").textContent = PAGE_CONFIG.description;
  $("#serviceInput").placeholder = PAGE_CONFIG.servicePlaceholder;
  $("#locationInput").value = PAGE_CONFIG.locationDefault;
  $("#statOne").textContent = PAGE_CONFIG.statOne;
  $("#statOneLabel").textContent = PAGE_CONFIG.statOneLabel;
  $("#statTwo").textContent = PAGE_CONFIG.statTwo;
  $("#statTwoLabel").textContent = PAGE_CONFIG.statTwoLabel;
  $("#availabilityTitle").textContent = PAGE_CONFIG.availabilityTitle;
  $("#availabilitySubtitle").textContent = PAGE_CONFIG.availabilitySubtitle;
  $("#listTitle").textContent = PAGE_CONFIG.listTitle;
  $("#heroImage").src = PAGE_CONFIG.heroImage;
  $("#heroImage").alt = PAGE_CONFIG.titleHighlight.replace(".", "");
  $("#year").textContent = new Date().getFullYear();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function renderProfessionals(list) {
  const grid = $("#professionalGrid");
  grid.innerHTML = "";
  $("#emptyState").hidden = list.length !== 0;

  list.forEach((person) => {
    const available = person.status === "available";
    const card = document.createElement("article");
    card.className = "professional-card";
    card.dataset.status = person.status;
    card.dataset.rating = person.rating;
    const avatar = person.image
      ? `<img src="${escapeHtml(person.image)}" alt="" loading="lazy" onerror="this.parentElement.textContent='${escapeHtml(person.initials)}'">`
      : escapeHtml(person.initials);
    card.innerHTML = `
      <div class="card-top">
        <div class="avatar">${avatar}</div>
        <div>
          <h3 class="professional-name">${escapeHtml(person.name)}</h3>
          <p class="professional-role">${escapeHtml(person.role)}</p>
        </div>
        <span class="card-rating">★ ${escapeHtml(person.rating)} <span style="color:#969087">(${escapeHtml(person.reviews)})</span></span>
      </div>
      <div class="card-details">
        <span>⌖ ${escapeHtml(person.city)}</span>
        <span>◷ ${escapeHtml(person.experience)}</span>
      </div>
      <div class="card-status ${available ? "" : "unavailable"}"><i></i>${escapeHtml(person.statusText)}</div>
      <div class="card-footer">
        <div><span class="price-label">Valor do serviço</span><strong class="price">${escapeHtml(person.price)}</strong></div>
        <button class="contact-button" type="button" data-contact="${escapeHtml(person.contact)}">Ver contato ↗</button>
      </div>`;
    grid.appendChild(card);
  });
}

let currentFilter = "all";
function updateResults() {
  const term = $("#serviceInput").value.trim().toLocaleLowerCase("pt-BR");
  const city = $("#locationInput").value.trim().toLocaleLowerCase("pt-BR");
  const results = PAGE_CONFIG.professionals.filter((person) => {
    const searchable = `${person.name} ${person.role} ${person.city} ${person.experience}`.toLocaleLowerCase("pt-BR");
    const matchesTerm = !term || searchable.includes(term);
    const matchesCity = !city || person.city.toLocaleLowerCase("pt-BR").includes(city) || city.includes("santa inês") && person.city.toLocaleLowerCase("pt-BR").includes("santa inês");
    const matchesFilter = currentFilter === "all" ||
      (currentFilter === "available" && person.status === "available") ||
      (currentFilter === "top" && Number(person.rating) >= 4.8);
    return matchesTerm && matchesCity && matchesFilter;
  });
  renderProfessionals(results);
  $("#searchFeedback").textContent = `${results.length} profissional(is) encontrado(s).`;
}

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  updateResults();
  $("#profissionais").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("selected"));
    button.classList.add("selected");
    currentFilter = button.dataset.filter;
    updateResults();
  });
});

$("#professionalGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-contact]");
  if (!button) return;
  const contact = button.dataset.contact;
  alert(`Contato demonstrativo: ${contact}\n\nSubstitua esse comportamento pelo WhatsApp ou sistema de contato real da sua plataforma.`);
});

$("#menuToggle").addEventListener("click", () => {
  const nav = document.querySelector(".main-nav");
  const opened = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(opened));
});

applyPageConfig();
renderProfessionals(PAGE_CONFIG.professionals);
