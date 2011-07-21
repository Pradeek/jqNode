var $ = require("../lib/jqNode").$;

$("/").get(function(request, response) { 
	$.writeFile("index.html");
});

$("/test").post(function(request, response, data) {
	console.log(data);
});

$.start(8888, true);
