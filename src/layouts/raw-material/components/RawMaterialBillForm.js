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
import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import PropTypes from "prop-types"; // prop-types is library for typechecking of props
import MDBox from "components/MDBox";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import MDButton from "components/MDButton";
import {
  Grid,
  Icon,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";

import { BILL_TYPE } from "assets/utils/constant";
import { getDate } from "assets/utils/common-helper";
import CustomPhoto from "components/CustomPhoto/CustomPhoto";
import RawMaterialBillRepository from "../repository/RawMaterialBillRepository";

function RawMaterialBillForm(props) {
  const { onFormSubmit, defaultValues, disabled, editable } = props;

  const [startDate, setStartDate] = useState(getDate());
  const [selectedImage, setSelectedImage] = useState("");
  const [sellerList, setSellerList] = useState([]);

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    RawMaterialBillRepository.getAllSeller().then((result) => {
      let seller_list = result?.data?.map((seller) => ({
        label: seller?.seller_name,
        value: seller,
      }));
      setSellerList(seller_list);
    });
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
      setValue("raw_material_bill_photo", file);
    }
  };

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key == "raw_material_bill_Date_time")
        formData.append(key, new Date(data[key]));
      else formData.append(key, data[key]);
    });

    onFormSubmit(formData);

    if (!editable) {
      reset();
    }
  });

  const handleBillDate = (e) => {
    setStartDate(e.target.value);
  };

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
              {...register("raw_material_bill_photo", {
                required: false,
              })}
              handleImageSelect={handleImageSelect}
              selectedImage={
                selectedImage
                  ? selectedImage
                  : `${defaultValues?.raw_material_bill_photo}`
              }
              disabled={disabled}
            />
            {errors?.user_profile && (
              <Error>{errors?.user_profile.message}</Error>
            )}
          </Box>
          <Grid container spacing={4} mt={5}>
            <Grid item xs={12} md={12} xl={12}>
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
                  Seller Name
                </InputLabel>
                <Select
                  {...register("seller_name", {
                    required: "Seller Name is required",
                  })}
                  fullWidth
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="seller_name"
                  sx={{ pb: 1 }}
                >
                  {sellerList &&
                    sellerList.length > 0 &&
                    sellerList.map((option) => (
                      <MenuItem value={option?.value?._id} key={option?.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {errors?.seller_name && (
                <Error>{errors?.seller_name?.message}</Error>
              )}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="Amount"
                fullWidth
                type="number"
                variant="standard"
                {...register("amount", {
                  required: "Amount is required",
                })}
                disabled={disabled}
              />
              {errors.amount && <Error>{errors.amount.message}</Error>}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
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
                  Bill Type
                </InputLabel>
                <Select
                  defaultValue={defaultValues?.bill_type}
                  {...register("bill_type", {
                    required: "Please Select Raw Material Status Type",
                  })}
                  fullWidth
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="bill_type"
                  sx={{ pb: 1 }}
                >
                  {BILL_TYPE &&
                    BILL_TYPE.map((option) => (
                      <MenuItem value={option.value} key={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {errors.status && <Error>{errors.status.message}</Error>}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="Bill Date"
                type="date"
                dateFormat="MM/dd/yyyy h:mm aa"
                variant="standard"
                value={startDate}
                fullWidth
                {...register("raw_material_bill_Date_time", {
                  required: "Please Select proper date",
                })}
                onChange={handleBillDate}
              />
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
                    &nbsp;add Raw Material Bill
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
                    &nbsp;edit Raw Material Bill
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
RawMaterialBillForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false,
};

// Typechecking props for the CreateUser
RawMaterialBillForm.propTypes = {
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

export default RawMaterialBillForm;
