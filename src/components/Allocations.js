import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/allocations.json';
import Delete from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

export default function MaterialTableDemo(props) {

	const {allocations, resources} = props;
	
	allocations.forEach(a => {
		a.resource = resources.find(r => r.type_id === a.resource_id);
	});

	let showAllocationSaveIcon = false;

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
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.id;
			}}
			actions={[
				{
					icon: 'save',
					hidden: !state.showAllocationSaveIcon,
					isFreeAction: true,
					iconProps: { color: 'primary' },
					tooltip: 'Save Changes',
					onClick: (event, rowData) => {
						props.onResourceAddStart();
					}
				},
			]}
			editable={{
				onRowAdd: newData =>
					new Promise(resolve => {
						setTimeout(() => {
							resolve();
							const data = [...state.data];
							data.push(newData);
							setState({ ...state, data, showAllocationSaveIcon : true });
						}, 600);
					}),
				onRowUpdate: (newData, oldData) =>
					new Promise(resolve => {
						setTimeout(() => {
							resolve();
							const data = [...state.data];
							data[data.indexOf(oldData)] = newData;
							setState({ ...state, data, showAllocationSaveIcon : true });
						}, 600);
					}),
				onRowDelete: oldData =>
					new Promise(resolve => {
						setTimeout(() => {
							resolve();
							const data = [...state.data];
							data.splice(data.indexOf(oldData), 1);
							setState({ ...state, data, showAllocationSaveIcon : true });
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
				}
			}}
			localization={{
				body: {
					editRow: {
						deleteText: 'Are you sure you want to remove this allocation?'
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
