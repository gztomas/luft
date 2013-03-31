var SpriteGenerator = new function() {

	var createButton = function(label, callback) {
		var button = document.createElement("input");
		button.type = "button";
		button.value = label;
		button.onclick = callback;
		document.body.insertBefore(button, document.body.firstChild);
	};

	var loadImage = function(src) {
		var img = document.createElement("img");
		img.onload = function() {
			canvas.width = img.width;
			canvas.height = img.height;
			context.drawImage(img, 0, 0);
		};
		img.src = src;
		document.body.appendChild(img);
	};

	var width = 200;
	var height = 200;

	var canvas = document.createElement("canvas");
	canvas.style.marginLeft = 'auto';
	canvas.style.marginRight = 'auto';
	canvas.style.marginTop = 'auto';
	canvas.style.marginBottom = 'auto';
	canvas.width = width;
	canvas.height = height;

	var context = canvas.getContext("2d");
	var image = context.createImageData(width, height);

	document.body.insertBefore(canvas, document.body.firstChild);

	loadImage("image/nave1big.bmp");

	createButton("export", function() {
		var resultBase64 = canvas.toDataURL("image/a.tiff");
		var img = document.createElement("img");
		img.src = resultBase64;
		document.body.appendChild(img);
	});
};
