var Renderer = function () {
	var buf0, buf1;
	var _this = this;
	var canvas;
	var context;
	var backBuffer;
	var frontBuffer;
	var fps;
	var frameTime = [];

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
		fps.innerHTML = (1000 * frameTime.length/ (frameTime[frameTime.length - 1] - frameTime[0])).toFixed(2) + "FPS";
		if(frameTime.length >= 50)
			frameTime.shift();
	};

	var indice = [0, 0];
	var borradorpag = [
		[],
		[]
	];
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
		buf0 = context.createImageData(640, 480);
		buf1 = context.createImageData(640, 480);
	};

	this.setPixel = function (x, y, r, g, b, a) {
		backBuffer.data[x * 4 + y * 4 * 640 + 0] = r;
		backBuffer.data[x * 4 + y * 4 * 640 + 1] = g;
		backBuffer.data[x * 4 + y * 4 * 640 + 2] = b;
		backBuffer.data[x * 4 + y * 4 * 640 + 3] = a;
	};

	this.getPixel = function (x, y) {
		return {
			r:backBuffer.data[x * 4 + y * 640 * 4 + 0],
			g:backBuffer.data[x * 4 + y * 640 * 4 + 1],
			b:backBuffer.data[x * 4 + y * 640 * 4 + 2],
			a:backBuffer.data[x * 4 + y * 640 * 4 + 3]
		}
	};

	this.setFrontBuffer = function (newVal) {
		frontBuffer = newVal ? buf1 : buf0;
		context.putImageData(frontBuffer, 0, 0);
	};

	this.setBackBuffer = function (newVal) {
		backBuffer = newVal ? buf1 : buf0;
	};

	this.renderFrame = function () {
		writeFps();
		_this.swapBuffers();
		_this.clear(); // Borra los objetos y restaura los fondos pisados
	};

	this.clear = function () {
		var bufferIndex = backBuffer == buf0 ? 0 : 1;
		var i, x, y;
		for (i = (indice[bufferIndex] - 1); i >= 0; i--) {
			var borrador = borradorpag[bufferIndex][i];
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
		indice[bufferIndex] = 0;
	};

	this.backup = function(ancho, alto, X, Y) {
		var x, y, i;
		var bufferIndex = backBuffer == buf0 ? 0 : 1;
		i = indice[bufferIndex];
		if(!borradorpag[bufferIndex][i])
			borradorpag[bufferIndex][i] = new BUFFER();
		borradorpag[bufferIndex][i].direccion = new Uint8Array(ancho * alto * 4);
		borradorpag[bufferIndex][i].x = X;
		borradorpag[bufferIndex][i].y = Y;
		borradorpag[bufferIndex][i].ancho = ancho;
		borradorpag[bufferIndex][i].alto = alto;
		for(y = 0; y < alto; y++) {
			for(x = 0; x < ancho; x++) {
				borradorpag[bufferIndex][i].direccion[x * 4 + y * 4 * ancho + 0] = _this.getPixel(x + X, y + Y).r;
				borradorpag[bufferIndex][i].direccion[x * 4 + y * 4 * ancho + 1] = _this.getPixel(x + X, y + Y).g;
				borradorpag[bufferIndex][i].direccion[x * 4 + y * 4 * ancho + 2] = _this.getPixel(x + X, y + Y).b;
				borradorpag[bufferIndex][i].direccion[x * 4 + y * 4 * ancho + 3] = _this.getPixel(x + X, y + Y).a;
			}
		}
		indice[bufferIndex]++;
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
		_this.setFrontBuffer(0);
		_this.setBackBuffer(0);
		_this.draw(archivo, 640, 480);
		_this.setBackBuffer(1);
		_this.draw(archivo, 640, 480);
	};

	this.swapBuffers = function() {
		_this.setFrontBuffer(frontBuffer == buf0);
		_this.setBackBuffer(backBuffer == buf0);
	};
};