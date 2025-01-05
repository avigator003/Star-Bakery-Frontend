import React, { useState, useCallback, useMemo, useEffect } from "react";
import { IconButton, Icon, Menu, Box, TextField } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import StockRepository from "layouts/stock/repository/StockRepository";
import MDButton from "components/MDButton";
import AlertBox from "components/AlertBox/AlertBox";

const ActionMenu = (props) => {
  const { handleDeleteAction } = props;
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
          <MDButton variant="text" color="error" onClick={handleDeleteAction}>
            <Icon>delete</Icon>
            &nbsp;delete
          </MDButton>
        </Box>
      </Menu>
    </>
  );
};

const useTables = (rowData, setOpenAlert, setAlertMessage, orderDate) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [quantity, setQuantity] = useState();

  const deleteStock = useCallback(async (id) => {
    return await StockRepository.delete(id);
  }, []);

  const { mutateAsync, isLoading: isMutate } = useMutation(deleteStock, {
    onSuccess: (response) => {
      setOpenAlert(true);
      setAlertMessage("Stock Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Stock Deletion Unsuccessful");
    },
  });

  const remove = useCallback(async (id) => {
    await mutateAsync(id);
    queryClient.invalidateQueries("stock");
  }, [mutateAsync, queryClient, selectedStockId]);

  const handleDeleteAction = useCallback((id) => {
    remove(id);
  }, [remove]);

  const handleQuantityChange = async (e, id) => {
    var newQuantity = e.target.value;
    {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent the default behavior of the Enter key
        await StockRepository.update(newQuantity, id);
        alert("Stock Available quantity updated")
      }
    }
  }
  const columns = useMemo(
    () => [
      { Header: "Product Name", accessor: "productName", width: "20%", align: "left" },
      { Header: "Stock Available", accessor: "quantity", width: "20%", align: "left" },
      { Header: "Order Requirement", accessor: "orderRequirement", width: "20%", align: "left" },
      { Header: "Advance Stock", accessor: "advanceStock", width: "20%", align: "left" },
      { Header: "Required Stock", accessor: "requiredStock", width: "20%", align: "left" },
      { Header: "action", accessor: "action", width: "10%", align: "left" },
    ],
    []
  );


  const rows = useMemo(
    () =>
      rowData?.map((row) => ({
        productName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {row.product?.product_name}
          </MDTypography>
        ),
        advanceStock: (
          <MDTypography
            component="a"
            href="#"
            style={{ marginLeft: 20 }}
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {(() => {
              const difference = (row.current_quantity || 0) - (row.quantity_ordered_on_date || 0);
              const advanceStock = Math.max(difference, 0); // Ensure the value is not negative
              return `${advanceStock} (${row.quantity_type})`;
            })()}
          </MDTypography>
        ),
        quantity: (
          <MDTypography
            component="a"
            href="#"
            style={{ marginLeft: 20 }}
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            <TextField
              defaultValue={row?.current_quantity ? row.current_quantity : 0}
              value={quantity}
              variant="standard" size="small"
              onKeyDown={(e) => handleQuantityChange(e, row.id)}
              onChange={(e) => setQuantity(e.target.value)} />
            {row?.quantity_type}
          </MDTypography>
        ),
        orderRequirement: (
          <MDTypography
            component="a"
            href="#"
            style={{ marginLeft: 20 }}
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row?.quantity_ordered_on_date ? `${row.quantity_ordered_on_date} (${row.quantity_type})` : `0 (${row.quantity_type})`}
          </MDTypography>
        ),
        requiredStock: (
          <MDTypography
            component="a"
            href="#"
            style={{ marginLeft: 20 }}
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {row?.current_quantity === 0
              ? `${row.quantity_ordered_on_date} (${row.quantity_type})`
              : Math.max(row.quantity_ordered_on_date - row.current_quantity, 0) + ` (${row.quantity_type})`}

          </MDTypography>
        ),
        action: (
          <ActionMenu
            handleDeleteAction={() => handleDeleteAction(row._id)}
          />
        ),
      })),
    [rowData, handleDeleteAction]
  );

  return { rows, columns };
};

export default useTables;
