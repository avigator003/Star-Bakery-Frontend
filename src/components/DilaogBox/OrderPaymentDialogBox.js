import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, MenuItem, Select, TextField } from '@mui/material';

export default function OrderPaymentDialogBox(props) {
    const { open, handlePaymentStatusUpdate, handleClose, payment ,setPayment, paymentStatus, setPaymentStatus } = props
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    Payment Status
                </DialogTitle>
                <DialogContent>
                        <TextField
                            value={payment}
                            onChange={(event) => setPayment(event.target.value)}
                            fullWidth
                            label="Payment"
                            type="number"
                            variant="standard"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handlePaymentStatusUpdate} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}