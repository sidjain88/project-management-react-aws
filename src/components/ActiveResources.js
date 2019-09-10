import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/sample-resources.json';

export default function MaterialTableDemo() {
	const [ state, setState ] = React.useState({
		columns: [
			{ title: 'Id', field: 'id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Joined Date', field: 'start_date', type: 'date' }
		],
		data: SampleData.map((entry) => Object.assign(entry, { start_date: new Date(entry.start_date) }))
	});

	return (
		<MaterialTable
			title="All Resources"
			columns={state.columns}
			data={state.data}
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.resource_id;
			}}
		/>
	);
}
