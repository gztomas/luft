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
    
    this.load = function(url, progressCallback) {
		var request = new XMLHttpRequest();
		//request.onloadstart = showProgressBar;
		request.onprogress = function(e) {
			progressCallback(url, e);
		};
		request.onload =  function() {
			var node = document.createElement("img");
			node.src = url;
			node.onload = function() {
				_this.height = node.height;
				_this.width = node.width;
				getAuxContext().drawImage(node, 0, 0, _this.width, _this.height);
				_this.data = getAuxContext().getImageData(0, 0, _this.width, _this.height);
			};
		};
		//request.onloadend = hideProgressBar;
		request.open("GET", url, true);
		request.overrideMimeType('text/plain; charset=x-user-defined');
		request.send(null);
    };
    
    this.create = function(width, height) {
        _this.height = height;
        _this.width = width;
        _this.data = getAuxContext().createImageData(width, height);
    };
};

var ImageManager = new function() {

	var progressBar = document.createElement("progress");
	progressBar.value = 0;
	progressBar.max = 100;
	progressBar.removeAttribute("value");
	document.body.appendChild(progressBar);

	var loading = {};

	var progressCallback = function(url, e) {
		loading[url] = e;
		var loaded = 0;
		var total = 0;
		for(var i in loading) {
			loaded += loading[i].loaded;
			total += loading[i].total;
		}
		progressBar.value = loaded / total * 100;
	};
	var resourceNames = ["intro", "versus", "nave1", "nave2", "nave1big", "nave2big", "jugar", "salir", "backmenu", "empate", "explo", "fondo", "ganador", "laser1", "laser2"];
	var images = {};
	for(var i = 0; i < resourceNames.length; i++) {
		images[resourceNames[i]] = new Image();
		images[resourceNames[i]].load("image/" + resourceNames[i] + ".bmp", progressCallback);
	}
};