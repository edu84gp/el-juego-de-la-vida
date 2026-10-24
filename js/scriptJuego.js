export function generarTablero(filas, columnas) {
  const matriz = [];
  for (let fila = 0; fila < filas; fila++) {
    matriz[fila] = [];
    for (let columna = 0; columna < columnas; columna++) {
      matriz[fila][columna] = 0;
    }
  }
  return matriz;
}

export function generarPatronAleatorio(
  matriz,
  densidadMinima = 0.1,
  densidadMaxima = 0.5,
) {
  const columnas = matriz[0]?.length ?? 0;
  const total = matriz.length * columnas;
  const minimo = Math.max(1, Math.ceil(total * densidadMinima));
  const maximo = Math.max(minimo, Math.floor(total * densidadMaxima));
  const vivas = minimo + Math.floor(Math.random() * (maximo - minimo + 1));
  const celdas = Array.from({ length: total }, (_, indice) =>
    indice < vivas ? 1 : 0,
  );

  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [celdas[i], celdas[j]] = [celdas[j], celdas[i]];
  }

  return matriz.map((_, fila) =>
    celdas.slice(fila * columnas, (fila + 1) * columnas),
  );
}

function celulasVecinas(matriz, fila, columna) {
  let contador = 0;

  for (let numFila = fila - 1; numFila <= fila + 1; numFila++) {
    if (numFila >= 0 && numFila < matriz.length) {
      for (let numCol = columna - 1; numCol <= columna + 1; numCol++) {
        if (numCol >= 0 && numCol < matriz[fila].length) {
          const celulaActual = numFila === fila && numCol === columna;
          if (!celulaActual && matriz[numFila][numCol] === 1) contador++;
        }
      }
    }
  }
  return contador;
}

export function comenzarJuego(matriz) {
  const matrizSiguiente = matriz.map((fila) => [...fila]);

  for (let numFila = 0; numFila < matriz.length; numFila++) {
    for (let numCol = 0; numCol < matriz[numFila].length; numCol++) {
      const celda = matriz[numFila][numCol];
      const vecinas = celulasVecinas(matriz, numFila, numCol);
      if ((!celda && vecinas === 3) || (celda && (vecinas === 2 || vecinas === 3))) {
        matrizSiguiente[numFila][numCol] = 1;
      } else {
        matrizSiguiente[numFila][numCol] = 0;
      }
    }
  }
  return matrizSiguiente;
}
