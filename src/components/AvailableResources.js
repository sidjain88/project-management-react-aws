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

	const isAllocated = (resource) => props.newAllocations.map((a) => a.type_id).includes(resource.type_id);

	return (
		<MaterialTable
			title={'Available Resources'}
			columns={state.columns}
			data={state.data}
			actions={[
				(rowData) => {
					return isAllocated(rowData)
						? {
								icon: 'add_circle',
								disabled: true
							}
						: {
								icon: 'add_circle',
								tooltip: 'Allocate to project',
								onClick: (event, rowData) => {
									console.log('####', rowData);
									props.onResourceAdd(rowData);
								}
							};
				},
				{
					icon: 'check_circle',
					hidden: props.isNewProject,
					isFreeAction: true,
					iconProps: { color: 'primary' },
					tooltip: 'Close',
					onClick: (event, rowData) => {
						props.onResourceAddComplete();
					}
				}
			]}
			editable={{
				//isEditable: (rowData) => props.newAllocations.map(a => a.type_id).includes(rowData.type_id),
			}}
			options={{
				actionsColumnIndex: 5,
				headerStyle: {
					backgroundColor: '#EEE'
				},
				rowStyle: {
					backgroundColor: '#FFF'
				}
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
