# El Juego de la Vida

> Simulador web del autómata celular de Conway con tablero configurable,
> edición de células y evolución por generaciones.

## Demo

[Ver la demo en GitHub Pages](https://edu84gp.github.io/el-juego-de-la-vida/)

## Qué es y qué permite hacer

Aplicación estática que implementa las reglas B3/S23 (nace con 3 vecinas,
sobrevive con 2 o 3) sobre una matriz finita. Al cargar se crea un tablero
vacío de 30×30 y se puede dibujar el estado inicial, generar un patrón
aleatorio, iniciar o detener la simulación, cambiar la velocidad y limpiar el
tablero. Las dimensiones se pueden cambiar entre 1×1 y 99×99.

## Funcionalidades reales

- Tablero inicial vacío de 30×30 (900 celdas), configurable entre 1×1 y
  99×99.
- Patrón aleatorio con un porcentaje de celdas vivas elegido al azar entre el
  10 % y el 50 %; sustituye el patrón anterior y detiene la simulación.
- Clic, Enter o Espacio para activar o desactivar células.
- Navegación con las flechas y con las teclas Inicio y Fin para recorrer el
  tablero.
- Inicio, parada y limpieza. "Limpiar tablero" detiene la simulación.
- Velocidad de 10 a 2000 ms, ajustable en ejecución.
- Cálculo con vecindario de Moore (hasta 8 vecinas) según B3/S23.
- Un único intervalo de simulación y botones coherentes con el estado.
- Al generar un tablero, aplicar el patrón aleatorio o limpiar se detiene la
  simulación anterior.

## Stack

HTML5, CSS3 (Grid, custom properties, media queries) y JavaScript vanilla con
módulos ES. GitHub Actions despliega `main` en GitHub Pages. Sin framework,
bundler ni dependencias del proyecto.

## Arquitectura y archivos principales

```text
index.html
css/style.css
js/scriptJuego.js
js/ui.js
.github/workflows/deploy-pages.yml
LICENSE
```

`scriptJuego.js` contiene la lógica: crea la matriz, genera patrones
aleatorios y calcula la siguiente generación. `ui.js` gestiona el DOM, el
tablero inicial, el intervalo, los eventos, el estado accesible y la
navegación por teclado; `style.css` define el tablero y el responsive. El
workflow publica `main` en Pages sin build.

## Cómo ejecutarlo en local

Necesitas Node.js y npm para usar `npx`, o Python 3 para la alternativa.

```bash
git clone https://github.com/edu84gp/el-juego-de-la-vida.git
cd el-juego-de-la-vida
npx --yes http-server -p 8000 .
```

Alternativa con Python:

```bash
python -m http.server 8000
```

En ambos casos, abre `http://localhost:8000`. El comando con `npx` descarga
`http-server` de forma temporal; no se añade como dependencia del proyecto.
No abras `index.html` con doble clic: los módulos ES requieren HTTP.

## Controles

| Acción | Control |
| --- | --- |
| Crear o redimensionar | Filas y columnas + «Generar tablero» |
| Patrón aleatorio | «Patrón aleatorio» (entre 10 % y 50 % de celdas vivas) |
| Alternar célula | Clic, Enter o Espacio; flechas, Inicio y Fin |
| Iniciar o reanudar | «Comenzar Juego» |
| Detener | «Parar Juego» |
| Velocidad | Campo en ms (10–2000), aplicado al cambiar |
| Vaciar | «Limpiar tablero» (detiene la simulación) |

Los valores de filas y columnas van de 1 a 99; el tablero inicial es de 30×30.
Enter en los campos del formulario no regenera el tablero: la generación
requiere pulsar «Generar tablero».

## Decisiones técnicas

**Representación.** Matriz de ceros y unos; cada célula es un `div` con clases
`viva` o `muerta` y datos de fila y columna, pintado con CSS Grid. La versión
publicada usa DOM, no `canvas`.

**Actualización.** La siguiente generación se calcula sobre una copia de la
matriz para que todas las células partan del estado anterior. Los bordes son
finitos y no envolventes. El patrón aleatorio es una función pura que devuelve
una matriz nueva con un número de celdas vivas elegido al azar entre el 10 % y
el 50 % del total.

**Renderizado.** Cada generación recorre todas las células y cambia sus
clases; no hay virtual DOM ni actualización por diferencias.

**Rendimiento.** El coste crece con el área y el render actualiza todas las
celdas; no hay métricas incluidas. Para 99×99 a intervalos bajos, el siguiente
paso sería `canvas` o actualizar solo los cambios.

**Eventos.** Delegación en `#tablero` con `closest`. El formulario cancela el
envío con `preventDefault()`, de modo que Enter no recarga ni altera el
tablero; la generación se hace con el botón «Generar tablero». Al generar,
aleatorizar o limpiar se detiene la simulación y se reemplaza la matriz. Al
comenzar no se avanza de inmediato: el primer paso llega tras la velocidad
elegida. Cambiar la velocidad reinicia el intervalo si está activo.

**Accesibilidad.** El tablero usa `role="grid"` y células `gridcell` con
`aria-label`, `aria-selected`, `aria-multiselectable` y un único tab stop
mediante roving tabindex. Las flechas mueven el foco, Inicio y Fin van a los
extremos de la fila, y Enter o Espacio alternan la célula. Hay instrucciones
ocultas y una región `role="status"` que anuncia la generación, el patrón
aleatorio, la limpieza, el inicio y la parada. No se anuncia cada generación
durante la simulación. No se ha realizado una auditoría formal de
accesibilidad.

**Responsive.** El tamaño de celda es de 28 px cuando la dimensión máxima es
de hasta 20, de 20 px hasta 35 y de 10 px por encima. En móvil (≤520 px) el
formulario y los botones ocupan el ancho completo; el tablero conserva el
tamaño de celda y hace scroll. Solo hay tema claro.

## Limitaciones y próximos pasos

- Sin persistencia, contador de generaciones ni patrones precargados.
- Tablero finito y no envolvente.
- Sin pruebas automatizadas incluidas en el repositorio ni tema oscuro.
- Accesibilidad revisada a nivel básico, pendiente de una auditoría con
  lectores de pantalla.
- Próximos pasos: pruebas de las reglas, patrones de ejemplo, renderizado
  eficiente para 99×99 y auditoría de accesibilidad.

## Qué aprendí

He aprendido a separar la lógica del autómata de la interfaz con módulos ES, a
calcular la siguiente generación sobre una copia para evitar estados
intermedios y a usar delegación de eventos. También he practicado el envío de
formularios sin recarga, una función pura para generar patrones aleatorios, la
navegación por teclado con un único tab stop y el despliegue estático con
GitHub Actions y Pages.

## Licencia

MIT. Consulta el archivo [LICENSE](LICENSE).
