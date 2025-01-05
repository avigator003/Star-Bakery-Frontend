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

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import Spinner from "components/Spinner/Spinner";
import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import AlertBox from "components/AlertBox/AlertBox";
import LabourForm from "../LabourForm";
import LabourRepository from "layouts/labour/repository/LabourRepository";

function CreateLabour({ shadow }) {
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Labour Created Succesfully");

  const createLabour = async (data) => {
    return await LabourRepository.create(data);
  };

  const { mutateAsync, isLoading, isError, error } = useMutation(createLabour, {
    onSuccess: () => {
      setOpenAlert(true)
      setAlertMessage("Labour Created Succesfully")
    },
    onError: async (err) => {
      setOpenAlert(true)
      setAlertMessage("Labour Creation Unsuccessful.")
    },
  });

  const onFormSubmit = async (data) => {
    await mutateAsync(data);
    queryClient.invalidateQueries("labour");
  };

  if (isLoading) {
    return (
      <Spinner />
    );
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
                <LabourForm onFormSubmit={onFormSubmit} isLoading={isLoading} />
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

// Setting default props for the CreateUser
CreateLabour.defaultProps = {
  shadow: true,
};

// Typechecking props for the CreateUser
CreateLabour.propTypes = {
  shadow: PropTypes.bool,
};

export default CreateLabour;
