var Renderable = function(imageId, cuadro, x, y, ancho, alto, angulo, velocidad) {
	var _this = this;

	var file = document.getElementById(imageId);
	var cuadros = file.height / alto;
	var auxCanvas = document.getElementById("auxCanvas");
	if(!auxCanvas) {
		auxCanvas = document.createElement("canvas");
		auxCanvas.id = "auxCanvas";
	}
	auxCanvas.style.width = auxCanvas.width = file.width;
	auxCanvas.style.height = auxCanvas.height = file.height;
	var auxContext = auxCanvas.getContext("2d");
	auxContext.drawImage(document.getElementById(imageId), 0, 0, file.width, file.height);
	var archivo = auxContext.getImageData(0, 0, file.width, file.height);
	var imagen = auxContext.createImageData(ancho, alto);

	this.setFrame = function(newFrame) {
		newFrame = cuadros - 1 - newFrame;
		var start = newFrame * alto * ancho * 4;
		var end = (newFrame + 1) * alto * ancho * 4;
		var source = archivo.data.subarray ?
			archivo.data.subarray(start, end) :
			new Uint8Array(archivo.data.slice(start, end));

		if(imagen.data.set)
			imagen.data.set(source);
		else
			imagen.data = source;
	};

	this.draw = function(renderer) {
		var x, y, x1, y1, coordx, coordy, centrox, centroy;
		var cosT = Math.cos(Math.PI * angulo / 180);
		var sinT = Math.sin(Math.PI * angulo / 180);
		centrox = ancho / 2;
		centroy = alto / 2;
		coordx = Math.floor(x - centrox);
		coordy = Math.floor(y - centroy);
		renderer.AgregarBuffer(ancho, alto, coordx, coordy);
		var data = imagen.data;
		for (y = 0 ; y < alto ; y++) {
			for (x = 0; x < ancho; x++) {
				x1 = Math.floor(( x - centrox ) * cosT + ( y - centroy ) * sinT);
				y1 = Math.floor(( y - centroy ) * cosT - ( x - centrox ) * sinT);
				x1 = Math.floor(x1 + ancho * 0.5);
				y1 = Math.floor(y1 + alto * 0.5);
				var offset = x1 * 4 + y1 * 4 * ancho;
				if(x1 > 0 && y1 > 0 && x1 < ancho && y1 < alto && (data[offset+0] || data[offset+1] || data[offset+2]))
					renderer.setPixel(x+coordx,y+coordy,
						data[offset+0],
						data[offset+1],
						data[offset+2],
						data[offset+3]
					);
			}
		}
	};

	this.moveForward = function() {
		var cosT = Math.cos(Math.PI * (angulo-90)/180);
		var sinT = Math.sin(Math.PI * (angulo-90)/180);
		move(cosT*velocidad, sinT*velocidad);
	};

	this.rotate = function(alpha) {
		angulo += alpha;
	};

	this.isCollisioning = function(renderable) {
		var margenx1 = ancho * 0.35;
		var margeny1 = alto * 0.35;
		var margenx2 = renderable.getSize()[0] * 0.35;
		var margeny2 = renderable.getSize()[1] * 0.35;
		return 	x + margenx1 > renderable.getPosition()[0] - margenx2 &&
				x - margenx1 < renderable.getPosition()[0] + margenx2 &&
				y + margeny1 > renderable.getPosition()[1] - margeny2 &&
				y - margeny1 < renderable.getPosition()[1] + margeny2;
	};

	this.getSize = function() {
		return [ancho, alto];
	};

	this.getPosition = function() {
		return [x, y];
	};

	var move = function(h, v) {
		x += h; // Las ultimas cuatro lineas evitan que
		y += v; // el objeto se salga de la pantalla
		if (x + ancho * 0.5 > 630) x = 630 - ancho * 0.5;
		if (x - ancho * 0.5 < 10) x = 10 + ancho * 0.5;
		if (y + alto * 0.5 > 470) y = 470 - alto * 0.5;
		if (y - alto * 0.5 < 10) y = 10 + alto * 0.5;
	};

	this.setFrame(cuadro);
};