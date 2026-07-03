# Juego de Arkanoid

Nuestro objetivo es crear un juego de Arkanoid con HTML, CSS y JavaScript, cero dependencias, para que cualquier persona pueda jugarlo.

## Estado

MVP jugable implementado (ver `specs/01-arkanoid-mvp.md`).

## Cómo jugar

Abrir `index.html` directamente en el navegador (sin build ni servidor).

- **Flechas izquierda/derecha:** mover el paddle.
- **Espacio:** lanzar la bola.
- Al perder las 2 vidas aparece "Game Over"; al romper los 40 bloques aparece "You Win". Ambas pantallas tienen un botón para reiniciar la partida.

## Estructura

- `index.html`, `style.css`, `game.js` — el juego.
- `assets/` — spritesheet y sonidos usados por el juego.
- `specs/` — specs del proyecto (ver `CLAUDE.md` para más contexto).
