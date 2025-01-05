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
import AlertBox from "components/AlertBox/AlertBox";
import MDBox from "components/MDBox";
import Spinner from "components/Spinner/Spinner";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import RentRepository from "layouts/rent/repository/RentRepository";
import RentForm from "../RentForm";

function EditRent({ shadow }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = state;
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const updateRent = async (data) => {
    return await RentRepository.update(data, id);
  };

  const { mutateAsync, isLoading: isUpdateLoading } = useMutation(updateRent, {
    onSuccess: () => {
      setOpenAlert(true);
      setAlertMessage("Rent Updated Succesfully");
    },
    onError: async (err) => {
      setOpenAlert(true);
      setAlertMessage("Rent Updated Unsuccessful.");
    },
  });

  const getRent = () => {
    return RentRepository.getById(id).then((result) => {
      return result;
    });
  };

  const { data, isLoading } = useQuery(["Rents", id], () => getRent(), {
    staleTime: 50000,
    retry: 1,
  });

  const onFormSubmit = async (data) => {
    const updateData = Object.fromEntries(data);
    await mutateAsync(updateData);
    queryClient.invalidateQueries("Rents");
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
                sx={{ marginTop: "0px !important" }}
                flexDirection="column"
                p={0}
                mt={20}
                ml={4}
                mr={4}
              >
                <RentForm
                  cat={data?.expense}
                  onFormSubmit={onFormSubmit}
                  isLoading={isLoading}
                  defaultValues={data?.expense}
                  editable={true}
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
EditRent.defaultProps = {
  shadow: true,
};

// Typechecking props for the CreateUser
EditRent.propTypes = {
  shadow: PropTypes.bool,
};

export default EditRent;
