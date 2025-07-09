
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
  if (currentUser.rol === "alumno" && currentUser.nivel === "GP" && (currentUser.curso >=5 && currentUser.curso <=6)) {
    interval = 30;
  }

  calendarDiv.innerHTML = dias.map(d => `<div class="cell"><strong>${d}</strong></div>`).join("");
  for (let h = start * 60; h < end * 60; h += interval) {
    for (let d=0; d<5; d++) {
      const time = `${String(Math.floor(h/60)).padStart(2,"0")}:${String(h%60).padStart(2,"0")}`;
      const key = { dia: dias[d], hora: time };
      const existe = reservas.find(r => {
        return (currentUser.rol==="alumno" ? r.alumno === currentUser.id : currentUser.rol==="profesor" ? r.profesor === currentUser.id : true)
          && r.dia===key.dia && r.hora===key.hora;
      });
      const estado = existe ? "reservado" : "libre";
      const div = document.createElement("div");
      div.className = `cell ${estado}`;
      div.textContent = time + (existe ? ` (${existe.alumno || existe.profesor})` : "");
      if (estado==="libre" && currentUser.rol==="alumno") {
        div.onclick = () => {
          reservas.push({ profesor: "P00", alumno: currentUser.id, dia: key.dia, hora: key.hora });
          renderCalendar();
        };
      }
      calendarDiv.append(div);
    }
  }
}
