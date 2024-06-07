class Wrench {
  constructor() {
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

    this.data ={
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

  create() {
    if (this.data.cx < (832)) {
      this.wrenches.push({
        sx: this.data.sx,
        sy: this.data.sy,
        cx: this.data.cx,
        cy: this.data.cy,
        width: 64,
        height: 64,
        throwing: false,
      });
      this.thrower.push({
        sx: this.data.sx,
        sy: this.data.sy,
        cx: this.data.cx,
        cy: this.data.cy,
        width: 64,
        height: 64,
      });
      this.powerBall.push({
        sx: this.data.sx,
        sy: this.data.sy,
        cx: this.data.cx,
        cy: this.data.cy - 64,
        width: 64,
        height: 64,
        throwing: false,
      });
    }
    this.data.cx += 64;
  }

  drawPowerBall(ctx) {
    this.powerBall.forEach((ball)=> {
      ctx.drawImage(this.ballImage, ball.sx, ball.sy,
      ball.width, ball.height, ball.cx, ball.cy, ball.width, ball.height);
    });
  }

  drawThrower(ctx) {
    this.thrower.forEach((thrower) => {
      ctx.drawImage(this.wrenchThrower, thrower.sx, thrower.sy,
      thrower.width, thrower.height, thrower.cx, thrower.cy, thrower.width, thrower.height);
    });
  }

  draw(ctx) {
    this.wrenches.forEach( (wrench, idx) => {
    ctx.drawImage(this.image, wrench.sx, wrench.sy,
      wrench.width, wrench.height,wrench.cx, wrench.cy, wrench.width, wrench.height
    );
    });
  }

  updateThrower() {
    this.thrower.forEach((thrower, idx) => {
      if (this.wrenches[idx].throwing === false ) {
        if (this.execute > 80) {
          thrower.sx += 64;
        }
        if (thrower.sx > 128) {
          thrower.sx = 0;
        }
      }
    });
  }

  update(deltaTime) {
    this.execute += deltaTime;
    this.powerBall.forEach((ball) => {
      if (ball.throwing) {
        ball.cy += (5 + Math.floor(this.level));
        if (this.execute > 100) {
          ball.sx += 64;
        }
        if (ball.sx > 128) {
          ball.sx = 0;
        }
      }
    });

    this.wrenches.forEach( (wrench, idx) => {
      if (wrench.throwing) {
        wrench.cy += (5 + (Math.floor(this.level)));
        if (this.execute > 100) {
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

  destroy() {
    this.wrenches.forEach( (wrench, idx) => {
      if (wrench.cy >= 612) {
        wrench.throwing = false;
        wrench.sx = 0;
        wrench.cy = 0;
      }
    });
    this.powerBall.forEach((ball)=> {
      if (ball.cy >= 612) {
        ball.throwing = false;
        ball.cy = -64;
      }
    });
  }

  setThrow(idx) {
    if (this.wrenches.length === 13) {
      this.wrenches[idx].throwing = true;
    }
  }

  setThrowBall(idx) {
    if (this.powerBall.length === 13) {
      this.powerBall[idx].throwing = true;
    }
  }

  handleThrow() {
    let num = (Math.floor(this.level) * 0.5);
    if ((4 - num) < 1) {
      num = 3;
    }
    let prob = Math.round(Math.random() * 4) - num;

    let throwInterval = Math.round(Math.random() * (4-Math.round(num)));
    if (throwInterval === (4-Math.round(num))) {
      this.setThrow(Math.floor(Math.random() * 13));
    }

    let ballProb = Math.round(Math.random() * 100);
    if (ballProb === 100) {
      this.setThrowBall(Math.floor(Math.random() * 13));
    }
  }

  hit(player, muteCheck) {
    for (let i = 0; i < this.wrenches.length; i++) {
      let playerLeft = player.data.cx + 0;
      let playerRight = player.data.cx + 64;
      if ((this.wrenches[i].cx+32 > playerLeft && this.wrenches[i].cx+32 < playerRight) && (this.wrenches[i].cy+32 > player.data.cy && this.wrenches[i].cy+32 < player.data.cy+64)) {
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

  powerUp(player, muteCheck) {
    for (let i = 0; i < this.powerBall.length; i++) {
      let playerLeft = player.data.cx + 0;
      let playerRight = player.data.cx + 64;
      if ((this.powerBall[i].cx+32 > playerLeft && this.powerBall[i].cx+32 < playerRight) && (this.powerBall[i].cy+32 > player.data.cy && this.powerBall[i].cy+32 < player.data.cy+64)) {
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

}

export default Wrench;
