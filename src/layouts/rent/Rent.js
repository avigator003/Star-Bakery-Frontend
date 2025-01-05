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
import CreateRent from "./components/rent-form/CreateRent";
import EditRent from "./components/rent-form/EditRent";

function Rent({ isCreate, isEdit, isView }) {



  return (
    <DashboardLayout justifyContent="center" alignItems="center" display="flex">
      <DashboardNavbar />
      <Box mt={6} mb={3} height="100%">
        {isCreate && <CreateRent title="Create User" shadow={false} />}
        {isEdit && <EditRent title="Edit User" shadow={false} />}
      </Box>
    </DashboardLayout>
  );
}

// Setting default props for the CreateUser
Rent.defaultProps = {
  isCreate: true,
  isEdit: false,
  isView: false,
};

// Typechecking props for the CreateUser
Rent.propTypes = {
  isCreate: PropTypes.bool,
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
};

export default Rent;
