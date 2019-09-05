import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';

class Project extends Component {
	addProject = () => <div>Add new project</div>;
	editProject = () => (
		<div>
			<span style={{ float: 'right' }}>
				<Fab color="primary" aria-label="edit">
					<EditIcon />
				</Fab>
			</span>
			<iframe
				width="100%"
				height="800px"
				src="http://projmanager3-20190829140749-hostingbucket-dev.s3-website-us-east-1.amazonaws.com/projects/1"
			/>
		</div>
	);

	render = () => (this.props.match.params.id === '0' ? this.addProject() : this.editProject());
}

export default Project;
