var Image = function() {
    var _this = this;
    this.data;    
    
    var getAuxContext = function() {
        if(!Image.auxCanvas) {
    		Image.auxCanvas = document.createElement("canvas");
    	}
    	Image.auxCanvas.style.width = Image.auxCanvas.width = _this.width;
    	Image.auxCanvas.style.height = Image.auxCanvas.height = _this.height;
    	return Image.auxCanvas.getContext("2d");    
    };
    
    this.load = function(url, progressCallback) {
        node = document.createElement("img");
        node.onprogress = function(e) {
            progressCallback(url, e);
        };
        node.src = url;
        _this.height = node.height;
        _this.width = node.width;
        getAuxContext().drawImage(node, 0, 0, _this.width, _this.height);
        _this.data = Image.auxContext.getImageData(0, 0, _this.width, _this.height);
    };
    
    this.create = function(width, height) {
        _this.height = height;
        _this.width = width;
        _this.data = getAuxContext().createImageData(width, height);
    };
};
Image.auxCanvas;