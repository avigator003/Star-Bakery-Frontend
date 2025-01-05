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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import { useQuery } from "react-query";
import { useState } from "react";
import Spinner from "components/Spinner/Spinner";
import AlertBox from "components/AlertBox/AlertBox";
import RawMaterialRepository from "layouts/raw-material/repository/RawMaterialRepository";
import { useLocation } from "react-router-dom";
import useTables from "./useRawMaterialHistoryTable";

function RawMaterialHistoryList() {
    const { state } = useLocation();
    const { id ,rawMaterialName , quantityType} = state;

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("Raw Material Deleted Succesfully");

    const getRawMaterialHistory = () => {
        return RawMaterialRepository.getHistoryById(id)
            .then((result) => {
                return result;
            });
    };

    const { isSuccess, isError, error, data, isLoading, isFetching } = useQuery(
        "rawmaterialhistory",
        () => getRawMaterialHistory(),
        {
            onSuccess: (response) => {
            },
            onError: (err) => {
                setOpenAlert(true)
                setAlertMessage("Raw Material History Fetch Unsucessful")
            },
        },
        { staleTime: 50000, retry: 1 }
    );


    const { rows, columns } = useTables(data?.history ? data.history : [], rawMaterialName, quantityType);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <AlertBox
                openAlert={openAlert}
                alertMessage={alertMessage}
                setOpenAlert={setOpenAlert}
            />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                    Raw Material History List
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3}>
                                {
                                    data &&
                                    <DataTable
                                        table={{ columns: columns, rows: rows }}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                }
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default RawMaterialHistoryList;
