import React, { useState } from "react";
import { IconButton, Icon, Menu, Box } from "@mui/material";
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
    const [openDialog, setOpenDialog] = React.useState(false);
    const [type, setType] = useState();
    const [openActionAlert, setOpenActionAlert] = useState(false)
    const [alertActionMessage, setAlertActionMessage] = useState("")
    const [rawMaterialId, setRawMaterialId] = useState()
    const [totalQuantity, setTotalQuantity] = useState()
    const [anchorEl, setAnchorEl] = useState(null)


    const handleOpenAlert = () => {
        setOpenActionAlert(true)
        setAlertActionMessage("Action Successful")
        queryClient.invalidateQueries("rawmaterials");
    }


    const handleDialogBoxClose = () => {
        setOpenDialog(false);
    };

    const [openMenu, setOpenMenu] = useState(false);

    // Open Menu
    const handleOpenMenu = (event, userId) => {
        setAnchorEl(event.currentTarget)
        setSelectedUserId(userId);
        setOpenMenu(event.currentTarget)
    };

    //Close Menu
    const handleCloseMenu = () => setOpenMenu(false);

    const handleEditAction = () => {
        navigate("/raw-material/edit", { state: { id: selectedUserId } })
    }

    const handelViewAction = (rawMaterialId) => {
        navigate("/raw-material/view", { state: { id: rawMaterialId } })
    }

    //View Category Details
    const handelViewHistoryAction = (rawMaterialId, name, type) => {
        navigate("/raw-material/history", { state: { id: rawMaterialId, rawMaterialName: name, quantityType: type } })
    }

    //Buy Raw Material Detals
    const handleAction = (type, id, quantity) => {
        if (type === "buy") {
            setType("buy")
        }
        else {
            setType("use")
        }
        setRawMaterialId(id)
        setTotalQuantity(quantity)
        setOpenDialog(true);
    }

    //Delete Category
    const deleteRawMaterial = async (id) => {
        return await RawMaterialRepository.delete(id);
    };

    //User form hook for deletion
    const { mutateAsync, isLoading: isMutate } = useMutation(deleteRawMaterial, {
        onSuccess: (response) => {
            setOpenAlert(true)
            setAlertMessage("Raw Material Deletion Successful")
        },
        onError: (err) => {
            setOpenAlert(true)
            setAlertMessage("Raw Material Deletion Unsucessful")
        },
    });

    const remove = async () => {
        await mutateAsync(selectedUserId);
        queryClient.invalidateQueries("rawmaterials");
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
        { Header: "Raw Material name", accessor: "rawMaterialName", align: "center" },
        { Header: "Raw Material Quantiy", accessor: "rawMaterialQuantity", align: "center" },
        { Header: "Buy/Use", accessor: "buyUse", align: "center" },
        { Header: "View History", accessor: "rawMaterialHistory", width: "10%", align: "center" },
        { Header: "View Details", accessor: "rawMaterial", width: "10%", align: "center" },
        { Header: "action", accessor: "action", width: "10%", align: "center" },
    ];



    const rows = rowData?.map((row) => ({
        rawMaterialName: (
            <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
            >
                {row.raw_material_name}
            </MDTypography>
        ),
        rawMaterialQuantity: (
            <MDTypography
                component="a"
                href="#"
                variant="caption"
                color={row.total_quantity <= row.raw_material_min_quantity ? "error" : "text"}
                fontWeight="medium"
            >

                {row?.total_quantity ? `${row.total_quantity} (${row.quantity_type})` : `0 (${row.quantity_type})`}
            </MDTypography>
        ),
        buyUse: (
            <Row>
                <MDButton
                    variant="contained"
                    size="small"
                    color="success"
                    style={{ marginRight: 10 }}
                    onClick={() => handleAction("buy", row._id, row.total_quantity)}
                >
                    <ShoppingBasketIcon />
                    &nbsp;BUY
                </MDButton>
                <MDButton
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleAction("use", row._id, row.total_quantity)}
                >
                    <StorefrontIcon />
                    &nbsp;USE
                </MDButton>
            </Row>
        ),
        action: (
            <>
                <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    aria-controls="notification-menu"
                    aria-haspopup="true"
                    variant="contained"
                    onClick={(e) => handleOpenMenu(e, row?._id)}
                >
                    <MoreVertRoundedIcon />
                </IconButton>
                <ActionMenu openMenu={openMenu} anchorEl={anchorEl}
                    handleCloseMenu={handleCloseMenu} handleEditAction={handleEditAction} handelDeleteAction={handelDeleteAction} />
            </>
        ),
        rawMaterial: (
            <>
                <AlertBox
                    openAlert={openActionAlert}
                    alertMessage={alertActionMessage}
                    setOpenAlert={setOpenActionAlert}
                />
                <FormDialog open={openDialog} handleClose={handleDialogBoxClose} type={type} rawMaterialId={rawMaterialId} handleOpenAlert={handleOpenAlert} totalQuantity={totalQuantity} />
                <MDButton
                    variant="text"
                    color="dark"
                    onClick={() => handelViewAction(row._id)}
                >
                    <Icon>people</Icon>
                    &nbsp;view details
                </MDButton>
            </>
        ),
        rawMaterialHistory: (
            <MDButton
                variant="text"
                color="dark"
                onClick={() => handelViewHistoryAction(row._id, row.raw_material_name, row.quantity_type)}
            >
                <Icon>people</Icon>
                &nbsp;view history
            </MDButton>
        ),
    }));

    return { rows, columns };
}



export default useTables;
