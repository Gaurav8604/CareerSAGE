class Player {
  constructor() {
    this.image = new Image();
    this.image.src = '../static/scripts/games/dodge_a_wrench/assets/images/dodgeball_player.png';
    this.lives = 5;
    this.execute = 0;
    this.hit = false;
    this.superSaiyan = false;

    this.data ={
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

  draw(ctx) {
    ctx.drawImage(this.image, this.data.sx, this.data.sy,
      this.data.sw, this.data.sh,this.data.cx, this.data.cy, this.data.dw, this.data.dh
    );
  }

  update(deltaTime) {
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

  move(speed) {
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
}

export default Player;
