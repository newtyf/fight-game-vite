// collisions
export function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// determinate the winner
export function determinateWinner({ player, enemy }) {
  clearTimeout(timerId);
  document.querySelector(".display-text").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector(".display-text").innerHTML = "Empate";
  }
  if (player.health > enemy.health) {
    document.querySelector(".display-text").innerHTML = "Gano el jugador 1";
  }
  if (player.health < enemy.health) {
    document.querySelector(".display-text").innerHTML = "Gano el jugador 2";
  }
}

// game timers and game over
let timer = 60;
let timerId;
export function decreaseTimer({player, enemy}) {
  if (timer > 0) {
    timerId = setTimeout(() => decreaseTimer({player, enemy}), 1000);
    timer--;
    document.querySelector(".timer").innerHTML = timer;
  }

  if (timer === 0) {
    determinateWinner({ player, enemy });
  }
}