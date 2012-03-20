var fs = require("fs"),
	http = require("http"),
	url = require("url");

var routes = {},
	regexRoutes = [],
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
		for (var i = 0, len = regexRoutes.length; i < len; i++) {
			var regexRoute = regexRoutes[i];
			if(method == regexRoute.method) {
				if(pathName.match(regexRoute.regex)) {
					var sections = pathName.split("/");
					for(var j = 0, length = regexRoute.variables.length; j < length; j++) {
						var urlVariable = regexRoute.variables[j];
						_data[urlVariable.name] = sections[urlVariable.index];
					}
					regexRoute.callback(request, response, _data);
					break;
				}	
			}
		};

		response.writeHead(404, {'Content-Type' : 'text/html'});
		response.end("<h1>404. Not found.</h1>");
	}
}

function addRoute(url, method, callback) {
	var urlInfo = getVariables(url);
	if(urlInfo.variables.length == 0) {
		if(!routes[url]) {
			routes[url] = {};
		}
		routes[url][method] = callback;
	} else {
		var regexRoute = {};
		regexRoute.regex = urlInfo.regex;
		regexRoute.variables = urlInfo.variables;
		regexRoute.method = method;
		regexRoute.callback = callback;
		regexRoutes.push(regexRoute);
	}
}

function getVariables(url) {
	var regex, variables = [];
	var result = [];
	var sections = url.split("/");
	for (var i = 0, len = sections.length; i < len; i++) {
		var section = sections[i];
		
		result[i] = section;

		if(section.charAt(0) == ":") {
			variables.push({
				index : i,
				name : section.substring(1)
			});
			result[i] =  "\\w+";
		}
	}

	var resultUrl = "";
	for(var i = 1, len = result.length; i < len; i++) {
		resultUrl += "/" + result[i] ; 
	}

	regex = new RegExp(resultUrl);

	return {
		regex : regex,
		variables : variables
	}
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
