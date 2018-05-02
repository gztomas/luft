'use strict';

import { Resources } from './';
import { Renderable, SpaceObject } from './renderable';

export class Weapon {

  constructor(world, type) {
    this.world = world;
    this.type = type;
  }

  draw() {
    return this.renderable.draw.apply(this.renderable, arguments);
  }

  deploy(x, y, angle) {
    var image = this.type == 1 ? Resources.sprite.rocket : Resources.sprite.laser;
    this.renderable = new Renderable(image, 0, {
      width: 40, height: 40, x: x, y: y, angle: angle, z: 0, speed: 20, angularSpeed: 0
    });
    SpaceObject.apply(this, [this.renderable.state]);
  }

  notifyAfterCalculation() {
    if (this.renderable.state.y < -this.renderable.state.height ||
      this.renderable.state.y > this.world.height + this.renderable.state.height ||
      this.renderable.state.x < -this.renderable.state.width ||
      this.renderable.state.x > this.world.width + this.renderable.state.width) {
      this.world.remove(this);
    }
  }

  notifyCollision(/*target*/) {
    //if(target.shipID != _this.ownerID)
    //  this.world.remove(_this);
  };
}
