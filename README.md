# El Juego de la Vida

> Simulador web del autómata celular de Conway con tablero configurable, edición de células y evolución por generaciones.

## Demo

[Ver la demo en GitHub Pages](https://edu84gp.github.io/el-juego-de-la-vida/)

## Qué es y qué permite hacer

Aplicación estática que implementa las reglas B3/S23 (nace con 3 vecinas, sobrevive con 2 o 3) sobre una matriz finita. Permite dibujar el estado inicial, iniciar o detener la simulación, cambiar la velocidad y limpiar el tablero. El tablero es finito y sus dimensiones se eligen en la interfaz.

## Funcionalidades reales

- Tablero inicial de 30×30 (900 celdas), configurable de 1×1 a 99×99.
- Clic para activar o desactivar células.
- Inicio, parada y limpieza.
- Velocidad de 10 a 2000 ms, ajustable en ejecución.
- Cálculo con las ocho vecinas según B3/S23.

## Stack

HTML5, CSS3 (Grid, custom properties, media queries) y JavaScript vanilla con módulos ES. GitHub Actions despliega `main` en GitHub Pages. Sin framework, bundler ni dependencias del proyecto.

## Arquitectura y archivos principales

```text
index.html
css/style.css
js/scriptJuego.js
js/ui.js
.github/workflows/deploy-pages.yml
LICENSE
```

`scriptJuego.js` contiene la lógica: crea la matriz y calcula la siguiente generación. `ui.js` gestiona el DOM, el intervalo y los eventos; `style.css` define el tablero y el responsive. El workflow publica `main` en Pages sin build.

## Cómo ejecutarlo en local

```bash
git clone https://github.com/edu84gp/el-juego-de-la-vida.git
cd el-juego-de-la-vida
npx --yes http-server -p 8000 .
```

Abre `http://localhost:8000`. No abras `index.html` con doble clic: los módulos ES requieren HTTP.

## Controles

| Acción | Control |
|---|---|
| Crear o redimensionar | Campos de filas y columnas + "Generar tablero" (1–99; inicial 30×30) |
| Alternar célula | Clic en la célula |
| Iniciar o reanudar | "Comenzar Juego" |
| Detener | "Parar Juego" |
| Velocidad | Campo en ms (10–2000), aplicado al cambiar |
| Vaciar | "Limpiar tablero" (detiene la simulación) |

## Decisiones técnicas

**Representación.** Matriz de ceros y unos; cada célula es un `div` con clases `viva` o `muerta` y datos de fila y columna, pintado con CSS Grid. La versión publicada usa DOM, no `canvas`.

**Actualización.** La siguiente generación se calcula sobre una copia de la matriz para que todas las células partan del estado anterior. Los bordes son finitos y no envolventes.

**Renderizado.** Cada generación recorre todas las células y cambia sus clases; no hay virtual DOM ni actualización por diferencias.

**Rendimiento.** El coste crece con el área y el render actualiza todas las celdas; no hay métricas incluidas. Para 99×99 a intervalos bajos, el siguiente paso sería `canvas` o actualizar solo los cambios.

**Eventos.** Delegación en `#tablero` con `closest`; el botón de generar cancela el envío y el cambio de velocidad reinicia el intervalo si está activo. Una variable `intervalo` evita temporizadores duplicados.

**Responsive.** En móvil (≤520 px) el formulario y los botones ocupan el ancho completo; el tablero usa celdas fijas (28/20/10 px) y scroll. Solo hay tema claro.

## Limitaciones y próximos pasos

- Sin patrones precargados, aleatoriedad, persistencia ni contador.
- Tablero finito y no envolvente.
- Regenerar el tablero durante la simulación no detiene el intervalo.
- Sin pruebas automatizadas ni tema oscuro.
- Próximos pasos: pruebas de las reglas, parar al regenerar, patrón inicial de ejemplo y renderizado eficiente para 99×99.

## Qué aprendí

He aprendido a separar la lógica del autómata de la interfaz con módulos ES, a calcular la siguiente generación sobre una copia para evitar estados intermedios y a usar delegación de eventos. También he practicado el despliegue estático con GitHub Actions y Pages.

## Licencia

MIT. Consulta el archivo [LICENSE](LICENSE).
