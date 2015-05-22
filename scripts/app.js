import $ from 'jquery';
window['$'] = window['jQuery'] = $;
require('bootstrap');
import React from 'react';
import List from './views/list';
import ReactFireMixin from 'reactfire';

var gifts = ["Snowboard", "Camera", "Bed"];

var App = React.createClass({
	render(){
		return (
			<div>
				<input />
				<List gifts={gifts} />
			</div>
		);
	}
})

React.render(<App />,	document.getElementById('main'));