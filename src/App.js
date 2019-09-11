import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Routes from './navigation/Routes';
import TopNavigation from './navigation/TopNavigation';
import awsmobile from './aws-exports';
import { ApolloProvider } from "react-apollo";
import AWSAppSyncClient, { defaultDataIdFromObject } from "aws-appsync";
import { Rehydrated } from "aws-appsync-react";


const client = new AWSAppSyncClient({
	url: awsmobile.aws_appsync_graphqlEndpoint,
	region: awsmobile.aws_appsync_region,
	auth: {
	  type: awsmobile.aws_appsync_authenticationType,
	  apiKey: awsmobile.aws_appsync_apiKey,
	},
	cacheOptions: {
	  dataIdFromObject: (obj) => 
	  defaultDataIdFromObject(obj)
	}
});
  
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
const WithProvider = () => (
	<ApolloProvider client={client}>
	  <Rehydrated>
		<App />
	  </Rehydrated>
	</ApolloProvider>
  );
  
  export default WithProvider;