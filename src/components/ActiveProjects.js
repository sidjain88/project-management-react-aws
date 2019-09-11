import React, { Component } from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/sample-projects.json';
import Icon from '@material-ui/core/Icon';
import { graphql, compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { queryItemsLatestVersionByType } from "../graphql/queries";

function ActiveProjects(props){


		const {projects} = props;

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
			Object.assign(entry, { start_date: new Date(entry.start_date), end_date: new Date(entry.end_date) }))
		});

	return (
		<MaterialTable
			title="Ongoing Projects"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				window.location = '/projects/' + rowData.type_id;
			}}
			options={{
				sorting: true,
				actionsColumnIndex: 5
			}}
			actions={[
				{
					icon: 'add',
					isFreeAction: true,
					tooltip: 'Add Project',
					onClick: (event, rowData) => {
						window.location = '/projects/0';
					}
				},
				{
					icon: 'edit',
					tooltip: 'Edit Project',
					onClick: (event, rowData) => {
						//window.location = '/projects/' + rowData.type_id;
						this.props.history.push({
							pathname: '/projects/' + rowData.type_id,
							data: {
								editMode: true
							}
						  })
					}
				},
			]}
			editable={{
				onRowDelete: (oldData) =>
					new Promise((resolve) => {
						setTimeout(() => {
							resolve();
							const data = [ ...state.data ];
							data.splice(data.indexOf(oldData), 1);
							setState({ ...state, data });
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
				Delete: React.forwardRef((props, ref) => <Icon {...props} ref={ref}>archive</Icon>)
			}}
		/>
		);

	
}



const ActiveProjectsWithData = withApollo(compose(
    graphql(
        gql(queryItemsLatestVersionByType),
    {
        options: () => ({
            variables: {  type: "project" },
            fetchPolicy: 'network-only',
        }),
        props: ({ data: { queryItemsLatestVersionByType= {items: []} } }) => ({
            projects : queryItemsLatestVersionByType.items
        }),
    }
)
)(ActiveProjects));

export default ActiveProjectsWithData;