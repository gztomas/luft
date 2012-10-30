//Definiciones de codigos de teclado
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_ENTER = 13;
var KEY_RSHIFT = 16;
var KEY_Q = 81;
var KEY_W = 87;
var KEY_A = 65;
var KEY_D = 68;

window.Keyboard = new function() {
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