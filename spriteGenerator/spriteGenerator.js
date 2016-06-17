new function() {

  var createButton = function(label, callback) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = label;
    button.onclick = callback;
    document.body.insertBefore(button, document.body.firstChild);
  };

  var loadImage = function(imageData, callback) {
    var img = new Image();
    img.onload = function() {
      img.offset = width;
      img.name = imageData[1];
      img.alpha = imageData[2];
      img.scale = imageData[3] || 1;
      img.columns = imageData[4] || 1;
      img.rows = imageData[5] || 1;
      var resultWidth = img.width * img.scale / img.columns;
      var resultHeight = img.height * img.scale * img.columns;
      width += resultWidth;
      if (resultHeight > height) {
        height = resultHeight;
      }
      images.push(img);
      callback();
    };
    img.src = imageData[0];
  };

  var loadImages = function(images) {
    var index = -1;
    var loadCurrent = function() {
      index++;
      if (index < images.length) {
        loadImage(images[index], loadCurrent);
      }
    };
    loadCurrent();
  };

  var width = 0;
  var height = 0;
  var images = [];
  var canvas;

  var result = document.getElementById("result");
  result.value += "{\n";

  loadImages([
    ["../image/nave1big.bmp", "blackShipDemo", true],
    ["../image/nave2big.bmp", "silverShipDemo", true],
    ["../image/versus.bmp", "versus", true],
    ["../image/nave1.bmp", "blackShip", true],
    ["../image/nave2.bmp", "silverShip", true],
    ["../image/explo.bmp", "explosion", true],
    ["../image/blueExplosion.jpg", "blueExplosion", true, 0.7, 3, 4],
    ["../image/laser1.bmp", "rocket", true],
    ["../image/laser2.bmp", "laser", true],
    ["../image/empate.bmp", "draw", false],
    ["../image/ganador.bmp", "winner", false]
  ]);

  createButton("export", function() {
    var resultBase64 = canvas.toDataURL("result.tiff");
    var img = document.createElement("img");
    img.src = resultBase64;
    document.body.appendChild(img);
  });
  createButton("draw", function() {
    canvas = document.createElement("canvas");
    canvas.style.marginLeft = 'auto';
    canvas.style.marginRight = 'auto';
    canvas.style.marginTop = 'auto';
    canvas.style.marginBottom = 'auto';
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    document.body.insertBefore(canvas, document.body.firstChild);

    for (var j = 0; j < images.length; j++) {
      var img = images[j];
      var frameWidth = img.width / img.columns;
      var frameHeight = img.height / img.rows;
      var resultWidth = img.width * img.scale / img.columns;
      var resultHeight = img.height * img.scale * img.columns;
      for (var x = 0; x < img.columns; x++) {
        for (var y = 0; y < img.rows; y++) {
          context.drawImage(img,
            x * frameWidth, y * frameHeight, frameWidth, frameHeight,	//source
            img.offset, (x + y * img.columns) * frameHeight * img.scale, frameWidth * img.scale, frameHeight * img.scale);
        }
      }	//destination
      var imageData = context.getImageData(img.offset, 0, resultWidth, resultHeight);
      var pixelData = imageData.data;
      for (var i = 0; i < pixelData.length && img.alpha; i += 4) {
        if (!pixelData[i] && !pixelData[i + 1] && !pixelData[i + 2]) {
          pixelData[i + 3] = 0;
        }
      }
      context.putImageData(imageData, img.offset, 0);
      result.value += "\t" + img.name + ": {x: " + img.offset + ", y: 0, width: " + resultWidth + ", height: " + resultHeight + "}";
      if (j == images.length - 1) {
        result.value += "\n}";
      }
      else {
        result.value += ",\n";
      }
    }
  });
};
