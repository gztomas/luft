'use strict';

import { Resources } from './resources';
import { Renderable, SpaceObject } from './renderable';

export function Weapon(world, type) {
  var _this = this;
  var _renderable;

  this.draw = function() {
    return _renderable.draw.apply(_renderable, arguments);
  };
  this.deploy = function(x, y, angle) {
    var image = type == 1 ? Resources.sprite.rocket : Resources.sprite.laser;
    _renderable = new Renderable(image, 0, {
      width: 40, height: 40, x: x, y: y, angle: angle, z: 0, speed: 20, angularSpeed: 0
    });
    SpaceObject.apply(this, [_renderable.state]);
  };
  this.notifyAfterCalculation = function() {
    if (_renderable.state.y < -_renderable.state.height ||
      _renderable.state.y > world.height + _renderable.state.height ||
      _renderable.state.x < -_renderable.state.width ||
      _renderable.state.x > world.width + _renderable.state.width) {
      world.remove(_this);
    }
  };
  this.notifyCollision = function(/*target*/) {
    //if(target.shipID != _this.ownerID)
    //  world.remove(_this);
  };
}
