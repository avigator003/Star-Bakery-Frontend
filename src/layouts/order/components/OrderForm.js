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
import { Autocomplete, FormControl, Grid, Icon, InputLabel, MenuItem, Select as ReactSelect, TextField } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import styled from "styled-components";
import MDButton from "components/MDButton";
import Select from 'react-select';
import { useQuery, useQueryClient } from "react-query";
import MDTypography from "components/MDTypography";
import ProductRepository from "layouts/product/repository/ProductRepository";
import { useEffect, useState } from "react";
import UserRepository from "layouts/user/repository/UserRepository";
import makeAnimated from 'react-select/animated';
import CategoryRepository from "layouts/category/repository/CategoryRepository";
import { ref } from "yup";


function OrderForm(props) {
    const [selectedProduct, setSelectedProduct] = useState([])
    const { onFormSubmit, isLoading, defaultValues, disabled, editable } = props;
    const [selectedUser, setSelectedUser] = useState(defaultValues?.orderCreatedUserId)
    const [selectedCategory, setSelectedCategory] = useState()
    // Create Order
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        getValues,
        watch
    } = useForm({
        defaultValues: defaultValues
    });

    const {
        fields,
        prepend,
        remove,
    } = useFieldArray({
        control,
        name: "products"
    });



    //Get Groups
    const getProducts = (id) => {
        return ProductRepository
            .getAll(id)
            .then((result) => {
                return result?.data;
            });
    };

    const { isLoading: loadingProducts, data: productData, refetch } = useQuery(
        ["product", selectedCategory?.id, 0], // Use selectedCategory?.id as the query key
        () => getProducts(selectedCategory?._id), // Pass selectedCategory?._id to getProducts
        {
            staleTime: 50000,
            retry: 1,
        }
    );

    //On Submit Handler
    const onSubmit = handleSubmit((data) => {
        const filteredData = data.products.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));

        onFormSubmit(filteredData, selectedUser?._id);
        if (!editable) {
            reset();
        }
    });

    useEffect(() => {
        if (selectedCategory) {
            refetch();
        }
    }, [selectedCategory, refetch]);


    const getUsers = () => {
        return UserRepository.getAll(false)
            .then((result) => {
                return result;
            });
    };

    const { isSuccess, isError, error, data: userData, isLoading: CategoriesLoading, isFetching } = useQuery(
        "user",
        () => getUsers(),
        {
            onSuccess: (response) => {
            },
            onError: (err) => {
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
            onSuccess: (response) => {
            },
            onError: (err) => {
            },
        },
        { staleTime: 50000, retry: 1 }
    );



    useEffect(() => {
        const products = defaultValues.products.map((pro) => (
            pro?.product
        ));
        setSelectedProduct(products)
    }, [])

    const handleAutocompleteChange = (index, value) => {
        setValue(`products.${index}.product`, value);
        setSelectedProduct((prevSelectedProduct) => {
            const updatedSelectedProduct = [...prevSelectedProduct];
            updatedSelectedProduct[index] = productData.find(
                (product) => product?.product_name === value?.product_name
            );
            return updatedSelectedProduct;
        });
    };

    const handleProductDelete = (index) => {
        setSelectedProduct((prevSelectedProduct) => {
            const updatedSelectedProduct = [...prevSelectedProduct];
            updatedSelectedProduct.splice(index, 1);
            return updatedSelectedProduct;
        });
    };
    const handleAddProduct = () => {
        prepend({ product: null, quantity: null });  // Prepend the new product at index 0
        setSelectedProduct((prevSelectedProduct) => {
            const updatedSelectedProduct = [null, ...prevSelectedProduct]; // Add null at the beginning
            return updatedSelectedProduct;
        });
    };

    return (
        <MDBox>
            <MDBox mr={2}>
                <FormContainer onSubmit={onSubmit}>
                    <Grid container spacing={4} style={{ position: "relative", bottom: 100 }}>
                        <Grid item xs={6} md={4} xl={4} mb={-3}>
                            <MDTypography variant="h4" fontWeight="bold">
                                Product List
                            </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={4} xl={4} mb={-3}>
                            <FormControl
                                variant="outlined" sx={{ minWidth: 200, marginLeft: 5, marginRight: 2 }}
                                fullWidth>
                                <Autocomplete
                                    value={selectedCategory}
                                    onChange={(event, newValue) => {
                                        setSelectedCategory(newValue);
                                    }}
                                    options={categoryData?.data ?? []}
                                    fullWidth
                                    getOptionLabel={(option) => option.category_name}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Category" variant="outlined" />
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4} xl={4} mb={-3}>
                            <FormControl
                                variant="outlined" sx={{ minWidth: 200, marginLeft: 5, marginRight: 2 }}
                                fullWidth>
                                <Autocomplete
                                    value={selectedUser}
                                    onChange={(event, newValue) => {
                                        setSelectedUser(newValue);
                                    }}
                                    options={userData?.users ?? []}
                                    fullWidth
                                    getOptionLabel={(option) => option.route_name}
                                    renderInput={(params) => (
                                        <TextField {...params} label="User" variant="outlined" />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} md={4} xl={4}>
                            <MDButton variant="gradient" color="dark" disabled={disabled} fullWidth style={{ height: "45px" }} onClick={() => {
                                handleAddProduct()
                            }}>
                                <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                                &nbsp;add Product
                            </MDButton>
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
                                                {productData &&
                                                    <>
                                                        <Grid item xs={4} md={4} xl={4}>
                                                            <Autocomplete
                                                                disabled={disabled}
                                                                value={selectedProduct[index] || null}
                                                                options={productData || []}
                                                                getOptionLabel={(option) => option.product_name}
                                                                getOptionSelected={(option, value) =>
                                                                    option.product_name === value.product_name
                                                                }
                                                                fullWidth
                                                                renderInput={(params) => (
                                                                    <TextField {...params} label="Product" variant="outlined" />
                                                                )}
                                                                onChange={(event, value) => handleAutocompleteChange(index, value)}
                                                                renderOption={(props, option) => {
                                                                    return <li {...props}>{option.product_name}</li>;
                                                                }}
                                                            />
                                                            {errors?.products?.[index]?.product &&
                                                                <Error>{errors.products[index].product.message}</Error>}

                                                        </Grid>
                                                        <Grid item xs={4} md={4} xl={4}>
                                                            <TextField label="Quantity" fullWidth variant="outlined" type="number" disabled={disabled}
                                                                {...register(`products.${index}.quantity`, { required: "Please Enter the quantity" })}
                                                            />
                                                            {errors?.products?.[index]?.quantity &&
                                                                <Error>
                                                                    {errors.products[index].quantity.message}
                                                                </Error>}
                                                        </Grid>

                                                        <Grid item xs={4} md={4} xl={4}>
                                                            <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} onClick={() => {
                                                                handleProductDelete(index);
                                                                remove(index)
                                                            }} disabled={disabled}>
                                                                <Icon sx={{ fontWeight: "bold" }}>delete</Icon>
                                                                &nbsp;delete
                                                            </MDButton>
                                                        </Grid>

                                                    </>
                                                }
                                            </>
                                        );
                                    })}
                                </Grid>
                            </MDBox>
                        </Grid>
                        {
                            !disabled &&
                            <Grid item xs={12} md={12} xl={12} mt={3} ml={12} mr={12} mb={6}>
                                {
                                    !editable ?
                                        <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                                            <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                                            &nbsp;Create order
                                        </MDButton>
                                        :
                                        <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                                            <Icon sx={{ fontWeight: "bold" }}>edit</Icon>
                                            &nbsp;edit order
                                        </MDButton>
                                }
                            </Grid>
                        }
                    </Grid>
                </FormContainer>
            </MDBox >
        </MDBox >
    );
}

// Setting default props for the CreateUser
OrderForm.defaultProps = {
    shadow: true,
    disabled: false,
    editable: false
};

// Typechecking props for the CreateUser
OrderForm.propTypes = {
    onFormSubmit: PropTypes.func,
    isLoading: PropTypes.bool.isRequired,
    defaultValues: PropTypes.any,
    disabled: PropTypes.bool,
    editable: PropTypes.bool
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


export default OrderForm;
