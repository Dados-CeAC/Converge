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
    Gestores: "ti-users",
    Colaboradores: "ti-user-check",
    Gestão: "ti-briefcase",
    Qualidade: "ti-certificate",
    Dados: "ti-database",
    Ouvidoria: "ti-headset",
    Gerenciamento: "ti-adjustments",
    "Meu Perfil": "ti-user",
  };
  const cardIconMap = {
    Home: "ti-home",
    "Meus Sistemas": "ti-apps",
    HCMED: "ti-stethoscope",
    "InterRad Internados": "ti-building-hospital",
    "Painel MV": "ti-layout-dashboard",
    "Parecer GLPI NATS": "ti-clipboard-list",
    "Sistema de Manutenção DE-PARA - Clínicas x Setores":
      "ti-arrows-transfer-up",
    "Gerenciador de Sistemas": "ti-settings-2",
    SoulMV: "ti-heart-rate-monitor",
    MVPEP: "ti-file-text",
    MVGE: "ti-chart-dots",
    PIH: "ti-chart-pie",
    Interrad: "ti-radioactive",
    Intercon: "ti-messages",
    "Portal RH FFM": "ti-id-badge-2",
    Natcorp: "ti-building-community",
    NatcorpHC: "ti-heart-handshake",
    NatcorpFZ: "ti-building-hospital",
    "Linha de Cuidados": "ti-heart",
    "Programa de Rastreio": "ti-search",
    "Pronto Atendimento": "ti-ambulance",
    "Controles Internos": "ti-file-check",
    Contratos: "ti-file-text",
    "Suprimentos e Estoque": "ti-package",
    Faturamento: "ti-currency-dollar",
    Custos: "ti-chart-line",
    Comunicação: "ti-message",
    "Apoio Predial": "ti-building",
    Farmácia: "ti-pill",
    Transferência: "ti-transfer",
    Hiperutilizadores: "ti-users-group",
    "CA Colo Útero": "ti-gender-female",
    "CA Próstata": "ti-gender-male",
    "CA Colorretal": "ti-clipboard-heart",
    "CA Mama": "ti-ribbon-health",
    "Segurança do Trabalho": "ti-shield-check",
    "Saúde Ocupacional": "ti-user-check",
    "Minhas Doses": "ti-droplet",
    "Meu ASO": "ti-file-check",
    "Meu Perfil": "ti-user",
    "Meu Chamados": "ti-ticket",
    "Gestores": "ti-users",
    "Colaboradores": "ti-user-check",
    "Votação - CIPA": "ti-checklist",
    "Compromissos Ocupacionais": "ti-calendar",
    "ficha de EPI": "ti-helmet",
    "Performance e excelência institucional": "ti-certificate",
    "Processos e melhoria contínua": "ti-adjustments",
    "Gestão de projetos": "ti-layout-grid",
    "Gestão de riscos e segurança do paciente": "ti-shield-check",
    "Experiência do cliente": "ti-user-heart",
    Agenda: "ti-calendar-event",
    Exame: "ti-stethoscope",
    Ambulatorio: "ti-building-hospital",
    "Ficha de EPI": "ti-helmet",
    HAS: "ti-heartbeat",
    DM: "ti-apple",
    "Gestante/Lactante": "ti-baby-carriage",
    Borboletas: "ti-butterfly",
    "Saúde mental": "ti-brain",
    Formulário: "ti-forms",
    "Painel de Gestores": "ti-layout-dashboard",
    Indicadores: "ti-chart-bar",
  };

  const cardUrlMap = {
    SoulMV: "http://bal-autentica.phcnet.usp.br/mvautenticador-cas/login?service=http%3A%2F%2Fbal-autentica.phcnet.usp.br%3A80%2Fsoul-mv%2Fcas",
    MVPEP: "http://bal-autentica.phcnet.usp.br/mvautenticador-cas/login?service=http%3A%2F%2Fbal-pep.phcnet.usp.br%3A80%2Fmvpep%2F",
    MVGE: "http://sehc.phcnet.usp.br/Auth/app/#/",
    PIH: "http://sistemashc.phcnet.usp.br/Conta/Login?ReturnUrl=http://pih.phcnet.usp.br/",
    HCMED: "http://sistemashc.phcnet.usp.br/Conta/Login?ReturnUrl=http://hcmed.phcnet.usp.br",
    Intercon: "http://interconsulta.phcnet.usp.br/Conta/Login?ReturnUrl=%2f",
    Interrad: "http://sistemashc.phcnet.usp.br/Conta/Login?ReturnUrl=http://interrad.phcnet.usp.br/",
    "Portal RH FFM": "https://portalrh.ffm.br/ords/rhlgweb.show",
    NatcorpHC: "https://www.natcorp.com.br/portais/saude/",
    NatcorpFZ: "https://www.natcorp.com.br/portais/incor/",

  };

  const chamadosDBName = "convergeChamadosDB";
  const chamadosStoreName = "meusChamados";
  const chamadosKey = "converge:meusChamados";

  function openChamadosDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(chamadosDBName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(chamadosStoreName)) {
          db.createObjectStore(chamadosStoreName, { keyPath: "id", autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("IndexedDB blocked"));
    });
  }

  function loadChamadosFromStorage() {
    const json = localStorage.getItem(chamadosKey);
    if (!json) return [];
    try {
      const data = JSON.parse(json);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveChamadosToStorage(records) {
    localStorage.setItem(chamadosKey, JSON.stringify(records));
  }

  async function loadChamados() {
    const db = await openChamadosDB();
    if (!db) return loadChamadosFromStorage();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(chamadosStoreName, "readonly");
      const store = tx.objectStore(chamadosStoreName);
      const request = store.getAll();
      request.onsuccess = () => {
        const records = Array.isArray(request.result) ? request.result : [];
        resolve(records.sort((a, b) => b.id - a.id));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async function addChamado(record) {
    const db = await openChamadosDB();
    if (!db) {
      const records = loadChamadosFromStorage();
      const next = { ...record, id: Date.now() };
      records.unshift(next);
      saveChamadosToStorage(records);
      return records;
    }
    await new Promise((resolve, reject) => {
      const tx = db.transaction(chamadosStoreName, "readwrite");
      const store = tx.objectStore(chamadosStoreName);
      store.add(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return loadChamados();
  }

  async function deleteChamado(id) {
    const db = await openChamadosDB();
    if (!db) {
      const records = loadChamadosFromStorage().filter((item) => item.id !== id);
      saveChamadosToStorage(records);
      return records;
    }
    await new Promise((resolve, reject) => {
      const tx = db.transaction(chamadosStoreName, "readwrite");
      const store = tx.objectStore(chamadosStoreName);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return loadChamados();
  }

  async function clearChamados() {
    const db = await openChamadosDB();
    if (!db) {
      saveChamadosToStorage([]);
      return [];
    }
    await new Promise((resolve, reject) => {
      const tx = db.transaction(chamadosStoreName, "readwrite");
      const store = tx.objectStore(chamadosStoreName);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return [];
  }

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
  const homeCards = [
   "Home",
   "Meus Sistemas",
   "Meu perfil",
  ];

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

  const controlesInternosCards = ["Contratos", "Suprimentos e Estoque", "Faturamento", "Custos"];
  const ambulatorioNestingCards = ["Linha de Cuidados", "Programa de Rastreio"];
  const prontoAtendimentoCards = ["Farmácia", "Transferência", "Hiperutilizadores"];
  const careActionCards = ["Formulário", "Painel de Gestores", "Indicadores"];

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
    "O(A) agressor(a) está com dificuldades financeiras, desempregado ou tem dificuldade de se manter em um emprego?",
  ];

  function getItemLabel(item) {
    return typeof item === "string" ? item : item.label || "";
  }
  function getItemChildren(item) {
    return typeof item === "object" && Array.isArray(item.children) ? item.children : [];
  }

  let sections = [
    { id: 0, name: "Home", items: ["Meus Sistemas", "Meu Perfil", "Indicadores"] },
    { id: 1, name: "Meus Sistemas", items: ["SoulMV", "MVPEP", "PIH", "HCMED", "Interrad", "Portal RH FFM", "NatcorpHC", "NatcorpFZ"] },
    { id: 2, name: "Administrativo", items: ["Controles Internos", "Comunicação", "Apoio Predial"] },
    { id: 5, name: "Indicadores", items: ["PIH"] },
    { id: 7, name: "Assistencial", items: ["Ambulatorio", "Pronto Atendimento"] },
    { id: 8, name: "Ocupacional", items: ["Segurança do Trabalho", "Saúde Ocupacional"] },
    { id: 9, name: "Qualidade", items: ["Performance e excelência institucional", "Processos e melhoria contínua","Gestão de projetos","Gestão de riscos e segurança do paciente","Experiência do cliente"] },
    { id: 10, name: "Dados", items: ["Meu Chamados", "Operador"] },
    { id: 11, name: "Ouvidoria", items: ["Meu Chamados", "Operador"] },
    { id: 12, name: "Meu Perfil", items: ["Gestores", "Colaboradores"] },
  ];

  let activeSection = 0;
  let activeCard = null;
  let activeDetailParent = null;
  let collapsed = false;
  let nextId = 10;
  let meusChamadosView = "novo";

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
      if (sec.name === "Meus Sistemas" || sec.name === "Meu Perfil" || sec.name === "Indicadores") {
        return;
      }
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
        activeDetailParent = null;
        render();
        renderCards();
        if (window.innerWidth <= 900) {
          closeMobileSidebar();
        }
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
    const backBtn = document.getElementById("cardBackBtn");

    if (!sec) {
      grid.innerHTML = "";
      empty.style.display = "flex";
      return;
    }

    const isScreeningProgram = activeCard === "Programa de Rastreio";
    const isScreeningCard = programaRastreioCards.includes(activeCard);
    const isLinhaCuidados = activeCard === "Linha de Cuidados";
    const isLinhaCuidadosCard = linhaCuidadosCards.includes(activeCard);
    const isBorboletasForm = activeCard === "Formulário" && activeDetailParent === "Borboletas";
    const isBorboletas = activeCard === "Borboletas";
    const isCompromissos = activeCard === "Compromissos Ocupacionais";
    const isMeusChamados = activeCard === "Meu Chamados";
    const isFichaEpi = activeCard === "Ficha de EPI";
    const isAmbulatorio = activeCard === "Ambulatorio";
    const isProntoAtendimento = activeCard === "Pronto Atendimento";
    const isControlesInternos = activeCard === "Controles Internos";
    const isControlesInternosNested = controlesInternosCards.includes(activeCard);
    const isColaboradores = activeCard === "Colaboradores";
    const isCompromissosNested = compromissosOcupacionaisCards.includes(activeCard);
    const isAmbulatorioNested = ambulatorioNestingCards.includes(activeCard);

    title.textContent = isBorboletasForm
      ? "Formulário - Borboletas"
      : isBorboletas
      ? "Borboletas"
      : isScreeningCard || isLinhaCuidadosCard
      ? activeCard
      : isScreeningProgram
      ? "Programa de Rastreio"
      : isLinhaCuidados
      ? "Linha de Cuidados"
      : isAmbulatorio
      ? "Ambulatorio"
      : isProntoAtendimento
      ? "Pronto Atendimento"
      : activeCard
      ? activeCard
      : sec.name;

    grid.classList.toggle("borboletas-active", isBorboletasForm);
    grid.classList.toggle("meus-chamados-active", isMeusChamados);
    const contentWrapper = document.querySelector(".content");
    if (contentWrapper) {
      contentWrapper.classList.toggle("form-open", isBorboletasForm || isMeusChamados);
      contentWrapper.classList.toggle("borboletas-form-open", isBorboletasForm);
    }
    grid.innerHTML = "";
    empty.style.display = "none";
    if (backBtn) {
      backBtn.style.display = activeCard && !isBorboletasForm ? "inline-flex" : "none";
      backBtn.onclick = () => {
        activeCard = null;
        activeDetailParent = null;
        renderCards();
      };
    }

    if (isBorboletasForm) {
      renderBorboletasForm(grid);
      return;
    }

    if (isMeusChamados) {
      renderMeusChamados(grid);
      return;
    }

    if (isBorboletas) {
      renderCareActionCards(grid, "Linha de Cuidados");
      return;
    }

    if (isScreeningCard) {
      renderCareActionCards(grid, "Programa de Rastreio");
      return;
    }

    if (isLinhaCuidadosCard) {
      renderCareActionCards(grid, "Linha de Cuidados");
      return;
    }

    if (isCompromissos) {
      renderCompromissosCards(grid);
      return;
    }

    if (isControlesInternos) {
      renderControlesInternosCards(grid);
      return;
    }

    if (isAmbulatorio) {
      renderAmbulatorioNestingCards(grid);
      return;
    }

    if (isProntoAtendimento) {
      renderProntoAtendimentoCards(grid);
      return;
    }

    if (isColaboradores) {
      renderColaboradoresCards(grid);
      return;
    }

    if (sec.name === "Home" && activeCard) {
      if (activeCard === "Meu Perfil") {
        const perfilSection = sections.find((s) => s.name === "Meu Perfil");
        if (perfilSection && perfilSection.items.length) {
          perfilSection.items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "sys-card";
            const iconEl = createIconElement(getCardIcon(item));
            const nameEl = document.createElement("div");
            nameEl.className = "sys-card-name";
            nameEl.textContent = item;
            card.appendChild(iconEl);
            card.appendChild(nameEl);
            card.addEventListener("click", () => {
              activeCard = item;
              renderCards();
            });
            grid.appendChild(card);
          });
          return;
        }
      }

      if (activeCard === "Meus Sistemas") {
        const systemsSection = sections.find((s) => s.name === "Meus Sistemas");
        if (systemsSection && systemsSection.items.length) {
          systemsSection.items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "sys-card";
            const iconEl = createIconElement(getCardIcon(item));
            const nameEl = document.createElement("div");
            nameEl.className = "sys-card-name";
            nameEl.textContent = item;
            card.appendChild(iconEl);
            card.appendChild(nameEl);
            card.addEventListener("click", () => {
              const url = cardUrlMap[item];
              if (url) {
                window.open(url, "_blank");
              }
            });
            grid.appendChild(card);
          });
          return;
        }
      }

      if (activeCard === "Indicadores") {
        const indicatorsSection = sections.find((s) => s.name === "Indicadores");
        if (indicatorsSection && indicatorsSection.items.length) {
          indicatorsSection.items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "sys-card";
            const iconEl = createIconElement(getCardIcon(item));
            const nameEl = document.createElement("div");
            nameEl.className = "sys-card-name";
            nameEl.textContent = item;
            const catEl = document.createElement("div");
            catEl.className = "sys-card-cat";
            catEl.textContent = "Indicadores";
            card.appendChild(iconEl);
            card.appendChild(nameEl);
            card.appendChild(catEl);
            card.addEventListener("click", () => {
              const url = cardUrlMap[item];
              if (url) {
                window.open(url, "_blank");
                return;
              }
              activeCard = item;
              renderCards();
            });
            grid.appendChild(card);
          });
          return;
        }
      }

      if (activeCard === "Dados" || activeCard === "Ouvidoria") {
        empty.style.display = "flex";
        return;
      }
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
        const url = cardUrlMap[cardData.name];
        if (url) {
          window.open(url, "_blank");
          return;
        }
        activeDetailParent =
          programaRastreioCards.includes(cardData.name) || linhaCuidadosCards.includes(cardData.name)
            ? cardData.name
            : null;
        activeCard = cardData.name;
        renderCards();
      });

      grid.appendChild(card);
    });
  }

  function renderBorboletasForm(grid) {
    const fixedTop = document.createElement("div");
    fixedTop.className = "borboletas-fixed-top";
    fixedTop.innerHTML = `
      <div class="form-header">
        <div>
          <div class="form-title">Formulário FRIDA - Avaliação de Risco em Violência Doméstica</div>
          <div class="form-description">Formulário de avaliação de risco em violência doméstica e familiar contra a mulher.</div>
        </div>
      </div>
      <div class="form-row borboletas-fixed-row">
        <div class="form-group">
          <label>Nome</label>
          <input type="text" placeholder="Digite o nome completo" />
        </div>
        <div class="form-group">
          <label>Data do atendimento</label>
          <input type="date" />
        </div>
      </div>
    `;

    const form = document.createElement("div");
    form.className = "borboletas-form";
    form.innerHTML = `
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
        <button class="btn primary" type="button" id="borboletasSaveBtn"><i class="ti ti-check"></i> Salvar</button>
      </div>
    `;
    grid.appendChild(fixedTop);
    grid.appendChild(form);

    const saveBtn = form.querySelector("#borboletasSaveBtn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        alert("Dados do formulário Borboletas salvos com sucesso.");
      });
    }
  }

  function renderMeusChamados(grid) {
    const container = document.createElement("div");
    container.className = "meus-chamados-page";
    container.innerHTML = `
      <div class="meus-chamados-header">
        <div class="meus-chamados-tabs">
          <button id="tabNovo" class="tab-button ${meusChamadosView === "novo" ? "active" : ""}">Novo Chamado</button>
          <button id="tabLista" class="tab-button ${meusChamadosView === "lista" ? "active" : ""}">Meus Chamados</button>
        </div>
      </div>
      <div class="meus-chamados-content"></div>
    `;
    grid.appendChild(container);

    const contentEl = container.querySelector(".meus-chamados-content");
    const tabNovo = container.querySelector("#tabNovo");
    const tabLista = container.querySelector("#tabLista");

    const renderSummary = (items) => {
      const total = items.length;
      const abertos = items.filter((item) => item.status === "Aberto").length;
      const andamento = items.filter((item) => item.status === "Em andamento").length;
      const urgentes = items.filter((item) => item.priority === "Alta" || item.priority === "Urgente").length;

      return `
        <div class="meus-chamados-summary">
          <div class="summary-card">
            <div class="summary-label">TOTAL</div>
            <div class="summary-value">${total}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">ABERTOS</div>
            <div class="summary-value">${abertos}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">EM ANDAMENTO</div>
            <div class="summary-value">${andamento}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">URGENTES</div>
            <div class="summary-value">${urgentes}</div>
          </div>
        </div>
      `;
    };

    const statusClass = (status) => {
      if (status === "Aberto") return "status-chip status-open";
      if (status === "Em andamento") return "status-chip status-progress";
      if (status === "Concluído") return "status-chip status-resolved";
      if (status === "Não solucionado") return "status-chip status-unresolved";
      return "status-chip status-open";
    };

    const priorityClass = (priority) => {
      if (priority === "Baixa") return "priority-chip priority-low";
      if (priority === "Média") return "priority-chip priority-medium";
      if (priority === "Alta" || priority === "Urgente") return "priority-chip priority-high";
      return "priority-chip priority-low";
    };

    const statusOptions = (current) => {
      return ["Aberto", "Em andamento", "Concluído", "Não solucionado"]
        .map((value) => `<option value="${value}" ${value === current ? "selected" : ""}>${value}</option>`)
        .join("");
    };

    const renderTable = (items) => {
      if (!items.length) {
        return `
          <div class="empty-state">
            <i class="ti ti-info-circle"></i>
            <p>Nenhum chamado cadastrado ainda.</p>
          </div>
        `;
      }

      return `
        ${renderSummary(items)}
        <div class="chamados-table-wrap">
          <table class="chamados-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Solicitante</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (record, index) => `
                    <tr>
                      <td>${record.id}</td>
                      <td>${record.title}</td>
                      <td>${record.category}</td>
                      <td><span class="${priorityClass(record.priority)}">${record.priority}</span></td>
                      <td>${record.requester}</td>
                      <td><span class="${statusClass(record.status)}">${record.status}</span></td>
                      <td>${record.date || "-"}</td>
                      <td class="table-actions-cell">
                        <select class="status-select" data-id="${record.id}">
                          ${statusOptions(record.status)}
                        </select>
                        <button class="btn small delete-chamado-btn" data-id="${record.id}"><i class="ti ti-trash"></i>Excluir</button>
                      </td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    };

    const formTemplate = `
      <div class="card-box new-chamado-card meus-chamados-form">
        <div class="card-header">
          <div>
            <h2>Novo Chamado</h2>
            <p>Abra um chamado direto pelo sistema de dados do Converge.</p>
          </div>
        </div>
        <div class="meus-chamados-form-content">
          <div class="form-row">
            <div class="form-group">
              <label>Título do chamado*</label>
              <input id="chamadoTitulo" type="text" placeholder="Título do chamado" />
            </div>
            <div class="form-group">
              <label>Serviço/Órgão*</label>
              <input id="chamadoServico" type="text" placeholder="Serviço ou órgão" />
            </div>
          </div>
          <div class="form-group">
            <label>Descrição*</label>
            <textarea id="chamadoDescricao" placeholder="Descreva o problema ou a solicitação"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Categoria*</label>
              <select id="chamadoCategoria">
                <option value="">Selecione</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Operações">Operações</option>
              </select>
            </div>
            <div class="form-group">
              <label>Prioridade*</label>
              <select id="chamadoPrioridade">
                <option value="">Selecione</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Solicitante*</label>
              <input id="chamadoSolicitante" type="text" placeholder="Nome do solicitante" />
            </div>
            <div class="form-group">
              <label>Setor*</label>
              <select id="chamadoSetor">
                <option value="">Selecione o setor</option>
                <option value="Ambulatório">Ambulatório</option>
                <option value="Assessoria Jurídica">Assessoria Jurídica</option>
                <option value="Assessoria RH">Assessoria RH</option>
                <option value="Apoio Administrativo">Apoio Administrativo</option>
                <option value="Controles Internos">Controles Internos</option>
                <option value="Diretoria">Diretoria</option>
                <option value="Medicina do Trabalho">Medicina do Trabalho</option>
                <option value="Marketing e Mídias Sociais">Marketing e Mídias Sociais</option>
                <option value="Ouvidoria">Ouvidoria</option>
                <option value="Pronto Atendimento">Pronto Atendimento</option>
                <option value="Qualidade">Qualidade</option>
                <option value="Segurança do Trabalho">Segurança do Trabalho</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Status*</label>
              <select id="chamadoStatus">
                <option value="Aberto">Aberto</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
            <div class="form-group">
              <label>Data de preenchimento</label>
              <input id="chamadoData" type="date" />
            </div>
          </div>
          <div class="form-group">
            <label>Observações</label>
            <textarea id="chamadoObservacoes" placeholder="Informações adicionais do chamado"></textarea>
          </div>
          <div class="form-actions">
            <button class="btn" type="button" id="chamadoResetBtn"><i class="ti ti-refresh"></i> Limpar</button>
            <button class="btn primary" type="button" id="chamadoSaveBtn"><i class="ti ti-check"></i> Salvar Chamado</button>
          </div>
        </div>
      </div>
    `;

    const renderContent = async (items) => {
      if (meusChamadosView === "novo") {
        contentEl.innerHTML = formTemplate;
        const formFields = {
          titulo: contentEl.querySelector("#chamadoTitulo"),
          servico: contentEl.querySelector("#chamadoServico"),
          descricao: contentEl.querySelector("#chamadoDescricao"),
          solicitante: contentEl.querySelector("#chamadoSolicitante"),
          setor: contentEl.querySelector("#chamadoSetor"),
          categoria: contentEl.querySelector("#chamadoCategoria"),
          prioridade: contentEl.querySelector("#chamadoPrioridade"),
          status: contentEl.querySelector("#chamadoStatus"),
          data: contentEl.querySelector("#chamadoData"),
          observacoes: contentEl.querySelector("#chamadoObservacoes"),
        };

        const saveBtn = contentEl.querySelector("#chamadoSaveBtn");
        if (saveBtn) {
          saveBtn.addEventListener("click", async () => {
            const title = formFields.titulo.value.trim();
            const service = formFields.servico.value.trim();
            const description = formFields.descricao.value.trim();
            const requester = formFields.solicitante.value.trim();
            const category = formFields.categoria.value;
            const priority = formFields.prioridade.value;
            const status = formFields.status.value;
            const date = formFields.data.value;
            const observations = formFields.observacoes.value.trim();
            if (!title || !service || !description || !requester || !category || !priority) {
              alert("Preencha todos os campos obrigatórios antes de salvar.");
              return;
            }
            const record = {
              title,
              service,
              description,
              requester,
              sector: formFields.setor.value.trim(),
              category,
              priority,
              status,
              date,
              observations,
            };
            const updated = await addChamado(record);
            alert("Chamado salvo com sucesso.");
            formFields.titulo.value = "";
            formFields.servico.value = "";
            formFields.descricao.value = "";
            formFields.solicitante.value = "";
            formFields.setor.value = "";
            formFields.categoria.value = "";
            formFields.prioridade.value = "";
            formFields.status.value = "Aberto";
            formFields.data.value = "";
            formFields.observacoes.value = "";
            if (meusChamadosView === "lista") {
              renderContent(updated);
            }
          });
        }

        const resetBtn = contentEl.querySelector("#chamadoResetBtn");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            formFields.titulo.value = "";
            formFields.servico.value = "";
            formFields.descricao.value = "";
            formFields.solicitante.value = "";
            formFields.setor.value = "";
            formFields.categoria.value = "";
            formFields.prioridade.value = "";
            formFields.status.value = "Aberto";
            formFields.data.value = "";
            formFields.observacoes.value = "";
          });
        }
      } else {
        contentEl.innerHTML = renderTable(items);
        contentEl.querySelectorAll(".delete-chamado-btn").forEach((btn) => {
          btn.addEventListener("click", async () => {
            const id = Number(btn.dataset.id);
            const updated = await deleteChamado(id);
            renderContent(updated);
          });
        });
        contentEl.querySelectorAll(".status-select").forEach((select) => {
          select.addEventListener("change", async () => {
            const id = Number(select.dataset.id);
            await updateChamado(id, { status: select.value });
            const updated = await loadChamados();
            renderContent(updated);
          });
        });
      }
    };

    if (tabNovo) {
      tabNovo.addEventListener("click", () => {
        if (meusChamadosView !== "novo") {
          meusChamadosView = "novo";
          renderCards();
        }
      });
    }
    if (tabLista) {
      tabLista.addEventListener("click", async () => {
        if (meusChamadosView !== "lista") {
          meusChamadosView = "lista";
          const items = await loadChamados();
          renderContent(items);
        }
      });
    }

    loadChamados().then(renderContent).catch(() => {
      contentEl.innerHTML = `
        <div class="empty-state">
          <i class="ti ti-alert-circle"></i>
          <p>Não foi possível carregar os chamados.</p>
        </div>
      `;
    });
  }

  async function updateChamado(id, updates) {
    const db = await openChamadosDB();
    if (!db) {
      const records = loadChamadosFromStorage().map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      );
      saveChamadosToStorage(records);
      return records;
    }
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction(chamadosStoreName, "readonly");
      const store = tx.objectStore(chamadosStoreName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (!record) return loadChamados();
    Object.assign(record, updates);
    await new Promise((resolve, reject) => {
      const tx = db.transaction(chamadosStoreName, "readwrite");
      const store = tx.objectStore(chamadosStoreName);
      store.put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return loadChamados();
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

  function renderControlesInternosCards(grid) {
    const cards = controlesInternosCards.map((name) => ({ name, icon: getCardIcon(name) }));
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

  function renderProntoAtendimentoCards(grid) {
    const cards = prontoAtendimentoCards.map((name) => ({ name, icon: getCardIcon(name) }));
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

  function renderCareActionCards(grid, category) {
    const cards = careActionCards.map((name) => ({ name, icon: getCardIcon(name) }));
    const parentName = activeDetailParent || activeCard;

    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "sys-card";

      const iconEl = createIconElement(cardData.icon || getCardIcon(cardData.name));

      const nameEl = document.createElement("div");
      nameEl.className = "sys-card-name";
      nameEl.textContent = cardData.name;

      const catEl = document.createElement("div");
      catEl.className = "sys-card-cat";
      catEl.textContent = parentName || category;

      card.appendChild(iconEl);
      card.appendChild(nameEl);
      card.appendChild(catEl);

      card.addEventListener("click", () => {
        if (cardData.name !== "Formulário" || parentName !== "Borboletas") {
          return;
        }
        activeDetailParent = parentName;
        activeCard = cardData.name;
        renderCards();
      });

      grid.appendChild(card);
    });
  }

  function renderColaboradoresCards(grid) {
    const cards = colaboradorCards.map((name) => ({ name, icon: getCardIcon(name) }));
    cards.forEach((cardData) => {
      const card = document.createElement("div");
      card.className = "sys-card";

      const iconEl = createIconElement(cardData.icon || getCardIcon(cardData.name));
      const nameEl = document.createElement("div");
      nameEl.className = "sys-card-name";
      nameEl.textContent = cardData.name;

      const catEl = document.createElement("div");
      catEl.className = "sys-card-cat";
      catEl.textContent = "Colaboradores";

      card.appendChild(iconEl);
      card.appendChild(nameEl);
      card.appendChild(catEl);

      card.addEventListener("click", () => {
        activeCard = cardData.name;
        renderCards();
      });

      grid.appendChild(card);
    });
  }

  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth <= 900) {
      if (sidebar && sidebar.classList.contains("mobile-open")) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
      return;
    }

    collapsed = !collapsed;
    document.getElementById("sidebar").classList.toggle("collapsed", collapsed);
    document.getElementById("toggleIcon").className =
      "ti " + (collapsed ? "ti-chevrons-right" : "ti-chevrons-left");
  }

  function openMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mobileOverlay");
    if (sidebar) sidebar.classList.add("mobile-open");
    if (overlay) overlay.classList.add("show");
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mobileOverlay");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (overlay) overlay.classList.remove("show");
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

    const mobileToggle = document.getElementById("mobileMenuToggle");
    if (mobileToggle) mobileToggle.addEventListener("click", openMobileSidebar);

    const mobileOverlay = document.getElementById("mobileOverlay");
    if (mobileOverlay) mobileOverlay.addEventListener("click", closeMobileSidebar);

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
  const themeModes = ["default", "dark"];
  const themeLabels = {
    default: "Padrão",
    dark: "Modo Escuro",
  };

  function clearModeClasses() {
    ["mode-dark"].forEach((c) => DOC.classList.remove(c));
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
    const storedMode = localStorage.getItem("site:themeMode");
    const mode = themeModes.includes(storedMode) ? storedMode : "default";
    if (storedMode && storedMode !== mode) {
      localStorage.removeItem("site:themeMode");
    }
    clearModeClasses();
    if (mode !== "default") DOC.classList.add("mode-" + mode);
    updateThemeButton(mode);
  }

  applyStoredPreferences();
  render();
});

function resetIdentity() {
  localStorage.removeItem("site:themeMode");
 
  const DOC = document.documentElement;
  ["mode-dark"].forEach((c) => DOC.classList.remove(c));
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
