const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//set game canvas width and height
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position:{
    x:0,
    y:0
  },
  imageSrc: './assets/sprite/background.png'
});

const shop = new Sprite({
  position:{
    x:730,
    y:230
  },
  imageSrc: './assets/sprite/shop.png',
  scale: 2,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 5,
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

const enemy = new Fighter({
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



gameTimer();



function animateCharacters() {
  window.requestAnimationFrame(animateCharacters); //we loop
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height); //we call this to prevent charac from drawing a line
  background.update();
  shop.update();
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
