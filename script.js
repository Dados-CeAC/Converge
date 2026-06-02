document.addEventListener("DOMContentLoaded", () => {
  const iconMap = {
    Home: "ti-home",
    "Meus Sistemas": "ti-apps",
    Administrativo: "ti-settings",
    Assistencial: "ti-hospital",
    "Pronto Atendimento": "ti-ambulance",
    Ocupacional: "ti-shield-check",
    Indicadores: "ti-chart-bar",
    Colaborador: "ti-users",
    Qualidade: "ti-certificate",
    Dados: "ti-database",
    Projetos: "ti-layers",
    Gerenciamento: "ti-adjustments",
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
    "Linha de Cuidados": "ti-heart",
    "Programa de Rastreio": "ti-search",
    "Pronto Atendimento": "ti-ambulance",
    "Controles Internos": "ti-file-check",
    Comunicação: "ti-message",
    "Apoio Predial": "ti-building",
    "Segurança do Trabalho": "ti-shield-check",
    "Saúde Ocupacional": "ti-user-check",
    "Minhas Doses": "ti-droplet",
    "Meu ASO": "ti-file-check",
    "Votação - CIPA": "ti-checklist",
    "Compromissos Ocupacionais": "ti-calendar",
    Agenda: "ti-calendar-event",
    Exame: "ti-stethoscope",
    Ambulatorio: "ti-building-hospital",
    "Ficha de EPI": "ti-hard-hat",
    HAS: "ti-heart-pulse",
    DM: "ti-apple",
    "Gestante/Lactante": "ti-baby-carriage",
      Borboletas: "ti-butterfly",


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
    "CA Colo Útero",
    "CA Próstata",
    "CA Colorretal",
    "CA Mama",
  ];

  const linhaCuidadosCards = [
    "HAS",
    "DM",
    "Gestante/Lactante",
    "Borboletas",
    "Saúde mental",
  ];

  const colaboradorCards = [
    "Minhas Doses",
    "Meu ASO",
    "Votação - CIPA",
    "Compromissos Ocupacionais",
    "Ficha de EPI",
  ];

  const compromissosOcupacionaisCards = ["Agenda", "Exame"];

  const ambulatorioNestingCards = ["Linha de Cuidados", "Programa de Rastreio"];

  const borboletasQuestions = [
    "A violência vem aumentando de gravidade e/ou de frequência no último mês?",
    "A senhora/você está grávida ou teve bebê nos últimos 18 meses?",
    "A senhora/você tem filhos(as) com o(a) agressor(a)? (Caso não tenham filhos em comum, o registro não se aplica.) Em caso afirmativo, estão vivendo algum conflito com relação à guarda dos filhos, visitas ou pagamento de pensão pelo agressor?",
    "O(A) agressor(a) persegue a senhora/você, demonstra ciúme excessivo, tenta controlar sua vida e as coisas que você faz?",
    "A senhora/você se separou recentemente do(a) agressor(a), tentou ou tem intenção de se separar?",
    "O(A) agressor(a) também é violento com outras pessoas?",
    "A senhora/você possui algum animal doméstico? Em caso afirmativo, o(a) agressor(a) maltrata ou agride o animal?",
    "O(A) agressor(a) já a agrediu fisicamente outras vezes?",
    "Alguma vez o(a) agressor(a) tentou estrangular, sufocar ou afogar a senhora/você?",
    "O(A) agressor(a) já fez ameaças de morte ou tentou matar a senhora/você?",
    "O(A) agressor(a) já usou, ameaçou usar arma de fogo contra a senhora/você ou tem fácil acesso a uma arma?",
    "O(A) agressor(a) já ameaçou ou feriu com outro tipo de arma ou instrumento?",
    "A senhora/você necessitou de atendimento médico e/ou internação após algumas dessas agressões?",
    "O(A) agressor(a) é usuário de drogas e/ou bebidas alcoólicas?",
    "O(A) agressor(a) faz uso de medicação controlada para alguma doença mental/psiquiátrica?",
    "A senhora/você já teve ou tem medida protetiva de urgência?",
    "O(A) agressor(a) já descumpriu medida protetiva de afastamento ou proibição de contato?",
    "O(A) agressor(a) já ameaçou ou tentou se matar alguma vez?",
    "O(A) agressor(a) já obrigou a senhora/você a ter relações sexuais contra sua vontade?",
    "O(A) agressor(a) está com dificuldades financeiras, desempregado ou tem dificuldade de se manter no emprego?",
  ];

  function getItemLabel(item) {
    return typeof item === "string" ? item : item.label || "";
  }
  function getItemChildren(item) {
    return typeof item === "object" && Array.isArray(item.children) ? item.children : [];
  }

  let sections = [
    { id: 0, name: "Home", items: ["Home"] },
    { id: 1, name: "Meus Sistemas", items: ["SoulMV", "MVPEP", "PIH", "HCMED", "Interrad", "Portal RH FFM", "Natcorp"] },
    { id: 2, name: "Administrativo", items: ["Controles Internos", "Comunicação", "Apoio Predial"] },
    { id: 5, name: "Indicadores", items: ["PIH"] },
    { id: 7, name: "Assistencial", items: ["Ambulatorio", "Pronto Atendimento"] },
    { id: 8, name: "Ocupacional", items: ["Segurança do Trabalho", "Saúde Ocupacional"] },
    { id: 3, name: "Pronto Atendimento", items: ["Pronto Atendimento"] },
    { id: 4, name: "Colaborador", items: colaboradorCards },
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

  function createIconElement(icon) {
    if (typeof icon === "string" && /^(https?:)?\/\//.test(icon)) {
      const img = document.createElement("img");
      img.src = icon;
      img.alt = "ícone";
      img.className = "icon-image";
      return img;
    }
    const iconEl = document.createElement("i");
    iconEl.className = icon.startsWith("ti-") ? "ti " + icon : icon;
    return iconEl;
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

      const titleBox = document.createElement("div");
      titleBox.className = "section-title";
      titleBox.appendChild(createIconElement(getIcon(sec.name)));

      const titleText = document.createElement("span");
      titleText.className = "section-title-text";
      titleText.textContent = sec.name;
      titleBox.appendChild(titleText);

      hdr.appendChild(titleBox);
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

    const isScreeningProgram =
      activeCard === "Programa de Rastreio" || programaRastreioCards.includes(activeCard);
    const isLinhaCuidados =
      activeCard === "Linha de Cuidados" || linhaCuidadosCards.includes(activeCard);
    const isBorboletas = activeCard === "Borboletas";
    const isCompromissos = activeCard === "Compromissos Ocupacionais";
    const isFichaEpi = activeCard === "Ficha de EPI";
    const isAmbulatorio = activeCard === "Ambulatorio";
    const isColaboradorSection = sec.name === "Colaborador";
    const isCompromissosNested = compromissosOcupacionaisCards.includes(activeCard);
    const isAmbulatorioNested = ambulatorioNestingCards.includes(activeCard);

    title.textContent = isBorboletas
      ? "Borboletas"
      : isScreeningProgram
      ? "Programa de Rastreio"
      : isLinhaCuidados
      ? "Linha de Cuidados"
      : isAmbulatorio
      ? "Ambulatorio"
      : activeCard
      ? activeCard
      : sec.name;

    grid.classList.toggle("borboletas-active", isBorboletas);
    grid.innerHTML = "";
    empty.style.display = "none";

    if (isBorboletas) {
      renderBorboletasForm(grid);
      return;
    }

    if (isCompromissos) {
      renderCompromissosCards(grid);
      return;
    }

    if (isAmbulatorio) {
      renderAmbulatorioNestingCards(grid);
      return;
    }

    const cards = isScreeningProgram
      ? programaRastreioCards.map((name) => ({ name, icon: getCardIcon(name) }))
      : isLinhaCuidados
      ? linhaCuidadosCards.map((name) => ({ name, icon: getCardIcon(name) }))
      : sec.items.map((name) => ({ name, icon: getCardIcon(name) }));

    if (cards.length === 0) {
      empty.style.display = "flex";
      return;
    }

    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "sys-card";

      const iconEl = createIconElement(cardData.icon || getCardIcon(cardData.name));

      const nameEl = document.createElement("div");
      nameEl.className = "sys-card-name";
      nameEl.textContent = cardData.name;

      const catEl = document.createElement("div");
      catEl.className = "sys-card-cat";
      catEl.textContent = isScreeningProgram
        ? "Programa de Rastreio"
        : isLinhaCuidados
        ? "Linha de Cuidados"
        : sec.name;

      card.appendChild(iconEl);
      card.appendChild(nameEl);
      card.appendChild(catEl);

      card.classList.toggle("epi-card", cardData.name === "Ficha de EPI");
      card.classList.toggle("active", activeCard === cardData.name);
      card.addEventListener("click", () => {
        activeCard = cardData.name;
        renderCards();
      });

      grid.appendChild(card);
    });
  }

  function renderBorboletasForm(grid) {
    const form = document.createElement("div");
    form.className = "borboletas-form";
    form.innerHTML = `
      <div class="form-header">
        <div>
          <div class="form-title">Formulário FRIDA - Avaliação de Risco em Violência Doméstica</div>
          <div class="form-description">Formulário de avaliação de risco em violência doméstica e familiar contra a mulher.</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Nome da usuária</label>
          <input type="text" placeholder="Digite o nome completo" />
        </div>
        <div class="form-group">
          <label>Data do atendimento</label>
          <input type="date" />
        </div>
      </div>
      <div class="borboletas-table-wrap">
        <div class="table-caption">Perguntas</div>
        <table class="borboletas-table">
          <thead>
            <tr>
              <th>Perguntas</th>
              <th>Sim</th>
              <th>Não</th>
              <th>Não sabe</th>
              <th>Não se aplica</th>
            </tr>
          </thead>
          <tbody>
            ${borboletasQuestions
              .map(
                (question, index) => `
                <tr>
                  <td>${question}</td>
                  <td><input type="radio" name="q${index}" value="sim" /></td>
                  <td><input type="radio" name="q${index}" value="nao" /></td>
                  <td><input type="radio" name="q${index}" value="nao-sabe" /></td>
                  <td><input type="radio" name="q${index}" value="nao-se-aplica" /></td>
                </tr>
              `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="form-group">
        <label>Percepção de risco da mulher</label>
        <textarea placeholder="Descreva a percepção de risco"></textarea>
      </div>
      <div class="form-group">
        <label>Informações adicionais relevantes</label>
        <textarea placeholder="Informações complementares"></textarea>
      </div>
      <div class="form-group">
        <label>Condições físicas e emocionais</label>
        <textarea placeholder="Descreva as condições"></textarea>
      </div>
      <div class="form-group">
        <label>Encaminhamentos sugeridos</label>
        <textarea placeholder="Encaminhamentos"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Nível de risco</label>
          <select>
            <option value="">Selecione</option>
            <option value="baixo">Baixo</option>
            <option value="medio">Médio</option>
            <option value="elevado">Elevado</option>
          </select>
        </div>
        <div class="form-group">
          <label>Nome do profissional</label>
          <input type="text" placeholder="Digite o nome completo" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Cargo/Função</label>
          <input type="text" placeholder="Cargo ou função" />
        </div>
        <div class="form-group">
          <label>Serviço/Órgão</label>
          <input type="text" placeholder="Serviço ou órgão" />
        </div>
      </div>
      <div class="form-group">
        <label>Data de preenchimento</label>
        <input type="date" />
      </div>
      <div class="form-actions">
        <button class="btn" type="button" id="borboletasBackBtn"><i class="ti ti-arrow-left"></i> Voltar</button>
        <button class="btn primary" type="button" id="borboletasSaveBtn"><i class="ti ti-check"></i> Salvar</button>
      </div>
    `;
    grid.appendChild(form);

    const backBtn = form.querySelector("#borboletasBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        activeCard = "Linha de Cuidados";
        renderCards();
      });
    }

    const saveBtn = form.querySelector("#borboletasSaveBtn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        alert("Dados do formulário Borboletas salvos com sucesso.");
      });
    }
  }

  function renderCompromissosCards(grid) {
    const cards = compromissosOcupacionaisCards.map((name) => ({ name, icon: getCardIcon(name) }));
    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "sys-card";

      const iconEl = document.createElement("i");
      iconEl.className = "ti " + cardData.icon;

      const nameEl = document.createElement("div");
      nameEl.className = "sys-card-name";
      nameEl.textContent = cardData.name;

      card.appendChild(iconEl);
      card.appendChild(nameEl);

      card.addEventListener("click", () => {
        activeCard = cardData.name;
        renderCards();
      });

      grid.appendChild(card);
    });
  }

  function renderAmbulatorioNestingCards(grid) {
    const cards = ambulatorioNestingCards.map((name) => ({ name, icon: getCardIcon(name) }));
    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "sys-card";

      const iconEl = createIconElement(cardData.icon || getCardIcon(cardData.name));

      const nameEl = document.createElement("div");
      nameEl.className = "sys-card-name";
      nameEl.textContent = cardData.name;

      card.appendChild(iconEl);
      card.appendChild(nameEl);

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
