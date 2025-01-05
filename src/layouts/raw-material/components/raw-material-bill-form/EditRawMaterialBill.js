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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import AlertBox from "components/AlertBox/AlertBox";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import RawMaterialBillRepository from "layouts/raw-material/repository/RawMaterialBillRepository";
import RawMaterialForm from "../RawMaterialForm";
import RawMaterialBillForm from "../RawMaterialBillForm";

function EditRawMaterialBill({ shadow }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = state;
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const updateRawMaterial = async (data) => {
    return await RawMaterialBillRepository.update(data, id);
  };

  const { mutateAsync, isLoading: isUpdateLoading } = useMutation(
    updateRawMaterial,
    {
      onSuccess: () => {
        setOpenAlert(true);
        setAlertMessage("Raw Material Updated Succesfully");
      },
      onError: async (err) => {
        setOpenAlert(true);
        setAlertMessage("Raw Material Updated Unsuccessful.");
      },
    }
  );

  const getRawMaterial = () => {
    return RawMaterialBillRepository.getById(id).then((result) => {
      return result;
    });
  };

  const { data, isLoading } = useQuery(
    ["rawmaterials", id],
    () => getRawMaterial(),
    { staleTime: 50000, retry: 1 }
  );

  const onFormSubmit = async (data) => {
    await mutateAsync(data);
    queryClient.invalidateQueries("rawmaterials");
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
                <RawMaterialBillForm
                  cat={data?.rawmaterial.category}
                  onFormSubmit={onFormSubmit}
                  isLoading={isLoading}
                  defaultValues={data?.rawmaterial}
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
EditRawMaterialBill.defaultProps = {
  shadow: true,
};

// Typechecking props for the CreateUser
EditRawMaterialBill.propTypes = {
  shadow: PropTypes.bool,
};

export default EditRawMaterialBill;
