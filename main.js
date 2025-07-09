// main.js con resumen, corrección de doble columna, y entrada de obra

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const userIdInput = document.getElementById("userId");
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const tituloUser = document.getElementById("tituloUser");
const calendarDiv = document.getElementById("calendar");

const btnToggleView = document.createElement("button");
btnToggleView.textContent = "🔄 Cambiar vista";
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
  renderCalendar();
};

function renderCalendar() {
  calendarDiv.innerHTML = "";

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

  if (currentView === "mes" || currentUser.rol === "alumno") {
    renderMonthView();
  } else {
    renderWeekView();
  }
}

function showDayDetail(date) {
  calendarDiv.innerHTML = "";
  const label = document.createElement("h3");
  label.textContent = date.toLocaleDateString("es");
  calendarDiv.appendChild(label);

  const start = 9 * 60;
  const end = 22 * 60;
  const interval = (currentUser.rol === "alumno" && currentUser.nivel === "GP" && currentUser.curso >= 5) ? 30 : 15;

  for (let min = start; min < end; min += interval) {
    const hourStr = `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
    const reserva = reservas.find(r => r.fecha === date.toDateString() && r.hora === hourStr);
    const div = document.createElement("div");
    div.className = "cell";

    if (reserva) {
      div.classList.add("reservado");
      div.textContent = `${hourStr}`;
      if (reserva.obra) div.title = `Obra: ${reserva.obra}`;
      if (currentUser.rol === "alumno" && reserva.alumno === currentUser.id) {
        div.onclick = () => {
          reservas.splice(reservas.indexOf(reserva), 1);
          showDayDetail(date);
        };
      }
    } else {
      div.classList.add("libre");
      div.textContent = hourStr;
      if (currentUser.rol === "alumno") {
        div.onclick = () => {
          const now = new Date();
          const resDate = new Date(date);
          resDate.setHours(Math.floor(min / 60), min % 60, 0, 0);
          const diffHours = (resDate - now) / (1000 * 60 * 60);

          if (diffHours < 96) {
            alert("La reserva debe hacerse con al menos 96 horas de antelación.");
            return;
          }
          if (diffHours > 240) {
            alert("La reserva no puede hacerse con más de 10 días de antelación.");
            return;
          }

          const reservaPendiente = reservas.some(r => r.alumno === currentUser.id && new Date(r.fecha + ' ' + r.hora) > now);
          if (reservaPendiente) {
            alert("Ya tienes una reserva pendiente. No puedes reservar otra hasta realizarla.");
            return;
          }

          const haceMenosDe2Semanas = reservas.some(r => {
            return r.alumno === currentUser.id && r.fecha &&
              Math.abs(new Date(r.fecha) - now) < 14 * 24 * 60 * 60 * 1000;
          });
          if (haceMenosDe2Semanas) {
            alert("Solo puedes tener una reserva cada dos semanas.");
            return;
          }

          const obra = prompt("¿Qué obra u obras vas a ensayar?");
          reservas.push({ alumno: currentUser.id, profesor: "P00", fecha: date.toDateString(), hora: hourStr, obra });
          showDayDetail(date);
        };
      }
    }

    calendarDiv.appendChild(div);
  }
}

function renderMonthView() {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const monthLabel = document.createElement("h3");
  monthLabel.textContent = `${firstDay.toLocaleString("es", { month: "long" })} ${year}`;
  calendarDiv.appendChild(monthLabel);

  const nav = document.createElement("div");
  nav.innerHTML = `<button id="prevMonth">◀️</button> <button id="nextMonth">▶️</button>`;
  calendarDiv.appendChild(nav);

  const grid = document.createElement("div");
  grid.className = "month-grid";
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  dias.forEach(d => {
    const header = document.createElement("div");
    header.className = "cell header";
    header.textContent = d;
    grid.appendChild(header);
  });

  const offset = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < offset; i++) {
    const empty = document.createElement("div");
    empty.className = "cell empty";
    grid.appendChild(empty);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const cell = document.createElement("div");
    cell.className = "cell day";
    cell.textContent = d;
    cell.onclick = () => showDayDetail(new Date(year, month, d));
    grid.appendChild(cell);
  }

  calendarDiv.appendChild(grid);
  document.getElementById("prevMonth").onclick = () => {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    renderCalendar();
  };
  document.getElementById("nextMonth").onclick = () => {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    renderCalendar();
  };
}

function renderWeekView() {
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  const start = 9, end = 22;
  calendarDiv.innerHTML = dias.map(d => `<div class="cell header"><strong>${d}</strong></div>`).join("");

  for (let h = start * 60; h < end * 60; h += 30) {
    for (let d = 0; d < 5; d++) {
      const time = `${String(Math.floor(h / 60)).padStart(2, "0")}:${String(h % 60).padStart(2, "0")}`;
      const div = document.createElement("div");
      div.className = "cell";
      const found = reservas.find(r => r.dia === dias[d] && r.hora === time);
      if (found) {
        div.classList.add("reservado");
        div.textContent = `${time} (${found.alumno})`;
      } else {
        div.classList.add("libre");
        div.textContent = time;
      }
      calendarDiv.appendChild(div);
    }
  }
}
