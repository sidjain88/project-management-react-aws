import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import ArchiveIcon from '@material-ui/icons/Archive';
import IconButton from '@material-ui/core/IconButton';
import BusinessIcon from '@material-ui/icons/Business';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, InputAdornment, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ActiveResources from './ActiveResources';
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

const Project = (props) => {
	const classes = useStyles();
	const isNewProject = props.match.params.id === '0';

	const sampleData =
	isNewProject
			? {}
			: {
					name: 'Latitude Financial Services 1',
					manager: 'Alex Smith',
					budget: 200000,
					consumed_budget: 75000,
					project_type: 'Client Project Type 2',
					start_date: new Date('2017-07-25'),
					end_date: new Date('2021-06-30')
				};

	const [ state, setState ] = React.useState({
		projectData: sampleData,
		resourceData: ResourceData.map((entry) => Object.assign(entry, { start_date: new Date(entry.start_date) })),
		resourceColumns: [
			{ title: 'Id', field: 'id', hidden: true },
			{ title: 'Name', field: 'name', defaultSort: 'asc' },
			{ title: 'Joined Date', field: 'start_date', type: 'date' }
		],
		editMode: props.match.params.id === '0',
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
									{state.editMode ? <SaveIcon fontSize="medium" /> : <EditIcon fontSize="medium" />}
								</IconButton>
							</Grid>
							<Grid item xs={2}>
								<IconButton color="default" onClick={onActionButtonTwoClick}>
									{state.editMode ? (
										<CancelIcon fontSize="medium" />
									) : (
										<ArchiveIcon fontSize="medium" />
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
	);

	const Resources = () => (
		<MaterialTable
			title={(isNewProject ? "Available" : "Active") + " Resources"}
			columns={state.resourceColumns}
			data={state.resourceData}
			onRowClick={(event, rowData) => {
				window.location = '/resources/' + rowData.id;
			}}
			actions={isNewProject ? [
				{
					icon: 'add',
					tooltip: 'Add to Project',
					onClick: (event, rowData) => {
					}
				}
			] : [
				{
					icon: 'add',
					isFreeAction: true,
					tooltip: 'Add to Project',
					onClick: (event, rowData) => {
					}
				},
				{
					icon: 'delete',
					tooltip: 'Remove from Project',
					onClick: (event, rowData) => {
					}
				}
			]}
			options={{
				actionsColumnIndex: 2
			}}
		/>
	);

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

	return (
		<div className={classes.root}>
			<ProjectDetails />
			<div className="View-space" />
			<Resources />
			<ArchivalConfirmation />
		</div>
	);
};

export default Project;
