jqNode - A micro-framework for NodeJS : 
=======================================
jqNode is an easy to use micro-framework for NodeJS.

INSTALLATION :
==============
	npm install jqNode

USAGE :
=======
	var $ = require("../lib/jqNode").$;

	$("/").get(function(request, response) { 
		$.writeFile("index.html");
	});


	$("/test").get(function(request, response, data) { 
		$.write(data['q']);
	});

	$("/test").post(function(request, response, data) {
		console.log(data);
	});

	$("/test/:id/sample/:val").get(function(request, response, data) {
		$.write(data['id'] + " | " + data['val']);
	});

	$("/sample/:id").get(function(request, response, data) {
		$.write(data['id']);
	});

	$.start({
		port: 8080
	});


METHODS AVAILABLE : 
===================

	$(url)
		.get(function(request, response) {})
		.post(function(request, response, data) {})
		.put(function(request, response) {})
		.delete(function(request, response) {})
		.head(function(request, response) {});

	$.start({
		port: 8888,
		debugMode : true
	}); // Starts and returns the server. 

	$.write(data, contentType); // Writes to the current response. contentType defaults to text/html

	$.writeFile(fileName, contentType); // Reads a file and writes it to the current stream.

	$.redirect(url); // Redirects to url

	$.extend(destination, source, overwrite); // Similar to jQuery.extend

	$.readFile(fileName, callback, callbackArgs); // callback -> function(data, callbackArgs) where data -> contents of the file

