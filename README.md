# 🧬 El Juego de la vida

> El Juego de la vida es un autómata celular diseñado por el matemático británico John Horton Conway en 1970.

Es un juego de cero jugadores, en el que su evolución es determinada por un estado inicial, sin requerir intervención adicional. Se considera un sistema Turing completo que puede simular cualquier otra Máquina de Turing.

[Ver DEMO en GitHub Pages](https://edu84gp.github.io/el-juego-de-la-vida "Ir al Juego de la Vida, por Eduardo García")

---

## 🌱 Características principales

Desde su publicación, ha atraído mucho interés debido a la gran variabilidad de la evolución de los patrones.

Se considera que el Juego de la vida es un buen ejemplo de:

- **Emergencia**
- **Autoorganización**

Es interesante para científicos, matemáticos, economistas y otros observar cómo patrones complejos pueden provenir de la implementación de reglas muy sencillas.

---

## 🔬 Patrones reconocidos

El Juego de la vida tiene una variedad de patrones reconocidos que provienen de determinadas posiciones iniciales.

Poco después de la publicación, se descubrieron:

- **El pentaminó R**
- **El planeador o caminador**

  En inglés: *glider*. Es un conjunto de células que se desplazan.

- **El explosionador**

  Son células que parecen formar la onda expansiva de una explosión.

Estos descubrimientos atrajeron un mayor interés hacia el juego.

Contribuyó a su popularidad el hecho de que se publicó justo cuando se estaba lanzando al mercado una nueva generación de miniordenadores baratos. Esto significaba que se podía jugar durante horas en máquinas que, por otro lado, no se utilizarían por la noche.

---

## 💭 Interpretaciones del juego

Para muchos aficionados, el juego de la vida solo era un desafío de programación y una manera divertida de usar ciclos de la CPU.

Para otros, sin embargo, el juego adquirió más connotaciones filosóficas.

---

# El juego

Se trata de un juego de cero jugadores, lo que quiere decir que su evolución está determinada por el estado inicial y no necesita ninguna entrada de datos posterior.

El **tablero de juego** es una malla plana formada por cuadrados, llamados **células**, que se extiende por el infinito en todas las direcciones.

Por tanto, cada célula tiene **8 células vecinas**, que son las que están próximas a ella, incluidas las diagonales.

Las células tienen dos estados:

- **Vivas** o encendidas.
- **Muertas** o apagadas.

El estado de las células evoluciona a lo largo de unidades de tiempo discretas, que se podrían considerar turnos.

El estado de todas las células se tiene en cuenta para calcular el estado de las mismas al turno siguiente.

Todas las células se actualizan simultáneamente en cada turno, siguiendo estas reglas:

---

## 📜 Reglas del juego

### 🟢 Nace

Si una célula muerta tiene exactamente **3 células vecinas vivas**, nace.

Es decir, al turno siguiente estará viva.

---

### 🔴 Muere

Una célula viva puede morir por uno de estos dos casos:

- **Sobrepoblación:** si tiene más de tres vecinos alrededor.
- **Aislamiento:** si tiene solo un vecino alrededor o ninguno.

---

### 🔵 Vive

Una célula se mantiene viva si tiene **2 o 3 vecinos** a su alrededor.

---

## 📊 Resumen de reglas

| Estado actual | Vecinas vivas | Resultado |
|---|---:|---|
| Muerta | 3 | Nace |
| Viva | Menos de 2 | Muere por aislamiento |
| Viva | 2 o 3 | Sobrevive |
| Viva | Más de 3 | Muere por sobrepoblación |

---
