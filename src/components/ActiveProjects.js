import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/sample-projects.json';

export default function MaterialTableDemo(props) {
	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'id', hidden: true },
			{ title: 'Name', field: 'name' },
			{ title: 'Manager', field: 'manager' },
			{ title: 'Date Started', field: 'startDate', type: 'numeric' },
			{ title: 'Type', field: 'type', type: 'date' }
		],
		data: SampleData
	});

	return (
		<MaterialTable
			title="Active Projects"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				window.location = '/projects/' + rowData.id;
			}}
			//options={{
			//	actionsColumnIndex: 4
			//}}
			// actions={[
			// 	{
			// 		icon: 'view_column',
			// 		tooltip: 'View Project',
			// 		onClick: (event, rowData) => {
			// 			window.location = '/poject';
			// 		}
			// 	}
			// ]}
			detailPanel={() => <div>Extra project details (not detailed view)</div>}
			//editable={{
			//   onRowAdd: newData =>
			//     new Promise(resolve => {
			//       setTimeout(() => {
			//         resolve();
			//         const data = [...state.data];
			//         data.push(newData);
			//         setState({ ...state, data });
			//       }, 600);
			//     }),
			//onRowUpdate: (newData, oldData) =>
			//	new Promise((resolve) => {
			//		setTimeout(() => {
			//			resolve();
			//			const data = [ ...state.data ];
			//			data[data.indexOf(oldData)] = newData;
			//			setState({ ...state, data });
			//		}, 600);
			//	})
			//   onRowDelete: oldData =>
			//     new Promise(resolve => {
			//       setTimeout(() => {
			//         resolve();
			//         const data = [...state.data];
			//         data.splice(data.indexOf(oldData), 1);
			//         setState({ ...state, data });
			//       }, 600);
			//     }),
			//}}
		/>
	);
}
