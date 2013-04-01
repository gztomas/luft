var BT = window.BT || {};

BT.Renderer = function () {
	var _this = this;
	var canvas;
	var context;
	var fps;
	var frameTime = [];
	var video;
	var background;
	var scene = {};
	var _elementID = 0;

	this.width = 640;
	this.height = 480;

	var writeFps = function() {
		frameTime.push(new Date());
		if(!fps) {
			fps = document.createElement("div");
			fps.style.position = "absolute";
			fps.style.color = "green";
			fps.style.top = 0;
			fps.style.left = 0;
			document.body.appendChild(fps);
		}
		fps.innerHTML = (1000 * frameTime.length / (frameTime[frameTime.length - 1] - frameTime[0])).toFixed(2) + "FPS";
		if(frameTime.length >= 50)
			frameTime.shift();
	};

	this.init = function() {
		canvas = window.document.createElement("canvas");
		canvas.style.width = _this.width + "px";
		canvas.style.height = _this.height + "px";
		canvas.style.marginLeft = 'auto';
		canvas.style.marginRight = 'auto';
		canvas.style.marginTop = 'auto';
		canvas.style.marginBottom = 'auto';
		window.document.body.insertBefore(canvas, window.document.body.firstChild);
		canvas.width = _this.width;
		canvas.height = _this.height;
		context = canvas.getContext("2d");
		video = context.createImageData(_this.width, _this.height);
		setInterval(renderFrame, 20);
	};

	var renderFrame = function () {
		detectCollisions();
		writeFps();
		context.drawImage(background.node, background.x, background.y, background.width, background.height, 0, 0, _this.width, _this.height);
		var sortedRenderables = [];
		for(var renderable in scene) {
			if(scene.hasOwnProperty(renderable)) {
				sortedRenderables.push(scene[renderable]);
			}
		}
		sortedRenderables.sort(function(a, b) {
			if(a.getState && b.getState)
				return a.getState().z - b.getState().z;
			else
				return 0;
		});
		for(var i = 0; i < sortedRenderables.length; i++) {
			sortedRenderables[i].draw(context);
		}
	};

	var detectCollisions = function() {
		for(var a in scene) {
			if(scene.hasOwnProperty(a)) {
				for(var b in scene) {
					if(scene.hasOwnProperty(b)) {
						if(a != b && scene[a].isCollisioning && scene[b].isCollisioning) {
							if(scene[a].isCollisioning(scene[b])) {
								a = scene[a];
								b = scene[b];
								if(a.notifyCollision)
									a.notifyCollision(b);
								if(b.notifyCollision)
									b.notifyCollision(a);
								return;
							}
						}
					}
				}
			}
		}
	};

	this.setBackground = function(image) {
		background = image;
	};

	this.add = function (renderable) {
		renderable.id = "renderable" + _elementID++;
		scene[renderable.id] = renderable;
	};

	this.remove = function(renderable) {
		delete scene[renderable.id];
		if(renderable.notifyRemoved)
			renderable.notifyRemoved();
	};

	this.clearScene = function() {
		for(var renderable in scene) {
			if(scene.hasOwnProperty(renderable) && scene[renderable].notifyRemoved) {
				scene[renderable].notifyRemoved();
			}
		}
		scene = {};
	};
};