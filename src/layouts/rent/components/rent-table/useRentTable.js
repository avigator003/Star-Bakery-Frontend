import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Box, Icon, IconButton, Menu } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import RentRepository from "layouts/rent/repository/RentRepository";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const useTables = (
  rowData,
  setOpenAlert,
  setAlertMessage,
  getRent,
  filterRent
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = (event, Id, categoryName) => {
 
    setAnchorEl(event.currentTarget);
    setSelectedId(Id);

    setOpenMenu(event.currentTarget);
  };

  //Close Menu
  const handleCloseMenu = () => setOpenMenu(false);

  const handleEditAction = () => {
    navigate("/rent/edit", { state: { id: selectedId } });
  };

  //Delete Category
  const deleteRentById = async (id) => {
    return await RentRepository.delete(id);
  };

  //User form hook for deletion
  const { mutateAsync, isLoading: isMutate } = useMutation(deleteRentById, {
    onSuccess: (response) => {
      getRent();
      // filterRent();
      handleCloseMenu();
      setOpenAlert(true);
      setOpenAlert(true);
      setAlertMessage("Rent Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Rent Deletion Unsuccessful");
    },
  });

  const remove = async () => {
    await mutateAsync(selectedId);
    queryClient.invalidateQueries("Rent");
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
    { Header: "User Name", accessor: "user", align: "center" },
    { Header: "Amount", accessor: "amount", align: "center" },
    {
      Header: "Rent Date Time",
      accessor: "rent_Date_time",
      align: "center",
    },
    { Header: "Rent Status ", accessor: "rent_status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];


  const rows = rowData?.map((row) => ({
    user: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.user}
      </MDTypography>
    ),
    amount: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.amount}
      </MDTypography>
    ),
    rent_Date_time: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.rent_Date_time}
      </MDTypography>
    ),
    rent_status: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.rent_status}
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
          onClick={(e) => handleOpenMenu(e, row?._id, row.name)}
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
