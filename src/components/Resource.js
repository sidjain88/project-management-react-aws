import React, { Component } from 'react';

class Resource extends Component {
	render = () => {
		return (
			<div>
				<h3>Details of resource {this.props.match.params.id}</h3>
				<h4>Active Projects</h4>
				<h4>Previous Projects</h4>
			</div>
		);
	};
}

export default Resource;
