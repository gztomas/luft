import { GameController } from './game-controller';
import { Utility } from './utils';
import sprite from '../img/sprite.png';

export var Resources = new function() {
  var _this = this;
  var progressBar;
  var image = new Image();
  var imageLoaded = false;
  var request;

  this.sprite = null;

  var onResourcesLoaded = function() {
    new GameController();
  };

  var init = function() {
    request = new XMLHttpRequest();
    request.onloadstart = showProgressBar;
    request.onprogress = updateProgressBar;
    request.onload = onLoad;
    request.open("GET", sprite, true);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.send(null);
  };

  var showProgressBar = function() {
    progressBar = document.createElement("progress");
    progressBar.value = 0;
    progressBar.max = 100;
    progressBar.removeAttribute("value");
    document.body.appendChild(progressBar);
  };

  var updateProgressBar = function(e) {
    if (e.lengthComputable) {
      progressBar.value = e.loaded / e.total * 100;
    } else {
      progressBar.removeAttribute("value");
    }
  };

  var onLoad = function() {
    document.body.removeChild(progressBar);
    image.onload = function() {
      imageLoaded = true;
      if (_this.sprite && onResourcesLoaded) {
        onResourcesLoaded();
        onResourcesLoaded = null;
      }
    };
    image.src = "data:image/jpeg;base64," + Utility.base64Encode(request.responseText);
  };

  this.setSpriteData = function(data) {
    for (var sprite in data) {
      if (data.hasOwnProperty(sprite)) {
        data[sprite].node = image;
      }
    }
    _this.sprite = data;
    if (imageLoaded && onResourcesLoaded) {
      onResourcesLoaded();
      onResourcesLoaded = null;
    }
  };

  init();
};

Resources.setSpriteData({
  blackShipDemo: {x: 0, y: 0, width: 80, height: 2108},
  silverShipDemo: {x: 80, y: 0, width: 64, height: 1984},
  versus: {x: 144, y: 0, width: 64, height: 2352},
  blackShip: {x: 208, y: 0, width: 44, height: 1176},
  silverShip: {x: 252, y: 0, width: 64, height: 1092},
  explosion: {x: 316, y: 0, width: 64, height: 1152},
  blueExplosion: {x: 380, y: 0, width: 84, height: 1008},
  rocket: {x: 464, y: 0, width: 40, height: 40},
  laser: {x: 504, y: 0, width: 40, height: 40},
  draw: {x: 544, y: 0, width: 640, height: 480},
  winner: {x: 1184, y: 0, width: 640, height: 480}
});
