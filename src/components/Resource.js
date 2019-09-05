import React, { Component } from 'react';

class Resource extends Component {
	render = () => {
		return <div>Details of resource {this.props.match.params.id}</div>;
	};
}

export default Resource;
