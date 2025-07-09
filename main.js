// main.js actualizado con doble columna por día y cancelación

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const userIdInput = document.getElementById("userId");
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const tituloUser = document.getElementById("tituloUser");
const calendarDiv = document.getElementById("calendar");

let currentUser = null;
const reservas = [];

btnLogin.onclick = () => {
  const id = userIdInput.value.trim();
  if (!usuarios[id]) return alert("ID no válido.");
  currentUser = { id, ...usuarios[id] };
  loginDiv.classList.add("hidden");
  appDiv.classList.remove("hidden");
  tituloUser.textContent = `Hola ${currentUser.nombre} (${currentUser.rol})`;
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
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  const start = 9, end = 22;

  let interval = 15;
  if (currentUser.rol === "alumno" && currentUser.nivel === "GP" && (currentUser.curso >= 5 && currentUser.curso <= 6)) {
    interval = 30;
  }

  // Crear cabecera con dos columnas por día
  for (let d = 0; d < dias.length; d++) {
    const dia = dias[d];
    const header1 = document.createElement("div");
    header1.className = "cell";
    header1.innerHTML = `<strong>${dia}<br>:00/:30</strong>`;
    calendarDiv.append(header1);

    const header2 = document.createElement("div");
    header2.className = "cell";
    header2.innerHTML = `<strong>${dia}<br>:15/:45</strong>`;
    calendarDiv.append(header2);
  }

  // Crear celdas de calendario
  for (let h = start * 60; h < end * 60; h += 30) {
    for (let offset of [0, 15]) {
      const baseMinutes = h + offset;
      for (let d = 0; d < dias.length; d++) {
        const dia = dias[d];
        for (let s = 0; s < 2; s++) {
          const min = baseMinutes + (s * 15);
          const hourStr = `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

          const key = { dia, hora: hourStr };
          const reserva = reservas.find(r => r.dia === key.dia && r.hora === key.hora);

          const div = document.createElement("div");
          div.className = "cell";
          if (reserva) {
            div.classList.add("reservado");
            div.textContent = `${hourStr} (${reserva.alumno || reserva.profesor})`;
            if (currentUser.rol === "alumno" && reserva.alumno === currentUser.id) {
              div.onclick = () => {
                const i = reservas.indexOf(reserva);
                if (i !== -1) reservas.splice(i, 1);
                renderCalendar();
              };
            }
          } else {
            div.classList.add("libre");
            div.textContent = hourStr;
            if (currentUser.rol === "alumno") {
              div.onclick = () => {
                reservas.push({ profesor: "P00", alumno: currentUser.id, dia: key.dia, hora: key.hora });
                renderCalendar();
              };
            }
          }

          calendarDiv.appendChild(div);
        }
      }
    }
  }
}
