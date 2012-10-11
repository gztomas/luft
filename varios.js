function Inicializacion()
{
	buf0 = context.createImageData(640, 480);
	buf1 = context.createImageData(640, 480);
//	hbmBackBM0 = CreateCompatibleBitmap(hdc, 640, 480 );
//	hbmOldBackBM0 = (HBITMAP)SelectObject(buf0, hbmBackBM0 );
//	hbmBackBM1 = CreateCompatibleBitmap(hdc, 640, 480 );
//	hbmOldBackBM1 = (HBITMAP)SelectObject(buf1, hbmBackBM1 );
//	BitBlt(buf0, 0, 0, 640, 480, NULL, 0, 0, BLACKNESS );
//	BitBlt(buf1, 0, 0, 640, 480, NULL, 0, 0, BLACKNESS );
//	ReleaseDC(hwnd, hdc);
	VerPantalla(0);     // Esta es la configuracion de
	ActivarPantalla(1); // paginas inicial
}

function LeerTeclado()
{
	return GetAsyncKeyState(tecla) && 0x8000;  // El vector keys contiene el estado de las teclas
}

function Frame()
{
	var contador=1;
	var retardo=0;
	var tactual=0;
	var tanterior=0;
	contador++;
	if(!(contador%10))
	{
		tanterior=tactual;
		tactual=GetTickCount();
	}
	if((tactual-tanterior)<50 && contador>10) retardo++;
	Sleep(retardo);
	VerPantalla(1-pantalla_visible);    // Estas dos lineas cambian la pantalla
	ActivarPantalla(1-pantalla_activa); // visible y la activa. Animacion
	BorrarObjetos(); // Borra los objetos y restaura los fondos pisados
}

function CargarFondo(archivo)
{
	ActivarPantalla(0);               // El fondo debe dibujarse en las dos
	DibujarBitmap(archivo,640,480); // pantallas de video, de otro modo
	ActivarPantalla(1);               // se observaria un parpadeo
	DibujarBitmap(archivo,640,480);
}

function Error(codigo)
{
	switch(codigo)
	{
		case ERR_MEMORIA:
		printf("\nError: No hay suficiente memoria"); break;
		case ERR_ARCHIVO:
		printf("\nError: No se puede abrir el archivo"); break;
	}
	_getch();
	exit(1);
}