import React from 'react';
import MaterialTable from 'material-table';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { queryItemsLatestVersionByType } from '../graphql/queries';
import { Redirect } from 'react-router';
import ArchiveIcon from '@material-ui/icons/Archive';
import Tooltip from '@material-ui/core/Tooltip';
import { updateItem, createItem, deleteItem } from '../graphql/mutations';

function AllResources(props) {
	const {  archiveResourceGQL } = props;

	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'type_id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Base Rate', field: 'base_rate' },
			{ title: 'Domain', field: 'domain' }
		],
		data: props.resources,
		redirectProp: null
	});



	if(state.redirectProp) {
		return (
			<Redirect to={{pathname: "/resources/" + state.redirectProp.id , state: {editMode : state.redirectProp.editMode}}}></Redirect>
		);
	}

	return (
		<MaterialTable
			title="Active Resources"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				setState({...state, redirectProp : {id : rowData.type_id, editMode: false}});
			}}
			options={{
				sorting: true,
				actionsColumnIndex: 3,
				headerStyle: {
					backgroundColor: '#EEE'
				},
				rowStyle: {
					backgroundColor: '#FFF'
				}
			}}
			actions={[
				{
					icon: 'add_box',
					iconProps: { color: 'primary' },
					isFreeAction: true,
					tooltip: 'Add Resource',
					onClick: (event, rowData) => {
						setState({...state, redirectProp : {id : "0"}});
					}
				},
				{
					icon: 'edit',
					tooltip: 'Edit Resource',
					onClick: (event, rowData) => {
						setState({...state, redirectProp : {id : rowData.type_id, editMode: true}});
					}
				}
			]}
			editable={{
				onRowDelete: (oldData) =>
					new Promise((resolve) => {
						setTimeout(() => {
							archiveResourceGQL({...oldData}).then(() => {
								const data = [ ...state.data ];
								data.splice(data.indexOf(oldData), 1);
								setState({ ...state, data });
								resolve();
							});
						}, 600);
					})
			}}
			localization={{
				body: {
					editRow: {
						deleteText: 'Are you sure you want to archive this resource?'
					}
				}
			}}
			icons={{
				Delete: React.forwardRef((props, ref) => (
					<Tooltip title="Archive Resource">
						<ArchiveIcon />
					</Tooltip>
				))
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
		}),
		graphql(gql(updateItem), {
			props: (props) => ({
				archiveResourceGQL: (resource) => {
					delete resource['__typename'];
					delete resource['tableData'];
					return props.mutate({
						update: (proxy, { data: { updateItem: archivedResource } }) => {
							// Update query for all resources
							const v2 = { type: 'resource' };
							const d2 = proxy.readQuery({ query: gql(queryItemsLatestVersionByType), variables: v2 });

							d2.queryItemsLatestVersionByType.items = [
								...d2.queryItemsLatestVersionByType.items.filter(
									(p) => p.type_id !== archivedResource.type_id || p.version !== archivedResource.version)
							];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByType), variables: v2, data: d2 });
						},
						variables: { input: {...resource, status:"inactive"} }
					});
				}
			})
		})
	)(AllResources)
);
