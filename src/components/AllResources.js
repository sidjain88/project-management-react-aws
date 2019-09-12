import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/all-resources.json';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { queryItemsLatestVersionByType } from '../graphql/queries';

function AllResources(props) {
	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Reporting Manager', field: 'manager' },
			{ title: 'Joined Date', field: 'start_date', type: 'date' }
		],
		data: props.resources
	});

	return (
		<MaterialTable
			title="All Resources"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.resource_id;
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
				fetchPolicy: 'network-only'
			}),
			props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
				resources: queryItemsLatestVersionByType.items
			})
		})
	)(AllResources)
);
