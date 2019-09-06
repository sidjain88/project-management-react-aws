import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, InputAdornment, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ActiveResources from './ActiveResources';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
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

	const addProject = () => <div>Add new project</div>;
	const editProject = () => (
		<div>
			<span style={{ float: 'right' }}>
				<Fab color="primary" aria-label="edit">
					<EditIcon />
				</Fab>
			</span>
			<h3>Project Name</h3>
			<iframe
				width="100%"
				height="800px"
				src="http://projmanager3-20190829140749-hostingbucket-dev.s3-website-us-east-1.amazonaws.com/projects/1"
			/>
		</div>
	);

	//return (props.match.params.id === '0' ? addProject() : editProject());

	return (
		<div className={classes.root}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<h6 className="MuiTypography-root MuiTypography-h6" style={{ textAlign: 'center' }}>
						Latitude Financial Services 1
					</h6>
				</Grid>
				<Grid item xs={4}>
					<Paper className={classes.paper}>
						<TextField
							id="outlined-read-only-input"
							fullWidth
							label="Project Manager"
							value="Alex Smith"
							className={classes.textField}
							margin="normal"
							InputProps={{
								readOnly: true
							}}
							variant="outlined"
						/>
						<TextField
							id="outlined-read-only-input"
							fullWidth
							label="Type"
							value="Client Type 2"
							className={classes.textField}
							margin="normal"
							InputProps={{
								readOnly: true
							}}
							variant="outlined"
						/>
					</Paper>
				</Grid>
				<Grid item xs={4}>
					<Paper className={classes.paper}>
						<TextField
							id="outlined-read-only-input"
							fullWidth
							label="Budget"
							value="200,000"
							className={classes.textField}
							margin="normal"
							InputProps={{
								readOnly: true,
								startAdornment: <InputAdornment position="start">AUD</InputAdornment>
							}}
							variant="outlined"
						/>
						<TextField
							id="outlined-read-only-input"
							fullWidth
							label="Consumed Budget"
							value="75,000"
							className={classes.textField}
							margin="normal"
							InputProps={{
								readOnly: true,
								startAdornment: <InputAdornment position="start">AUD</InputAdornment>
							}}
							variant="outlined"
						/>
					</Paper>
				</Grid>
				<Grid item xs={4}>
					<Paper className={classes.paper}>
						<TextField
							id="outlined-read-only-input"
							fullWidth
							label="Start Date"
							value="25 Jan 2017"
							className={classes.textField}
							margin="normal"
							InputProps={{
								readOnly: true
							}}
							variant="outlined"
						/>
						<TextField
							id="outlined-read-only-input"
							label="End Date"
							value="30 May 2020"
							className={classes.textField}
							margin="normal"
							InputProps={{
								readOnly: true
							}}
							fullWidth
							variant="outlined"
						/>
					</Paper>
				</Grid>
			</Grid>
			<div className="View-space" />
			<ActiveResources />
		</div>
	);
};

export default Project;
