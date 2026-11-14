/* INTRACONSULTA UNLaM - comportamiento compartido (header, menu, footer, chatbot, tabs, calendario) */
(() => {
const USER = { name: 'Valentina Romano', carrera: 'Ingeniería en Informática', legajo: '12345678' };
const PROFILE_STORAGE_KEY = 'ic_profile';
function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return {};
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) throw new Error('Invalid profile data');
    return ['email', 'phone', 'address'].reduce((profile, key) => {
      if (typeof saved[key] === 'string') profile[key] = saved[key];
      return profile;
    }, {});
  } catch (e) {
    toast('No se pudieron cargar los datos guardados del perfil.');
    return {};
  }
}
const P = (p, l = '') => p; // alias
const ICONS = {
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 14h.01M15 14h.01M2 14h2M20 14h2"/>',
  grad:'<path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  home:'<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  alert:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  check:'<path d="M20 6L9 17l-5-5"/>'
};
const ico = (n, s = 20) => `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const pad = n => String(n).padStart(2, '0');
const fmtKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

const NAV = [
  ['home','home.html','Panel principal','home'],
  ['perfil','perfil.html','Mi perfil','user'],
  ['academica','academica.html','Info académica','grad'],
  ['tramites','tramites.html','Trámites y reclamos','file'],
  ['pagos','pagos.html','Pagos','card'],
  ['ayuda','ayuda.html','Ayuda y contacto','help']
];

/* ---------- Eventos del calendario ---------- */
const EVENTS = [
  ['2026-11-16','Abre inscripción a finales (Diciembre)','unlam'],['2026-11-20','Cierra inscripción a finales','unlam'],
  ['2026-11-23','Feriado: Soberanía Nacional','feriado'],['2026-11-27','Cierre de actas de cursada','unlam'],
  ['2026-12-02','Comienzan los finales de Diciembre','unlam'],['2026-12-08','Feriado: Inmaculada Concepción','feriado'],
  ['2026-12-18','Terminan los finales de Diciembre','unlam'],['2026-12-25','Feriado: Navidad','feriado'],
  ['2027-01-01','Feriado: Año Nuevo','feriado'],['2027-02-01','Abre inscripción a materias de verano','unlam'],
  ['2026-03-24','Feriado: Día de la Memoria','feriado'],['2026-04-02','Feriado: Malvinas','feriado'],['2026-05-01','Feriado: Día del Trabajador','feriado'],
  ['2026-05-25','Feriado: Revolución de Mayo','feriado'],['2026-06-15','Feriado: Güemes (trasladado)','feriado'],['2026-06-20','Feriado: Belgrano','feriado'],
  ['2026-07-09','Feriado: Independencia','feriado'],['2026-08-17','Feriado: San Martín','feriado'],['2026-10-12','Feriado: Diversidad Cultural','feriado']
].map(([d, t, k]) => ({ d, t, k }));
const loadPersonal = () => { try { return JSON.parse(localStorage.getItem('ic_personal')) || []; } catch (e) { return []; } };
const savePersonal = a => { try { localStorage.setItem('ic_personal', JSON.stringify(a)); } catch (e) {} };
const allEvents = () => [...EVENTS, ...loadPersonal().map((e, i) => ({ ...e, k: 'personal', i }))];

/* ---------- Toast ---------- */
function toast(msg) {
  $$('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.append(t); setTimeout(() => t.remove(), 3200);
}
Object.assign(USER, loadProfile());
Object.assign(USER, { dni: '40.123.456', email: USER.email || 'valentina.romano@alumno.unlam.edu.ar', phone: USER.phone || '11 4567-8901', address: USER.address || 'San Justo, Buenos Aires' });

/* ---------- Layout: header, menu lateral, footer, chatbot ---------- */
function buildLayout() {
  const body = document.body, page = body.dataset.page, auth = body.dataset.layout === 'auth';
  const main = $('main');
  const header = document.createElement('header'); header.className = 'top-header';
  const brand = `<a class="brand" href="${auth ? 'index.html' : 'home.html'}" aria-label="Intraconsulta UNLaM, ir al inicio"><img class="header-logo" src="logo-unlam-bt.png" alt="UNLaM"><span class="brand-text">Intraconsulta</span></a>`;
  header.innerHTML = auth
    ? `<div class="header-left">${brand}</div><div class="header-right"><a class="icon-btn" href="calendario.html" title="Calendario académico" aria-label="Calendario académico">${ico('cal', 22)}</a></div>`
    : `<div class="header-left">${brand}
        <form class="search-bar" id="searchForm" role="search"><input id="searchInput" type="search" placeholder="Buscar trámite, materia o certificado..." aria-label="Buscar"><button type="submit" aria-label="Buscar">${ico('search')}</button></form></div>
       <div class="header-right">
        <a class="icon-btn" href="calendario.html" title="Calendario académico" aria-label="Calendario académico">${ico('cal', 22)}</a>
        <div class="dropdown"><button class="icon-btn" id="bellBtn" aria-label="Notificaciones, 2 sin leer" aria-expanded="false">${ico('bell', 22)}<span class="badge-count">2</span></button>
          <div class="dropdown-menu"><div class="dd-title">Notificaciones</div>
            <a class="dd-item" href="ayuda.html#tickets">Tu ticket #1042 fue respondido<small>Hace 2 horas</small></a>
            <a class="dd-item" href="academica.html#inscripciones">Inscripción a finales abre el 16/11<small>Ayer</small></a></div></div>
        <div class="dropdown"><button class="icon-btn" id="userBtn" aria-label="Menú de usuario" aria-expanded="false">${ico('user', 22)}</button>
          <div class="dropdown-menu"><div class="dd-title">${USER.name}</div>
            <span class="dd-item">${USER.carrera}<small>Legajo ${USER.legajo}</small></span>
            <a class="dd-item" href="perfil.html">Mi perfil</a>
            <a class="dd-item" href="index.html">Cerrar sesión</a></div></div>
       </div>`;
  body.prepend(header);

  if (!auth) {
    const rail = document.createElement('button'); rail.className = 'sidebar-rail'; rail.setAttribute('aria-label', 'Abrir menú'); rail.setAttribute('aria-expanded', 'false');
    rail.innerHTML = `${ico('menu', 26)}<span class="rail-text">MENÚ</span>`;
    const drawer = document.createElement('nav'); drawer.className = 'sidebar-drawer'; drawer.setAttribute('aria-label', 'Menú principal');
    drawer.innerHTML = `<div class="drawer-title">¿A dónde querés ir?</div>` + NAV.map(([k, h, l, i]) => `<a class="menu-pill-btn${k === page ? ' active' : ''}" href="${h}">${ico(i)}${l}</a>`).join('');
    const overlay = document.createElement('div'); overlay.className = 'drawer-overlay';
    const layout = document.createElement('div'); layout.className = 'app-layout';
    main.before(layout); layout.append(rail, main); body.append(drawer, overlay);
    const toggle = open => { drawer.classList.toggle('open', open); overlay.classList.toggle('open', open); rail.setAttribute('aria-expanded', open); };
    rail.onclick = () => toggle(!drawer.classList.contains('open'));
    overlay.onclick = () => toggle(false);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  const footer = document.createElement('footer'); footer.className = 'main-footer';
  footer.innerHTML = `<div class="footer-grid">
    <div><img class="footer-logo" src="logo-unlam-bt.png" alt="UNLaM"><p>Sistema de autogestión para estudiantes de la Universidad Nacional de La Matanza. Inscripciones, trámites y pagos en un solo lugar, sin filas.</p></div>
    <div><h4>Contacto</h4><ul>
      <li>Florencio Varela 1903, San Justo, Buenos Aires</li>
      <li>Teléfono: (011) 4480-8900</li><li>Correo: intraconsulta@unlam.edu.ar</li>
      <li>Atención: lunes a viernes de 9 a 20 hs</li></ul></div>
    <div><h4>Enlaces útiles</h4><ul>
      <li><a href="https://www.unlam.edu.ar" target="_blank" rel="noopener">Sitio web de UNLaM</a></li>
      <li><a href="ayuda.html#faq">Preguntas frecuentes</a></li><li><a href="calendario.html">Calendario académico</a></li>
      <li><a href="ayuda.html#tickets">Generar un ticket</a></li></ul></div></div>
    <div class="footer-bottom">© 2026 Universidad Nacional de La Matanza. Prototipo académico de Visualización e Interfaces.</div>`;
  body.append(footer);

  if (!auth) buildChat();
  $$('[data-ico]').forEach(e => e.innerHTML = ico(e.dataset.ico, +e.dataset.size || 20));
  $$('[data-user-name]').forEach(e => e.textContent = USER.name.split(' ')[0]);
  $$('[data-profile-name]').forEach(e => e.textContent = USER.name);
  $$('[data-profile-career]').forEach(e => e.textContent = USER.carrera);
  $$('[data-profile-legajo]').forEach(e => e.textContent = USER.legajo);
  $$('[data-profile-dni]').forEach(e => e.textContent = USER.dni);
  $$('[data-profile-initials]').forEach(e => e.textContent = USER.name.split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase());

  // dropdowns
  $$('.dropdown > button').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const d = b.parentElement, open = !d.classList.contains('open');
    $$('.dropdown.open').forEach(x => x.classList.remove('open')); d.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  }));
  document.addEventListener('click', () => $$('.dropdown.open').forEach(x => x.classList.remove('open')));

  // buscador
  const sf = $('#searchForm');
  if (sf) sf.addEventListener('submit', e => {
    e.preventDefault(); const q = norm($('#searchInput').value.trim()); if (!q) return;
    const KEYS = {
      'academica.html':'materia horario nota calificacion inscripcion examen final carrera comision',
      'tramites.html':'beca certificado reclamo tramite cambio',
      'pagos.html':'pago arancel mercado comprobante verano ingreso curso',
      'ayuda.html':'ayuda ticket pregunta frecuente chatbot contacto soporte',
      'calendario.html':'calendario fecha feriado evento'
    };
    const words = q.split(/\s+/).filter(w => w.length > 2);
    const hit = Object.keys(KEYS).find(k => words.some(w => KEYS[k].includes(w)));
    location.href = hit || 'error.html?q=' + encodeURIComponent(q);
  });
}

/* ---------- Chatbot ---------- */
function buildChat() {
  const fab = document.createElement('button'); fab.className = 'chatbot-fab'; fab.setAttribute('aria-label', 'Abrir asistente virtual'); fab.innerHTML = ico('bot', 30);
  const win = document.createElement('div'); win.className = 'chatbot-window';
  win.innerHTML = `<div class="chat-header"><span>Asistente virtual</span><button aria-label="Cerrar chat">${ico('x')}</button></div>
    <div class="chat-body" id="chatBody"><div class="msg-bot">Hola, soy el asistente de Intraconsulta. Consultame por becas, pagos, certificados, notas o inscripciones.</div></div>
    <form class="chat-footer" id="chatForm"><input id="chatInput" placeholder="Escribí tu consulta..." aria-label="Mensaje" autocomplete="off"><button aria-label="Enviar">${ico('send', 16)}</button></form>`;
  document.body.append(fab, win);
  const BOT = [
    [/beca/, 'Podés solicitar una beca en <a href="tramites.html#becas">Trámites y reclamos</a>.'],
    [/pag|arancel|mercado|comprobante/, 'Los pagos se hacen con Mercado Pago en <a href="pagos.html">Pagos</a>. Ahí también está tu comprobante.'],
    [/certific/, 'Pedí tu certificado en <a href="tramites.html#certificados">Trámites y reclamos</a>. Se genera en 48 hs hábiles.'],
    [/nota|calific|reclamo/, 'Tus notas están en <a href="academica.html#notas">Info académica</a>. Para reclamar una nota usá <a href="tramites.html#reclamos">Reclamos</a>.'],
    [/inscrip|final|examen|materia/, 'Inscribite a materias y finales desde <a href="academica.html#inscripciones">Info académica</a>.'],
    [/humano|persona|ticket|agente/, 'Podés hablar con una persona generando un <a href="ayuda.html#tickets">ticket de soporte</a>.']
  ];
  const body = $('#chatBody');
  const add = (c, t, html) => { const m = document.createElement('div'); m.className = c; html ? m.innerHTML = t : m.textContent = t; body.append(m); body.scrollTop = body.scrollHeight; };
  $('#chatForm').addEventListener('submit', e => {
    e.preventDefault(); const i = $('#chatInput'), v = i.value.trim(); if (!v) return;
    add('msg-user', v); i.value = '';
    const r = BOT.find(([re]) => re.test(norm(v)));
    setTimeout(() => add('msg-bot', r ? r[1] : 'No encontré una respuesta. Podés generar un <a href="ayuda.html#tickets">ticket</a> y te respondemos.', true), 500);
  });
  const t = o => { win.classList.toggle('open', o); fab.setAttribute('aria-expanded', o); if (o) $('#chatInput').focus(); };
  fab.onclick = () => t(!win.classList.contains('open'));
  $('.chat-header button', win).onclick = () => t(false);
  $$('[data-open-chat]').forEach(b => b.onclick = () => t(true));
}

/* ---------- Pestañas ---------- */
function initTabs() {
  $$('[data-tabs]').forEach(g => {
    const btns = $$('.pill-tab', g);
    const show = k => { btns.forEach(b => b.classList.toggle('active', b.dataset.tab === k)); $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === k)); };
    btns.forEach(b => b.onclick = () => { show(b.dataset.tab); history.replaceState(null, '', '#' + b.dataset.tab); });
    const h = location.hash.slice(1);
    show(btns.some(b => b.dataset.tab === h) ? h : btns[0].dataset.tab);
  });
}

/* ---------- Formularios de demostración, inscripciones y pago ---------- */
function initForms() {
  $$('form[data-demo]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); toast(f.dataset.demo);
    if (f.dataset.redirect) setTimeout(() => location.href = f.dataset.redirect, 900); else f.reset();
  }));
  $$('[data-enroll]').forEach(b => b.onclick = () => {
    b.closest('td').innerHTML = '<span class="status-badge status-ok">Inscripto</span>'; toast('Te inscribiste correctamente. Te enviamos el comprobante por correo.');
  });
  const sel = $('#concepto');
  if (sel) { const upd = () => { const p = +sel.selectedOptions[0].dataset.price; $('#monto').textContent = '$ ' + p.toLocaleString('es-AR'); }; sel.onchange = upd; upd(); }
  const pay = $('#payBtn'); if (pay) pay.onclick = () => toast('Redirigiendo a Mercado Pago para completar el pago...');
}

/* ---------- Perfil ---------- */
function initProfile() {
  const form = $('#profileForm'); if (!form) return;
  $('#profileEmail').value = USER.email;
  $('#profilePhone').value = USER.phone;
  $('#profileAddress').value = USER.address;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const updated = {
      email: $('#profileEmail').value.trim(),
      phone: $('#profilePhone').value.trim(),
      address: $('#profileAddress').value.trim()
    };
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      toast('No se pudieron guardar los cambios. Revisá el almacenamiento del navegador.');
      return;
    }
    Object.assign(USER, updated);
    toast('Tus datos de contacto se actualizaron correctamente.');
  });
}

/* ---------- Carrusel ---------- */
function initCarousel() {
  const box = $('#carousel'); if (!box) return;
  const S = [
    ['Aviso importante','Inscripción a exámenes finales: llamado Diciembre','Ya podés anotarte de forma digital, sin filas. Revisá tus correlativas antes de confirmar.','Ir a inscripciones','academica.html#inscripciones'],
    ['Pagos','Materias de verano 2027','Abonalo online con Mercado Pago y descargá el comprobante al instante.','Ir a pagos','pagos.html'],
    ['Novedad','Seguí tus trámites en tiempo real','Cada cambio de estado de tus pedidos y tickets te llega como notificación.','Ver mis trámites','tramites.html']
  ];
  let i = 0, timer;
  const dots = $('#cDots'); dots.innerHTML = S.map(() => '<span class="dot"></span>').join('');
  const render = () => {
    const s = S[i]; $('#cTag').textContent = s[0]; $('#cTitle').textContent = s[1]; $('#cText').textContent = s[2];
    const b = $('#cBtn'); b.textContent = s[3]; b.href = s[4]; $$('.dot', dots).forEach((d, n) => d.classList.toggle('on', n === i));
  };
  const go = n => { i = (n + S.length) % S.length; render(); clearInterval(timer); timer = setInterval(() => go(i + 1), 7000); };
  $('#cPrev').onclick = () => go(i - 1); $('#cNext').onclick = () => go(i + 1); go(0);
}

/* ---------- Próximos eventos (home) ---------- */
function initUpcoming() {
  const box = $('#upcoming'); if (!box) return;
  const today = fmtKey(new Date());
  const list = allEvents().filter(e => e.d >= today).sort((a, b) => a.d.localeCompare(b.d)).slice(0, 4);
  box.innerHTML = list.map(e => { const [y, m, d] = e.d.split('-'); return `<div class="upc-item"><div class="upc-date"><b>${+d}</b>${MONTHS[+m - 1]}</div><span>${e.t}</span></div>`; }).join('') || '<p>No hay eventos próximos.</p>';
}

/* ---------- Calendario ---------- */
function initCalendar() {
  const grid = $('#calGrid'); if (!grid) return;
  let cur = new Date(); cur.setDate(1); let sel = null;
  const todayKey = fmtKey(new Date());
  const render = () => {
    const y = cur.getFullYear(), m = cur.getMonth();
    $('#calTitle').textContent = cur.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    const off = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate(), evs = allEvents();
    let h = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => `<div class="cal-weekday">${d}</div>`).join('');
    for (let n = 0; n < off; n++) h += '<div class="cal-day empty"></div>';
    for (let d = 1; d <= days; d++) {
      const k = `${y}-${pad(m + 1)}-${pad(d)}`, e = evs.filter(x => x.d === k);
      h += `<button type="button" class="cal-day${k === todayKey ? ' today' : ''}${k === sel ? ' selected' : ''}" data-d="${k}"><span class="day-num">${d}</span>` +
        e.slice(0, 2).map(x => `<span class="event-chip chip-${x.k}">${x.t}</span>`).join('') + (e.length > 2 ? `<span class="event-chip">+${e.length - 2} más</span>` : '') + '</button>';
    }
    grid.innerHTML = h; detail();
    $$('.cal-day[data-d]', grid).forEach(b => b.onclick = () => { sel = b.dataset.d; $('#evDate').value = sel; render(); });
  };
  const detail = () => {
    const box = $('#dayDetail');
    if (!sel) { box.innerHTML = '<p class="hint">Elegí un día para ver sus eventos.</p>'; return; }
    const e = allEvents().filter(x => x.d === sel), [y, m, d] = sel.split('-');
    box.innerHTML = `<h3 style="font-size:1rem;margin-bottom:6px">${+d} de ${MONTHS[+m - 1]} de ${y}</h3>` +
      (e.length ? e.map(x => `<div class="ev-item"><span class="event-chip chip-${x.k}">${x.t}</span>${x.k === 'personal' ? `<button aria-label="Eliminar evento" data-del="${x.i}">×</button>` : ''}</div>`).join('') : '<p class="hint">No hay eventos este día.</p>');
    $$('[data-del]', box).forEach(b => b.onclick = () => { const a = loadPersonal(); a.splice(+b.dataset.del, 1); savePersonal(a); render(); });
  };
  $('#calPrev').onclick = () => { cur.setMonth(cur.getMonth() - 1); render(); };
  $('#calNext').onclick = () => { cur.setMonth(cur.getMonth() + 1); render(); };
  $('#calToday').onclick = () => { cur = new Date(); cur.setDate(1); sel = todayKey; $('#evDate').value = sel; render(); };
  $('#evForm').addEventListener('submit', e => {
    e.preventDefault(); const d = $('#evDate').value, t = $('#evText').value.trim(); if (!d || !t) return;
    const a = loadPersonal(); a.push({ d, t }); savePersonal(a); sel = d; $('#evText').value = ''; render(); toast('Evento agregado a tu calendario.');
  });
  render();
}

/* ---------- Página de error ---------- */
function initError() {
  const q = new URLSearchParams(location.search).get('q'), e = $('#errQuery');
  if (e && q) e.textContent = `No encontramos resultados para "${q}".`;
}

buildLayout(); initTabs(); initForms(); initProfile(); initCarousel(); initUpcoming(); initCalendar(); initError();
})();
