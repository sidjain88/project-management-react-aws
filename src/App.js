import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Routes from './navigation/Routes';
import TopNavigation from './navigation/TopNavigation';

const App = () => (
	<div>
		<BrowserRouter>
			<Container>
				<TopNavigation />
				<Routes />
			</Container>
		</BrowserRouter>
	</div>
);

export default App;