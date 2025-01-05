import React, { useState, useCallback, useMemo } from "react";
import { IconButton, Icon, Menu, Box } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import CategoryRepository from "layouts/category/repository/CategoryRepository";
import UserInformation from "components/TableComponents/UserInformation";
import MDButton from "components/MDButton";
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
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleEditAction = useCallback((categoryId) => {
    navigate("/category/edit", { state: { id: categoryId } });
  }, [navigate, selectedCategoryId]);

  const handleViewAction = useCallback(
    (categoryId) => {
      navigate("/category/view", { state: { id: categoryId } });
    },
    [navigate]
  );

  const deleteCategory = useCallback(async (id) => {
    return await CategoryRepository.delete(id);
  }, []);

  const { mutateAsync, isLoading: isMutate } = useMutation(deleteCategory, {
    onSuccess: (response) => {
      setOpenAlert(true);
      setAlertMessage("Category Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Category Deletion Unsuccessful");
    },
  });

  const remove = useCallback(async (id) => {
    await mutateAsync(id);
    queryClient.invalidateQueries("category");
  }, [mutateAsync, queryClient, selectedCategoryId]);

  const handleDeleteAction = useCallback((id) => {
    remove(id);
  }, [remove]);

  const columns = useMemo(
    () => [
      { Header: "Category photo", accessor: "photo", align: "center" },
      { Header: "category name", accessor: "categoryName", align: "center" },
      { Header: "category description", accessor: "categoryDescription", align: "left" },
      { Header: "category", accessor: "category", width: "10%", align: "center" },
      { Header: "action", accessor: "action", width: "10%", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      rowData?.map((row) => ({
        photo: (
          <UserInformation image={`${row.category_photo}`} name="" mobile="" />
        ),
        categoryName: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row.category_name}
          </MDTypography>
        ),
        categoryDescription: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row.category_description}
          </MDTypography>
        ),
        action: (
          <ActionMenu
          handleEditAction={() => handleEditAction(row._id)}
          handleDeleteAction={() => handleDeleteAction(row._id)}
          />
        ),
        category: (
          <MDButton variant="text" color="dark" onClick={() => handleViewAction(row._id)}>
            <Icon>people</Icon>
            &nbsp;view details
          </MDButton>
        ),
      })),
    [rowData, handleEditAction, handleDeleteAction, handleViewAction]
  );

  return { rows, columns };
};

export default useTables;
