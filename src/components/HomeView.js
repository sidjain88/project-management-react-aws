import React, { Component } from 'react';
import ActiveProjects from './ActiveProjects';
import AllResources from './AllResources';

import '../App.css';

class HomeView extends Component {
	render = () => {
		return (
			<div>
				<ActiveProjects />
				<div className="View-space" />
				<AllResources />
				<div className="View-space" />
			</div>
		);
	};
}

export default HomeView;
