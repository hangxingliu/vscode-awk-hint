#!/usr/bin/gawk -f

# plus function
#{{ Comment }}
function thisisafunc(x, y) {
	return x + y;
}
function funchaslocalvar(x, y,   tmp) {
	tmp = x + y;
	return tmp * tmp;
	{{ KeywordOrIdentifier }}
}

{{ KeywordOrIdentifier }}

BEGIN {
	print thisisafunction(10, 20{{ Number }});
	exit 0;
}
/line{{ Regex }}/ {
	print "matched!";
}

function funcnoparamter(   tmp) {
	print tmp "{{ String }}";
}
