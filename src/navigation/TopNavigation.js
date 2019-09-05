import React from 'react';
import '../App.css';
import { NavLink } from 'react-router-dom';

export const TopNavigation = () => (
	<nav>
		<div className="Top-nav">
			<NavLink activeClassName="active" to="/home">
				Home
			</NavLink>
			<NavLink activeClassName="active" to="/utilization">
				View Utilization
			</NavLink>
			<NavLink activeClassName="active" to="/projects/0">
				Add Project
			</NavLink>
			<NavLink activeClassName="active" to="/resources/0">
				Add Resource
			</NavLink>
		</div>
	</nav>
);

export default TopNavigation;
