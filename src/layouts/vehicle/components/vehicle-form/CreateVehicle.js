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
import VehicleForm from "../VehicleForm";
import VehicleRepository from "layouts/vehicle/repository/VehicleRepository";

function CreateVehicle({ shadow }) {
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("vehicle Created Successfully");

  const CreateVehicle = async (data) => {


    return await VehicleRepository.create(data);
  };

  const { mutateAsync, isLoading, isError, error } = useMutation(CreateVehicle, {
    onSuccess: () => {
      setOpenAlert(true);
      setAlertMessage("vehicle Created Successfully");
    },
    onError: async (err) => {
      setOpenAlert(true);
      setAlertMessage("vehicle Creation Unsuccessful.");
    },
  });

  const onFormSubmit = async (data) => {
    await mutateAsync(data);

    queryClient.invalidateQueries("vehicle");
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
                sx={{ marginTop: "0px !important" }}
                display="flex"
                flexDirection="column"
                p={0}
                ml={4}
                mr={4}
              >
                <VehicleForm
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
CreateVehicle.defaultProps = {
  shadow: true,
};

// Typechecking props for the CreateUser
CreateVehicle.propTypes = {
  shadow: PropTypes.bool,
};

export default CreateVehicle;
