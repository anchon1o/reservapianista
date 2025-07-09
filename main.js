// main.js corregido: el botón 'Cambiar vista' alterna entre vista mensual y semanal únicamente, y se oculta en vista de día

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const userIdInput = document.getElementById("userId");
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const tituloUser = document.getElementById("tituloUser");
const calendarDiv = document.getElementById("calendar");

const btnToggleView = document.createElement("button");
btnToggleView.textContent = "🔄 Ver semana";
btnToggleView.id = "btnToggleView";
appDiv.insertBefore(btnToggleView, calendarDiv);

let currentUser = null;
let currentView = "mes";
let selectedDate = new Date();
const reservas = [];

btnLogin.onclick = () => {
  const id = userIdInput.value.trim();
  if (!usuarios[id]) return alert("ID no válido.");
  currentUser = { id, ...usuarios[id] };
  loginDiv.classList.add("hidden");
  appDiv.classList.remove("hidden");
  const cursoInfo = currentUser.nivel ? ` - ${currentUser.nivel} ${currentUser.curso}` : "";
  tituloUser.textContent = `Hola ${currentUser.nombre} (${currentUser.rol})${cursoInfo}`;
  currentView = "mes"; // Reset a vista mensual al iniciar
  renderCalendar();
};

btnLogout.onclick = () => {
  currentUser = null;
  reservas.length = 0;
  loginDiv.classList.remove("hidden");
  appDiv.classList.add("hidden");
};

btnToggleView.onclick = () => {
  currentView = currentView === "mes" ? "semana" : "mes";
  btnToggleView.textContent = currentView === "mes" ? "🔄 Ver semana" : "🔄 Ver mes";
  renderCalendar();
};

function renderCalendar() {
  calendarDiv.innerHTML = "";
  btnToggleView.style.display = currentUser.rol === "profesor" ? "inline-block" : "none";

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
