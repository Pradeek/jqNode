var fs = require("fs"),
	http = require("http"),
	url = require("url");

var routes = {},
	server = http.createServer();

var	_response, _data, _options = {
	port: 8888,
	debugMode : true
}

function route(request, response) {
	var parsedUrl = url.parse(request.url, true),
		pathName = parsedUrl.pathname,
		method = request.method;
		
	_response = response;
	_data = parsedUrl.query;
	
	if(_options.debugMode) {
		console.log("Received " + method + " request at " + pathName);
	}

	if((routes[pathName]) && (handler = routes[pathName][method])){	
		if(method === "POST") {
			_data = "";
			request.addListener("data", function(chunk) {
				_data += chunk;
			});
			request.addListener("end", function() {
				handler(request, response, require('querystring').parse(_data));
			});
		} else {
			handler(request, response, _data);
		} 
	} else {
		response.writeHead(404, {'Content-Type' : 'text/html'});
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
	return this;
}

$.extend = function(destination, source, overwrite) {
	if(typeof overwrite === 'undefined') {
		overwrite = true;
	}
	for(var property in source) {
		if(source.hasOwnProperty(property)) {
			if(!destination[property] || overwrite) {
				destination[property] = source[property];
			}
		}
	}
	return destination;
}

$.redirect = function(url) {
	_response.statusCode = 302;
	_response.setHeader("Location", url);
	_response.end("Redirecting to " + url);
}

$.start = function(options) {
	_options = $.extend(_options, options);

	server.on('request', route);
	server.listen(_options.port);
	console.log("Listening at port " + _options.port);

	return server;
}

$.write = function(data, contentType) {
	if(!contentType) {
		contentType = "text/html";
	}
	_response.writeHead(200, {'Content-Type' : contentType});
	_response.end(data);
}

$.writeFile = function(fileName, contentType) {
	if(!contentType) {
		contentType = "text/html";
	}
	_response.writeHead(200, {'Content-Type' : contentType});
	fs.readFile(fileName, function(error, data) {
		if(error) {
			_response.end("<h1>Unable to load page. File not found</h1>");
			if(_debug) {
				console.log(fileName + " not found");
			}
		} else {
			_response.end(data);
		}
	});
}

exports.$ = $;
