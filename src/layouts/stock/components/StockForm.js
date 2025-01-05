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

import { FormControl, Grid, Icon, InputLabel, MenuItem, Select, TextField } from "@mui/material";
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
import ProductRepository from "layouts/product/repository/ProductRepository";


function StockForm(props) {
  const { onFormSubmit, isLoading, disabled, editable } = props;

  // Create Stock
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm();


  //Get Groups
  const getProducts = () => {
    return ProductRepository
      .getAll()
      .then((result) => {
        return result?.data;
      });
  };

  const {
    isLoading: loadingProducts,
    data: productsData,
  } = useQuery(["products"], () => getProducts(), {
    staleTime: 50000,
    retry: 1,
  });

  //On Submit Handler
  const onSubmit = handleSubmit((data) => {
    onFormSubmit(data);
    reset();
  });

  return (
    <FormContainer onSubmit={onSubmit}>
      {productsData &&
        <Grid container spacing={4} mt={5}>
          <Grid item xs={12} md={6} xl={12}>
            <FormControl variant="standard" sx={{ minWidth: 120 }} fullWidth disabled={disabled}>
              <InputLabel id="demo-simple-select-standard-label" style={{ paddingBottom: 10 }}>
                Select Product
              </InputLabel>
              <Select
                {...register("product", { required: "Please Select Product" })}
                fullWidth
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="product"
                sx={{ pb: 1 }}
              >
                {productsData?.map((item, index) => (
                  <MenuItem value={item._id} key={item.id}>
                    {item.product_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.product && <Error>{errors.product.message}</Error>}
          </Grid>

          <Grid item xs={12} md={12} xl={12}>
            <TextField label="Quantity" fullWidth variant="standard" {...register("quantity")} disabled={disabled} multiline />
            {errors.quantity && <Error>{errors.quantity.message}</Error>}
          </Grid>

          <Grid item xs={12} md={12} xl={12}>
            <FormControl variant="standard" sx={{ minWidth: 120 }} fullWidth disabled={disabled}>
              <InputLabel id="demo-simple-select-standard-label" style={{ paddingBottom: 10 }}>
                Qunatity Type
              </InputLabel>
              <Select
                defaultValue="NO."
                {...register("quantity_type", { required: "Please Select Product Quantity Type" })}
                fullWidth
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="quantityType"
                sx={{ pb: 1 }}
              >
                <MenuItem value="NO.">NO.</MenuItem>
                <MenuItem value="KG">KG</MenuItem>
              </Select>
            </FormControl>
            {errors.quantity_type && <Error>{errors.quantity_type.message}</Error>}
          </Grid>

          {
            !disabled &&
            <Grid item xs={12} md={12} xl={12} mt={3} ml={12} mr={12} mb={6}>
              {
                !editable ?
                  <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                    &nbsp;add new stock
                  </MDButton>
                  :
                  <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                    <Icon sx={{ fontWeight: "bold" }}>edit</Icon>
                    &nbsp;edit stock
                  </MDButton>
              }
            </Grid>
          }
        </Grid>
      }
    </FormContainer>
  );
}

// Setting default props for the CreateUser
StockForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false
};

// Typechecking props for the CreateUser
StockForm.propTypes = {
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


export default StockForm;
