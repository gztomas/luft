'use strict';

export function KeyboardShipController() {
  var _this = this;
  this.assign = function(ship) {
    var keyAssignments = _this.getKeyAssignments(ship);
    for (var i = 0; i < keyAssignments.length; i++) {
      Keyboard.onKeyDown(keyAssignments[i].key, keyAssignments[i].down);
      Keyboard.onKeyUp(keyAssignments[i].key, keyAssignments[i].up);
    }
  };
}

export var MainKeyboardShipController = new function() {
  KeyboardShipController.apply(this, arguments);
  this.getKeyAssignments = function(ship) {
    return [
      {
        key: Keys.W, down: ship.turnEngineOn, up: ship.turnEngineOff
      }, {
        key: Keys.A, down: ship.turnLeftBearingOn, up: ship.turnLeftBearingOff
      }, {
        key: Keys.D, down: ship.turnRightBearingOn, up: ship.turnRightBearingOff
      }, {
        key: Keys.Q, down: ship.turnCannonOn, up: ship.turnCannonOff
      }
    ];
  }
};

export var SecondaryKeyboardShipController = new function() {
  KeyboardShipController.apply(this, arguments);
  this.getKeyAssignments = function(ship) {
    return [
      {
        key: Keys.UP, down: ship.turnEngineOn, up: ship.turnEngineOff
      }, {
        key: Keys.LEFT, down: ship.turnLeftBearingOn, up: ship.turnLeftBearingOff
      }, {
        key: Keys.RIGHT, down: ship.turnRightBearingOn, up: ship.turnRightBearingOff
      }, {
        key: Keys.RSHIFT, down: ship.turnCannonOn, up: ship.turnCannonOff
      }
    ];
  }
};

export var Keyboard = new function() {
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

export var Keys = {
  UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, ENTER: 13, RSHIFT: 16, Q: 81, W: 87, A: 65, D: 68
};
