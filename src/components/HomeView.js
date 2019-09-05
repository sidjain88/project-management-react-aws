import React, { Component } from 'react';
import ActiveProjects from './ActiveProjects';
import ActiveResources from './ActiveResources';

import '../App.css';

class HomeView extends Component {
	render = () => {
		return (
			<div>
				<ActiveProjects />
				<div className="View-space" />
				<ActiveResources />
			</div>
		);
	};
}

export default HomeView;
