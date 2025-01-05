import React, { useState, useCallback, useMemo } from "react";
import { IconButton, Icon, Menu, Box } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import UserInformation1 from "components/TableComponents/UserInformation1";
import Address from "components/TableComponents/Address";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import avatar from "../../../../assets/images/avatar.png";
import LabourRepository from "layouts/labour/repository/LabourRepository";
import "react-calendar/dist/Calendar.css";
import ConfirmDialog from "components/DilaogBox/DeleteConfirmationDailogBox";

const ActionMenu = ({ handleEditAction, handleDeleteAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const openConfirmDialog = () => {
    setConfirmDialogOpen(true);
    handleClose();
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const confirmDelete = () => {
    handleDeleteAction();
    closeConfirmDialog();
  };

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
          <MDButton variant="text" color="dark" onClick={handleEditAction}>
            <Icon>edit</Icon>
            &nbsp;edit
          </MDButton>
          <MDButton variant="text" color="error" onClick={openConfirmDialog}>
            <Icon>delete</Icon>
            &nbsp;delete
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

const useTables = (rowData, setOpenAlert, setAlertMessage) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = useCallback((event, userId) => {
    setAnchorEl(event.currentTarget)
    setSelectedUserId(userId);
    setOpenMenu(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleEditAction = useCallback((userId) => {
    navigate("/labour/edit", { state: { id: userId } });
  }, [navigate, selectedUserId]);


  const handleAttendanceAction = useCallback(
    (userId) => {
      navigate(`/labour/attendance/view`, { state: { id: userId } });
    },
    [navigate]
  );

  const handlePaymentAction = useCallback(
    (userId) => {
      navigate(`/labour/payment/view`, { state: { id: userId } });
    },
    [navigate]
  );

  const deleteLabour = useCallback(async (id) => {
    return await LabourRepository.delete(id);
  }, []);

  const { mutateAsync, isLoading: isMutate } = useMutation(deleteLabour, {
    onSuccess: (response) => {
      setOpenAlert(true);
      setAlertMessage("Labour Deleted Successfully");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Labour Deletion Unsuccessful");
    },
  });

  const remove = useCallback(async (id) => {
    await mutateAsync(id);
    queryClient.invalidateQueries("labour");
  }, [mutateAsync, queryClient, selectedUserId]);

  const handleDeleteAction = useCallback((id) => {
    remove(id);
  }, [remove]);

  const convertCurrency = useCallback((value) => {
    const options = {
      style: "currency",
      currency: "INR",
      signDisplay: value < 0 ? "always" : "auto",
    };
    const formattedNumber = value.toLocaleString("en-IN", options);
    return formattedNumber;
  }, []);

  const handleLabourStatusChange = async (status, id) => {
    return await LabourRepository.updateLabourStatus(status, id).then(() => {
      setOpenAlert(true);
      setAlertMessage("Labour Status Updated Successfully");
    });
  }

  const columns = useMemo(
    () => [
      { Header: "Labour", accessor: "labour", align: "left" },
      { Header: "Salary (per month)", accessor: "salary", align: "left" },
      { Header: "Payable Payment", accessor: "payablePayment", align: "left" },
      { Header: "Due Payment", accessor: "duePayment", align: "left" },
      { Header: "Advance Payment", accessor: "advancePayment", align: "left" },
      { Header: "Attendance", accessor: "attendance", align: "center" },
      { Header: "Payment", accessor: "payment", align: "center" },
      { Header: "Status", accessor: "labourStatus", align: "center" },
      { Header: "Pay. Status", accessor: "paymentStatus", align: "center" },
      { Header: "Action", accessor: "action", width: "10%", align: "left" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      rowData?.map((row) => ({
        labour: (
          <UserInformation1
            image={
              row?.labour_profile
                ? row.labour_profile === null || row.labour_profile === "/static/media/avatar.bff229850f7694712b25.png"
                  ? avatar
                  : `${row?.labour_profile}`
                : avatar
            }
            name={row?.labour_name}
            mobile={row?.mobile_number}
          />
        ),
        salary: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {convertCurrency(row.salary)}
          </MDTypography>
        ),
        payablePayment: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {convertCurrency(row.payableAmount)}
          </MDTypography>
        ),
        duePayment: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {convertCurrency(row.dueAmount)}
          </MDTypography>
        ),
        advancePayment: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {convertCurrency(row.advancePayment)}
          </MDTypography>
        ),
        address: <Address address={row.address} city={row.city} state={row.state} />,
        paymentStatus: <div>
          {row.paymentStatus === undefined || row.paymentStatus === "" ? "Unpaid" : row.paymentStatus}
        </div>,
        action: (
          <>
            <ActionMenu
              handleEditAction={() => handleEditAction(row._id)}
              handleDeleteAction={() => handleDeleteAction(row._id)}
            />
          </>
        ),
        labourStatus: (
          <MDButton variant="contained" size="small" color="success" style={{ fontSize: 10 }} onClick={() => handleLabourStatusChange(row.status === "Active" ? "Inactive" : "Active", row._id)}>
            <Icon>people</Icon>
            &nbsp;{row.status === "Active" ? "Inactive" : "Active"}
          </MDButton>
        ),
        attendance: (
          <MDButton variant="contained" size="small" color="success" style={{ marginRight: 0, fontSize: 10 }} onClick={() => handleAttendanceAction(row._id)}>
            <Icon>people</Icon>
            &nbsp;Attendance
          </MDButton>
        ),
        payment: (
          <MDButton variant="contained" size="small" color="success" style={{ marginRight: 0, fontSize: 10 }} onClick={() => handlePaymentAction(row._id)}>
            <Icon>people</Icon>
            &nbsp;Payment
          </MDButton>
        ),
      })),
    [
      rowData,
      convertCurrency,
      handleOpenMenu,
      openMenu,
      handleCloseMenu,
      handleEditAction,
      handleDeleteAction,
      handleAttendanceAction,
      handlePaymentAction,
    ]
  );

  return { rows, columns };
};

export default useTables;
