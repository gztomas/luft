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
    return state.x + x1 > o.getState().x - x2 &&
      state.x - x1 < o.getState().x + x2 &&
      state.y + y1 > o.getState().y - y2 &&
      state.y - y1 < o.getState().y + y2;
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
    context.drawImage(
      image.node,
      image.x,
      image.y + state.height * (_animation.numberOfFrames - 1 - _animation.frame),
      state.width,
      state.height,
      -state.width * scale / 2,
      -state.height * scale / 2,
      state.width * scale,
      state.height * scale
    );
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
