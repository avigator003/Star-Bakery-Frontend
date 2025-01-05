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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
// Data
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "components/Spinner/Spinner";

import AlertBox from "components/AlertBox/AlertBox";
import OrderRepository from "layouts/order/repository/OrderRepository";
import useOrderTable from "./useOrderTable3";
import {
  FormControl,
  Icon,
  InputLabel,
  MenuItem,
  TextField,
  Select as CustomSelect,
  IconButton,
  Menu,
  Box,
} from "@mui/material";
import UserRepository from "layouts/user/repository/UserRepository";
import { makeStyles } from "@mui/styles";
import MDButton from "components/MDButton";
import Select from "react-select";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "examples/Toolbar/CustomToolbar";
import { useNavigate } from "react-router-dom";
import ConfirmationDialogBox from "components/DilaogBox/ConfirmationDialogBox";
import OrderPaymentDialogBox from "components/DilaogBox/OrderPaymentDialogBox";
import CompleteOrderStatusWarning from "components/DilaogBox/CompleteOrderStatusWarning";
import TotalToolbar from "examples/Toolbar/TotalToolbar";
import ConfirmDialog from "components/DilaogBox/DeleteConfirmationDailogBox";

const useStyles = makeStyles((theme) => ({
  select: {
    "& .MuiSelect-select:focus": {
      color: "white !important",
    },
    header: {
      fontSize: 10,
    },
  },
}));

const ActionMenu = (props) => {
  const {
    handleEditAction,
    handleDeleteAction,
    handleDownloadAction,
    handleViewAction,
    orderStatus,
  } = props;
  const adminUser = localStorage.getItem("admin");
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);


  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  }

  const confirmDelete = () => {
    handleDeleteAction();
    closeConfirmDialog();
  }

  return (
    <>
      <IconButton
        size="small"
        disableRipple
        color="inherit"
        aria-controls="notification-menu"
        aria-haspopup="true"
        variant="contained"
        onClick={handleOpenMenu}
      >
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorReference={anchorEl ? "anchorEl" : null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ mt: 2 }}
      >
        <Box display="flex" flexDirection="column">
          {(orderStatus === "Pending" || orderStatus === "Accepted") &&
            adminUser && (
              <MDButton variant="text" color="dark" onClick={handleEditAction}>
                <Icon>edit</Icon>
                &nbsp;edit
              </MDButton>
            )}
          {orderStatus !== "Completed" && (
            <MDButton variant="text" color="error" onClick={()=>setConfirmDialogOpen(true)}>
              <Icon>delete</Icon>
              &nbsp;delete
            </MDButton>
          )}
          <MDButton variant="text" color="dark" onClick={handleViewAction}>
            <Icon>edit</Icon>
            &nbsp;view details
          </MDButton>
          <MDButton variant="text" color="dark" onClick={handleDownloadAction}>
            <Icon>download</Icon>
            &nbsp;download invoice
          </MDButton>
        </Box>
      </Menu>
      <ConfirmDialog
              open={confirmDialogOpen}
              title="Confirm Delete"
              message="Are you sure you want to delete this user?"
              onConfirm={confirmDelete}
              onCancel={closeConfirmDialog}
            />
    </>
  );
};
function OrderList() {
  const getDate = useCallback((dateTimeString) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }, []);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Order Deleted Succesfully");
  const [spinner, setSpinner] = useState(false);
  const [startDate, setStartDate] = useState(getDate());
  const [rowWithIds, setRowWithIds] = useState();
  const [orderStatus, setOrderStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [openOrderPaymentStatusAlert, setOrderPaymentStatusAlert] =
    useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [tablePaymentStatus, setTablePaymentStatus] = useState("");
  const [tableData, setTableData] = useState();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [endDate, setEndDate] = useState(getDate());
  const [selectedUser, setSelectedUser] = useState("");
  const [openOrderWarning, setOpenOrderWarning] = useState(false);
  const [finalOrderStatus, setFinalOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [payment, setPayment] = useState(0);

  const handleChangePaymentStatus = (orderId, status) => {
    setTablePaymentStatus(status);
    setOrderId(orderId);
    if (status === "Partial Payment") {
      setOpenPaymentDialog(true);
    } else {
      OrderRepository.updatePaymentStatus(orderId, 0, status).then((result) => {
        setOpenAlert(true);
        setAlertMessage("Order Payment Status Changed Successfully");
        queryClient.invalidateQueries("orders");
      });
    }
    setAlertMessage("");
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    };
    const localDateString = date.toLocaleDateString("en-US", options);
    return localDateString;
  };

  const convertCurrency = (value) => {
    const options = { style: "currency", currency: "INR" };
    const formattedNumber = value?.toLocaleString("en-IN", options);
    return formattedNumber;
  };

  useEffect(() => {
    queryClient.invalidateQueries("orders");
  }, []);

  const getOrders = () => {
    return OrderRepository.getByDateOrUser(
      startDate,
      endDate,
      selectedUser?.value
    ).then((result) => {
      const updatedRows = result.orders.map((row) => ({ ...row, id: row._id }));
      setRowWithIds(updatedRows);

      setTableData(updatedRows);
      return result;
    });
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setSelectedUser("");
  };

  const { isLoading, refetch } = useQuery(
    "orders",
    () => getOrders(),
    {
      onError: (err) => {
        setOpenAlert(true);
        setAlertMessage("Orders Fetch Unsucessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const getUsers = () => {
    return UserRepository.getAll().then((result) => {
      return result;
    });
  };

  const { data: userData } = useQuery(
    "users",
    () => getUsers(),
    {
      onError: (err) => {
        setOpenAlert(true);
        setAlertMessage("User Fetch Unsucessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  useEffect(() => {
    refetch();
  }, [startDate, endDate, selectedUser]);

  useEffect(() => {
    refetch();
  }, [startDate, endDate, selectedUser]);

  const handleChangeStatus = useCallback((id, status) => {
    OrderRepository.updateOrderStatus(status, id, payment, paymentStatus).then(
      (result) => {
        setOpenAlert(true);
        setAlertMessage("Order Status Changed Successfully");
        setFinalOrderStatus(orderStatus);
        queryClient.invalidateQueries("orders");
      }
    );
    setOrderStatus(status);
    setOrderId(id);
    setAlertMessage("");
  }, []);

  const handlePaymentStatusUpdate = () => {
    OrderRepository.updatePaymentStatus(
      orderId,
      payment,
      tablePaymentStatus
    ).then((result) => {
      setOpenPaymentDialog(false);
      setOrderPaymentStatusAlert(true);
      queryClient.invalidateQueries("orders");
    });
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  const handleClickOrderWarningOpen = () => {
    setOpenOrderWarning(false);
  };

  const handleCloseOrderWarning = () => {
    setOpenOrderWarning(false);
  };

  const handleShowSpinner = () => {
    setSpinner(true);
  };

  const handleCloseSpinner = () => {
    setSpinner(false);
  };

  const handleEditAction = useCallback(
    (id) => {
      navigate("/order/edit", { state: { id: id } });
    },
    [navigate, selectedUserId]
  );

  const handleViewAction = useCallback(
    (id) => {
      navigate("/order/view", { state: { id: id } });
    },
    [navigate]
  );

  const deleteOrder = useCallback(
    async (id) => {
      return await OrderRepository.delete(id);
    },
    [OrderRepository]
  );

  const { mutateAsync, isLoading: isMutate } = useMutation(deleteOrder, {
    onSuccess: (response) => {
      setOpenAlert(true);
      setAlertMessage("Order Deleted Successfully");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Order Deletion Unsuccessful");
    },
  });

  const remove = useCallback(
    async (id) => {
      await mutateAsync(id);
      queryClient.invalidateQueries("orders");
    },
    [mutateAsync, queryClient, selectedUserId]
  );

  const handleDeleteAction = useCallback(
    (id) => {
      setSelectedUserId(id);
      remove(id);
    },
    [remove]
  );

  const handleDownloadInvoice = useCallback(
    (orderStatusCurrent, id) => {
      if (
        finalOrderStatus === "Completed" ||
        orderStatusCurrent === "Completed" ||
        orderStatusCurrent === "Accepted" ||
        finalOrderStatus === "Accepted"
      ) {
        handleShowSpinner();
        OrderRepository.downloadInvoice(id)
          .then((response) => {
            handleCloseSpinner();
          })
          .catch((error) => {
            handleCloseSpinner();
            console.error(error);
          });
      } else {
        setOpenOrderWarning(true);
      }
    },
    [finalOrderStatus]
  );

  const columns = [
    {
      headerName: "Route Name",
      field: "route_name",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          {params?.row.orderCreatedUserId?.route_name}
        </MDTypography>
      ),
    },
    {
      field: "products_size",
      width: 100,
      headerClassName: "super-app-theme--header",
      headerName: "Products No.",
      renderCell: (params) => (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          style={{ marginLeft: 10 }}
        >
          {params?.row.products.length}
        </MDTypography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 60,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <ActionMenu
          admin={params?.row?.user?.admin}
          orderStatus={params?.row?.status}
          handleEditAction={() => handleEditAction(params?.row._id)}
          handleDeleteAction={() => handleDeleteAction(params?.row._id)}
          handleDownloadAction={() =>
            handleDownloadInvoice(params?.row?.status, params?.row._id)
          }
          handleViewAction={() => handleViewAction(params?.row?._id)}
        />
      ),
    },
    {
      field: "order_amount",
      headerName: "Order",
      headerClassName: "super-app-theme--header",
      width: 105,
      renderCell: (params) => (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          {convertCurrency(params.row?.totalPrice)}
        </MDTypography>
      ),
    },
    {
      field: "dueAmount",
      headerName: "Due",
      headerClassName: "super-app-theme--header",
      width: 105,
      renderCell: (params) => (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          {convertCurrency(params.row?.previousOrderDueAmount)}
        </MDTypography>
      ),
    },
    {
      field: "total_amount",
      headerName: "Total",
      headerClassName: "super-app-theme--header",
      width: 105,
      renderCell: (params) => (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          {convertCurrency(params.row?.totalAmount)}
        </MDTypography>
      ),
    },
    {
      field: "paidAmount",
      width: 100,
      headerName: "Paid",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          {convertCurrency(params.row?.paidAmount)}
        </MDTypography>
      ),
    },
    {
      field: "todays Due",
      width: 105,
      headerClassName: "super-app-theme--header",
      headerName: "Today's Due",
      renderCell: (params) => (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          {convertCurrency(params.row?.duePayment)}
        </MDTypography>
      ),
    },

    {
      field: "orderDate",
      headerName: "Order Date",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          {convertDate(params.row?.orderDate)}
        </MDTypography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerClassName: "super-app-theme--header",
      align: "center",
      renderCell: (params) => (
        <>
          <CustomSelect
            onChange={(event) =>
              handleChangeStatus(params?.row._id, event.target.value)
            }
            value={params?.row?.status}
            fullWidth
            variant="outlined"
            sx={{ p: 1 }}
          >
            <MenuItem value="Pending">
              <div style={{ color: "red", fontWeight: "bolder" }}>Pending</div>
            </MenuItem>
            <MenuItem value="Accepted">
              <div style={{ color: "#F2A000", fontWeight: "bolder" }}>
                Accepted
              </div>
            </MenuItem>
            <MenuItem value="Completed">
              <div style={{ color: "green", fontWeight: "bolder" }}>
                Completed
              </div>
            </MenuItem>
          </CustomSelect>
        </>
      ),
    },
    {
      field: "paymentStatus",
      headerClassName: "super-app-theme--header",
      headerName: "Payment Status",
      width: 120,
      renderCell: (params) => (
        <>
          <CustomSelect
            disabled={params?.row?.status === "Completed"}
            onChange={(event) =>
              handleChangePaymentStatus(params?.row._id, event.target.value)
            }
            value={params.row?.paymentStatus}
            fullWidth
            variant="outlined"
            sx={{ p: 1 }}
          >
            <MenuItem value="Paid">
              <div style={{ color: "red", fontWeight: "bolder" }}>Paid</div>
            </MenuItem>
            <MenuItem value="Unpaid">
              <div style={{ color: "#F2A000", fontWeight: "bolder" }}>
                Unpaid
              </div>
            </MenuItem>
            {params.row?.paymentStatus !== "Paid" && (
              <MenuItem value="Partial Payment">
                <div style={{ color: "green", fontWeight: "bolder" }}>
                  Partial Payment
                </div>
              </MenuItem>
            )}
          </CustomSelect>
        </>
      ),
    },
  ];
  if (isLoading || !tableData || spinner) {
    return <Spinner />;
  }

  const handleChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const options = userData?.users?.map((item) => ({
    value: item._id,
    label: item.route_name,
  }));

  const calculateTotals = (data) => {
    let orderAmountTotal = 0;
    let dueAmountTotal = 0;
    let totalAmountTotal = 0;
    let paidAmountTotal = 0;
    let todayDueAmountTotal = 0;

    data.forEach((row) => {
      orderAmountTotal += row.totalPrice;
      dueAmountTotal += row.previousOrderDueAmount;
      totalAmountTotal += row.totalAmount;
      paidAmountTotal += row.paidAmount;
      todayDueAmountTotal += row.duePayment;
    });

    return {
      orderAmountTotal,
      dueAmountTotal,
      totalAmountTotal,
      paidAmountTotal,
      todayDueAmountTotal,
    };
  };

  const {
    orderAmountTotal,
    dueAmountTotal,
    totalAmountTotal,
    paidAmountTotal,
    todayDueAmountTotal,
  } = calculateTotals(tableData);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <AlertBox
        openAlert={openAlert}
        alertMessage={alertMessage}
        setOpenAlert={setOpenAlert}
      />
      <OrderPaymentDialogBox
        open={openPaymentDialog}
        payment={payment}
        setPayment={setPayment}
        handlePaymentStatusUpdate={handlePaymentStatusUpdate}
        handleClose={handleClosePaymentDialog}
      />
      <CompleteOrderStatusWarning
        open={openOrderWarning}
        handleClickOpen={handleClickOrderWarningOpen}
        handleClose={handleCloseOrderWarning}
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
                  Orders List
                </MDTypography>
                {tableData && !spinner && (
                  <MDBox display="flex" justifyContent="space-between">
                    <TextField
                      style={{ minWidth: 150 }}
                      label="Start Date"
                      type="date"
                      variant="outlined"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "white" },
                      }}
                      InputProps={{
                        inputProps: {
                          style: { color: "white" },
                        },
                      }}
                    />
                    <TextField
                      style={{ minWidth: 150, marginLeft: 20 }}
                      label="End Date"
                      type="date"
                      variant="outlined"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "white" },
                      }}
                      InputProps={{
                        inputProps: {
                          style: { color: "white" },
                        },
                      }}
                    />

                    {userData && (
                      <Select
                        id="user"
                        value={selectedUser}
                        placeholder="Route"
                        onChange={handleChange}
                        options={options}
                        label={
                          <InputLabel sx={{ color: "white" }}>Route</InputLabel>
                        }
                        isSearchable
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            width: "100%",
                            marginRight: 20,
                            marginLeft: 20,
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "transparent",
                            height: 43,
                            width: 200,
                            borderColor: "white",
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            color: "white",
                            fontSize: "14px",
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            color: "white",
                            fontSize: "14px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "lightgrey"
                              : "transparent",
                            color: "#1B72E8",
                            fontWeight: state.isSelected ? "bold" : "normal",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            fontSize: "14px", // set your desired font size here
                          }),
                          placeholder: (defaultStyles) => {
                            return {
                              ...defaultStyles,
                              color: "white",
                              fontSize: "14px",
                            };
                          },
                        }}
                      />
                    )}

                    <MDButton
                      variant="gradient"
                      color="dark"
                      fullWidth
                      style={{ height: "45px" }}
                      onClick={handleClearFilter}
                    >
                      <Icon sx={{ fontWeight: "bold" }}>close</Icon>
                      &nbsp;clear filter
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>
              <MDBox
                pt={3}
                sx={{
                  height: 800,
                  width: "100%",
                  "& .super-app-theme--header": {
                    fontSize: 13,
                  },
                }}
              >
                {tableData && !spinner && (
                  <DataGrid
                    components={{ Toolbar: TotalToolbar }}
                    rows={tableData}
                    columns={columns}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    componentsProps={{
                      toolbar: {
                        orderAmount: convertCurrency(orderAmountTotal),
                        dueAmount: convertCurrency(dueAmountTotal),
                        totalAmount: convertCurrency(totalAmountTotal),
                        paidAmount: convertCurrency(paidAmountTotal),
                        todayDueAmount: convertCurrency(todayDueAmountTotal),
                      },
                    }}
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default OrderList;
