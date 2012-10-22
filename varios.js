var keys = {};

window.onkeydown = function(e) {
    keys[e.keyCode] = true;
};

window.onkeyup = function(e) {
    keys[e.keyCode] = false;
};

function LeerTeclado(tecla) {
	return keys[tecla];
}

function LimpiarTeclado() {
    keys = {};
}

function Frame() {
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
	window.VerPantalla(1 - window.pantalla_visible);    // Estas dos lineas cambian la pantalla
	window.ActivarPantalla(1 - window.pantalla_activa); // visible y la activa. Animacion
	window.BorrarObjetos(); // Borra los objetos y restaura los fondos pisados
}

function CargarFondo(archivo) {
	window.ActivarPantalla(0);             // El fondo debe dibujarse en las dos
	window.DibujarBitmap(archivo,640,480); // pantallas de video, de otro modo
	window.ActivarPantalla(1);             // se observaria un parpadeo
	window.DibujarBitmap(archivo,640,480);
}