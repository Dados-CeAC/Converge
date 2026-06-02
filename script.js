document.addEventListener("DOMContentLoaded", () => {
  const iconMap = {
    "Meus Sistemas": "ti-apps",
    Administrativo: "ti-settings",
    Assistencial: "ti-hospital",
    Gerenciamento: "ti-adjustments",
    Indicadores: "ti-chart-bar",
    Colaborador: "ti-users",
  };
  const cardIconMap = {
    HCMED: "ti-stethoscope",
    "InterRad Internados": "ti-building-hospital",
    "Painel MV": "ti-layout-dashboard",
    "Parecer GLPI NATS": "ti-clipboard-list",
    "Sistema de Manutenção DE-PARA - Clínicas x Setores":
      "ti-arrows-transfer-up",
    "Gerenciador de Sistemas": "ti-settings-2",
    PIH: "ti-chart-pie",
    "Linha de Cuidados": "ti-heart-pulse",
    "Programa de Rastreio": "ti-search",
    "Pronto Atendimento": "ti-ambulance",
    "Controles Internos": "ti-file-check",
    Comunicação: "ti-message",
    "Apoio Predial": "ti-building",
    "Segurança do Trabalho": "ti-shield-check",
    "Saúde Ocupacional": "ti-user-check",
  };

  const screeningIcons = {
    cervix: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="15" r="7"></circle>
        <path d="M24 22v18"></path>
        <path d="M16 32h16"></path>
        <path d="M15 40c2.5-4 5.5-6 9-6s6.5 2 9 6"></path>
      </svg>
    `,
    prostate: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="19" cy="18" r="8"></circle>
        <path d="M25 12h11v11"></path>
        <path d="M25 12l11 11"></path>
        <path d="M24 31c3-2 7-2 10 0"></path>
        <path d="M18 31c-1.5 3-1.5 6 0 9"></path>
        <path d="M30 31c1.5 3 1.5 6 0 9"></path>
      </svg>
    `,
    colorectal: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M16 9c-4 3-6 8-6 15 0 9 4 15 10 15 4 0 7-3 7-7 0-3-2-5-5-5h-3"></path>
        <path d="M32 9c4 3 6 8 6 15 0 9-4 15-10 15-4 0-7-3-7-7 0-3 2-5 5-5h3"></path>
        <path d="M24 10v14"></path>
        <path d="M17 18h14"></path>
      </svg>
    `,
    breast: `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M18 8c5 7 7 12 6 18-1 7-5 11-11 14"></path>
        <path d="M30 8c-5 7-7 12-6 18 1 7 5 11 11 14"></path>
        <path d="M15 12c6 2 12 2 18 0"></path>
        <path d="M19 27c3-2 7-2 10 0"></path>
      </svg>
    `,
  };

  const programaRastreioCards = [
    { name: "CA Colo Útero", svg: screeningIcons.cervix },
    { name: "CA Próstata", svg: screeningIcons.prostate },
    { name: "CA Colorretal", svg: screeningIcons.colorectal },
    { name: "CA Mama", svg: screeningIcons.breast },
  ];
  function getItemLabel(item) {
    return typeof item === "string" ? item : item.label || "";
  }
  function getItemChildren(item) {
    return typeof item === "object" && Array.isArray(item.children) ? item.children : [];
  }

  let sections = [
    { id: 1, name: "Meus Sistemas", items: ["SoulMV", "MVPEP", "PIH", "HCMED", "Interrad", "Portal RH FFM", "Natcorp"] },
    { id: 2, name: "Administrativo", items: ["Controles Internos", "Comunicação", "Apoio Predial"] },
    { id: 5, name: "Indicadores", items: ["PIH"] },
    { id: 7, name: "Assistencial", items: ["Linha de Cuidados", "Programa de Rastreio", "Pronto Atendimento"] },
    { id: 8, name: "Ocupacional", items: ["Segurança do Trabalho", "Saúde Ocupacional"] },
    { id: 9, name: "Qualidade", items: [] },
    { id: 10, name: "Dados", items: [] },
    { id: 11, name: "Projetos", items: [] },
  ];

  let activeSection = 1;
  let activeCard = null;
  let collapsed = false;
  let nextId = 10;

  function getIcon(name) {
    return iconMap[name] || "ti-folder";
  }
  function getCardIcon(name) {
    return cardIconMap[name] || "ti-app-window";
  }

  function render() {
    const mc = document.getElementById("menuContainer");
    mc.innerHTML = "";
    sections.forEach((sec) => {
      const wrap = document.createElement("div");
      wrap.className = "menu-section";

      const hdr = document.createElement("div");
      hdr.className = "section-header";
      hdr.classList.toggle("active", activeSection === sec.id);
      hdr.innerHTML = `
				<div class="section-title">
					<i class="ti ${getIcon(sec.name)}"></i>
					<span class="section-title-text">${sec.name}</span>
				</div>
			`;
      hdr.addEventListener("click", () => {
        activeSection = sec.id;
        activeCard = null;
        render();
        renderCards();
      });
      wrap.appendChild(hdr);
      mc.appendChild(wrap);
    });

    renderCards();
  }

  function renderCards() {
    const sec = sections.find((s) => s.id === activeSection);
    const grid = document.getElementById("cardsGrid");
    const empty = document.getElementById("emptyState");
    const title = document.getElementById("dispPageTitle");

    if (!sec) {
      grid.innerHTML = "";
      empty.style.display = "flex";
      return;
    }

    title.textContent = sec.name;

    const items = sec.items;
    const cards = items.map((name) => ({ name, icon: getCardIcon(name) }));

    if (cards.length === 0) {
      grid.innerHTML = "";
      empty.style.display = "flex";
      return;
    }

    empty.style.display = "none";
    grid.innerHTML = "";

    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "sys-card" + (cardData.svg ? " screening-card" : "");

      const iconEl = document.createElement(cardData.svg ? "div" : "i");
      if (cardData.svg) {
        iconEl.className = "sys-card-icon";
        iconEl.innerHTML = cardData.svg;
      } else {
        iconEl.className = "ti " + (cardData.icon || getCardIcon(cardData.name));
      }

      const nameEl = document.createElement("div");
      nameEl.className = "sys-card-name";
      nameEl.textContent = cardData.name;

      const catEl = document.createElement("div");
      catEl.className = "sys-card-cat";
      catEl.textContent = sec.name;

      card.appendChild(iconEl);
      card.appendChild(nameEl);
      card.appendChild(catEl);

      card.classList.toggle("active", activeCard === cardData.name);
      card.addEventListener("click", () => {
        activeCard = cardData.name;
        renderCards();
      });

      grid.appendChild(card);
    });
  }
  

  function toggleSidebar() {
    collapsed = !collapsed;
    document.getElementById("sidebar").classList.toggle("collapsed", collapsed);
    document.getElementById("toggleIcon").className =
      "ti " + (collapsed ? "ti-chevrons-right" : "ti-chevrons-left");
  }

  function updateUser(val) {
    document.getElementById("dispUser").textContent = val;
    const initials =
      val
        .split(".")
        .map((p) => p[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 2) || "HC";
    document.getElementById("avatarEl").textContent = initials;
  }

  function updateTitle(val) {
    document.getElementById("dispPageTitle").textContent = val;
  }

  function updateFooter(val) {
    const parts = val.split(" ");
    const first = parts.shift();
    document.getElementById("footerEl").innerHTML =
      `<span class="brand">${first}</span> ${parts.join(" ")}`;
  }

  function openAddCard() {
    const sel = document.getElementById("cardSection");
    sel.innerHTML = sections
      .map((s) => `<option value="${s.id}">${s.name}</option>`)
      .join("");
    sel.value = activeSection;
    document.getElementById("cardName").value = "";
    openModal("modalCard");
  }

  function confirmAddCard() {
    const name = document.getElementById("cardName").value.trim();
    const secId = parseInt(document.getElementById("cardSection").value);
    if (!name) return;
    const sec = sections.find((s) => s.id === secId);
    if (sec && !sec.items.includes(name)) {
      sec.items.push(name);
      activeSection = secId;
    }
    closeModal("modalCard");
    render();
  }

  function openAddSection() {
    document.getElementById("sectionName").value = "";
    openModal("modalSection");
  }

  function confirmAddSection() {
    const name = document.getElementById("sectionName").value.trim();
    if (!name) return;
    sections.push({ id: nextId++, name, items: [] });
    closeModal("modalSection");
    render();
  }

  function openModal(id) {
    document.getElementById(id).classList.add("show");
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove("show");
  }

  document.querySelectorAll(".modal-overlay").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target === el) el.classList.remove("show");
    });
  });

  const attachListeners = () => {
    const toggleBtn = document.getElementById("toggleBtn");
    if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);

    const themeToggleBtn = document.getElementById("themeToggleBtn");
    if (themeToggleBtn)
      themeToggleBtn.addEventListener("click", cycleThemeMode);

    const modalCardCancel = document.getElementById("modalCardCancel");
    if (modalCardCancel)
      modalCardCancel.addEventListener("click", () => closeModal("modalCard"));
    const modalCardAdd = document.getElementById("modalCardAdd");
    if (modalCardAdd) modalCardAdd.addEventListener("click", confirmAddCard);

    const modalSectionCancel = document.getElementById("modalSectionCancel");
    if (modalSectionCancel)
      modalSectionCancel.addEventListener("click", () =>
        closeModal("modalSection"),
      );
    const modalSectionAdd = document.getElementById("modalSectionAdd");
    if (modalSectionAdd)
      modalSectionAdd.addEventListener("click", confirmAddSection);
  };

  attachListeners();

  
  const DOC = document.documentElement;
  const themeModes = ["default", "dark", "high-contrast"];
  const themeLabels = {
    default: "Padrão",
    dark: "Modo Escuro",
    "high-contrast": "Alto Contraste",  
  };

  function clearModeClasses() {
    ["mode-dark", "mode-high-contrast"].forEach((c) => DOC.classList.remove(c));
  }

  function updateThemeButton(mode) {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    const label = `Modo: ${themeLabels[mode] || themeLabels.default}`;
    const textEl = btn.querySelector("span");
    if (textEl) {
      textEl.textContent = label;
    } else {
      btn.textContent = label;
    }
  }

  function setTheme(mode) {
    clearModeClasses();
    if (!mode || mode === "default") {
      localStorage.removeItem("site:themeMode");
      updateThemeButton("default");
      return;
    }
    DOC.classList.add("mode-" + mode);
    localStorage.setItem("site:themeMode", mode);
    updateThemeButton(mode);
  }

  function cycleThemeMode() {
    const current = localStorage.getItem("site:themeMode") || "default";
    const next =
      themeModes[(themeModes.indexOf(current) + 1) % themeModes.length];
    setTheme(next);
  }

  function applyStoredPreferences() {
    const mode = localStorage.getItem("site:themeMode") || "default";
    clearModeClasses();
    if (mode && mode !== "default") DOC.classList.add("mode-" + mode);
    updateThemeButton(mode);
  }

  applyStoredPreferences();
  render();
});

function resetIdentity() {
  localStorage.removeItem("site:themeMode");
 
  const DOC = document.documentElement;
  ["mode-dark", "mode-high-contrast"].forEach((c) => DOC.classList.remove(c));
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    const textEl = btn.querySelector("span");
    if (textEl) {
      textEl.textContent = "Modo: Padrão";
    } else {
      btn.textContent = "Modo: Padrão";
    }
  }
  
  render();
}
