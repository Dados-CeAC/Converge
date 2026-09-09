const AREAS = ["Assistencial", "Operacional", "Administrativo", "Diretoria", "Ocupacional", "Qualidade", "Dados"];
const TEST_USERS = ['Ana Souza', 'Bruno Lima', 'Carla Mendes', 'Daniel Oliveira', 'Fernanda Alves', 'Marina Costa'];
const GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || '';

const AREA_COLORS = {
  "Assistencial": { color: "#ec4899", bg: "#fce7f3" },
  "Operacional":  { color: "#f59e0b", bg: "#fef3c7" },
  "Administrativo": { color: "#3b82f6", bg: "#dbeafe" },
  "Diretoria":    { color: "#8b5cf6", bg: "#ede9fe" },
  "Ocupacional":  { color: "#10b981", bg: "#d1fae5" },
  "Qualidade":    { color: "#06b6d4", bg: "#cffafe" },
  "Dados":        { color: "#6366f1", bg: "#e0e7ff" }
};

const TAG_COLORS = {
  'Crítico': '#ef4444',
  'Atenção': '#f59e0b',
  'Normal': '#10b981',
  'Planejamento': '#6366f1'
};

const COLUMNS = [
  { key: 'A Fazer', label: 'A FAZER' },
  { key: 'Em Andamento', label: 'EM ANDAMENTO' },
  { key: 'Concluídos', label: 'CONCLUÍDOS' }
];

let currentArea = AREAS[0];
let isArchivedView = false;
let cards = JSON.parse(localStorage.getItem('converge_v4_cards') || '[]');
let tempActions = [];
let pendingActionTitle = '';
let activeCardId = null;
let viewMode = localStorage.getItem('converge_view_mode') || 'grid';

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
}

function init() {
  renderAreaPills();
  document.getElementById('fArea').innerHTML = AREAS.map(a => `<option value="${a}">${a}</option>`).join('');
  updateViewButtons();
  loadGoogleMapsAutocomplete();
  render();
}

function loadGoogleMapsAutocomplete() {
  if (!GOOGLE_MAPS_API_KEY || window.google?.maps?.places) {
    if (window.google?.maps?.places) initializeGoogleMapsAutocomplete();
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = initializeGoogleMapsAutocomplete;
  document.head.appendChild(script);
}

function initializeGoogleMapsAutocomplete() {
  const input = document.getElementById('locationInput');
  if (!input || input.dataset.autocompleteReady || !window.google?.maps?.places) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ['formatted_address', 'name', 'geometry'],
    types: ['geocode']
  });
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    input.value = place.formatted_address || place.name || input.value;
  });
  input.dataset.autocompleteReady = 'true';
}

function setViewMode(mode) {
  viewMode = mode;
  localStorage.setItem('converge_view_mode', mode);
  updateViewButtons();
  render();
}

function updateViewButtons() {
  document.getElementById('listViewButton').classList.toggle('active', viewMode === 'list');
  document.getElementById('gridViewButton').classList.toggle('active', viewMode === 'grid');
}

function renderAreaPills() {
  const container = document.getElementById('areaPills');
  container.innerHTML = AREAS.map(a => {
    const areaTheme = AREA_COLORS[a] || { color: '#64748b' };
    const isActive = a === currentArea;
    return `
      <button 
        class="area-pill ${isActive ? 'active' : ''}" 
        onclick="selectArea('${a}')"
        ondragover="event.preventDefault(); this.classList.add('drag-over-pill');"
        ondragleave="this.classList.remove('drag-over-pill');"
        ondrop="handleDropOnArea(event, '${a}')"
      >
        <span class="pill-dot" style="background-color: ${areaTheme.color};"></span>
        <span>${a}</span>
      </button>
    `;
  }).join('');
}

function handleDropOnArea(e, targetArea) {
  e.preventDefault();
  e.target.classList.remove('drag-over-pill');

  const id = Number(e.dataTransfer.getData('text/plain'));
  const cardIndex = cards.findIndex(c => c.id === id);

  if (cardIndex !== -1) {
    const originalCard = cards[cardIndex];

    if (originalCard.area === targetArea) {
      toast(`O card já pertence à área ${targetArea}.`);
      return;
    }

    const mirrorGroupId = originalCard.mirrorGroupId || `group_${Date.now()}`;
    originalCard.mirrorGroupId = mirrorGroupId;

    const alreadyMirrored = cards.some(c => c.mirrorGroupId === mirrorGroupId && c.area === targetArea && !c.archived);
    if (alreadyMirrored) {
      toast(`Este card já está espelhado na área ${targetArea}.`);
      return;
    }

    const newMirroredCard = JSON.parse(JSON.stringify(originalCard));
    newMirroredCard.id = Date.now();
    newMirroredCard.area = targetArea;
    newMirroredCard.mirrorGroupId = mirrorGroupId;

    cards.push(newMirroredCard);
    saveStorage();
    render();
    toast(`Card transferido e espelhado com sucesso para a área: ${targetArea}!`);
  }
}

function selectArea(area) {
  currentArea = area;
  isArchivedView = false;
  showMainBoardUI();
  renderAreaPills();
  render();
}

function showMainBoard() {
  isArchivedView = false;
  showMainBoardUI();
  render();
}

function showMainBoardUI() {
  document.getElementById('pageTitle').textContent = `Área ${currentArea}`;
  document.getElementById('areaSelectorContainer').style.display = 'block';
  document.getElementById('toolbar').style.display = 'flex';
  document.getElementById('archivedViewSwitcher').classList.remove('open');
  document.getElementById('btnMainBoard').classList.add('active');
  document.getElementById('btnArchived').classList.remove('active');
}

function showArchivedView() {
  isArchivedView = true;
  document.getElementById('pageTitle').textContent = 'Cards Arquivados (Suspenso por tempo indeterminado)';
  document.getElementById('areaSelectorContainer').style.display = 'none';
  document.getElementById('toolbar').style.display = 'none';
  document.getElementById('archivedViewSwitcher').classList.add('open');
  document.getElementById('btnMainBoard').classList.remove('active');
  document.getElementById('btnArchived').classList.add('active');
  render();
}

function calculateProgress(actions) {
  if (!actions || actions.length === 0) return 0;
  const completed = actions.filter(a => a.completed).length;
  return Math.round((completed / actions.length) * 100);
}

function getFarolColorClass(pct) {
  if (pct < 40) return 'bg-red';
  if (pct < 70) return 'bg-yellow';
  return 'bg-green';
}

function getDeadlineStatus(actions, isCompletedCard) {
  if (isCompletedCard) {
    return { type: 'completed', text: '✓ Concluído' };
  }
  if (!actions || actions.length === 0) return null;

  const today = new Date(todayISO());
  let minDaysDiff = Infinity;

  actions.forEach(a => {
    if (!a.completed && a.dueDate) {
      const due = new Date(a.dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < minDaysDiff) {
        minDaysDiff = diffDays;
      }
    }
  });

  if (minDaysDiff === Infinity) return { type: 'completed', text: '✓ Ações Concluídas' };

  if (minDaysDiff < 0) {
    return { type: 'expired', text: '⚠️ Prazo encerrado' };
  } else if (minDaysDiff === 0) {
    return { type: 'warning', text: '⏰ Prazo termina em 0 dia(s)' };
  } else {
    return { type: 'ok', text: `⏳ Prazo termina em ${minDaysDiff} dia(s)` };
  }
}

function render() {
  const board = document.getElementById('board');
  const q = document.getElementById('search').value.toLowerCase();

  if (isArchivedView) {
    const archivedCards = cards.filter(c => c.archived && c.status === 'Suspenso');
    board.classList.toggle('list-mode', viewMode === 'list');
    board.classList.toggle('archived-grid', viewMode === 'grid');
    board.style.gridTemplateColumns = '1fr';
    board.innerHTML = `
      <div class="column" data-status="Suspenso">
        <div class="col-head">
          <span>CARDS ARQUIVADOS / SUSPENSOS</span>
          <span class="count">${archivedCards.length}</span>
        </div>
        <div class="cards">
          ${archivedCards.length ? archivedCards.map(c => cardHTML(c, true)).join('') : '<div style="color:var(--muted); font-size:13px; padding:20px;">Nenhum card suspenso até o momento.</div>'}
        </div>
      </div>`;
    return;
  }

  board.classList.remove('list-mode', 'archived-grid');
  board.style.gridTemplateColumns = 'repeat(3, 1fr)';
  const areaCards = cards.filter(c => c.area === currentArea && !c.archived &&
    (!q || c.title.toLowerCase().includes(q) || (c.actions && c.actions.some(a => a.title.toLowerCase().includes(q))))
  );

  board.innerHTML = COLUMNS.map(col => {
    const items = areaCards.filter(c => c.status === col.key);
    return `
      <div class="column" data-status="${col.key}" ondragover="event.preventDefault(); this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="handleDrop(event, '${col.key}')">
        <div class="col-head">
          <span>${col.label}</span>
          <span class="count">${items.length}</span>
        </div>
        <div class="cards">
          ${items.map(c => cardHTML(c)).join('')}
        </div>
      </div>`;
  }).join('');
}

function cardHTML(c, isArchived = false) {
  const pct = c.status === 'Concluídos' ? 100 : (c.manualProgress ?? calculateProgress(c.actions));
  const farolClass = getFarolColorClass(pct);
  const theme = AREA_COLORS[c.area] || { color: '#2563eb', bg: '#eff6ff' };
  const deadline = getDeadlineStatus(c.actions, c.status === 'Concluídos');
  const isUrgent = c.urgencia === 'Sim';

  const isMirrored = c.mirrorGroupId && cards.filter(item => item.mirrorGroupId === c.mirrorGroupId && !item.archived).length > 1;

  const tagsHTML = (c.tags || []).map(t => `<span class="badge-tag" style="background:${TAG_COLORS[t] || '#64748b'};">${esc(t)}</span>`).join('');

  return `
    <div 
      class="card" 
      style="--area-color: ${theme.color}; --area-bg: ${theme.bg};" 
      draggable="${!isArchived}" 
      ondragstart="event.dataTransfer.setData('text/plain', ${c.id})" 
      onclick="openCardDetailModal(${c.id})"
    >
      ${deadline ? `<div class="deadline-banner ${deadline.type}">${deadline.text}</div>` : ''}

      <div class="card-header-row">
        <div class="card-title">${esc(c.title)}</div>
      </div>
      <div class="card-desc">${esc(c.desc || 'Sem descrição')}</div>

      <div class="badges">
        <span class="badge-area">${esc(c.area || 'Geral')}</span>
        <span class="badge ${isUrgent ? 'urgente-sim' : 'urgente-nao'}">Urgência: ${c.urgencia || 'Não'}</span>
        ${tagsHTML}
        ${isMirrored ? `<span class="badge mirrored">🔗 Espelhado</span>` : ''}
        <span class="badge gray">☑ ${c.actions ? c.actions.length : 0} ações</span>
      </div>

      <div class="progress-container">
        <div class="progress-label">
          <span>Andamento</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${farolClass}" style="width: ${pct}%"></div>
        </div>
      </div>

      ${isArchived ? `
        <div style="margin-top:12px;">
          <button class="primary" style="font-size:12px; width:100%; padding:6px 0;" onclick="event.stopPropagation(); reactivateCard(${c.id})">Reativar Card</button>
        </div>` : ''}
    </div>`;
}

function openCardDetailModal(id) {
  activeCardId = id;
  const card = cards.find(c => c.id === id);
  if (!card) return;

  const areaTheme = AREA_COLORS[card.area] || { color: '#f87171' };
  document.getElementById('detailHeader').style.background = areaTheme.color;
  document.getElementById('detailHeaderStatus').textContent = card.status.toUpperCase();
  document.getElementById('detailTitle').textContent = card.title;
  document.getElementById('detailDesc').innerHTML = card.desc ? esc(card.desc).replace(/\n/g, '<br>') : '<i>Sem descrição.</i>';
  document.getElementById('locationInput').value = card.location || '';

  renderCardTags(card.tags || []);
  renderLocationDisplay(card.location);
  renderAttachments(card.attachments || []);

  const actionsList = document.getElementById('detailActionsList');
  if (card.actions && card.actions.length > 0) {
    actionsList.innerHTML = card.actions.map((a, idx) => `
      <div class="action-item">
        <div style="font-weight: bold; font-size: 13px; display:flex; align-items:center; gap:8px;">
          <input type="checkbox" ${a.completed ? 'checked' : ''} onchange="toggleModalAction(${idx})">
          <span style="${a.completed ? 'text-decoration:line-through; color:var(--muted)' : ''}">${esc(a.title)}</span>
        </div>
        <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">
          Resp: <b>${esc(a.responsible)}</b> | Prazo: ${a.dueDate} (${a.days} dias)
        </div>
      </div>
    `).join('');
  } else {
    actionsList.innerHTML = '<div style="font-size: 12px; color: var(--muted);">Nenhuma ação cadastrada.</div>';
  }

  renderComments(card.comments || []);

  document.getElementById('overlay').classList.add('open');
  document.getElementById('cardDetailModal').classList.add('open');
}

function toggleModalAction(idx) {
  const card = cards.find(c => c.id === activeCardId);
  if (card && card.actions[idx]) {
    card.actions[idx].completed = !card.actions[idx].completed;
    delete card.manualProgress;
    
    // Atualiza status baseado nas checkboxes
    const pct = calculateProgress(card.actions);
    if (pct === 100) card.status = 'Concluídos';
    else if (pct > 0 && card.status === 'A Fazer') card.status = 'Em Andamento';

    if (card.mirrorGroupId) {
      cards.forEach(c => {
        if (c.mirrorGroupId === card.mirrorGroupId) {
          c.actions = card.actions;
          c.status = card.status;
        }
      });
    }

    saveStorage();
    openCardDetailModal(activeCardId);
    render();
  }
}

function toggleDetailPopover(id) {
  const popover = document.getElementById(id);
  const isOpen = popover.classList.contains('open');
  document.querySelectorAll('.popover').forEach(p => p.classList.remove('open'));
  if (!isOpen) popover.classList.add('open');
}

function renderCardTags(tags) {
  const container = document.getElementById('detailTagsContainer');
  container.innerHTML = tags.map(t => `<span class="badge-tag" style="background:${TAG_COLORS[t] || '#64748b'};">${esc(t)}</span>`).join('');
}

function toggleCardTag(tag) {
  const card = cards.find(c => c.id === activeCardId);
  if (card) {
    if (!card.tags) card.tags = [];
    const index = card.tags.indexOf(tag);
    if (index > -1) card.tags.splice(index, 1);
    else card.tags.push(tag);

    if (card.mirrorGroupId) {
      cards.forEach(c => { if (c.mirrorGroupId === card.mirrorGroupId) c.tags = card.tags; });
    }

    saveStorage();
    renderCardTags(card.tags);
    render();
  }
}

function addLocation() {
  const loc = document.getElementById('locationInput').value.trim();
  if (!loc) return;

  const card = cards.find(c => c.id === activeCardId);
  if (card) {
    card.location = loc;
    if (card.mirrorGroupId) {
      cards.forEach(c => { if (c.mirrorGroupId === card.mirrorGroupId) c.location = loc; });
    }
    saveStorage();
    renderLocationDisplay(loc);
    toggleDetailPopover('popoverLocation');
    toast('Localização adicionada!');
  }
}

function openGoogleMapsSearch() {
  const loc = document.getElementById('locationInput').value.trim();
  if (!loc) {
    toast('Informe uma localização para pesquisar no Google Maps.');
    return;
  }
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;
  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
}

function renderLocationDisplay(loc) {
  const container = document.getElementById('locationDisplay');
  if (loc) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;
    container.innerHTML = `
      <div style="font-size:12px; background:#e0f2fe; color:#0369a1; padding:8px 12px; border-radius:6px; display:flex; align-items:center; justify-content:space-between;">
        <span>📍 <b>Local:</b> ${esc(loc)}</span>
        <a href="${mapsUrl}" target="_blank" style="color:#0284c7; font-weight:bold; text-decoration:none;">Abrir no Google Maps ↗</a>
      </div>`;
  } else {
    container.innerHTML = '';
  }
}

function addAttachment() {
  const fileInput = document.getElementById('fileAttachmentInput');
  const linkInput = document.getElementById('linkAttachmentInput').value.trim();
  const card = cards.find(c => c.id === activeCardId);

  if (!card) return;
  if (!card.attachments) card.attachments = [];

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => saveFileAttachment(card, file, reader.result);
    reader.readAsDataURL(file);
    return;
  } else if (linkInput) {
    card.attachments.push({ type: 'link', name: linkInput, url: linkInput });
  } else {
    toast('Selecione um arquivo ou cole um link.');
    return;
  }

  if (card.mirrorGroupId) {
    cards.forEach(c => { if (c.mirrorGroupId === card.mirrorGroupId) c.attachments = card.attachments; });
  }

  saveStorage();
  renderAttachments(card.attachments);
  document.getElementById('linkAttachmentInput').value = '';
  fileInput.value = '';
  toggleDetailPopover('popoverAttachment');
  toast('Anexo adicionado!');
}

function saveFileAttachment(card, file, dataUrl) {
  card.attachments.push({ type: 'file', name: file.name, url: dataUrl, mimeType: file.type });
  if (card.mirrorGroupId) {
    cards.forEach(c => { if (c.mirrorGroupId === card.mirrorGroupId) c.attachments = card.attachments; });
  }
  saveStorage();
  renderAttachments(card.attachments);
  document.getElementById('fileAttachmentInput').value = '';
  document.getElementById('linkAttachmentInput').value = '';
  toggleDetailPopover('popoverAttachment');
  toast('Anexo adicionado!');
}

function renderAttachments(attachments) {
  const container = document.getElementById('detailAttachmentsList');
  if (!attachments || attachments.length === 0) {
    container.innerHTML = '<div style="font-size:12px; color:var(--muted)">Nenhum anexo ou link cadastrado.</div>';
    return;
  }

  container.innerHTML = attachments.map(att => `
    <div class="attachment-item">
      <span>${att.type === 'file' ? '📁' : '🔗'} ${esc(att.name)}</span>
      ${att.url && att.url !== '#' ? `<a href="${esc(att.url)}" target="_blank" download="${esc(att.name)}" style="color:var(--primary); font-weight:bold; font-size:11px;">${att.type === 'link' ? 'Acessar Link' : 'Abrir arquivo'}</a>` : '<span style="color:var(--muted); font-size:11px;">Arquivo indisponível</span>'}
    </div>
  `).join('');
}

function formatComment(type) {
  const editor = document.getElementById('newCommentText');
  editor.focus();
  if (type === 'B') document.execCommand('bold');
  if (type === 'I') document.execCommand('italic');
  if (type === 'Tt') document.execCommand('formatBlock', false, 'h3');
  if (type === 'Quote') document.execCommand('formatBlock', false, 'blockquote');
}

function renderCommentText(text) {
  return esc(text)
    .replace(/^# (.+)$/gm, '<strong>$1</strong>')
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}

function sanitizeCommentHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('*').forEach(element => {
    if (!['B', 'STRONG', 'I', 'EM', 'H3', 'BLOCKQUOTE', 'BR', 'DIV'].includes(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    [...element.attributes].forEach(attribute => element.removeAttribute(attribute.name));
  });
  return template.innerHTML;
}

function triggerCommentFileUpload() {
  document.getElementById('commentFileInput').click();
}

function handleCommentFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const editor = document.getElementById('newCommentText');
    editor.insertAdjacentHTML('beforeend', `<div>[Arquivo anexado: ${esc(file.name)}]</div>`);
    editor.focus();
  }
}

function renderComments(comments) {
  const container = document.getElementById('detailCommentsList');
  if (!comments || comments.length === 0) {
    container.innerHTML = '<div style="font-size:12px; color:var(--muted)">Nenhum comentário ainda.</div>';
    return;
  }

  container.innerHTML = comments.map((c, idx) => {
    const initials = c.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return `
      <div class="comment-item">
        <div class="avatar">${initials}</div>
        <div class="comment-content">
          <div>
            <span class="comment-author">${esc(c.author)}</span>
            <span class="comment-date">${c.date}</span>
          </div>
          <div class="comment-bubble">${c.html ? sanitizeCommentHtml(c.html) : renderCommentText(c.text)}</div>
          <div class="comment-actions">
            <span onclick="deleteComment(${idx})">Excluir</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function addComment() {
  const editor = document.getElementById('newCommentText');
  const html = sanitizeCommentHtml(editor.innerHTML);
  const text = editor.textContent.trim();
  if (!text) return;

  const card = cards.find(c => c.id === activeCardId);
  if (card) {
    if (!card.comments) card.comments = [];
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR') + ', ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const newComment = {
      author: "Usuário Atual",
      date: dateStr,
      text: text,
      html
    };

    card.comments.unshift(newComment);

    if (card.mirrorGroupId) {
      cards.forEach(c => {
        if (c.mirrorGroupId === card.mirrorGroupId && c.id !== card.id) {
          if (!c.comments) c.comments = [];
          c.comments.unshift(newComment);
        }
      });
    }

    saveStorage();
    renderComments(card.comments);
    editor.innerHTML = '';
    toast('Comentário adicionado!');
  }
}

function deleteComment(idx) {
  const card = cards.find(c => c.id === activeCardId);
  if (card && card.comments) {
    card.comments.splice(idx, 1);
    if (card.mirrorGroupId) {
      cards.forEach(c => { if (c.mirrorGroupId === card.mirrorGroupId) c.comments = card.comments; });
    }
    saveStorage();
    renderComments(card.comments);
    toast('Comentário excluído.');
  }
}

function editCurrentCardFromModal() {
  closeCardDetailModal();
  openForm(activeCardId);
}

function closeCardDetailModal() {
  document.getElementById('cardDetailModal').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.querySelectorAll('.popover').forEach(p => p.classList.remove('open'));
}

function triggerAddAction() {
  const text = document.getElementById('newActionInput').value.trim();
  if (!text) { toast('Preencha o campo de ação antes de configurar o prazo.'); return; }

  pendingActionTitle = text;
  document.getElementById('modalActionText').value = text;
  document.getElementById('modalStartDate').value = todayISO();
  document.getElementById('modalDays').value = 5;
  document.getElementById('modalResponsible').value = '';
  calculateModalDueDate();

  document.getElementById('overlay').classList.add('open');
  document.getElementById('actionModal').classList.add('open');
}

function calculateModalDueDate() {
  const start = document.getElementById('modalStartDate').value;
  const days = document.getElementById('modalDays').value || 1;
  document.getElementById('modalDueDate').value = addDays(start, days);
}

function closeActionModal() {
  document.getElementById('actionModal').classList.remove('open');
  if (!document.getElementById('cardDrawer').classList.contains('open') && !document.getElementById('cardDetailModal').classList.contains('open')) {
    document.getElementById('overlay').classList.remove('open');
  }
}

function saveActionFromModal() {
  const resp = document.getElementById('modalResponsible').value.trim();
  if (!resp) { toast('Informe o responsável pela ação.'); return; }

  tempActions.push({
    id: Date.now(),
    title: pendingActionTitle,
    startDate: document.getElementById('modalStartDate').value,
    days: Number(document.getElementById('modalDays').value),
    dueDate: document.getElementById('modalDueDate').value,
    responsible: resp,
    completed: false
  });

  document.getElementById('newActionInput').value = '';
  closeActionModal();
  renderTempActions();
}

function renderTempActions() {
  const container = document.getElementById('actionsList');
  if (!tempActions.length) {
    container.innerHTML = '<div style="font-size:12px; color:var(--muted)">Nenhuma ação adicionada ainda.</div>';
    return;
  }

  container.innerHTML = tempActions.map((a, idx) => `
    <div class="action-item">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <label style="font-size:12px; font-weight:bold; display:flex; align-items:center; gap:6px;">
          <input type="checkbox" ${a.completed ? 'checked' : ''} onchange="toggleActionComplete(${idx})">
          <span style="${a.completed ? 'text-decoration:line-through; color:var(--muted)' : ''}">${esc(a.title)}</span>
        </label>
        <button type="button" class="ghost" style="padding:2px 6px; font-size:11px;" onclick="removeTempAction(${idx})">✕</button>
      </div>
      <div style="font-size:11px; color:var(--muted); margin-top:4px;">
        📅 Início: ${a.startDate} | Prazo: ${a.days}d (Até: ${a.dueDate}) | Resp: <b>${esc(a.responsible)}</b>
      </div>
    </div>
  `).join('');
}

function toggleActionComplete(idx) {
  tempActions[idx].completed = !tempActions[idx].completed;
  renderTempActions();
}

function removeTempAction(idx) {
  tempActions.splice(idx, 1);
  renderTempActions();
}

function openForm(id = null) {
  const card = cards.find(c => c.id === id);
  document.getElementById('cardId').value = id || '';
  document.getElementById('drawerTitle').textContent = id ? 'Editar Card' : 'Novo Card';
  document.getElementById('fTitle').value = card?.title || '';
  document.getElementById('fDesc').value = card?.desc || '';
  document.getElementById('fArea').value = card?.area || currentArea;
  document.getElementById('fUrgencia').value = card?.urgencia || 'Não';
  document.getElementById('fVisibility').value = card?.visibility || 'area';
  document.getElementById('fSelectedUsers').value = card?.selectedUsers || '';
  document.getElementById('btnSuspend').style.display = id ? 'block' : 'none';

  tempActions = card ? JSON.parse(JSON.stringify(card.actions || [])) : [];
  toggleUsersSelection();
  renderTempActions();

  document.getElementById('overlay').classList.add('open');
  document.getElementById('cardDrawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('cardDrawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function closeAll() {
  closeDrawer();
  closeActionModal();
  closeCardDetailModal();
}

function toggleUsersSelection() {
  const vis = document.getElementById('fVisibility').value;
  document.getElementById('usersField').style.display = vis === 'selected' ? 'block' : 'none';
  if (vis !== 'selected') closeMentionSuggestions();
}

function updateMentionSuggestions() {
  const input = document.getElementById('fSelectedUsers');
  const suggestions = document.getElementById('mentionSuggestions');
  if (!input || !suggestions) return;

  const mentionStart = input.value.lastIndexOf('@');
  if (mentionStart === -1 || input.value.slice(mentionStart).includes(',')) {
    closeMentionSuggestions();
    return;
  }

  const query = input.value.slice(mentionStart + 1).toLowerCase();
  const matches = TEST_USERS.filter(user => user.toLowerCase().includes(query));
  if (!matches.length) {
    closeMentionSuggestions();
    return;
  }

  suggestions.innerHTML = matches.map(user => `<button type="button" class="mention-suggestion" role="option" data-name="${esc(user)}" onmousedown="event.preventDefault()" onclick="selectMention(this.dataset.name)">@${esc(user)}</button>`).join('');
  suggestions.classList.add('open');
}

function selectMention(user) {
  const input = document.getElementById('fSelectedUsers');
  const mentionStart = input.value.lastIndexOf('@');
  const beforeMention = input.value.slice(0, mentionStart).replace(/(?:,\s*)?$/, '');
  input.value = `${beforeMention}${beforeMention ? ', ' : ''}@${user}, `;
  closeMentionSuggestions();
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function handleMentionKeydown(event) {
  if (event.key === 'Escape') {
    closeMentionSuggestions();
    return;
  }
  if (event.key === 'Enter') {
    const firstSuggestion = document.querySelector('.mention-suggestion');
    if (firstSuggestion && document.getElementById('mentionSuggestions').classList.contains('open')) {
      event.preventDefault();
      selectMention(firstSuggestion.dataset.name);
    }
  }
}

function closeMentionSuggestions() {
  const suggestions = document.getElementById('mentionSuggestions');
  if (suggestions) {
    suggestions.classList.remove('open');
    suggestions.innerHTML = '';
  }
}

function saveCard() {
  const id = Number(document.getElementById('cardId').value);
  const title = document.getElementById('fTitle').value.trim();

  if (!title) { toast('O título é obrigatório.'); return; }
  if (tempActions.length === 0) { toast('O campo Ação é obrigatório. Cadastre pelo menos uma ação.'); return; }

  const currentCard = id ? cards.find(c => c.id === id) : null;
  const mirrorGroupId = currentCard?.mirrorGroupId || null;

  const newStatus = id ? currentCard.status : 'A Fazer';
  const pct = calculateProgress(tempActions);
  let finalStatus = newStatus;

  if (pct === 100) finalStatus = 'Concluídos';
  else if (pct > 0 && finalStatus === 'A Fazer') finalStatus = 'Em Andamento';

  const cardData = {
    id: id || Date.now(),
    title,
    desc: document.getElementById('fDesc').value.trim(),
    area: document.getElementById('fArea').value,
    urgencia: document.getElementById('fUrgencia').value,
    visibility: document.getElementById('fVisibility').value,
    selectedUsers: document.getElementById('fSelectedUsers').value,
    actions: tempActions,
    status: finalStatus,
    archived: false,
    mirrorGroupId,
    comments: currentCard?.comments || [],
    tags: currentCard?.tags || [],
    attachments: currentCard?.attachments || [],
    location: currentCard?.location || ''
  };

  if (id) {
    const idx = cards.findIndex(c => c.id === id);
    cards[idx] = cardData;

    if (mirrorGroupId) {
      cards.forEach(c => {
        if (c.mirrorGroupId === mirrorGroupId && c.id !== id) {
          c.title = cardData.title;
          c.desc = cardData.desc;
          c.urgencia = cardData.urgencia;
          c.visibility = cardData.visibility;
          c.selectedUsers = cardData.selectedUsers;
          c.actions = cardData.actions;
          c.status = cardData.status;
        }
      });
    }
  } else {
    cards.push(cardData);
  }

  saveStorage();
  closeDrawer();
  render();
  toast(id ? 'Card atualizado com sucesso!' : 'Card criado com sucesso!');
}

function suspendCurrentCard() {
  const id = Number(document.getElementById('cardId').value);
  if (!id) return;

  const card = cards.find(c => c.id === id);
  if (card) {
    card.status = 'Suspenso';
    card.archived = true;

    saveStorage();
    closeDrawer();
    render();
    toast('Card suspenso por tempo indeterminado!');
  }
}

function reactivateCard(id) {
  const card = cards.find(c => c.id === id);
  if (card) {
    const status = calculateProgress(card.actions) === 100 ? 'Concluídos' : 'A Fazer';
    
    card.archived = false;
    card.status = status;
    delete card.manualProgress;

    saveStorage();
    render();
    toast('Card reativado!');
  }
}

function handleDrop(e, targetStatus) {
  const id = Number(e.dataTransfer.getData('text/plain'));
  const card = cards.find(c => c.id === id);
  if (card) {
    card.status = targetStatus;

    if (targetStatus === 'Concluídos') {
      card.actions = (card.actions || []).map(action => ({ ...action, completed: true }));
      delete card.manualProgress;
    } else if (targetStatus === 'A Fazer') {
      card.manualProgress = 0;
    } else if (targetStatus === 'Em Andamento') {
      card.manualProgress = 50;
    }

    if (card.mirrorGroupId) {
      cards.forEach(c => {
        if (c.mirrorGroupId === card.mirrorGroupId) {
          c.status = targetStatus;
          if (targetStatus === 'Concluídos') {
            c.actions = (c.actions || []).map(action => ({ ...action, completed: true }));
            delete c.manualProgress;
          } else if (targetStatus === 'A Fazer') {
            c.manualProgress = 0;
          } else {
            c.manualProgress = card.manualProgress;
          }
        }
      });
    }

    saveStorage();
    render();
  }
}

function saveStorage() {
  localStorage.setItem('converge_v4_cards', JSON.stringify(cards));
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

init();