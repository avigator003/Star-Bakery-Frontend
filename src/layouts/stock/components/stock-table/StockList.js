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
import { useCallback, useEffect, useState } from "react";
import Spinner from "components/Spinner/Spinner";

import AlertBox from "components/AlertBox/AlertBox";
import StockRepository from "layouts/stock/repository/StockRepository";
import useTables from "./useStockTable";
import { Box, TextField } from "@mui/material";
import CategoryRepository from "layouts/category/repository/CategoryRepository";
import Select, { components } from 'react-select';
import MDButton from "components/MDButton";
import Icon from "react-multi-date-picker/components/icon";
import ExcelExport from "components/ExcelExport/ExcelExport";

function StockList() {

  const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }


  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("User Deleted Succesfully");
  const [orderDate, setOrderDate] = useState(getDate());
  const [tableData, setTableData] = useState()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [excelData, setExcelData] = useState();

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
    setLoading(true)
    getStocks(orderDate, selectedCategory)
  }, [orderDate, selectedCategory])

  const getStocks = (date, category) => {
    return StockRepository.getAll(date, category?.value)
      .then((result) => {
        var excelCustomData = result.data.map((excel, index) => {
          const difference = (excel.current_quantity || 0) - (excel.quantity_ordered_on_date || 0);
          const advanceStock = Math.max(difference, 0); // Ensure the value is not negative
          return {
            "No.": index + 1,
            "Product Name": excel.product?.product_name || "N/A",
            "Stock Available": `${excel.current_quantity} ${excel.quantity_type}`,
            "Order Requirement": `${excel.quantity_ordered_on_date} ${excel.quantity_type}`,
            "Advance Stock": `${advanceStock} ${excel.quantity_type}`,
            "Required Stock": excel?.current_quantity === 0
              ? `${excel.quantity_ordered_on_date} (${excel.quantity_type})`
              : `${Math.max(excel.quantity_ordered_on_date - excel.current_quantity, 0)} (${excel.quantity_type})`,
          };
        });

        setExcelData(excelCustomData)
        setTableData(result)
        setLoading(false)
        return result;
      });
  };

  const options = categoryData?.data?.map((item) => ({
    value: item._id,
    label: item.category_name,
  }));

  const { data, isLoading, refetch } = useQuery(
    "stock",
    () => getStocks(orderDate),
    {
      onSuccess: (response) => {
      },
      onError: (err) => {
        setOpenAlert(true)
        setAlertMessage("Stock Fetch Unsucessful")
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const handleChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };


  const calculateTotals = (data) => {
    let totalAvailableStock = 0;
    let totalOrderRequirement = 0;
    let totalRequiredStock = 0;

    data?.data?.forEach((row) => {
      totalAvailableStock += row.current_quantity;
      totalOrderRequirement += row.quantity_ordered_on_date;
      const requiredStockForCurrentRow = row.current_quantity === 0
        ? row.quantity_ordered_on_date
        : Math.max(row.quantity_ordered_on_date - row.current_quantity, 0);
      totalRequiredStock += requiredStockForCurrentRow;
    });

    return {
      totalAvailableStock,
      totalOrderRequirement,
      totalRequiredStock,
    };
  };


  const {
    totalAvailableStock,
    totalOrderRequirement,
    totalRequiredStock,
  } = calculateTotals(tableData);

  const { rows, columns } = useTables(tableData?.data ? tableData.data : [], setOpenAlert, setAlertMessage,orderDate);

  const handleAdvanceStock = () => {
    setLoading(true)
    const updatedProducts = tableData?.data?.map((row) => {
      const difference = (row.current_quantity || 0) - (row.quantity_ordered_on_date || 0);
      const advanceStock = Math.max(difference, 0); // Ensure the value is not negative
     
      return {
        productId: row.product._id, // Replace with the correct property holding product ID
        updatedQuantity: Math.max(advanceStock, 0), // Ensure the value is not negative
      };
    });
    completeTodayWork(updatedProducts);
  }

  const completeTodayWork = (updatedProducts) => {
    return StockRepository.completeWork(orderDate,updatedProducts)
      .then((result) => {
        setAlertMessage("Today's Work Completed")
        setOpenAlert(true)
        setLoading(false);
        return result;
      }).catch((error) => {
        setAlertMessage("Today's Work is Already Completed")
        setOpenAlert(true)
        setLoading(false);
     
      });
  };


  if (loading) {
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
      {excelData &&
        <MDBox pt={6} pb={3}>
          <MDBox
            display="flex"
            mx={2}
            mt={-8}
            bgColor="#2D8F29"
            py={3}
            px={2}
          >
            <Box borderRight={1} borderColor="white" p={1} pr={2}>
              <MDTypography
                component="a"
                href="#"
                style={{ marginLeft: 20, fontSize: 15 }}
                variant="caption"
                color="white"
                fontWeight="medium"
              >
                Total Available Stock : {totalAvailableStock}
              </MDTypography>
            </Box>
            <Box borderRight={1} borderColor="white" p={1} pr={2}>
              <MDTypography
                component="a"
                href="#"
                style={{ marginLeft: 20, fontSize: 15 }}
                variant="caption"
                color="white"
                fontWeight="medium"
              >
                Total Order Requirement : {totalOrderRequirement}
              </MDTypography>
            </Box>
            <Box p={1} pr={2}>
              <MDTypography
                component="a"
                href="#"
                style={{ marginLeft: 20, fontSize: 15 }}
                variant="caption"
                color="white"
                fontWeight="medium"
              >
                Total Required Stock : {totalRequiredStock}
              </MDTypography>
            </Box>
          </MDBox>
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
                  <MDBox
                    display="flex"
                    justifyContent="space-between">
                    <MDTypography variant="h5" color="white" sx={{ marginRight: 5, marginTop: 0.5 }}>
                      Stock List
                    </MDTypography>
                    <ExcelExport excelData={excelData} fileName="Stock" />
                  </MDBox>
                  <MDBox
                    display="flex"
                    justifyContent="space-between">
                    <TextField
                      style={{ minWidth: 150 }}
                      label="Order Date"
                      type="date"
                      variant="outlined"
                      value={orderDate}
                      onChange={(e) => {
                        setOrderDate(e.target.value)
                      }}
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
                              width: 200,
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

                      <MDButton variant="gradient" color="error" fullWidth style={{ height: "45px",marginLeft:5 }} onClick={() => handleAdvanceStock()}>
                        <Icon sx={{ fontWeight: "bold" }}>close</Icon>
                        &nbsp;Finish Today's Work
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </MDBox>
                <MDBox pt={3}>
                  {
                    tableData &&
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
      }
    </DashboardLayout >
  );
}

export default StockList;
