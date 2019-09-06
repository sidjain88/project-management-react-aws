import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/sample-resources.json';

export default function MaterialTableDemo() {
	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Manager', field: 'manager' },
			{ title: 'Role', field: 'role' },
			{ title: 'Joined Date', field: 'start_date', type: 'date' }
		],
		data: SampleData.map((entry) => Object.assign(entry, { start_date: new Date(entry.start_date) }))
	});

	return (
		<MaterialTable
			title="Active Resources"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.id;
			}}
			// editable={{
			//   onRowAdd: newData =>
			//     new Promise(resolve => {
			//       setTimeout(() => {
			//         resolve();
			//         const data = [...state.data];
			//         data.push(newData);
			//         setState({ ...state, data });
			//       }, 600);
			//     }),
			//   onRowUpdate: (newData, oldData) =>
			//     new Promise(resolve => {
			//       setTimeout(() => {
			//         resolve();
			//         const data = [...state.data];
			//         data[data.indexOf(oldData)] = newData;
			//         setState({ ...state, data });
			//       }, 600);
			//     }),
			//   onRowDelete: oldData =>
			//     new Promise(resolve => {
			//       setTimeout(() => {
			//         resolve();
			//         const data = [...state.data];
			//         data.splice(data.indexOf(oldData), 1);
			//         setState({ ...state, data });
			//       }, 600);
			//     }),
			// }}
		/>
	);
}
