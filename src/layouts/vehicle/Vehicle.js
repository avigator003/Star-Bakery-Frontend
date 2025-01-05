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
// Material Dashboard 2 React example components

// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import { Box } from "@mui/material";

import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CreateVehicle from "./components/vehicle-form/CreateVehicle";
import EditVehicle from "./components/vehicle-form/EditVehicle";

function Vehicle({ isCreate, isEdit }) {
  return (
    <DashboardLayout justifyContent="center" alignItems="center" display="flex">
      <DashboardNavbar />
      <Box mt={6} mb={3} height="100%">
        {isCreate && <CreateVehicle title="Create User" shadow={false} />}
        {isEdit && (
          <EditVehicle title="Edit User" shadow={false} isEdit={isEdit} />
        )}
      </Box>
    </DashboardLayout>
  );
}

// Setting default props for the CreateUser
Vehicle.defaultProps = {
  isCreate: true,
};

// Typechecking props for the CreateUser
Vehicle.propTypes = {
  isCreate: PropTypes.bool,
};

export default Vehicle;
