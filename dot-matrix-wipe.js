"use strict";

/**
 * I'd like to make this a css wipe
 * or a canvas masking wipe
 */

function DotMatrixWipe(container) {
	this._container = container;
	this._duration = 1000; //ms

	this.init();
}
DotMatrixWipe.prototype.update = function() {
	// figure out what % is left
	// set lines to %
}
DotMatrixWipe.prototype.init = function(duration) {
	this._canvas = document.createElement("canvas");
	this._canvas.width = window.innerWidth;
	this._canvas.height = window.innerHeight;
	
	// setup lines
	Line.setup(this._canvas);

	this._container.prepend(this._canvas);
}
DotMatrixWipe.prototype.destroy = function(duration) {
	this._container.remove(this._canvas);
}
DotMatrixWipe.prototype.play = function(duration) {
	if(duration !== undefined) this._duration = duration;

	// create framecount: canvas width / duration

	// set interval on this.update
}

function Dot() {
	this._completeness = 0;
	this._size = {
		x: 5,
		y: 5
	}
	this._offset = {
		even: 0,
		odd: 5
	}
}
Dot.prototype.completeness = function(perc) {
	if(perc === undefined) {
		return this._completeness;
	}
}