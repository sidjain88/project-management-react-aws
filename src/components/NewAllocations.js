import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/available-resources.json';

export default function MaterialTableDemo(props) {
	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'type_id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Reporting Manager', field: 'manager' },
			{ title: 'Position', field: 'role' },
			{ title: 'Base Rate', field: 'rate', type: 'numeric' }
		]
	});

	console.log('****', props);

	return (
		<MaterialTable
			title="New Allocations"
			columns={state.columns}
			data={props.allocations}
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.id;
			}}
			actions={[
				{
					icon: 'edit',
					tooltip: 'Edit allocation details',
					onClick: (event, rowData) => {}
				},
				{
					icon: 'delete',
					tooltip: 'Remove allocation',
					onClick: (event, rowData) => {}
				}
			]}
			options={{
				actionsColumnIndex: 5
			}}
			localization={{
				body: {
					editRow: {
						deleteText: 'Are you sure you want to remove this resource?'
					}
				}
			}}
			editable={{
				// 	onRowUpdate: (oldData) =>
				// 		new Promise((resolve) => {
				// 			setTimeout(() => {
				// 				resolve();
				// 				const data = [ ...state.data ];
				// 				data.splice(data.indexOf(oldData), 1);
				// 				setState({ ...state, data });
				// 			}, 600);
				// 		}),
				// 	onRowDelete: (oldData) =>
				// 		new Promise((resolve) => {
				// 			setTimeout(() => {
				// 				resolve();
				// 				const data = [ ...state.data ];
				// 				data.splice(data.indexOf(oldData), 1);
				// 				setState({ ...state, data });
				// 			}, 600);
				// 		})
			}}
		/>
	);
}
