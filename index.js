const canvas = document.createElement('canvas');
 
canvas.id = 'gameWindow';
canvas.width = 500;
canvas.height = 500;

var ft, lastFt, dt, frame = 0;

class PlayerPart {
  constructor() {
    this.x = undefined;
    this.y = undefined;
    this.lastx = undefined;
    this.lasty = undefined;
    this.color = undefined;
  }
}

var game = {
  player: {
    color: '#377A37',
    x: 9,
    y: 9,
    direction: {
      x: 0,
      y: 0
    },
    tail: [],
    changeDirection: function(e) {
      switch(e.code) {
        case 'KeyW':
          if (this.direction.y == 1) break;
          this.direction.y = -1;
          this.direction.x = 0;
          break;
        case 'KeyS':
          if (this.direction.y == -1) break;
          this.direction.y = 1;
          this.direction.x = 0;
          break;
        case 'KeyA':
          if (this.direction.x == 1) break;
          this.direction.x = -1;
          this.direction.y = 0;
          break;
        case 'KeyD':
          if (this.direction.x == -1) break;
          this.direction.x = 1;
          this.direction.y = 0;
          break;
      }
    },
    move: function() {
      this.tail.forEach((el, i) => {
        el.lastx = el.x;
        el.lasty = el.y;
        if(i == 0) {
          el.x = this.x;
          el.y = this.y;
        } else {
          el.x = this.tail[i - 1].lastx;
          el.y = this.tail[i - 1].lasty;
        }
      });
      this.x += this.direction.x;
      this.y += this.direction.y;
      this.x = Math.min(Math.max(this.x, 0), tiles.w - 1);
      this.y = Math.min(Math.max(this.y, 0), tiles.h - 1);
    },
    eat: function() {
      this.tail.push(new PlayerPart());
      this.tail[this.tail.length - 1].color = `rgb(55, ${122 + this.tail.length * 2 - 1}, 55)`;
    }
  },
  fruit: {
    color: '#EE7C11',
    x: undefined,
    y: undefined,
    move: function() {
      let desx, desy, i = 0;
      do {
        i++;
        desx = Math.floor(Math.random() * (tiles.w - 1));
        desy = Math.floor(Math.random() * (tiles.h - 1));
        if(i >= tiles) { alert('could not find free place to place fruit'); break; };
      } while(game.player.tail.some((el) => { return (el.x == desx && el.y == desy) || (game.player.x == desx && game.player.y == desy)}));

      this.x = desx;
      this.y = desy;
    }
  }
}

const gameArea = {
  w: 500,
  h: 500
}

const tiles = {
  w: 17,
  h: 17,
  colors: {
    0: '#70FA70',
    1: '#67E667'
  }
}


function draw(ctx) {
  // board

  let tile = {
    w: gameArea.w / tiles.w,
    h: gameArea.h / tiles.h
  }

  for (let i = 0; i < tiles.w; i++) {
    for (let j = 0; j < tiles.h; j++) {
      ctx.fillStyle = tiles.colors[(i + j) % 2];
      ctx.beginPath();
      ctx.rect(i * tile.w, j * tile.h, tile.w, tile.h);
      ctx.fill();
      ctx.closePath();
    }
  }

  // fruits

  ctx.fillStyle = game.fruit.color;

  ctx.beginPath();
  ctx.rect(game.fruit.x * tile.w, game.fruit.y * tile.h, tile.w, tile.h);

  ctx.fill();
  ctx.closePath();

  // player

  ctx.beginPath();
  ctx.fillStyle = game.player.color;
  ctx.rect(game.player.x * tile.w, game.player.y * tile.h, tile.w, tile.h);
  ctx.fill();
  ctx.closePath();

  game.player.tail.forEach(part => {
    ctx.beginPath();
    ctx.fillStyle = part.color;
    ctx.rect(part.x * tile.w, part.y * tile.h, tile.w, tile.h);
    ctx.fill();
    ctx.closePath();
  });
}

game.fruit.move();

setInterval(() => {
  frame++;
  lastFt = ft;
  ft = Date.now();
  dt = ft - lastFt;
  
  const ctx = canvas.getContext('2d');

  draw(ctx);
  if(frame % 6 == 0) {
    game.player.move();
  }

  if(game.player.x == game.fruit.x && game.player.y == game.fruit.y) {
    game.player.eat();
    game.fruit.move();
  }
}, 1000 / 60);

document.addEventListener('keydown', (e) => {
  game.player.changeDirection(e);
});

document.body.appendChild(canvas);