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
import { Grid, Icon, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import PropTypes from "prop-types"; // prop-types is library for typechecking of props
import { useForm } from "react-hook-form";
import styled from "styled-components";

function SellerForm(props) {
  const { onFormSubmit, defaultValues, disabled, editable } = props;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "seller_name") {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    onFormSubmit(formData);

    if (!editable) {
      reset();
    }
  });

  return (
    <MDBox>
      <MDBox mr={2}>
        <FormContainer onSubmit={onSubmit}>
          <Grid container spacing={4} mt={5}>
            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="Seller Name"
                fullWidth
                type="text"
                variant="standard"
                {...register("seller_name", {
                  required: "Seller is required",
                })}
                disabled={disabled}
              />
              {errors.seller_name && (
                <Error>{errors.seller_name.message}</Error>
              )}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                variant="standard"
                {...register("email", { required: false })}
                disabled={disabled}
              />
              {errors.email && <Error>{errors.email.message}</Error>}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="Contact No"
                fullWidth
                type="number"
                variant="standard"
                {...register("contactNo", {
                  required: "Contact No is required",
                })}
                disabled={disabled}
              />
              {errors.contactNo && <Error>{errors.contactNo.message}</Error>}
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
                    &nbsp;add Seller
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
                    &nbsp;edit Seller
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
SellerForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false,
};

// Typechecking props for the CreateUser
SellerForm.propTypes = {
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

export default SellerForm;
