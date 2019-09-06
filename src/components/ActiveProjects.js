import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/sample-projects.json';
import Project from './Project.js';

export default function MaterialTableDemo(props) {
	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'project_id', hidden: true },
			{ title: 'Name', field: 'name' },
			{ title: 'Manager', field: 'manager' },
			{ title: 'Type', field: 'project_type' },
			{
				title: 'Date Started',
				field: 'start_date',
				type: 'date',
				defaultSort: 'desc',
				customSort: (a, b) => a.startDate - b.startDate
			},
			{
				title: 'End Date',
				field: 'end_date',
				type: 'date',
				customSort: (a, b) => a.startDate - b.startDate
			}
		],
		data: SampleData.map((entry) =>
			Object.assign(entry, { startDate: new Date(entry.startDate), endDate: new Date(entry.endDate) })
		)
	});

	return (
		<MaterialTable
			title="Active Projects"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				window.location = '/projects/' + rowData.id;
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
						alert('Add Project Popup');
					}
				}
			]}
			//detailPanel={() => (<div>More project details</div>)}
			editable={{
				// onRowAdd: (newData) =>
				// 	new Promise((resolve) => {
				// 		setTimeout(() => {
				// 			resolve();
				// 			const data = [ ...state.data ];
				// 			data.push(newData);
				// 			setState({ ...state, data });
				// 		}, 600);
				// 	}),
				onRowUpdate: (newData, oldData) =>
					new Promise((resolve) => {
						setTimeout(() => {
							resolve();
							const data = [ ...state.data ];
							data[data.indexOf(oldData)] = newData;
							setState({ ...state, data });
						}, 600);
					}),
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
		/>
	);
}
