var BT = window.BT || {};

BT.Game = function(images) {
	var w = 5;
	var VIDAS = 6;
	var Vnave = 10;
	var Vlaser = 20;
	var EMPATE = 0;
	var GANADOR1 = 1;
	var GANADOR2 = 2;
	var frames = 0;
	var disparar1 = 0, disparar2 = 0, explotando1 = 0, explotando2 = 0, vidas1 = VIDAS, vidas2 = VIDAS;
	var versus, nave1, nave2, jugador1, jugador2, laser1, laser2, salir, jugar;
	var seleccion = 1, i = 27, j = 0, ganador;
	var renderer = new BT.Renderer();
	var stage;

	var intro = function() {
		versus.draw(renderer); // cambiar por "add"
		nave1.draw(renderer);
		nave2.draw(renderer);
		versus.setFrame(i);
		nave1.setFrame(j);
		nave2.setFrame(j);
		if(0 === (frames++ % 3)) {
			i--;
			j++;
			if(i < 0)
				i = 27;
			if(j > 30)
				j = 1;
		}
		if(BT.Keyboard.read(BT.Keys.ENTER)) {
			BT.Keyboard.flush();
<<<<<<< HEAD
			jugar = new BT.Renderable(images.jugar, 0, 320, 50, 152, 30, 0, 0);
			salir = new BT.Renderable(images.salir, 1, 320, 80, 152, 30, 0, 0);
			renderer.setBackground(images.backmenu);
=======
			renderer.renderFrame(); //Restituye los fondos del menu, para evitar parpadeo
			jugar = new BT.Renderable(images["jugar"], 0, 320, 50, 152, 30, 0, 0);
			salir = new BT.Renderable(images["salir"], 1, 320, 80, 152, 30, 0, 0);
			renderer.drawBackground(images["backmenu"]);
>>>>>>> 14094fda3e780e9a9b7b17fdcbb25cdcb994af3a
            stage = menu;
		}
    };
    
    var menu = function() {
		jugar.draw(renderer);
		salir.draw(renderer);
		if(BT.Keyboard.read(BT.Keys.UP)) {
			jugar.setFrame(0); // Activa la palabra "jugar"
			salir.setFrame(1); // Desactiva "salir"
			seleccion = 1;
		}
		if(BT.Keyboard.read(BT.Keys.DOWN)) {
			jugar.setFrame(1); // Desactiva "jugar"
			salir.setFrame(0); // Activa "salir"
			seleccion = 2;
		}
		if(BT.Keyboard.read(BT.Keys.ENTER)) { //Si se presiona la tecla enter
			BT.Keyboard.flush();
			if(seleccion == 1) { // Si estaba activado "jugar"
				stage = match;
<<<<<<< HEAD
				jugador1 = new BT.Renderable(images.nave1, 10, 100, 420, 44, 56, 0, Vnave);
				jugador2 = new BT.Renderable(images.nave2, 10, 540, 60, 64, 52, -180, Vnave);
				laser1 = new BT.Renderable(images.laser1, 0, 0, 0, 40, 40, 0, Vlaser);
				laser2 = new BT.Renderable(images.laser2, 0, 0, 0, 40, 40, 0, Vlaser);
				renderer.setBackground(images.fondo);
=======
				renderer.renderFrame(); //Restituye los fondos del menu, para evitar parpadeo
				jugador1 = new BT.Renderable(images["nave1"], 10, 100, 420, 44, 56, 0, Vnave);
				jugador2 = new BT.Renderable(images["nave2"], 10, 540, 60, 64, 52, -180, Vnave);
				laser1 = new BT.Renderable(images["laser1"], 0, 0, 0, 40, 40, 0, Vlaser);
				laser2 = new BT.Renderable(images["laser2"], 0, 0, 0, 40, 40, 0, Vlaser);
				renderer.drawBackground(images["fondo"]);
>>>>>>> 14094fda3e780e9a9b7b17fdcbb25cdcb994af3a
			}
		}
    };
    
    var match = function() {
		if(!explotando1) { // Si la nave 1 no esta explotando
			if(BT.Keyboard.read(BT.Keys.D)) {
				jugador1.rotate(w);
				j++;
			}
			else if(j > 0)
				j--;
			if(BT.Keyboard.read(BT.Keys.A)) {
				jugador1.rotate(-w);
				j--;
			}
			else if(j < 0)
				j++;
			if(BT.Keyboard.read(BT.Keys.W))
				jugador1.moveForward();
			if(BT.Keyboard.read(BT.Keys.Q) && !disparar1) { // Disparo
				disparar1 = 1;
				laser1.x = jugador1.x;            //
				laser1.y = jugador1.y;            // El disparo toma las coordenadas
				laser1.angulo = jugador1.angulo;  //   y angulo de la nave
			}
			if(j > 10) j = 10;
			if(j < -10) j = -10;
			jugador1.setFrame(10 - j);
		}
		else {
			jugador1.setFrame(j--);
			if(j < 0) {
				explotando1 = 0;
				if(vidas1 !== 0)
					jugador1 = new BT.Renderable(images["nave1"], 10, 100, 420, 44, 56, 0, Vnave);
			}
		}
		if(!explotando2) {
			if(BT.Keyboard.read(BT.Keys.RIGHT)) {
				jugador2.rotate(w);
				i++;
			}
			else if(i > 0)
				i--;
			if(BT.Keyboard.read(BT.Keys.LEFT)) {
				jugador2.rotate(-w);
				i--;
			}
			else if(i < 0)
				i++;
			if(BT.Keyboard.read(BT.Keys.UP))
				jugador2.moveForward();
			if(BT.Keyboard.read(BT.Keys.RSHIFT) && !disparar2) {
				disparar2 = 1;
				laser2.x = jugador2.x;
				laser2.y = jugador2.y;
				laser2.angulo = jugador2.angulo;
			}
			if(i > 10) i = 10;
			if(i < -10) i = -10;
			jugador2.setFrame(10 - i);
		}
		else {
			jugador2.setFrame(i--);
			if(i < 0) {
				explotando2 = 0;
				if(vidas2 !== 0)
					jugador2 = new BT.Renderable(images["nave2"], 10, 540, 60, 64, 52, -180, Vnave);
			}
		}
		if(vidas1 === 0 || vidas2 === 0) {
			if(vidas1 === 0 && vidas2 === 0) {
				ganador = EMPATE;
<<<<<<< HEAD
				renderer.setBackground(images.empate);
=======
				renderer.drawBackground(images["empate"]);
>>>>>>> 14094fda3e780e9a9b7b17fdcbb25cdcb994af3a
			}
			else {
				ganador = vidas1 === 0 ? GANADOR2 : GANADOR1;
				i = 0;
				frames = 0;
<<<<<<< HEAD
				renderer.setBackground(images.ganador);
=======
				renderer.drawBackground(images["ganador"]);
>>>>>>> 14094fda3e780e9a9b7b17fdcbb25cdcb994af3a
				if(ganador == GANADOR2)
					nave1 = new BT.Renderable(images["nave2big"], 0, 320, 300, 64, 64, 0, 0);
				else
					nave1 = new BT.Renderable(images["nave1big"], 0, 320, 300, 80, 68, 0, 0);
			}
			stage = gameOver;
		}
		else {
			if(disparar1)
				laser1.moveForward();
			if(disparar2)
				laser2.moveForward();
			if(disparar1)
				laser1.draw(renderer);
			if(disparar2)
				laser2.draw(renderer);

			if(jugador1.isCollisioning(jugador2) && !explotando1 && !explotando2) {
				vidas1--;
				vidas2--;
				jugador1 = new BT.Renderable(images["explo"], 17, jugador1.x, jugador1.y, 64, 64, 0, 0);
				jugador2 = new BT.Renderable(images["explo"], 17, jugador2.x, jugador2.y, 64, 64, 0, 0);
				j = i = 16;
				explotando1 = 1;
				explotando2 = 1;
			}
			if(jugador1.isCollisioning(laser2) && !explotando1 && disparar2 == 1) {
				vidas1--;
				jugador1 = new BT.Renderable(images["explo"], 17, jugador1.x, jugador1.y, 64, 64, 0, 0);
				j = 16;
				explotando1 = 1;
				disparar2 = 0;
			}
			if(laser1.isCollisioning(jugador2) && !explotando2 && disparar1 == 1) {
				vidas2--;
				jugador2 = new BT.Renderable(images["explo"], 17, jugador2.x, jugador2.y, 64, 64, 0, 0);
				i = 16;
				explotando2 = 1;
				disparar1 = 0;
			}

			jugador1.draw(renderer);
			jugador2.draw(renderer);
			if(laser1.y < 40 || laser1.y > 440 || laser1.x < 40 || laser1.x > 600) disparar1 = 0;
			if(laser2.y < 40 || laser2.y > 440 || laser2.x < 40 || laser2.x > 600) disparar2 = 0;
		}
    };
    
    var gameOver = function() {
		if(ganador != EMPATE) {
			nave1.draw(renderer);
			nave1.setFrame(i); // Animacion de la nave
			if(0 === frames++ % 4) {
				i++;
				if(i > 30)
					i = 1;
			}
		}
		if(BT.Keyboard.read(BT.Keys.ENTER)) {
			BT.Keyboard.flush();
<<<<<<< HEAD
			jugar = new BT.Renderable(images.jugar, 0, 320, 50, 152, 30, 0, 0);
			salir = new BT.Renderable(images.salir, 1, 320, 80, 152, 30, 0, 0);
			renderer.setBackground(images.backmenu);
=======
			renderer.renderFrame(); // Fuerza restitucion de fondos del juego
			jugar = new BT.Renderable(images["jugar"], 0, 320, 50, 152, 30, 0, 0);
			salir = new BT.Renderable(images["salir"], 1, 320, 80, 152, 30, 0, 0);
			renderer.drawBackground(images["backmenu"]);
>>>>>>> 14094fda3e780e9a9b7b17fdcbb25cdcb994af3a
			disparar1 = disparar2 = explotando1 = explotando2 = i = j = 0;
			vidas1 = vidas2 = VIDAS;
			stage = menu;
		}
    };
    
    var init = function() {
		renderer.init();
<<<<<<< HEAD
		renderer.setBackground(images.intro);
		versus = new BT.Renderable(images.versus, 27, 320, 280, 64, 84, 0, 0);
		nave1 = new BT.Renderable(images.nave2big, 0, 180, 280, 64, 64, 0, 0);
		nave2 = new BT.Renderable(images.nave1big, 0, 460, 280, 80, 68, 0, 0);
=======
		renderer.drawBackground(images["intro"]);
		versus = new BT.Renderable(images["versus"], 27, 320, 280, 64, 84, 0, 0);
		nave1 = new BT.Renderable(images["nave2big"], 0, 180, 280, 64, 64, 0, 0);
		nave2 = new BT.Renderable(images["nave1big"], 0, 460, 280, 80, 68, 0, 0);
>>>>>>> 14094fda3e780e9a9b7b17fdcbb25cdcb994af3a
		stage = intro;
		setInterval(function() {
			stage();
		}, 1);        
    };
    
    init();
};

new BT.ImageLoader(
	["intro", "versus", "nave1", "nave2", "nave1big", "nave2big", "jugar", "salir", "backmenu","empate", "explo", "fondo", "ganador", "laser1", "laser2"],
	function(img) {
		new BT.Game(img);
	}
);