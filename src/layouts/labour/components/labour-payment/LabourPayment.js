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
import { Button, createTheme, FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider } from "@mui/material";
import MDButton from "components/MDButton";
import Icon from "react-multi-date-picker/components/icon";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "examples/Toolbar/CustomToolbar";
import PaymentDialog from "../../../../components/PaymentDialog/PaymentDialog";

function LabourPayment() {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [rowWithIds, setRowWithIds] = useState();
    const [selectedStatus, setSelectedStatus] = useState({})
    const defaultMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState()
    const [advancePayment, setAdvancePayment] = useState(0);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [currentRowId, setCurrentRowId] = useState(null);

    const handleOpenPaymentDialog = (rowId) => {
        setCurrentRowId(rowId);
        setOpenPaymentDialog(true);
    };


    const getPaymentHistory = (month) => {
        return LabourRepository.getSalaryHistoryByMonth(month)
            .then((result) => {
                Object.entries(result.salaryHistoryByUser).map(([userId, status]) => {
                    let newStatus = "Paid";
                    let newAdvancePayment = 0;
                    if (status !== null) {
                        newStatus = status?.salary_history?.status === undefined || null ? "Unpaid" : status?.salary_history?.status
                        newAdvancePayment = status?.advance_payment === undefined || null ? 0 : status.advance_payment
                    }
                    handleChangePaymentStatus(status._id, newStatus)
                    handleChangeAdvancePaymentValue(userId, newAdvancePayment)
                });

                const updatedRows = result.salaryHistoryByUser.map(row => ({ ...row, id: row._id }));
                setRowWithIds(updatedRows)
                setTableData(updatedRows)

                // Calculate and set the total advance payment from existing data
                const totalAdvancePayment = updatedRows.reduce((total, row) => {
                    return total + (row.advancePayment || 0);
                }, 0);
                setAdvancePayment(totalAdvancePayment);

                return { ...result, selectedStatus };
            });
    };


    useEffect(() => {
        getPaymentHistory(defaultMonth)
    }, [])


    // const getLabours = () => {
    //     return LabourRepository.getAll(defaultMonth)
    //         .then((result) => {
    //             const updatedRows = result.data.map(row => ({ ...row, id: row._id }));
    //             setRowWithIds(updatedRows)
    //             setTableData(updatedRows)
    //             return result;
    //         });
    // };


    const convertCurrency = (value) => {
        const options = { style: 'currency', currency: 'INR' };
        const formattedNumber = value?.toLocaleString('en-IN', options);
        return formattedNumber;
    }
    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        getPaymentHistory(event.target.value)
    };

    // const { isSuccess, isError, error, data, isLoading, isFetching } = useQuery(
    //     "labour",
    //     () => getLabours(),
    //     {
    //         onError: (err) => {
    //             setOpenAlert(true)
    //             setAlertMessage("Labours Fetch Unsucessful")
    //         },
    //     },
    //     { staleTime: 50000, retry: 1 }
    // );



    const handleChangePaymentStatus = (id, status) => {
        setSelectedStatus(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                status: status
            }
        }));
    };


    const handleChangeAdvancePaymentValue = (id, status) => {
        setAdvancePayment(prevState => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                payment: status
            }
        }));
    };

    const handleSubmitPayment = () => {
        const paymentData = {};



        tableData?.forEach(({ _id, salary_history }) => {
            const status = selectedStatus[_id] ? selectedStatus[_id].status : "Unpaid";
            const payment = advancePayment[_id] ? advancePayment[_id].payment : 0;
            if (advancePayment[_id]?.length) {
                // Initialize an array for this user if it doesn't exist
                if (!paymentData[_id]) {
                    paymentData[_id] = [];
                }

                advancePayment[_id].forEach((advance) => {
                    const { date, payment: advancePaymentValue } = advance;
                    paymentData[_id].push({
                        id: _id,
                        status: status,
                        payment: advancePaymentValue,
                        date: date,
                    });
                });
            } else if (status === "Paid" || status === "Unpaid") {
                // If there are no advance payments, add a single entry with default values
                paymentData[_id] = [
                    {
                        id: _id,
                        status: status,
                    },
                ];
            }
            else {
                salary_history.advance_payment.map((da) => {
                    if (!paymentData[_id]) {
                        paymentData[_id] = [];
                    }
                    paymentData[_id].push({
                        id: _id,
                        status: status,
                        payment: da.amount,
                        date: da.date,
                    });
                })
            }
        });



        LabourRepository.updateSalaryHistory({ month: selectedMonth, salaryStatus: paymentData })
            .then(() => {
                setOpenAlert(true);
                setAlertMessage("Payment Submitted");
            })
            .catch((error) => {
                setOpenAlert(true);
                setAlertMessage(error.message);
            });
    };





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

    const getDefaultStatusType = (value) => {
        const salaryHistory = value?.row?.salary_history;
        // Assuming salary_history is an object with a 'status' field
        return salaryHistory?.status || "Unpaid";
    };

    const getDefaultPayment = (value) => {
        const salaryHistory = value?.row?.salary_history;
        const paymentDate = new Date(salaryHistory?.created_at);

        // Check if the payment month matches the selected month
        if (paymentDate.getMonth() + 1 === parseInt(selectedMonth.substring(5), 10)) {
            return salaryHistory?.advance_payment || 0;
        }

        return 0; // Return 0 if the payment month doesn't match the selected month
    };

    const columns = [
        {
            headerName: "Labour Name",
            field: "labour_name",
            width: 200,
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
            headerName: "Mobile Number",
            field: "mobile_number",
            width: 200,
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
            field: 'salary',
            headerName: 'Salary',
            width: 200,
            headerAlign: "left",
            renderCell: (params) => (
                <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                    {convertCurrency(params.value)}
                </MDTypography>
            ),
        },
        {
            field: 'payment',
            headerName: 'Payment',
            width: 800,
            headerAlign: "left",
            align: "left",
            renderCell: (value) => (
                <div style={{ display: "flex", justifyContent: "space-between", width: "60%" }}>
                    <Select
                        fullWidth
                        value={selectedStatus[value.id] ? selectedStatus[value.id].status : getDefaultStatusType(value)}
                        onChange={e => handleChangePaymentStatus(value.id, e.target.value)}
                        onBlur={() => {
                            if (
                                selectedStatus[value.id] &&
                                selectedStatus[value.id].status === "Paid"
                            ) {
                                handleChangePaymentStatus(value.id, "Paid");
                            }
                        }}
                        variant="outlined"
                        sx={{ p: 1 }}
                    >
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Advance Payment">Advance Payment</MenuItem>
                    </Select>
                    {currentRowId === value.id && (
                        <PaymentDialog
                            open={openPaymentDialog}
                            onClose={() => setOpenPaymentDialog(false)}
                            payments={value.row?.salary_history?.advance_payment || []}
                            onSave={(newPayments) => {
                                // Update the payments for the current row
                                setAdvancePayment((prevAdvancePayment) => ({
                                    ...prevAdvancePayment,
                                    [value.id]: newPayments,
                                }));
                            }}
                        />
                    )}
                    <div style={{ width: "400px", marginLeft: "30px" }}>
                        {(selectedStatus[value.id]?.status || getDefaultStatusType(value)) === "Advance Payment" &&
                            // <TextField
                            //     //    defaultValue={getDefaultPayment(value)}
                            //     type="number"
                            //     fullWidth
                            //     variant="standard"
                            //     label="Advance Amount"
                            //     value={advancePayment[value.id] ? advancePayment[value.id].payment : getDefaultPayment(value)}
                            //     onChange={e => handleChangeAdvancePaymentValue(value.id, e.target.value)}
                            //     onBlur={() => {
                            //         if (
                            //             advancePayment[value.id] &&
                            //             advancePayment[value.id].payment === 0
                            //         ) {
                            //             handleChangeAdvancePaymentValue(value.id, 0);
                            //         }
                            //     }}
                            // />

                            <Button onClick={() => handleOpenPaymentDialog(value.id)}>Manage Payments</Button>
                        }
                    </div>
                </div >
            ),
        },
    ];
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
                                        label="Date of Payment"
                                        type="month"
                                        variant="outlined"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                        InputLabelProps={{
                                            shrink: true,
                                            style: { color: "white" },
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                style: {
                                                    color: "white",
                                                    padding: 10
                                                },
                                            }
                                        }}
                                    />
                                    <MDButton variant="contained" color="success" style={{ marginLeft: 30 }} onClick={() => {
                                        handleSubmitPayment()
                                    }}>
                                        <Icon>delete</Icon>
                                        &nbsp;submit payment
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

export default LabourPayment;
