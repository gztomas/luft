'use strict';

import { Ship } from './ship';
import { Renderer } from './renderer';
import { Renderable } from './renderable';
import { Resources } from './';
import { InputManager } from './input-manager';

export class GameController {

  constructor() {
    var self = this;
    this.renderer = new Renderer();
    this.inputManager = new InputManager();
    this.sceneWidth = window.innerWidth;
    this.sceneHeight = window.innerHeight;

    this.renderer.init();
    this.setUpInitialScene();
    this.stage = this.intro;

    setInterval(function() {
      self.stage();
    }, 10);
  }

  setUpInitialScene() {
    var versus = new Renderable(Resources.sprite.versus, 27, {
      x: this.sceneWidth / 2, y: this.sceneHeight / 2, width: 64, height: 84
    });
    var silverShipDemo = new Renderable(Resources.sprite.silverShipDemo, 0, {
      x: this.sceneWidth / 3, y: this.sceneHeight / 2, width: 64, height: 64, scale: 2
    });
    var blackShipDemo = new Renderable(Resources.sprite.blackShipDemo, 0, {
      x: this.sceneWidth * 2 / 3, y: this.sceneHeight / 2, width: 80, height: 68, scale: 2
    });
    versus.startAnimation(3, false, true);
    silverShipDemo.startAnimation(3, false, true);
    blackShipDemo.startAnimation(3, false, true);
    this.renderer.clearScene();
    this.renderer.setBackground(null);
    this.renderer.add(versus);
    this.renderer.add(silverShipDemo);
    this.renderer.add(blackShipDemo);
  }

  setUpMatchScene() {
    this.silverShip = new Ship(this.renderer, 1);
    this.blackShip = new Ship(this.renderer, 2);
    this.silverShip.deploy(this.sceneWidth / 3, this.sceneHeight / 2, -90);
    this.blackShip.deploy(this.sceneWidth * 2 / 3, this.sceneHeight / 2, 90);
    this.renderer.clearScene();
    this.renderer.setBackground(null);
    this.renderer.add(this.silverShip);
    this.renderer.add(this.blackShip);
    this.inputManager.control(this.silverShip, this.blackShip);
  }

  setUpGameOverScene() {
    this.renderer.clearScene();
    if (this.silverShip.lives === 0 && this.blackShip.lives === 0) {
      this.renderer.setBackground(Resources.sprite.draw);
    } else {
      this.renderer.setBackground(Resources.sprite.winner);
      var ship;
      if (this.silverShip.lives === 0) {
        ship = new Renderable(Resources.sprite.silverShipDemo, 0, {
          x: this.sceneWidth / 2, y: this.sceneHeight / 2 + 100, width: 64, height: 64, scale: 3
        });
      } else {
        ship = new Renderable(Resources.sprite.blackShipDemo, 0, {
          x: this.sceneWidth / 2, y: this.sceneHeight / 2 + 100, width: 80, height: 68, scale: 3
        });
      }
      this.renderer.add(ship);
      ship.startAnimation(4, false, true);
    }
  }

  intro() {
    if (this.inputManager.readContinue()) {
      this.setUpMatchScene();
      this.stage = this.match;
    }
  }

  match() {
    if (this.silverShip.lives === 0 || this.blackShip.lives === 0) {
      this.setUpGameOverScene();
      this.stage = this.gameOver;
    }
  }

  gameOver() {
    if (this.inputManager.readContinue()) {
      this.setUpInitialScene();
      this.stage = this.intro;
    }
  }
}
