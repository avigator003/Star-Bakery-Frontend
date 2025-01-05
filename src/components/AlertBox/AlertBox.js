import { Icon, IconButton, Snackbar } from '@mui/material'
import React from 'react'
// prop-types is library for typechecking of props
import PropTypes from "prop-types";

function AlertBox(props) {
    const { openAlert, setOpenAlert, alertMessage } = props
    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={openAlert}
            onClose={() => setOpenAlert(false)}
            message={alertMessage}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={() => setOpenAlert(false)}
                >
                    <Icon>close</Icon>
                </IconButton>
            ]}
        />
    )
}

// Typechecking props for the CreateUser
AlertBox.propTypes = {
    openAlert: PropTypes.bool,
    setOpenAlert : PropTypes.func,
    alertMessage :PropTypes.string
  };

export default AlertBox
