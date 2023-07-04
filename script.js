var js = (function () {
  const rod1 = document.getElementById("rod1");
  const rod2 = document.getElementById("rod2");
  const ball = document.getElementById("ball");
  const message = document.getElementById("message");
  const inputForm = document.getElementById("inputForm");
  const finalMessage = document.getElementById("finalMessage");
  const tryButton = document.getElementById("tryButton");
  const submit = document.getElementById("submit");
  const textbox = document.getElementById("textbox");
  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  const rodHeight = rod1.offsetHeight;
  const rodWidth = rod1.offsetWidth;
  const ballWidth = ball.offsetWidth;
  var start = false;
  var ballState = 1; //4 direction movement
  var ballPos = 1; //position top or bottom (rod1 or rod2)
  var round = 1; //3 chances given - round number
  var highScore; //highest score so far
  var highScoreName;
  var ballId;
  var score = 0; //current game score

  function checkKey(event) {
    if (event.key === "Enter") {
      start = true;
      rod1.style.transform = "none";
      ballId = setInterval(ballMovement, 50);
    }
    if (start === true) {
      if (event.key === "a") {
        let left = rod1.getBoundingClientRect().left;
        if (Number(left) - 10 > 0) {
          left = Number(left) - 10;
          rod1.style.left = left + "px";
          rod2.style.left = left + "px";
        }
      } else if (event.key === "d") {
        let right = rod1.getBoundingClientRect().left;
        if (Number(right) + 10 + rodWidth < windowInnerWidth) {
          right = Number(right) + 10;
          rod1.style.left = right + "px";
          rod2.style.left = right + "px";
        }
      }
    }
  }

  function setInitialPos() {
    rod1.style.left = "50%";
    rod1.style.left = rod1.getBoundingClientRect().left - rodWidth / 2 + "px";
    rod2.style.left = "50%";
    rod2.style.left = rod2.getBoundingClientRect().left - rodWidth / 2 + "px";
    ball.style.left = "50%";
    if (ballPos === 1) {
      ball.style.top = rodHeight + "px";
      ballState = 1;
    } else {
      ball.style.bottom = rodHeight + "px";
      ballState = 3;
    }
  }

  /* states desc
  state 1-top to left (x-- y++)
  state 2-left to bottom (x++ y++)
  state 3-bottom to right (x++ y--)
  state 4-right to top (x-- y--)
*/
  function ballMovement() {
    let left = ball.getBoundingClientRect().left;
    let top = ball.getBoundingClientRect().top;
    if (ballState === 1) {
      if (
        Number(left) - 9 > 0 &&
        Number(top) + 5 + rodHeight + ballWidth < windowInnerHeight
      ) {
        top = Number(top) + 5;
        left = Number(left) - 9;
        ball.style.left = left + "px";
        ball.style.top = top + "px";
      } else {
        ballState = 2;
      }
    } else if (ballState === 2) {
      if (
        Number(top) + 10 + rodHeight + ballWidth < windowInnerHeight &&
        Number(left) + 7 + ballWidth < windowInnerWidth
      ) {
        top = Number(top) + 10;
        left = Number(left) + 7;
        ball.style.left = left + "px";
        ball.style.top = top + "px";
      } else {
        ballState = 3;
        if (
          left + ballWidth < rod2.getBoundingClientRect().left ||
          left > rod2.getBoundingClientRect().left + rodWidth
        ) {
          ballPos = 2;
          resetGame();
        } else {
          score += 100;
        }
      }
    } else if (ballState === 3) {
      if (
        Number(left) + 8 + ballWidth < windowInnerWidth &&
        Number(top) - 4 > rod1.offsetHeight
      ) {
        top = Number(top) - 4;
        left = Number(left) + 8;
        ball.style.left = left + "px";
        ball.style.top = top + "px";
      } else {
        ballState = 4;
      }
    } else if (ballState === 4) {
      if (Number(top) - 10 > rod1.offsetHeight && Number(left) - 9 > 0) {
        top = Number(top) - 10;
        left = Number(left) - 9;
        ball.style.left = left + "px";
        ball.style.top = top + "px";
      } else {
        ballState = 1;
        if (
          left + ballWidth < rod2.getBoundingClientRect().left ||
          left > rod2.getBoundingClientRect().left + rodWidth
        ) {
          ballPos = 1;
          resetGame();
        } else {
          score += 100;
        }
      }
    }
  }

  //reset rods at the center on losing
  function resetGame() {
    setInitialPos();
    if (round === 3) {
      gameOver();
    } else {
      round++;
    }
  }

  //after 3 rounds, game over message
  function gameOver() {
    clearInterval(ballId);
    console.log(score, Number(highScore));
    if (score > Number(highScore)) {
      finalMessage.innerText = `Congratulations! You've beaten the highest score. Your current score is ${score}`;
      inputForm.classList.remove("hidden");
    } else {
      finalMessage.innerText = `Game over! Your current score is ${score}`;
      tryButton.classList.remove("hidden");
    }
    message.classList.remove("hidden");
  }

  function updateLeaderboard(event) {
    event.preventDefault();
    localStorage.setItem("highScore", score);
    localStorage.setItem("highScoreName", textbox.value);
    restartGame();
  }

  function initialize() {
    setInitialPos();
    highScore = localStorage.getItem("highScore");
    highScoreName = localStorage.getItem("highScoreName");
    console.log(highScore);
    if (highScore == null || highScore == -1 || highScore == undefined) {
      alert(
        'Welcome to the game of Ping-Pong. This is your first time. You have 3 lives. Press Enter to begin the game. Use keys "a" and "s" to move the rods left and right respectively. All the best!'
      );
      highScore = -1;
    } else {
      alert(
        `Welcome to the game of Ping-Pong. The highest score so far has been "${highScore}" scored by "${highScoreName}". You have 3 lives. Press Enter to begin the game. Use keys "a" and "s" to move the rods left and right respectively. Get ready to beat the highest score. All the best!`
      );
    }
  }

  function restartGame() {
    inputForm.classList.add("hidden");
    tryButton.classList.add("hidden");
    message.classList.add("hidden");
    start = false;
    ballState = 1;
    ballPos = 1;
    round = 1;
    score = 0;
    initialize();
  }

  window.addEventListener("keydown", checkKey);
  submit.addEventListener("click", updateLeaderboard);
  tryButton.addEventListener("click", restartGame);

  initialize();
})();
