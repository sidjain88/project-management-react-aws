import React, { Component } from 'react';
import  ResourceUtilization  from './ResourceUtilization';
import  ProjectUtilization  from './ProjectUtilization';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

  
  export function Utilization(props){
    const classes = useStyles();

        const [groupBy, setGroupBy] = React.useState('R');
        const [open, setOpen] = React.useState(false);
      
        function handleChange(event) {
          setGroupBy(event.target.value);
        }
      
        function handleClose() {
          setOpen(false);
        }
      
        function handleOpen() {
          setOpen(true);
        }

        return (
            <div align="center">
                <form autoComplete="off">
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="demo-controlled-open-select">Group By</InputLabel>
                        <Select
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={groupBy}
                            onChange={handleChange}
                            inputProps={{
                                id: 'demo-controlled-open-select',
                            }}
                        >
                            <MenuItem value={'R'}>Resource</MenuItem>
                            <MenuItem value={'P'}>Project</MenuItem>
                        </Select>
                    </FormControl>
                </form>

                {groupBy === 'R' ? <ResourceUtilization/> : <ProjectUtilization/>}
            </div>
        );
    }
