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
import StockRepository from "layouts/stock/repository/StockRepository";
import StockForm from "../StockForm";


function CreateStock({ shadow }) {
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Stock Created Succesfully");

  const createStock = async (data) => {
    return await StockRepository.create(data);
  };

  const { mutateAsync, isLoading, isError, error } = useMutation(createStock, {
    onSuccess: () => {
      setOpenAlert(true)
      setAlertMessage("Stock Created Succesfully")
    },
    onError: async (err) => {
      setOpenAlert(true)
      setAlertMessage("Product Entry is already present in stock")
    },
  });

  const onFormSubmit = async (data) => {
    await mutateAsync(data);
    queryClient.invalidateQueries("stock");
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
                ml={4}
                mr={4}
              >
                <StockForm onFormSubmit={onFormSubmit} isLoading={isLoading} />
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

// Setting default props for the CreateUser
CreateStock.defaultProps = {
  shadow: true,
};

// Typechecking props for the CreateUser
CreateStock.propTypes = {
  shadow: PropTypes.bool,
};

export default CreateStock;
