import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/allocations.json';

export default function MaterialTableDemo(props) {

	const [ state, setState ] = React.useState({
		activeResources: SampleData.map((entry) => Object.assign(entry, { start_date: new Date(entry.start_date) })),
		resourceColumns: [
			{ title: 'Id', field: 'id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Joined Date', field: 'start_date', type: 'date' },
			{ title: 'Role', field: 'role' },
			{ title: 'Project Rate', field: 'rate', type: 'numeric' }
		],
		resourceAddMode: false,
		archivalConfirmationOpen: false
	});

	return (
		<MaterialTable
			title={'Allocations'}
			columns={state.resourceColumns}
			data={state.activeResources}
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.id;
			}}
			actions={
				props.editMode ? (
					[
						{
							icon: 'add_box',
							isFreeAction: true,
							tooltip: 'Add New Resources',
							onClick: (event, rowData) => {
								props.onResourceAddStart();
							}
						},
						{
							icon: 'edit',
							tooltip: 'Edit Resource',
							onClick: (event, rowData) => {}
						},
						{
							icon: 'delete',
							tooltip: 'Remove Resource',
							onClick: (event, rowData) => {}
						}
					]
				) : (
					[]
				)
			}
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
