import "./style.css";
import { Fighter, Sprite } from "./classes/classes";
import {
  decreaseTimer,
  determinateWinner,
  rectangularCollision,
} from "./utils";

// constants
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024; // aspect ratio => 16/9
canvas.height = 576; // aspect ratio => 16/9
ctx.fillRect(0, 0, canvas.width, canvas.height);
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  j: {
    pressed: false,
  },
  l: {
    pressed: false,
  },
  i: {
    pressed: false,
  },
};

//timer
decreaseTimer({ player, enemy });

// scenes - sprites
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "/assets/background.png",
});
const shop = new Sprite({
  position: {
    x: 650,
    y: 128,
  },
  imageSrc: "/assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

// players
const player = new Fighter({
  position: {
    x: 340,
    y: 200,
  },
  height: 150,
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Fighter({
  position: {
    x: 680,
    y: 200,
  },
  height: 150,
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

// animate fps
function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a" && player.position.x >= 0) {
    player.velocity.x = -5;
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5;
  }

  // enemy movement
  if (keys.j.pressed && enemy.lastKey === "j" && enemy.position.x >= 0) {
    enemy.velocity.x = -5;
  } else if (
    keys.l.pressed &&
    enemy.lastKey === "l" &&
    enemy.position.x + enemy.width <= canvas.width
  ) {
    enemy.velocity.x = 5;
  }

  // detect collision
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= player.damage;
    document.querySelector(".health-enemy .status").style.width =
      enemy.health + "%";
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= enemy.damage;
    document.querySelector(".health-player .status").style.width =
      player.health + "%";
  }

  // end game
  if (enemy.health <= 0 || player.health <= 0) {
    determinateWinner({ player, enemy });
  }
}
animate();

// listeners
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      keys.w.pressed = true;
      if (Math.trunc(player.height + player.position.y) == canvas.height - 95) {
        player.velocity.y = -15;
      }
      break;
    case " ":
      player.attack();
      break;
  }

  switch (event.key) {
    case "l":
      keys.l.pressed = true;
      enemy.lastKey = "l";
      break;
    case "j":
      keys.j.pressed = true;
      enemy.lastKey = "j";
      break;
    case "i":
      keys.i.pressed = true;
      if (Math.trunc(enemy.height + enemy.position.y) == canvas.height - 95) {
        enemy.velocity.y = -15;
      }
      break;
    case "o":
      enemy.attack();
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
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

  // enemy
  switch (event.key) {
    case "l":
      keys.l.pressed = false;
      break;
    case "j":
      keys.j.pressed = false;
      break;
    case "i":
      keys.i.pressed = false;
      break;
  }
});
