// main.js corregido completamente: el botón 'Cambiar vista' alterna correctamente entre vista mensual y semanal

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
  currentView = currentUser.rol === "profesor" ? "semana" : "mes";
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

  // Insertar botón de cambiar vista si es profesor
  const existingToggle = document.getElementById("btnToggleView");
  if (currentUser.rol === "profesor") {
    if (!existingToggle) appDiv.insertBefore(btnToggleView, calendarDiv);
    btnToggleView.style.display = "inline-block";
  } else {
    if (existingToggle) existingToggle.style.display = "none";
  }

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
