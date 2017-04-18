'use strict';

var URIParser = {};

URIParser.parse = function(uri) {
	/*
	 RegEx for URL format by Diego Perini
	 https://gist.github.com/dperini/729294

	 So far, this seems to be the most complete regex for URL formats
	 https://mathiasbynens.be/demo/url-regex
	 */

	var URIInfo = {
		isValid: true,
		type: null,
		originalURI: uri,
		formattedURI: null
	};


	/*
	 TODO: enable special ip formats such as 10.10.10.10
	 as some users may want to access that range in a internal network setting
	 */
	var urlRegEx = /^((?:(?:https?|ftp):\/\/)|)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

	if (uri === undefined || uri.trim() === "") {
		URIInfo.isValid = false;
		URIInfo.type = "invalid";
		URIInfo.formattedURI = "";
	}
	// if localhost (Zeronet) address
	else if (uri.startsWith("127.0.0.1") || uri.startsWith("localhost")) {
		if (uri.length == 9) {
			URIInfo.type = "http";
			URIInfo.formattedURI = "http://127.0.0.1:43210/1LANDERvVWbShpNWpsrbBvfqSK1PabXtwv";
		} else {
			URIInfo.type = "http";
			URIInfo.formattedURI = "http://" + uri;
		}
	}
	// if a normal URL
	else if (urlRegEx.test(uri)) {
		if (!uri.startsWith("http://") && !uri.startsWith("https://") && !uri.startsWith("ftp://")) {
			// prepend http:// for regex test if no protocol was specified
			uri = "http://" + uri;
		}
		URIInfo.type = "http";
		URIInfo.formattedURI = uri;
	}
	// if file format
	else if (uri.startsWith("file://")) {
		URIInfo.type = "file";
		URIInfo.formattedURI = uri;
	}
	// if file is an html-page file for browser
	else if (uri.startsWith("./")) {
		URIInfo.type = "page";
		URIInfo.formattedURI = uri;
		URIInfo.displayURI = "New Tab";
	}
	// if Hack Browser's internal URI
	else if (uri.startsWith("hack://")) {
		URIInfo.type = "internal";
		URIInfo.formattedURI = uri;
	}
	// else return Google search
	else {
		URIInfo.type ="search";
		URIInfo.formattedURI = "http://www.google.com/search?q=" + encodeURI(uri);
	}
	return URIInfo;
};
