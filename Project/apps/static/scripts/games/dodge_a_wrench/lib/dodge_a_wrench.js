import Wrench from './wrench';
import Player from './player';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  const buttonCanvas = document.getElementById('buttons');
  const ctxBut = buttonCanvas.getContext('2d');

  const backgroundImage = new Image();
  backgroundImage.src = '../static/scripts/games/dodge_a_wrench/assets/images/floor.png';
  const buttonImage = new Image();
  buttonImage.src = '../static/scripts/games/dodge_a_wrench/assets/images/button.png';

  const drawBg = () =>{
    ctx.drawImage(backgroundImage,0,0,833,600);
  };

  const drawLeftUp = () => {
    ctxBut.drawImage(buttonImage,100,1062,230,230,0,0,90,90);
  };

  const drawLeftDown = () => {
    ctxBut.drawImage(buttonImage,348,1062,230,230,0,0,90,90);
  };

  const drawRightUp = () => {
    ctxBut.drawImage(buttonImage,100,802,230,230,100,0,90,90);
  };

  const drawRightDown = () => {
    ctxBut.drawImage(buttonImage,348,802,230,230,100,0,90,90);
  };

  const drawMuteOff = () => {
    ctxBut.drawImage(buttonImage,348,5496,230,230,250,0,90,90);
  };

  const drawMuteOn = () => {
    ctxBut.drawImage(buttonImage,615,5496,230,230,250,0,90,90);
  };

  const bgMusic = new Audio('../static/scripts/games/dodge_a_wrench/assets/audio/bg_music.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.1;
  // bgMusic.play();

  const introSpeech = new Audio('../static/scripts/games/dodge_a_wrench/assets/audio/intro_speech_dodge.mp3');
  // introSpeech.play();

  let paused = true;
  let muteCheck = true;
  window.addEventListener('keypress', event => {
    // if (event.keyCode === 112) {
    //   if (pause) {
    //     pause = false;
    //   } else {
    //     pause = true;
    //   }
    // }
    if (event.keyCode === 13) {
      if (gameOver) {
        newGame();
      } else {
        togglePause();
        gameStarted = true;
      }
    }
    if (event.keyCode === 109) {

      if (muteCheck) {
        muteCheck = false;
      } else {
        muteCheck = true;
      }
    }
  });

  let key;
  window.addEventListener('keydown', event => {
    if([37,39].indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }
    key = event.keyCode;
  });

  window.addEventListener('keyup', e => {
    key = 0;
  });

  let lastTime = 0;
  let execute = 0;
  let deltaTime;
  let wrench;
  let player;
  let gameStarted;

  wrench = new Wrench();
  player = new Player();

  const newGame = ()=>{
    gameStarted = true;
    gameOver = false;
    wrench = new Wrench();
    player = new Player();
    player.lives = 5;
    // introSpeech.pause();
    bgMusic.play();
    animate();
    count = 0;
  };
  bgMusic.play();

  const startScreen = () => {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0,0,832,600);
    ctx.font = '50px Gloria Hallelujah';
    ctx.fillStyle = 'white';
    ctx.fillText(`Press Enter to Start/Pause`, 90, 300);
  };

  const gameOverScreen = () => {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0,0,832,600);
    ctx.font = '50px Gloria Hallelujah';
    ctx.fillStyle = 'white';
    ctx.fillText(`Game Over`, 300, 250);
    ctx.fillText(`Score: ${count * 100 }`, 300, 325);
    ctx.font = '20px Gloria Hallelujah';
    ctx.fillText(`Press Enter to Play Again`, 300, 375);
    fetch('/send_scores', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({'earned_score':count * 100,'total_score':10000})
  })
  .then(response => response.json())
  .then(data => {   
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
  });        
  window.location.href = '../display_score.html';
    
  };

  const pauseScreen = () => {
    // ctx.fillStyle = "rgba(0,0,0,0.7)";
    // ctx.fillRect(0,0,832,600);
    ctx.font = '50px Gloria Hallelujah';
    ctx.fillStyle = 'red';
    ctx.fillText(`Paused`, 350, 300);
  };


  window.onload = () => {
    drawBg();
    player.draw(ctx);
    drawLeftUp();
    drawRightUp();
    drawMuteOff();
    startScreen();
  };

  const togglePause = () => {
    paused = !paused;
  };

  let gameOver = false;

  const toggleGameOver = () => {
    gameOver = true;
  };

  let myReq;
  gameStarted = false;
  const update = (deltaTime) => {
    if (muteCheck) {
      bgMusic.volume = 0;
    } else {
      bgMusic.volume = 0.1;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBg();
    ctx.font = '30px Gloria Hallelujah';
    ctx.fillStyle = 'red';
    ctx.fillText(`Lives: ${player.lives}`, 25, 100);

    ctx.font = '30px Gloria Hallelujah';
    ctx.fillStyle = 'red';
    ctx.fillText(`${Math.floor(wrench.level)} :Level`, 700, 100);

    ctx.font = '30px Gloria Hallelujah';
    ctx.fillStyle = 'red';
    ctx.fillText(`${count * 100 } :Score`, 675, 150);

    if (muteCheck === true) {
      drawMuteOn();
    } else {
      drawMuteOff();
    }
    drawLeftUp();
    drawRightUp();

    wrench.create();
    wrench.draw(ctx);
    wrench.drawPowerBall(ctx);
    wrench.drawThrower(ctx);
    wrench.updateThrower();
    wrench.update(deltaTime);
    wrench.destroy();
    wrench.handleThrow();
    // console.log(player.superSaiyan);
    if (player.lives === 0) {
      // ctx.clearRect(player.data.cx, player.data.cy, 64, 64);

      player.data.sy = 128;
      player.data.sx = 64;
      player.draw(ctx);
      cancelAnimationFrame(myReq);
      toggleGameOver();
      bgMusic.pause();
      gameOverScreen();
      gameStarted = false;
    }

    player.draw(ctx);
    player.update(deltaTime);
    if (key && key === 37) {
      player.move(-3.5 - (wrench.level/2));
      drawLeftDown();
    }

    if (key && key === 39) {
      player.move(3.5 + (wrench.level/2));
      drawRightDown();
    }
    wrench.hit(player, muteCheck);
    wrench.powerUp(player, muteCheck);
  };

  let count = 0;
  const animate = (time = 0) => {
    if (time % 1000 > 983 && !paused) {
      count += 1;
      wrench.level += 0.1;
    }
    // if (count % 10 === 0 && !paused) {
    //   wrench.level += 1;
    //   console.log(wrench.level);
    // }
    deltaTime = time - lastTime;
    lastTime = time;
    myReq = requestAnimationFrame(animate);
    if (!paused) {
      update(deltaTime);
    }
    if (paused && (gameStarted === true)) {
      pauseScreen();
    }
  };

  const updateButtons = () => {
    if (muteCheck === true) {
      drawMuteOn();
    } else {
      drawMuteOff();
    }
    if (muteCheck) {
      bgMusic.volume = 0;
    } else {
      bgMusic.volume = 0.1;
    }
    drawLeftUp();
    drawRightUp();
    if (key && key === 37) {
      // player.move(-4);
      drawLeftDown();
    }

    if (key && key === 39) {
      // player.move(4);
      drawRightDown();
    }
  };

  const animateButtons = () => {
    updateButtons();
    requestAnimationFrame(animateButtons);
  };
  animate();
  animateButtons();
});
