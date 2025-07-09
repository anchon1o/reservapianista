// main.js completo actualizado: gestión de reservas y cambio entre vista mensual/semanal

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const userIdInput = document.getElementById("userId");
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const tituloUser = document.getElementById("tituloUser");
const calendarDiv = document.getElementById("calendar");

let currentUser = null;
let currentView = "mes";
let selectedDate = new Date();
const reservas = [];

const btnToggleView = document.createElement("button");
btnToggleView.id = "btnToggleView";
btnToggleView.textContent = "🔄 Ver semana";
btnToggleView.onclick = () => {
  currentView = currentView === "mes" ? "semana" : "mes";
  btnToggleView.textContent = currentView === "mes" ? "🔄 Ver semana" : "🔄 Ver mes";
  renderCalendar();
};

btnLogin.onclick = () => {
  const id = userIdInput.value.trim();
  if (!usuarios[id]) return alert("ID no válido.");
  currentUser = { id, ...usuarios[id] };
  loginDiv.classList.add("hidden");
  appDiv.classList.remove("hidden");
  const cursoInfo = currentUser.nivel ? ` - ${currentUser.nivel} ${currentUser.curso}` : "";
  tituloUser.textContent = `Hola ${currentUser.nombre} (${currentUser.rol})${cursoInfo}`;
  currentView = ["profesor", "admin"].includes(currentUser.rol) ? "semana" : "mes";
  renderCalendar();
};

btnLogout.onclick = () => {
  currentUser = null;
  reservas.length = 0;
  loginDiv.classList.remove("hidden");
  appDiv.classList.add("hidden");
};

function renderCalendar() {
  calendarDiv.innerHTML = "";

  const existingToggle = document.getElementById("btnToggleView");
  if (!existingToggle) appDiv.insertBefore(btnToggleView, calendarDiv);
  btnToggleView.style.display = "inline-block";
  btnToggleView.textContent = currentView === "mes" ? "🔄 Ver semana" : "🔄 Ver mes";

  if (currentUser.rol === "alumno") {
    const hoy = new Date();
    const proxima = reservas.find(r => r.alumno === currentUser.id && new Date(r.fecha + ' ' + r.hora) > hoy);
    if (proxima) {
      const aviso = document.createElement("div");
      aviso.className = "resumen-reserva";
      aviso.innerHTML = `👉 Próxima reserva: <strong>${proxima.fecha}</strong> a las <strong>${proxima.hora}</strong><br>🎼 Obra: <em>${proxima.obra || "(sin especificar)"}</em>`;
      calendarDiv.appendChild(aviso);
    }
  }

  if (currentView === "mes") {
    renderMonthView();
  } else {
    renderWeekView();
  }
}

function renderMonthView() {
  const mes = selectedDate.getMonth();
  const anio = selectedDate.getFullYear();
  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);

  const grid = document.createElement("table");
  const header = document.createElement("tr");
  ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].forEach(d => {
    const th = document.createElement("th");
    th.textContent = d;
    header.appendChild(th);
  });
  grid.appendChild(header);

  let fila = document.createElement("tr");
  for (let i = 1; i < primerDia.getDay(); i++) {
    fila.appendChild(document.createElement("td"));
  }

  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const fecha = new Date(anio, mes, dia);
    const celda = document.createElement("td");
    celda.textContent = dia;
    celda.onclick = () => {
      selectedDate = fecha;
      renderCalendar();
    };
    fila.appendChild(celda);
    if (fecha.getDay() === 0) {
      grid.appendChild(fila);
      fila = document.createElement("tr");
    }
  }
  if (fila.children.length > 0) grid.appendChild(fila);

  const controles = document.createElement("div");
  const titulo = document.createElement("h3");
  titulo.textContent = `${getNombreMes(mes)} ${anio}`;
  controles.appendChild(titulo);

  const prev = document.createElement("button");
  prev.textContent = "◀";
  prev.onclick = () => {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    renderCalendar();
  };

  const next = document.createElement("button");
  next.textContent = "▶";
  next.onclick = () => {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    renderCalendar();
  };

  controles.appendChild(prev);
  controles.appendChild(next);
  calendarDiv.appendChild(controles);
  calendarDiv.appendChild(grid);
}

function getNombreMes(mes) {
  return ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][mes];
}

function renderWeekView() {
  const grid = document.createElement("table");
  const header = document.createElement("tr");
  ["Lun", "Mar", "Mié", "Jue", "Vie"].forEach(d => {
    const th = document.createElement("th");
    th.textContent = d;
    header.appendChild(th);
  });
  grid.appendChild(header);

  for (let h = 9; h < 22; h++) {
    const fila = document.createElement("tr");
    for (let d = 1; d <= 5; d++) {
      const celda = document.createElement("td");
      celda.textContent = `${h}:00`;
      fila.appendChild(celda);
    }
    grid.appendChild(fila);
  }

  calendarDiv.appendChild(grid);
}
