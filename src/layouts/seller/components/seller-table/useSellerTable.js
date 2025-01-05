import { useState } from "react";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import { useMutation, useQueryClient } from "react-query";
import { Box, Icon, IconButton, Menu } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

import SellerRepository from "layouts/seller/repository/SellerRepository";

const ActionMenu = (props) => {
  const {
    openMenu,
    handleCloseMenu,
    handleEditAction,
    handelDeleteAction,
    anchorEl,
  } = props;
  return (
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
          color="text"
          onClick={() => handleEditAction()}
        >
          <Icon>edit</Icon>
          &nbsp;edit
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          onClick={() => handelDeleteAction()}
        >
          <Icon>delete</Icon>
          &nbsp;delete
        </MDButton>
      </Box>
    </Menu>
  );
};

const useTables = (rowData, setOpenAlert, setAlertMessage, getSeller) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = (event, Id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(Id);

    setOpenMenu(event.currentTarget);
  };

  //Close Menu
  const handleCloseMenu = () => setOpenMenu(false);

  const handleEditAction = () => {
    navigate("/seller/edit", { state: { id: selectedId } });
  };

  //Delete Category
  const deleteSellerById = async (id) => {
    return await SellerRepository.delete(id);
  };

  //User form hook for deletion
  const { mutateAsync } = useMutation(deleteSellerById, {
    onSuccess: () => {
      getSeller();
      // filterSeller();
      handleCloseMenu();
      setOpenAlert(true);
      setOpenAlert(true);
      setAlertMessage("Seller Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Seller Deletion Unsuccessful");
    },
  });

  const remove = async () => {
    await mutateAsync(selectedId);
    queryClient.invalidateQueries("Seller");
  };

  const handelDeleteAction = () => {
    remove();
  };

  const columns = [
    { Header: "Seller Name", accessor: "seller_name", align: "center" },
    { Header: "Seller Email", accessor: "email", align: "center" },
    { Header: "Contact No", accessor: "contactNo", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
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
    email: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.email}
      </MDTypography>
    ),
    contactNo: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.contactNo}
      </MDTypography>
    ),
    // puc_expire_date: (
    //   <MDTypography
    //     component="a"
    //     href="#"
    //     variant="caption"
    //     color="text"
    //     fontWeight="medium"
    //   >
    //     {row.puc_expire_date}
    //   </MDTypography>
    // ),
    // fitness_expire_date: (
    //   <MDTypography
    //     component="a"
    //     href="#"
    //     variant="caption"
    //     color="text"
    //     fontWeight="medium"
    //   >
    //     {row.fitness_expire_date}
    //   </MDTypography>
    // ),
    // vehicle_status: (
    //   <MDTypography
    //     component="a"
    //     href="#"
    //     variant="caption"
    //     color="text"
    //     fontWeight="medium"
    //   >
    //     {row.vehicle_status}
    //   </MDTypography>
    // ),

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
  }));

  return { rows, columns };
};
export default useTables;
