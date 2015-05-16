/// <reference path="typings/tsd.d.ts" />
var express = require('express');
var app = express();
app.use(express.static("./public"));
var port = 3000;
var server = app.listen(port, function () {
    console.log("Listening at http://localhost:" + port);
});
