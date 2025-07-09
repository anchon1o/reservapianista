
const usuarios = {
  admin: { rol: "admin", nombre: "Administrador" },
  ...Object.fromEntries(Array.from({length: 10}, (_, i) => [
    `P${i.toString().padStart(2, "0")}`,
    { rol: "profesor", nombre: `Profesor ${i}` }
  ])),
  ...Object.fromEntries(Array.from({length: 700}, (_, i) => {
    const id = `A${i.toString().padStart(3, "0")}`;
    const curso = Math.floor(i / 100) + 1;
    const nivel = curso <= 4 ? "GE" : "GP";
    const cursoReal = nivel === "GE" ? curso : curso - 4;
    return [id, { rol: "alumno", nombre: `Alumno ${i}`, nivel, curso: cursoReal }];
  }))
};
