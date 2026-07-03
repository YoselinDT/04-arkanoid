// Arkanoid MVP

const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

const ROWS = 5;
const COLS = 8;
const BLOCK_WIDTH = 54;
const BLOCK_HEIGHT = 20;
const BLOCK_OFFSET_TOP = 40;
const BLOCK_OFFSET_LEFT = 24;
const ROW_COLORS = [ 'hotpink', 'red', 'yellow', 'green', 'cyan' ]; // fila 0 = arriba
const POINTS_PER_BLOCK = 10;

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 14;
const PADDLE_SPEED = 6;
const BALL_RADIUS = 8;

const RESTART_BUTTON = {
  width: 140,
  height: 40,
  x: ( CANVAS_WIDTH - 140 ) / 2,
  y: CANVAS_HEIGHT / 2 + 40,
};

function createBlocks() {
  const blocks = [];
  for ( let row = 0; row < ROWS; row++ ) {
    for ( let col = 0; col < COLS; col++ ) {
      blocks.push( {
        row,
        col,
        x: BLOCK_OFFSET_LEFT + col * BLOCK_WIDTH,
        y: BLOCK_OFFSET_TOP + row * BLOCK_HEIGHT,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        color: ROW_COLORS[ row ],
        alive: true,
      } );
    }
  }
  return blocks;
}

function createInitialState() {
  return {
    status: 'playing', // 'playing' | 'gameover' | 'win'
    score: 0,
    lives: 2,
    paddle: {
      x: ( CANVAS_WIDTH - PADDLE_WIDTH ) / 2,
      y: CANVAS_HEIGHT - 30,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: PADDLE_SPEED,
    },
    ball: {
      x: 0,
      y: 0,
      radius: BALL_RADIUS,
      dx: 3,
      dy: -3,
      attached: true, // pegada al paddle, esperando espacio
    },
    blocks: createBlocks(),
  };
}

function attachBallToPaddle( state ) {
  state.ball.x = state.paddle.x + state.paddle.width / 2;
  state.ball.y = state.paddle.y - state.ball.radius;
}

let state = createInitialState();
attachBallToPaddle( state );

function draw() {
  ctx.clearRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

  state.blocks.forEach( ( block ) => {
    if ( !block.alive ) return;
    drawSprite( ctx, `block_${ block.color }`, block.x, block.y, block.width, block.height );
  } );

  drawSprite( ctx, 'paddle', state.paddle.x, state.paddle.y, state.paddle.width, state.paddle.height );
  drawSprite(
    ctx, 'ball',
    state.ball.x - state.ball.radius, state.ball.y - state.ball.radius,
    state.ball.radius * 2, state.ball.radius * 2
  );

  drawHud();

  if ( state.status !== 'playing' ) drawEndOverlay();
}

function drawHud() {
  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText( `Score: ${ state.score }`, 10, 10 );
  ctx.fillText( `Lives: ${ state.lives }`, CANVAS_WIDTH - 90, 10 );
}

function drawEndOverlay() {
  const title = state.status === 'win' ? 'You Win' : 'Game Over';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.font = 'bold 36px sans-serif';
  ctx.fillText( title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30 );

  ctx.font = '20px sans-serif';
  ctx.fillText( `Score: ${ state.score }`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10 );

  ctx.fillStyle = '#2a7';
  ctx.fillRect( RESTART_BUTTON.x, RESTART_BUTTON.y, RESTART_BUTTON.width, RESTART_BUTTON.height );

  ctx.fillStyle = '#fff';
  ctx.font = '18px sans-serif';
  ctx.fillText(
    'Reiniciar',
    RESTART_BUTTON.x + RESTART_BUTTON.width / 2,
    RESTART_BUTTON.y + RESTART_BUTTON.height / 2 + 6
  );

  ctx.textAlign = 'left';
}

const keys = { left: false, right: false };

window.addEventListener( 'keydown', ( e ) => {
  if ( e.code === 'ArrowLeft' ) keys.left = true;
  if ( e.code === 'ArrowRight' ) keys.right = true;
  if ( e.code === 'Space' && state.ball.attached ) {
    e.preventDefault();
    state.ball.attached = false;
  }
} );

window.addEventListener( 'keyup', ( e ) => {
  if ( e.code === 'ArrowLeft' ) keys.left = false;
  if ( e.code === 'ArrowRight' ) keys.right = false;
} );

function restartGame() {
  state = createInitialState();
  attachBallToPaddle( state );
}

canvas.addEventListener( 'click', ( e ) => {
  if ( state.status === 'playing' ) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = CANVAS_WIDTH / rect.width;
  const scaleY = CANVAS_HEIGHT / rect.height;
  const clickX = ( e.clientX - rect.left ) * scaleX;
  const clickY = ( e.clientY - rect.top ) * scaleY;

  const withinButton =
    clickX >= RESTART_BUTTON.x && clickX <= RESTART_BUTTON.x + RESTART_BUTTON.width &&
    clickY >= RESTART_BUTTON.y && clickY <= RESTART_BUTTON.y + RESTART_BUTTON.height;

  if ( withinButton ) restartGame();
} );

function updatePaddle() {
  if ( keys.left ) state.paddle.x -= state.paddle.speed;
  if ( keys.right ) state.paddle.x += state.paddle.speed;

  state.paddle.x = Math.max( 0, Math.min( CANVAS_WIDTH - state.paddle.width, state.paddle.x ) );

  if ( state.ball.attached ) attachBallToPaddle( state );
}

function resetPaddleAndBall( state ) {
  state.paddle.x = ( CANVAS_WIDTH - state.paddle.width ) / 2;
  state.ball.dx = 3;
  state.ball.dy = -3;
  state.ball.attached = true;
  attachBallToPaddle( state );
}

function updateBall() {
  if ( state.ball.attached ) return;

  state.ball.x += state.ball.dx;
  state.ball.y += state.ball.dy;

  if ( state.ball.x - state.ball.radius <= 0 ) {
    state.ball.x = state.ball.radius;
    state.ball.dx = -state.ball.dx;
  } else if ( state.ball.x + state.ball.radius >= CANVAS_WIDTH ) {
    state.ball.x = CANVAS_WIDTH - state.ball.radius;
    state.ball.dx = -state.ball.dx;
  }

  if ( state.ball.y - state.ball.radius <= 0 ) {
    state.ball.y = state.ball.radius;
    state.ball.dy = -state.ball.dy;
  }

  if ( state.ball.y - state.ball.radius > CANVAS_HEIGHT ) {
    state.lives--;
    if ( state.lives <= 0 ) {
      state.status = 'gameover';
      return;
    }
    resetPaddleAndBall( state );
    return;
  }

  checkPaddleCollision();
  checkBlocksCollision();

  if ( state.blocks.every( ( block ) => !block.alive ) ) {
    state.status = 'win';
  }
}

function checkPaddleCollision() {
  const ball = state.ball;
  const paddle = state.paddle;

  if ( ball.dy <= 0 ) return;

  const withinX = ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width;
  const withinY = ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height;

  if ( !withinX || !withinY ) return;

  ball.y = paddle.y - ball.radius;

  const hitPos = ( ball.x - ( paddle.x + paddle.width / 2 ) ) / ( paddle.width / 2 ); // -1..1
  const speed = Math.hypot( ball.dx, ball.dy );
  const maxAngle = Math.PI / 3; // 60 grados
  const angle = hitPos * maxAngle;

  ball.dx = speed * Math.sin( angle );
  ball.dy = -Math.abs( speed * Math.cos( angle ) );
}

function circleRectCollides( ball, rect ) {
  const closestX = Math.max( rect.x, Math.min( ball.x, rect.x + rect.width ) );
  const closestY = Math.max( rect.y, Math.min( ball.y, rect.y + rect.height ) );
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  return ( dx * dx + dy * dy ) <= ball.radius * ball.radius;
}

function checkBlocksCollision() {
  const ball = state.ball;

  for ( const block of state.blocks ) {
    if ( !block.alive ) continue;
    if ( !circleRectCollides( ball, block ) ) continue;

    block.alive = false;
    state.score += POINTS_PER_BLOCK;

    const overlapLeft = ( ball.x + ball.radius ) - block.x;
    const overlapRight = ( block.x + block.width ) - ( ball.x - ball.radius );
    const overlapTop = ( ball.y + ball.radius ) - block.y;
    const overlapBottom = ( block.y + block.height ) - ( ball.y - ball.radius );

    const minOverlapX = Math.min( overlapLeft, overlapRight );
    const minOverlapY = Math.min( overlapTop, overlapBottom );

    if ( minOverlapX < minOverlapY ) {
      ball.dx = -ball.dx;
    } else {
      ball.dy = -ball.dy;
    }

    break; // un bloque por frame
  }
}

function update() {
  if ( state.status !== 'playing' ) return;
  updatePaddle();
  updateBall();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame( gameLoop );
}

loadSpritesheet( () => {
  gameLoop();
} );
