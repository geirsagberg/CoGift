import React from 'react';

export default React.createClass({
	render() {
		return (
			<ul className="list">
				{
					this.props.gifts.map(gift => 
						<li className="gift">{gift}</li>
					)
				}
			</ul>
		);
	}
});