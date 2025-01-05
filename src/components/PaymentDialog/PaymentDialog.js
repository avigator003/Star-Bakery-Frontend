import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

const PaymentDialog = ({ open, onClose, payments, onSave }) => {
  const [newPayment, setNewPayment] = useState({ payment: '' });
  const [nextIndex, setNextIndex] = useState(1);
  const [isPaymentAdded, setIsPaymentAdded] = useState(false);

  useEffect(() => {
    setNewPayment({ payment: '' });
    setNextIndex(payments.length + 1);
  }, [open, payments]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const handleAddPayment = () => {
    // Check if a payment has already been added
    if (isPaymentAdded) {
      return;
    }



    // Add the new payment with the current Index and today's date
    const payment = {
      date: formatDate(new Date().toISOString().split('T')[0]),
      payment: newPayment.payment,
    };

    const newPayemnts=payments.map((pay) => {
      return {
        date: pay.date,
        payment: pay.amount,
      }
    })
    // Update the state with the new payment and set payment added to true
    setIsPaymentAdded(true);
    setNewPayment({ payment: '' });
    setNextIndex(nextIndex + 1);
    
   onSave([...newPayemnts, payment]);
  };

  const handleSavePayment = () => {
    // Save the payment when the "Save" button is clicked
    handleAddPayment();
    onClose(); // Close the dialog
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage Payments</DialogTitle>
      <DialogContent>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', width: 100 }}>Index</th>
              <th style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', width: 250 }}>Date</th>
              <th style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', width: 250 }}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment,index) => (
              <tr key={payment.index}>
                <td style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', height: 50 }}>{index+1}</td>
                <td style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', height: 50 }}>{payment.date}</td>
                <td style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', height: 50 }}>₹ {payment.amount}</td>
              </tr>
            ))}

            {!isPaymentAdded && (
              <tr>
                <td style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', height: 50 }}>{nextIndex}</td>
                <td style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', height: 50 }}>{formatDate(new Date().toISOString().split('T')[0])}</td>
                <td style={{ border: '0.1px solid lightgrey', padding: '8px', textAlign: 'center', height: 50 }}>
                  <TextField
                    type="number"
                    variant="outlined"
                    value={newPayment.payment}
                    onChange={(e) => setNewPayment({ payment: e.target.value })}
                    fullWidth
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        {!isPaymentAdded && (
          <Button onClick={handleSavePayment} color="primary">
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
