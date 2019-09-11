import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/allocations.json';
import Delete from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

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
			actions={[
				{
					icon: 'add_box',
					hidden: !props.editMode,
					isFreeAction: true,
					iconProps: { color: 'primary' },
					tooltip: 'Add new allocation',
					onClick: (event, rowData) => {
						props.onResourceAddStart();
					}
				},
				{
					icon: 'edit',
					hidden: !props.editMode,
					tooltip: 'Edit allocation',
					onClick: (event, rowData) => {
						//window.location = '/projects/' + rowData.type_id;
						this.props.history.push({
							pathname: '/resource/' + rowData.type_id,
							data: {
								editMode: true
							}
						});
					}
				}
			]}
			editable={{
				onRowDelete: props.editMode
					? (oldData) =>
							new Promise((resolve) => {
								setTimeout(() => {
									resolve();
									const data = [ ...state.data ];
									data.splice(data.indexOf(oldData), 1);
									setState({ ...state, data });
								}, 600);
							})
					: null
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
