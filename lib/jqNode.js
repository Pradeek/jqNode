var fs = require("fs"),
	http = require("http"),
	url = require("url");

var routes = {},
	server = http.createServer();

var	_response, _debug = false;

function route(request, response) {
	var pathName = url.parse(request.url).pathname,
		method = request.method;
		
	_response = response;
	
	if(_debug) {
		console.log("Received " + method + " request at " + pathName);
	}
	
	if(handler = routes[pathName][method]){	
		handler(request, response);
	} else {
		response.writeHead(200, {'Content-Type' : 'text/html'});
		response.end("<h1>404. Not found.</h1>");
	}
}

function addRoute(url, method, callback) {
	if(!routes[url]) {
		routes[url] = {};
	}
	routes[url][method] = callback;
}

var $ = function(url) {
	return $.fn.init(url);
}

$.fn = $.prototype;

$.fn.init = function(url) {
	this.url = url;
	return this;
}

$.fn.get = function(callback) {
	addRoute(this.url, "GET", callback);
	return this;
}

$.fn.post = function(callback) {
	addRoute(this.url, "POST", callback);
	return this;
}

$.fn.head = function(callback) {
	addRoute(this.url, "HEAD", callback);
	return this;
}

$.fn.put = function(callback) {
	addRoute(this.url, "PUT", callback);
	return this;
}

$.fn['delete'] = function(callback) {
	addRoute(this.url, "DELETE", callback);
}


$.start = function(port, debugMode) {
	if(!port) { 
		port = 8888;
	}
	server.on('request', route);
	server.listen(port);
	if(debugMode) {
		_debug = true;
		console.log("Listening at port " + port);
	}
	return server;
}

$.write = function(data, contentType) {
	if(!contentType) {
		contentType = "text/html";
	}
	_response.writeHead(200, {'Content-Type' : contentType});
	_response.end(data);
}

$.writeFile = function(fileName) {
	_response.writeHead(200, {'Content-Type' : 'text/html'});
	fs.readFile(fileName, function(error, data) {
		if(error) {
			_response.end("<h1>Unable to load page. File not found</h1>");
		} else {
			_response.end(data);
		}
	});
}

exports.$ = $;
