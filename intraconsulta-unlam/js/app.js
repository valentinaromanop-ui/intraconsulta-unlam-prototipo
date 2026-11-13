
// MENÚ LATERAL
function toggleMenu() {
  document.getElementById('sidebarDrawer')?.classList.toggle('open');
}

// CHATBOT
function toggleChat() {
  document.getElementById('chatbotWindow')?.classList.toggle('open');
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const body = document.getElementById('chatBody');

  if (!input || !body || !input.value.trim()) return;

  const pregunta = input.value.trim().toLowerCase();

  const userMsg = document.createElement('div');
  userMsg.className = 'msg-user';
  userMsg.textContent = input.value.trim();
  body.appendChild(userMsg);

  input.value = '';

  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'msg-bot';

    if (pregunta.includes('inscrip') || pregunta.includes('materia')) {
      botMsg.textContent = 'Las inscripciones a materias del 2° cuatrimestre abren del 20/07 al 25/07 en Info Académica.';
    } else if (pregunta.includes('pago') || pregunta.includes('mercado')) {
      botMsg.textContent = 'Podés abonar cursos de verano o ingreso con Mercado Pago desde la sección Pagos.';
    } else {
      botMsg.textContent = '¡Entendido! Si necesitás atención personalizada podés generar un Ticket en Ayuda y Contacto.';
    }

    body.appendChild(botMsg);
    body.scrollTop = body.scrollHeight;
  }, 400);
}

// CARRUSEL HOME
const slides = [
  {
    tag: 'AVISO IMPORTANTE',
    title: 'Inscripción a Exámenes Finales - Llamado Julio',
    desc: 'Ya podés anotarte de forma 100% digital sin filas. Verificá tus correlativas antes de confirmar.',
    btnText: 'Ir a Inscripciones',
    link: 'academica.html'
  },
  {
    tag: 'NUEVO SERVICIO',
    title: 'Pagos integrados con Mercado Pago',
    desc: 'Aboná materias de verano y curso de ingreso al instante y descargá tu comprobante oficial.',
    btnText: 'Ir a Pagos',
    link: 'pagos.html'
  },
  {
    tag: 'SOPORTE AL ESTUDIANTE',
    title: '¿Tuviste algún inconveniente con una nota?',
    desc: 'Iniciá un reclamo académico o abrí un ticket directo con el departamento correspondiente.',
    btnText: 'Iniciar Reclamo',
    link: 'tramites.html'
  }
];

let currentSlide = 0;

function changeSlide(dir) {
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  const slide = slides[currentSlide];

  const tag = document.getElementById('slideTag');
  const title = document.getElementById('slideTitle');
  const desc = document.getElementById('slideDesc');
  const btn = document.getElementById('slideBtn');

  if (!tag || !title || !desc || !btn) return;

  tag.textContent = slide.tag;
  title.textContent = slide.title;
  desc.textContent = slide.desc;
  btn.textContent = slide.btnText;
  btn.href = slide.link;
}

// CALENDARIO
const eventosBaseUNLaM = {
  "2026-11-12": [{ titulo: "Inscripción a Finales (10 a 18 h)", tipo: "unlam" }],
  "2026-11-13": [{ titulo: "Último día Inscripción Finales (10 a 18 h)", tipo: "unlam" }],
  "2026-11-18": [{ titulo: "Verificación Inscripción Finales (10 a 22 h)", tipo: "unlam" }],
  "2026-11-23": [{ titulo: "Feriado: Día de la Soberanía Nacional", tipo: "feriado" }],

  "2026-12-05": [{ titulo: "Finalización de clases 2° Cuatrimestre", tipo: "unlam" }],
  "2026-12-08": [{ titulo: "Feriado: Inmaculada Concepción", tipo: "feriado" }],
  "2026-12-10": [{ titulo: "Inicio Mesas Finales Diciembre", tipo: "unlam" }],
  "2026-12-11": [{ titulo: "Inscripción Curso Verano EFC", tipo: "unlam" }],
  "2026-12-14": [{ titulo: "Inscripción Curso Verano Dptos (14 al 17/12)", tipo: "unlam" }],
  "2026-12-19": [{ titulo: "Cierre Mesas Finales Diciembre", tipo: "unlam" }],
  "2026-12-22": [{ titulo: "Verificación Curso Verano (10 a 18 h)", tipo: "unlam" }],
  "2026-12-25": [{ titulo: "Feriado: Navidad", tipo: "feriado" }],

  "2027-01-01": [{ titulo: "Feriado: Año Nuevo", tipo: "feriado" }],
  "2027-02-01": [{ titulo: "Inicio Cursada Verano 2027", tipo: "unlam" }],
  "2027-02-04": [{ titulo: "Inscripción Finales Feb-Mar (10 a 18 h)", tipo: "unlam" }],
  "2027-02-05": [{ titulo: "Inscripción Finales Feb-Mar (10 a 18 h)", tipo: "unlam" }],
  "2027-02-12": [{ titulo: "Verificación Finales Feb-Mar", tipo: "unlam" }],
  "2027-02-17": [{ titulo: "Mesas Finales (17 al 20/02)", tipo: "unlam" }],
  "2027-03-02": [{ titulo: "Inscripción Materias 1° Cuatr. 2027 (02 al 05/03)", tipo: "unlam" }],
  "2027-03-06": [{ titulo: "Fin Curso de Verano 2027", tipo: "unlam" }],
  "2027-03-29": [{ titulo: "Inicio de Clases 1° Cuatrimestre 2027", tipo: "unlam" }]
};

let eventosPersonales = JSON.parse(localStorage.getItem('unlam_eventos_personales')) || {
  "2026-11-19": [{ titulo: "Entrega Final TP Visualización e Interfaces", tipo: "personal" }]
};

let fechaActualCal = new Date(2026, 10, 1);
let fechaSeleccionada = "2026-11-13";

const nombresMeses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function obtenerEventosDeFecha(fechaStr) {
  return [
    ...(eventosBaseUNLaM[fechaStr] || []),
    ...(eventosPersonales[fechaStr] || [])
  ];
}

function renderizarCalendario() {
  const grid = document.getElementById('diasGrid');
  const titulo = document.getElementById('mesAnioTitulo');

  if (!grid || !titulo) return;

  const anio = fechaActualCal.getFullYear();
  const mes = fechaActualCal.getMonth();

  titulo.textContent = `${nombresMeses[mes]} ${anio}`;
  grid.innerHTML = '';

  let primerDia = new Date(anio, mes, 1).getDay();
  primerDia = primerDia === 0 ? 6 : primerDia - 1;

  const diasEnMes = new Date(anio, mes + 1, 0).getDate();

  for (let i = 0; i < primerDia; i++) {
    const vacio = document.createElement('div');
    vacio.className = 'cal-day empty';
    grid.appendChild(vacio);
  }

  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fechaClave = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const eventos = obtenerEventosDeFecha(fechaClave);

    const celda = document.createElement('div');
    celda.className = 'cal-day';

    if (fechaClave === fechaSeleccionada) celda.classList.add('selected');
    if (fechaClave === "2026-11-13") celda.classList.add('today');

    const dayDots = document.createElement('div');
    dayDots.className = 'day-dots';

    eventos.forEach(ev => {
      const chip = document.createElement('div');
      chip.className = `event-chip chip-${ev.tipo}`;
      chip.textContent = ev.titulo;
      dayDots.appendChild(chip);
    });

    const numero = document.createElement('span');
    numero.className = 'day-num';
    numero.textContent = dia;

    celda.appendChild(numero);
    celda.appendChild(dayDots);

    celda.onclick = () => {
      fechaSeleccionada = fechaClave;
      renderizarCalendario();
      mostrarEventosDia(fechaClave);
    };

    grid.appendChild(celda);
  }

  mostrarEventosDia(fechaSeleccionada);
}

function cambiarMes(delta) {
  fechaActualCal.setMonth(fechaActualCal.getMonth() + delta);
  renderizarCalendario();
}

function mostrarEventosDia(fechaClave) {
  const tituloDia = document.getElementById('fechaSeleccionadaTitulo');
  const lista = document.getElementById('listaEventosDia');

  if (!tituloDia || !lista) return;

  const [anio, mes, dia] = fechaClave.split('-');
  tituloDia.textContent = `Eventos del ${dia}/${mes}/${anio}`;

  const eventos = obtenerEventosDeFecha(fechaClave);
  lista.innerHTML = '';

  if (eventos.length === 0) {
    lista.innerHTML = '<p style="font-size:0.88rem; color:var(--text-muted);">No hay eventos programados para este día. Podés agendar uno abajo.</p>';
    return;
  }

  eventos.forEach(ev => {
    const color = ev.tipo === 'feriado' ? '#DC2626' :
                  ev.tipo === 'personal' ? '#2563EB' : '#007A33';

    const etiqueta = ev.tipo === 'feriado' ? 'Feriado' :
                     ev.tipo === 'personal' ? 'Personal' : 'UNLaM';

    const item = document.createElement('div');
    item.style.cssText = `padding:10px 12px; background:#F8FAFC; border-left:4px solid ${color}; border-radius:6px; display:flex; justify-content:space-between; align-items:center; gap:8px;`;

    item.innerHTML = `
      <div>
        <span style="font-size:0.75rem; font-weight:700; color:${color}; text-transform:uppercase;">${etiqueta}</span>
        <div style="font-size:0.9rem; font-weight:600;">${ev.titulo}</div>
      </div>
    `;

    lista.appendChild(item);
  });
}

function agregarEventoPersonal(e) {
  e.preventDefault();

  const input = document.getElementById('nuevoEventoTitulo');
  const tipo = document.getElementById('nuevoEventoTipo');

  if (!input || !tipo || !input.value.trim()) return;

  if (!eventosPersonales[fechaSeleccionada]) {
    eventosPersonales[fechaSeleccionada] = [];
  }

  eventosPersonales[fechaSeleccionada].push({
    titulo: input.value.trim(),
    tipo: tipo.value
  });

  localStorage.setItem('unlam_eventos_personales', JSON.stringify(eventosPersonales));

  input.value = '';
  renderizarCalendario();
}

document.addEventListener('DOMContentLoaded', renderizarCalendario);
