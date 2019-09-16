import React from 'react';
import { Redirect } from 'react-router';
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
import Allocations from './Allocations';
import AvailableResources from './AvailableResources';
import NewAllocations from './NewAllocations';
import Tooltip from '@material-ui/core/Tooltip';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { queryItemsLatestVersionByTypeId, queryItemsLatestVersionByType, queryItemsLatestVersionByProjectId, queryTypeIdsByType } from '../graphql/queries';
import { updateItem, createItem, deleteItem } from '../graphql/mutations';
import {nextId} from '../util/IdGenerator';

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
	const { project, allocations, resources, typeIdsForProjects, typeIdsForAllocations, updateProject,
		 updateAllocation, createProject, createAllocation, archiveProjectGQL } = props;
	const data = isNewProject ? {} : project;

	const [ state, setState ] = React.useState({
		projectData: data,
		newAllocations: [],
		editMode: isNewProject || props.location.state.editMode,
		archivalConfirmationOpen: false,
		allocations: allocations,
		redirectProp : null
	});

	let oldState = Object.assign({}, state);

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
		oldState = Object.assign({}, state);
		setState({ ...state, editMode: true, newAllocations: [] });
	};

	const saveProject = async () => {
		const project = { ...state.projectData }; 
		isNewProject?  await createProject(project):await updateProject(project);
		cancelEditing();
	};

	const cancelEditing = () => {
		setState({ ...oldState, redirectProp: isNewProject ? {} : null , editMode: false, addAllocationMode: false });
	};

	const archiveProject = () => {
		toggleArchiveConfirmation();
	};

	const cancelArchival = () => {
		toggleArchiveConfirmation();
	};

	const confirmArchival = () => {
		toggleArchiveConfirmation();
		archiveProjectGQL({...state.projectData}).then(() => {
			state.redirectProp = {};
		});
	};

	const toggleArchiveConfirmation = () => {
		setState({ ...state, archivalConfirmationOpen: !state.archivalConfirmationOpen });
	};

	const formatDate = (date) => {
		return moment(date, 'YYYY-MM-DD').format('Do MMM YY');
	};

	const handleDateChange = (type) => (newDate) => {
		setState({ ...state, projectData: { ...state.projectData, [type]: newDate } });
	};

	const handleChange = (name) => (event) => {
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
										<IconButton aria-label="business">
											<BusinessIcon fontSize="large" color="primary" />
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
												<Tooltip title="Save project">
													<SaveIcon fontSize="large" />
												</Tooltip>
											) : (
												<Tooltip title="Edit project">
													<EditIcon fontSize="large" />
												</Tooltip>
											)}
										</IconButton>
									</Grid>
									<Grid item xs={2}>
										<IconButton color="default" onClick={onActionButtonTwoClick}>
											{state.editMode ? (
												<Tooltip title="Dischard changes">
													<CancelIcon fontSize="large" />
												</Tooltip>
											) : (
												<Tooltip title="Archive project">
													<ArchiveIcon fontSize="large" />
												</Tooltip>
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

	if(state.redirectProp){
		return (<Redirect to="/"/>);
	}

	return (
		<div className={classes.root}>
			<ProjectDetails />
			<div className="View-space" />
			<Allocations {...props} editMode={state.editMode}/>
			<ArchivalConfirmation />
		</div>
	);
}

export default withApollo(
	compose(
		graphql(gql(queryItemsLatestVersionByTypeId), {
			options: ({ match: { params: { id } } }) => ({
				variables: { type_id: id },
				fetchPolicy: 'cache-and-network'
			}),
			props: ({ data: { queryItemsLatestVersionByTypeId = { items: [] } } }) => ({
				project: queryItemsLatestVersionByTypeId.items[0]
			})
		}),
		graphql(gql(queryItemsLatestVersionByProjectId), {
			options: ({ match: { params: { id } } }) => ({
				variables: { project_id: id, type: 'allocation' },
				fetchPolicy: 'cache-and-network'
			}),
			props: ({ data: { queryItemsLatestVersionByProjectId = { items: [] } } }) => ({
				allocations: queryItemsLatestVersionByProjectId.items
			})
		}),
		graphql(gql(queryItemsLatestVersionByType), {
			options: () => ({
				variables: { type: 'resource' },
				fetchPolicy: 'cache-and-network'
			}),
			props: ({ data: { queryItemsLatestVersionByType = { items: [] } } }) => ({
				resources: queryItemsLatestVersionByType.items
			})
		}),
		graphql(gql(queryTypeIdsByType), {
			options: () => ({
				variables: { type: 'project' },
				fetchPolicy: 'cache-and-network'
			}),
			props: ({ data: { queryTypeIdsByType }}) => ({
				typeIdsForProjects: queryTypeIdsByType
			})
		}),
		graphql(gql(queryTypeIdsByType), {
			options: () => ({
				variables: { type: 'allocation' },
				fetchPolicy: 'cache-and-network'
			}),
			props: ({ data: { queryTypeIdsByType }}) => ({
				typeIdsForAllocations: queryTypeIdsByType
			})
		}),
		graphql(gql(updateItem), {
			props: (props) => ({
				updateProject: (project) => {
					delete project['__typename'];
					return props.mutate({
						update: (proxy, { data: { updateItem: proj } }) => {
							// Update query for current project
							const v1 = { type_id: proj.type_id };
							const d1 = proxy.readQuery({ query: gql(queryItemsLatestVersionByTypeId), variables: v1 });

							d1.queryItemsLatestVersionByTypeId.items = [ proj ];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByTypeId), variables: v1, data: d1 });

							// Update query for all projects
							const v2 = { type: 'project' };
							const d2 = proxy.readQuery({ query: gql(queryItemsLatestVersionByType), variables: v2 });

							d2.queryItemsLatestVersionByType.items = [
								...d2.queryItemsLatestVersionByType.items.filter(
									(p) => p.type_id !== proj.type_id || p.version !== proj.version
								),
								proj
							];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByType),variables: v2, data: d2 });
						},
						variables: { input: {...project} }
					});
				}
			})
		}),
		graphql(gql(updateItem), {
			props: (props) => ({
				updateAllocation: (allocation) => {
						delete allocation["tableData"];
						delete allocation["__typename"];
					return props.mutate({
						update: (proxy, { data: { updateItem: updatedAllocation } }) => {
							// Update query for all allocations
							const v1 = { project_id: updatedAllocation.project_id, type: "allocation" };
							const d1 = proxy.readQuery({ query : gql(queryItemsLatestVersionByProjectId), variables: v1 });
	
							d1.queryItemsLatestVersionByProjectId.items =  [ ...d1.queryItemsLatestVersionByProjectId.items.filter(p => p.type_id !== updatedAllocation.type_id || p.version !== updatedAllocation.version)  , updatedAllocation];
	
							proxy.writeQuery({ query : gql(queryItemsLatestVersionByProjectId), variables: v1, data: d1 });
						},
						variables: { input: {...allocation} }
					});
				}
			})
		}),
		graphql(gql(createItem), {
			props: (props) => ({
				createAllocation: (allocation) => {
					if(allocation.hasOwnProperty("tableData")){
						delete allocation["tableData"];
					}
					allocation.project_id = props.ownProps.project.type_id;
					allocation.type_id = nextId("allocation", props.ownProps.typeIdsForAllocations);
					allocation.version = 0;
					allocation.status="active";
					return props.mutate({
						update: (proxy, { data: { createItem: newAllocation } }) => {
							// Update query for all allocations
							const v1 = {type:"allocation", project_id: newAllocation.project_id };
							const d1 = proxy.readQuery({ query : gql(queryItemsLatestVersionByProjectId) , variables: v1 });
	
							d1.queryItemsLatestVersionByProjectId.items =  [ ...d1.queryItemsLatestVersionByProjectId.items.filter(p => p.type_id !== newAllocation.type_id || p.version !== newAllocation.version)  , newAllocation];
	
							proxy.writeQuery({ query : gql(queryItemsLatestVersionByProjectId) ,variables: v1, data: d1});
						},
						variables: { input: {...allocation} }
					});
				}
			})
		}),
		graphql(gql(createItem), {
			props: (props) => ({
				createProject: (project) => {
					project.type_id = nextId("project", props.ownProps.typeIdsForProjects);
					project.version = 0;
					project.status="active";
					return props.mutate({
						update: (proxy, { data: { createItem: newProject } }) => {
							// Update query for all project
							const v1 = { type: "project" };
							const d1 = proxy.readQuery({ query : gql(queryItemsLatestVersionByType) , variables: v1 });
	
							d1.queryItemsLatestVersionByType.items =  [ ...d1.queryItemsLatestVersionByType.items.filter(p => p.type_id !== newProject.type_id || p.version !== newProject.version)  , newProject];
	
							proxy.writeQuery({ query : gql(queryItemsLatestVersionByType) ,variables: v1, data: d1});
						},
						variables: { input: {...project} }
					});
				}
			})
		}),
		graphql(gql(updateItem), {
			props: (props) => ({
				removeAllocation: (allocation) => {
						delete allocation["tableData"];
						delete allocation["__typename"];
					return props.mutate({
						update: (proxy, { data: { updateItem: inactiveAllocation } }) => {
							// Update query for all allocations
							const v1 = { project_id: inactiveAllocation.project_id, type: "allocation" };
							const d1 = proxy.readQuery({ query : gql(queryItemsLatestVersionByProjectId), variables: v1 });
	
							d1.queryItemsLatestVersionByProjectId.items =  [ ...d1.queryItemsLatestVersionByProjectId.items.filter(p => p.type_id !== inactiveAllocation.type_id || p.version !== inactiveAllocation.version)];
	
							proxy.writeQuery({ query : gql(queryItemsLatestVersionByProjectId), variables: v1, data: d1 });
						},
						variables: { input: {...allocation, status:"inactive"} }
					});
				}
			})
		}),
		graphql(gql(updateItem), {
			props: (props) => ({
				archiveProjectGQL: (project) => {
					delete project['__typename'];
					return props.mutate({
						update: (proxy, { data: { updateItem: archivedProject } }) => {
							// Update query for current project
							const v1 = { type_id: archivedProject.type_id };
							const d1 = proxy.readQuery({ query: gql(queryItemsLatestVersionByTypeId), variables: v1 });

							d1.queryItemsLatestVersionByTypeId.items = [];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByTypeId), variables: v1, data: d1 });

							// Update query for all projects
							const v2 = { type: 'project' };
							const d2 = proxy.readQuery({ query: gql(queryItemsLatestVersionByType), variables: v2 });

							d2.queryItemsLatestVersionByType.items = [
								...d2.queryItemsLatestVersionByType.items.filter(
									(p) => p.type_id !== archivedProject.type_id || p.version !== archivedProject.version)
							];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByType), variables: v2, data: d2 });
						},
						variables: { input: {...project, status:"inactive"} },
						optimisticResponse:{
							data: {
								updateItem: {...project, status:"inactive", __typename: "Item"}
							}
						}
					});
				}
			})
		})
	)(Project)
);
