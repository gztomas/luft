var BT = window.BT || {};

BT.Renderer = function () {
	var _this = this;
	var canvas;
	var context;
	var fps;
	var frameTime = [];
	var video;
	var background;
	var scene = {};

	var writeFps = function() {
		frameTime.push(new Date());
		if(!fps) {
			fps = document.createElement("div");
			fps.style.position = "absolute";
			fps.style.color = "green";
			fps.style.top = 0;
			fps.style.left = 0;
			document.body.appendChild(fps);
		}
		fps.innerHTML = (1000 * frameTime.length / (frameTime[frameTime.length - 1] - frameTime[0])).toFixed(2) + "FPS";
		if(frameTime.length >= 50)
			frameTime.shift();
	};

	var indice;
	var BUFFER = function () {
		this.x = 0;
		this.y = 0;
		this.ancho = 0;
		this.alto = 0;
		this.direccion = 0;
	};

	this.init = function() {
		canvas = window.document.createElement("canvas");
		canvas.style.width = "640px";
		canvas.style.height = "480px";
		canvas.style.marginLeft = 'auto';
		canvas.style.marginRight = 'auto';
		canvas.style.marginTop = 'auto';
		canvas.style.marginBottom = 'auto';
		window.document.body.insertBefore(canvas, window.document.body.firstChild);
		canvas.width = 640;
		canvas.height = 480;
		context = canvas.getContext("2d");
		video = context.createImageData(640, 480);
		setInterval(renderFrame, 20);
	};

	this.setPixel = function (x, y, r, g, b, a) {
		video.data[x * 4 + y * 4 * 640 + 0] = r;
		video.data[x * 4 + y * 4 * 640 + 1] = g;
		video.data[x * 4 + y * 4 * 640 + 2] = b;
		video.data[x * 4 + y * 4 * 640 + 3] = a;
	};

	this.getPixel = function (x, y) {
		return {
			r:video.data[x * 4 + y * 640 * 4 + 0],
			g:video.data[x * 4 + y * 640 * 4 + 1],
			b:video.data[x * 4 + y * 640 * 4 + 2],
			a:video.data[x * 4 + y * 640 * 4 + 3]
		};
	};

	var renderFrame = function () {
		writeFps();
		context.drawImage(background, 0, 0);
		//context.putImageData(video, 0, 0);
		for(var renderable in scene) {
			if(scene.hasOwnProperty(renderable))
				scene[renderable].draw(_this);
		}
	};

	this.setBackground = function(archivo) {
		background = archivo.node;
	};
};