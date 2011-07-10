var $ = require("../lib/jqNode").$;

$("/").get(function(request, response) { 
	$.writeFile("index.html");
});

$.start();
