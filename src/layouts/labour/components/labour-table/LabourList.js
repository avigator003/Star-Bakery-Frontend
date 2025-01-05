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
import Select from 'react-select';
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
import LabourRepository from "../../repository/LabourRepository";
import useTables from "./useLabourTable";
import MDButton from "components/MDButton";
import { Autocomplete, Box, BoxInputLabel, InputLabel, MenuItem, TextField } from "@mui/material";
import LabourListExport from 'components/LabourListExport';
function LabourList() {

  const defaultMonth = new Date().toISOString().slice(0, 7);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [tableData, setTableData] = useState()
  const [filteredTableData, setFilteredTableData] = useState()
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [labourStatus, setLabourStatus] = useState("Active")
  const [selectedLabour, setSelectedLabour] = useState();
  const [excelData, setExcelData] = useState()

  // const [selectedMonth, setSelectedMonth] = useState("");

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleChangeLabour = (selectedOption) => {
    setSelectedLabour(selectedOption);
  };



  useEffect(() => {
    //setSelectedMonth(defaultMonth)
    getLabours(selectedMonth, labourStatus)

  }, [selectedMonth, labourStatus])


  useEffect(() => {
    filterLabours();
  }, [selectedLabour])



  const generateExcelData = (filtData) => {
    const data = [];
    const {
      salaryTotal,
      dueTotal,
      advanceTotal,
      payableTotal,
    } = calculateTotals(filtData);


    // Add Totals
    const totalsRow = [
      'Month:',
      selectedMonth,
      'Total Salary:',
      convertCurrency(salaryTotal),
    ];

    data.push(totalsRow);

    const totalsRow1 = [
      'Total Payable:',
      convertCurrency(payableTotal),
      'Total Advance',
      convertCurrency(advanceTotal),
    ]

    data.push(totalsRow1);
    
    const totalsRow2 = [
      'Total Due:',
      convertCurrency(dueTotal)
    ]
    data.push(totalsRow2);

    // Empty Rows
    data.push([]);
    data.push([]);

    // Add Totals
    const headerRows = [
      'Labour Name',
      'Salary',
      'Payable Amount',
      'Advance Amount',
      'Due Amount',

    ];

    data.push(headerRows);

    // Data Rows
    filtData?.forEach((lab) => {
      const rowData = [
        lab.labour_name,
        convertCurrency(lab.salary),
        convertCurrency(lab.payableAmount),
        convertCurrency(lab.advancePayment),
        convertCurrency(lab.dueAmount),
      ];
      data.push(rowData);
    });



    setExcelData(data);
  };



  const filterLabours = () => {
    if (selectedLabour !== "") {
      var data = tableData?.filter((dat) => dat._id === selectedLabour?.value)
      setFilteredTableData(data)
      generateExcelData(data)
    }
    else {
      generateExcelData(tableData)
    }
  }

  const getLabours = (month, status) => {
    if (month !== undefined) {
      return LabourRepository.getAll(month, status)
        .then((result) => {
          setTableData(result.data);
          setFilteredTableData(result.data);
          generateExcelData(result.data)
          return result;
        });
    }
    return LabourRepository.getAll(defaultMonth)
      .then((result) => {
        setTableData(result.data);
        setFilteredTableData(result.data);
        return result;
      });
  };

  // const handleMonthChange = (event) => {
  //   setSelectedMonth(event.target.value);
  // };

  const { isSuccess, isError, error, data, isLoading, isFetching, refetch } = useQuery(
    "labour",
    () => getLabours(selectedMonth, labourStatus),
    {
      onError: (err) => {
        setOpenAlert(true)
        setAlertMessage("Labours Fetch Unsucessful")
      },
    },
    { staleTime: 50000, retry: 1 }
  );


  const options = data?.data?.map((item) => ({
    value: item._id,
    label: item.labour_name,
  }));

  const { rows, columns } = useTables(filteredTableData ? filteredTableData : [], setOpenAlert, setAlertMessage);

  const calculateTotals = (data) => {
    let salaryTotal = 0;
    let dueTotal = 0;
    let advanceTotal = 0;
    let payableTotal = 0;

    data?.forEach((item) => {
      salaryTotal += item.salary; // Replace 'salary' with the actual field name
      dueTotal += item.dueAmount; // Replace 'due' with the actual field name
      advanceTotal += item.advancePayment; // Replace 'advance' with the actual field name
      payableTotal += item.payableAmount; // Replace 'payable' with the actual field name
    });


    return {
      salaryTotal,
      dueTotal,
      advanceTotal,
      payableTotal
    };
  };

  const convertCurrency = useCallback((value) => {
    const options = {
      style: "currency",
      currency: "INR",
      signDisplay: value < 0 ? "always" : "auto",
    };
    const formattedNumber = value?.toLocaleString("en-IN", options);
    return formattedNumber;
  }, []);
  const {
    salaryTotal,
    dueTotal,
    advanceTotal,
    payableTotal
  } = calculateTotals(filteredTableData);

  const handleClearFilter = () => {
    setSelectedLabour("")
  }

  // const generateExcelData = (products) => {
  //   if (selectedCategory.label) {
  //     const data = [];
  //     const parsedDate = new Date(orderDate);

  //     // Get day, month, and year components
  //     const day = parsedDate.getDate();
  //     const month = parsedDate.getMonth() + 1; // Months are 0-based, so add 1
  //     const year = parsedDate.getFullYear();

  //     // Create the formatted date string
  //     const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

  //     const categoryDateRow = ['Category:', selectedCategory.label, 'Date:', formattedDate];
  //     data.push(categoryDateRow);

  //     data.push({});
  //     data.push({});
  //     // Create the header row with "User" and product names
  //     const headerRow = ['City', ...products];
  //     data.push(headerRow);

  //     // Iterate through users and products to populate excelData
  //     users.forEach((user) => {
  //       const rowData = [user];
  //       const userValues = products.map((product) => getCellData(user, product));

  //       // Check if any cell in this row has a non-zero value
  //       const hasNonZeroValue = userValues.some((value) => value !== 0);

  //       // If no cell has a non-zero value, don't include this row
  //       if (hasNonZeroValue) {
  //         const rowDataWithoutZeroes = userValues.map((value) => (value === 0 ? '' : value));
  //         rowData.push(...rowDataWithoutZeroes);
  //         data.push(rowData);
  //       }
  //     });

  //     // Calculate totals for each product
  //     const productTotals = {};
  //     products.forEach((product) => {
  //       const total = users.reduce((acc, user) => {
  //         return acc + Number(getCellData(user, product));
  //       }, 0);
  //       productTotals[product] = total;
  //     });

  //     // Add a row for product totals
  //     const totalRow = ['Total', ...products.map((product) => {
  //       const total = productTotals[product];
  //       return total !== 0 ? total : '';
  //     })];

  //     data.push(totalRow);
  //     setExcelData(data);
  //   }
  // };

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
        <MDBox
          display="flex"
          mx={2}
          mt={-8}
          bgColor="#2D8F29"
          py={3}
          px={2}
        >
          <Box borderRight={1} borderColor="white" p={1} pr={1}>
            <MDTypography
              component="a"
              href="#"
              style={{ marginLeft: 0, fontSize: 12 }}
              variant="caption"
              color="white"
              fontWeight="medium"
            >
              Total Salary : {convertCurrency(salaryTotal)}
            </MDTypography>
          </Box>
          <Box borderRight={1} borderColor="white" p={1} pr={2}>
            <MDTypography
              component="a"
              href="#"
              style={{ marginLeft: 0, fontSize: 12 }}
              variant="caption"
              color="white"
              fontWeight="medium"
            >
              Total Payable Amount : {convertCurrency(payableTotal)}
            </MDTypography>
          </Box>
          <Box p={1} pr={2} borderRight={1}>
            <MDTypography
              component="a"
              href="#"
              style={{ marginLeft: 0, fontSize: 12 }}
              variant="caption"
              color="white"
              fontWeight="medium"
            >
              Total Due Amount : {convertCurrency(dueTotal)}
            </MDTypography>
          </Box>
          <Box p={1} pr={2}>
            <MDTypography
              component="a"
              href="#"
              style={{ marginLeft: 0, fontSize: 12 }}
              variant="caption"
              color="white"
              fontWeight="medium"
            >
              Total Advance Amount : {convertCurrency(advanceTotal)}
            </MDTypography>
          </Box>
        </MDBox>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                display="flex"
                justifyContent="space-between"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white" style={{ marginTop: 10, fontSize: 13 }}>
                  {labourStatus === "Active" ? "Active" : "Inactive"} Labours List
                </MDTypography>

                {labourStatus !== "Active" ?
                  <MDButton variant="contained" size="small" color="success" style={{ height: "41px", fontSize: 10, marginTop: 2 }} onClick={() => setLabourStatus("Active")}>
                    {/* <Icon>people</Icon> */}
                    &nbsp;Get Active Users
                  </MDButton> :

                  <MDButton variant="contained" size="small" color="success" style={{ height: "41px", fontSize: 10, marginTop: 2 }} onClick={() => setLabourStatus("Inactive")}>
                    {/* <Icon>people</Icon> */}
                    &nbsp;Get Inactive Users
                  </MDButton>
                }


                <LabourListExport excelData={excelData} fileName="LabourListData" month={selectedMonth} />


                <TextField
                  label="Payment Month"
                  type="month"
                  variant="outlined"
                  style={{ marginTop: 5 }}
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: "white" },
                  }}
                  InputProps={{
                    inputProps: {
                      style: {
                        color: "white",
                        padding: 10
                      },
                    }
                  }}
                />


                {/* <TextField
                    fullWidth
                    label="Date"
                    type="month"
                    variant="outlined"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { color: "white" },
                    }}
                    InputProps={{
                      inputProps: {
                        style: {
                          color: "white",
                          padding: 10
                        },
                      }
                    }}
                  />
                  <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px", marginLeft: 30 }} onClick={() => {
                    setSelectedMonth("")
                    getLabours("")
                  }}>
                    <Icon sx={{ fontWeight: "bold" }}>menu</Icon>
                    &nbsp;Clear Date
                  </MDButton> */}
                <MDBox
                  display="flex"
                  justifyContent="space-between">
                  {data &&
                    <>
                      <Select
                        id="labour"
                        value={selectedLabour}
                        placeholder="Labour"
                        onChange={handleChangeLabour}
                        options={options}
                        label={<InputLabel sx={{ color: 'white' }}>Labour</InputLabel>}
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
                            fontSize: '12px'
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            color: 'white',
                            fontSize: '12px'
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? "lightgrey" : "transparent",
                            color: "#1B72E8",
                            fontWeight: state.isSelected ? "bold" : "normal",
                          }),
                          menu: provided => ({
                            ...provided,
                            fontSize: '12px' // set your desired font size here
                          }),
                          placeholder: (defaultStyles) => {
                            return {
                              ...defaultStyles,
                              color: "white",
                              fontSize: '12px'
                            };
                          },
                        }}
                      />

                      <MDButton variant="gradient" color="dark" fullWidth style={{ height: "41px", fontSize: 10, marginTop: 2 }} onClick={handleClearFilter}>
                        {/* <Icon sx={{ fontWeight: "bold" }}>close</Icon>*/}
                        &nbsp;clear filter
                      </MDButton>
                    </>
                  }

                </MDBox>


              </MDBox>
              <MDBox pt={3}>
                {
                  filteredTableData &&
                  <DataTable
                    table={{ columns, rows }}
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
    </DashboardLayout >
  );
}

export default LabourList;
