import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IconButton, Icon, Menu, Box, Select, MenuItem } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import OrderRepository from "layouts/order/repository/OrderRepository";
import ConfirmationDialogBox from "components/DilaogBox/ConfirmationDialogBox";
import AlertBox from "components/AlertBox/AlertBox";
import CompleteOrderStatusWarning from "components/DilaogBox/CompleteOrderStatusWarning";
import { isDeepEqual } from "@mui/x-data-grid/internals";
import OrderPaymentDialogBox from "components/DilaogBox/OrderPaymentDialogBox";

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

  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

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
              <MDButton
                variant="text"
                color="dark"
                onClick={() => handleEditAction()}
              >
                <Icon>edit</Icon>
                &nbsp;edit
              </MDButton>
            )}
          {orderStatus !== "Completed" && (
            <MDButton
              variant="text"
              color="error"
              onClick={() => handleDeleteAction()}
            >
              <Icon>delete</Icon>
              &nbsp;delete
            </MDButton>
          )}
          <MDButton
            variant="text"
            color="dark"
            onClick={() => handleViewAction()}
          >
            <Icon>edit</Icon>
            &nbsp;view details
          </MDButton>
          <MDButton
            variant="text"
            color="dark"
            onClick={() => handleDownloadAction()}
          >
            <Icon>download</Icon>
            &nbsp;download invoice
          </MDButton>
        </Box>
      </Menu>
    </>
  );
};

const useOrderTable = (
  rowData,
  setOpenAlert,
  setAlertMessage,
  handleShowSpinner,
  handleCloseSpinner
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = React.useState(false);
  const [openOrderWarning, setOpenOrderWarning] = React.useState(false);
  const [orderStatus, setOrderStatus] = useState();
  const [finalOrderStatus, setFinalOrderStatus] = useState();
  const [orderId, setOrderId] = useState();
  const [openOrderAlert, setOpenOrderAlert] = useState(false);
  const [orderAlertMessage, setOrderAlertMessage] = useState(
    "Order Status Changed Successfully"
  );
  const [openOrderPaymentStatusAlert, setOrderPaymentStatusAlert] =
    useState(false);
  const [paymentStatusAlertMessage, setPaymentStatusAlertMessage] = useState(
    "Order Payment Status Changed Successfully"
  );

  const [tablePaymentStatus, setTablePaymentStatus] = useState();

  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [payment, setPayment] = useState(0);

  const handleChangePaymentStatus = useCallback((orderId, status) => {
    setTablePaymentStatus(status);
    setOrderId(orderId);
    if (status === "Partial Payment") {
      setOpenPaymentDialog(true);
    } else {
      OrderRepository.updatePaymentStatus(orderId, 0, status).then((result) => {
        setOrderPaymentStatusAlert(true);
        queryClient.invalidateQueries("orders");
      });
    }
  }, []);

  const handleClickOpen = useCallback(() => {
    // setOpen(false);
    // OrderRepository.updateOrderStatus(orderStatus, orderId, payment, paymentStatus)
    //   .then((result) => {
    //     setOpenOrderAlert(true);
    //     setFinalOrderStatus(orderStatus);
    //     queryClient.invalidateQueries("orders");
    //   });
  }, [orderStatus, orderId, payment, paymentStatus, queryClient]);

  const handlePaymentStatusUpdate = useCallback(() => {
    OrderRepository.updatePaymentStatus(
      orderId,
      payment,
      tablePaymentStatus
    ).then((result) => {
      setOpenPaymentDialog(false);
      setOrderPaymentStatusAlert(true);
      queryClient.invalidateQueries("orders");
    });
  }, [orderId, payment, tablePaymentStatus, queryClient]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClosePaymentDialog = useCallback(() => {
    setOpenPaymentDialog(false);
  }, []);

  const handleClickOrderWarningOpen = useCallback(() => {
    setOpenOrderWarning(false);
  }, []);

  const handleCloseOrderWarning = useCallback(() => {
    setOpenOrderWarning(false);
  }, []);

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
  // Delete Order
  const deleteOrder = useCallback(
    async (id) => {
      return await OrderRepository.delete(id);
    },
    [OrderRepository]
  );

  //User form hook for deletion
  const { mutateAsync, isLoading: isMutate } = useMutation(deleteOrder, {
    onSuccess: (response) => {
      setOpenAlert(true);
      setAlertMessage("Order Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Order Deletion Unsucessful");
    },
  });

  const remove = useCallback(
    async (id) => {
      await mutateAsync(id);
      queryClient.invalidateQueries("orders");
    },
    [mutateAsync, selectedUserId, queryClient]
  );

  const handleDeleteAction = useCallback(
    (id) => {
      remove(id);
    },
    [remove]
  );

  const handleChangeStatus = useCallback((id, status) => {
    //setOpen(true);
    setOrderStatus(status);
    setOrderId(id);
    OrderRepository.updateOrderStatus(status, id, payment, paymentStatus).then(
      (result) => {
        setOpenOrderAlert(true);
        setFinalOrderStatus(orderStatus);
        queryClient.invalidateQueries("orders");
      }
    );
  }, []);

  const convertDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    };
    const localDateString = date.toLocaleDateString("en-US", options);
    return localDateString;
  }, []);

  const convertCurrency = useCallback((value) => {
    const options = { style: "currency", currency: "INR" };
    const formattedNumber = value?.toLocaleString("en-IN", options);
    return formattedNumber;
  }, []);

  const handleDownloadInvoice = useCallback(
    (orderStatusCurrent, id) => {
      if (
        finalOrderStatus === "Completed" ||
        orderStatusCurrent === "Completed"
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
    [
      finalOrderStatus,
      handleShowSpinner,
      handleCloseSpinner,
      OrderRepository,
      selectedUserId,
    ]
  );

  const columns = useMemo(
    () => [
      {
        Header: "route name",
        accessor: "routeName",
        width: "20%",
        align: "center",
      },
      {
        Header: "No. of Products",
        accessor: "productsLength",
        width: "25%",
        align: "center",
      },
      {
        Header: "Order Amount",
        accessor: "orderAmount",
        width: "20%",
        align: "center",
      },
      {
        Header: "Previous Due Amount",
        accessor: "dueAmount",
        width: "20%",
        align: "center",
      },
      {
        Header: "Total Amount",
        accessor: "totalAmount",
        width: "20%",
        align: "center",
      },
      {
        Header: "Paid amount",
        accessor: "paidAmount",
        width: "20%",
        align: "center",
      },
      {
        Header: "Today's Due amount",
        accessor: "todaysDueAmount",
        width: "20%",
        align: "center",
      },
      {
        Header: "Order Date",
        accessor: "orderDate",
        width: "20%",
        align: "center",
      },
      { Header: "status", accessor: "status", width: "30%", align: "center" },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        width: "30%",
        align: "center",
      },
      { Header: "action", accessor: "action", width: "10%", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      rowData?.map((row) => ({
        userName: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row?.orderCreatedUserId?.user_name}
          </MDTypography>
        ),
        routeName: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row?.orderCreatedUserId?.route_name}
          </MDTypography>
        ),
        productsLength: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row?.products?.length}
          </MDTypography>
        ),
        orderAmount: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {convertCurrency(row.totalPrice)}
          </MDTypography>
        ),
        dueAmount: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {convertCurrency(row.previousOrderDueAmount)}
          </MDTypography>
        ),
        totalAmount: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {convertCurrency(row.totalAmount)}
          </MDTypography>
        ),
        todaysDueAmount: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {convertCurrency(row.duePayment)}
          </MDTypography>
        ),
        paidAmount: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {convertCurrency(row.paidAmount)}
          </MDTypography>
        ),
        orderDate: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {convertDate(row?.created_at)}
          </MDTypography>
        ),
        status: (
          <>
            <AlertBox
              openAlert={openOrderAlert}
              alertMessage={orderAlertMessage}
              setOpenAlert={setOpenOrderAlert}
            />
            <ConfirmationDialogBox
              open={open}
              handleClickOpen={handleClickOpen}
              handleClose={handleClose}
            />
            <OrderPaymentDialogBox
              open={openPaymentDialog}
              payment={payment}
              setPayment={setPayment}
              setPaymentStatus={setPaymentStatus}
              handlePaymentStatusUpdate={handlePaymentStatusUpdate}
              handleClose={handleClosePaymentDialog}
              paymentStatus={paymentStatus}
            />
            <CompleteOrderStatusWarning
              open={openOrderWarning}
              handleClickOpen={handleClickOrderWarningOpen}
              handleClose={handleCloseOrderWarning}
            />
            <Select
              defaultValue={row?.status}
              onChange={(event) =>
                handleChangeStatus(row._id, event.target.value)
              }
              value={row?.status}
              fullWidth
              variant="outlined"
              sx={{ p: 1 }}
            >
              <MenuItem value="Pending">
                <div style={{ color: "red", fontWeight: "bolder" }}>
                  Pending
                </div>
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
            </Select>
          </>
        ),
        paymentStatus: (
          <>
            <AlertBox
              openAlert={openOrderPaymentStatusAlert}
              alertMessage={paymentStatusAlertMessage}
              setOpenAlert={setOrderPaymentStatusAlert}
            />

            <Select
              disabled={
                orderStatus === "Completed" || row?.status === "Completed"
              }
              defaultValue={row?.paymentStatus}
              onChange={(event) =>
                handleChangePaymentStatus(row._id, event.target.value)
              }
              value={tablePaymentStatus}
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
              {row?.paymentStatus !== "Paid" && (
                <MenuItem value="Partial Payment">
                  <div style={{ color: "green", fontWeight: "bolder" }}>
                    Partial Payment
                  </div>
                </MenuItem>
              )}
            </Select>
          </>
        ),
        action: (
          <ActionMenu
            admin={row?.user?.admin}
            orderStatus={row?.status}
            handleEditAction={() => handleEditAction(row._id)}
            handleDeleteAction={() => handleDeleteAction(row._id)}
            handleDownloadAction={() =>
              handleDownloadInvoice(row?.status, row._id)
            }
            handleViewAction={() => handleViewAction(row?._id)}
          />
        ),
      })),
    [
      rowData,
      convertCurrency,
      convertDate,
      openOrderAlert,
      orderAlertMessage,
      setOpenOrderAlert,
      handleClickOpen,
      handleClose,
      openPaymentDialog,
      payment,
      orderStatus,
      setPayment,
      setPaymentStatus,
      handlePaymentStatusUpdate,
      handleClosePaymentDialog,
      paymentStatus,
      openOrderWarning,
      handleClickOrderWarningOpen,
      handleCloseOrderWarning,
      handleChangeStatus,
      orderStatus,
      handleChangePaymentStatus,
      handleEditAction,
      handleDeleteAction,
      handleViewAction,
    ]
  );

  return { rows, columns };
};

export default useOrderTable;
