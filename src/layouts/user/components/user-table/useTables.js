import React, { useState, useMemo, useCallback } from "react";
import { IconButton, Icon, Menu, Box } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import UserInformation from "components/TableComponents/UserInformation";
import Address from "components/TableComponents/Address";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import UserRepository from "layouts/user/repository/UserRepository";
import { useMutation, useQueryClient } from "react-query";
import avatar from "../../../../assets/images/avatar.png";
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

  const handleEditAction = useCallback((userId) => {
    navigate("/user/edit", { state: { id: userId } });
  }, [navigate, selectedUserId]);

  const handleViewAction = useCallback((userId) => {
    navigate("/user/view", { state: { id: userId } });
  }, [navigate]);

  const deleteUser = useCallback(async (userId) => {
    return await UserRepository.delete(userId);
  }, []);

  const { mutateAsync, isLoading: isMutate } = useMutation(deleteUser, {
    onSuccess: (response) => {
      setOpenAlert(true);
      setAlertMessage("User Deleted Successfully");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("User Deletion Unsuccessful");
    },
  });

  const remove = useCallback(async (userId) => {
    await mutateAsync(userId);
    queryClient.invalidateQueries("users");
  }, [mutateAsync, queryClient, selectedUserId]);

  const handleDeleteAction = useCallback((userId) => {
    setSelectedUserId(userId)
    remove(userId);
  }, [remove]);

  const columns = useMemo(
    () => [
      { Header: "user", accessor: "user", align: "left" },
      { Header: "route name", accessor: "route", align: "left" },
      { Header: "address", accessor: "address", align: "left" },
      { Header: "report", accessor: "report", width: "10%", align: "center" },
      { Header: "profile", accessor: "profile", width: "10%", align: "center" },
      { Header: "action", accessor: "action", width: "10%", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      rowData?.map((row) => ({
        user: (
          <UserInformation
            image={
              row?.user_profile
                ? row.user_profile === null || row.user_profile === "/static/media/avatar.bff229850f7694712b25.png"
                  ? avatar
                  : `${row?.user_profile}`
                : avatar
            }
            name={row.user_name}
            mobile={row.mobile_number}
          />
        ),
        route: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {row.route_name}
          </MDTypography>
        ),
        address: <Address address={row.address} city={row.city} state={row.state} />,
        action: (
          <ActionMenu
          handleEditAction={() => handleEditAction(row._id)}
          handleDeleteAction={() => handleDeleteAction(row._id)}
          />
        ),
        report: (
          <MDButton variant="text" color="dark">
            <Icon>assessment</Icon>
            &nbsp;show
          </MDButton>
        ),
        profile: (
          <MDButton variant="text" color="dark" onClick={() => handleViewAction(row._id)}>
            <Icon>people</Icon>
            &nbsp;view profile
          </MDButton>
        ),
      })),
    [rowData, handleEditAction, handleDeleteAction, handleViewAction]
  );

  return { rows, columns };
};

export default useTables;
