var BT = window.BT || {};

BT.Game = function() {
  var silverShip, blackShip, exitMenuItem, playMenuItem;
  var renderer = new BT.Renderer();
  var stage;

  var sceneWidth = window.innerWidth;
  var sceneHeight = window.innerHeight;

  var setUpInitialScene = function() {
    var versus = new BT.Renderable(BT.Resources.sprite.versus, 27, {
      x: sceneWidth / 2, y: sceneHeight / 2, width: 64, height: 84
    });
    var silverShipDemo = new BT.Renderable(BT.Resources.sprite.silverShipDemo, 0, {
      x: sceneWidth / 3, y: sceneHeight / 2, width: 64, height: 64, scale: 2
    });
    var blackShipDemo = new BT.Renderable(BT.Resources.sprite.blackShipDemo, 0, {
      x: sceneWidth * 2 / 3, y: sceneHeight / 2, width: 80, height: 68, scale: 2
    });
    versus.startAnimation(3, false, true);
    silverShipDemo.startAnimation(3, false, true);
    blackShipDemo.startAnimation(3, false, true);
    renderer.clearScene();
    renderer.setBackground(null);
    renderer.add(versus);
    renderer.add(silverShipDemo);
    renderer.add(blackShipDemo);
  };
  var setUpMatchScene = function() {
    silverShip = new BT.Ship(renderer, 1);
    blackShip = new BT.Ship(renderer, 2);
    silverShip.deploy(sceneWidth / 3, sceneHeight / 2, -90);
    blackShip.deploy(sceneWidth * 2 / 3, sceneHeight / 2, 90);
    renderer.clearScene();
    renderer.setBackground(null);
    renderer.add(silverShip);
    renderer.add(blackShip);
    BT.MainKeyboardShipController.assign(silverShip);
    BT.SecondaryKeyboardShipController.assign(blackShip);
  };
  var setUpGameOverScene = function() {
    renderer.clearScene();
    if (silverShip.lives === 0 && blackShip.lives === 0) {
      renderer.setBackground(BT.Resources.sprite.draw);
    } else {
      renderer.setBackground(BT.Resources.sprite.winner);
      var ship;
      if (silverShip.lives === 0) {
        ship = new BT.Renderable(BT.Resources.sprite.silverShipDemo, 0, {
          x: sceneWidth / 2, y: sceneHeight / 2 + 100, width: 64, height: 64, scale: 3
        });
      } else {
        ship = new BT.Renderable(BT.Resources.sprite.blackShipDemo, 0, {
          x: sceneWidth / 2, y: sceneHeight / 2 + 100, width: 80, height: 68, scale: 3
        });
      }
      renderer.add(ship);
      ship.startAnimation(4, false, true);
    }
  };

  var intro = function() {
    if (BT.Keyboard.read(BT.Keys.ENTER)) {
      BT.Keyboard.flush();
      setUpMatchScene();
      stage = match;
    }
  };
  var menu = function() {
    var selectedItem = 1;
    if (BT.Keyboard.read(BT.Keys.UP)) {
      playMenuItem.setFrame(0);
      exitMenuItem.setFrame(1);
      selectedItem = 1;
    }
    if (BT.Keyboard.read(BT.Keys.DOWN)) {
      playMenuItem.setFrame(1);
      exitMenuItem.setFrame(0);
      selectedItem = 2;
    }
    if (BT.Keyboard.read(BT.Keys.ENTER)) {
      BT.Keyboard.flush();
      if (selectedItem == 1) {
        setUpMatchScene();
        stage = match;
      }
    }
  };
  var match = function() {
    if (silverShip.lives === 0 || blackShip.lives === 0) {
      setUpGameOverScene();
      stage = gameOver;
    }
  };
  var gameOver = function() {
    if (BT.Keyboard.read(BT.Keys.ENTER)) {
      BT.Keyboard.flush();
      setUpInitialScene();
      stage = menu;
    }
  };
  var init = function() {
    renderer.init();
    setUpInitialScene();
    stage = intro;
    setInterval(function() {
      stage();
    }, 10);
  };
  init();
};

var BT = window.BT || {};

BT.KeyboardShipController = function() {
  var _this = this;
  this.assign = function(ship) {
    var keyAssignments = _this.getKeyAssignments(ship);
    for (var i = 0; i < keyAssignments.length; i++) {
      BT.Keyboard.onKeyDown(keyAssignments[i].key, keyAssignments[i].down);
      BT.Keyboard.onKeyUp(keyAssignments[i].key, keyAssignments[i].up);
    }
  };
};

BT.MainKeyboardShipController = new function() {
  BT.KeyboardShipController.apply(this, arguments);
  this.getKeyAssignments = function(ship) {
    return [
      {
        key: BT.Keys.W, down: ship.turnEngineOn, up: ship.turnEngineOff
      }, {
        key: BT.Keys.A, down: ship.turnLeftBearingOn, up: ship.turnLeftBearingOff
      }, {
        key: BT.Keys.D, down: ship.turnRightBearingOn, up: ship.turnRightBearingOff
      }, {
        key: BT.Keys.Q, down: ship.turnCannonOn, up: ship.turnCannonOff
      }
    ];
  }
};

BT.SecondaryKeyboardShipController = new function() {
  BT.KeyboardShipController.apply(this, arguments);
  this.getKeyAssignments = function(ship) {
    return [
      {
        key: BT.Keys.UP, down: ship.turnEngineOn, up: ship.turnEngineOff
      }, {
        key: BT.Keys.LEFT, down: ship.turnLeftBearingOn, up: ship.turnLeftBearingOff
      }, {
        key: BT.Keys.RIGHT, down: ship.turnRightBearingOn, up: ship.turnRightBearingOff
      }, {
        key: BT.Keys.RSHIFT, down: ship.turnCannonOn, up: ship.turnCannonOff
      }
    ];
  }
};

BT.Keyboard = function() {
  var keys = {};
  var handlersDown = {};
  var handlersUp = {};

  window.onkeydown = function(e) {
    if (handlersDown[e.keyCode] && !keys[e.keyCode]) {
      handlersDown[e.keyCode]();
    }
    keys[e.keyCode] = true;
  };
  window.onkeyup = function(e) {
    if (handlersUp[e.keyCode] && keys[e.keyCode]) {
      handlersUp[e.keyCode]();
    }
    keys[e.keyCode] = false;
  };

  this.read = function(key) {
    return keys[key];
  };
  this.flush = function() {
    keys = {};
  };
  this.onKeyDown = function(key, callback) {
    handlersDown[key] = callback;
  };
  this.onKeyUp = function(key, callback) {
    handlersUp[key] = callback;
  };
};
BT.Keyboard = new BT.Keyboard();

BT.Keys = {
  UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, ENTER: 13, RSHIFT: 16, Q: 81, W: 87, A: 65, D: 68
};

var BT = window.BT || {};

BT.SpaceObject = function(state) {
  var _this = this;
  var _friction = 0.01;
  state.acceleration = 0;

  this.calculate = function() {
    var cosT = Math.cos(Math.PI * (state.angle - 90) / 180);
    var sinT = Math.sin(Math.PI * (state.angle - 90) / 180);
    if (!state.speedx) {
      state.speedx = state.speed * cosT;
    }
    if (!state.speedy) {
      state.speedy = state.speed * sinT;
    }
    state.speedx += state.acceleration * cosT - _friction * state.speedx;
    state.speedy += state.acceleration * sinT - _friction * state.speedy;
    state.x += state.speedx;
    state.y += state.speedy;
    state.angle += state.angularSpeed;
    if (_this.notifyAfterCalculation) {
      _this.notifyAfterCalculation();
    }
  };

  this.isCollisioning = function(o) {
    var tolerance = 0.35;
    var x1 = state.width * tolerance;
    var y1 = state.height * tolerance;
    var x2 = o.getState().width * tolerance;
    var y2 = o.getState().height * tolerance;
    return state.x + x1 > o.getState().x - x2 && state.x - x1 < o.getState().x + x2 &&
      state.y + y1 > o.getState().y - y2 && state.y - y1 < o.getState().y + y2;
  };

  this.getState = function() {
    return state;
  };

  setInterval(_this.calculate, 10);
};

BT.Renderable = function(image, initialFrame, state, unbound) {
  var _this = this;
  var _animation = {
    id: null,
    tick: 0,
    interval: 1,
    reverse: false,
    loop: false,
    frame: initialFrame,
    numberOfFrames: image.height / state.height,
    callback: function() {}
  };

  this.state = state;

  var updateAnimation = function() {
    _animation.tick++;
    if (_animation.tick % _animation.interval === 0) {
      _animation.reverse ? _animation.frame++ : _animation.frame--;
      if (_animation.frame < 0) {
        _animation.frame = _animation.loop ? _animation.numberOfFrames - 1 : 0;
        _animation.callback();
      }
      if (_animation.frame >= _animation.numberOfFrames) {
        _animation.frame = _animation.loop ? 0 : _animation.numberOfFrames - 1;
        _animation.callback();
      }
    }
  };

  this.notifyRemoved = function() {
    _this.stopAnimation();
  };

  this.setFrame = function(newFrame) {
    if (newFrame >= 0 && newFrame < _animation.numberOfFrames) {
      _animation.frame = newFrame;
    }
  };

  this.startAnimation = function(interval, reverse, loop, callback) {
    _animation.reverse = reverse;
    _animation.loop = loop;
    _animation.interval = interval || _animation.interval;
    _animation.callback = callback || _animation.callback;
    if (!_animation.id) {
      _animation.id = setInterval(updateAnimation, 10);
    }
  };

  this.stopAnimation = function() {
    clearInterval(_animation.id);
    _animation.id = null;
  };

  var draw = function(context, x, y, angle, scale) {
    context.translate(x, y);
    context.rotate(angle);
    context.drawImage(image.node, image.x,
      image.y + state.height * (_animation.numberOfFrames - 1 - _animation.frame), state.width,
      state.height, -state.width * scale / 2, -state.height * scale / 2, state.width * scale,
      state.height * scale);
    context.rotate(-angle);
    context.translate(-x, -y);
  };

  this.draw = function(context) {
    var angle = Math.PI * state.angle / 180;
    var x = state.x;
    var y = state.y;
    var scale = state.scale || 1;

    draw(context, x, y, angle, scale);
    if (unbound) {
      draw(context, x + context.canvas.width, y, angle, scale);
      draw(context, x - context.canvas.width, y, angle, scale);
      draw(context, x, y + context.canvas.height, angle, scale);
      draw(context, x, y - context.canvas.height, angle, scale);
    }
  };

  this.nextFrame = function() {
    _this.setFrame(_animation.frame + 1);
  };

  this.previousFrame = function() {
    _this.setFrame(_animation.frame - 1);
  };

  this.nextFrameTo = function(frame) {
    if (frame > _animation.frame) {
      _this.nextFrame();
    }
    if (frame < _animation.frame) {
      _this.previousFrame();
    }
  };
};

var BT = window.BT || {};

BT.Renderer = function() {
  var _this = this;
  var canvas;
  var context;
  var fps;
  var frameTime = [];
  var video;
  var background;
  var scene = {};
  var _elementID = 0;

  this.width = window.innerWidth;
  this.height = window.innerHeight;

  var writeFps = function() {
    frameTime.push(new Date());
    if (!fps) {
      fps = document.createElement("div");
      fps.style.position = "absolute";
      fps.style.color = "green";
      fps.style.top = 0;
      fps.style.left = 0;
      document.body.appendChild(fps);
    }
    fps.innerHTML =
      (1000 * frameTime.length / (frameTime[frameTime.length - 1] - frameTime[0])).toFixed(2) +
      "FPS";
    if (frameTime.length >= 50) {
      frameTime.shift();
    }
  };

  this.init = function() {
    canvas = window.document.createElement("canvas");
    canvas.className = "gameplay";
    window.document.body.insertBefore(canvas, window.document.body.firstChild);
    canvas.width = _this.width;
    canvas.height = _this.height;
    context = canvas.getContext("2d");
    video = context.createImageData(_this.width, _this.height);
    setInterval(renderFrame, 20);
  };

  var renderFrame = function() {
    detectCollisions();
    writeFps();
    if (background) {
      context.drawImage(background.node, background.x, background.y, background.width,
        background.height, 0, 0, _this.width, _this.height);
    } else {
      context.clearRect(0, 0, _this.width, _this.height);
    }
    var sortedRenderables = [];
    for (var renderable in scene) {
      if (scene.hasOwnProperty(renderable)) {
        sortedRenderables.push(scene[renderable]);
      }
    }
    sortedRenderables.sort(function(a, b) {
      if (a.getState && b.getState) {
        return a.getState().z - b.getState().z;
      } else {
        return 0;
      }
    });
    for (var i = 0; i < sortedRenderables.length; i++) {
      sortedRenderables[i].draw(context);
    }
  };

  var detectCollisions = function() {
    for (var a in scene) {
      if (scene.hasOwnProperty(a)) {
        for (var b in scene) {
          if (scene.hasOwnProperty(b)) {
            if (a != b && scene[a].isCollisioning && scene[b].isCollisioning) {
              if (scene[a].isCollisioning(scene[b])) {
                a = scene[a];
                b = scene[b];
                if (a.notifyCollision) {
                  a.notifyCollision(b);
                }
                if (b.notifyCollision) {
                  b.notifyCollision(a);
                }
                return;
              }
            }
          }
        }
      }
    }
  };

  this.setBackground = function(image) {
    background = image;
  };

  this.add = function(renderable) {
    renderable.id = "renderable" + _elementID++;
    scene[renderable.id] = renderable;
  };

  this.remove = function(renderable) {
    delete scene[renderable.id];
    if (renderable.notifyRemoved) {
      renderable.notifyRemoved();
    }
  };

  this.clearScene = function() {
    for (var renderable in scene) {
      if (scene.hasOwnProperty(renderable) && scene[renderable].notifyRemoved) {
        scene[renderable].notifyRemoved();
      }
    }
    scene = {};
  };
};

var BT = window.BT || {};

BT.Resources = new function() {
  var _this = this;
  var progressBar;
  var image = new Image();
  var imageLoaded = false;
  var request;

  this.sprite = null;

  var onResourcesLoaded = function() {
    new BT.Game();
  };

  var init = function() {
    request = new XMLHttpRequest();
    request.onloadstart = showProgressBar;
    request.onprogress = updateProgressBar;
    request.onload = onLoad;
    request.open("GET", "img/sprite.png", true);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.send(null);
  };

  var showProgressBar = function() {
    progressBar = document.createElement("progress");
    progressBar.value = 0;
    progressBar.max = 100;
    progressBar.removeAttribute("value");
    document.body.appendChild(progressBar);
  };

  var updateProgressBar = function(e) {
    if (e.lengthComputable) {
      progressBar.value = e.loaded / e.total * 100;
    } else {
      progressBar.removeAttribute("value");
    }
  };

  var onLoad = function() {
    document.body.removeChild(progressBar);
    image.onload = function() {
      imageLoaded = true;
      if (_this.sprite && onResourcesLoaded) {
        onResourcesLoaded();
        onResourcesLoaded = null;
      }
    };
    image.src = "data:image/jpeg;base64," + BT.Utility.base64Encode(request.responseText);
  };

  this.setSpriteData = function(data) {
    for (var sprite in data) {
      if (data.hasOwnProperty(sprite)) {
        data[sprite].node = image;
      }
    }
    _this.sprite = data;
    if (imageLoaded && onResourcesLoaded) {
      onResourcesLoaded();
      onResourcesLoaded = null;
    }
  };

  init();
};

var BT = window.BT || {};

BT.Laser = function(world, type) {
  var _this = this;
  var _renderable;

  this.draw = function() {
    return _renderable.draw.apply(_renderable, arguments);
  };
  this.deploy = function(x, y, angle) {
    var image = type == 1 ? BT.Resources.sprite.rocket : BT.Resources.sprite.laser;
    _renderable = new BT.Renderable(image, 0, {
      width: 40, height: 40, x: x, y: y, angle: angle, z: 0, speed: 20, angularSpeed: 0
    });
    BT.SpaceObject.apply(this, [_renderable.state]);
  };
  this.notifyAfterCalculation = function() {
    if (_renderable.state.y < -_renderable.state.height ||
      _renderable.state.y > world.height + _renderable.state.height ||
      _renderable.state.x < -_renderable.state.width ||
      _renderable.state.x > world.width + _renderable.state.width) {
      world.remove(_this);
    }
  };
  this.notifyCollision = function(/*target*/) {
    //if(target.shipID != _this.ownerID)
    //  world.remove(_this);
  };
};

BT.Ship = function(world, type) {
  var _this = this;
  var _renderable;
  var _acceleration = 0.1;
  var _maxAngularSpeed = 5;
  var _deployState = {x: 0, y: 0, angle: 0, z: 1, speed: 0, angularSpeed: 0};
  var _firePeriod = 150;
  var _cannonTimerID;
  var _disabled = false;
  var _screenBound = false;

  this.lives = 6;
  this.shipID = "ship" + BT.Ship.nextID++;

  setInterval(function() {
    if (!_disabled) {
      _renderable.nextFrameTo(10);
    }
  }, 20);

  var disable = function() {
    _this.turnCannonOff();
    _disabled = true;
  };

  this.rotate = function(alpha) {
    _renderable.state.angle += alpha;
  };

  this.turnEngineOn = function() {
    if (!_disabled) {
      _renderable.state.acceleration = _acceleration;
    }
  };

  this.turnEngineOff = function() {
    if (!_disabled) {
      _renderable.state.acceleration = 0;
    }
  };

  this.turnRightBearingOn = function() {
    if (!_disabled) {
      _renderable.state.angularSpeed = _maxAngularSpeed;
      _renderable.startAnimation(1, false, false);
    }
  };

  this.turnRightBearingOff = function() {
    if (!_disabled) {
      _renderable.state.angularSpeed = 0;
      _renderable.stopAnimation();
    }
  };

  this.turnLeftBearingOn = function() {
    if (!_disabled) {
      _renderable.state.angularSpeed = -_maxAngularSpeed;
      _renderable.startAnimation(1, true, false);
    }
  };

  this.turnLeftBearingOff = function() {
    if (!_disabled) {
      _renderable.state.angularSpeed = 0;
      _renderable.stopAnimation();
    }
  };

  this.turnCannonOn = function() {
    if (!_disabled) {
      var fire = function() {
        var laser = new BT.Laser(world, type);
        laser.ownerID = _this.shipID;
        laser.deploy(_renderable.state.x, _renderable.state.y, _renderable.state.angle);
        world.add(laser);
      };
      fire();
      _cannonTimerID = setInterval(fire, _firePeriod);
    }
  };

  this.turnCannonOff = function() {
    clearInterval(_cannonTimerID);
  };

  this.notifyAfterCalculation = function() {
    var state = _renderable.state;
    if (_screenBound) {
      var margin = 0;
      if (state.x + state.width * 0.5 > world.width - margin) {
        state.x = world.width - margin - state.width * 0.5;
      }
      if (state.x - state.width * 0.5 < margin) {
        state.x = margin + state.width * 0.5;
      }
      if (state.y + state.height * 0.5 > world.height - margin) {
        state.y = world.height - margin - state.height * 0.5;
      }
      if (state.y - state.height * 0.5 < margin) {
        state.y = margin + state.height * 0.5;
      }
    } else {
      state.x = state.x > 0 ? state.x % world.width : state.x + world.width;
      state.y = state.y > 0 ? state.y % world.height : state.y + world.height;
    }
  };

  this.deploy = function(x, y, angle) {
    var image;
    _deployState.x = x || _deployState.x;
    _deployState.y = y || _deployState.y;
    _deployState.angle = angle || _deployState.angle;
    _disabled = false;
    switch (type) {
      case 1:
        _deployState.width = 44;
        _deployState.height = 56;
        image = BT.Resources.sprite.blackShip;
        break;
      case 2:
        _deployState.width = 64;
        _deployState.height = 52;
        image = BT.Resources.sprite.silverShip;
        break;
    }
    _renderable = new BT.Renderable(image, 10, JSON.parse(JSON.stringify(_deployState)), true);
    BT.SpaceObject.apply(this, [_renderable.state]);
  };

  this.notifyCollision = function(target) {
    if (!_disabled && target.ownerID != _this.shipID) {
      _this.destroy();
    }
  };

  this.destroy = function() {
    _this.lives--;
    _this.turnCannonOff();
    disable();
    switch (type) {
      case 1:
        _renderable = new BT.Renderable(BT.Resources.sprite.blueExplosion, 12, {
          x: _renderable.state.x, y: _renderable.state.y, width: 84, height: 84
        }, true);
        break;
      case 2:
        _renderable = new BT.Renderable(BT.Resources.sprite.explosion, 17, {
          x: _renderable.state.x, y: _renderable.state.y, width: 64, height: 64
        }, true);
        break;
    }
    _renderable.startAnimation(2, false, false, function() {
      _renderable.stopAnimation();
      if (_this.lives !== 0) {
        _this.deploy();
      }
    });
  };

  this.notifyRemoved = function() {
    disable();
  };

  this.draw = function() {
    return _renderable.draw.apply(_renderable, arguments);
  };
};
BT.Ship.nextID = 0;

var BT = window.BT || {};

BT.Resources.setSpriteData({
  blackShipDemo: {x: 0, y: 0, width: 80, height: 2108},
  silverShipDemo: {x: 80, y: 0, width: 64, height: 1984},
  versus: {x: 144, y: 0, width: 64, height: 2352},
  blackShip: {x: 208, y: 0, width: 44, height: 1176},
  silverShip: {x: 252, y: 0, width: 64, height: 1092},
  explosion: {x: 316, y: 0, width: 64, height: 1152},
  blueExplosion: {x: 380, y: 0, width: 84, height: 1008},
  rocket: {x: 464, y: 0, width: 40, height: 40},
  laser: {x: 504, y: 0, width: 40, height: 40},
  draw: {x: 544, y: 0, width: 640, height: 480},
  winner: {x: 1184, y: 0, width: 640, height: 480}
});

var BT = window.BT || {};

BT.Utility = new function() {
  // This encoding function is from Philippe Tenenhaus's example at http://www.philten.com/us-xmlhttprequest-image/
  this.base64Encode = function(inputStr) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var outputStr = "";
    var i = 0;
    while (i < inputStr.length) {
      //all three "& 0xff" added below are there to fix a known bug
      //with bytes returned by xhr.responseText
      var byte1 = inputStr.charCodeAt(i++) & 0xff;
      var byte2 = inputStr.charCodeAt(i++) & 0xff;
      var byte3 = inputStr.charCodeAt(i++) & 0xff;
      var enc1 = byte1 >> 2;
      var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);

      var enc3, enc4;
      if (isNaN(byte2)) {
        enc3 = enc4 = 64;
      } else {
        enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
        if (isNaN(byte3)) {
          enc4 = 64;
        } else {
          enc4 = byte3 & 63;
        }
      }
      outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
    }
    return outputStr;
  }
};
