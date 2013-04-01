var BT = window.BT || {};

BT.Game = function() {
	var silverShip, blackShip, salir, jugar;
	var renderer = new BT.Renderer();
	var stage;

	var setUpInitialScene = function() {
		var versus = new BT.Renderable(BT.Resources.sprites.versus, 27, {x: 320, y: 280, width: 64, height: 84});
		var nave1 = new BT.Renderable(BT.Resources.sprites.silverShipDemo, 0, {x: 180, y: 280, width: 64, height: 64});
		var nave2 = new BT.Renderable(BT.Resources.sprites.blackShipDemo, 0, {x: 460, y: 280, width: 80, height: 68});
		versus.startAnimation(3, false, true);
		nave1.startAnimation(3, false, true);
		nave2.startAnimation(3, false, true);
		renderer.clearScene();
		renderer.setBackground(BT.Resources.sprites.fight);
		renderer.add(versus);
		renderer.add(nave1);
		renderer.add(nave2);
	};
	var setUpMenuScene = function() {
		jugar = new BT.Renderable(BT.Resources.sprites.play, 0, {x: 320, y: 50, width: 152, height: 30});
		salir = new BT.Renderable(BT.Resources.sprites.exit, 1, {x: 320, y: 80, width: 152, height: 30});
		renderer.clearScene();
		renderer.setBackground(BT.Resources.sprites.mountains);
		renderer.add(jugar);
		renderer.add(salir);
	};
	var setUpMatchScene = function() {
		silverShip = new BT.Ship(renderer, 1);
		blackShip = new BT.Ship(renderer, 2);
		silverShip.deploy(100, 420, 0);
		blackShip.deploy(540, 60, -180);
		renderer.clearScene();
		renderer.setBackground(BT.Resources.sprites.space);
		renderer.add(silverShip);
		renderer.add(blackShip);
		BT.MainKeyboardShipController.assign(silverShip);
		BT.SecondaryKeyboardShipController.assign(blackShip);
	};
	var setUpGameOverScene = function() {
		renderer.clearScene();
		if(silverShip.lives === 0 && blackShip.lives === 0) {
			renderer.setBackground(BT.Resources.sprites.draw);
		}
		else {
			renderer.setBackground(BT.Resources.sprites.winner);
			var ship;
			if(silverShip.lives === 0)
				ship = new BT.Renderable(BT.Resources.sprites.silverShipDemo, 0, {x: 320, y: 300, width: 64, height: 64});
			else
				ship = new BT.Renderable(BT.Resources.sprites.blackShipDemo, 0, {x: 320, y: 300, width: 80, height: 68});
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
		if(silverShip.lives === 0 || blackShip.lives === 0) {
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