import React from 'react';

export default React.createClass({
  render() {
    return (
      <ul className="list">
				{
					this.props.gifts.map((gift, index) => 
						<li className="gift" key={ index }>{ gift }</li>)
				}
			</ul>
    );
  }
});
