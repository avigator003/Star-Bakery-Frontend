import { Box, Input, TextField, Typography } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid'
import SearchBar from 'material-ui-search-bar'
import React from 'react'

export default function TotalToolbar(props) {

    const { orderAmount, dueAmount, totalAmount, paidAmount, todayDueAmount } = props
    return (
        <GridToolbarContainer style={{ margin: 20, flexDirection: "row"}}>
            <Box borderRight={1} borderColor="black" p={1} pr={2}>
                <Typography variant="h6" fontSize={13} style={{borderRight: 1, borderColor: "black" }}>Order Amount : {orderAmount}</Typography>
            </Box>
            <Box borderRight={1} borderColor="black" p={1} pr={2}>
                <Typography variant="h6" fontSize={13} style={{borderRight: 1, borderColor: "black" }}>Due Amount : {dueAmount}</Typography>
            </Box>
            <Box borderRight={1} borderColor="black" p={1} pr={2}>
                <Typography variant="h6" fontSize={13} style={{borderRight: 1, borderColor: "black" }}>Total Amount : {totalAmount}</Typography>
            </Box>
            <Box borderRight={1} borderColor="black" p={1} pr={2}>
                <Typography variant="h6" fontSize={13} style={{borderRight: 1, borderColor: "black" }}>Paid Amount : {paidAmount}</Typography>
            </Box>
            <Box>
                <Typography variant="h6" fontSize={13} style={{borderRight: 1, borderColor: "black" }}>Today's Due Amount : {todayDueAmount}</Typography>
            </Box>
        </GridToolbarContainer>
    );
}
