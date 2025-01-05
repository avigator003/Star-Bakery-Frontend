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
import CreateExpense from "./components/expense-form/CreateExpense";
import EditExpense from "./components/expense-form/EditExpense";
import ViewExpense from "./components/expense-form/ViewExpense";

function Expense({ isCreate, isEdit, isView }) {
  return (
    <DashboardLayout justifyContent="center" alignItems="center" display="flex">
      <DashboardNavbar />
      <Box mt={6} mb={3} height="100%">
        {isCreate && <CreateExpense title="Create User" shadow={false} />}
        {isEdit && <EditExpense title="Edit User" shadow={false} />}
        {isView && <ViewExpense title="View User" shadow={false} />}
      </Box>
    </DashboardLayout>
  );
}

// Setting default props for the CreateUser
Expense.defaultProps = {
  isCreate: true,
  isEdit: false,
  isView: false,
};

// Typechecking props for the CreateUser
Expense.propTypes = {
  isCreate: PropTypes.bool,
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
};

export default Expense;
