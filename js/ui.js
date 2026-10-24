import {
  generarTablero,
  generarPatronAleatorio,
  comenzarJuego,
} from "./scriptJuego.js";

const accordions = document.querySelectorAll(".accordion");

const openAccordion = (accordion) => {
  const content = accordion.querySelector(".accordion-content");

  accordions.forEach((otherAccordion) => {
    if (otherAccordion !== accordion && otherAccordion.open) {
      closeAccordion(otherAccordion);
    }
  });

  accordion.open = true;
  content.style.height = "0px";
  requestAnimationFrame(() => {
    content.style.height = `${content.scrollHeight}px`;
  });
};

const closeAccordion = (accordion) => {
  const content = accordion.querySelector(".accordion-content");

  content.style.height = `${content.scrollHeight}px`;
  requestAnimationFrame(() => {
    content.style.height = "0px";
  });

  content.addEventListener(
    "transitionend",
    () => {
      accordion.open = false;
    },
    { once: true },
  );
};

accordions.forEach((accordion) => {
  const summary = accordion.querySelector("summary");

  summary.addEventListener("click", (event) => {
    event.preventDefault();

    if (accordion.open) {
      closeAccordion(accordion);
    } else {
      openAccordion(accordion);
    }
  });
});

const formulario = document.getElementById("configuracion");
const filasInput = document.getElementById("filas");
const columnasInput = document.getElementById("columnas");
const tablero = document.getElementById("tablero");
const estadoTablero = document.getElementById("estado-tablero");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const clean = document.getElementById("clean");
const velocidad = document.getElementById("velocidad");
const botonGenerarTablero = document.getElementById("btn-generar-tablero");
const botonPatronAleatorio = document.getElementById("btn-patron-aleatorio");
let matriz = null;
let intervalo = null;
let celdaEnfocada = null;

function obtenerDimension(input) {
  const valor = Number(input.value);
  if (!Number.isFinite(valor)) return Number(input.min);
  return Math.min(
    Math.max(Math.trunc(valor), Number(input.min)),
    Number(input.max),
  );
}

function obtenerVelocidad() {
  const valor = Number(velocidad.value);
  if (!Number.isFinite(valor)) return Number(velocidad.min);
  return Math.min(
    Math.max(valor, Number(velocidad.min)),
    Number(velocidad.max),
  );
}

function anunciarEstado(mensaje) {
  estadoTablero.textContent = "";
  window.setTimeout(() => {
    estadoTablero.textContent = mensaje;
  }, 50);
}

function actualizarControles() {
  const simulando = intervalo !== null;
  const focoEnInicio = document.activeElement === start;
  const focoEnParada = document.activeElement === stop;

  start.disabled = simulando;
  stop.disabled = !simulando;

  if (simulando && focoEnInicio) stop.focus();
  if (!simulando && focoEnParada) start.focus();
}

function detenerSimulacion() {
  if (intervalo !== null) {
    clearInterval(intervalo);
    intervalo = null;
  }

  actualizarControles();
}

function iniciarSimulacion() {
  detenerSimulacion();
  intervalo = setInterval(siguienteGeneracion, obtenerVelocidad());
  actualizarControles();
}

function actualizarCelula(celula, viva) {
  const fila = Number(celula.dataset.fila) + 1;
  const columna = Number(celula.dataset.columna) + 1;

  celula.classList.toggle("viva", viva);
  celula.classList.toggle("muerta", !viva);
  celula.setAttribute("aria-selected", String(viva));
  celula.setAttribute(
    "aria-label",
    `Fila ${fila}, columna ${columna}, ${viva ? "viva" : "muerta"}`,
  );
}

function crearCelda(fila, columna) {
  const celula = document.createElement("div");

  celula.className = "celula muerta";
  celula.dataset.fila = `${fila}`;
  celula.dataset.columna = `${columna}`;
  celula.setAttribute("role", "gridcell");
  celula.setAttribute("aria-colindex", `${columna + 1}`);
  celula.setAttribute("aria-selected", "false");
  celula.setAttribute(
    "aria-label",
    `Fila ${fila + 1}, columna ${columna + 1}, muerta`,
  );
  celula.tabIndex = fila === 0 && columna === 0 ? 0 : -1;

  return celula;
}

function crearTablero() {
  detenerSimulacion();

  const filas = obtenerDimension(filasInput);
  const columnas = obtenerDimension(columnasInput);
  filasInput.value = filas;
  columnasInput.value = columnas;

  matriz = generarTablero(filas, columnas);

  const mayorDimension = Math.max(filas, columnas);
  const tamanoCelda =
    mayorDimension <= 20 ? "28px" : mayorDimension <= 35 ? "20px" : "10px";
  tablero.style.gridTemplateRows = `repeat(${filas}, ${tamanoCelda})`;
  tablero.style.gridTemplateColumns = `repeat(${columnas}, ${tamanoCelda})`;
  tablero.setAttribute("aria-rowcount", `${filas}`);
  tablero.setAttribute("aria-colcount", `${columnas}`);

  const fragmento = document.createDocumentFragment();

  for (let fila = 0; fila < filas; fila++) {
    const filaElemento = document.createElement("div");

    filaElemento.className = "fila-tablero";
    filaElemento.setAttribute("role", "row");
    filaElemento.setAttribute("aria-rowindex", `${fila + 1}`);

    for (let columna = 0; columna < columnas; columna++) {
      filaElemento.appendChild(crearCelda(fila, columna));
    }

    fragmento.appendChild(filaElemento);
  }

  tablero.replaceChildren(fragmento);
  celdaEnfocada = tablero.querySelector(".celula");
  actualizarControles();
  anunciarEstado(
    `Tablero vacío de ${filas} filas por ${columnas} columnas.`,
  );
}

function alternarCelula(celula) {
  if (!matriz) return;

  const fila = Number(celula.dataset.fila);
  const columna = Number(celula.dataset.columna);

  if (!matriz[fila] || typeof matriz[fila][columna] === "undefined") return;

  const viva = matriz[fila][columna] === 0;
  matriz[fila][columna] = viva ? 1 : 0;
  actualizarCelula(celula, viva);
}

function enfocarCelda(celula) {
  if (!celula) return;

  if (celdaEnfocada) celdaEnfocada.tabIndex = -1;

  celdaEnfocada = celula;
  celula.tabIndex = 0;
  celula.focus();
}

function renderizarTablero() {
  if (!matriz) return;

  tablero.querySelectorAll(".celula").forEach((celula) => {
    const fila = Number(celula.dataset.fila);
    const columna = Number(celula.dataset.columna);
    const estaViva = matriz[fila]?.[columna] === 1;
    actualizarCelula(celula, estaViva);
  });
}

function siguienteGeneracion() {
  if (!matriz) return;

  matriz = comenzarJuego(matriz);
  renderizarTablero();
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
});

botonGenerarTablero.addEventListener("click", crearTablero);

tablero.addEventListener("click", (event) => {
  const celula = event.target.closest(".celula");
  if (!celula) return;

  enfocarCelda(celula);
  alternarCelula(celula);
});

tablero.addEventListener("keydown", (event) => {
  const celula = event.target.closest(".celula");
  if (!celula || !matriz) return;

  const fila = Number(celula.dataset.fila);
  const columna = Number(celula.dataset.columna);
  const totalFilas = matriz.length;
  const totalColumnas = matriz[0].length;
  let siguienteFila = fila;
  let siguienteColumna = columna;

  switch (event.key) {
    case "ArrowUp":
      siguienteFila = Math.max(fila - 1, 0);
      break;
    case "ArrowDown":
      siguienteFila = Math.min(fila + 1, totalFilas - 1);
      break;
    case "ArrowLeft":
      siguienteColumna = Math.max(columna - 1, 0);
      break;
    case "ArrowRight":
      siguienteColumna = Math.min(columna + 1, totalColumnas - 1);
      break;
    case "Home":
      siguienteColumna = 0;
      break;
    case "End":
      siguienteColumna = totalColumnas - 1;
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      alternarCelula(celula);
      return;
    default:
      return;
  }

  event.preventDefault();
  if (siguienteFila === fila && siguienteColumna === columna) return;

  enfocarCelda(
    tablero.querySelector(
      `.celula[data-fila="${siguienteFila}"][data-columna="${siguienteColumna}"]`,
    ),
  );
});

start.addEventListener("click", () => {
  if (!matriz || intervalo !== null) return;

  iniciarSimulacion();
  anunciarEstado("Simulación en marcha.");
});

stop.addEventListener("click", () => {
  detenerSimulacion();
  anunciarEstado("Simulación detenida.");
});

velocidad.addEventListener("change", () => {
  const valor = obtenerVelocidad();
  velocidad.value = valor;

  if (intervalo !== null) {
    iniciarSimulacion();
  }
});

clean.addEventListener("click", () => {
  if (!matriz) return;

  detenerSimulacion();
  matriz = generarTablero(matriz.length, matriz[0].length);
  renderizarTablero();
  anunciarEstado("Tablero limpio.");
});

botonPatronAleatorio.addEventListener("click", () => {
  if (!matriz) return;

  detenerSimulacion();
  matriz = generarPatronAleatorio(matriz);
  const total = matriz.length * matriz[0].length;
  const vivas = matriz.flat().filter((celda) => celda === 1).length;
  const porcentaje = Math.round((vivas / total) * 100);
  renderizarTablero();
  enfocarCelda(tablero.querySelector(".celula"));
  anunciarEstado(
    `Patrón aleatorio aplicado con un ${porcentaje} % de celdas vivas.`,
  );
});

crearTablero();
