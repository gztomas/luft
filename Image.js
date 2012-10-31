var Image = function() {
    var _this = this;

    var getAuxContext = function() {
        if(!Image.auxCanvas) {
    		Image.auxCanvas = document.createElement("canvas");
    	}
    	Image.auxCanvas.style.width = Image.auxCanvas.width = _this.width;
    	Image.auxCanvas.style.height = Image.auxCanvas.height = _this.height;
    	return Image.auxCanvas.getContext("2d");    
    };
    
    this.load = function(uri, progressCallback) {
		_this.uri = uri;
		var request = new XMLHttpRequest();
		request.onloadstart = request.onprogress = function(e) {
			_this.progress = e;
			progressCallback(_this);
		};
		request.onload =  function(e) {
			var node = document.createElement("img");
			node.src = uri;
			node.onload = function() {
				_this.height = node.height;
				_this.width = node.width;
				getAuxContext().drawImage(node, 0, 0, _this.width, _this.height);
				_this.data = getAuxContext().getImageData(0, 0, _this.width, _this.height);
				_this.loaded = true;
				progressCallback(_this);
			};
		};
		request.open("GET", uri, true);
		request.overrideMimeType('text/plain; charset=x-user-defined');
		request.send(null);
		request.onreadystatechange = function() {
			if(request.readyState == request.HEADERS_RECEIVED) {
				_this.progress = {
					loaded: 0,
					total: request.getResponseHeader("Content-Length")
				};
			}
		}
    };
    
    this.create = function(width, height) {
        _this.height = height;
        _this.width = width;
        _this.data = getAuxContext().createImageData(width, height);
    };
};

var ImageLoader = function(imageNames, callback) {
	var _this = this;
	var images = {};
	var progressBar;

	var showProgressBar = function() {
		progressBar = document.createElement("progress");
		progressBar.value = 0;
		progressBar.max = 100;
		progressBar.removeAttribute("value");
		document.body.appendChild(progressBar);
	};

	var progressCallback = function() {
		var end = true;
		var loaded = 0;
		var total = 0;
		for(var i in images) {
			end = end && images[i].loaded;
			if(images[i].progress) {
				loaded += images[i].progress.loaded;
				total += images[i].progress.total;
			}
		}
		if(total)
			progressBar.value = loaded / total * 100;
		if(end) {
			document.body.removeChild(progressBar);
			callback();
		}
	};

	var init = function() {
		showProgressBar();
		for(var i = 0; i < imageNames.length; i++) {
			var image = images[imageNames[i]] = new Image();
			image.load(name2uri(imageNames[i]), progressCallback);
		}
	};

	var name2uri = function(name) {
		return "image/" + name + ".bmp";
	};

	init();
};

new ImageLoader(["intro", "versus", "nave1", "nave2", "nave1big", "nave2big", "jugar", "salir", "backmenu", "empate", "explo", "fondo", "ganador", "laser1", "laser2"], function() {
	alert("ready");
});