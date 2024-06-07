//util.js

var Util = {};

Util.getRandomIntBetweenInterval = function (min, max) {
  var value = Math.floor(Math.random() * (max - min + 1)) + min;
  return value;
};

Util.drawGuidelines = function (context) {
  var initialPosition = 100;

  // Horizontal lines
  for (var i = 0; i < 5; i++) {
    context.beginPath();
    context.moveTo(0, initialPosition);
    context.lineTo(800, initialPosition);
    context.stroke();
    initialPosition += 100;
  }

  initialPosition = 160;

  // Vertical lines
  for (var i = 0; i < 5; i++) {
    context.beginPath();
    context.moveTo(initialPosition, 0);
    context.lineTo(initialPosition, 600);
    context.stroke();
    initialPosition += GameConfig.scenario.lanesSize;
  }
};

Util.drawLog = function (context, text) {
  context.fillText(text, 680, 50);
};

Util.drawTextWithShadow = function (
  context,
  text,
  x,
  y,
  textColor,
  shadowOffsetX,
  shadowOffsetY,
  shadowColor
) {
  context.save();
  context.fillStyle = shadowColor;
  context.fillText(text, x + shadowOffsetX, y + shadowOffsetY);

  context.fillStyle = textColor;
  context.fillText(text, x, y);
  context.restore();
};

Util.drawPressAnyKey = function (context) {
  context.save();

  context.globalAlpha = 0.5;
  context.fillRect(185, 470, 430, 40);

  context.globalAlpha = 1;
  Util.drawTextWithShadow(
    context,
    "PRESS ANY KEY TO START!",
    200,
    500,
    "yellow",
    2,
    2,
    "red"
  );

  context.restore();
};

//gamwConfig.js

var GameConfig = {
    debug: {},
    collision: {},
    scenario: {},
    traffic: {},
    level: {},
    obstacle: {},
    player: {},
  };
  
  GameConfig.debug.showCollisionArea = false;
  GameConfig.debug.showCarId = false;
  GameConfig.debug.showGuideLines = false;
  
  GameConfig.collision.nearDistanceX = 10;
  GameConfig.collision.nearDistanceY = 100;
  
  GameConfig.scenario.numberOfLanes = 4;
  GameConfig.scenario.lanesSize = 120;
  
  GameConfig.traffic.minCarSpeed = 0.4;
  GameConfig.traffic.maxCarSpeed = 0.9;
  GameConfig.traffic.numCars = 5;
  
  GameConfig.level.amountIncrease = 0.05;
  
  GameConfig.obstacle.pointsLossOnPothole = 20;
  GameConfig.obstacle.pothole = 1;
  GameConfig.obstacle.oil = 2;
  
  /* CAR TYPES
      0 = Ambulance
      1 = Audi
      2 = Black_viper
      3 = Car
      4 = Mini_truck
      5 = Mini_van
      6 = Police
      7 = Taxi
      8 = Truck
  */
  GameConfig.player.carType = 1;
  GameConfig.player.yPosition = 500;
  GameConfig.player.carId = 99;
  

  //levelController.js

  function LevelController() {
    this.initialize = function (speed) {
      this.currentSpeed = speed;
    };
  
    this.increaseSpeed = function () {
      this.currentSpeed += GameConfig.level.amountIncrease;
      return this.currentSpeed;
    };
  }

  //collisionDetection.js

  var CollisionDetection = {};

CollisionDetection.isCollide = function (obj1, obj2) {
  return (
    CollisionDetection.isCollideY(obj1, obj2) &&
    CollisionDetection.isCollideX(obj1, obj2)
  );
};

CollisionDetection.isCollideX = function (obj1, obj2) {
  return CollisionDetection.isNearX(obj1, obj2, -1);
};

CollisionDetection.isCollideY = function (obj1, obj2) {
  return CollisionDetection.isNearY(obj1, obj2, -1);
};

CollisionDetection.isNear = function (obj1, obj2) {
  return (
    CollisionDetection.isNearY(
      obj1,
      obj2,
      GameConfig.collision.nearDistanceY
    ) &&
    CollisionDetection.isNearX(obj1, obj2, GameConfig.collision.nearDistanceX)
  );
};

CollisionDetection.isNearY = function (obj1, obj2, nearDistanceY) {
  var distance = nearDistanceY;

  if (distance < 0) {
    distance = 0;
  }

  if (obj1.y <= obj2.y && obj1.y + obj1.height + distance >= obj2.y) {
    return true;
  } else if (obj2.y <= obj1.y && obj2.y + obj2.height + distance >= obj1.y) {
    return true;
  } else {
    return false;
  }
};

CollisionDetection.isNearX = function (obj1, obj2, nearDistanceX) {
  var distance = nearDistanceX;

  if (distance < 0) {
    distance = 0;
  }

  if (obj1.x <= obj2.x && obj1.x + obj1.width + distance >= obj2.x) {
    return true;
  } else if (obj2.x <= obj1.x && obj2.x + obj2.width + distance >= obj1.x) {
    return true;
  } else {
    return false;
  }
};


//obstacle.js

function Obstacle() {
    this.width = 80;
    this.height = 70;
    this.x;
    this.y;
    this.isOnRoad;
    this.lane;
    this.type;
  
    var self = this;
  
    var image = new Image();
  
    this.initialize = function (emptyLane, type) {
      this.type = type;
  
      if (this.type == GameConfig.obstacle.oil) {
        image.src = "../static/scripts/games/highway_rider/sprites/obstacles/oil.png";
      } else {
        image.src = this.getRandomPotholeImageSrc();
      }
  
      this.x = this.newXPosition(emptyLane);
      this.y = -this.height;
      this.isOnRoad = true;
  
      this.collisionArea = {
        x: self.x,
        y: self.y,
        /* reduce collision area in order to let car's front wheels pass onto the pothole 
              before indicate a collision (this behavior is more realist) */
        height: self.height - 60,
        width: self.width,
      };
    };
  
    this.draw = function (context) {
      context.drawImage(image, this.x, this.y, this.width, this.height);
  
      if (GameConfig.debug.showCollisionArea) {
        context.strokeRect(
          this.collisionArea.x,
          this.collisionArea.y,
          this.collisionArea.width,
          this.collisionArea.height
        );
      }
    };
  
    this.update = function (maxY) {
      this.y += 1;
      if (this.y >= maxY) {
        this.isOnRoad = false;
      } else {
        this.isOnRoad = true;
      }
      this.collisionArea.x = this.x;
      this.collisionArea.y = this.y;
    };
  
    this.newXPosition = function (emptyLane) {
      var newRandom = Util.getRandomIntBetweenInterval(
        0,
        GameConfig.scenario.numberOfLanes - 1
      );
      while (newRandom == emptyLane) {
        newRandom = Util.getRandomIntBetweenInterval(
          0,
          GameConfig.scenario.numberOfLanes - 1
        );
      }
  
      this.lane = newRandom;
  
      return 180 + GameConfig.scenario.lanesSize * newRandom;
    };
  
    // This function is only for Pothole
    this.getRandomPotholeImageSrc = function () {
      var imageSrcArray = [];
  
      imageSrcArray[0] = "../static/scripts/games/highway_rider/sprites/obstacles/pothole1.png";
      imageSrcArray[1] = "../static/scripts/games/highway_rider/sprites/obstacles/pothole2.png";
      imageSrcArray[2] = "../static/scripts/games/highway_rider/sprites/obstacles/pothole3.png";
  
      var index = Util.getRandomIntBetweenInterval(0, imageSrcArray.length - 1);
  
      return imageSrcArray[index];
    };
  }

  
  //car.js

  function Car() {
    var step = 0.1;
  
    var positions = [0, 1, 2, 3];
    var currentLane = positions[0];
    var nextLane = positions[0];
    var carImage = new Image();
    var isColliding = false;
    var didPlayHorn = false;
  
    var carTypeArray = [
      "Ambulance.png",
      "Audi.png",
      "Black_viper.png",
      "Car.png",
      "Mini_truck.png",
      "Mini_van.png",
      "Police.png",
      "taxi.png",
      "truck.png",
    ];
  
    var colorCount = 0;
    var self = this;
  
    this.slidingSound;
  
    this.initialize = function (initialPosition, carType, carIdPar) {
      this.audio = this.getRandomHornSound();
      this.slidingSound = this.getSlidingSound();
  
      this.carNearMyFront;
      this.carNearMyBack;
      this.isSliding = false;
      this.passedOnPothole = false;
  
      this.carSpeed = 0.0;
      this.carId = carIdPar;
      currentLane = positions[0];
      nextLane = positions[0];
      carImage.src = "../static/scripts/games/highway_rider/sprites/" + carTypeArray[carType];
  
      this.isMovingLeft = false;
      this.isMovingRight = false;
  
      this.y = initialPosition;
  
      this.height = 100;
      this.width = 60;
  
      this.collisionArea = {
        x: self.x + 50,
        y: self.y + 15,
        height: self.height - 40,
        width: self.width - 25,
      };
  
      this.updatePositionXAccordingLane(currentLane);
    };
  
    this.getCurrentLane = function () {
      return currentLane;
    };
  
    this.moveToLeft = function () {
      if (!(this.isMovingRight || this.isMovingLeft)) {
        if (currentLane > positions[0]) {
          this.slidingSound.play();
          nextLane = currentLane - 1;
          this.movingLeft();
          this.isMovingLeft = true;
          this.isMovingRight = false;
        }
      }
    };
  
    this.moveToRight = function () {
      if (!(this.isMovingRight || this.isMovingLeft)) {
        if (currentLane < positions[positions.length - 1]) {
          this.slidingSound.play();
          nextLane = currentLane + 1;
          this.movingRight();
          this.isMovingLeft = false;
          this.isMovingRight = true;
        }
      }
    };
  
    this.movingLeft = function () {
      if (this.isMovingLeft) {
        currentLane -= step;
      }
      if (currentLane <= nextLane) {
        this.isMovingLeft = false;
        currentLane = nextLane;
      }
    };
  
    this.movingRight = function () {
      if (this.isMovingRight) {
        currentLane += step;
      }
      if (currentLane >= nextLane) {
        this.isMovingRight = false;
        currentLane = nextLane;
      }
    };
  
    this.update = function () {
      // If there is a car near my back, I must increase my speed
      if (this.carNearMyBack) {
        this.increaseSpeed(0.005);
  
        if (
          CollisionDetection.isNearY(
            this.collisionArea,
            this.carNearMyBack.collisionArea,
            40
          )
        ) {
          this.carSpeed = this.carNearMyBack.carSpeed;
        }
      }
    };
  
    this.drawCar = function (context) {
      if (this.isMovingLeft) {
        this.movingLeft();
        this.updatePositionXAccordingLane(currentLane);
      }
  
      if (this.isMovingRight) {
        this.movingRight();
        this.updatePositionXAccordingLane(currentLane);
      }
  
      context.drawImage(carImage, this.x, this.y, 100, 100);
  
      if (GameConfig.debug.showCarId) {
        context.fillText(this.carId, this.x + 10, this.y - 10);
      }
  
      if (GameConfig.debug.showCollisionArea) {
        context.strokeRect(
          this.collisionArea.x,
          this.collisionArea.y,
          this.collisionArea.width,
          this.collisionArea.height
        );
      }
  
      this.drawNearFrontAlert(context);
      this.playHorn();
  
      if (this.isSliding) {
        var slideSide = Math.random();
        // Slide car to random position
        if (slideSide < 0.5) {
          this.moveToLeft();
        } else {
          this.moveToRight();
        }
        this.isSliding = false;
      }
    };
  
    this.playHorn = function () {
      if (this.carNearMyFront) {
        if (!didPlayHorn) {
          this.audio.play();
          didPlayHorn = true;
        }
      } else {
        didPlayHorn = false;
      }
    };
  
    this.drawNearFrontAlert = function (context) {
      if (this.carNearMyFront) {
        var color1 = "red";
        var color2 = "yellow";
  
        if (colorCount < 10) {
          colorCount++;
          color1 = "red";
          color2 = "yellow";
        } else {
          color2 = "red";
          color1 = "yellow";
          colorCount = 0;
        }
        Util.drawTextWithShadow(
          context,
          "WATCH OUT!!! ",
          this.x - 30,
          this.y - 20,
          color1,
          0,
          0,
          color2
        );
      }
    };
  
    this.drawNearBackAlert = function (context) {
      if (this.carNearMyBack) {
        var color1 = "red";
        var color2 = "yellow";
  
        if (colorCount < 10) {
          colorCount++;
          color1 = "red";
          color2 = "yellow";
        } else {
          color2 = "red";
          color1 = "yellow";
          colorCount = 0;
        }
        Util.drawTextWithShadow(
          context,
          "BACK " + this.carNearMyBack.carId,
          this.x - 30,
          this.y + 120,
          color1,
          0,
          0,
          color2
        );
      }
    };
  
    this.updatePositionXAccordingLane = function (lane) {
      this.x = lane * GameConfig.scenario.lanesSize + 170;
      this.collisionArea.x = this.x + 32;
    };
  
    this.setY = function (yPosition) {
      this.y = yPosition;
      this.collisionArea.y = this.y + 8;
    };
  
    this.getY = function () {
      return this.y;
    };
  
    this.setCurrentLane = function (lanePar) {
      if (lanePar < 0) {
        currentLane = positions[0];
      } else if (lanePar > positions.length) {
        currentLane = positions[positions.length - 1];
      } else {
        currentLane = positions[lanePar];
      }
      this.updatePositionXAccordingLane(currentLane);
    };
  
    this.setCarSpeed = function (speed) {
      if (speed <= GameConfig.traffic.minCarSpeed) {
        this.carSpeed = 1 - GameConfig.traffic.minCarSpeed;
      } else if (speed >= GameConfig.traffic.maxCarSpeed) {
        this.carSpeed = 1 - GameConfig.traffic.maxCarSpeed;
      } else {
        this.carSpeed = 1 - speed;
      }
    };
  
    this.getCarSpeed = function () {
      return 1 - this.carSpeed;
    };
  
    this.decreaseSpeed = function (amount) {
      var newSpeed = this.getCarSpeed() - amount;
      this.setCarSpeed(newSpeed);
    };
  
    this.increaseSpeed = function (amount) {
      var newSpeed = this.getCarSpeed() + amount;
      this.setCarSpeed(newSpeed);
    };
  
    this.getCarTypeNumber = function () {
      return carTypeArray.length;
    };
  
    this.setIsColliding = function (isCollidingPar) {
      isColliding = isCollidingPar;
    };
  
    this.getIsColliding = function () {
      return isColliding;
    };
  
    this.getCarImage = function () {
      return carImage;
    };
  
    this.getRandomHornSound = function () {
      var hornNumber = Util.getRandomIntBetweenInterval(1, 3);
      var hornSound = "../static/scripts/games/highway_rider/sounds/carHorn" + hornNumber + ".mp3";
  
      return new Audio(hornSound);
    };
  
    this.getSlidingSound = function () {
      return new Audio("../static/scripts/games/highway_rider/sounds/sliding.mp3");
    };
  }

  
  //traffic.js

  function Traffic() {
    var context;
    var initialCarsYPosition = -100;
  
    var cars = [];
    var totalCreatedCars = 0;
  
    var carPlayer;
  
    this.emptyLane;
    this.nextEmptyLane;
  
    var crashAudio = new Audio("../static/scripts/games/highway_rider/sounds/crash.mp3");
    var playedCrash;
  
    this.initialize = function (canvas, scenario, carPlayerPar) {
      playedCrash = false;
      this.canvas = canvas;
      context = canvas.getContext("2d");
  
      carPlayer = carPlayerPar;
  
      this.scenario = scenario;
  
      this.nextEmptyLane = Util.getRandomIntBetweenInterval(
        0,
        GameConfig.scenario.numberOfLanes - 1
      );
      this.emptyLane = this.nextEmptyLane;
  
      this.createCars();
    };
  
    this.createCars = function () {
      for (var i = 0; i < GameConfig.traffic.numCars; i++) {
        cars[i] = this.tryCreateCar(i);
      }
    };
  
    this.createCar = function (idCar, lanePar) {
      var c = new Car();
      var carTypesNumber = c.getCarTypeNumber() - 1;
      var carType = Util.getRandomIntBetweenInterval(0, carTypesNumber);
  
      c.initialize(initialCarsYPosition, carType, idCar);
      c.setCurrentLane(lanePar);
      c.setCarSpeed(Math.random());
  
      var carsInLaneTemp = this.carsInLane(lanePar);
      var maxSpeed = 0;
  
      for (var i = 0; i < carsInLaneTemp.length; i++) {
        if (carsInLaneTemp[i].getCarSpeed() > maxSpeed) {
          maxSpeed = carsInLaneTemp[i].getCarSpeed();
        }
      }
  
      while (c.getCarSpeed() < maxSpeed - 0.1) {
        c.setCarSpeed(Math.random());
      }
  
      return c;
    };
  
    this.tryCreateCar = function (idCar) {
      var currentLane = Util.getRandomIntBetweenInterval(
        0,
        GameConfig.scenario.numberOfLanes - 1
      );
      while (currentLane == this.emptyLane || currentLane == this.nextEmptyLane) {
        currentLane = Util.getRandomIntBetweenInterval(
          0,
          GameConfig.scenario.numberOfLanes - 1
        );
      }
  
      if (this.canCreateCarInLane(currentLane)) {
        totalCreatedCars++;
        return this.createCar(idCar, currentLane);
      } else {
        return undefined;
      }
    };
  
    this.canCreateCarInLane = function (lanePar) {
      var carsInCurrentLane = this.carsInLane(lanePar);
  
      for (var i = 0; i < carsInCurrentLane.length; i++) {
        if (carsInCurrentLane[i].y < 120) {
          return false;
        }
      }
  
      return true;
    };
  
    this.draw = function (context) {
      for (var i = 0; i < cars.length; i++) {
        if (cars[i]) {
          cars[i].drawCar(context);
        }
      }
    };
  
    this.update = function () {
      for (var i = 0; i < cars.length; i++) {
        var currentCar = cars[i];
        if (currentCar) {
          currentCar.update();
          var newPosition = currentCar.getY() + currentCar.carSpeed;
  
          currentCar.setY(newPosition);
  
          // "Remove" car if it is out of canvas
          if (currentCar.getY() > this.canvas.height) {
            cars[i] = undefined;
          }
        } else {
          cars[i] = this.tryCreateCar(i);
        }
      }
  
      for (var i = 0; i < GameConfig.scenario.numberOfLanes; i++) {
        var carsInCurrentLane = this.carsInLane(i);
        this.verifyColisionInLane(carsInCurrentLane);
      }
  
      if (carPlayer) {
        this.verifyPlayerCollision();
        this.verifyCollisionWithObstacles();
      }
  
      this.startChangingEmptyLane();
      this.tryChangeEmptyLane();
    };
  
    this.startChangingEmptyLane = function () {
      var changeEmptyLaneProbability = Math.random();
  
      if (changeEmptyLaneProbability < 0.002) {
        if (this.nextEmptyLane == this.emptyLane) {
          this.nextEmptyLane = Util.getRandomIntBetweenInterval(
            0,
            GameConfig.scenario.numberOfLanes - 1
          );
          while (this.nextEmptyLane == this.emptyLane) {
            this.nextEmptyLane = Util.getRandomIntBetweenInterval(
              0,
              GameConfig.scenario.numberOfLanes - 1
            );
          }
        }
      }
    };
  
    this.tryChangeEmptyLane = function () {
      if (this.nextEmptyLane != this.emptyLane) {
        // if has nothing on lane change the empty lane
        if (!this.hasSomethingOnLane(this.nextEmptyLane)) {
          this.emptyLane = this.nextEmptyLane;
        }
      }
    };
  
    this.hasObstaclesInLane = function (lanePar) {
      if (this.scenario) {
        return (
          (this.scenario.oil && this.scenario.oil.lane == lanePar) ||
          (this.scenario.pothole && this.scenario.pothole.lane == lanePar)
        );
      } else {
        return false;
      }
    };
  
    this.hasSomethingOnLane = function (lanePar) {
      var hasObjs = this.hasObstaclesInLane(lanePar);
      var carsInlaneTemp = this.carsInLane(lanePar);
      var hasCars = carsInlaneTemp.length > 0;
  
      return hasObjs || hasCars;
    };
  
    this.carsInLane = function (lanePar) {
      var carsInLane = [];
      var index = 0;
      for (var i = 0; i < cars.length; i++) {
        if (cars[i]) {
          if (cars[i].getCurrentLane() == lanePar) {
            carsInLane[index] = cars[i];
            index++;
          }
        }
      }
  
      return carsInLane;
    };
  
    this.verifyColisionInLane = function (carsInCurrentLane) {
      if (carsInCurrentLane.length > 1) {
        var collisionCars = this.createCollisionMap(carsInCurrentLane.length);
  
        // Reset near status for each car in lane
        for (var i = 0; i < carsInCurrentLane.length; i++) {
          carsInCurrentLane[i].carNearMyFront = undefined;
          carsInCurrentLane[i].carNearMyBack = undefined;
        }
  
        // Test collision on symmetric matrix only
        for (var i = 0; i < carsInCurrentLane.length; i++) {
          for (var j = i + 1; j < carsInCurrentLane.length; j++) {
            if (
              CollisionDetection.isNear(
                carsInCurrentLane[i].collisionArea,
                carsInCurrentLane[j].collisionArea
              )
            ) {
              // store the car that is in the front
              if (carsInCurrentLane[i].y < carsInCurrentLane[j].y) {
                carsInCurrentLane[i].carNearMyBack = carsInCurrentLane[j];
                carsInCurrentLane[j].carNearMyFront = carsInCurrentLane[i];
              } else {
                carsInCurrentLane[j].carNearMyBack = carsInCurrentLane[i];
                carsInCurrentLane[i].carNearMyFront = carsInCurrentLane[j];
              }
            }
  
            if (
              CollisionDetection.isCollide(
                carsInCurrentLane[i].collisionArea,
                carsInCurrentLane[j].collisionArea
              )
            ) {
              collisionCars[i] = 1;
              collisionCars[j] = 1;
            }
          }
        }
  
        this.setWillCollideCars(carsInCurrentLane, collisionCars);
      }
    };
  
    this.verifyPlayerCollision = function () {
      carPlayer.setIsColliding(false);
      carPlayer.carNearMyFront = undefined;
  
      for (var i = 0; i < cars.length; i++) {
        if (cars[i]) {
          if (
            CollisionDetection.isCollide(
              carPlayer.collisionArea,
              cars[i].collisionArea
            )
          ) {
            carPlayer.setIsColliding(true);
  
            Game.gameOver();
  
            if (!playedCrash) {
              crashAudio.volume = 0.5;
              crashAudio.play();
              playedCrash = true;
            }
  
            return;
          }
  
          if (
            CollisionDetection.isNear(
              carPlayer.collisionArea,
              cars[i].collisionArea
            )
          ) {
            carPlayer.carNearMyFront = cars[i];
          }
        }
      }
    };
  
    this.verifyCollisionWithObstacles = function () {
      if (this.scenario && carPlayer) {
        if (
          this.scenario.oil &&
          CollisionDetection.isCollide(
            carPlayer.collisionArea,
            this.scenario.oil.collisionArea
          )
        ) {
          carPlayer.isSliding = true;
        }
  
        if (
          this.scenario.pothole &&
          CollisionDetection.isCollide(
            carPlayer.collisionArea,
            this.scenario.pothole.collisionArea
          )
        ) {
          carPlayer.passedOnPothole = true;
        }
      }
    };
  
    this.setWillCollideCars = function (carsArray, collisionCars) {
      for (var i = 0; i < collisionCars.length; i++) {
        if (collisionCars[i] == 1) {
          carsArray[i].setIsColliding(true);
        } else {
          carsArray[i].setIsColliding(false);
        }
      }
    };
  
    this.createCollisionMap = function (size) {
      var map = [];
  
      for (var i = 0; i < size; i++) {
        map[i] = 0;
      }
  
      return map;
    };
  }

  
  //tree.js

  function Tree() {
    this.width = 80;
    this.height = 80;
    this.x;
    this.y;
    this.isOnScreen;
    this.side;
  
    var self = this;
  
    var image = new Image();
  
    this.initialize = function (initialPosition, sidePar) {
      this.side = sidePar;
  
      image.src = this.getRandomTreeImageSrc();
  
      this.x = this.newXPosition();
      this.y = (-60 - this.height) * initialPosition;
      this.isOnScreen = true;
    };
  
    this.draw = function (context) {
      context.drawImage(image, this.x, this.y, this.width, this.height);
    };
  
    this.update = function (maxY) {
      this.y += 1;
      if (this.y >= maxY) {
        this.isOnScreen = false;
        this.y = -this.height;
        this.x = this.newXPosition();
      } else {
        this.isOnScreen = true;
      }
    };
  
    this.newXPosition = function () {
      if (this.side == 0) {
        return Math.random() * (170 - this.width);
      } else {
        return 650 + Math.random() * (160 - this.width);
      }
    };
  
    this.getRandomTreeImageSrc = function () {
      var imageSrcArray = [];
  
      imageSrcArray[0] = "../static/scripts/games/highway_rider/sprites/scenario/tree1.png";
      imageSrcArray[1] = "../static/scripts/games/highway_rider/sprites/scenario/tree2.png";
  
      var index = Util.getRandomIntBetweenInterval(0, imageSrcArray.length - 1);
  
      return imageSrcArray[index];
    };
  }

  
  //scenario.js

  function Scenario() {
    var roadImage = new Image();
    var roadImageWidth = 500;
    var roadImageHeight = 600;
  
    this.trees = [];
  
    this.initialize = function (canvas) {
      this.canvas = canvas;
      this.canvas.style.backgroundColor = "green";
  
      this.x = canvas.width / 2 - roadImageWidth / 2;
      this.y = 0;
      this.y2 = -roadImageHeight;
  
      roadImage.src = "../static/scripts/games/highway_rider/sprites/scenario/road.jpg";
  
      this.createTrees();
    };
  
    this.drawRoad = function (context) {
      context.drawImage(
        roadImage,
        this.x,
        this.y,
        roadImageWidth,
        roadImageHeight
      );
      context.drawImage(
        roadImage,
        this.x,
        this.y2,
        roadImageWidth,
        roadImageHeight
      );
  
      if (this.isThereOil()) {
        this.oil.draw(context);
      }
  
      if (this.isTherePothole()) {
        this.pothole.draw(context);
      }
  
      for (var i = 0; i < this.trees.length; i++) {
        this.trees[i].draw(context);
      }
    };
  
    this.updateRoad = function (emptyLane) {
      this.y += 1;
      if (this.y >= roadImageHeight) {
        this.y = 0;
      }
  
      this.y2 += 1;
      if (this.y2 >= 0) {
        this.y2 = -roadImageHeight;
      }
  
      if (this.hasObstaclesOnRoad()) {
        this.updateObstacles();
      } else {
        this.tryPutAnObstacleOnRoad(emptyLane);
      }
  
      this.updateTrees();
    };
  
    this.updateObstacles = function () {
      if (this.isThereOil()) {
        this.oil.update(this.canvas.height);
      }
  
      if (this.isTherePothole()) {
        this.pothole.update(this.canvas.height);
      }
    };
  
    this.updateTrees = function () {
      for (var i = 0; i < this.trees.length; i++) {
        this.trees[i].update(this.canvas.height);
      }
    };
  
    this.tryPutAnObstacleOnRoad = function (emptyLane) {
      var newObstacleProbability = Math.random();
  
      if (newObstacleProbability < 0.002) {
        this.putAnObstacleOnRoad(emptyLane);
      }
    };
  
    this.putAnObstacleOnRoad = function (emptyLane) {
      var typeObstacleProbability = Math.random();
  
      if (typeObstacleProbability < 0.7) {
        this.createPothole(emptyLane);
      } else {
        this.createOil(emptyLane);
      }
    };
  
    this.createPothole = function (emptyLane) {
      if (!this.pothole) {
        this.pothole = new Obstacle();
      }
      this.pothole.initialize(emptyLane, GameConfig.obstacle.pothole);
    };
  
    this.createOil = function (emptyLane) {
      if (!this.oil) {
        this.oil = new Obstacle();
      }
      this.oil.initialize(emptyLane, GameConfig.obstacle.oil);
    };
  
    this.hasObstaclesOnRoad = function () {
      return this.isThereOil() || this.isTherePothole();
    };
  
    this.isThereOil = function () {
      return this.oil && this.oil.isOnRoad;
    };
  
    this.isTherePothole = function () {
      return this.pothole && this.pothole.isOnRoad;
    };
  
    this.createTrees = function () {
      var treePositionIndex = 0;
      var treeSide = 0;
      for (var i = 0; i < 10; i++) {
        this.trees[i] = new Tree();
        this.trees[i].initialize(treePositionIndex, treeSide);
  
        if (treePositionIndex > 3) {
          treePositionIndex = 0;
          treeSide = 1;
        } else {
          treePositionIndex++;
        }
      }
    };
  }

  
  //score.js
  function Score() {
    this.initialize = function () {
      this.highScore = 0;
      this.currentScore = 0;
      this.showScore = false;
      this.alpha = 0.0;
      this.alphaText = 0.0;
    };
  
    this.resetScore = function () {
      this.currentScore = 0;
      this.alpha = 0.0;
      this.alphaText = 0.0;
    };
  
    this.draw = function (context, pointsPar) {
      this.currentScore = pointsPar;
  
      Util.drawTextWithShadow(context, "SCORE", 660, 50, "white", 2, 2, "red");
      Util.drawTextWithShadow(
        context,
        this.currentScore,
        660,
        90,
        "yellow",
        2,
        2,
        "red"
      );
  
      Util.drawTextWithShadow(context, "HIGH", 660, 180, "white", 2, 2, "red");
      Util.drawTextWithShadow(context, "SCORE", 660, 210, "white", 2, 2, "red");
  
      Util.drawTextWithShadow(
        context,
        this.highScore,
        660,
        250,
        "yellow",
        2,
        2,
        "red"
      );
    };
  
    this.drawGameOverScreen = function (context) {
      context.save();
  
      // Show score slowly
      this.alpha = this.alpha >= 0.6 ? this.alpha : this.alpha + 0.01;
      context.globalAlpha = this.alpha;
      context.fillRect(0, 0, Game.canvasWidth, Game.canvasHeight);
  
      context.fillRect(150, 200, 500, Game.canvasHeight / 3);
  
      // Show score slowly
      this.alphaText = this.alphaText >= 1 ? 1 : this.alphaText + 0.01;
      context.globalAlpha = this.alphaText;
  
      context.font = "bold 50px Arial";
      Util.drawTextWithShadow(
        context,
        "GAME OVER",
        250,
        260,
        "red",
        2,
        2,
        "yellow"
      );
  
      context.font = "46px Arial";
      Util.drawTextWithShadow(context, "SCORE", 237, 320, "white", 2, 2, "red");
      Util.drawTextWithShadow(
        context,
        this.currentScore,
        410,
        320,
        "yellow",
        2,
        2,
        "red"
      );
  
      context.font = "30px Arial";
  
      Util.drawTextWithShadow(
        context,
        "HIGH SCORE",
        210,
        380,
        "white",
        2,
        2,
        "red"
      );
      Util.drawTextWithShadow(
        context,
        this.highScore,
        410,
        380,
        "yellow",
        2,
        2,
        "red"
      );
      Util.drawTextWithShadow(
        context,
        "PRESS ENTER TO PROCEED",
        200,
        450,
        "yellow",
        2,
        2,
        "red"
      );
  
      context.restore();
    };
  }

  
  //game.js

  var Game = {};
  var scenario = new Scenario();
  var player = new Car();
  var levelController = new LevelController();
  var traffic = new Traffic();
  var score = new Score();
  var totalPoints;
  var lastPoints;
  
  Game.canvasHeight = 600;
  Game.canvasWidth = 800;
  
  Game.initialFps = 100;
  Game.fps = Game.initialFps;
  Game.skipTicks = 1000 / Game.fps;
  
  var position = 0;
  var leftArrowKeyCode = 37;
  var rightArrowKeyCode = 39;
  
  var isGameOver = false;
  var gameStarted = false;
  
  var gameThemeSound = new Audio("../static/scripts/games/highway_rider/sounds/game_theme.mp3");
  var gameOverThemeSound = new Audio("../static/scripts/games/highway_rider/sounds/gameOver_theme.mp3");
  
  Game.initialize = function () {
    this.entities = [];
    this.canvas = document.getElementById("canvas");
    this.context = canvas.getContext("2d");
  
    // Defaulf Font
    this.context.font = "30px Arial";
  
    Game.showStartScreen();
  
    document.addEventListener(
      "keydown",
      function (event) {
        if (event.keyCode == leftArrowKeyCode) {
          player.moveToLeft();
        } else if (event.keyCode == rightArrowKeyCode) {
          player.moveToRight();
        }
  
        if (!gameStarted) {
            if(event.which== 13){
                fetch('/send_scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'earned_score':Number(score.currentScore),'total_score':10000})
                })
                .then(response => response.json())
                .then(data => {
                    
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });        
                window.location.href = '../display_score.html';
            }
            else{
                gameStarted = true;
                isGameOver = false;
                Game.startGame();
            }
          
        }
      },
      false
    );
  };
  
  Game.showStartScreen = function () {
    levelController.initialize(Game.fps);
    scenario.initialize(canvas);
    traffic.initialize(this.canvas, scenario);
    score.initialize();
    gameOverThemeSound.play();
  
    gameThemeSound.pause();
    gameThemeSound.currentTime = 0;
  };
  
  Game.startGame = function () {
    gameThemeSound.currentTime = 0;
    gameThemeSound.play();
  
    gameThemeSound.addEventListener(
      "ended",
      function () {
        this.currentTime = 2.5;
        this.play();
      },
      false
    );
  
    gameOverThemeSound.pause();
    gameOverThemeSound.currentTime = 0;
  
    totalPoints = 0;
    lastPoints = 0;
  
    Game.fps = Game.initialFps;
    Game.skipTicks = 1000 / Game.fps;
  
    levelController.initialize(Game.fps);
    player.initialize(
      GameConfig.player.yPosition,
      GameConfig.player.carType,
      GameConfig.player.carId
    );
    scenario.initialize(canvas);
    traffic.initialize(this.canvas, scenario, player);
    score.resetScore();
  };
  
  Game.gameOver = function () {
    isGameOver = true;
    gameStarted = false;
    gameThemeSound.pause();
    gameThemeSound.currentTime = 0;
    gameOverThemeSound.play();
  };
  
  Game.draw = function (points) {
    this.context.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);
  
    // Your code goes here
  
    scenario.drawRoad(this.context);
    traffic.draw(this.context);
  
    if (gameStarted) {
      player.drawCar(this.context);
      totalPoints = (lastPoints / 10).toFixed(0);
      score.draw(this.context, totalPoints);
    } else if (isGameOver) {
      score.currentPoints = totalPoints;
      score.highScore =
        score.currentPoints > score.highScore
          ? score.currentPoints
          : score.highScore;
      score.draw(this.context, totalPoints);
      score.drawGameOverScreen(this.context);
      Util.drawPressAnyKey(this.context);
    } else {
      Util.drawPressAnyKey(this.context);
      score.draw(this.context, 0);
    }
  
    if (GameConfig.debug.showGuideLines) {
      Util.drawGuidelines(this.context);
    }
  };
  
  Game.update = function () {
    // Your code goes here
  
    scenario.updateRoad(traffic.emptyLane);
    traffic.update(this.context);
  
    if (gameStarted) {
      player.update();
  
      if (player.passedOnPothole) {
        lastPoints = lastPoints - GameConfig.obstacle.pointsLossOnPothole;
        if (lastPoints < 0) {
          lastPoints = 0;
        }
        player.passedOnPothole = false;
      }
  
      Game.fps = levelController.increaseSpeed();
      lastPoints++;
    }
  };
   