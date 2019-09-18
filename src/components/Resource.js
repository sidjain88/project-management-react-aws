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
import { queryItemsLatestVersionByTypeId, queryItemsLatestVersionByType, queryItemsLatestVersionByProjectId, queryTypeIdsByType } from '../graphql/queries';
import { updateItem, createItem, deleteItem } from '../graphql/mutations';
import {nextId} from '../util/IdGenerator';
import {useStyles} from '../styles/Styles'

function Resource(props) {

	const classes = useStyles();

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

	const {resource} = props;

	const [ state, setState ] = React.useState({
		resource: props.match.params.id === "0" ? {} : {...resource},
		startDate: moment().subtract(3, 'months'),
		endDate: moment(),
		chartData: generateData(moment().subtract(3, 'months'), moment())
	});

	const handleStartDateChange = (newDate) => {
		setState({ ...state, startDate: newDate, chartData: generateData(newDate, state.endDate) });
	};

	const handleEndDateChange = (newDate) => {
		setState({ ...state, endDate: newDate, chartData: generateData(state.startDate, newDate) });
	};

	return (
		<div>
			{state.resource && <Grid container spacing={5}>
			<Grid item xs={12}>
				<Paper className={classes.paper}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Grid container direction="column" alignItems="center" justify="center" alignItems="center">
								<IconButton>
									<AccountCircleIcon fontSize="large" color="primary" />
								</IconButton>
								<TextField
									id="name"
									fullWidth
									label="Name"
									defaultValue={state.resource.name}
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
								defaultValue={state.resource.base_rate}
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
								defaultValue={state.resource.domain}
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
			<Grid item xs={12}>
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
			</Grid>
		</Grid>}
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
		})
	)(Resource)
);
