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
    { id: 1, name: "Meus Sistemas", open: true, items: ["SoulMV", "MVPEP", "PIH", "HCMED", "Interrad", "Portal RH FFM", "Natcorp",] },
  
    {
      id: 2,
      name: "Administrativo",
      open: true,
      items: ["Controles Internos", "Comunicação", "Apoio Predial"],
    },
    { id: 5, name: "Indicadores", open: true, items: ["PIH"] },
    {
      id: 7,
      name: "Assistencial",
      open: true,
      items: [
        {
          label: "Ambulatório",
          children: ["Linha de Cuidados", "Programa de Rastreio"],
        },
        "Pronto Atendimento",
      ],
    },
    {
      id: 8,
      name: "Ocupacional",
      open: true,
      items: ["Segurança do Trabalho", "Saúde Ocupacional"],
    },
    { id: 9, name: "Qualidade", open: true, items: [] },
    { id: 10, name: "Dados", open: true, items: [] },
    { id: 11, name: "Projetos", open: true, items: [] },
  ];

  let activeSection = 1;
  let activeItem = null;
  let activeSubItem = null;
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
      hdr.innerHTML = `
				<div class="section-title">
					<i class="ti ${getIcon(sec.name)}"></i>
					<span class="section-title-text">${sec.name}</span>
				</div>
				<i class="ti ti-chevron-down chevron ${sec.open ? "open" : ""}"></i>
			`;
      hdr.addEventListener("click", () => {
        activeSection = sec.id;
        activeItem = null;
        sec.open = !sec.open;
        render();
        renderCards();
      });
      wrap.appendChild(hdr);

      const itemsEl = document.createElement("div");
      itemsEl.className = "section-items" + (sec.open ? "" : " closed");
      const totalCount = sec.items.reduce(
        (count, item) => count + 1 + getItemChildren(item).length,
        0
      );
      itemsEl.style.maxHeight = sec.open ? totalCount * 34 + 8 + "px" : "0";

      if (sec.items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "menu-item";
        empty.style.cssText = "font-style:italic;opacity:0.45;cursor:default;";
        empty.innerHTML = '<span class="item-label">Sem itens</span>';
        itemsEl.appendChild(empty);
      } else {
        if (sec.subtitle) {
          const subtitleItem = document.createElement("div");
          subtitleItem.className = "section-subtitle-item";
          subtitleItem.textContent = sec.subtitle;
          itemsEl.appendChild(subtitleItem);
        }
        sec.items.forEach((it) => {
          const label = getItemLabel(it);
          const children = getItemChildren(it);
          const el = document.createElement("div");
          el.className =
            "menu-item" +
            (children.length ? " has-children" : "") +
            (activeSection === sec.id && activeItem === label ? " active" : "");
          el.innerHTML = `
            <div class="item-content">
              <span class="item-label">${label}</span>
            </div>
          `;
          if (children.length) {
            const childList = document.createElement("div");
            childList.className = "item-children";
            children.forEach((child) => {
              const childEl = document.createElement("div");
              childEl.className =
                "menu-item item-child" +
                (activeSection === sec.id && activeItem === label && activeSubItem === child
                  ? " active"
                  : "");
              childEl.textContent = child;
              childEl.addEventListener("click", (e) => {
                e.stopPropagation();
                activeSection = sec.id;
                activeItem = label;
                activeSubItem = child;
                render();
                renderCards();
              });
              childList.appendChild(childEl);
            });
            el.appendChild(childList);
          }
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            activeSection = sec.id;
            activeItem = label;
            activeSubItem = null;
            render();
            renderCards();
          });
          itemsEl.appendChild(el);
        });
      }

      wrap.appendChild(itemsEl);
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

    title.textContent = activeSubItem || activeItem || sec.name;

    const selectedSectionItem = activeItem
      ? sec.items.find((it) => getItemLabel(it) === activeItem)
      : null;

    const items = activeItem
      ? selectedSectionItem
        ? getItemChildren(selectedSectionItem).length
          ? activeSubItem
            ? [activeSubItem]
            : []
          : [activeItem]
        : []
      : sec.items.map(getItemLabel);

    const cards = activeSubItem === "Programa de Rastreio"
      ? programaRastreioCards
      : items.map((name) => ({ name, icon: getCardIcon(name) }));

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

      if (activeSubItem !== "Programa de Rastreio") {
        const delBtn = document.createElement("button");
        delBtn.className = "del-btn ti ti-x";
        delBtn.title = "Remover";
        delBtn.addEventListener("click", (e) => removeItem(e, sec.id, cardData.name));
        card.appendChild(delBtn);
      }

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

      grid.appendChild(card);
    });
  }
  

  function removeItem(e, secId, name) {
    e.stopPropagation();
    const sec = sections.find((s) => s.id == secId);
    if (!sec) return;
    sec.items = sec.items.filter((item) => {
      const label = getItemLabel(item);
      if (label === name) return false;
      const children = getItemChildren(item);
      if (children.length && children.includes(name)) {
        item.children = children.filter((child) => child !== name);
      }
      return true;
    });
    if (activeSubItem === name) activeSubItem = null;
    if (activeItem === name) activeItem = null;
    render();
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
      activeItem = null;
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
    sections.push({ id: nextId++, name, open: true, items: [] });
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
