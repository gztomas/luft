var BT = window.BT || {};

BT.SpaceObject = function(state) {
	var _this = this;
	var _friction = 0.01;
	state.acceleration = 0;

	this.calculate = function() {
		var cosT = Math.cos(Math.PI * (state.angle - 90) / 180);
		var sinT = Math.sin(Math.PI * (state.angle - 90) / 180);
		state.speed += state.acceleration - _friction * state.speed;
		state.x += cosT * state.speed;
		state.y += sinT * state.speed;
		state.angle += state.angularSpeed;
		if(_this.notifyAfterCalculation)
			_this.notifyAfterCalculation();
	};

	this.isCollisioning = function (o) {
		var tolerance = 0.35;
		var x1 = state.width * tolerance;
		var y1 = state.height * tolerance;
		var x2 = o.getState().width * tolerance;
		var y2 = o.getState().height * tolerance;
		return	state.x + x1 > o.getState().x - x2 &&
				state.x - x1 < o.getState().x + x2 &&
				state.y + y1 > o.getState().y - y2 &&
				state.y - y1 < o.getState().y + y2;
	};

	this.getState = function() {
		return state;
	};

	setInterval(_this.calculate, 10);
};

BT.Renderable = function(image, initialFrame, state) {
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
		if(_animation.tick % _animation.interval === 0) {
			_animation.reverse ? _animation.frame++ : _animation.frame--;
			if(_animation.frame < 0) {
				_animation.frame = _animation.loop ? _animation.numberOfFrames - 1 : 0;
				_animation.callback();
			}
			if(_animation.frame >= _animation.numberOfFrames) {
				_animation.frame = _animation.loop ? 0 : _animation.numberOfFrames - 1;
				_animation.callback();
			}
		}
	};

	this.notifyRemoved = function() {
		_this.stopAnimation();
	};

	this.setFrame = function (newFrame) {
		if(newFrame >= 0 && newFrame < _animation.numberOfFrames)
			_animation.frame = newFrame;
	};

	this.startAnimation = function(interval, reverse, loop, callback) {
		_animation.reverse = reverse;
		_animation.loop = loop;
		_animation.interval = interval || _animation.interval;
		_animation.callback = callback || _animation.callback;
		if(!_animation.id)
			_animation.id = setInterval(updateAnimation, 10);
	};

	this.stopAnimation = function() {
		clearInterval(_animation.id);
		_animation.id = null;
	};

	this.draw = function (context) {
		var angle = Math.PI * state.angle / 180;
		var x = state.x;
		var y = state.y;
		context.translate(x, y);
		context.rotate(angle);
		context.drawImage(
			image.node,
			image.x,
			image.y + state.height * (_animation.numberOfFrames - 1 - _animation.frame),
			state.width,
			state.height,
			-state.width / 2,
			-state.height / 2,
			state.width,
			state.height
		);
		context.rotate(-angle);
		context.translate(-x, -y);
	};

	this.nextFrame = function() {
		_this.setFrame(_animation.frame + 1);
	};

	this.previousFrame = function() {
		_this.setFrame(_animation.frame - 1);
	};

	this.nextFrameTo = function(frame) {
		if(frame > _animation.frame)
			_this.nextFrame();
		if(frame < _animation.frame)
			_this.previousFrame();
	};
};