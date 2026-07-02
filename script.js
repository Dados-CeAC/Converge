document.addEventListener("DOMContentLoaded", async () => {
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
    Gerenciamento: "ti-adjustments",
    "Meu Perfil": "ti-user",
    "Assesoria Jurídica": "ti-scale",
    "Ouvidoria": "ti-headset",
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
    "Ouvidoria": "ti-headset",
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
    "Consultar Funcionário": "ti-search",
    Processos: "ti-file",
    Profissionais: "ti-id-badge",
    "Perícias": "ti-search",
    "Meus Chamados": "ti-ticket",
    "operador": "ti-headset",

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

  const operadorRows = [];
  const operadorColumns = [
    { key: "protocolo", label: "Protocolo" },
    { key: "data", label: "Data" },
    { key: "anonima", label: "Anônima?" },
    { key: "manifestante", label: "Manifestante" },
    { key: "cpf", label: "CPF" },
    { key: "cargo", label: "Cargo" },
    { key: "instituto", label: "Instituto" },
    { key: "tipo", label: "Tipo" },
    { key: "setor", label: "Setor" },
    { key: "profissionais", label: "Profissionais" },
    { key: "dataResposta", label: "Data da Resposta" },
    { key: "tempoResposta", label: "Tempo de Resposta" },
    { key: "foraPrazo", label: "Fora do Prazo?" },
    { key: "categoria", label: "Categoria (IA)" },
    { key: "status", label: "Status" },
  ];

  async function initClerk() {
    // Se houver uma promise de carregamento, aguarda-a primeiro (preload)
    try {
      if (window._clerkLoaded && typeof window._clerkLoaded.then === 'function') {
        await window._clerkLoaded;
      }
      if (!window.Clerk) return false;
      await window.Clerk.load();
      return true;
    } catch (erro) {
      console.warn("Erro ao carregar Clerk:", erro);
      return false;
    }
  }

  function displayClerkUser(user) {
    if (!user) return;

    const userNameEl = document.getElementById("sidebarUserName");
    const userEmailEl = document.getElementById("sidebarUserEmail");
    const userAvatarEl = document.getElementById("sidebarAvatar");
    const profileLinkEl = document.getElementById("sidebarProfileLink");

    const name = user.fullName || user.firstName || "Usuário";
    const email = user.primaryEmailAddress || user.emailAddresses?.[0]?.emailAddress || user.email || "";
    const displayName = name === "Usuário" && email ? email : name;

    if (userNameEl) {
      userNameEl.innerHTML = `<i class="ti ti-user"></i> ${displayName}`;
    }
    if (userEmailEl) {
      userEmailEl.textContent = email;
      userEmailEl.style.display = email ? "block" : "none";
    }
    if (profileLinkEl) {
      profileLinkEl.href = "#";
      profileLinkEl.title = "Ir para Meu Perfil";
    }
    if (userAvatarEl) {
      const initials = displayName
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      userAvatarEl.textContent = initials || "RB";
    }
  }

  function initSidebarProfileLink() {
    const profileLinkEl = document.getElementById("sidebarProfileLink");
    if (!profileLinkEl) return;

    profileLinkEl.addEventListener("click", (event) => {
      event.preventDefault();
      activeSection = 0;
      activeCard = "Meu Perfil";
      activeDetailParent = null;
      render();
      renderCards();
      if (window.innerWidth <= 900) {
        closeMobileSidebar();
      }
    });
  }

  function initLogoutButton() {
    const logoutBtn = document.querySelector(".sidebar-logout");
    if (!logoutBtn) return;
    logoutBtn.addEventListener("click", async () => {
      try {
        if (window.Clerk && window.Clerk.signOut) {
          await window.Clerk.signOut();
        }
      } catch (erro) {
        console.warn("Erro ao deslogar Clerk:", erro);
      }
      window.location.href = "login.html";
    });
  }

  function getChamadosConfig(scope) {
return {
        storeName: chamadosStoreName,
        storageKey: chamadosKey,
    };
  }

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

  function loadChamadosFromStorage(scope) {
    const { storageKey } = getChamadosConfig(scope);
    const json = localStorage.getItem(storageKey);
    if (!json) return [];
    try {
      const data = JSON.parse(json);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveChamadosToStorage(records, scope) {
    const { storageKey } = getChamadosConfig(scope);
    localStorage.setItem(storageKey, JSON.stringify(records));
  }

  async function loadChamados(scope) {
    const { storeName } = getChamadosConfig(scope);
    const db = await openChamadosDB();
    if (!db) return loadChamadosFromStorage(scope);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => {
        const records = Array.isArray(request.result) ? request.result : [];
        resolve(records.sort((a, b) => b.id - a.id));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async function addChamado(record, scope) {
    const { storeName } = getChamadosConfig(scope);
    const db = await openChamadosDB();
    if (!db) {
      const records = loadChamadosFromStorage(scope);
      const next = { ...record, id: Date.now() };
      records.unshift(next);
      saveChamadosToStorage(records, scope);
      return records;
    }
    await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.add(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return loadChamados(scope);
  }

  async function deleteChamado(id, scope) {
    const { storeName } = getChamadosConfig(scope);
    const db = await openChamadosDB();
    if (!db) {
      const records = loadChamadosFromStorage(scope).filter((item) => item.id !== id);
      saveChamadosToStorage(records, scope);
      return records;
    }
    await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return loadChamados(scope);
  }

  async function updateChamado(id, changes, scope) {
    const { storeName } = getChamadosConfig(scope);
    const db = await openChamadosDB();
    if (!db) {
      const records = loadChamadosFromStorage(scope).map((item) =>
        item.id === id ? { ...item, ...changes } : item,
      );
      saveChamadosToStorage(records, scope);
      return records;
    }
    await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => {
        const record = request.result;
        if (!record) {
          resolve();
          return;
        }
        const updated = { ...record, ...changes };
        const updateReq = store.put(updated);
        updateReq.onsuccess = () => resolve();
        updateReq.onerror = () => reject(updateReq.error);
      };
      request.onerror = () => reject(request.error);
    });
    return loadChamados(scope);
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
    { id: 0, name: "Home", items: ["Meus Sistemas", "Meu Perfil", "Indicadores","Consultar Funcionário"] },
    { id: 1, name: "Meus Sistemas", items: ["SoulMV", "MVPEP", "PIH", "HCMED", "Interrad", "Portal RH FFM", "NatcorpHC", "NatcorpFZ"] },
    { id: 2, name: "Administrativo", items: ["Controles Internos", "Comunicação", "Apoio Predial"] },
    { id: 5, name: "Indicadores", items: ["PIH"] },
    { id: 7, name: "Assistencial", items: ["Ambulatorio", "Pronto Atendimento"] },
    { id: 8, name: "Ocupacional", items: ["Segurança do Trabalho", "Saúde Ocupacional"] },
    { id: 9, name: "Qualidade", items: ["Meus Chamados","operador"] },
    { id: 10, name: "Dados", items: ["Meu Chamados", "Operador"] },
    {id: 11, name: "Ouvidoria", items: ["Meu Chamados", "Operador"] },
    { id: 13, name: "Assesoria Jurídica", items: ["Processos","Profissionais","Perícias"]},
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
    const isOperador = activeCard === "Operador";
    const isFichaEpi = activeCard === "Ficha de EPI";
    const isAmbulatorio = activeCard === "Ambulatorio";
    const isProntoAtendimento = activeCard === "Pronto Atendimento";
    const isControlesInternos = activeCard === "Controles Internos";
    const isControlesInternosNested = controlesInternosCards.includes(activeCard);
    const isColaboradores = activeCard === "Colaboradores";
    const isCompromissosNested = compromissosOcupacionaisCards.includes(activeCard);
    const isAmbulatorioNested = ambulatorioNestingCards.includes(activeCard);
    const isConsultarFuncionario = activeCard === "Consultar Funcionário";
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
      : isConsultarFuncionario
      ? "Consultar Funcionário"
      : activeCard
      ? activeCard
      : sec.name;

    grid.classList.toggle("borboletas-active", isBorboletasForm);
    grid.classList.toggle("meus-chamados-active", isMeusChamados);
    grid.classList.toggle("consultar-funcionario-active", isConsultarFuncionario);
    const contentWrapper = document.querySelector(".content");
    if (contentWrapper) {
      contentWrapper.classList.toggle("form-open", isBorboletasForm || isMeusChamados || isConsultarFuncionario);
      contentWrapper.classList.toggle("borboletas-form-open", isBorboletasForm);
    }
    grid.innerHTML = "";
    empty.style.display = "none";
    if (backBtn) {
      backBtn.style.display = activeCard && !isBorboletasForm && !isConsultarFuncionario ? "inline-flex" : "none";
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

    if (isConsultarFuncionario) {
      renderConsultarFuncionario(grid);
      return;
    }

    if (isOperador) {
      renderOperador(grid);
      return;
    }

    if (isMeusChamados) {
      renderMeusChamados(grid, sec.name);
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
        renderMeuPerfil(grid);
        return;
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

      if (activeCard === "Dados") {
        const sectionTarget = sections.find((s) => s.name === activeCard);
        if (sectionTarget) {
          activeSection = sectionTarget.id;
          activeCard = null;
          activeDetailParent = null;
          render();
          return;
        }
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
          <select class="custom-select">
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

  const FUNCIONARIOS_API_URL = "http://127.0.0.1:5000/api/funcionarios";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeSearchValue(value) {
    return String(value ?? "").trim();
  }

  function getFuncionarioStatusClass(status) {
    const normalized = String(status ?? "").toLowerCase();
    if (normalized.includes("deslig") || normalized.includes("inativo")) return "status-inativo";
    if (normalized.includes("afast")) return "status-afastado";
    if (normalized.includes("ativo")) return "status-ativo";
    return "status-neutro";
  }

  function renderFuncionarioEmptyState(message, icon = "ti-search-off") {
    return `
      <div class="card-box">
        <div class="empty-state">
          <p>${escapeHtml(message)}</p>
        </div>
      </div>
    `;
  }

  function renderConsultarFuncionario(grid) {
    const formContainer = document.createElement("div");
    formContainer.className = "card-box consultar-funcionario-card";
    formContainer.innerHTML = `
      <div class="card-header">
        <div>
          <h2>Consultar Funcionário</h2>
          <p>Busque informações sobre funcionários da instituição</p>
        </div>
      </div>
      <div class="consultar-funcionario-form-content">
        <div class="form-row">
          <div class="form-group">
            <label>Nome do usuário</label>
            <input id="funcNome" type="text" placeholder="Digite o nome do usuário" />
          </div>
          <div class="form-group">
            <label>Matrícula</label>
            <input id="funcMatricula" type="text" placeholder="Digite a matrícula" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>CPF</label>
            <input id="funcCpf" type="text" placeholder="Digite o CPF" />
          </div>
          <div class="form-group">
            <label>Empresa</label>
            <select id="funcEmpresa" class="custom-select">
              <option value="">Todas as empresas</option>
              <option value="FFM">FFM</option>
              <option value="HC">HC</option>
              <option value="FZ">FZ</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Cargo</label>
            <div class="combo" style="position:relative;">
              <input id="funcCargo" type="text" placeholder="Digite o cargo" autocomplete="off" />
              <button type="button" class="combo-toggle" data-target="cargosDropdown" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);">▾</button>
              <div id="cargosDropdown" class="combo-list" style="position:absolute;left:0;right:0;z-index:40;max-height:200px;overflow:auto;display:none;background:#fff;border:1px solid #ccc;"></div>
            </div>
          </div>
          <div class="form-group">
            <label>Setor</label>
            <div class="combo" style="position:relative;">
              <input id="funcSetor" type="text" placeholder="Digite o setor" autocomplete="off" />
              <button type="button" class="combo-toggle" data-target="setoresDropdown" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);">▾</button>
              <div id="setoresDropdown" class="combo-list" style="position:absolute;left:0;right:0;z-index:40;max-height:200px;overflow:auto;display:none;background:#fff;border:1px solid #ccc;"></div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Filial</label>
            <div class="combo" style="position:relative;">
              <input id="funcFilial" type="text" placeholder="Digite a filial" autocomplete="off" />
              <button type="button" class="combo-toggle" data-target="filiaisDropdown" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);">▾</button>
              <div id="filiaisDropdown" class="combo-list" style="position:absolute;left:0;right:0;z-index:40;max-height:200px;overflow:auto;display:none;background:#fff;border:1px solid #ccc;"></div>
            </div>
          </div>
          <div class="form-group">
            <label>Situação</label>
            <select id="funcStatus" class="custom-select">
              <option value="">Todas as situações</option>
              <option value="Ativo">Ativo</option>
              <option value="Desligado">Desligado</option>
              <option value="Atestado Médico">Atestado Médico</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Busca ativa</label>
          <input id="funcBusca" type="search" placeholder="Digite qualquer informação para pesquisar em todos os campos" autocomplete="off" />
        </div>
        <div class="form-actions">
          <button class="btn" type="button" id="funcLimparBtn"><i class="ti ti-eraser"></i> Limpar</button>
          <button class="btn primary" type="button" id="funcBuscBtn"><i class="ti ti-search"></i> Buscar</button>
        </div>
      </div>
    `;
    
    const resultContainer = document.createElement("div");
    resultContainer.className = "consultar-funcionario-results";
    resultContainer.id = "funcResultsContainer";
    resultContainer.style.display = "none";
    
    grid.appendChild(formContainer);
    grid.appendChild(resultContainer);

    const buscaInput = formContainer.querySelector("#funcBusca");
    const buscBtn = formContainer.querySelector("#funcBuscBtn");
    const limparBtn = formContainer.querySelector("#funcLimparBtn");
    const resultsDiv = grid.querySelector("#funcResultsContainer");
    const searchFields = [
      formContainer.querySelector("#funcNome"),
      formContainer.querySelector("#funcMatricula"),
      formContainer.querySelector("#funcCpf"),
      formContainer.querySelector("#funcCargo"),
      formContainer.querySelector("#funcSetor"),
      formContainer.querySelector("#funcFilial"),
      buscaInput,
    ];
    const searchSelects = [
      formContainer.querySelector("#funcStatus"),
    ];

    async function loadDatalists() {
      try {
        const apiBase = FUNCIONARIOS_API_URL.replace(/\/api\/.*/,'/api');
        const [setRes, filRes, cargoRes] = await Promise.all([
          fetch(`${apiBase}/setores`),
          fetch(`${apiBase}/filiais`),
          fetch(`${apiBase}/cargos`),
        ]);

        if (setRes.ok) {
          setoresData = await setRes.json();
          const container = formContainer.querySelector('#setoresDropdown');
          if (container) container.innerHTML = setoresData.map(s => `<div class="combo-item" data-value="${escAttr(s)}">${s}</div>`).join('');
        }

        if (filRes.ok) {
          filiaisData = await filRes.json();
          const container2 = formContainer.querySelector('#filiaisDropdown');
          if (container2) container2.innerHTML = filiaisData.map(f => `<div class="combo-item" data-value="${escAttr(f)}">${f}</div>`).join('');
        }
        if (cargoRes && cargoRes.ok) {
          cargosData = await cargoRes.json();
          const container3 = formContainer.querySelector('#cargosDropdown');
          if (container3) container3.innerHTML = cargosData.map(c => `<div class="combo-item" data-value="${escAttr(c)}">${c}</div>`).join('');
        }
      } catch (err) {
        console.error('Erro ao carregar listas de setor/filial', err);
      }
    }

    // carrega opções de setor/filial e depois habilita o comportamento dos combos
    loadDatalists().then(setupComboBehavior).catch(err => {
      console.error(err);
      setupComboBehavior();
    });

    function setupComboBehavior() {
      function wire(inputSel, dropdownId, dataArray) {
        const input = formContainer.querySelector(inputSel);
        const dropdown = formContainer.querySelector(`#${dropdownId}`);
        const toggle = formContainer.querySelector(`.combo-toggle[data-target="${dropdownId}"]`);
        if (!input || !dropdown) return;

        function showFiltered() {
          const q = (input.value || '').toLowerCase();
          const items = dropdown.querySelectorAll('.combo-item');
          let any=false;
          items.forEach(it => {
            const text = it.textContent.toLowerCase();
            const visible = !q || text.indexOf(q) !== -1;
            it.style.display = visible ? '' : 'none';
            if (visible) any = true;
          });
          dropdown.style.display = any ? 'block' : 'none';
        }

        input.addEventListener('input', (e) => {
          showFiltered();
        });

        input.addEventListener('focus', (e) => {
          showFiltered();
        });

        toggle && toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const visible = dropdown.style.display === 'block';
          if (visible) {
            dropdown.style.display = 'none';
          } else {
            // reset filter
            input.focus();
            const items = dropdown.querySelectorAll('.combo-item');
            items.forEach(it => it.style.display = '');
            dropdown.style.display = 'block';
          }
        });

        dropdown.addEventListener('click', (ev) => {
          const it = ev.target.closest('.combo-item');
          if (!it) return;
          input.value = it.getAttribute('data-value') || it.textContent;
          dropdown.style.display = 'none';
        });

        document.addEventListener('click', (ev) => {
          if (!formContainer.contains(ev.target) && dropdown) dropdown.style.display = 'none';
        });
      }

      wire('#funcSetor', 'setoresDropdown', setoresData);
      wire('#funcFilial', 'filiaisDropdown', filiaisData);
      wire('#funcCargo', 'cargosDropdown', cargosData);
    }

    // small delay to allow datalists to be filled, then wire combo behavior
    setTimeout(setupComboBehavior, 250);

    async function buscarFuncionariosAtivo() {
      const termo = normalizeSearchValue(buscaInput.value);
      const nome = normalizeSearchValue(formContainer.querySelector("#funcNome").value);
      const matricula = normalizeSearchValue(formContainer.querySelector("#funcMatricula").value);
      const cpf = normalizeSearchValue(formContainer.querySelector("#funcCpf").value);
      const cargo = normalizeSearchValue(formContainer.querySelector("#funcCargo").value);
      const setor = normalizeSearchValue(formContainer.querySelector("#funcSetor").value);
      const filial = normalizeSearchValue(formContainer.querySelector("#funcFilial").value);
      const status = formContainer.querySelector("#funcStatus").value;

      if (!termo && !nome && !matricula && !cpf && !empresa && !cargo && !setor && !filial && !status) {
        if (searchController) searchController.abort();
        resultsDiv.style.display = "none";
        resultsDiv.innerHTML = "";
        return;
      }

      const params = new URLSearchParams();
      if (termo) params.set("q", termo);
      if (nome) params.set("nome", nome);
      if (matricula) params.set("matricula", matricula);
      if (cpf) params.set("cpf", cpf);
      if (cargo) params.set("cargo", cargo);
      if (setor) params.set("setor", setor);
      if (filial) params.set("filial", filial);
      if (status) params.set("status", status);

      if (searchController) searchController.abort();
      searchController = new AbortController();

      resultsDiv.style.display = "block";
      resultsDiv.innerHTML = renderFuncionarioEmptyState("Consultando funcionários...", "ti-loader-2");

      try {
        const response = await fetch(`${FUNCIONARIOS_API_URL}?${params.toString()}`, {
          signal: searchController.signal,
        });
        if (!response.ok) {
          throw new Error("Não foi possível consultar a base de funcionários.");
        }

        const payload = await response.json();
        const resultados = Array.isArray(payload.results) ? payload.results : [];

        if (resultados.length === 0) {
          resultsDiv.innerHTML = renderFuncionarioEmptyState("Nenhum funcionário encontrado com os critérios informados.");
        } else {
          const groupedResults = resultados
            .slice()
            .sort((a, b) => {
              const setorA = (a.nomeLocalTrabalho || a.localTrabalho || "").toLowerCase();
              const setorB = (b.nomeLocalTrabalho || b.localTrabalho || "").toLowerCase();
              if (setorA < setorB) return -1;
              if (setorA > setorB) return 1;
              const nomeA = (a.nome || "").toLowerCase();
              const nomeB = (b.nome || "").toLowerCase();
              if (nomeA < nomeB) return -1;
              if (nomeA > nomeB) return 1;
              return 0;
            })
            .reduce((groups, func) => {
              const setor = func.nomeLocalTrabalho || func.localTrabalho || "Sem setor";
              if (!groups[setor]) groups[setor] = [];
              groups[setor].push(func);
              return groups;
            }, {});

          const setoresOrdenados = Object.keys(groupedResults).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

          const tableHTML = `
            <div class="card-box">
              <div class="card-header">
                  <div>
                    <h3>Resultados da Busca</h3>
                    <p>Total de ${resultados.length} funcionário(s) encontrado(s)</p>
                  </div>
                </div>
              <div class="funcionarios-table-wrap">
                ${setoresOrdenados.map(setor => `
                  <div class="setor-group">
                    <h4 class="setor-title">${escapeHtml(setor)}</h4>
                    <table class="funcionarios-table">
                      <thead>
                        <tr>
                          <th>Matrícula</th>
                          <th>Nome</th>
                          <th>Cargo</th>
                          <th>Filial</th>
                          <th>Situação</th>
                          <th>Email</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${groupedResults[setor].map((func, index) => `
                          <tr>
                            <td>${escapeHtml(func.matricula)}</td>
                            <td>${escapeHtml(func.nome)}</td>
                            <td>${escapeHtml(func.cargo)}</td>
                            <td>${escapeHtml(func.filial)}</td>
                            <td><span class="status-chip ${getFuncionarioStatusClass(func.status)}">${escapeHtml(func.status || "Não informado")}</span></td>
                            <td>${escapeHtml(func.email)}</td>
                            <td>
                              <button class="btn small view-details" data-setor="${escapeHtml(setor)}" data-index="${index}"><i class="ti ti-eye"></i> Detalhes</button>
                            </td>
                          </tr>
                        `).join("")}
                      </tbody>
                    </table>
                  </div>
                `).join("")}
              </div>
            </div>
          `;

          resultsDiv.innerHTML = tableHTML;

          resultsDiv.querySelectorAll(".view-details").forEach(btn => {
            btn.addEventListener("click", () => {
              const setor = btn.dataset.setor;
              const index = Number(btn.dataset.index);
              const funcData = groupedResults[setor][index];
              showFuncionarioDetails(funcData, resultsDiv);
            });
          });
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        resultsDiv.innerHTML = renderFuncionarioEmptyState(`${error.message} Verifique se o servidor Flask está em execução.`, "ti-plug-connected-x");
      }
    }

    function agendarBuscaAtiva() {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(buscarFuncionariosAtivo, 250);
    }

    searchFields.forEach((field) => {
      field.addEventListener("input", agendarBuscaAtiva);
    });

    searchSelects.forEach((field) => {
      field.addEventListener("change", agendarBuscaAtiva);
    });

    buscBtn.addEventListener("click", () => {
      clearTimeout(searchTimer);
      buscarFuncionariosAtivo();
    });

    limparBtn.addEventListener("click", () => {
      formContainer.querySelector("#funcNome").value = "";
      formContainer.querySelector("#funcMatricula").value = "";
      formContainer.querySelector("#funcCpf").value = "";
      formContainer.querySelector("#funcEmpresa").value = "";
      formContainer.querySelector("#funcCargo").value = "";
      formContainer.querySelector("#funcSetor").value = "";
      formContainer.querySelector("#funcFilial").value = "";
      formContainer.querySelector("#funcStatus").value = "";
      formContainer.querySelector("#funcBusca").value = "";
      if (searchController) searchController.abort();
      clearTimeout(searchTimer);
      resultsDiv.style.display = "none";
      resultsDiv.innerHTML = "";
      formContainer.querySelector("#funcNome").focus();
    });
  }

  function showFuncionarioDetails(funcionario, container) {
    const detailsHTML = `
      <div class="card-box funcionario-details">
        <div class="card-header">
          <div>
            <h3>Detalhes do Funcionário</h3>
          </div>
          <button class="btn small" onclick="this.parentElement.parentElement.parentElement.style.display='none'"><i class="ti ti-x"></i></button>
        </div>
        <div class="details-grid">
          <div class="detail-row">
            <div class="detail-label">Matrícula:</div>
            <div class="detail-value">${escapeHtml(funcionario.matricula)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Nome:</div>
            <div class="detail-value">${escapeHtml(funcionario.nome)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">CPF:</div>
            <div class="detail-value">${escapeHtml(funcionario.cpf)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Cargo:</div>
            <div class="detail-value">${escapeHtml(funcionario.cargo)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Filial:</div>
            <div class="detail-value">${escapeHtml(funcionario.filial)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Situação:</div>
            <div class="detail-value"><span class="status-chip ${getFuncionarioStatusClass(funcionario.status)}">${escapeHtml(funcionario.status || "Não informado")}</span></div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Email:</div>
            <div class="detail-value">${escapeHtml(funcionario.email)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Empresa:</div>
            <div class="detail-value">${escapeHtml(funcionario.nomeEmpresa)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Vínculo:</div>
            <div class="detail-value">${escapeHtml(funcionario.vinculo)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Data de admissão:</div>
            <div class="detail-value">${escapeHtml(funcionario.dataAdmissao)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Local de trabalho:</div>
            <div class="detail-value">${escapeHtml(funcionario.nomeLocalTrabalho || funcionario.localTrabalho)}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Função:</div>
            <div class="detail-value">${escapeHtml(funcionario.funcao)}</div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn" onclick="this.parentElement.parentElement.style.display='none'"><i class="ti ti-x"></i> Fechar</button>
        </div>
      </div>
    `;
    
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "funcionario-details-modal";
    detailsDiv.innerHTML = detailsHTML;
    container.appendChild(detailsDiv);
  }

  function renderOperador(grid) {
    grid.innerHTML = `
      <div class="card-box">
        <div class="card-header">
          <div>
            <h2>Operador</h2>
            <p>Acompanhe as demandas do operador com status e próximos passos.</p>
          </div>
        </div>
        <div class="operador-panel">
          <div class="operador-card">
            <h3>Resumo do Operador</h3>
            <p>Visualize atendimentos, responsáveis e status das demandas.</p>
          </div>
          <div class="operador-card">
            <h3>Próxima ação</h3>
            <p>Selecione uma demanda para atualizar o status ou consultar detalhes.</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderSectionCards(grid, cards, sectionName) {
    grid.innerHTML = "";
    const container = document.createElement("div");
    container.className = "section-cards";
    container.innerHTML = `
      <div class="card-box">
        <div class="card-header">
          <div>
            <h2>${escapeHtml(sectionName)}</h2>
          </div>
        </div>
      </div>
    `;
    const cardsWrap = document.createElement("div");
    cardsWrap.className = "cards-grid section-cards-grid";
    cards.forEach((name) => {
      const card = document.createElement("div");
      card.className = "sys-card";
      const iconEl = createIconElement(getCardIcon(name));
      const nameEl = document.createElement("div");
      nameEl.className = "sys-card-name";
      nameEl.textContent = name;
      card.appendChild(iconEl);
      card.appendChild(nameEl);
      card.addEventListener("click", () => {
        const url = cardUrlMap[name];
        if (url) {
          window.open(url, "_blank");
          return;
        }
        activeCard = name;
        activeDetailParent = null;
        renderCards();
      });
      cardsWrap.appendChild(card);
    });
    grid.appendChild(container);
    grid.appendChild(cardsWrap);
  }

  function renderMeuPerfil(grid) {
    const user = window.Clerk?.user;
    const name = user?.fullName || user?.firstName || "Usuário";
    const email = user?.primaryEmailAddress?.emailAddress || user?.primaryEmailAddress?.email || user?.emailAddresses?.[0]?.emailAddress || user?.email || "";
    const identifier = user?.identifier || "";
    grid.innerHTML = `
      <div class="card-box">
        <div class="card-header">
          <div>
            <h2>Meu Perfil</h2>
            <p>Visualize seus dados de usuário autenticado.</p>
          </div>
        </div>
        <div class="profile-details">
          <div class="profile-row"><strong>Nome:</strong> ${escapeHtml(name)}</div>
          <div class="profile-row"><strong>Email:</strong> ${escapeHtml(email)}</div>
          <div class="profile-row"><strong>Identificador:</strong> ${escapeHtml(identifier)}</div>
        </div>
      </div>
    `;
  }

  function renderCareActionCards(grid, sectionName) {
    renderSectionCards(grid, careActionCards, sectionName);
  }

  function renderCompromissosCards(grid) {
    renderSectionCards(grid, compromissosOcupacionaisCards, "Compromissos Ocupacionais");
  }

  function renderControlesInternosCards(grid) {
    renderSectionCards(grid, controlesInternosCards, "Controles Internos");
  }

  function renderAmbulatorioNestingCards(grid) {
    renderSectionCards(grid, ambulatorioNestingCards, "Ambulatório");
  }

  function renderProntoAtendimentoCards(grid) {
    renderSectionCards(grid, prontoAtendimentoCards, "Pronto Atendimento");
  }

  function renderColaboradoresCards(grid) {
    renderSectionCards(grid, colaboradorCards, "Colaboradores");
  }

  function toggleSidebar() {
    collapsed = !collapsed;
    const sidebar = document.getElementById("sidebar");
    const icon = document.getElementById("toggleIcon");
    if (sidebar) sidebar.classList.toggle("collapsed", collapsed);
    if (icon) icon.className = collapsed ? "ti ti-chevrons-right" : "ti ti-chevrons-left";
  }

  function openMobileSidebar() {
    document.body.classList.add("mobile-sidebar-open");
  }

  function closeMobileSidebar() {
    document.body.classList.remove("mobile-sidebar-open");
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
  }

  function confirmAddCard() {
    closeModal("modalCard");
    alert("Funcionalidade de adicionar sistema ainda não está disponível.");
  }

  function confirmAddSection() {
    closeModal("modalSection");
    alert("Funcionalidade de criar seção ainda não está disponível.");
  }

  function normalizeField(value) {
    return value === undefined || value === null || value === "" ? "—" : value;
  }

  function makeCsvFromRows(rows, columns, filename) {
    if (!rows.length) {
      alert("Não há registros para exportar.");
      return;
    }
    const header = columns.map((col) => `"${col.label}"`).join(";");
    const lines = rows.map((row) => columns.map((col) => `"${String(row[col.key] || "").replace(/"/g, '""')}"`).join(";") );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }


  async function renderMeusChamados(grid, scope) {
    const headerLabel = "Novo Chamado";
    const listLabel = "Lista de Chamados";
    const description = "Registre novas demandas ou acompanhe os chamados existentes.";

    const container = document.createElement("div");
    container.className = "meus-chamados-page";
    container.innerHTML = `
      <div class="meus-chamados-header">
        <div class="meus-chamados-tabs">
          <button id="tabNovo" class="tab-button ${meusChamadosView === "novo" ? "active" : ""}">${headerLabel}</button>
          <button id="tabLista" class="tab-button ${meusChamadosView === "lista" ? "active" : ""}">${listLabel}</button>
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
            <p>Nenhuma manifestação registrada ainda.</p>
            <p>Clique em "Nova Manifestação" para registrar a primeira.</p>
          </div>
        `;
      }

      const tableRows = items
        .map((record) => {
          const isAnonymous = record.anonymous || record.anônimo || record.anonima ? "Sim" : "Não";
          return `
            <tr>
              <td>${record.id || "-"}</td>
              <td>${record.date || "-"}</td>
              <td>${isAnonymous}</td>
              <td>${escapeHtml(record.requester || record.solicitante || "-")}</td>
              <td>${escapeHtml(record.cpf || "-")}</td>
              <td>${escapeHtml(record.service || record.instituto || "-")}</td>
              <td>${escapeHtml(record.type || record.category || "-")}</td>
              <td>${escapeHtml(record.sector || record.setor || "-")}</td>
              <td><span class="${statusClass(record.status)}">${escapeHtml(record.status)}</span></td>
            </tr>
          `;
        })
        .join("");

      return `
        <div class="chamados-table-wrap">
          <table class="chamados-table">
            <thead>
              <tr>
                <th>PROTOCOLO</th>
                <th>DATA</th>
                <th>ANÔNIMA?</th>
                <th>MANIFESTANTE</th>
                <th>CPF</th>
                <th>INSTITUTO</th>
                <th>TIPO</th>
                <th>SETOR</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      `;
    };

    const formTemplate = `
      <div class="card-box new-chamado-card meus-chamados-form">
        <div class="card-header">
          <div>
            <h2>${headerLabel}</h2>
            <p>${description}</p>
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
              <select id="chamadoCategoria" class="custom-select">
                <option value="">Selecione</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Operações">Operações</option>
              </select>
            </div>
            <div class="form-group">
              <label>Prioridade*</label>
              <select id="chamadoPrioridade" class="custom-select">
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
              <select id="chamadoSetor" class="custom-select">
                <option value="">Selecione o setor</option>
                <option value="Ambulatório">Ambulatório</option>
                <option value="Assessoria Jurídica">Assessoria Jurídica</option>
                <option value="Assessoria RH">Assessoria RH</option>
                <option value="Apoio Administrativo">Apoio Administrativo</option>
                <option value="Controles Internos">Controles Internos</option>
                <option value="Diretoria">Diretoria</option>
                <option value="Medicina do Trabalho">Medicina do Trabalho</option>
                <option value="Marketing e Mídias Sociais">Marketing e Mídias Sociais</option>
                        <option value="Pronto Atendimento">Pronto Atendimento</option>
                <option value="Qualidade">Qualidade</option>
                <option value="Segurança do Trabalho">Segurança do Trabalho</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Status*</label>
              <select id="chamadoStatus" class="custom-select">
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
              type: "Chamado",
            };
            const updated = await addChamado(record, scope);
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
            const updated = await deleteChamado(id, scope);
            renderContent(updated);
          });
        });
        contentEl.querySelectorAll(".status-select").forEach((select) => {
          select.addEventListener("change", async () => {
            const id = Number(select.dataset.id);
            await updateChamado(id, { status: select.value }, scope);
            const updated = await loadChamados(scope);
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
          const items = await loadChamados(scope);
          renderContent(items);
        }
      });
    }

    loadChamados(scope).then(renderContent).catch(() => {
      contentEl.innerHTML = `
        <div class="empty-state">
          <p>Não foi possível carregar os chamados.</p>
        </div>
      `;
    });
  }

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

  const clerkReady = await initClerk();
  if (!clerkReady) {
    window.location.href = "login.html";
    return;
  }

  const currentUser = window.Clerk?.user;
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  displayClerkUser(currentUser);
  initSidebarProfileLink();
  initLogoutButton();

  // Monitoramento da sessão: se a sessão for perdida, redireciona automaticamente para a tela de login.
  // Isso cobre casos em que o usuário desloga em outra aba ou a sessão expira.
  const SESSION_CHECK_INTERVAL_MS = 5000;
  const sessionMonitor = setInterval(() => {
    try {
      const user = window.Clerk?.user;
      if (!user) {
        clearInterval(sessionMonitor);
        window.location.href = "login.html";
      }
    } catch (e) {
      // ignore
    }
  }, SESSION_CHECK_INTERVAL_MS);

  // Opção para deslogar automaticamente quando a aba for fechada.
  // Por padrão, deixamos desativado para evitar deslogar usuários inesperadamente.
  const AUTO_SIGN_OUT_ON_CLOSE = false;
  if (AUTO_SIGN_OUT_ON_CLOSE) {
    window.addEventListener("beforeunload", (ev) => {
      try {
        if (window.Clerk && typeof window.Clerk.signOut === "function") {
          // signOut pode ser assíncrono; iniciamos a chamada sem aguardar
          window.Clerk.signOut().catch(() => {});
        }
      } catch (e) {
        // ignore
      }
    });
  }

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
