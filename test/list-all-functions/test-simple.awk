#!/usr/bin/gawk -f
function thisisafunc(x, y) {
	return x + y;
}
function funchaslocalvar(x, y,   tmp) {
	tmp = x + y;
	return tmp * tmp;
}

BEGIN {
	print thisisafunction(10, 20);
	exit 0;
}

function funcnoparamter(   tmp) {
	print tmp;
}
