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
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useMutation, useQuery } from "react-query";

// Material Dashboard 2 React example components
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Data
import useTables from "./useSellerTable";
import Spinner from "components/Spinner/Spinner";
import AlertBox from "components/AlertBox/AlertBox";
import SellerRepository from "layouts/seller/repository/SellerRepository";

function SellerList() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "Seller Deleted Successfully"
  );
  const [filteredTableData, setFilteredTableData] = useState();

  const CreateSeller = async () => {
    return await SellerRepository.getAll();
  };

  useMutation(CreateSeller, {
    onSuccess: () => {
      setOpenAlert(true);
      setAlertMessage("Seller Category Created Successfully");
    },
    onError: async (err) => {
      setOpenAlert(true);
      setAlertMessage("Seller Category Creation Unsuccessful.");
    },
  });

  const getSeller = () => {
    return SellerRepository.getAll().then((result) => {
      setFilteredTableData(result.data);
      return result;
    });
  };

  const { data, isLoading } = useQuery(
    "Seller",
    () => getSeller(),
    {
      onSuccess: () => {},
      onError: () => {
        setOpenAlert(true);
        setAlertMessage("Seller Fetch Unsucessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const { rows, columns } = useTables(
    filteredTableData ? filteredTableData : [],
    setOpenAlert,
    setAlertMessage,
    getSeller
  );

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
                display="flex"
                justifyContent="space-between"
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="contained"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Seller List
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {data && (
                  <DataTable
                    table={{ columns: columns, rows: rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default SellerList;
