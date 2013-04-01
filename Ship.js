var BT = window.BT || {};

BT.Laser = function(world, type) {
	var _this = this;
	var _renderable;

	this.draw = function() {
		return _renderable.draw.apply(_renderable, arguments);
	};
	this.deploy = function(x, y, angle) {
		var image = type == 1 ? BT.Resources.sprites.rocket : BT.Resources.sprites.laser;
		_renderable = new BT.Renderable(image, 0, {
			width: 40, height: 40, x: x, y: y, angle: angle, z: 0, speed: 20, angularSpeed: 0
		});
		BT.SpaceObject.apply(this, [_renderable.state]);
	};
	this.notifyAfterCalculation = function() {
		if(	_renderable.state.y < -_renderable.state.height ||
			_renderable.state.y > world.height + _renderable.state.height ||
			_renderable.state.x < -_renderable.state.width ||
			_renderable.state.x > world.width + _renderable.state.width) {
			world.remove(_this);
		}
	};
	this.notifyCollision = function(target) {
		//if(target.shipID != _this.ownerID)
		//	world.remove(_this);
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
	var _screeenBound = false;

	this.lives = 6;
	this.shipID = "ship" + BT.Ship.nextID++;

	setInterval(function() {
		if(!_disabled)
			_renderable.nextFrameTo(10);
	}, 20);

	var disable = function() {
		_this.turnCannonOff();
		_disabled = true;
	};

	this.rotate = function (alpha) {
		_renderable.state.angle += alpha;
	};

	this.turnEngineOn = function() {
		if(!_disabled)
			_renderable.state.acceleration = _acceleration;
	};

	this.turnEngineOff = function() {
		if(!_disabled)
			_renderable.state.acceleration = 0;
	};

	this.turnRightBearingOn = function() {
		if(!_disabled) {
			_renderable.state.angularSpeed = _maxAngularSpeed;
			_renderable.startAnimation(1, false, false);
		}
	};

	this.turnRightBearingOff = function() {
		if(!_disabled) {
			_renderable.state.angularSpeed = 0;
			_renderable.stopAnimation();
		}
	};

	this.turnLeftBearingOn = function() {
		if(!_disabled) {
			_renderable.state.angularSpeed = -_maxAngularSpeed;
			_renderable.startAnimation(1, true, false);
		}
	};

	this.turnLeftBearingOff = function() {
		if(!_disabled) {
			_renderable.state.angularSpeed = 0;
			_renderable.stopAnimation();
		}
	};

	this.turnCannonOn = function() {
		if(!_disabled) {
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
		if(_screeenBound) {
			var margin = 0;
			if(state.x + state.width * 0.5 > world.width - margin)
				state.x = world.width - margin - state.width * 0.5;
			if(state.x - state.width * 0.5 < margin)
				state.x = margin + state.width * 0.5;
			if(state.y + state.height * 0.5 > world.height - margin)
				state.y = world.height - margin - state.height * 0.5;
			if(state.y - state.height * 0.5 < margin)
				state.y = margin + state.height * 0.5;
		}
		else {
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
		switch(type) {
			case 1: _deployState.width = 44; _deployState.height = 56; image = BT.Resources.sprites.blackShip; break;
			case 2: _deployState.width = 64; _deployState.height = 52; image = BT.Resources.sprites.silverShip; break;
		}
		_renderable = new BT.Renderable(image, 10, JSON.parse(JSON.stringify(_deployState)), true);
		BT.SpaceObject.apply(this, [_renderable.state]);
	};

	this.notifyCollision = function(target) {
		if(!_disabled && target.ownerID != _this.shipID)
			_this.destroy();
	};

	this.destroy = function() {
		_this.lives--;
		_this.turnCannonOff();
		disable();
		_renderable = new BT.Renderable(BT.Resources.sprites.explosion, 17, {x: _renderable.state.x, y: _renderable.state.y, width: 64, height: 64}, true);
		_renderable.startAnimation(2, false, false, function() {
			_renderable.stopAnimation();
			if(_this.lives !== 0) {
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