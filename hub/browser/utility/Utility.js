"use strict";

var Utility = {};

Utility.pad = function(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
};