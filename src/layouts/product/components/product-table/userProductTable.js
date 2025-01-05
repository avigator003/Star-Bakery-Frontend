import React, { useState, useMemo, useCallback } from "react";
import { IconButton, Icon, Menu, Box } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import UserInformation from "components/TableComponents/UserInformation";
import Address from "components/TableComponents/Address";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import avatar from "../../../../assets/images/avatar.png";
import ProductRepository from "layouts/product/repository/ProductRepository";
import ConfirmDialog from "components/DilaogBox/DeleteConfirmationDailogBox";

const ActionMenu = (props) => {
  const { handleEditAction, handleDeleteAction } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDeleteConfirmation = () => {
    setConfirmDialogOpen(true);
    handleClose();
  };

  const handleConfirmDelete = () => {
    setConfirmDialogOpen(false);
    handleDeleteAction(); // Execute delete action
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
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
          <MDButton variant="text" color="error" onClick={handleDeleteConfirmation}>
            <Icon>delete</Icon>
            &nbsp;delete
          </MDButton>
        </Box>
      </Menu>
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this item?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

const useProductTable = (rowData, setOpenAlert, setAlertMessage) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleEditAction = useCallback((id) => {
    navigate("/product/edit", { state: { id: id } });
  }, [navigate, selectedUserId]);

  const handleViewAction = useCallback((categoryId) => {
    navigate("/product/view", { state: { id: categoryId } });
  }, [navigate]);

  const deleteProduct = useCallback(async (id) => {
    return await ProductRepository.delete(id);
  }, []);

  const { mutateAsync, isLoading: isMutate } = useMutation(deleteProduct, {
    refetchOnWindowFocus: false,
    onSuccess: (response) => {
      setOpenAlert(true);
      setAlertMessage("Product Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Product Deletion Unsuccessful");
    },
  });

  const remove = useCallback(async (id) => {
    await mutateAsync(id);
    queryClient.invalidateQueries("products");
  }, [mutateAsync, queryClient, selectedUserId]);

  const handleDeleteAction = useCallback((id) => {
    remove(id);
  }, [remove]);

  const columns = useMemo(
    () => [
      { Header: "Product photo", accessor: "productPhoto", align: "center" },
      { Header: "Product name", accessor: "productName", align: "center" },
      { Header: "Product category", accessor: "productCategory", align: "center" },
      { Header: "product", accessor: "product", width: "10%", align: "center" },
      { Header: "action", accessor: "action", width: "10%", align: "center" },
    ],
    []
  );

  const rows = useMemo(
    () =>
      rowData?.map((row) => ({
        productPhoto: (
          <UserInformation
            image={row?.product_photo ? row.product_photo : avatar}
            name=""
            mobile=""
          />
        ),
        productName: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row.product_name}
          </MDTypography>
        ),
        productCategory: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row.product_category?.category_name}
          </MDTypography>
        ),
        product: (
          <MDButton
            variant="text"
            color="dark"
            onClick={() => handleViewAction(row._id)}
          >
            <Icon>people</Icon>
            &nbsp;view details
          </MDButton>
        ),
        action: (
            <ActionMenu
            handleEditAction={() => handleEditAction(row._id)}
            handleDeleteAction={() => handleDeleteAction(row._id)}
            />
        ),
      })),
    [rowData,handleEditAction, handleDeleteAction, handleViewAction]
  );

  return { rows, columns };
};

export default useProductTable;
