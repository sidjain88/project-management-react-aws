import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomeView from '../components/HomeView';
import Project from '../components/Project';
import Resource from '../components/Resource';
import { Utilization } from '../components/Utilization';

const Routes = () => (
	<Switch>
		<Redirect exact path="/" to="/home" />
		<Route path="/home" component={HomeView} />
		<Route path="/utilization" component={Utilization} />
		<Route path="/projects/:id" render={(props) => <Project {...props}  />} />
		<Route path="/resources/:id" render={(props) => <Resource {...props}  />} />
	</Switch>
);

export default Routes;
