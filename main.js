var BT = window.BT || {};

BT.Game = function(images) {
	BT.IMAGES = images;
	var jugador1, jugador2, salir, jugar;
	var renderer = new BT.Renderer();
	var stage;

	var setUpInitialScene = function() {
		var versus = new BT.Renderable(images["versus"], 27, {x: 320, y: 280, width: 64, height: 84});
		var nave1 = new BT.Renderable(images["nave2big"], 0, {x: 180, y: 280, width: 64, height: 64});
		var nave2 = new BT.Renderable(images["nave1big"], 0, {x: 460, y: 280, width: 80, height: 68});
		versus.startAnimation(3, false, true);
		nave1.startAnimation(3, false, true);
		nave2.startAnimation(3, false, true);
		renderer.clearScene();
		renderer.setBackground(images["intro"]);
		renderer.add(versus);
		renderer.add(nave1);
		renderer.add(nave2);
	};
	var setUpMenuScene = function() {
		jugar = new BT.Renderable(images["jugar"], 0, {x: 320, y: 50, width: 152, height: 30});
		salir = new BT.Renderable(images["salir"], 1, {x: 320, y: 80, width: 152, height: 30});
		renderer.clearScene();
		renderer.setBackground(images["backmenu"]);
		renderer.add(jugar);
		renderer.add(salir);
	};
	var setUpMatchScene = function() {
		jugador1 = new BT.Ship(renderer, 1);
		jugador2 = new BT.Ship(renderer, 2);
		jugador1.deploy(100, 420, 0);
		jugador2.deploy(540, 60, -180);
		renderer.clearScene();
		renderer.setBackground(images["fondo"]);
		renderer.add(jugador1);
		renderer.add(jugador2);
		BT.MainKeyboardShipController.assign(jugador1);
		BT.SecondaryKeyboardShipController.assign(jugador2);
	};
	var setUpGameOverScene = function() {
		renderer.clearScene();
		if(jugador1.lives === 0 && jugador2.lives === 0) {
			renderer.setBackground(images["empate"]);
		}
		else {
			renderer.setBackground(images["ganador"]);
			var ship;
			if(jugador1.lives === 0)
				ship = new BT.Renderable(images["nave2big"], 0, {x: 320, y: 300, width: 64, height: 64});
			else
				ship = new BT.Renderable(images["nave1big"], 0, {x: 320, y: 300, width: 80, height: 68});
			renderer.add(ship);
			ship.startAnimation(4, false, true);
		}
	};

	var intro = function() {
		if(BT.Keyboard.read(BT.Keys.ENTER)) {
			BT.Keyboard.flush();
			setUpMenuScene();
            stage = menu;
		}
    };
    var menu = function() {
		var selectedItem = 1;
		if(BT.Keyboard.read(BT.Keys.UP)) {
			jugar.setFrame(0);
			salir.setFrame(1);
			selectedItem = 1;
		}
		if(BT.Keyboard.read(BT.Keys.DOWN)) {
			jugar.setFrame(1);
			salir.setFrame(0);
			selectedItem = 2;
		}
		if(BT.Keyboard.read(BT.Keys.ENTER)) {
			BT.Keyboard.flush();
			if(selectedItem == 1) {
				setUpMatchScene();
				stage = match;
			}
		}
    };
    var match = function() {
		if(jugador1.lives === 0 || jugador2.lives === 0) {
			setUpGameOverScene();
			stage = gameOver;
		}
    };
    var gameOver = function() {
		if(BT.Keyboard.read(BT.Keys.ENTER)) {
			BT.Keyboard.flush();
			setUpMenuScene();
			stage = menu;
		}
    };
    var init = function() {
		renderer.init();
		setUpInitialScene();
		stage = intro;
		//setUpMatchScene();
		//stage = match;
		setInterval(function() {
			stage();
		}, 10);
    };
    init();
};

new BT.ImageLoader(
	["intro", "versus", "nave1", "nave2", "nave1big", "nave2big", "jugar", "salir", "backmenu","empate", "explo", "fondo", "ganador", "laser1", "laser2"],
	function(img) {
		new BT.Game(img);
	}
);