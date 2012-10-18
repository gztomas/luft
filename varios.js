function Inicializacion()
{
	window.buf0 = window.context.createImageData(640, 480);
	window.buf1 = window.context.createImageData(640, 480);
//	hbmBackBM0 = CreateCompatibleBitmap(hdc, 640, 480 );
//	hbmOldBackBM0 = (HBITMAP)SelectObject(buf0, hbmBackBM0 );
//	hbmBackBM1 = CreateCompatibleBitmap(hdc, 640, 480 );
//	hbmOldBackBM1 = (HBITMAP)SelectObject(buf1, hbmBackBM1 );
//	BitBlt(buf0, 0, 0, 640, 480, NULL, 0, 0, BLACKNESS );
//	BitBlt(buf1, 0, 0, 640, 480, NULL, 0, 0, BLACKNESS );
//	ReleaseDC(hwnd, hdc);
	window.VerPantalla(0);     // Esta es la configuracion de
	window.ActivarPantalla(1); // paginas inicial
}

var keys = {};
window.onkeydown = function(e) {
    keys[e.keyCode] = true;
};
window.onkeyup = function(e) {
    keys[e.keyCode] = true;
};

function LeerTeclado(tecla)
{
	return keys[tecla];
}

function Frame()
{
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

function CargarFondo(archivo)
{
	window.ActivarPantalla(0);               // El fondo debe dibujarse en las dos
	window.DibujarBitmap(archivo,640,480); // pantallas de video, de otro modo
	window.ActivarPantalla(1);               // se observaria un parpadeo
	window.DibujarBitmap(archivo,640,480);
}