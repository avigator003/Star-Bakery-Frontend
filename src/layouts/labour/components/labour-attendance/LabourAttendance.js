/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { v4 as uuidv4 } from 'uuid';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Data
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import Spinner from "components/Spinner/Spinner";
import AlertBox from "components/AlertBox/AlertBox";
import LabourRepository from "../../repository/LabourRepository";
import { Box, Button, createTheme, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, ThemeProvider } from "@mui/material";
import MDButton from "components/MDButton";
import Icon from "react-multi-date-picker/components/icon";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";
import { Event } from "@mui/icons-material";
import SearchBar from "material-ui-search-bar";
import CustomToolbar from "examples/Toolbar/CustomToolbar";


function LabourAttendance() {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("Attendance Submitted");
    const [rowWithIds, setRowWithIds] = useState();
    const [selectedStatus, setSelectedStatus] = useState({})
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-GB").split('/').reverse().join('-'));
    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState()


    const getAttendanceHistory = (date) => {
        return LabourRepository.getAttendanceHistoryByDate(date)
            .then((result) => {
                Object.entries(result.attendanceHistoryByUser).map(([userId, status]) => {
                    const newStatus = status === null ? "Full Day" : status
                    handleChangeAttendance(userId, newStatus)
                });
                return result;
            });
    };

    useEffect(() => {
        getAttendanceHistory(new Date().toLocaleDateString("en-GB").split('/').reverse().join('-'))
    }, [])

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        getAttendanceHistory(event.target.value)
    };

    const getLabours = () => {
        return LabourRepository.getAll()
            .then((result) => {
                const updatedRows = result.data.map(row => ({ ...row, id: row._id }));
                setRowWithIds(updatedRows)
                setTableData(updatedRows)
                return result;
            });
    };

    const convertCurrency = (value) => {
        const options = { style: 'currency', currency: 'INR' };
        const formattedNumber = value?.toLocaleString('en-IN', options);
        return formattedNumber;
    }

    const { isSuccess, isError, error, data, isLoading, isFetching } = useQuery(
        "labour",
        () => getLabours(),
        {
            onError: (err) => {
                setOpenAlert(true)
                setAlertMessage("Labours Fetch Unsucessful")
            },
        },
        { staleTime: 50000, retry: 1 }
    );

    const requestSearch = (searchValue) => {
        setSearchText(searchValue)
        const searchRegex = new RegExp(`.*${searchValue}.*`, "ig");
        const filteredRows = rowWithIds.filter((o) => {
            const columnName = 'labour_name'; // replace with your desired column name
            return Object.keys(o).some((k) => {
                return searchRegex.test(o[columnName].toString());
            });
        });
        setTableData(filteredRows);
    };


    const cancelSearch = () => {
        setSearchText("");
        requestSearch(searchText);
    };

    const handleChangeAttendance = (id, status) => {
        setSelectedStatus(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                status: status
            }
        }));
    };


    const handleSubmitAttendance = () => {
        const attendanceData = [];
        data?.data.forEach(({ _id }) => {
            const status = selectedStatus[_id] ? selectedStatus[_id].status : "Full Day";
            attendanceData.push({
                id: _id,
                status: status
            });
        });

        LabourRepository.updateAttendanceHistory({ date: selectedDate, attendanceStatus: attendanceData })
            .then(() => {
                setOpenAlert(true);
                setAlertMessage("Attendance Submitted");
            })
            .catch((error) => {
                setOpenAlert(true);
                setAlertMessage(error.message);
            });
        // Send attendanceData to server or do whatever you need to do with it
    };


    const columns = [
        {
            headerName: "Labour Name",
            field: "labour_name",
            width: 300,
            headerAlign: "center",
            align: "center",
            sortable: false,
            renderCell: (params) => (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {params.value}
                </MDTypography>
            ),
        },
        {
            field: 'mobile_number',
            headerName: 'Mobile Number',
            width: 300,
            editable: true,
            renderCell: (params) => (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium" style={{ marginLeft: 10 }}>
                    {params.value}
                </MDTypography>
            ),
        },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 300,
            renderCell: (params) => (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {convertCurrency(params.value)}
                </MDTypography>
            ),
        },
        {
            field: 'attendance',
            headerName: 'Attendance',
            width: 150,
            headerAlign: "left",
            align: "center",
            renderCell: ({ id }) => (
                <Select
                    fullWidth
                    value={selectedStatus[id] ? selectedStatus[id].status : "Full Day"}
                    onChange={e => handleChangeAttendance(id, e.target.value)}
                    onBlur={() => {
                        if (
                            selectedStatus[id] &&
                            selectedStatus[id].status === "Full Day"
                        ) {
                            handleChangeAttendance(id, "Full Day");
                        }
                    }}
                    variant="outlined"
                    sx={{ p: 1 }}
                >
                    <MenuItem value="Full Day">Full Day</MenuItem>
                    <MenuItem value="Half Day">Half Day</MenuItem>
                    <MenuItem value="Leave">Leave</MenuItem>
                </Select>

            ),
        }
    ];

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <AlertBox
                openAlert={openAlert}
                alertMessage={alertMessage}
                setOpenAlert={setOpenAlert}
            />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                display="flex"
                                justifyContent="space-between"
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="contained"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white" sx={{ marginTop: 2 }}>
                                    Labours List
                                </MDTypography>
                                <MDBox
                                    display="flex"
                                    justifyContent="space-between">
                                    <TextField
                                        label="Date of Attendance"
                                        type="date"
                                        variant="outlined"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        InputLabelProps={{
                                            shrink: true,
                                            style: { color: "white" },
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                style: { color: "white" },
                                            }
                                        }}
                                    />

                                    <MDButton style={{ marginLeft: 30 }} variant="contained" color="success" onClick={() => {
                                        handleSubmitAttendance()
                                    }}>
                                        <Icon>delete</Icon>
                                        &nbsp;submit attendance
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={3} sx={{ height: 400, width: '100%' }}>
                                {
                                    tableData &&
                                    <DataGrid
                                        components={{ Toolbar: CustomToolbar }}
                                        rows={tableData}
                                        columns={columns}
                                        pageSize={10}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        checkboxSelection={false}
                                        disableRowSelectionOnClick
                                        componentsProps={{
                                            toolbar: {
                                                value: searchText,
                                                onChange: (searchVal) => requestSearch(searchVal),
                                                onCancelSearch: () => cancelSearch()
                                            }
                                        }}
                                        disableColumnMenu
                                    />
                                }
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default LabourAttendance;
