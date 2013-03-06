var BT = window.BT || {};

BT.Renderer = function () {
	var _this = this;
	var canvas;
	var context;
	var fps;
	var frameTime = [];
	var video;

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
	var borradorpag = [];
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

	this.renderFrame = function () {
		writeFps();
		context.putImageData(video, 0, 0);
		_this.clear(); // Borra los objetos y restaura los fondos pisados
	};

	this.clear = function () {
		var i, x, y;
		for (i = (indice - 1); i >= 0; i--) {
			var borrador = borradorpag[i];
			for (y = 0; y < borrador.alto; y++)
				for (x = 0; x < borrador.ancho; x++) {
					var offset = x * 4 + y * 4 * borrador.ancho;
					_this.setPixel(x + borrador.x, y + borrador.y,
						borrador.direccion[offset + 0],
						borrador.direccion[offset + 1],
						borrador.direccion[offset + 2],
						borrador.direccion[offset + 3]
					);
				}
		}
		indice = 0;
	};

	this.backup = function(ancho, alto, X, Y) {
		var x, y, i;
		i = indice;
		if(!borradorpag[i])
			borradorpag[i] = new BUFFER();
		borradorpag[i].direccion = new Uint8Array(ancho * alto * 4);
		borradorpag[i].x = X;
		borradorpag[i].y = Y;
		borradorpag[i].ancho = ancho;
		borradorpag[i].alto = alto;
		for(y = 0; y < alto; y++) {
			var lineOffset = y * 4 * ancho;
			for(x = 0; x < ancho; x++) {
				var pixelOffset = x * 4 + lineOffset;
				var sourceX = x + X;
				var sourceY = y + Y;
				borradorpag[i].direccion[pixelOffset + 0] = _this.getPixel(sourceX, sourceY).r;
				borradorpag[i].direccion[pixelOffset + 1] = _this.getPixel(sourceX, sourceY).g;
				borradorpag[i].direccion[pixelOffset + 2] = _this.getPixel(sourceX, sourceY).b;
				borradorpag[i].direccion[pixelOffset + 3] = _this.getPixel(sourceX, sourceY).a;
			}
		}
		indice++;
	};

	this.draw = function(image, ancho, alto) {
		for(var i = alto - 1; i >= 0; i--) {
			for(var j = 0; j < ancho; j++) {
				_this.setPixel(j, i,
					image.data[j * 4 + i * 4 * ancho + 0],
					image.data[j * 4 + i * 4 * ancho + 1],
					image.data[j * 4 + i * 4 * ancho + 2],
					image.data[j * 4 + i * 4 * ancho + 3]
				);
			}
		}
	};

	this.drawBackground = function(archivo) {
		_this.draw(archivo, 640, 480);
	};
};