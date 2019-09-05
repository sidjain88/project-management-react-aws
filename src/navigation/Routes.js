import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomeView from '../components/HomeView';
import Project from '../components/Project';
import Utilization from '../components/Utilization';
import Resource from '../components/Resource';

const Routes = () => (
	<Switch>
		<Route exact path="/" to="home" />
		<Route path="/home" component={HomeView} />
		<Route path="/utilization" component={Utilization} />
		<Route path="/projects/:id" component={Project} />}
		<Route path="/resources/:id" component={Resource} />}/>
	</Switch>
);

export default Routes;
