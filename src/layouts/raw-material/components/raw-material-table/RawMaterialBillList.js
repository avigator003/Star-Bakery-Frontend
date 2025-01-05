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
import Select from "react-select";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import { useMutation, useQuery, useQueryClient } from "react-query";

// Material Dashboard 2 React example components
import DataTable from "examples/Tables/DataTable";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Data
import Spinner from "components/Spinner/Spinner";
import { BILL_TYPE } from "assets/utils/constant";
import useTables from "./useRawMaterialBillTable";
import AlertBox from "components/AlertBox/AlertBox";
// import { getDate } from "assets/utils/common-helper";
import { Dialog, DialogContent, DialogTitle, InputLabel } from "@mui/material";
import RawMaterialBillRepository from "layouts/raw-material/repository/RawMaterialBillRepository";

function RawMaterialBillList() {
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "Raw Material Deleted Succesfully"
  );
  const [tableData, setTableData] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const [filteredTableData, setFilteredTableData] = useState();
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

  // const [startDate, setStartDate] = useState(getDate());
  // const [endDate, setEndDate] = useState(getDate());

  const closeAddCategoryDialog = () => {
    setIsAddCategoryDialogOpen(false);
    // setNewCategoryName(""); // Clear the input field when closing the dialog
  };

  const createRawMaterialCategory = async () => {
    return await RawMaterialBillRepository.getAll();
  };

  const { mutateAsync } = useMutation(createRawMaterialCategory, {
    onSuccess: () => {
      setOpenAlert(true);
      setAlertMessage("Raw Material Category Created Succesfully");
    },
    onError: async (err) => {
      setOpenAlert(true);
      setAlertMessage("Raw Material Category Creation Unsuccessful.");
    },
  });

  const getRawMaterials = () => {
    return RawMaterialBillRepository.getAll().then((result) => {
      setTableData(result.data);
      setFilteredTableData(result.data);
      return result;
    });
  };

  const { isSuccess, isError, error, data, isLoading, isFetching } = useQuery(
    "rawmaterialscategories",
    () => getRawMaterials(),
    {
      onSuccess: (response) => {},
      onError: (err) => {
        setOpenAlert(true);
        setAlertMessage("Raw Material Fetch Unsucessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const { rows, columns } = useTables(
    filteredTableData ? filteredTableData : [],
    setOpenAlert,
    setAlertMessage,
    getRawMaterials
  );

  const handleAddCategory = async () => {
    await mutateAsync(data);
    queryClient.invalidateQueries("rawmaterialscategories");
    closeAddCategoryDialog();
  };

  const getCategories = () => {
    return RawMaterialBillRepository.getAll().then((result) => {
      return result;
    });
  };

  const { data: categroyData } = useQuery(
    "rawmaterialcategories",
    () => getCategories(),
    {
      onError: (err) => {
        setOpenAlert(true);
        setAlertMessage("Labours Fetch Unsucessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const handleChangeStatus = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleClearFilter = () => {
    setSelectedStatus("");
  };

  useEffect(() => {
    filterRawMaterial();
  }, [selectedStatus]);

  const filterRawMaterial = () => {
    if (selectedStatus !== "" && tableData) {
      const data = tableData.filter(
        (dat) =>
          dat.bill_type.toLowerCase() === selectedStatus.value.toLowerCase()
      );
      // Use Array.prototype.some() to check if the selected category's value is in the category array

      setFilteredTableData(data);
    } else {
      setFilteredTableData(tableData);
    }
  };

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
                  Raw Material Bill List
                </MDTypography>
                {data && (
                  <>
                    <MDBox display="flex" justifyContent="space-between">
                      {/* <TextField
                        style={{ minWidth: 150 }}
                        label="Start Date"
                        type="date"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        variant="outlined"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                        }}
                        InputLabelProps={{
                          shrink: true,
                          style: { color: "white" },
                        }}
                        InputProps={{
                          inputProps: {
                            style: { color: "white" },
                          },
                        }}
                      />

                      <TextField
                        style={{
                          minWidth: 150,
                          marginLeft: 20,
                          marginRight: 20,
                        }}
                        label="End Date"
                        type="date"
                        variant="outlined"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                          style: { color: "white" },
                        }}
                        InputProps={{
                          inputProps: {
                            style: { color: "white" },
                          },
                        }}
                      /> */}

                      <Select
                        id="labour"
                        value={selectedStatus}
                        placeholder="Status"
                        onChange={handleChangeStatus}
                        options={BILL_TYPE}
                        label={
                          <InputLabel sx={{ color: "white" }}>
                            Status
                          </InputLabel>
                        }
                        isSearchable
                        styles={{
                          container: (provided) => ({
                            ...provided,
                            width: "100%",
                            marginRight: 20,
                          }),
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "transparent",
                            height: 35,
                            width: 200,
                            marginTop: 5,
                            borderColor: "white",
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            color: "white",
                            fontSize: "12px",
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            color: "white",
                            fontSize: "12px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "lightgrey"
                              : "transparent",
                            color: "#1B72E8",
                            fontWeight: state.isSelected ? "bold" : "normal",
                          }),
                          menu: (provided) => ({
                            ...provided,
                            fontSize: "12px", // set your desired font size here
                          }),
                          placeholder: (defaultStyles) => {
                            return {
                              ...defaultStyles,
                              color: "white",
                              fontSize: "12px",
                            };
                          },
                        }}
                      />
                      <MDButton
                        variant="gradient"
                        color="dark"
                        fullWidth
                        style={{ height: "41px", fontSize: 10, marginTop: 2 }}
                        onClick={handleClearFilter}
                      >
                        {/* <Icon sx={{ fontWeight: "bold" }}>close</Icon>*/}
                        &nbsp;clear filter
                      </MDButton>
                    </MDBox>
                  </>
                )}
              </MDBox>
              <MDBox display="flex">
                <Dialog
                  open={isAddCategoryDialogOpen}
                  onClose={closeAddCategoryDialog}
                  fullWidth
                >
                  <DialogTitle>Add Category</DialogTitle>
                  <DialogContent>
                    {/* <TextField
                      label="Category Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      style={{ marginTop: 10 }}
                      fullWidth
                      variant="outlined"
                    /> */}
                  </DialogContent>
                  <MDBox
                    mt={2}
                    mb={2}
                    mx={2}
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <MDButton
                      variant="outlined"
                      color="error"
                      onClick={closeAddCategoryDialog}
                      style={{ marginRight: "8px" }}
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

export default RawMaterialBillList;
