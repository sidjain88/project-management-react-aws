import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/allocations.json';
import Delete from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

export default function MaterialTableDemo(props) {

	const {allocations, resources, updateAllocation, createAllocation, removeAllocation} = props;

	const resourceNames = {};

	resources.forEach(r => resourceNames[r.type_id] = r.name);

	const [ state, setState ] = React.useState({
		data: allocations,
		resourceColumns: [
			{ title: 'Id', field: 'type_id', hidden: true },
			{ title: 'Name', field: 'resource_id', defaultSort: 'asc', lookup: resourceNames },
			{ title: 'Role', field: 'role' },
			{ title: 'Project Rate', field: 'rate', type: 'numeric' },
			{ title: 'Required Hours', field: 'required_hours', type: 'numeric' }
		],
		resourceAddMode: false,
		archivalConfirmationOpen: false
	});

	return (
		<MaterialTable
			title={'Allocated Resources'}
			columns={state.resourceColumns}
			data={state.data}
			editable={{
				onRowAdd: newData =>
					new Promise(resolve => {
						setTimeout(() => {
							createAllocation(newData).then(() => {
								const data = [...state.data];
								data.push(newData);
								setState({ ...state, data });
								resolve();

							});
						}, 600);
					}),
				onRowUpdate: (newData, oldData) =>
					new Promise(resolve => {
						setTimeout(() => {
							updateAllocation(newData).then(() => {
								const data = [...state.data];
								data[data.indexOf(oldData)] = newData;
								setState({ ...state, data });
								resolve();
							});
						}, 600);
					}),
				onRowDelete: oldData =>
					new Promise(resolve => {
						setTimeout(() => {
							removeAllocation(oldData).then(() => {
								const data = [...state.data];
								data.splice(data.indexOf(oldData), 1);
								setState({ ...state, data });
								resolve();
							});
						}, 600);
					}),
			}}
			options={{
				actionsColumnIndex: 5,
				headerStyle: {
					backgroundColor: '#EEE'
				},
				rowStyle: {
					backgroundColor: '#FFF'
				},

			}}
			localization={{
				body: {
					editRow: {
						deleteText: 'Are you sure you want to remove this allocation?',
						saveTooltip:"Confirm",
						cancelTooltip:"Cancel"
					}
				}
			}}
			icons={{
				Delete: React.forwardRef((props, ref) => (
					<Tooltip title="Remove allocation">
						<Delete color="inherit" />
					</Tooltip>
				))
			}}
		/>
	);
}
