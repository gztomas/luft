var BT = window.BT || {};

BT.Game = function() {
  var silverShip, blackShip, exitMenuItem, playMenuItem;
  var renderer = new BT.Renderer();
  var stage;

  var sceneWidth = 1200;
  var sceneHeight = 800;

  var setUpInitialScene = function() {
    var versus = new BT.Renderable(BT.Resources.sprite.versus, 27, {
      x: sceneWidth / 2,
      y: sceneHeight / 2,
      width: 64,
      height: 84
    });
    var silverShipDemo = new BT.Renderable(BT.Resources.sprite.silverShipDemo, 0, {
      x: sceneWidth / 3,
      y: sceneHeight / 2,
      width: 64,
      height: 64,
      scale: 2
    });
    var blackShipDemo = new BT.Renderable(BT.Resources.sprite.blackShipDemo, 0, {
      x: sceneWidth * 2 / 3,
      y: sceneHeight / 2,
      width: 80,
      height: 68,
      scale: 2
    });
    versus.startAnimation(3, false, true);
    silverShipDemo.startAnimation(3, false, true);
    blackShipDemo.startAnimation(3, false, true);
    renderer.clearScene();
    renderer.setBackground(null);
    renderer.add(versus);
    renderer.add(silverShipDemo);
    renderer.add(blackShipDemo);
  };
  var setUpMatchScene = function() {
    silverShip = new BT.Ship(renderer, 1);
    blackShip = new BT.Ship(renderer, 2);
    silverShip.deploy(sceneWidth / 3, sceneHeight / 2, -90);
    blackShip.deploy(sceneWidth * 2 / 3, sceneHeight / 2, 90);
    renderer.clearScene();
    renderer.setBackground(null);
    renderer.add(silverShip);
    renderer.add(blackShip);
    BT.MainKeyboardShipController.assign(silverShip);
    BT.SecondaryKeyboardShipController.assign(blackShip);
  };
  var setUpGameOverScene = function() {
    renderer.clearScene();
    if (silverShip.lives === 0 && blackShip.lives === 0) {
      renderer.setBackground(BT.Resources.sprite.draw);
    }
    else {
      renderer.setBackground(BT.Resources.sprite.winner);
      var ship;
      if (silverShip.lives === 0) {
        ship = new BT.Renderable(BT.Resources.sprite.silverShipDemo, 0, {
          x: sceneWidth / 2,
          y: sceneHeight / 2 + 100,
          width: 64,
          height: 64,
          scale: 3
        });
      }
      else {
        ship = new BT.Renderable(BT.Resources.sprite.blackShipDemo, 0, {
          x: sceneWidth / 2,
          y: sceneHeight / 2 + 100,
          width: 80,
          height: 68,
          scale: 3
        });
      }
      renderer.add(ship);
      ship.startAnimation(4, false, true);
    }
  };

  var intro = function() {
    if (BT.Keyboard.read(BT.Keys.ENTER)) {
      BT.Keyboard.flush();
      setUpMatchScene();
      stage = match;
    }
  };
  var menu = function() {
    var selectedItem = 1;
    if (BT.Keyboard.read(BT.Keys.UP)) {
      playMenuItem.setFrame(0);
      exitMenuItem.setFrame(1);
      selectedItem = 1;
    }
    if (BT.Keyboard.read(BT.Keys.DOWN)) {
      playMenuItem.setFrame(1);
      exitMenuItem.setFrame(0);
      selectedItem = 2;
    }
    if (BT.Keyboard.read(BT.Keys.ENTER)) {
      BT.Keyboard.flush();
      if (selectedItem == 1) {
        setUpMatchScene();
        stage = match;
      }
    }
  };
  var match = function() {
    if (silverShip.lives === 0 || blackShip.lives === 0) {
      setUpGameOverScene();
      stage = gameOver;
    }
  };
  var gameOver = function() {
    if (BT.Keyboard.read(BT.Keys.ENTER)) {
      BT.Keyboard.flush();
      setUpInitialScene();
      stage = menu;
    }
  };
  var init = function() {
    renderer.init();
    setUpInitialScene();
    stage = intro;
    setInterval(function() {
      stage();
    }, 10);
  };
  init();
};
