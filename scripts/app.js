var $ = require('jquery');
window['$'] = window['jQuery'] = $;
require('bootstrap');
var React = require('react');
require('./views/list');

React.render(
	<h1>Hello world!</h1>
	,
	document.getElementById('main')
);