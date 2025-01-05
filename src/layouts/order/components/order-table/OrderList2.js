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
import { useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import Spinner from "components/Spinner/Spinner";

import AlertBox from "components/AlertBox/AlertBox";
import OrderRepository from "layouts/order/repository/OrderRepository";
import useOrderTable from "./useOrderTable3";
import { FormControl, Icon, InputLabel, MenuItem, TextField } from "@mui/material";
import UserRepository from "layouts/user/repository/UserRepository";
import { makeStyles } from "@mui/styles";
import MDButton from "components/MDButton";
import Select from 'react-select';


const useStyles = makeStyles((theme) => ({
  select: {
    '& .MuiSelect-select:focus': {
      color: 'white !important',
    },
  },
}));
function OrderList() {
  const queryClient = useQueryClient();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Order Deleted Succesfully");
  const [spinner, setSpinner] = useState(false)
  const [startDate, setStartDate] = useState();

  const [endDate, setEndDate] = useState();
  const [selectedUser, setSelectedUser] = useState("");


  useEffect(() => {
    queryClient.invalidateQueries("orders");
  }, [])

  const getOrders = () => {
    return OrderRepository.getByDateOrUser(startDate, endDate, selectedUser?.value)
      .then((result) => {
        return result;
      });
  };

  const handleClearFilter = () => {
    setStartDate("")
    setEndDate("")
    setSelectedUser("")
  }

  const { isSuccess, isError, error, data, isLoading, isFetching, refetch } = useQuery(
    "orders",
    () => getOrders(),
    {
      onSuccess: (response) => { },
      onError: (err) => {
        setOpenAlert(true)
        setAlertMessage("Orders Fetch Unsucessful")
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const getUsers = () => {
    return UserRepository.getAll()
      .then((result) => {
        return result;
      });
  };

  const { data: userData } = useQuery(
    "users",
    () => getUsers(),
    {
      onError: (err) => {
        setOpenAlert(true)
        setAlertMessage("User Fetch Unsucessful")
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  useEffect(() => {
    refetch()
  }, [startDate, endDate, selectedUser]);

  const handleShowSpinner = () => {
    setSpinner(true)
  }

  const handleCloseSpinner = () => {
    setSpinner(false)
  }

  const { rows, columns } = useOrderTable(data?.orders ? data.orders : [], setOpenAlert, setAlertMessage, handleShowSpinner, handleCloseSpinner);

  if (isLoading) {
    return <Spinner />;
  }

  const handleChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const options = userData?.users?.map((item) => ({
    value: item._id,
    label: item.route_name,
  }));

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
                <MDTypography variant="h6" color="white" sx={{ marginTop: 2 }}>
                  Orders List
                </MDTypography>
                <MDBox
                  display="flex"
                  justifyContent="space-between">
                  <TextField
                    style={{ minWidth: 150 }}
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                      style: { color: "white" },
                    }}
                    InputProps={{
                      inputProps: {
                        style: { color: "white" },
                      }
                    }}
                  />
                  <TextField
                    style={{ minWidth: 150, marginLeft: 20 }}
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
                      }
                    }}
                  />

                  {userData &&
                    <Select
                      id="user"
                      value={selectedUser}
                      placeholder="Route"
                      onChange={handleChange}
                      options={options}
                      label={<InputLabel sx={{color: 'white'}}>Route</InputLabel>}
                      isSearchable
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                          marginRight:20,
                          marginLeft:20,
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                          height: 43,
                          width: 200,
                          borderColor: "white",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "white",
                          fontSize:'14px'
                        }),
                        input: (provided, state) => ({
                          ...provided,
                          color: 'white',
                          fontSize:'14px'
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? "lightgrey" : "transparent",
                          color: "#1B72E8",
                          fontWeight: state.isSelected ? "bold" : "normal",
                        }),
                        menu: provided => ({
                          ...provided,
                          fontSize: '14px' // set your desired font size here
                      }),
                      placeholder: (defaultStyles) => {
                        return {
                          ...defaultStyles,
                          color: "white",
                          fontSize: '14px'
                        };
                      },
                      }}
                    />}

                  <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} onClick={handleClearFilter}>
                    <Icon sx={{ fontWeight: "bold" }}>close</Icon>
                    &nbsp;clear filter
                  </MDButton>
                </MDBox>

              </MDBox>
              <MDBox pt={3}>
                {spinner && <Spinner />}
                {
                  (data && !spinner) &&
                  <DataTable
                    table={{ columns: columns, rows: rows }}
                    isSorted
                    entriesPerPage={false}
                    showTotalEntries
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

export default OrderList;
