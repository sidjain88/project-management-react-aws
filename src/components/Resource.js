import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Chart, ArgumentAxis, ValueAxis, LineSeries, Legend, ZoomAndPan } from '@devexpress/dx-react-chart-material-ui';
import moment from 'moment';

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

export function Resource() {
	const classes = useStyles()

	const getRandomInt = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

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
	}

	const [ state, setState ] = React.useState({
		startDate: moment().subtract(3, 'months'),
		endDate: moment(),
		data: generateData(moment().subtract(3, 'months'), moment())
	})

	const handleStartDateChange = (newDate) => {
		setState({ ...state, startDate: newDate, data: generateData(newDate, state.endDate) });
	}

	const handleEndDateChange = (newDate) => {
		setState({ ...state, endDate: newDate, data: generateData(state.startDate, newDate) });
	}

	return (
		<Grid container spacing={5}>
			<Grid item xs={12}>
				<Paper className={classes.paper}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Grid container direction="column" alignItems="center" justify="center" alignItems="center">
								<IconButton>
									<AccountCircleIcon fontSize="large" color="primary" />
								</IconButton>
								<h2>James Smith</h2>
							</Grid>
						</Grid>
						<Grid item xs={4}>
							<TextField
								id="rate"
								fullWidth
								label="Base Rate"
								value="50"
								className={classes.textField}
								margin="normal"
								inputProps={{
									readOnly: true
								}}
							/>
							<TextField
								id="domain"
								fullWidth
								label="Domain"
								value="Domain 2"
								className={classes.textField}
								margin="normal"
								inputProps={{
									readOnly: true
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
							<Chart data={state.data}>
								<ArgumentAxis
									showTicks={true}
									showLabels={true}
									tickFormat={() => (y) => moment(y).format('DD/MM/YY')}
								/>
								<ValueAxis />
								<LineSeries valueField="y" argumentField="x" />
								<ZoomAndPan />
							</Chart>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		</Grid>
	);
}

export default Resource;
