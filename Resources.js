var BT = window.BT || {};

BT.Resources = new function() {
	var progressBar;
	var image = new Image();
	var imageLoaded = false;
	var _this = this;

	this.sprites = null;

	var resourcesLoadedCallback = function() {
		new BT.Game();
	};

	var init = function() {
		showProgressBar();
		image.onloadstart = showProgressBar;
		image.onprogress = updateProgressBar;
		image.onload = onLoad;
		image.src = "sprite.png";
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
	};

	var onLoad = function() {
		document.body.removeChild(progressBar);
		imageLoaded = true;
		if(_this.sprites && resourcesLoadedCallback) {
			resourcesLoadedCallback();
			resourcesLoadedCallback = null;
		}
	};

	this.setSpriteData = function(data) {
		for(var sprite in data) {
			if(data.hasOwnProperty(sprite)) {
				data[sprite].node = image;
			}
		}
		_this.sprites = data;
		if(imageLoaded && resourcesLoadedCallback) {
			resourcesLoadedCallback();
			resourcesLoadedCallback = null;
		}
	};

	init();
};