'use strict';

import { Ship } from './ship';
import { Renderer } from './renderer';
import { Renderable } from './renderable';
import { Resources } from './resources';
import {
  MainKeyboardShipController,
  SecondaryKeyboardShipController,
  Keyboard,
  Keys
} from './keyboard';

export function Game() {
  var silverShip, blackShip, exitMenuItem, playMenuItem;
  var renderer = new Renderer();
  var stage;

  var sceneWidth = window.innerWidth;
  var sceneHeight = window.innerHeight;

  var setUpInitialScene = function() {
    var versus = new Renderable(Resources.sprite.versus, 27, {
      x: sceneWidth / 2, y: sceneHeight / 2, width: 64, height: 84
    });
    var silverShipDemo = new Renderable(Resources.sprite.silverShipDemo, 0, {
      x: sceneWidth / 3, y: sceneHeight / 2, width: 64, height: 64, scale: 2
    });
    var blackShipDemo = new Renderable(Resources.sprite.blackShipDemo, 0, {
      x: sceneWidth * 2 / 3, y: sceneHeight / 2, width: 80, height: 68, scale: 2
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
    silverShip = new Ship(renderer, 1);
    blackShip = new Ship(renderer, 2);
    silverShip.deploy(sceneWidth / 3, sceneHeight / 2, -90);
    blackShip.deploy(sceneWidth * 2 / 3, sceneHeight / 2, 90);
    renderer.clearScene();
    renderer.setBackground(null);
    renderer.add(silverShip);
    renderer.add(blackShip);
    MainKeyboardShipController.assign(silverShip);
    SecondaryKeyboardShipController.assign(blackShip);
  };
  var setUpGameOverScene = function() {
    renderer.clearScene();
    if (silverShip.lives === 0 && blackShip.lives === 0) {
      renderer.setBackground(Resources.sprite.draw);
    } else {
      renderer.setBackground(Resources.sprite.winner);
      var ship;
      if (silverShip.lives === 0) {
        ship = new Renderable(Resources.sprite.silverShipDemo, 0, {
          x: sceneWidth / 2, y: sceneHeight / 2 + 100, width: 64, height: 64, scale: 3
        });
      } else {
        ship = new Renderable(Resources.sprite.blackShipDemo, 0, {
          x: sceneWidth / 2, y: sceneHeight / 2 + 100, width: 80, height: 68, scale: 3
        });
      }
      renderer.add(ship);
      ship.startAnimation(4, false, true);
    }
  };

  var intro = function() {
    if (Keyboard.read(Keys.ENTER)) {
      Keyboard.flush();
      setUpMatchScene();
      stage = match;
    }
  };
  var menu = function() {
    var selectedItem = 1;
    if (Keyboard.read(Keys.UP)) {
      playMenuItem.setFrame(0);
      exitMenuItem.setFrame(1);
      selectedItem = 1;
    }
    if (Keyboard.read(Keys.DOWN)) {
      playMenuItem.setFrame(1);
      exitMenuItem.setFrame(0);
      selectedItem = 2;
    }
    if (Keyboard.read(Keys.ENTER)) {
      Keyboard.flush();
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
    if (Keyboard.read(Keys.ENTER)) {
      Keyboard.flush();
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
}
