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

// @mui material components
import { useState } from "react";
import PropTypes from "prop-types"; // prop-types is library for typechecking of props
import MDBox from "components/MDBox";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Spinner from "components/Spinner/Spinner";
import { useMutation, useQueryClient } from "react-query";

import AlertBox from "components/AlertBox/AlertBox";
import ExpenseRepository from "layouts/expense/repository/ExpenselRepository";
import ExpenseForm from "../ExpenseForm";

function CreateExpense({ shadow }) {
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "Expense Created Successfully"
  );

  const CreateExpense = async (data) => {
    return await ExpenseRepository.create(data);
  };

  const { mutateAsync, isLoading, isError, error } = useMutation(
    CreateExpense,
    {
      onSuccess: () => {
        setOpenAlert(true);
        setAlertMessage("Expense Created Successfully");
      },
      onError: async (err) => {
        setOpenAlert(true);
        setAlertMessage("Expense Creation Unsuccessful.");
      },
    }
  );

  const onFormSubmit = async (data) => {
    await mutateAsync(data);

    queryClient.invalidateQueries("expense");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <AlertBox
        openAlert={openAlert}
        alertMessage={alertMessage}
        setOpenAlert={setOpenAlert}
      />
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={9} style={{ position: "relative" }}>
          <Card
            sx={{
              height: "100%",
              boxShadow: !shadow && "none",
            }}
          >
            <MDBox p={2}>
              <MDBox
                component="ul"
                display="flex"
                flexDirection="column"
                p={0}
                mt={20}
                ml={4}
                mr={4}
              >
                <ExpenseForm
                  onFormSubmit={onFormSubmit}
                  isLoading={isLoading}
                />
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

// Setting default props for the CreateUser
CreateExpense.defaultProps = {
  shadow: true,
};

// Typechecking props for the CreateUser
CreateExpense.propTypes = {
  shadow: PropTypes.bool,
};

export default CreateExpense;
