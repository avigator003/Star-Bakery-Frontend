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
import { useEffect, useState } from "react";
import Spinner from "components/Spinner/Spinner";

import AlertBox from "components/AlertBox/AlertBox";
import ProductRepository from "layouts/product/repository/ProductRepository";
import useProductTable from "./userProductTable";
import { FormControl, Icon, InputLabel, MenuItem } from "@mui/material";
import CategoryRepository from "layouts/category/repository/CategoryRepository";
import MDButton from "components/MDButton";
import Select, { components } from 'react-select';

function ProductList() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Product Deleted Succesfully");
  const [selectedCategory, setSelectedCategory] = useState("")

  const getProducts = () => {
    return ProductRepository.getAll(selectedCategory?.value)
      .then((result) => {
        return result;
      });
  };

  const { isSuccess, isError, error, data, isLoading, isFetching, refetch } = useQuery(
    "products",
    () => getProducts(),
    {
      onSuccess: (response) => {
      },
      onError: (err) => {
        setOpenAlert(true)
        setAlertMessage("Products Fetch Unsucessful")
      },
    },
    { staleTime: 50000, retry: 1 }
  );


  const getCategories = () => {
    return CategoryRepository.getAll()
      .then((result) => {
        return result;
      });
  };

  const { data: categoryData } = useQuery(
    "category",
    () => getCategories(),
    {
      onError: (err) => {
        setOpenAlert(true)
        setAlertMessage("Category Fetch Unsucessful")
      },
    },
    { staleTime: 50000, retry: 1 }
  );


  useEffect(() => {
    refetch();
  }, [selectedCategory])

  const { rows, columns } = useProductTable(data?.data ? data.data : [], setOpenAlert, setAlertMessage);

  const handleChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const options = categoryData?.data?.map((item) => ({
    value: item._id,
    label: item.category_name,
  }));
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
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Product List
                </MDTypography>

                <MDBox
                  display="flex"
                 >
                  {categoryData &&
                    <Select
                      id="category"
                      value={selectedCategory}
                      placeholder="Category"
                      onChange={handleChange}
                      options={options}
                      isSearchable
                      styles={{
                        container: (provided) => ({
                          ...provided,
                          width: "100%",
                          marginRight: 20,
                          marginLeft: 20,
                        }),
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "transparent",
                          height: 43,
                          width: 300,
                          borderColor: "white",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "white",
                          fontSize: '14px'
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
                        input: (provided, state) => ({
                          ...provided,
                          color: 'white',
                          fontSize: '14px'
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
                  <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} onClick={() => setSelectedCategory("")}>
                    <Icon sx={{ fontWeight: "bold" }}>close</Icon>
                    &nbsp;clear filter
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                {
                  data &&
                  <DataTable
                    table={{ columns: columns, rows: rows }}
                    isSorted={true}
                    entriesPerPage={false}
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

export default ProductList;
