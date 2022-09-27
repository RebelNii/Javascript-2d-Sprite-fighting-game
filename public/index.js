const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//set game canvas width and height
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

/**
 * after game console is initialized
 * we want charac to drop from the top
 * gravity adds speed to var velocity
 */

/**
 * Create a class to develope game characters
 * we'll use classes since we'll approach project from OOP perspertive
 */
class Sprite {
  //make constructor
  constructor({ position, velocity, color = "blue", offset }) {
    this.position = position; //set charac position(x,y);
    this.velocity = velocity; //speed
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.color = color;
    (this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: offset,
      width: 100,
      height: 50,
    }),
      this.isAttacking,
      (this.health = 100);
  }

  draw() {
    c.fillStyle = this.color; //
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attackBox
    if (this.isAttacking) {
      c.fillStyle = "red";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x; //how a charac moves on x axis
    this.position.y += this.velocity.y; //how a charac moves on y axis
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      /**
       * this.position.y + this.height will give us height of charac
       * if we add this.velocity.y we charac height and current position
       * we prevent charac from overlooking the scope(height int his instance) of the game board
       */
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
}); //call a new instance of class to create player

const enemy = new Sprite({
  position: {
    x: 900,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "green",
  offset: {
    x: -50,
    y: 0,
  },
}); //call a new instance of class to create enemy

//player.draw(); //draw player

//enemy.draw(); //draw a enemy
const keys = {
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
};

function getWinner({ player, enemy,timerSet }) {
  clearTimeout(timerSet);//function to stop timer after winner has been decided b4 game timer ends
  if (player.health === enemy.health) {
    document.getElementById("result").innerHTML = "TIE";
    document.getElementById("result").style.display = "flex";
  }else if (player.health >= enemy.health) {
    document.getElementById("result").innerHTML = "Player One Wins";
    document.getElementById("result").style.display = "flex";
  }else if (player.health <= enemy.health) {
    document.getElementById("result").innerHTML = "Player Two Wins";
    document.getElementById("result").style.display = "flex";
  }
}

const time = document.getElementById("timer");

let timer = 20;
let timerSet
function gameTimer() {
  timerSet = setTimeout(gameTimer, 1000);
  if (timer > 0) {
    timer--;
    time.innerHTML = timer;
  }

  if (timer === 0) {
    getWinner({player, enemy, timerSet});
  }
}

gameTimer();

function collision({ rec1, rec2 }) {
  return (
    rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
    rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
    rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
    rec1.attackBox.position.y <= rec2.position.y + rec2.height
  );
}

function animateCharacters() {
  window.requestAnimationFrame(animateCharacters); //we loop
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height); //we call this to prevent charac from drawing a line
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && player.lastKey == "ArrowLeft") {
    player.velocity.x = -4;
  } else if (keys.ArrowRight.pressed && player.lastKey == "ArrowRight") {
    player.velocity.x = 4;
  } else if (keys.ArrowUp.pressed && player.lastKey == "ArrowUp") {
    player.velocity.y = -15;
  }

  //enemy
  if (keys.a.pressed && enemy.lastKey == "a") {
    enemy.velocity.x = -4;
  } else if (keys.d.pressed && enemy.lastKey == "d") {
    enemy.velocity.x = 4;
  } else if (keys.w.pressed && enemy.lastKey == "w") {
    enemy.velocity.y = -15;
  }

  //player attack collision
  if (
    /*player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
    player.attackBox.position.y <= enemy.position.y + enemy.height*/
    collision({
      rec1: player,
      rec2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 10;
    document.getElementById("enemyHealth").style.width = enemy.health + "%";
    console.log("hit");
  }

  if (
    /*player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
    player.attackBox.position.y <= enemy.position.y + enemy.height*/
    collision({
      rec1: enemy,
      rec2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 10;
    document.getElementById("playerHealth").style.width = player.health + "%";
    console.log("hitter");
  }

  if(enemy.health <=0 || player.health <= 0){
    getWinner({player,enemy,timerSet})
  }
}

animateCharacters();

//what happens when key is active
window.addEventListener("keydown", (event) => {
  const target = event.key;
  console.log(target);
  switch (target) {
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      player.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      player.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      player.lastKey = "ArrowUp";
      break;
    case " ":
      player.attack();
      break;

    //enemy
    case "d":
      keys.d.pressed = true;
      enemy.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      enemy.lastKey = "a";
      break;
    case "w":
      keys.w.pressed = true;
      enemy.lastKey = "w";
      break;
    case "s":
      enemy.attack();
      enemy.lastKey = "s";
      break;
  }
});

//what happens when key isn't active
window.addEventListener("keyup", (event) => {
  const target = event.key;
  switch (target) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }
});
