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
import { STATUS_TYPE } from "assets/utils/constant";
import useTables from "./useRentTable";
import AlertBox from "components/AlertBox/AlertBox";
// import { getDate } from "assets/utils/common-helper";
import { Dialog, DialogContent, DialogTitle, InputLabel } from "@mui/material";
import RentRepository from "layouts/rent/repository/RentRepository";

function RentList() {
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Rent Deleted Successfully");
  const [tableData, setTableData] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const [filteredTableData, setFilteredTableData] = useState();

  const createRent = async () => {
    setSelectedStatus("");
    return await RentRepository.getAll();
  };

  const { mutateAsync } = useMutation(createRent, {
    onSuccess: () => {
      setOpenAlert(true);
      setAlertMessage("Rent Category Created Successfully");
    },
    onError: async (err) => {
      setOpenAlert(true);
      setAlertMessage("Rent Category Creation Unsuccessful.");
    },
  });

  const getRent = () => {
   
    return RentRepository.getAll().then((result) => {
      setTableData(result.data);
      setFilteredTableData(result.data);
      return result;
    });
     filterRent();
  };

  const { isSuccess, isError, error, data, isLoading, isFetching } = useQuery(
    "Rent",
    () => getRent(),
    {
      onSuccess: (response) => {},
      onError: (err) => {
        setOpenAlert(true);
        setAlertMessage("Rent Fetch Unsucessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const { rows, columns } = useTables(
    filteredTableData ? filteredTableData : [],
    setOpenAlert,
    setAlertMessage,
    getRent
  );

  const handleChangeStatus = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleClearFilter = () => {
    setSelectedStatus("");
  };

  useEffect(() => {
    filterRent();
  }, [selectedStatus]);

  const filterRent = () => {
    if (selectedStatus !== "" && selectedStatus !== undefined && tableData) {

      const data = tableData.filter(
        (dat) =>
          dat.rent_status.toLowerCase() === selectedStatus.value.toLowerCase()
      );

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
                  Rent List
                </MDTypography>
                {data && (
                  <>
                    <MDBox display="flex" justifyContent="space-between">
                      <Select
                        id="labour"
                        value={selectedStatus}
                        placeholder="Status"
                        onChange={handleChangeStatus}
                        options={STATUS_TYPE}
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
                            fontSize: "12px",
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
              <MDBox pt={3}>
                {data && (
                  <DataTable
                    table={{ columns: columns, rows: rows }}
                    setSelectedStatus={setSelectedStatus}
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

export default RentList;
