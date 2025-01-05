import styled from "styled-components";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { IconButton, Icon, Menu, Box } from "@mui/material";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import AlertBox from "components/AlertBox/AlertBox";
import FormDialog from "components/DilaogBox/FormDialog";
import RawMaterialBillRepository from "layouts/raw-material/repository/RawMaterialBillRepository";
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

const useTables = (rowData, setOpenAlert, setAlertMessage, getRawMaterials) => {
  const navigate = useNavigate();
  const [type, setType] = useState();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [rawMaterialId, setRawMaterialId] = useState();
  const [totalQuantity, setTotalQuantity] = useState();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openActionAlert, setOpenActionAlert] = useState(false);
  const [alertActionMessage, setAlertActionMessage] = useState("");

  const handleOpenAlert = () => {
    setOpenActionAlert(true);
    setAlertActionMessage("Action Successful");
    queryClient.invalidateQueries("rawmaterials");
  };

  const handleDialogBoxClose = () => {
    setOpenDialog(false);
  };

  const [openMenu, setOpenMenu] = useState(false);

  // Open Menu
  const handleOpenMenu = (event, id) => {
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
    setOpenMenu(event.currentTarget);
  };

  //Close Menu
  const handleCloseMenu = () => setOpenMenu(false);

  const handleEditAction = () => {
    navigate("/raw-material-bill/edit", { state: { id: selectedId } });
  };

  const handelViewAction = (rawMaterialId) => {
    navigate("/raw-material-bill/view", { state: { id: rawMaterialId } });
  };

  //View Category Details
  const handelViewHistoryAction = (rawMaterialId, name, type) => {
    navigate("/raw-material-bill/history", {
      state: { id: rawMaterialId, rawMaterialName: name, quantityType: type },
    });
  };

  //Delete Category
  const deleteRawMaterial = async (id) => {
    return await RawMaterialBillRepository.delete(id);
  };

  //User form hook for deletion
  const { mutateAsync, isLoading: isMutate } = useMutation(deleteRawMaterial, {
    onSuccess: (response) => {
      getRawMaterials();

      handleCloseMenu();
      setOpenAlert(true);
      setAlertMessage("Raw Material Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Raw Material Deletion Unsucessful");
    },
  });

  const remove = async () => {
    await mutateAsync(selectedId);
    queryClient.invalidateQueries("rawmaterials");
  };

  const handelDeleteAction = () => {
    remove();
  };

  const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `;

  const columns = [
    { Header: "Seller Name", accessor: "seller_name", align: "center" },
    {
      Header: "Raw Material Bill Date Time",
      accessor: "raw_material_bill_Date_time",
      align: "center",
    },
    {
      Header: "Amount",
      accessor: "amount",
      align: "center",
    },
    {
      Header: "Raw Material Bill Type",
      accessor: "bill_type",
      align: "center",
    },
    { Header: "action", accessor: "action", width: "10%", align: "center" },
  ];

  const rows = rowData?.map((row) => ({
    seller_name: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.seller_name}
      </MDTypography>
    ),
    raw_material_bill_Date_time: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row?.raw_material_bill_Date_time
          ? `${row.raw_material_bill_Date_time}`
          : `0 (${row.raw_material_bill_Date_time})`}
      </MDTypography>
    ),
    bill_type: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        // color={row.bill_type <= row.bill_type ? "error" : "text"}
        color="text"
        fontWeight="medium"
      >
        {row?.bill_type ? `${row.bill_type}` : `0 (${row.bill_type})`}
      </MDTypography>
    ),
    amount: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        // color={row.amount <= row.amount ? "error" : "text"}
        color="text"
        fontWeight="medium"
      >
        {row?.amount ? `${row.amount} ` : `0 (${row.amount})`}
      </MDTypography>
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
        <ActionMenu
          openMenu={openMenu}
          anchorEl={anchorEl}
          handleCloseMenu={handleCloseMenu}
          handleEditAction={handleEditAction}
          handelDeleteAction={handelDeleteAction}
        />
      </>
    ),
    rawMaterial: (
      <>
        <AlertBox
          openAlert={openActionAlert}
          alertMessage={alertActionMessage}
          setOpenAlert={setOpenActionAlert}
        />
        <FormDialog
          open={openDialog}
          handleClose={handleDialogBoxClose}
          type={type}
          rawMaterialId={rawMaterialId}
          handleOpenAlert={handleOpenAlert}
          totalQuantity={totalQuantity}
        />
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
        onClick={() =>
          handelViewHistoryAction(
            row._id,
            row.raw_material_name,
            row.quantity_type
          )
        }
      >
        <Icon>people</Icon>
        &nbsp;view history
      </MDButton>
    ),
  }));

  return { rows, columns };
};

export default useTables;
