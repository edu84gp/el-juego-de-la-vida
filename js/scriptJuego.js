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
