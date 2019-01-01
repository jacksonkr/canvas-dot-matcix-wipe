"use strict";

/**
 * I'd like to make this a css wipe
 * or a canvas masking wipe
 */

function DotMatrixWipe(container) {
	this._container = container;
	this._duration = 1000; //ms
	this.playIntervalId = NaN;

	this.init();
}
DotMatrixWipe.prototype.init = function(duration) {
	this._canvas = document.createElement("canvas");
	this._canvas.width = this._container.offsetWidth;
	this._canvas.height = this._container.offsetHeight;
	
	// setup dots
	Dot.setup(this);

	this._container.prepend(this._canvas);

	this._ctx = this._canvas.getContext("2d");
}
DotMatrixWipe.prototype.update = function() {
	// figure out "completeness" (percent complete)
	var perc = this._startTime + this._duration
	perc -= Date.now();
	perc /= this._duration;
	perc = 1 - perc;
	if(perc > 1) perc = 1;

	this._completeness = perc;
	this.draw();

	// console.log("DotMatrixWipe.update", perc);
	if(perc >= 1) this.stop();
}
DotMatrixWipe.prototype.draw = function() {
	// this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

	for(var i in Dot.dots) {
		var o = Dot.dots[i];
		o.draw(this);
	}

	this._ctx.fill();
}
DotMatrixWipe.prototype.destroy = function(duration) {
	this._container.remove(this._canvas);
}
DotMatrixWipe.prototype.play = function(duration) {
	if(duration !== undefined) this._duration = duration;

	this._startTime = Date.now();

	// set interval on this.update
	var self = this;
	this._playIntervalId = setInterval(function() {
		self.update();
	}, 0);
}
DotMatrixWipe.prototype.stop = function() {
	if(isNaN(this._playIntervalId)) return;

	clearInterval(this._playIntervalId);
	this._playIntervalId = NaN;

	this.completeness = 0;
}

function Dot(x, y, hgroup, sgroup) {
	this._x = x;
	this._y = y;
	this._hgroup = hgroup;
	this._sgroup = sgroup;
}
Dot.dots = [];
Dot.SIZE = 10;
Dot.setup = function(dmw) {
	var canvas = dmw._canvas;
	var size = Dot.SIZE;
	var rows = canvas.height / size;
	var cols = canvas.width / size;

	for(var r = 0; r < rows+1; ++r) {
		var odd = r%2;
		for(var c = 0; c < cols+1; ++c) {
			var x = c * size + odd * (size / 2) - size;
			var y = r * size;
			var hgroup = c * size / dmw._container.offsetWidth;
			var sgroup = size * 2 / dmw._container.offsetHeight;

			var d = new Dot(x, y, hgroup, sgroup);
			Dot.dots.push(d);
		}
	}
}
Dot.prototype.draw = function(dmw) {
	var perc = dmw._completeness;
	var min = this._hgroup - this._sgroup;
	var max = this._hgroup + this._sgroup
	if(perc < min) return; //perc = 0;
	else if (perc > max) return; //perc = 1;
	else if(perc > min && perc < max) {
		perc -= min;
		perc /= max - min;
	}

	dmw._ctx.moveTo(this._x, this._y);
	dmw._ctx.arc(this._x, this._y, Dot.SIZE * perc, 0, Math.PI * 2);
}