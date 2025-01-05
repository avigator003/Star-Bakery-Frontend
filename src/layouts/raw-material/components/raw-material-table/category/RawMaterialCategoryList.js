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
import MDButton from 'components/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Data
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import Spinner from "components/Spinner/Spinner";
import AlertBox from "components/AlertBox/AlertBox";
import RawMaterialRepository from "layouts/raw-material/repository/RawMaterialRepository";

import { Dialog, DialogContent, DialogTitle, Icon, TextField } from "@mui/material";
import useTables from "./useRawMaterialCategoryTable";

function RawMaterialCategoryList() {
  const queryClient=useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Raw Material Category Deleted Succesfully");
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const openAddCategoryDialog = () => {
    setIsAddCategoryDialogOpen(true);
  };

  const closeAddCategoryDialog = () => {
    setIsAddCategoryDialogOpen(false);
    setNewCategoryName(''); // Clear the input field when closing the dialog
  };


  const createRawMaterialCategory = async () => {
    return await RawMaterialRepository.createCategory(newCategoryName);
  };

  const { mutateAsync } = useMutation(createRawMaterialCategory, {
    onSuccess: () => {
      setOpenAlert(true)
      setAlertMessage("Raw Material Category Created Succesfully")
    },
    onError: async (err) => {
      setOpenAlert(true)
      setAlertMessage("Raw Material Category Creation Unsuccessful.")
    },
  });


  const getRawMaterialsCategory = () => {
    return RawMaterialRepository.getCategories()
      .then((result) => {
        return result;
      });
  };

  const { isSuccess, isError, error, data, isLoading, isFetching } = useQuery(
    "rawmaterialscategories",
    () => getRawMaterialsCategory(),
    {
      onSuccess: (response) => {
      },
      onError: (err) => {
        setOpenAlert(true)
        setAlertMessage("Raw Material Category Fetch Unsucessful")
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const { rows, columns } = useTables(data?.data ? data.data : [], setOpenAlert, setAlertMessage);


  const handleAddCategory = async () => {
    await mutateAsync(data);
    queryClient.invalidateQueries("rawmaterialscategories")
    closeAddCategoryDialog();
  }



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
                  Raw Material Category List
                </MDTypography>

                <MDBox
                  display="flex"
                >
                  <MDButton variant="gradient" color="error" fullWidth style={{ height: "45px", marginLeft: 5 }} onClick={openAddCategoryDialog}>
                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                    &nbsp;Add Category
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDBox
                display="flex"
              >
                <Dialog open={isAddCategoryDialogOpen} onClose={closeAddCategoryDialog} fullWidth>
                  <DialogTitle>Add Category</DialogTitle>
                  <DialogContent>
                    <TextField
                      label="Category Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      style={{ marginTop: 10 }}
                      fullWidth
                      variant="outlined"
                    />
                  </DialogContent>
                  <MDBox mt={2} mb={2} mx={2} display="flex" justifyContent="flex-end">
                    <MDButton
                      variant="outlined"
                      color="error"
                      onClick={closeAddCategoryDialog}
                      style={{ marginRight: '8px' }}
                    >
                      Cancel
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="success"
                      onClick={() => {
                        handleAddCategory();
                      }}
                    >
                      Save
                    </MDButton>
                  </MDBox>
                </Dialog>
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

export default RawMaterialCategoryList;
