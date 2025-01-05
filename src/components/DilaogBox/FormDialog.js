import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MDButton from 'components/MDButton';
import StorefrontIcon from '@mui/icons-material/Storefront';
import RawMaterialRepository from 'layouts/raw-material/repository/RawMaterialRepository';
import { useState } from 'react';
import styled from 'styled-components';

export default function FormDialog(props) {
    const { open, type, handleClose, rawMaterialId, handleOpenAlert, totalQuantity } = props;
    const [quantity, setQuantity] = useState();
    const [error, setError] = useState()


    const handleBuy = () => {
        return RawMaterialRepository.buy(rawMaterialId, quantity)
            .then((result) => {
                setError(null)
                setQuantity()
                handleClose();
                handleOpenAlert();
                return result;
            });
    };

    const handleUse = () => {
        if (quantity > totalQuantity) {
            setError("Insufficient quantity available")
        }
        else {
            setError(null)
            return RawMaterialRepository.use(rawMaterialId, quantity)
                .then((result) => {
                    setError(null)
                    setQuantity()
                    handleClose();
                    handleOpenAlert();
                    return result;
                });
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Quantity</DialogTitle>
                {
                    type === "buy" ?
                        <>
                            <DialogContent>
                                <DialogContentText>
                                    Please enter quantity you want to buy
                                </DialogContentText>
                                <TextField
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    autoFocus
                                    margin="dense"
                                    type="number"
                                    id="quantity"
                                    label="Quantity"
                                    fullWidth
                                    variant="standard"
                                />
                            </DialogContent>
                            <DialogActions>
                                <MDButton
                                    variant="contained"
                                    size="small"
                                    color="info"
                                    onClick={handleBuy}
                                >
                                    <StorefrontIcon />
                                    &nbsp;BUY
                                </MDButton>
                            </DialogActions>
                        </>
                        :
                        <>
                            <DialogContent>
                                <DialogContentText>
                                    Please enter quantity you want to use
                                </DialogContentText>
                                <TextField
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    autoFocus
                                    margin="dense"
                                    type="number"
                                    id="quantity"
                                    label="Quantity"
                                    fullWidth
                                    variant="standard"
                                />
                                {error && <Error>{error}</Error>}
                            </DialogContent>
                            <DialogActions>
                                <MDButton
                                    variant="contained"
                                    size="small"
                                    color="info"
                                    onClick={handleUse}
                                >
                                    <StorefrontIcon />
                                    &nbsp;Use
                                </MDButton>
                            </DialogActions>
                        </>
                }
            </Dialog>
        </div>
    );
}

export const Error = styled.p`
  color: red;
  font-weight: 600;
  font-size: 0.8rem;
`;
