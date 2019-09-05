import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomeView from '../components/HomeView';
import Project from '../components/Project';
import Utilization from '../components/Utilization';

const Routes = () => (
	<Switch>
		<Route exact path="/" to="home" />
		<Route path="/home" component={HomeView} />
		<Route path="/utilization" component={Utilization} />
		<Route path="/project/:id" component={Project} />
	</Switch>
);

export default Routes;
