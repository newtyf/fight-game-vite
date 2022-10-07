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
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "/assets/sprites/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "/assets/sprites/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "/assets/sprites/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "/assets/sprites/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/sprites/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/sprites/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/sprites/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/sprites/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 10,
    },
    width: 150,
    height: 100,
  },
});

const enemy = new Fighter({
  position: {
    x: 680,
    y: 200,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "/assets/sprites/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "/assets/sprites/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "/assets/sprites/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "/assets/sprites/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/sprites/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/sprites/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/sprites/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/sprites/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 10,
    },
    width: 150,
    height: 100,
  },
});

// animate fps
function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  ctx.fillStyle = "rgba(255,255,255, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    if (player.position.x >= 0) player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    if (player.position.x + player.width <= canvas.width) player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // jumping sprite
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy movement
  if (keys.j.pressed && enemy.lastKey === "j" && enemy.position.x >= 0) {
    enemy.switchSprite("run");
    enemy.velocity.x = -5;
  } else if (
    keys.l.pressed &&
    enemy.lastKey === "l" &&
    enemy.position.x + enemy.width <= canvas.width
  ) {
    enemy.switchSprite("run");
    enemy.velocity.x = 5;
  } else {
    enemy.switchSprite("idle");
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detect collision
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    enemy.takeHit(player.damage);
    player.isAttacking = false;
    gsap.to(".health-enemy .status", {
      width: enemy.health + "%",
    });
  }

  //player misses
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit(enemy.damage);
    enemy.isAttacking = false;

    gsap.to(".health-player .status", {
      width: player.health + "%",
    });
  }

  //enemy misses
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  // change visual figthers
  // if (player.position.x + player.width > canvas.width /2) {
  //   player.image.src = "./assets/sprites/kim/idle.png"
  // } else {
  //   player.image.src = "./assets/sprites/kim/idle-reversed.png"
  // }

  // end game
  if (enemy.health <= 0 || player.health <= 0) {
    determinateWinner({ player, enemy });
  }
}
animate();
//timer
decreaseTimer({ player, enemy });

// listeners
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
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
        if (
          Math.trunc(player.height + player.position.y) ==
          canvas.height - 95
        ) {
          player.velocity.y = -15;
        }
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
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
