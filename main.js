// main.js completo con gestión de reservas activada en la vista semanal

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const userIdInput = document.getElementById("userId");
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const tituloUser = document.getElementById("tituloUser");
const calendarDiv = document.getElementById("calendar");

let currentUser = null;
let currentView = null;
let selectedDate = new Date();
const reservas = [];

const btnToggleView = document.createElement("button");
btnToggleView.id = "btnToggleView";
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
  calendarDiv.innerHTML = "";
};

function renderCalendar() {
  calendarDiv.innerHTML = "";

  if (!document.getElementById("btnToggleView")) {
    appDiv.insertBefore(btnToggleView, calendarDiv);
  }
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
  // ... igual que antes ...
}

function getNombreMes(mes) {
  return ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][mes];
}

function renderWeekView() {
  const inicioSemana = new Date(selectedDate);
  const dia = inicioSemana.getDay();
  const diferencia = dia === 0 ? -6 : 1 - dia;
  inicioSemana.setDate(inicioSemana.getDate() + diferencia);

  const grid = document.createElement("table");
  const header = document.createElement("tr");
  for (let i = 0; i < 5; i++) {
    const fecha = new Date(inicioSemana);
    fecha.setDate(fecha.getDate() + i);
    const th = document.createElement("th");
    th.textContent = `${["Lun", "Mar", "Mié", "Jue", "Vie"][i]}\n${fecha.getDate()}`;
    header.appendChild(th);
  }
  grid.appendChild(header);

  for (let h = 9; h < 22; h++) {
    const fila = document.createElement("tr");
    for (let d = 0; d < 5; d++) {
      const celda = document.createElement("td");
      const fechaCelda = new Date(inicioSemana);
      fechaCelda.setDate(fechaCelda.getDate() + d);
      const fechaTexto = fechaCelda.toISOString().split('T')[0];
      const horaTexto = `${String(h).padStart(2, '0')}:00`;

      const r = reservas.find(r => r.fecha === fechaTexto && r.hora === horaTexto);
      if (r) {
        celda.textContent = currentUser.rol === "profesor" || currentUser.rol === "admin" ? `${r.alumno}` : "Ocupado";
        celda.style.background = "#ffcdd2";
      } else {
        celda.textContent = horaTexto;
        celda.style.background = "#c8e6c9";
        if (currentUser.rol === "alumno") {
          celda.onclick = () => {
            const obra = prompt("¿Qué obra vas a ensayar?");
            if (!obra) return;
            reservas.push({ alumno: currentUser.id, fecha: fechaTexto, hora: horaTexto, obra });
            renderCalendar();
          };
        }
      }
      fila.appendChild(celda);
    }
    grid.appendChild(fila);
  }

  calendarDiv.appendChild(grid);
}
