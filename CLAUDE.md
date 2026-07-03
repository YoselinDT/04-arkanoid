# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Estado del proyecto

Este es un juego de Arkanoid/Breakout. El MVP jugable ya está **implementado** (ver `specs/01-arkanoid-mvp.md`): `index.html`, `style.css` y `game.js` en la raíz. El objetivo, según README.md, es HTML, CSS y JavaScript puro, **sin dependencias**, para que cualquier persona pueda jugarlo abriendo el HTML directamente (sin build ni gestor de paquetes).

Funcionalidad actual: paddle controlado con flechas, bola con física de rebote, un nivel fijo de 40 bloques (5x8), sistema de 2 vidas (mostradas en el HUD como iconos de la bola, no como número), score visible, y pantallas de "Game Over"/"You Win" con opción de reiniciar. Sin sonido ni animación de explosión al romper bloques (deferred — ver "Out of scope" en `specs/01-arkanoid-mvp.md`).

Los specs de features nuevas o cambios de alcance van en `specs/` (usar `/spec` para crearlos).

## Comandos

No existe herramental de build, lint ni tests. No hay `package.json`. Dado que el proyecto debe mantenerse sin dependencias, no introduzcas herramientas de npm/build salvo que se pida explícitamente — sirve/abre el HTML directamente (por ejemplo `open index.html` o un servidor estático simple) para ejecutar el juego.

## Assets y API del spritesheet

- `assets/spritesheet-breakout.png` — la imagen única del spritesheet para todos los gráficos del juego (paddle, bola, bloques, explosiones).
- `assets/spritesheet.js` — define el atlas de sprites y el loader; este es el contrato sobre el que debe dibujar el futuro código del juego:
  - `SPRITES` — rectángulos en píxeles (`sx, sy, sw, sh`) para `paddle`, `ball` y `blocks.<color>` (colores: `gray`, `red`, `yellow`, `cyan`, `magenta`, `hotpink`, `green`).
  - `EXPLOSION_FRAMES` — animaciones de explosión de 4 frames por color, reproducidas durante `EXPLOSION_DURATION` (150ms).
  - `loadSpritesheet(cb)` — carga el PNG en un canvas offscreen una sola vez e invoca `cb` (encola callbacks si se llama varias veces antes de terminar la carga); debe llamarse antes de cualquier dibujo.
  - `drawSprite(ctx, name, x, y, w, h)` — dibuja un sprite estático por nombre; los sprites de bloques se referencian como `'block_<color>'` (ej. `'block_red'`), que se busca dentro de `SPRITES.blocks`.
  - `drawFrame(ctx, frame, x, y, w, h)` — dibuja un solo frame de animación de explosión (una entrada del array `EXPLOSION_FRAMES[color]`).
- `assets/sounds/ball-bounce.mp3`, `assets/sounds/break-sound.mp3` — efectos de sonido para rebotes de la bola y rotura de bloques.
