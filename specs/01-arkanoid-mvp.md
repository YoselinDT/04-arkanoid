# SPEC 01 — MVP jugable de Arkanoid

> **Status:** Approved
> **Depends on:** Ninguno (primer spec del proyecto)
> **Date:** 2026-07-03
> **Objective:** Construir un MVP jugable de Arkanoid en HTML/CSS/JS puro, con paddle controlado por teclado, bola física, un único nivel de bloques de 5x8, sistema de 2 vidas y mensajes de victoria/derrota con opción de reiniciar.

## Scope

**In:**

- Paddle controlado con flechas izquierda/derecha del teclado.
- Bola con física de rebote (paredes, paddle, bloques).
- Bola arranca pegada al paddle; se lanza con la barra espaciadora.
- Un único nivel fijo: grid de bloques de 5 filas x 8 columnas, un color distinto por fila, usando `SPRITES.blocks` del spritesheet.
- Al romper un bloque, este simplemente desaparece (sin animación de explosión, sin sonido).
- Sistema de 2 vidas. Al perder una vida (bola cae), paddle y bola vuelven a la posición inicial (bola pegada al paddle esperando espacio), los bloques ya rotos permanecen rotos.
- Score que suma puntos al romper bloques, visible en pantalla durante la partida.
- Al perder las 2 vidas: mensaje "Game Over" mostrando el score conseguido, con opción de reiniciar partida.
- Al romper todos los bloques: mensaje "You Win" mostrando el score conseguido, con opción de reiniciar partida.
- Reiniciar partida resetea el score a 0, restaura los bloques y las 2 vidas.
- Canvas de tamaño fijo: 480px de ancho x 640px de alto.
- Archivos nuevos: `index.html`, `style.css`, `game.js` en la raíz del proyecto.

**Out of scope (for future specs):**

- Efectos de sonido (`ball-bounce.mp3`, `break-sound.mp3`).
- Animación de explosión (`EXPLOSION_FRAMES`) al romper bloques.
- Múltiples niveles.
- Persistencia de score o high scores entre sesiones.
- Control por mouse.
- Botón de mute/unmute.
- Versión responsive/mobile del canvas.

## Data model

```js
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

const ROWS = 5;
const COLS = 8;
const BLOCK_WIDTH = 54;
const BLOCK_HEIGHT = 20;
const BLOCK_OFFSET_TOP = 40;
const BLOCK_OFFSET_LEFT = 24;
const ROW_COLORS = ['hotpink', 'red', 'yellow', 'green', 'cyan']; // fila 0 = arriba
const POINTS_PER_BLOCK = 10; // igual para todos los colores en el MVP

const state = {
  status: 'playing', // 'playing' | 'gameover' | 'win'
  score: 0,
  lives: 2,
  paddle: {
    x: (CANVAS_WIDTH - 100) / 2,
    y: CANVAS_HEIGHT - 30,
    width: 100,
    height: 14,
    speed: 6, // px/frame
  },
  ball: {
    x: 0, // se recalcula centrada sobre el paddle
    y: 0,
    radius: 8,
    dx: 3,
    dy: -3,
    attached: true, // true = pegada al paddle, esperando espacio
  },
  blocks: [
    /* { row, col, x, y, width: BLOCK_WIDTH, height: BLOCK_HEIGHT, color, alive: true } */
  ],
};
```

Convenciones:

- Coordenadas: origen arriba a la izquierda (estándar canvas).
- Velocidades en píxeles por frame.
- `blocks` se genera una vez al iniciar/reiniciar: 5 filas x 8 columnas = 40 bloques, todos `alive: true`.
- `ROW_COLORS[row]` determina el color de cada bloque de esa fila (colores `magenta` y `gray` del spritesheet no se usan en este nivel).
- Reiniciar partida = resetear `state` completo a estos valores iniciales.

## Implementation plan

1. Crear `index.html` con el esqueleto: un `<canvas id="game" width="480" height="640">`, y las etiquetas `<script>` que cargan `assets/spritesheet.js` y `game.js`. Test manual: abrir el archivo en el navegador, se ve un canvas en blanco sin errores en consola.
2. Crear `style.css` con estilos básicos: centrar el canvas en la página, fondo oscuro. Enlazarlo desde `index.html`. Test manual: el canvas aparece centrado.
3. En `game.js`, definir las constantes y el `state` inicial del modelo de datos, generar el array `blocks` (5x8), llamar a `loadSpritesheet` y dibujar una vez la escena estática (paddle, bola pegada al paddle, los 40 bloques con su color de fila). Test manual: al recargar se ven paddle, bola y grid de bloques dibujados en sus posiciones iniciales.
4. Implementar el loop del juego con `requestAnimationFrame` y el movimiento del paddle con flechas izquierda/derecha (`keydown`/`keyup`), respetando los límites del canvas. Test manual: mover el paddle con las flechas, no se sale del canvas.
5. Implementar el lanzamiento de la bola con espacio (`state.ball.attached = false`) y su movimiento con rebote en paredes izquierda/derecha/arriba. Si la bola cae por debajo del canvas: `lives--`, reset de posición de paddle y bola (`attached = true`). Test manual: lanzar la bola, rebota en las paredes; dejarla caer resta una vida y reinicia su posición.
6. Implementar colisión bola-paddle (rebote según punto de impacto) y colisión bola-bloque (detección de overlap, marcar bloque `alive: false`, sumar `POINTS_PER_BLOCK` al score, rebotar la bola). Test manual: la bola rebota en el paddle; al golpear un bloque este desaparece y el score visible aumenta.
7. Implementar las pantallas de fin de partida: cuando `lives` llega a 0, `state.status = 'gameover'` y se muestra overlay "Game Over" con el score final y botón/tecla de reinicio; cuando todos los bloques tienen `alive: false`, `state.status = 'win'` y se muestra overlay "You Win" con el score final y botón/tecla de reinicio. Test manual: perder las 2 vidas muestra "Game Over"; romper todos los bloques muestra "You Win".
8. Implementar la acción de reinicio (botón o tecla en los overlays) que resetea `state` por completo a sus valores iniciales y vuelve a `status: 'playing'`. Test manual: desde cualquiera de los dos overlays, reiniciar deja el juego jugable desde cero con score 0 y 2 vidas.

## Acceptance criteria

- [ ] Abrir `index.html` directamente en el navegador (sin servidor ni build) carga el juego sin errores en consola.
- [ ] Se ve un canvas de 480x640 con el paddle, la bola pegada a él y 40 bloques (5 filas x 8 columnas) coloreados por fila.
- [ ] Las flechas izquierda/derecha mueven el paddle sin que salga de los límites del canvas.
- [ ] La barra espaciadora lanza la bola desde el paddle.
- [ ] La bola rebota correctamente en las paredes izquierda, derecha y superior, y en el paddle.
- [ ] Al golpear un bloque, este desaparece y el score visible en pantalla aumenta en 10 puntos.
- [ ] Si la bola cae por debajo del paddle y quedan vidas, se resta 1 vida y la bola/paddle vuelven a su posición inicial (bola pegada, esperando espacio) manteniendo los bloques ya rotos.
- [ ] Al llegar a 0 vidas, aparece un mensaje "Game Over" mostrando el score final.
- [ ] Al romper los 40 bloques, aparece un mensaje "You Win" mostrando el score final.
- [ ] Desde el mensaje de "Game Over" o "You Win" hay una forma de reiniciar la partida que resetea score a 0, vidas a 2 y todos los bloques.
- [ ] No se reproduce ningún sonido ni animación de explosión al romper bloques.

## Decisions

- **Yes:** controles por teclado (flechas + espacio). Es el estándar clásico de Arkanoid y no requiere manejar eventos de mouse/touch.
- **No:** control por mouse. Se puede evaluar en un spec futuro si se pide.
- **Yes:** un único nivel fijo (5 filas x 8 columnas). Reduce el alcance del MVP a lo jugable mínimo.
- **No:** múltiples niveles. Requeriría un sistema de progresión que queda para otro spec.
- **Yes:** 2 vidas (decisión explícita del usuario, sobre la recomendación inicial de 3).
- **Yes:** mensajes "Game Over" / "You Win" con score final y opción de reiniciar. Da cierre claro y verificable a la partida.
- **No:** efectos de sonido en este MVP, aunque los assets (`ball-bounce.mp3`, `break-sound.mp3`) ya existen. Se decidió explícitamente no implementarlos todavía.
- **No:** animación de explosión (`EXPLOSION_FRAMES`) al romper bloques. El bloque simplemente desaparece; mantiene el MVP simple y coherente con la ausencia de sonido.
- **Yes:** score solo en memoria durante la partida, se resetea a 0 al reiniciar. No hay persistencia de high scores.
- **No:** persistencia de score (localStorage o similar). Queda para un spec futuro (ej. "levels-and-highscores").
- **Yes:** canvas de tamaño fijo (480x640), sin diseño responsive. Simplifica el cálculo de posiciones para el MVP.
- **Yes:** puntaje uniforme de 10 puntos por bloque roto, sin importar el color/fila. El color por fila es solo visual en este MVP.
- **Yes:** estructura de archivos `index.html`, `style.css`, `game.js` en la raíz. Coherente con la filosofía "sin dependencias, abrir el HTML directamente" de `CLAUDE.md`.

## Risks

| Risk                                                              | Mitigation                                                                                     |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| La bola puede "atravesar" bloques o el paddle a alta velocidad (tunneling) si `dx`/`dy` son muy grandes respecto al tamaño de los objetos. | Mantener velocidades bajas (3px/frame) relativas al tamaño de bola/bloques/paddle, como se definió en el modelo de datos. |
| Dibujar antes de que `loadSpritesheet` termine de cargar la imagen. | El loop de dibujo solo arranca dentro del callback de `loadSpritesheet`, tal como exige el contrato de `spritesheet.js`. |

## What is **not** in this spec

- Efectos de sonido (`ball-bounce.mp3`, `break-sound.mp3`).
- Animación de explosión al romper bloques.
- Múltiples niveles / progresión.
- Persistencia de score o tabla de high scores.
- Control por mouse/touch.
- Botón de mute/unmute.
- Diseño responsive del canvas.

Cada uno de estos, si se implementa, va en su propio spec.
