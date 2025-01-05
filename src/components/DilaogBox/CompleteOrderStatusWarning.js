import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

export default function CompleteOrderStatusWarning(props) {

    const { open, handleClickOpen, handleClose } = props

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    To Download Invoice first complete the order Please !!
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClickOpen} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}