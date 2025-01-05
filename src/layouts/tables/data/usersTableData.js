/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/


import MDTypography from "components/MDTypography";

// Images
import { Box, Button, Icon, IconButton, Menu } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MDButton from "components/MDButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserRepository from "layouts/user/repository/UserRepository";
import { useMutation, useQueryClient } from "react-query";
import UserInformation from "components/TableComponents/UserInformation";
import Address from "components/TableComponents/Address";

function usersTableData(data) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [rowsData, setRowsData] = useState([])
  const [hasData, setHasData] = useState(false);

  if (data !== undefined && !hasData) {
    setRowsData(data);
    setHasData(true);
  }

  // Open Menu
  const handleOpenMenu = (event, userId) => {
    setSelectedUserId(userId);
    setOpenMenu(event.currentTarget)
  };

  //Close Menu
  const handleCloseMenu = () => setOpenMenu(false);


  //Delete User

  const deletUser = async (id) => {
    return await UserRepository.delete(id);
  };

  //User form hook for deletion
  const { mutateAsync, isLoading: isMutate } = useMutation(deletUser, {
    onSuccess: (response) => {
      queryClient.refetchQueries("users");
    },
    onError: (err) => {

    },
  });

  const remove = async () => {
    await mutateAsync(selectedUserId);
    queryClient.invalidateQueries("users");
  };


  // Render the notifications menu
  const renderActionMenu = () => {
    const handleEditAction = () => {
      navigate("/user/edit", { state: { id: selectedUserId } })
    }


    const handelDeleteAction = () => {
      remove();
    }
    return (
      <Menu
        anchorEl={openMenu}
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
          <Button variant="text" color="dark" onClick={() => { handleEditAction() }}>
            <Icon>edit</Icon>
            &nbsp;edit
          </Button>
          <MDButton variant="text" color="error" onClick={() => handelDeleteAction()}>
            <Icon>delete</Icon>
            &nbsp;delete
          </MDButton>
        </Box>
      </Menu>
    );
  }
  return {
    columns: [
      { Header: "user", accessor: "user", align: "left" },
      { Header: "route", accessor: "route", align: "left" },
      { Header: "address", accessor: "address", align: "left" },
      { Header: "vehicle", accessor: "vehicle", align: "center" },
      { Header: "report", accessor: "report", width: "10%", align: "center" },
      { Header: "action", accessor: "action", width: "10%", align: "center" },
    ],
    rows: rowsData?.map((row) => ({
      user: (
        <UserInformation image={row.user_profile} name={row.user_name} mobile={row.mobile_number} />
      ),
      route: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {row.route_name}
        </MDTypography>
      ),
      address: (
        <Address address={row.address} city={row.city} state={row.state} />
      ),
      vehicle: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {
            row.vehicle_number ?
              row.vehicle_number
              : " No Vehicle registered"
          }
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
          {renderActionMenu()}
        </>
      ),
      report: (
        <MDButton variant="text" color="dark">
          <Icon>assessment</Icon>
          &nbsp;show
        </MDButton>
      ),
    })),
  };
}


export default usersTableData;