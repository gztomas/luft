var BT = window.BT || {};

BT.Resources = new function() {
	var _this = this;
	var progressBar;
	var image = new Image();
	var imageLoaded = false;
	var request;

	this.sprite = null;

	var onResourcesLoaded = function() {
		new BT.Game();
	};

	var init = function() {
		request = new XMLHttpRequest();
		request.onloadstart = showProgressBar;
		request.onprogress = updateProgressBar;
		request.onload = onLoad;
		request.open("GET", "image/sprite.png", true);
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
		if(e.lengthComputable)
			progressBar.value = e.loaded / e.total * 100;
		else
			progressBar.removeAttribute("value");
	};

	var onLoad = function() {
		document.body.removeChild(progressBar);
		image.onload = function() {
			imageLoaded = true;
			if(_this.sprite && onResourcesLoaded) {
				onResourcesLoaded();
				onResourcesLoaded = null;
			}
		};
		image.src = "data:image/jpeg;base64," + BT.Utility.base64Encode(request.responseText);
	};

	this.setSpriteData = function(data) {
		for(var sprite in data) {
			if(data.hasOwnProperty(sprite)) {
				data[sprite].node = image;
			}
		}
		_this.sprite = data;
		if(imageLoaded && onResourcesLoaded) {
			onResourcesLoaded();
			onResourcesLoaded = null;
		}
	};

	init();
};