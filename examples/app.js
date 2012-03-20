var $ = require("../lib/jqNode").$;

$("/").get(function(request, response) { 
	$.writeFile("index.html")
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
