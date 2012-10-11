var w = 5;
var VIDAS = 6;
var Vnave = 10;
var Vlaser = 20;

var EMPATE = 0;
var GANADOR1 = 1;
var GANADOR2 = 2;
var CANCELAR = 3;

var context;

function main() {

	var canvas = window.document.createElement("canvas");
	canvas.style.width = "640px";
	canvas.style.height = "480px";
	canvas.style.marginLeft = 'auto';
	canvas.style.marginRight = 'auto';
	canvas.style.marginTop = 'auto';
	canvas.style.marginBottom = 'auto';
	window.document.body.appendChild(canvas);
	canvas.width = 640;
	canvas.height = 480;
	context = canvas.getContext("2d");

	var salir = new OBJETO();
	var jugar = new OBJETO();
	var versus = new OBJETO();
	var nave1 = new OBJETO();
	var nave2 = new OBJETO();

	var seleccion = 1,i=27,j=0, ganador;
	Inicializacion();

	CargarFondo("intro");
	CrearObjeto(versus,"versus",27,320,280,64,84,0,0);
	CrearObjeto(nave1,"nave1A",0,180,280,64,64,0,0);
	CrearObjeto(nave2,"nave2A",0,460,280,80,68,0,0);
	var frames = 0;
	while(Msg.message != WM_KEYDOWN) {
		DibujarObjeto(versus);
		DibujarObjeto(nave1);
		DibujarObjeto(nave2);
		CambiarCuadro(versus,i);
		CambiarCuadro(nave1,j);
		CambiarCuadro(nave2,j);
		if(!(frames++%3)) {
			i--;
			j++;
			if(i<0) i=27;
			if(j>30) j=1;
		}
		Frame();
	}
	Frame(); //Restituye los fondos del menu, para evitar parpadeo
	VerPantalla(0);     // Configuracion de paginas inicial
	ActivarPantalla(1); // Evita parpadeo por mal sincronismo de paginas

	CrearObjeto(jugar,"jugar.bmp",0,320,50,152,30,0,0);
	CrearObjeto(salir,"salir.bmp",1,320,80,152,30,0,0);
	CargarFondo("backmenu");


	setInterval(function() {
		switch(state) {
			case MENU:
				DibujarObjeto(jugar);
				DibujarObjeto(salir);
				Frame();
				break;
			case GANADOR1:
				DibujarObjeto(nave1);
				CambiarCuadro(nave1,i); // Animacion de la nave
				if(!(frames++%4)) {
					i++;
					if(i>30)
						i=1;
				}
				Frame();
				break;
			case GANADOR2:
				break;
		}
	}, 10);

	canvas.onkeydown = function(key) {
		switch(key) {
			case KEY_UP:
				CambiarCuadro(jugar,0); // Activa la palabra "jugar"
				CambiarCuadro(salir,1); // Desactiva "salir"
				seleccion=1;
				break;
			case KEY_DOWN:
				CambiarCuadro(jugar,1); // Desactiva "jugar"
				CambiarCuadro(salir,0); // Activa "salir"
				seleccion=2;
				break;
			case KEY_ENTER: //Si se presiona la tecla enter
				if (seleccion==1) { // Si estaba activado "jugar"
					ganador=Jugar();       // Comienza el juego
					if(ganador!=CANCELAR) {
						Frame(); // Fuerza restitucion de fondos del juego
						VerPantalla(0);     // Configuracion de pag inicial
						ActivarPantalla(1); // Evita parpadeo de menu
						if(ganador==EMPATE) {
							CargarFondo("empate");
							Frame();
						}
						else {
							i=0;
							CargarFondo("ganador");
							if(ganador==GANADOR2)
								CrearObjeto(nave1,"nave1A.bmp",0,320,300,64,64,0,0);
							else
								CrearObjeto(nave1,"nave2A.bmp",0,320,300,80,68,0,0);
							frames = 0;
						}
					}
					Frame(); // Fuerza restitucion de fondos del juego
					VerPantalla(0);     // Configuracion de pag inicial
					ActivarPantalla(1); // Evita parpadeo de menu
					CrearObjeto(jugar,"jugar.bmp",0,320,50,152,30,0,0);
					CrearObjeto(salir,"salir.bmp",1,320,80,152,30,0,0);
					CargarFondo("backmenu");
				}
				break;
		}
	}
}

function Jugar() {
	var disparar1=0, disparar2=0, explotando1=0, explotando2=0, vidas1=VIDAS, vidas2=VIDAS, i=0, j=0;
	var jugador1 = new OBJETO();
	var jugador2 = new OBJETO();
	var laser1 = new OBJETO();
	var laser2 = new OBJETO();

	Frame(); //Restituye los fondos del menu, para evitar parpadeo
	VerPantalla(0);     // Configuracion de paginas inicial
	ActivarPantalla(1); // Evita parpadeo por mal sincronismo de paginas
	CrearObjeto(jugador1,"nave1.bmp",10,100,420,44,56,0,Vnave);
	CrearObjeto(jugador2,"nave2.bmp",10,540,60,64,52,-180,Vnave);
	CrearObjeto(laser1,"laser1.bmp",0,0,0,40,40,0,Vlaser);
	CrearObjeto(laser2,"laser2.bmp",0,0,0,40,40,0,Vlaser);
	CargarFondo("fondo");

	canvas.onkeydown = function(key) {
		if(!explotando1) { // Si la nave 1 no esta explotando
			if(LeerTeclado(KEY_D)) {
				GirarObjeto(jugador1,w);
				j++;
			}
			else if(j>0)
				j--;
			if(LeerTeclado(KEY_A)) {
				GirarObjeto(jugador1,-w);
				j--;
			}
			else if(j<0)
				j++;
			if(LeerTeclado(KEY_W))
				AvanzarObjeto(jugador1);
			if(LeerTeclado(KEY_Q) && !disparar1)  // Disparo
			{
				disparar1=1;
				laser1.x=jugador1.x;            //
				laser1.y=jugador1.y;            // El disparo toma las coordenadas
				laser1.angulo=jugador1.angulo;  //   y angulo de la nave
			}
			if(j>10) j=10;
			if(j<-10) j=-10;
			CambiarCuadro(jugador1,10-j);
		}
		else {
			CambiarCuadro(jugador1,j--);
			if(j<0)
			{
				explotando1=0;
				if(vidas1==0) break;
				CrearObjeto(jugador1,"nave1.bmp",10,100,420,44,56,0,Vnave);
			}
		}
		if(!explotando2) {
			if(LeerTeclado(KEY_RIGHT)) GirarObjeto(jugador2,w),i++;
			else if(i>0) i--;
			if(LeerTeclado(KEY_LEFT)) GirarObjeto(jugador2,-w),i--;
			else if(i<0) i++;
			if(LeerTeclado(KEY_UP)) AvanzarObjeto(jugador2);
			if(LeerTeclado(KEY_RSHIFT) && !disparar2)
			{
				disparar2=1;
				laser2.x=jugador2.x;
				laser2.y=jugador2.y;
				laser2.angulo=jugador2.angulo;
			}
			if(i>10) i=10;
			if(i<-10) i=-10;
			CambiarCuadro(jugador2,10-i);
		}
		else {
			CambiarCuadro(jugador2,i--);
			if(i<0) {
				explotando2=0;
				if(vidas2==0) break;
				CrearObjeto(jugador2,"nave2.bmp",10,540,60,64,52,-180,Vnave);
			}
		}
		if(disparar1) AvanzarObjeto(laser1);
		if(disparar2) AvanzarObjeto(laser2);
		if(disparar1) DibujarObjeto(laser1);
		if(disparar2) DibujarObjeto(laser2);

		if(Colision(jugador1,jugador2) && !explotando1 && !explotando2) {
			vidas1--;
			vidas2--;
			CrearObjeto(jugador1,"explo.bmp",17,jugador1.x,jugador1.y,64,64,0,0);
			CrearObjeto(jugador2,"explo.bmp",17,jugador2.x,jugador2.y,64,64,0,0);
			j=i=16;
			explotando1=1;
			explotando2=1;
		}
		if(Colision(jugador1,laser2) && !explotando1 && disparar2==1) {
			vidas1--;
			CrearObjeto(jugador1,"explo.bmp",17,jugador1.x,jugador1.y,64,64,0,0);
			j=16;
			explotando1=1;
			disparar2=0;
		}
		if(Colision(laser1,jugador2) && !explotando2 && disparar1==1) {
			vidas2--;
			CrearObjeto(jugador2,"explo.bmp",17,jugador2.x,jugador2.y,64,64,0,0);
			i=16;
			explotando2=1;
			disparar1=0;
		}

		DibujarObjeto(jugador1);
		DibujarObjeto(jugador2);
		if(laser1.y<40 || laser1.y>440 || laser1.x<40 || laser1.x>600) disparar1=0;
		if(laser2.y<40 || laser2.y>440 || laser2.x<40 || laser2.x>600) disparar2=0;
		Frame();
	}
	if(vidas1==0 && vidas2==0) return(EMPATE);
	if(vidas1==0) return(GANADOR2);
	if(vidas2==0) return(GANADOR1);
	return(CANCELAR);
}