var BT = window.BT || {};

BT.Keyboard = function() {
	var keys = {};

	window.onkeydown = function(e) {
		keys[e.keyCode] = true;
	};

	window.onkeyup = function(e) {
		keys[e.keyCode] = false;
	};

	this.read = function(tecla) {
		return keys[tecla];
	};

	this.flush = function() {
		keys = {};
	};
};
BT.Keyboard = new BT.Keyboard();

BT.Keys = {
	UP : 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	ENTER: 13,
	RSHIFT: 16,
	Q: 81,
	W: 87,
	A: 65,
	D: 68	
};