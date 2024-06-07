/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _wrench = __webpack_require__(1);

var _wrench2 = _interopRequireDefault(_wrench);

var _player = __webpack_require__(2);

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  var buttonCanvas = document.getElementById('buttons');
  var ctxBut = buttonCanvas.getContext('2d');

  var backgroundImage = new Image();
  
  backgroundImage.src = "../static/scripts/games/dodge_a_wrench/assets/images/floor.png";
  var buttonImage = new Image();
  buttonImage.src = '../static/scripts/games/dodge_a_wrench/assets/images/button.png';

  var drawBg = function drawBg() {
    ctx.drawImage(backgroundImage, 0, 0, 833, 600);
  };

  var drawLeftUp = function drawLeftUp() {
    ctxBut.drawImage(buttonImage, 100, 1062, 230, 230, 0, 0, 90, 90);
  };

  var drawLeftDown = function drawLeftDown() {
    ctxBut.drawImage(buttonImage, 348, 1062, 230, 230, 0, 0, 90, 90);
  };

  var drawRightUp = function drawRightUp() {
    ctxBut.drawImage(buttonImage, 100, 802, 230, 230, 100, 0, 90, 90);
  };

  var drawRightDown = function drawRightDown() {
    ctxBut.drawImage(buttonImage, 348, 802, 230, 230, 100, 0, 90, 90);
  };

  var drawMuteOff = function drawMuteOff() {
    ctxBut.drawImage(buttonImage, 348, 5496, 230, 230, 250, 0, 90, 90);
  };

  var drawMuteOn = function drawMuteOn() {
    ctxBut.drawImage(buttonImage, 615, 5496, 230, 230, 250, 0, 90, 90);
  };

  var bgMusic = new Audio('../static/scripts/games/dodge_a_wrench/assets/audio/bg_music.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.1;
  // bgMusic.play();

  var introSpeech = new Audio('../static/scripts/games/dodge_a_wrench/assets/audio/intro_speech_dodge.mp3');
  // introSpeech.play();

  var paused = true;
  var muteCheck = true;
  window.addEventListener('keypress', function (event) {
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

  var key = void 0;
  window.addEventListener('keydown', function (event) {
    if ([37, 39].indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }
    key = event.keyCode;
  });

  window.addEventListener('keyup', function (e) {
    key = 0;
  });

  var lastTime = 0;
  var execute = 0;
  var deltaTime = void 0;
  var wrench = void 0;
  var player = void 0;
  var gameStarted = void 0;

  wrench = new _wrench2.default();
  player = new _player2.default();

  var newGame = function newGame() {
    gameStarted = true;
    gameOver = false;
    wrench = new _wrench2.default();
    player = new _player2.default();
    player.lives = 5;
    // introSpeech.pause();
    bgMusic.play();
    animate();
    count = 0;
  };
  bgMusic.play();

  var startScreen = function startScreen() {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, 832, 600);
    ctx.font = '50px Gloria Hallelujah';
    ctx.fillStyle = 'white';
    ctx.fillText('Press Enter to Start/Pause', 90, 300);
  };

  var gameOverScreen = function gameOverScreen() {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, 832, 600);
    ctx.font = '50px Gloria Hallelujah';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', 300, 250);
    ctx.fillText('Score: ' + count * 100, 300, 325);
    ctx.font = '20px Gloria Hallelujah';
    ctx.fillText('Press Enter to Play Again', 300, 375);
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

  var pauseScreen = function pauseScreen() {
    // ctx.fillStyle = "rgba(0,0,0,0.7)";
    // ctx.fillRect(0,0,832,600);
    ctx.font = '50px Gloria Hallelujah';
    ctx.fillStyle = 'red';
    ctx.fillText('Paused', 350, 300);
  };

  window.onload = function () {
    drawBg();
    player.draw(ctx);
    drawLeftUp();
    drawRightUp();
    drawMuteOff();
    startScreen();
  };

  var togglePause = function togglePause() {
    paused = !paused;
  };

  var gameOver = false;

  var toggleGameOver = function toggleGameOver() {
    gameOver = true;
  };

  var myReq = void 0;
  gameStarted = false;
  var update = function update(deltaTime) {
    if (muteCheck) {
      bgMusic.volume = 0;
    } else {
      bgMusic.volume = 0.1;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBg();
    ctx.font = '30px Gloria Hallelujah';
    ctx.fillStyle = 'red';
    ctx.fillText('Lives: ' + player.lives, 25, 100);

    ctx.font = '30px Gloria Hallelujah';
    ctx.fillStyle = 'red';
    ctx.fillText(Math.floor(wrench.level) + ' :Level', 700, 100);

    ctx.font = '30px Gloria Hallelujah';
    ctx.fillStyle = 'red';
    ctx.fillText(count * 100 + ' :Score', 675, 150);

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
      player.move(-3.5 - wrench.level / 2);
      drawLeftDown();
    }

    if (key && key === 39) {
      player.move(3.5 + wrench.level / 2);
      drawRightDown();
    }
    wrench.hit(player, muteCheck);
    wrench.powerUp(player, muteCheck);
  };

  var count = 0;
  var animate = function animate() {
    var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

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
    if (paused && gameStarted === true) {
      pauseScreen();
    }
  };

  var updateButtons = function updateButtons() {
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

  var animateButtons = function animateButtons() {
    updateButtons();
    requestAnimationFrame(animateButtons);
  };
  animate();
  animateButtons();
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wrench = function () {
  function Wrench() {
    _classCallCheck(this, Wrench);

    this.image = new Image();
    this.image.src = '../static/scripts/games/dodge_a_wrench/assets/images/wrench_small.png';
    this.wrenchHit = new Audio('../static/scripts/games/dodge_a_wrench/assets/audio/wrench_hit.mp3');
    this.wrenchHit.volume = 1;
    this.wrenchThrower = new Image();
    this.wrenchThrower.src = '../static/scripts/games/dodge_a_wrench/assets/images/wheel_chair_man_2.png';
    this.ballImage = new Image();
    this.ballImage.src = '../static/scripts/games/dodge_a_wrench/assets/images/dragon_ball.png';
    this.chargeUp = new Audio('../static/scripts/games/dodge_a_wrench/assets/audio/charge_up.mp3');
    this.chargeUp.volume = 1;
    this.level = 1;

    this.data = {
      sx: 0,
      sy: 0,
      sw: 64,
      sh: 64,
      cx: 0,
      cy: 0,
      dw: 64,
      dh: 64
    };
    this.wrenches = [];
    this.thrower = [];
    this.powerBall = [];
    this.execute = 0;
  }

  _createClass(Wrench, [{
    key: 'create',
    value: function create() {
      if (this.data.cx < 832) {
        this.wrenches.push({
          sx: this.data.sx,
          sy: this.data.sy,
          cx: this.data.cx,
          cy: this.data.cy,
          width: 64,
          height: 64,
          throwing: false
        });
        this.thrower.push({
          sx: this.data.sx,
          sy: this.data.sy,
          cx: this.data.cx,
          cy: this.data.cy,
          width: 64,
          height: 64
        });
        this.powerBall.push({
          sx: this.data.sx,
          sy: this.data.sy,
          cx: this.data.cx,
          cy: this.data.cy - 64,
          width: 64,
          height: 64,
          throwing: false
        });
      }
      this.data.cx += 64;
    }
  }, {
    key: 'drawPowerBall',
    value: function drawPowerBall(ctx) {
      var _this = this;

      this.powerBall.forEach(function (ball) {
        ctx.drawImage(_this.ballImage, ball.sx, ball.sy, ball.width, ball.height, ball.cx, ball.cy, ball.width, ball.height);
      });
    }
  }, {
    key: 'drawThrower',
    value: function drawThrower(ctx) {
      var _this2 = this;

      this.thrower.forEach(function (thrower) {
        ctx.drawImage(_this2.wrenchThrower, thrower.sx, thrower.sy, thrower.width, thrower.height, thrower.cx, thrower.cy, thrower.width, thrower.height);
      });
    }
  }, {
    key: 'draw',
    value: function draw(ctx) {
      var _this3 = this;

      this.wrenches.forEach(function (wrench, idx) {
        ctx.drawImage(_this3.image, wrench.sx, wrench.sy, wrench.width, wrench.height, wrench.cx, wrench.cy, wrench.width, wrench.height);
      });
    }
  }, {
    key: 'updateThrower',
    value: function updateThrower() {
      var _this4 = this;

      this.thrower.forEach(function (thrower, idx) {
        if (_this4.wrenches[idx].throwing === false) {
          if (_this4.execute > 80) {
            thrower.sx += 64;
          }
          if (thrower.sx > 128) {
            thrower.sx = 0;
          }
        }
      });
    }
  }, {
    key: 'update',
    value: function update(deltaTime) {
      var _this5 = this;

      this.execute += deltaTime;
      this.powerBall.forEach(function (ball) {
        if (ball.throwing) {
          ball.cy += 5 + Math.floor(_this5.level);
          if (_this5.execute > 100) {
            ball.sx += 64;
          }
          if (ball.sx > 128) {
            ball.sx = 0;
          }
        }
      });

      this.wrenches.forEach(function (wrench, idx) {
        if (wrench.throwing) {
          wrench.cy += 5 + Math.floor(_this5.level);
          if (_this5.execute > 100) {
            wrench.sx += 64;
          }
          if (wrench.sx > 192) {
            wrench.sx = 0;
          }
        }
      });
      if (this.execute > 100) {
        this.execute = 0;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.wrenches.forEach(function (wrench, idx) {
        if (wrench.cy >= 612) {
          wrench.throwing = false;
          wrench.sx = 0;
          wrench.cy = 0;
        }
      });
      this.powerBall.forEach(function (ball) {
        if (ball.cy >= 612) {
          ball.throwing = false;
          ball.cy = -64;
        }
      });
    }
  }, {
    key: 'setThrow',
    value: function setThrow(idx) {
      if (this.wrenches.length === 13) {
        this.wrenches[idx].throwing = true;
      }
    }
  }, {
    key: 'setThrowBall',
    value: function setThrowBall(idx) {
      if (this.powerBall.length === 13) {
        this.powerBall[idx].throwing = true;
      }
    }
  }, {
    key: 'handleThrow',
    value: function handleThrow() {
      var num = Math.floor(this.level) * 0.5;
      if (4 - num < 1) {
        num = 3;
      }
      var prob = Math.round(Math.random() * 4) - num;

      var throwInterval = Math.round(Math.random() * (4 - Math.round(num)));
      if (throwInterval === 4 - Math.round(num)) {
        this.setThrow(Math.floor(Math.random() * 13));
      }

      var ballProb = Math.round(Math.random() * 100);
      if (ballProb === 100) {
        this.setThrowBall(Math.floor(Math.random() * 13));
      }
    }
  }, {
    key: 'hit',
    value: function hit(player, muteCheck) {
      for (var i = 0; i < this.wrenches.length; i++) {
        var playerLeft = player.data.cx + 0;
        var playerRight = player.data.cx + 64;
        if (this.wrenches[i].cx + 32 > playerLeft && this.wrenches[i].cx + 32 < playerRight && this.wrenches[i].cy + 32 > player.data.cy && this.wrenches[i].cy + 32 < player.data.cy + 64) {
          if (muteCheck) {
            this.wrenchHit.volume = 0;
          } else {
            this.wrenchHit.volume = 1;
          }
          this.wrenchHit.play();
          this.wrenches[i].cy = 0;
          this.wrenches[i].throwing = false;
          this.wrenches[i].sx = 0;
          if (player.superSaiyan) {
            player.superSaiyan = false;
          } else {
            player.lives -= 1;
          }
          player.hit = true;
        }
      }
    }
  }, {
    key: 'powerUp',
    value: function powerUp(player, muteCheck) {
      for (var i = 0; i < this.powerBall.length; i++) {
        var playerLeft = player.data.cx + 0;
        var playerRight = player.data.cx + 64;
        if (this.powerBall[i].cx + 32 > playerLeft && this.powerBall[i].cx + 32 < playerRight && this.powerBall[i].cy + 32 > player.data.cy && this.powerBall[i].cy + 32 < player.data.cy + 64) {
          if (muteCheck) {
            this.chargeUp.volume = 0;
          } else {
            this.chargeUp.volume = 0.8;
          }
          this.chargeUp.play();
          player.superSaiyan = true;
          this.powerBall[i].cy = -64;
          this.powerBall[i].throwing = false;
        }
      }
    }
  }]);

  return Wrench;
}();

exports.default = Wrench;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
  function Player() {
    _classCallCheck(this, Player);

    this.image = new Image();
    this.image.src = '../static/scripts/games/dodge_a_wrench/assets/images/dodgeball_player.png';
    this.lives = 5;
    this.execute = 0;
    this.hit = false;
    this.superSaiyan = false;

    this.data = {
      sx: 0,
      sy: 0,
      sw: 64,
      sh: 64,
      cx: 400,
      cy: 536,
      dw: 64,
      dh: 64
    };
  }

  _createClass(Player, [{
    key: 'draw',
    value: function draw(ctx) {
      ctx.drawImage(this.image, this.data.sx, this.data.sy, this.data.sw, this.data.sh, this.data.cx, this.data.cy, this.data.dw, this.data.dh);
    }
  }, {
    key: 'update',
    value: function update(deltaTime) {
      this.execute += deltaTime;
      if (this.superSaiyan) {
        if (this.execute > 200) {
          this.data.sx += 64;
          this.data.sy = 64;
        }
        if (this.data.sx > 64) {
          this.data.sx = 0;
          this.data.sy = 64;
        }
        if (this.execute > 200) {
          this.execute = 0;
        }
      } else {
        if (this.hit) {
          this.data.sx = 0;
          this.data.sy = 128;
          if (this.execute > 1000) {
            this.execute = 0;
            this.hit = false;
          }
        } else {
          if (this.execute > 200) {
            this.data.sx += 64;
            this.data.sy = 0;
          }
          if (this.data.sx > 64) {
            this.data.sx = 0;
            this.data.sy = 0;
          }
          if (this.execute > 200) {
            this.execute = 0;
          }
        }
      }
    }
  }, {
    key: 'move',
    value: function move(speed) {
      if (speed < 0) {
        if (this.data.cx > 0) {
          this.data.cx += speed;
        }
      } else {
        if (this.data.cx < 800 - 32) {
          this.data.cx += speed;
        }
      }
    }

    // kill(ctx) {
    //   this.data.sy = 336;
    // }

  }]);

  return Player;
}();

exports.default = Player;

/***/ })
/******/ ]);