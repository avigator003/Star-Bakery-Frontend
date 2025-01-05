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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import {
  Autocomplete,
  Button,
  Chip,
  FormControl,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import styled from "styled-components";
import MDButton from "components/MDButton";
import { Box } from "@mui/system";
import CustomPhoto from "components/CustomPhoto/CustomPhoto";
import CategoryRepository from "layouts/category/repository/CategoryRepository";
import { useQuery } from "react-query";
import UserRepository from "layouts/user/repository/UserRepository";
import { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";

function ProductForm(props) {
  const { onFormSubmit, isLoading, defaultValues, disabled, editable } = props;
  const [selectedImage, setSelectedImage] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [availableOptions, setAvailableOptions] = useState([]);

  // Create Product
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
  });

  const [autocompleteOptions, setAutocompleteOptions] = useState(
    Array(fields.length).fill([])
  );

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
      setValue("product_photo", file);
    }
  };

  useEffect(() => {
    const users = defaultValues.prices.map(
      (price) => price?.users?.map((userId) => userId?.route_name) || []
    );
    setSelectedUsers(users);
  }, []);

  //Get Groups
  const getCategories = () => {
    return CategoryRepository.getAll(1, 10).then((result) => {
      return result?.data;
    });
  };
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectAll = (index) => {
    if (!selectAll) {
      const selectedUserIds = userData.map((user) => user._id);
      setValue(`prices.${index}.users`, selectedUserIds);
      setSelectedUsers((prevSelectedUsers) => {
        const updatedSelectedUsers = [...prevSelectedUsers];
        updatedSelectedUsers[index] = userData.map((user) => user.route_name);
        return updatedSelectedUsers;
      });
    } else {
      setValue(`prices.${index}.users`, []);
      setSelectedUsers([]);
    }
    setSelectAll(!selectAll);
  };

  const { isLoading: loadingGroups, data: categoryData } = useQuery(
    ["category", 100, 0],
    () => getCategories(100, 0),
    {
      staleTime: 50000,
      retry: 1,
    }
  );

  const prices = getValues("prices");

  //GET Users
  const getUsers = () => {
    return UserRepository.getAll(false).then((result) => {
      return result?.users;
    });
  };

  const { isLoading: loadingUsers, data: userData } = useQuery(
    ["users", 100, 0],
    () => getUsers(100, 0),
    {
      staleTime: 50000,
      retry: 1,
    }
  );

  //On Submit Handler
  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "prices") {
        formData.append("prices", JSON.stringify(data.prices));
      } else if (key === "product_category" && typeof data[key] === "object") {
        formData.append(key, data[key]._id);
      } else {
        formData.append(key, data[key]);
      }
    });

    onFormSubmit(formData);

    if (!editable) {
      reset();
    }
  });

  const handleAutocompleteChange = (index, value) => {
    const selectedUserIds = value.map((selectedOption) => {
      const user = userData.find((user) => user.route_name === selectedOption);
      return user ? user._id : null;
    });
    setValue(`prices.${index}.users`, selectedUserIds);
    setSelectedUsers((prevSelectedUsers) => {
      const updatedSelectedUsers = [...prevSelectedUsers];
      updatedSelectedUsers[index] = value;
      return updatedSelectedUsers;
    });

    // Update available options for the next object
    const nextIndex = index + 1;
    const selectedUsers = selectedUserIds.filter(Boolean);
    const nextOptions = userData
      .filter((user) => !selectedUsers.includes(user._id))
      .map((user) => user.route_name);
    setAvailableOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[nextIndex] = nextOptions;
      return updatedOptions;
    });
  };

  useEffect(() => {
    if (userData?.length > 0) {
      setAvailableOptions([userData.map((user) => user.route_name)]);
    }
  }, [userData]);

  return (
    <MDBox>
      <MDBox mr={2}>
        <FormContainer onSubmit={onSubmit}>
          <Box
            component="ul"
            display="flex"
            flexDirection="column"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <CustomPhoto
              {...register("product_photo", { required: false })}
              handleImageSelect={handleImageSelect}
              selectedImage={
                selectedImage
                  ? selectedImage
                  : `${defaultValues?.product_photo}`
              }
              disabled={disabled}
            />
            {errors.product_photo && (
              <Error>{errors.product_photo.message}</Error>
            )}
          </Box>
          <Grid container spacing={4} mt={5}>
            <Grid item xs={12} md={12} xl={6}>
              <TextField
                label="Product Name"
                fullWidth
                variant="standard"
                {...register("product_name", {
                  required: "Product Name is required",
                })}
                disabled={disabled}
              />
              {errors.product_name && (
                <Error>{errors.product_name.message}</Error>
              )}
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <FormControl
                variant="standard"
                sx={{ minWidth: 120 }}
                fullWidth
                disabled={disabled}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  style={{ paddingBottom: 10 }}
                >
                  Product Category
                </InputLabel>
                <Select
                  defaultValue={defaultValues?.product_category?._id}
                  {...register("product_category", {
                    required: "Please Select Product Category",
                  })}
                  fullWidth
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="product category"
                  sx={{ pb: 1 }}
                >
                  {categoryData?.map((item, index) => (
                    <MenuItem value={item._id} key={item.id}>
                      {item.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.product_category && (
                <Error>{errors.product_category.message}</Error>
              )}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="Product Description"
                fullWidth
                variant="standard"
                {...register("product_description")}
                disabled={disabled}
                multiline
              />
              {errors.product_description && (
                <Error>{errors.product_description.message}</Error>
              )}
            </Grid>

            <Grid item xs={12} md={12} xl={12} mb={-3}>
              <MDTypography variant="h4" fontWeight="bold">
                Price List
              </MDTypography>
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <MDBox
                fullWidth
                component="li"
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                bgColor="grey-200"
                borderRadius="lg"
                p={3}
                mb={1}
                mt={2}
              >
                <Grid container spacing={4}>
                  {fields.map((item, index) => {
                    return (
                      <>
                        <Grid item xs={4} md={4} xl={2}>
                          <TextField
                            label="Product Price"
                            fullWidth
                            variant="standard"
                            type="number"
                            inputProps={{ step: "any" }}
                            {...register(`prices.${index}.price`, {
                              required: "Please input the Price",
                            })}
                            disabled={disabled}
                          />
                          {errors?.prices?.[index]?.price && (
                            <Error>{errors.prices[index].price.message}</Error>
                          )}
                        </Grid>
                        <Grid item xs={4} md={4} xl={5}>
                          <Autocomplete
                            disabled={disabled}
                            value={selectedUsers[index] || []}
                            options={availableOptions[index] || []}
                            getOptionLabel={(option) => option}
                            getOptionSelected={(option, value) =>
                              value.includes(option)
                            }
                            fullWidth
                            multiple
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="User"
                                variant="outlined"
                              />
                            )}
                            onChange={(event, value) =>
                              handleAutocompleteChange(index, value)
                            }
                            renderOption={(props, option) => {
                              const optionStyles = {
                                backgroundColor:
                                  option === "Select All"
                                    ? "lightgray"
                                    : "inherit",
                                fontWeight:
                                  option === "Select All" ? "bold" : "normal",
                              };
                              return (
                                <li {...props} style={optionStyles}>
                                  {option}
                                </li>
                              );
                            }}
                          />
                          {errors?.prices?.[index]?.users && (
                            <Error>{errors.prices[index].users.message}</Error>
                          )}
                        </Grid>
                        <Grid item xs={4} md={4} xl={3}>
                          <MDButton
                            variant="gradient"
                            color="dark"
                            fullWidth
                            style={{ height: "45px" }}
                            onClick={() => handleSelectAll(index)}
                          >
                            {!selectAll ? "Select All" : "Diselect All"}
                          </MDButton>
                        </Grid>
                        {index === 0 ? (
                          <Grid item xs={4} md={4} xl={1}>
                            <MDButton
                              variant="gradient"
                              color="dark"
                              disabled={disabled}
                              fullWidth
                              style={{ height: "45px" }}
                              onClick={() => {
                                append({ price: null, users: [] });
                              }}
                            >
                              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                            </MDButton>
                          </Grid>
                        ) : (
                          <Grid item xs={4} md={4} xl={1}>
                            <MDButton
                              variant="gradient"
                              color="dark"
                              fullWidth
                              style={{ height: "45px" }}
                              onClick={() => {
                                remove(index);
                              }}
                              disabled={disabled}
                            >
                              <Icon sx={{ fontWeight: "bold" }}>delete</Icon>
                            </MDButton>
                          </Grid>
                        )}
                      </>
                    );
                  })}
                </Grid>
              </MDBox>
            </Grid>

            {!disabled && (
              <Grid item xs={12} md={12} xl={12} mt={3} ml={12} mr={12} mb={6}>
                {!editable ? (
                  <MDButton
                    variant="gradient"
                    color="dark"
                    fullWidth
                    style={{ height: "45px" }}
                    type="submit"
                  >
                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                    &nbsp;add new product
                  </MDButton>
                ) : (
                  <MDButton
                    variant="gradient"
                    color="dark"
                    fullWidth
                    style={{ height: "45px" }}
                    type="submit"
                  >
                    <Icon sx={{ fontWeight: "bold" }}>edit</Icon>
                    &nbsp;edit product
                  </MDButton>
                )}
              </Grid>
            )}
          </Grid>
        </FormContainer>
      </MDBox>
    </MDBox>
  );
}

// Setting default props for the CreateUser
ProductForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false,
};

// Typechecking props for the CreateUser
ProductForm.propTypes = {
  onFormSubmit: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  defaultValues: PropTypes.any,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
};

export const FormContainer = styled.form`
  padding-left: 10;
  padding-right: 10;
`;

export const Error = styled.p`
  color: red;
  font-weight: 600;
  font-size: 0.8rem;
`;

export default ProductForm;
