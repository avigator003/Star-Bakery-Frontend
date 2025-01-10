import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, Grid, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useQuery } from "react-query";
import CategoryRepository from "layouts/category/repository/CategoryRepository";
import ProductRepository from "layouts/product/repository/ProductRepository";
import UserRepository from "layouts/user/repository/UserRepository";
import OrderRepository from "layouts/order/repository/OrderRepository";
import Select from "react-select";
import TruckExcelExport from "components/TruckExcelExport";

const getDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

function TruckLoading() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [excelData, setExcelData] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderDate, setOrderDate] = useState(getDate());
  const [, setOpenAlert] = useState(false);
  const [, setAlertMessage] = useState("Fetched Successfully");
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [orders, setOrders] = useState();
  const [sortConfig, setSortConfig] = useState({
    direction: 'asc', // Default is ascending
  });
  const [sortedColumns, setSortedColumns] = useState([]);
  const getUsers = () => {
    return UserRepository.getAll().then((result) => {
      const userNames = result.users?.map((user) => user.route_name);
      setUsers(userNames);
      return result;
    });
  };

  useQuery(
    "users",
    () => getUsers(),
    {
      onError: (err) => {
        setOpenAlert(true);
        setAlertMessage("User Fetch Unsuccessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const getCategories = () => {
    return CategoryRepository.getAll().then((result) => {
      return result;
    });
  };

  const { data: categoryData } = useQuery(
    "category",
    () => getCategories(),
    {
      onError: (err) => {
        setOpenAlert(true);
        setAlertMessage("Category Fetch Unsuccessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const getProducts = () => {
    return ProductRepository.getAll(selectedCategory?.value).then((result) => {
      const productNames = result.data.map((product) => product.product_name);
      setProductsByCategory(productNames);
      return result;
    });
  };

  const getCellData = useCallback(
    (user, product) => {
      // Filter orders for the current user and product
      const userOrders = orders?.filter(
        (order) => order.user.route_name === user
      );
      const productOrders = userOrders?.filter((order) =>
        order.products.some((item) => item.product.product_name === product)
      );

      // Calculate the total quantity for the product
      const totalQuantity = productOrders?.reduce((total, order) => {
        const productItem = order?.products?.find(
          (item) => item.product.product_name === product
        );
        return total + (productItem ? productItem.quantity : 0);
      }, 0);

      return totalQuantity;
    },
    [orders]
  );

  const calculateTotal = useCallback(
    (products) => {
      let total = 0;
      // Iterate through users to accumulate values for the selected category
      users.forEach((user) => {
        const userValues = products.map((product) =>
          getCellData(user, product)
        );
        total += userValues.reduce((acc, value) => acc + parseFloat(value), 0);
      });

      return total; // You can adjust the number of decimal places as needed
    },
    [users, getCellData]
  );

  const generateExcelData = useCallback(
    (products) => {
      if (selectedCategory.label) {
        const data = [];
        const parsedDate = new Date(orderDate);

        // Get day, month, and year components
        const day = parsedDate.getDate();
        const month = parsedDate.getMonth() + 1; // Months are 0-based, so add 1
        const year = parsedDate.getFullYear();

        // Create the formatted date string
        const formattedDate = `${day < 10 ? "0" : ""}${day}-${month < 10 ? "0" : ""
          }${month}-${year}`;

        const categoryDateRow = [
          "Category:",
          selectedCategory.label,
          "Date:",
          formattedDate,
        ];
        data.push(categoryDateRow);
        const newData = ["Total Qua.", calculateTotal(products)];
        data.push(newData);

        data.push({});
        data.push({});
        // Create the header row with "User" and product names
        const headerRow = ["City", ...products];
        data.push(headerRow);

        // Iterate through users and products to populate excelData
        users.forEach((user) => {
          const rowData = [user];
          const userValues = products.map((product) =>
            getCellData(user, product)
          );

          // Check if any cell in this row has a non-zero value
          const hasNonZeroValue = userValues.some((value) => value !== 0);

          // If no cell has a non-zero value, don't include this row
          if (hasNonZeroValue) {
            const rowDataWithoutZeroes = userValues.map((value) =>
              value === 0 ? "" : value
            );
            rowData.push(...rowDataWithoutZeroes);
            data.push(rowData);
          }
        });

        // Calculate totals for each product
        const productTotals = {};
        products.forEach((product) => {
          const total = users.reduce((acc, user) => {
            return acc + Number(getCellData(user, product));
          }, 0);
          productTotals[product] = total;
        });

        // Add a row for product totals
        const totalRow = [
          "Total",
          ...products.map((product) => {
            const total = productTotals[product];
            return total !== 0 ? total : "";
          }),
        ];

        data.push(totalRow);
        setExcelData(data);
      }
    },
    [calculateTotal, getCellData, orderDate, selectedCategory.label, users]
  );

  useEffect(() => {
    generateExcelData(productsByCategory);
  }, [productsByCategory, generateExcelData]);

  const { refetch } = useQuery(
    "products",
    () => getProducts(),
    {
      onSuccess: () => { },
      onError: () => {
        setOpenAlert(true);
        setAlertMessage("Products Fetch Unsuccessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  const getOrders = () => {
    return OrderRepository.getByDateOrUser(orderDate, orderDate).then(
      (result) => {
        setOrders(result.orders);
        return result;
      }
    );
  };

  const toggleSort = () => {
    const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({
      direction: newDirection,
    });
  };

  const { refetch: orderRefetch } = useQuery(
    "orders",
    () => getOrders(),
    {
      onSuccess: (response) => { },
      onError: (err) => {
        setOpenAlert(true);
        setAlertMessage("Products Fetch Unsuccessful");
      },
    },
    { staleTime: 50000, retry: 1 }
  );

  useEffect(() => {
    refetch();
  }, [selectedCategory, refetch]);

  useEffect(() => {
    orderRefetch();
  }, [orderDate, orderRefetch]);

  const options = [
    { value: "", label: "Choose the category" }, // Default option
    ...(categoryData?.data?.map((item) => ({
      value: item._id,
      label: item.category_name,
    })) || []),
  ];

  const getTotalForProduct = (product) => {
    // Initialize a variable to store the total value
    let total = 0;

    // Iterate through users and sum up the values for the given product
    users.forEach((user) => {
      // Replace 'getCellData' with your actual logic to get the user-product data
      const cellData = getCellData(user, product);

      // Assuming 'getCellData' returns a numeric value, add it to the total
      total += parseFloat(cellData); // Convert to a float to handle potential decimal values
    });

    // Return the total value as a string
    return total; // You can adjust the number of decimal places as needed
  };

  const handleChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  useEffect(() => {
    const columns = [...productsByCategory].sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    });
    setSortedColumns(columns);
  }, [productsByCategory, sortConfig]);

  

  return (
    <DashboardLayout>
      <DashboardNavbar />

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
                <MDBox display="flex" justifyContent="space-between">
                  <MDTypography
                    variant="h5"
                    color="white"
                    sx={{ marginRight: 5, marginTop: 0.5 }}
                  >
                    Truck Loading List ({calculateTotal(productsByCategory)})
                  </MDTypography>
                  <MDBox display="flex">
                    {categoryData && (
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
                            fontSize: "14px",
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
                            fontSize: "14px", // set your desired font size here
                          }),
                          input: (provided, state) => ({
                            ...provided,
                            color: "white",
                            fontSize: "14px",
                          }),
                          placeholder: (defaultStyles) => {
                            return {
                              ...defaultStyles,
                              color: "white",
                              fontSize: "14px",
                            };
                          },
                        }}
                      />
                    )}
                    <TextField
                      style={{ minWidth: 150, marginRight: 20 }}
                      label="Order Date"
                      type="date"
                      variant="outlined"
                      value={orderDate}
                      onChange={(e) => {
                        setOrderDate(e.target.value);
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
                  </MDBox>
                </MDBox>
                <MDBox display="flex" justifyContent="space-between">
                  <TruckExcelExport
                    excelData={excelData}
                    fileName="TruckLoadingData"
                    category={selectedCategory.label}
                    date={orderDate}
                  />
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <div
                  style={{ overflowX: "auto", maxWidth: "100%" }}
                  id="printable-table"
                >
                  <table
                    key={selectedCategory.label}
                    style={{
                      minWidth: "600px",
                      borderCollapse: "collapse",
                      border: "0.5px solid black",
                    }}
                  >
                    <colgroup>
                      <col
                        style={{
                          width: "150px",
                          minWidth: "110px",
                          borderRight: "0.5px solid black",
                        }}
                      />
                      {sortedColumns.map((product, index) => (
                        <col
                          key={index}
                          style={{
                            width: "100px",
                            minWidth: "55px",
                            borderRight: "0.5px solid black",
                          }}
                        />
                      ))}
                    </colgroup>
                    <thead>
                      <tr>
                        <th
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 1,
                            background: "lightgrey",
                            padding: "5px",
                            textAlign: "center",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                          // onClick={toggleSort} 
                        >
                          Route Name {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                        </th>
                        {sortedColumns.map((product, index) => (
                          <th
                            key={index}
                            style={{
                              padding: "3px",
                              background: "lightgray",
                              borderBottom: "1px solid black",
                              wordWrap: "break-word",
                              textAlign: "center",
                              fontSize: "12px",
                              maxWidth: "5px",
                            }}
                          >
                            {product}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, rowIndex) => {
                        // Check if any cell in this row has a non-zero value
                        const hasNonZeroValue = sortedColumns.some(
                          (product) => getCellData(user, product) !== 0
                        );

                        // If no cell has a non-zero value, don't render this row
                        if (!hasNonZeroValue) {
                          return null;
                        }

                        return (
                          <tr key={rowIndex}>
                            <td
                              style={{
                                position: "sticky",
                                left: 0,
                                zIndex: 1,
                                backgroundColor: "#1B72E8", // Background color for the total row
                                color: "white",
                                padding: "10px",
                                borderBottom: "1px solid black",
                                textAlign: "center",
                                fontSize: "14px",
                              }}
                            >
                              {user}
                            </td>
                            {sortedColumns.map((product, colIndex) => (
                              <td
                                key={colIndex}
                                style={{
                                  borderBottom: "1px solid black",
                                  padding: "3px",
                                  textAlign: "center",
                                  fontSize: "13px",
                                }}
                              >
                                {getCellData(user, product) !== 0
                                  ? getCellData(user, product)
                                  : ""}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                      <tr>
                        <td
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 1,
                            background: "lightgrey",
                            padding: "10px",
                            borderBottom: "1px solid black",
                            textAlign: "center",
                            fontSize: "14px",
                          }}
                        >
                          Total
                        </td>
                        {sortedColumns.map((product, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              borderBottom: "1px solid black",
                              padding: "10px",
                              textAlign: "center",
                              backgroundColor: "#1B72E8", // Background color for the total row
                              color: "white", // Text color for the total row
                              fontSize: "12px",
                            }}
                          >
                            {/* Calculate and display the total value for each product here */}
                            {getTotalForProduct(product) !== 0
                              ? getTotalForProduct(product)
                              : ""}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default TruckLoading;
