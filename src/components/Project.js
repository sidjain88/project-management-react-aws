import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import ArchiveIcon from '@material-ui/icons/Archive';
import IconButton from '@material-ui/core/IconButton';
import BusinessIcon from '@material-ui/icons/Business';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, InputAdornment, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import MaterialTable from 'material-table';
import ResourceData from '../data/sample-resources.json';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { queryItemsLatestVersionByTypeId } from '../graphql/queries';
import Allocations from './Allocations';
import AvailableResources from './AvailableResources';
import NewAllocations from './NewAllocations';

function Project(props) {
	const useStyles = makeStyles((theme) => ({
		root: {
			flexGrow: 1
		},
		fab: {
			margin: theme.spacing(1)
		},
		button: {
			margin: theme.spacing(1)
		},
		paper: {
			padding: theme.spacing(2),
			textAlign: 'center',
			color: theme.palette.text.primary
		},
		textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1)
		}
	}));

	const classes = useStyles();
	const isNewProject = props.match.params.id === '0';
	const { project } = props;

	console.log(props);

	const data = isNewProject ? {} : project;

	const [ state, setState ] = React.useState({
		projectData: data,
		newAllocations: [],
		resourceColumns: [
			{ title: 'Id', field: 'id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Joined Date', field: 'start_date', type: 'date' }
		],
		editMode: props.match.params.id === '0',
		resourceAddMode: false,
		archivalConfirmationOpen: false
	});

	const onActionButtonOneClick = () => {
		if (state.editMode) {
			saveProject();
		} else {
			editProject();
		}
	};

	const onActionButtonTwoClick = () => {
		if (state.editMode) {
			cancelEditing();
		} else {
			archiveProject();
		}
	};

	const editProject = () => {
		setState({ ...state, editMode: true });
	};

	const saveProject = () => {
		setState({ ...state, editMode: false });
	};

	const cancelEditing = () => {
		setState({ ...state, editMode: false });
	};

	const archiveProject = () => {
		toggleArchiveConfirmation();
	};

	const cancelArchival = () => {
		toggleArchiveConfirmation();
	};

	const confirmArchival = () => {
		toggleArchiveConfirmation();
		// Archive API call
		window.location = '/';
	};

	const toggleArchiveConfirmation = () => {
		setState({ ...state, archivalConfirmationOpen: !state.archivalConfirmationOpen });
	};

	const formatDate = (date) => {
		return moment(date).format('DD/MM/YYYY');
	};

	const handleDateChange = (type) => (newDate) => {
		setState({ ...state, projectData: { ...state.projectData, [type]: newDate } });
	};

	const handleChange = (name) => (event) => {
		console.log(name);
		setState({ ...state, projectData: { ...state.projectData, [name]: event.target.value } });
	};

	const ProjectDetails = () => (
		<div>
			{state.projectData && (
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Grid container spacing={2}>
							<Grid item xs={8}>
								<Grid container spacing={2}>
									<Grid item xs={1}>
										<IconButton color="default" aria-label="business">
											<BusinessIcon fontSize="large" />
										</IconButton>
									</Grid>
									<Grid item xs={11}>
										<TextField
											id="project_name"
											className={classes.textField}
											placeholder="Project Name"
											margin="normal"
											value={state.projectData.name}
											onChange={handleChange('name')}
											label={state.editMode ? 'Project Name' : null}
											inputProps={{
												'aria-label': 'bare',
												readOnly: !state.editMode
											}}
											fullWidth
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={4}>
								<Grid container justify="flex-end">
									<Grid item xs={2}>
										<IconButton color="primary" onClick={onActionButtonOneClick}>
											{state.editMode ? (
												<SaveIcon fontSize="default" />
											) : (
												<EditIcon fontSize="default" />
											)}
										</IconButton>
									</Grid>
									<Grid item xs={2}>
										<IconButton color="default" onClick={onActionButtonTwoClick}>
											{state.editMode ? (
												<CancelIcon fontSize="default" />
											) : (
												<ArchiveIcon fontSize="default" />
											)}
										</IconButton>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={4}>
						<Paper className={classes.paper}>
							<TextField
								id="project_manager"
								fullWidth
								label="Project Manager"
								value={state.projectData.manager}
								onChange={handleChange('manager')}
								className={classes.textField}
								margin="normal"
								variant={state.editMode ? 'standard' : 'outlined'}
								inputProps={{
									readOnly: !state.editMode
								}}
							/>
							<TextField
								id="project_type"
								fullWidth
								label="Type"
								value={state.projectData.project_type}
								onChange={handleChange('project_type')}
								className={classes.textField}
								margin="normal"
								variant={state.editMode ? 'standard' : 'outlined'}
								InputProps={{
									readOnly: !state.editMode
								}}
							/>
						</Paper>
					</Grid>
					<Grid item xs={4}>
						<Paper className={classes.paper}>
							<TextField
								id="budget"
								fullWidth
								label="Budget"
								value={state.projectData.budget}
								onChange={handleChange('budget')}
								className={classes.textField}
								margin="normal"
								variant={state.editMode ? 'standard' : 'outlined'}
								type="number"
								InputProps={{
									readOnly: !state.editMode,
									startAdornment: <InputAdornment position="start">AUD</InputAdornment>
								}}
							/>
							<TextField
								id="consumed_budget"
								fullWidth
								label="Consumed Budget"
								value={state.projectData.consumed_budget}
								onChange={handleChange('consumed_budget')}
								className={classes.textField}
								margin="normal"
								variant={state.editMode ? 'standard' : 'outlined'}
								type="number"
								InputProps={{
									readOnly: !state.editMode,
									startAdornment: <InputAdornment position="start">AUD</InputAdornment>
								}}
							/>
						</Paper>
					</Grid>
					<Grid item xs={4}>
						<Paper className={classes.paper}>
							{state.editMode ? (
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<Grid container justify="space-around">
										<KeyboardDatePicker
											fullWidth
											variant="inline"
											format="dd/MM/yyyy"
											margin="normal"
											label="Start Date"
											value={state.projectData.start_date}
											onChange={handleDateChange('start_date')}
											KeyboardButtonProps={{
												'aria-label': 'change date'
											}}
										/>
										<KeyboardDatePicker
											fullWidth
											variant="inline"
											format="dd/MM/yyyy"
											margin="normal"
											label="End Date"
											value={state.projectData.end_date}
											onChange={handleDateChange('end_date')}
											KeyboardButtonProps={{
												'aria-label': 'change date'
											}}
										/>
									</Grid>
								</MuiPickersUtilsProvider>
							) : (
								<div>
									<TextField
										id="start_date"
										fullWidth
										label="Start Date"
										value={formatDate(state.projectData.start_date)}
										className={classes.textField}
										margin="normal"
										variant={state.editMode ? 'filled' : 'outlined'}
										InputProps={{
											readOnly: !state.editMode
										}}
									/>
									<TextField
										id="end_date"
										label="End Date"
										value={formatDate(state.projectData.end_date)}
										className={classes.textField}
										margin="normal"
										fullWidth
										variant={state.editMode ? 'filled' : 'outlined'}
										InputProps={{
											readOnly: !state.editMode
										}}
									/>
								</div>
							)}
						</Paper>
					</Grid>
				</Grid>
			)}
		</div>
	);

	const resourceAddMode = () => {
		return state.editMode || isNewProject;
	};

	// const ActiveResources = () => (
	// 	<MaterialTable
	// 		title={(isNewProject ? 'Available' : 'Active') + ' Resources'}
	// 		columns={state.resourceColumns}
	// 		data={state.activeResources}
	// 		onRowClick={(event, rowData) => {
	// 			window.location = '/resources/' + rowData.id;
	// 		}}
	// 		actions={
	// 			state.editMode ? (
	// 				[
	// 					{
	// 						icon: 'add_box',
	// 						isFreeAction: true,
	// 						tooltip: 'Add New Resources',
	// 						onClick: (event, rowData) => {
	// 							// Fetch new resources to put in this table
	// 							setState({ ...state, resourceAddMode: true });
	// 						}
	// 					},
	// 					{
	// 						icon: 'edit',
	// 						tooltip: 'Edit Resource',
	// 						onClick: (event, rowData) => {}
	// 					},
	// 					{
	// 						icon: 'delete',
	// 						tooltip: 'Remove Resource',
	// 						onClick: (event, rowData) => {}
	// 					}
	// 				]
	// 			) : (
	// 				[]
	// 			)
	// 		}
	// 		options={{
	// 			actionsColumnIndex: 2
	// 		}}
	// 		localization={{
	// 			body: {
	// 				editRow: {
	// 					deleteText: 'Are you sure you want to remove this resource?'
	// 				}
	// 			}
	// 		}}
	// 		editable={
	// 			state.editMode ? (
	// 				{
	// 					// onRowUpdate: (oldData) =>
	// 					// 	new Promise((resolve) => {
	// 					// 		setTimeout(() => {
	// 					// 			resolve();
	// 					// 			const data = [ ...state.data ];
	// 					// 			data.splice(data.indexOf(oldData), 1);
	// 					// 			setState({ ...state, data });
	// 					// 		}, 600);
	// 					// 	}),
	// 					// onRowDelete: (oldData) =>
	// 					// 	new Promise((resolve) => {
	// 					// 		setTimeout(() => {
	// 					// 			resolve();
	// 					// 			const data = [ ...state.data ];
	// 					// 			data.splice(data.indexOf(oldData), 1);
	// 					// 			setState({ ...state, data });
	// 					// 		}, 600);
	// 					// 	})
	// 				}
	// 			) : (
	// 				{}
	// 			)
	// 		}
	// 	/>
	// );

	const ArchivalConfirmation = () => (
		<Dialog
			open={state.archivalConfirmationOpen}
			onClose={cancelArchival}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{'Project Archival'}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Are you sure you want to archive this project?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={cancelArchival} color="primary">
					Cancel
				</Button>
				<Button onClick={confirmArchival} color="primary" autoFocus>
					Archive
				</Button>
			</DialogActions>
		</Dialog>
	);

	const onResourceAddStart = () => {
		setState({...state, resourceAddMode: true})
	}

	const onResourceAdd = (newAllocation) => {
		setState({...state, newAllocations: [...state.newAllocations, newAllocation] })
		console.log("####@@@", state);

	}

	const onResourceAddComplete = () => {
		setState({...state, resourceAddMode: false})
	}

	return (
		<div className={classes.root}>
			<ProjectDetails />
			<div className="View-space" />
			{!state.resourceAddMode && <Allocations editMode={state.editMode} onResourceAddStart={onResourceAddStart} />}
			{state.resourceAddMode && <AvailableResources onResourceAdd={onResourceAdd} onResourceAddComplete={onResourceAddComplete} />}
			{state.editMode &&
			state.newAllocations.length > 0 && (
				<div>
					<div className="View-space" />
					<NewAllocations allocations={state.newAllocations} />
				</div>
			)}
			<ArchivalConfirmation />
		</div>
	);
}

export default withApollo(
	compose(
		graphql(gql(queryItemsLatestVersionByTypeId), {
			options: ({ match: { params: { id } } }) => ({
				variables: { type_id: id },
				fetchPolicy: 'network-only'
			}),
			props: ({ data: { queryItemsLatestVersionByTypeId = { items: [] } } }) => ({
				project: queryItemsLatestVersionByTypeId.items[0]
			})
		})
	)(Project)
);
