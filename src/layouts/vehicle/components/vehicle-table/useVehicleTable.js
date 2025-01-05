import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Box, Icon, IconButton, Menu } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import VehicleRepository from "layouts/vehicle/repository/VehicleRepository";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

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

const useTables = (rowData, setOpenAlert, setAlertMessage, getVehicle) => {
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
    navigate("/vehicle/edit", { state: { id: selectedId } });
  };

  //Delete Category
  const deleteVehicleById = async (id) => {
    return await VehicleRepository.delete(id);
  };

  //User form hook for deletion
  const { mutateAsync } = useMutation(deleteVehicleById, {
    onSuccess: (response) => {
      getVehicle();
      handleCloseMenu();
      setOpenAlert(true);
      setOpenAlert(true);
      setAlertMessage("Vehicle Deletion Successful");
    },
    onError: (err) => {
      setOpenAlert(true);
      setAlertMessage("Vehicle Deletion Unsuccessful");
    },
  });

  const remove = async () => {
    await mutateAsync(selectedId);
    queryClient.invalidateQueries("Vehicle");
  };

  const handelDeleteAction = () => {
    remove();
  };

  const columns = [
    {
      Header: "Vehicle No",
      accessor: "vehicle_no",
      align: "center",
    },
    {
      Header: "RC Expire Date",
      accessor: "rc_expire_date",
      align: "center",
    },
    { Header: "INC Expire Date", accessor: "inc_expire_date", align: "center" },
    { Header: "PUC Expire Date", accessor: "puc_expire_date", align: "center" },
    {
      Header: "Fitness Expire Date",
      accessor: "fitness_expire_date",
      align: "center",
    },
    { Header: "Vehicle Status", accessor: "vehicle_status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = rowData?.map((row) => ({
    vehicle_no: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.vehicle_no}
      </MDTypography>
    ),
    rc_expire_date: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.rc_expire_date}
      </MDTypography>
    ),
    inc_expire_date: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.inc_expire_date}
      </MDTypography>
    ),
    puc_expire_date: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.puc_expire_date}
      </MDTypography>
    ),
    fitness_expire_date: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.fitness_expire_date}
      </MDTypography>
    ),
    vehicle_status: (
      <MDTypography
        component="a"
        href="#"
        variant="caption"
        color="text"
        fontWeight="medium"
      >
        {row.vehicle_status}
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
