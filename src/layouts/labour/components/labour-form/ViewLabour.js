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
import { useEffect, useState } from "react";
import AlertBox from "components/AlertBox/AlertBox";
import { useLocation } from "react-router-dom";
import LabourForm from "../LabourForm";
import LabourRepository from "layouts/labour/repository/LabourRepository";

function ViewLabour({ shadow }) {
    const { state } = useLocation();
    const { id } = state;
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("User Created Succesfully");

    const getLabour = (id) => {
        return LabourRepository.getById(id)
            .then((result) => {
                return result;
            });
    };

    const {data, isLoading } = useQuery(
        ["labour", id],
        () => getLabour(id),
        { staleTime: 50000, retry: 1 }
    );

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
                                {
                                    data &&
                                    <LabourForm isLoading={isLoading} defaultValues={data?.data} disabled={true} />
                                }
                            </MDBox>
                        </MDBox>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

// Setting default props for the CreateUser
ViewLabour.defaultProps = {
    shadow: true,
};

// Typechecking props for the CreateUser
ViewLabour.propTypes = {
    shadow: PropTypes.bool,
};

export default ViewLabour;
