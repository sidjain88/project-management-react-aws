import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Chart, ArgumentAxis, ValueAxis, LineSeries, Legend, ZoomAndPan } from '@devexpress/dx-react-chart-material-ui';
import moment from 'moment';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { queryItemsLatestVersionByTypeId, queryItemsLatestVersionByType, queryTypeIdsByType } from '../graphql/queries';
import { updateItem, createItem, deleteItem } from '../graphql/mutations';
import {nextId} from '../util/IdGenerator';
import {useStyles} from '../styles/Styles';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import ArchiveIcon from '@material-ui/icons/Archive';
import BusinessIcon from '@material-ui/icons/Business';
import Tooltip from '@material-ui/core/Tooltip';
import {ArchivalConfirmation} from './ArchiveConfirmation';

function Resource(props) {

	const classes = useStyles();
	const {resource, createResource, updateResource, typeIdsForResources, archiveResourceGQL} = props;

	const getRandomInt = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	};

	const generateData = (startDate, endDate) => {
		const points = [];
		let i = 0;

		while (true) {
			let nextFriday = moment(startDate).isoWeekday(5 + i * 7);
			i++;
			if (nextFriday >= endDate || nextFriday > moment()) break;
			let y = getRandomInt(80, 100);
			points.push({ x: nextFriday, y });
		}
		return points;
	};


	const isNewResource = props.match.params.id === "0";

	const [ state, setState ] = React.useState({
		resourceData: isNewResource ? {} : {...resource},
		startDate: moment().subtract(3, 'months'),
		endDate: moment(),
		chartData: generateData(moment().subtract(3, 'months'), moment()),
		editMode: isNewResource || (props.location.state && props.location.state.editMode),
		archivalConfirmationOpen : false
	});

	const handleStartDateChange = (newDate) => {
		setState({ ...state, startDate: newDate, chartData: generateData(newDate, state.endDate) });
	};

	const handleEndDateChange = (newDate) => {
		setState({ ...state, endDate: newDate, chartData: generateData(state.startDate, newDate) });
	};

	const onActionButtonOneClick = () => {
		if (state.editMode) {
			saveResource();
		} else {
			editResource();
		}
	};

	const onActionButtonTwoClick = () => {
		if (state.editMode) {
			cancelEditing();
		} else {
			archiveResource();
		}
	};

	const editResource = () => {
		setState({ ...state, editMode: true });
	};

	const saveResource = async () => {
		const newResource = { ...state.resourceData }; 
		
		if(isNewResource){
			createResource(newResource).then(result => {
				state.resourceData = {...result.data.createItem};
				newResource.type_id = state.resourceData.type_id;
				newResource.version = 0;
				finishEditing();
			});
		}
		else{
			await updateResource(newResource).then((result) => {
				finishEditing();
			});
		}
		
	};

	const cancelEditing = () => {
		setState({ ...state, editMode: false, resourceData: {...resource}, isFirstTimeLoading: false});
		if(isNewResource){
			props.history.push('/');
		}
	};

	const finishEditing = () => {
		setState({ ...state, editMode: false, isFirstTimeLoading: false });
		if(isNewResource) {
			props.history.push('/resources/'+state.resourceData.type_id);
		}
	};

	const archiveResource = () => {
		toggleArchiveConfirmation();
	};

	const cancelArchival = () => {
		toggleArchiveConfirmation();
	};

	const confirmArchival = () => {
		toggleArchiveConfirmation();
		archiveResourceGQL({...state.resourceData}).then(() => {
			props.history.push('/');
		});
	};

	const toggleArchiveConfirmation = () => {
		setState({ ...state, archivalConfirmationOpen: !state.archivalConfirmationOpen });
	};

	const handleChange = (field) => (event) => {
		state.resourceData[field] = event.target.value;
	};

	return (
		<div>
			{state.resourceData && 
			
			<Grid container spacing={5}>
			
			<Grid item xs={12}>
				<Paper className={classes.paper}>
					<Grid container spacing={2}>
						<Grid container justify="flex-end">
									<Grid item xs={2}>
										<IconButton color="primary" onClick={onActionButtonOneClick}>
											{state.editMode ? (
												<Tooltip title="Save Changes">
													<SaveIcon fontSize="large" />
												</Tooltip>
											) : (
												<Tooltip title="Edit Resource">
													<EditIcon fontSize="large" />
												</Tooltip>
											)}
										</IconButton>
									</Grid>
									<Grid item xs={2}>
										<IconButton color="default" onClick={onActionButtonTwoClick}>
											{state.editMode ? (
												<Tooltip title="Dischard Changes">
													<CancelIcon fontSize="large" />
												</Tooltip>
											) : (
												<Tooltip title="Archive Resource">
													<ArchiveIcon fontSize="large" />
												</Tooltip>
											)}
										</IconButton>
									</Grid>
								</Grid>
						<Grid item xs={6}>
							
							<Grid container direction="column" alignItems="center" justify="center" alignItems="center">
								<IconButton>
									<AccountCircleIcon fontSize="large" color="primary" />
								</IconButton>
								<TextField
									id="name"
									fullWidth
									label="Name"
									defaultValue={state.resourceData.name}
									onChange={handleChange('name')}
									className={classes.textField}
									margin="normal"
									inputProps={{
										readOnly: !state.editMode
									}}
								/>
							</Grid>
						</Grid>
						<Grid item xs={4}>
							<TextField
								id="rate"
								fullWidth
								label="Base Rate"
								defaultValue={state.resourceData.base_rate}
								onChange={handleChange('base_rate')}
								className={classes.textField}
								margin="normal"
								inputProps={{
									readOnly: !state.editMode
								}}
							/>
							<TextField
								id="domain"
								fullWidth
								label="Domain"
								defaultValue={state.resourceData.domain}
								onChange={handleChange('domain')}
								className={classes.textField}
								margin="normal"
								inputProps={{
									readOnly: !state.editMode
								}}
							/>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
			{!isNewResource && <Grid item xs={12}>
				<Paper>
					<Grid container justify="space-around" spacing={2}>
						<Grid item xs={2}>
							<h3>Billable Utilization %</h3>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									label="Start Date"
									value={state.startDate}
									onChange={handleStartDateChange}
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
								/>
								<KeyboardDatePicker
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									label="End Date"
									disableFuture
									value={state.endDate}
									onChange={handleEndDateChange}
									KeyboardButtonProps={{
										'aria-label': 'change date'
									}}
								/>
							</MuiPickersUtilsProvider>
						</Grid>
						<Grid item xs={9}>
							<Chart data={state.chartData}>
								<ArgumentAxis
									showTicks={true}
									showLabels={true}
									tickFormat={() => (y) => moment(y).format('Do MMM YY')}
								/>
								<ValueAxis />
								<LineSeries valueField="y" argumentField="x" />
								<ZoomAndPan />
							</Chart>
						</Grid>
					</Grid>
				</Paper>
			</Grid>}
			
		</Grid>}
		<ArchivalConfirmation archivalConfirmationOpen = {state.archivalConfirmationOpen} cancelArchival={cancelArchival} confirmArchival = {confirmArchival} />
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
				resource: queryItemsLatestVersionByTypeId.items[0]
			})
		}),graphql(gql(queryTypeIdsByType), {
			options: () => ({
				variables: { type: 'resource' },
				fetchPolicy: 'cache-and-network'
			}),
			props: ({ data: { queryTypeIdsByType }}) => ({
				typeIdsForResources: queryTypeIdsByType
			})
		}),
		graphql(gql(updateItem), {
			props: (props) => ({
				archiveResourceGQL: (resource) => {
					delete resource['__typename'];
					delete resource['tableData'];
					return props.mutate({
						update: (proxy, { data: { updateItem: archivedResource } }) => {
							// Update query for current resource
							const v1 = { type_id: archivedResource.type_id };
							const d1 = proxy.readQuery({ query: gql(queryItemsLatestVersionByTypeId), variables: v1 });

							d1.queryItemsLatestVersionByTypeId.items = [];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByTypeId), variables: v1, data: d1 });

							// Update query for all resources
							const v2 = { type: 'resource' };
							const d2 = proxy.readQuery({ query: gql(queryItemsLatestVersionByType), variables: v2 });

							d2.queryItemsLatestVersionByType.items = [
								...d2.queryItemsLatestVersionByType.items.filter(
									(r) => r.type_id !== archivedResource.type_id || r.version !== archivedResource.version)
							];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByType), variables: v2, data: d2 });
						},
						variables: { input: {...resource, status:"inactive"} }
					});
				}
			})
		}),
		graphql(gql(createItem), {
			props: (props) => ({
				createResource: (resource) => {
					resource.type_id = nextId("resource", props.ownProps.typeIdsForResources);
					resource.version = 0;
					resource.status="active";
					return props.mutate({
						update: (proxy, { data: { createItem: newResource } }) => {
							// Update query for all resources
							const v1 = { type: "resource" };
							const d1 = proxy.readQuery({ query : gql(queryItemsLatestVersionByType) , variables: v1 });
	
							d1.queryItemsLatestVersionByType.items =  [ ...d1.queryItemsLatestVersionByType.items.filter(r => r.type_id !== newResource.type_id || r.version !== newResource.version)  , newResource];
	
							proxy.writeQuery({ query : gql(queryItemsLatestVersionByType) ,variables: v1, data: d1});
						},
						variables: { input: {...resource} }
					});
				}
			})
		}),
		graphql(gql(updateItem), {
			props: (props) => ({
				updateResource: (resource) => {
					delete resource['__typename'];
					return props.mutate({
						update: (proxy, { data: { updateItem: updatedResource } }) => {
							// Update query for current resource
							const v1 = { type_id: updatedResource.type_id };
							const d1 = proxy.readQuery({ query: gql(queryItemsLatestVersionByTypeId), variables: v1 });

							d1.queryItemsLatestVersionByTypeId.items = [ updatedResource ];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByTypeId), variables: v1, data: d1 });

							// Update query for all resources
							const v2 = { type: 'resource' };
							const d2 = proxy.readQuery({ query: gql(queryItemsLatestVersionByType), variables: v2 });

							d2.queryItemsLatestVersionByType.items = [
								...d2.queryItemsLatestVersionByType.items.filter(
									(r) => r.type_id !== updatedResource.type_id || r.version !== updatedResource.version
								),
								updatedResource
							];

							proxy.writeQuery({ query: gql(queryItemsLatestVersionByType),variables: v2, data: d2 });
						},
						variables: { input: {...resource} }
					});
				}
			})
		})
	)(Resource)
);
