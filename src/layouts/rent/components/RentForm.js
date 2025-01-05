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
import { useState } from "react";
import PropTypes from "prop-types";
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

import { getDate } from "assets/utils/common-helper";
import { STATUS_TYPE } from "assets/utils/constant";

function RentForm(props) {
  const { onFormSubmit, defaultValues, disabled, editable } = props;
  const [startDate, setStartDate] = useState(getDate());

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "rent_Date_time") {
        formData.append(key, new Date(data[key]));
      } else {
        formData.append(key, data[key]);
      }
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
          <Grid container spacing={4} mt={5}>
            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="User"
                fullWidth
                type="text"
                variant="standard"
                {...register("user", {
                  required: "User is required",
                })}
                disabled={disabled}
              />
              {errors.user && <Error>{errors.user.message}</Error>}
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
                  Rent Status
                </InputLabel>
                <Select
                  defaultValue={defaultValues?.rent_status}
                  {...register("rent_status", {
                    required: "Please Select Rent Status",
                  })}
                  fullWidth
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="rent_status"
                  sx={{ pb: 1 }}
                >
                  {STATUS_TYPE &&
                    STATUS_TYPE.map((option) => (
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
                {...register("rent_Date_time", {
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
                    &nbsp;add Rent
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
                    &nbsp;edit Rent
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
RentForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false,
};

// Typechecking props for the CreateUser
RentForm.propTypes = {
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

export default RentForm;
