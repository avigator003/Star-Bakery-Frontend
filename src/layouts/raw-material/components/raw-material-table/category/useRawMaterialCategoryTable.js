import React, { useState } from "react";
import { IconButton, Icon, Menu, Box, Dialog, TextField, DialogTitle, DialogContent } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import RawMaterialRepository from "layouts/raw-material/repository/RawMaterialRepository";
import FormDialog from "components/DilaogBox/FormDialog";
import AlertBox from "components/AlertBox/AlertBox";
import MDBox from "components/MDBox";
import ConfirmDialog from "components/DilaogBox/DeleteConfirmationDailogBox";

const ActionMenu = (props) => {
  const {
    openMenu,
    anchorEl,
    handleCloseMenu,
    handleEditAction,
    handelDeleteAction,
  } = props;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
const handleCancelDelete = () => {
  setConfirmDialogOpen(false);
  handleCloseMenu();
}
const handleConfirmDelete = () => {
  handelDeleteAction();
  setConfirmDialogOpen(false);
  handleCloseMenu();
}
  return (
    <>
    <Menu
      anchorEl={anchorEl}
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
        <MDButton
          variant="text"
          color="dark"
          onClick={() => handleEditAction()}
        >
          <Icon>edit</Icon>
          &nbsp;edit
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          onClick={() => setConfirmDialogOpen(true)}
        >
          <Icon>delete</Icon>
          &nbsp;delete
        </MDButton>
      </Box>
    </Menu>
    <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this raw material?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
</>
  );
};

const useTables = (rowData, setOpenAlert, setAlertMessage) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null)
    const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryNameValues, setCategoryNameValues] = useState({});

    const closeAddCategoryDialog = () => {
        setIsAddCategoryDialogOpen(false);
        setNewCategoryName(''); // Clear the input field when closing the dialog
    };


    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenMenu = (event, userId, categoryName) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserId(userId);
        setCategoryNameValues((prevValues) => ({
            ...prevValues,
            [userId]: categoryName, // Set the categoryName value for the specific row
        }));
        setOpenMenu(event.currentTarget);
    };

    //Close Menu
    const handleCloseMenu = () => setOpenMenu(false);

    const handleEditAction = () => {
        setIsAddCategoryDialogOpen(true);
    }

    //Delete Category
    const deleteRawMaterialCategory = async (id) => {
        return await RawMaterialRepository.deleteCategory(id);
    };

    //User form hook for deletion
    const { mutateAsync, isLoading: isMutate } = useMutation(deleteRawMaterialCategory, {
        onSuccess: (response) => {
            setOpenAlert(true)
            setAlertMessage("Raw Material Category Deletion Successful")
        },
        onError: (err) => {
            setOpenAlert(true)
            setAlertMessage("Raw Material Category Deletion Unsucessful")
        },
    });

    const remove = async () => {
        await mutateAsync(selectedUserId);
        queryClient.invalidateQueries("rawmaterialscategories");
    };


    const handelDeleteAction = () => {
        remove();
    }

    const Row = styled.div`
      display:flex;
      flex-direction:row;
      justify-content:space-between;
`;

    const columns = [
        { Header: "Raw Material Category name", accessor: "rawMaterialName", align: "center" },
        { Header: "action", accessor: "action", width: "50%", align: "center" },
    ];



    const updateRawMaterialCategory = async (id) => {
        handleCloseMenu();
        return await RawMaterialRepository.updateCategory(id, categoryNameValues[id]);
    };


    const { mutateAsync: updateAsync } = useMutation(updateRawMaterialCategory, {
        onSuccess: () => {
            setOpenAlert(true)
            setAlertMessage("Raw Material Category Updated Succesfully")
        },
        onError: async (err) => {
            setOpenAlert(true)
            setAlertMessage("Raw Material Category Updated Unsuccessful.")
        },
    });

    const handleUpdateCategory = async (id) => {
        await updateAsync(id, categoryNameValues[selectedUserId]);
        queryClient.invalidateQueries("rawmaterialscategories");
        closeAddCategoryDialog();
    };



    const rows = rowData?.map((row) => ({
        rawMaterialName: (
            <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
            >
                {row.name}
            </MDTypography>
        ),
        action: (
            <>
                <Dialog
                    open={isAddCategoryDialogOpen && selectedUserId === row._id}
                    onClose={closeAddCategoryDialog}
                    fullWidth
                >
                    <DialogTitle>Edit Category</DialogTitle>

                    <DialogContent>
                        <TextField
                            label="Category Name"
                            value={categoryNameValues[row._id] || ''}
                            onChange={(e) =>
                                setCategoryNameValues((prevValues) => ({
                                    ...prevValues,
                                    [row._id]: e.target.value,
                                }))
                            }
                            style={{ marginTop: 10 }}
                            fullWidth
                            variant="outlined"
                        />
                    </DialogContent>
                    <MDBox mt={2} mb={2} mx={2} display="flex" justifyContent="flex-end">
                        <MDButton
                            variant="outlined"
                            color="error"
                            onClick={closeAddCategoryDialog}
                            style={{ marginRight: '8px' }}
                        >
                            Cancel
                        </MDButton>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={() => {
                                handleUpdateCategory(row?._id);
                            }}
                        >
                            Edit
                        </MDButton>
                    </MDBox>
                </Dialog>
                <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    aria-controls="notification-menu"
                    aria-haspopup="true"
                    variant="contained"
                    onClick={(e) => handleOpenMenu(e, row?._id, row.name)}
                >
                    <MoreVertRoundedIcon />
                </IconButton>
                <ActionMenu openMenu={openMenu}
                    anchorEl={anchorEl}
                    handleCloseMenu={handleCloseMenu}
                    handleEditAction={handleEditAction}
                    handelDeleteAction={handelDeleteAction} />
            </>
        )
    }));

    return { rows, columns };
}
export default useTables;
