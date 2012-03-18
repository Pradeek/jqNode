jqNode - A micro-framework for NodeJS : 
=======================================
jqNode is an easy to use micro-framework for NodeJS.

INSTALLATION :
==============
	npm install jqNode

USAGE :
=======
	var $ = require("jqNode").$;

	$("/").get(function(request, response, data) {
		$.writeFile("index.html");
	});

	$("/data").post(function(request, response, data) {
		// data.param === value
		console.log(data);
	});

	$.start();


METHODS AVAILABLE : 
===================

	$(url)
		.get(function(request, response) {})
		.post(function(request, response, data) {})
		.put(function(request, response) {})
		.delete(function(request, response) {})
		.head(function(request, response) {});

	$.start(port, debugMode); // Starts and returns the server. Port defaults to 8888, debugMode defaults to false.

	$.write(data, contentType); // Writes to the current response. contentType defaults to text/html

	$.writeFile(fileName, contentType); // Reads a file and writes it to the current stream.

TODO : 
======
	- Sinatra-like routing
	- Remove favicon (Done)
	- $.redirect (Done)
	- $.start({
			port: 80,
			debugMode: false,
		})