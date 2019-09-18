import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
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