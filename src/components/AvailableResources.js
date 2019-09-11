import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/available-resources.json';

export default function MaterialTableDemo(props) {
	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Reporting Manager', field: 'manager' },
			{ title: 'Position', field: 'role' },
			{ title: 'Base Rate', field: 'rate', type: 'numeric' }
		],
		data: SampleData
	});

	return (
		<MaterialTable
			title={'Available Resources'}
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.type_id;
			}}
			actions={[
				{
					icon: 'add',
					tooltip: 'Add to Project',
					onClick: (event, rowData) => {
						console.log("####", rowData)
						props.onResourceAdd(rowData)
					}
				},
				{
					icon: 'check_circle',
					isFreeAction: true,
					tooltip: 'Close',
					onClick: (event, rowData) => {
						props.onResourceAddComplete();
					}
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
		/>
	);
}
