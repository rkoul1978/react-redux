import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const SpinnerDialog = ({title}) => {
 
return (
    <div>
        <Dialog open >
            <DialogContent>
                <p style={{textAlign:'center'}}>{title}</p>
                <Box noValidate
                    sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    m: 'auto',
                    width: '200px',
                    height:'100px'
                    }}>
                    <CircularProgress style={{ width: '50px', height: '50px', marginLeft: '75px' , marginTop: '20px'}}/>
                </Box>
            </DialogContent>
        </Dialog>
    </div>
    );
}

export default SpinnerDialog;