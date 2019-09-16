import React from 'react';
import MaterialTable from 'material-table';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { queryItemsLatestVersionByType } from '../graphql/queries';

function AllResources(props) {
	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'type_id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Base Rate', field: 'rate' },
			{ title: 'Domain', field: 'domain' }
		],
		data: props.resources
	});

	return (
		<MaterialTable
			title="All Resources"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.type_id;
			}}
			options={{
				headerStyle: {
					backgroundColor: '#EEE'
				},
				rowStyle: {
					backgroundColor: '#FFF'
				}
			}}
		/>
	);
}

export default withApollo(
	compose(
		graphql(gql(queryItemsLatestVersionByType), {
			options: () => ({
				variables: { type: 'resource' },
				fetchPolicy: 'cache-and-network'
			}),
			props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
				resources: queryItemsLatestVersionByType.items
			})
		})
	)(AllResources)
);
