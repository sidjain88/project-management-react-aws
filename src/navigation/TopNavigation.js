import React from 'react';
import '../App.css';
import { NavLink as RouterLink } from 'react-router-dom';

export const TopNavigation = () => (
	<nav>
		<div className="Top-nav">
			<RouterLink activeClassName="active" to="/home">
				Home
			</RouterLink>
			<RouterLink activeClassName="active" to="/utilization">
				View Utilization
			</RouterLink>
			<RouterLink activeClassName="active" to="/projects/add">
				Add Project
			</RouterLink>
			<RouterLink activeClassName="active" to="/resources/add">
				Add Resource
			</RouterLink>
		</div>
	</nav>
);

export default TopNavigation;
