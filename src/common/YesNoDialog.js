import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { showDialog } from "../actions/MuiAction";
import { connect } from "react-redux";

const YesNoDialog = ({title,content,showDialog,yesClicked}) => {
 
return (
    <div>
        <Dialog open onClose={ () => showDialog(false) }>
            <DialogTitle id="alert-dialog-title">
                { title }
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    { content }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={ () => showDialog(false) }>No</Button>
                <Button onClick={ () => { showDialog(false); yesClicked(); }} autoFocus>YES</Button>
            </DialogActions>
        </Dialog>
    </div>
    );
}

const mapDispatchToProps = (dispatch) =>({
    showDialog: (flag) => dispatch(showDialog(flag))
});

export default connect(null,mapDispatchToProps)(YesNoDialog);