"use strict"
var child = function () {
	this.name = "Aaaa";
}

child.prototype = {
	getName: function () {
		return this.name;
	}
};


var parent = function () {
	child.call(this);
	this.age = 20;
}

parent.prototype = Object.create(child.prototype);
var cinstance = new child();
var pinstance = new parent();