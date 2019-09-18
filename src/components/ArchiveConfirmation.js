import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import React from 'react';

export function ArchivalConfirmation (props) {
    return (
    <Dialog
        open={props.archivalConfirmationOpen}
        onClose={props.cancelArchival}
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
            <Button onClick={props.cancelArchival} color="primary">
                Cancel
            </Button>
            <Button onClick={props.confirmArchival} color="primary" autoFocus>
                Archive
            </Button>
        </DialogActions>
    </Dialog>
);}