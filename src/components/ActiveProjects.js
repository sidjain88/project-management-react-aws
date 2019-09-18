import React from 'react';
import { Redirect } from 'react-router';
import MaterialTable from 'material-table';
import Icon from '@material-ui/core/Icon';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import ArchiveIcon from '@material-ui/icons/Archive';
import Tooltip from '@material-ui/core/Tooltip';
import {ArchivalConfirmation} from './ArchiveConfirmation';
import { queryItemsLatestVersionByTypeId, queryItemsLatestVersionByType, queryItemsLatestVersionByProjectId, queryTypeIdsByType } from '../graphql/queries';
import { updateItem, createItem, deleteItem } from '../graphql/mutations';

function ActiveProjects(props) {
	const { projects, archiveProjectGQL } = props;

	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'type_id', hidden: true },
			{ title: 'Name', field: 'name' },
			{ title: 'Manager', field: 'manager' },
			{ title: 'Type', field: 'project_type' },
			{
				title: 'Date Started',
				field: 'start_date',
				type: 'date',
				defaultSort: 'desc',
				customSort: (a, b) => a.start_date - b.start_date
			},
			{
				title: 'End Date',
				field: 'end_date',
				type: 'date',
				customSort: (a, b) => a.start_date - b.start_date
			}
		],
		data: projects.map((entry) =>
			Object.assign(entry, { start_date: new Date(entry.start_date), end_date: new Date(entry.end_date) })
		),
		redirectProp : null,
		archivalConfirmationOpen : false
	});

	if(state.redirectProp) {
		return (
			<Redirect to={{pathname: "/projects/" + state.redirectProp.id , state: {editMode : state.redirectProp.editMode}}}></Redirect>
		);
	}

	return (
		<MaterialTable
			title="Ongoing Projects"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				setState({...state, redirectProp : {id : rowData.type_id, editMode: false}});
			}}
			options={{
				sorting: true,
				actionsColumnIndex: 5,
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
					tooltip: 'Add project',
					onClick: (event, rowData) => {
						setState({...state, redirectProp : {id : "0"}});
					}
				},
				{
					icon: 'edit',
					tooltip: 'Edit project',
					onClick: (event, rowData) => {
						setState({...state, redirectProp : {id : rowData.type_id, editMode: true}});
					}
				}
			]}
			editable={{
				onRowDelete: (oldData) =>
					new Promise((resolve) => {
						setTimeout(() => {
							archiveProjectGQL({...oldData}).then(() => {
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
						deleteText: 'Are you sure you want to archive this project?'
					}
				}
			}}
			icons={{
				Delete: React.forwardRef((props, ref) => (
					<Tooltip title="Archive project">
						<ArchiveIcon />
					</Tooltip>
				))
			}}
		/>
	);
}

const ActiveProjectsWithData = withApollo(
	compose(
		graphql(gql(queryItemsLatestVersionByType), {
			options: () => ({
				variables: { type: 'project' },
				fetchPolicy: 'cache-and-network'
			}),
			props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
				projects: queryItemsLatestVersionByType.items
			})
		}),
		graphql(gql(updateItem), {
			props: (props) => ({
				archiveProjectGQL: (project) => {
					delete project['__typename'];
					delete project['tableData'];
					return props.mutate({
						update: (proxy, { data: { updateItem: archivedProject } }) => {
							// Update query for all projects
							const v2 = { type: 'project' };
							const d2 = proxy.readQuery({ query: gql(queryItemsLatestVersionByType), variables: v2 });

							d2.queryItemsLatestVersionByType.items = [
								...d2.queryItemsLatestVersionByType.items.filter(
									(p) => p.type_id !== archivedProject.type_id || p.version !== archivedProject.version)
							];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByType), variables: v2, data: d2 });
						},
						variables: { input: {...project, status:"inactive"} }
					});
				}
			})
		})
	)(ActiveProjects)
);

export default ActiveProjectsWithData;
