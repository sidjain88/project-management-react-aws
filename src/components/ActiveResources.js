import React from 'react';
import MaterialTable from 'material-table';
import SampleData from '../data/sample-resources.json'

export default function MaterialTableDemo() {
  const [state, setState] = React.useState({
    columns: [
      { title: 'Id', field: 'id', hidden: true },
      { title: 'Name', field: 'name' },
      { title: 'Manager', field: 'manager' },
      { title: 'Role', field: 'role' },
      { title: 'Joined Date', field: 'startDate', type: 'date' }
    ],
    data: SampleData
  });

  return (
    <MaterialTable
      title="Active Resources"
      columns={state.columns}
      data={state.data}
      onRowClick={()=> {alert("hi")}}
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
