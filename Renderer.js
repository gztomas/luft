var Renderer = function() {
	var pantalla_visible = 0;
	var pantalla_activa = 0;
	var buf0, buf1;
	var _this = this;
	var canvas;
	var context;

	var indice = [0, 0];
	var borradorpag = [[], []];
	var BUFFER = function() {
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
		_this.setFrontBuffer(0);	// Esta es la configuracion de
		_this.setBackBuffer(1);		// paginas inicial
	};

	this.setPixel = function(x, y, r, g, b, a) {
		(pantalla_activa ? buf1.data : buf0.data)[x*4 + y*4 * 640 + 0] = r;
		(pantalla_activa ? buf1.data : buf0.data)[x*4 + y*4 * 640 + 1] = g;
		(pantalla_activa ? buf1.data : buf0.data)[x*4 + y*4 * 640 + 2] = b;
		(pantalla_activa ? buf1.data : buf0.data)[x*4 + y*4 * 640 + 3] = a;
	};

	this.getPixel = function(x, y) {
		return {
			r: (pantalla_activa ? buf1.data : buf0.data)[x*4+y*640*4+0],
			g: (pantalla_activa ? buf1.data : buf0.data)[x*4+y*640*4+1],
			b: (pantalla_activa ? buf1.data : buf0.data)[x*4+y*640*4+2],
			a: (pantalla_activa ? buf1.data : buf0.data)[x*4+y*640*4+3]
		}
	};

	this.setFrontBuffer = function(pantalla) {
		if(pantalla)
			context.putImageData(buf1, 0, 0);
		else
			context.putImageData(buf0, 0, 0);
		pantalla_visible = pantalla;
	};

	this.setBackBuffer = function(p) {
		pantalla_activa = (p==1 || p==0) ? p : -1;
	};

	this.renderFrame = function() {
		//var contador=1;
		//var retardo=0;
		//var tactual=0;
		//var tanterior=0;
		//contador++;
		//if(!(contador%10))
		//{
		//	tanterior=tactual;
		//	tactual=GetTickCount();
		//}
		//if((tactual-tanterior)<50 && contador>10) retardo++;
		//Sleep(retardo);
		_this.setFrontBuffer(1 - pantalla_visible);    // Estas dos lineas cambian la pantalla
		_this.setBackBuffer(1 - pantalla_activa); // visible y la activa. Animacion
		_this.clear(); // Borra los objetos y restaura los fondos pisados
	};

	this.clear = function() {
		var i,x,y;
		for(i=(indice[pantalla_activa]-1);i>=0;i--) {
			var borrador = borradorpag[pantalla_activa][i];
			for(y=0;y<borrador.alto;y++)
				for(x=0;x<borrador.ancho;x++) {
					var offset = x * 4 + y * 4 * borrador.ancho;
					_this.setPixel(x + borrador.x, y + borrador.y,
						borrador.direccion[offset+0],
						borrador.direccion[offset+1],
						borrador.direccion[offset+2],
						borrador.direccion[offset+3]
					);
				}
		}
		indice[pantalla_activa]=0;
	};

	this.AgregarBuffer = function(ancho, alto, X, Y) {
		var x,y,i;

		i=indice[pantalla_activa];
		if(!borradorpag[pantalla_activa][i])
			borradorpag[pantalla_activa][i] = new BUFFER();
		borradorpag[pantalla_activa][i].direccion = new Uint8Array(ancho*alto*4);
		borradorpag[pantalla_activa][i].x=X;
		borradorpag[pantalla_activa][i].y=Y;
		borradorpag[pantalla_activa][i].ancho=ancho;
		borradorpag[pantalla_activa][i].alto=alto;
		for(y=0;y<alto;y++)
			for(x=0;x<ancho;x++) {
				borradorpag[pantalla_activa][i].direccion[x*4+y*4*ancho+0] = _this.getPixel(x+X,y+Y).r;
				borradorpag[pantalla_activa][i].direccion[x*4+y*4*ancho+1] = _this.getPixel(x+X,y+Y).g;
				borradorpag[pantalla_activa][i].direccion[x*4+y*4*ancho+2] = _this.getPixel(x+X,y+Y).b;
				borradorpag[pantalla_activa][i].direccion[x*4+y*4*ancho+3] = _this.getPixel(x+X,y+Y).a;
			}
		indice[pantalla_activa]++;
	};

	this.DibujarBitmap = function(nombre, ancho, alto) {
		context.drawImage(document.getElementById(nombre), 0, 0);
		var fp = context.getImageData(0,0, ancho, alto);
		var i,j;
		for(i=alto-1;i>=0;i--)
			for(j=0;j<ancho;j++)
				_this.setPixel(j,i,fp.data[j*4+i*4*ancho+0], fp.data[j*4+i*4*ancho+1], fp.data[j*4+i*4*ancho+2], fp.data[j*4+i*4*ancho+3]);
	};

	this.CargarFondo = function(archivo) {
		_this.setBackBuffer(0);               // El fondo debe dibujarse en las dos
		_this.DibujarBitmap(archivo,640,480); // pantallas de video, de otro modo
		_this.setBackBuffer(1);               // se observaria un parpadeo
		_this.DibujarBitmap(archivo,640,480);
	};
};