/// <reference path="typings/tsd.d.ts" />
import express = require('express');
import path = require('path');

var app = express();
app.use('/', express.static(__dirname + "/public"));

var port = 3000;

var server = app.listen(port, () => {
	console.log("Listening at http://localhost:" + port);
});