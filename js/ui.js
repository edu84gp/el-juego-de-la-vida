import { generarTablero, comenzarJuego } from "./scriptJuego.js";

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

// Render tabla del juego
// variables necesarias
const btnGenerarTablero = document.getElementById("btn-generar-tablero");
const tablero = document.getElementById("tablero");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const clean = document.getElementById("clean");
let matriz;
let intervalo;

btnGenerarTablero.addEventListener("click", (event) => {
  event.preventDefault();
  const filas = document.getElementById("filas").value;
  const columnas = document.getElementById("columnas").value;
  matriz = generarTablero(filas, columnas);
  // ajustar grid del tablero
  const mayorDimension = Math.max(Number(filas), Number(columnas));
  const tamanoCelda = mayorDimension <= 20 ? "28px" : mayorDimension <= 35 ? "20px" : "10px";
  tablero.style.gridTemplateRows = `repeat(${filas}, ${tamanoCelda})`;
  tablero.style.gridTemplateColumns = `repeat(${columnas}, ${tamanoCelda})`;
  // limpiar tablero
  tablero.innerHTML = "";
  for (let fila = 0; fila < filas; fila++) {
    for (let columna = 0; columna < columnas; columna++) {
      tablero.innerHTML += `<div class="celula muerta" data-fila="${fila}" data-columna="${columna}"></div>`;
    }
  }
});

tablero.addEventListener("click", (event) => {
  const celula = event.target.closest(".celula");
  if (!celula) return;
  const celulaFila = Number(celula.dataset.fila);
  const celulaColumna = Number(celula.dataset.columna);
  if (matriz[celulaFila][celulaColumna] == 0) {
    celula.classList.replace("muerta", "viva");
    matriz[celulaFila][celulaColumna] = 1;
  } else {
    celula.classList.replace("viva", "muerta");
    matriz[celulaFila][celulaColumna] = 0;
  }
});

function renderizarTablero() {
  const celulas = document.querySelectorAll(".celula");
  celulas.forEach((celula) => {
    const fila = Number(celula.dataset.fila);
    const columna = Number(celula.dataset.columna);
    let estaViva = matriz[fila][columna] == 1;
    celula.classList.toggle("viva", estaViva);
    celula.classList.toggle("muerta", !estaViva);
  });
}

function siguienteGeneracion() {
  matriz = comenzarJuego(matriz);
  renderizarTablero();
}

start.addEventListener("click", () => {
  if (!matriz || intervalo) return;
  siguienteGeneracion();
  intervalo = setInterval(siguienteGeneracion, 500);
});

stop.addEventListener("click", () => {
  clearInterval(intervalo);
  intervalo = null;
});

clean.addEventListener("click", () => {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }
  const celulas = document.querySelectorAll(".celula");
  celulas.forEach((celula) => {
    const fila = Number(celula.dataset.fila);
    const columna = Number(celula.dataset.columna);
    let estaViva = matriz[fila][columna] == 1;
    if (estaViva) {
      matriz[fila][columna] = 0;
      celula.classList.replace("viva", "muerta");
    }
    renderizarTablero();
  });
});
