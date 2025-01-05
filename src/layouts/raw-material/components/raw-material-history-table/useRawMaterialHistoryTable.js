import React, { useState } from "react";
import { IconButton, Icon, Menu, Box } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import UserInformation from "components/TableComponents/UserInformation";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";

const ActionMenu = (props) => {
    const { openMenu, handleCloseMenu, handleEditAction, handelDeleteAction } = props
    return (
        <Menu
            anchorEl={openMenu}
            anchorReference={null}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(openMenu)}
            onClose={handleCloseMenu}
            sx={{ mt: 2 }}
        >
            <Box display="flex" flexDirection="column">
                <MDButton variant="text" color="dark" onClick={() => handleEditAction()}>
                    <Icon>edit</Icon>
                    &nbsp;edit
                </MDButton>
                <MDButton variant="text" color="error" onClick={() => handelDeleteAction()}>
                    <Icon>delete</Icon>
                    &nbsp;delete
                </MDButton>
            </Box>
        </Menu>
    );
}

const convertDate = (dateString) => {
    const utcDateString = dateString;
    const date = new Date(utcDateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const localDateString = date.toLocaleDateString('en-US', options);
    return localDateString;
}

const useTables = (rowData, rawMaterialName, quantityType) => {
    const columns = [
        { Header: "Raw Material Name", width:"20%", accessor: "name", align: "center" },
        { Header: "Buy/Use", accessor: "buyUse", align: "center" },
        { Header: "Quantity", accessor: "quantity", align: "center" },
        { Header: "Date", accessor: "date", align: "center" },
    ];

    const rows = rowData?.map((row) => ({
        name: (
            <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
            >
                {rawMaterialName}
            </MDTypography>
        ),
        buyUse: (
            <>
            { 
              row.history_type === "BUY" ?
            <MDButton
            variant="contained"
            size="small"
            color="success"
            disabled
        >
            &nbsp;BUY
        </MDButton> :
        <MDButton
            variant="contained"
            size="small"
            color="error"
            disabled
        >
            &nbsp;USE
        </MDButton>
    }
        </>
        ),
        quantity: (
            <>
            <MDTypography
                component="a"
                href="#"
                style={{ marginRight:5 }}
                variant="caption"
                color="text"
                fontWeight="medium"
            >
                {row.quantity} 
            </MDTypography>
            <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
            >
                {quantityType} 
            </MDTypography>
            </>
        ),
        date: (
            <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
            >     
                {convertDate(row.created_at)}
            </MDTypography>
        ),
    }));

    return { rows, columns };
}
export default useTables;
