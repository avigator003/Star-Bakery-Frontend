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
import { Autocomplete, FormControl, Grid, Icon, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import styled from "styled-components";
import MDButton from "components/MDButton";
import { Box } from "@mui/system";
import CustomAvatar from "components/CustomAvatar";
import { City, State } from "country-state-city";
import avatar from "../../../assets/images/avatar.png";
import CustomPhoto from "components/CustomPhoto/CustomPhoto";

function LabourForm(props) {
  const { onFormSubmit, isLoading, defaultValues, disabled, editable } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({ defaultValues });
  const [selectedImage, setSelectedImage] = useState(defaultValues?.labour_profile ? defaultValues?.labour_profile : avatar)
  const [selectedAdharFrontImage, setSelectedAdharFrontImage] = useState(defaultValues?.adhar_front)
  const [selectedAdharBackImage, setSelectedAdharBackImage] = useState(defaultValues?.adhar_back)
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState(new Date(defaultValues?.date_of_birth).toLocaleDateString("en-GB").split('/').reverse().join('-'))


  // Create User


  const stateTypeField = watch("state");

  const mobileNumberRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4}$/im;
  const adharCardRegex = /^\d{4}\s\d{4}\s\d{4}$/
  
  const setStatesArray = () => {
    const statesArray = State.getStatesOfCountry('IN');
    const newStatesArray = statesArray.map(({ name, isoCode }) => {
      return { label: name, code: isoCode };
    });
    setStates(newStatesArray);
  }

  const setCitiesArray = () => {
    const citiesArray = City.getCitiesOfState('IN', stateTypeField);
    setCities(citiesArray.map((city) => city.name));
  }

  useEffect(() => {
    setValue('labour_profile', avatar);
    setStatesArray();
  }, []);

  useEffect(() => {
    setCitiesArray();
  }, [stateTypeField]);


  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file))
      setValue('labour_profile', file)
    }
  };


  const handleImageAdharFrontSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedAdharFrontImage(URL.createObjectURL(file))
      setValue('adhar_front', file)
    }
  };

  const handleImageAdharBackSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedAdharBackImage(URL.createObjectURL(file))
      setValue('adhar_back', file)
    }
  };

  //On Submit Handler
  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "date_of_birth") {
        formData.append(key, dateOfBirth);
      }
      else {
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
          <Grid container spacing={4}>
            <Box
              component="ul"
              display="flex"
              flexDirection="column"
              style={{
                position: "absolute",
                top: -60,
                left: 0,
                bottom: 0,
                right: 0,
                margin: "auto",
              }}
            >
              <CustomAvatar {...register("labour_profile", { required: false })} handleImageSelect={handleImageSelect} selectedImage={selectedImage} disabled={disabled} />
              {errors.labour_profile && <Error>{errors.labour_profile.message}</Error>}
            </Box>
            <Grid item xs={12} md={6} xl={6}>
              <TextField label="Name" fullWidth variant="standard" {...register("labour_name", { required: "Name is required" })} disabled={disabled} />
              {errors.labour_name && <Error>{errors.labour_name.message}</Error>}
            </Grid>

            <Grid item xs={12} md={6} xl={6}>
              <TextField label="Mobile Number" fullWidth variant="standard" inputMode="tel" disabled={disabled}
                {...register('mobile_number', {
                  required: 'Mobile Number is required',
                  pattern: {
                    value: mobileNumberRegex,
                    message: 'Please enter a valid Mobile Number'
                  }
                })} />
              {errors.mobile_number && <Error>{errors.mobile_number.message}</Error>}
            </Grid>

            <Grid item xs={12} md={6} xl={6}>
              <TextField label="Salary (per month)" fullWidth type="number" variant="standard" {...register("salary", { required: "salary is required" })} disabled={disabled} />
              {errors.salary && <Error>{errors.salary.message}</Error>}
            </Grid>

            <Grid item xs={12} md={6} xl={6}>
              <TextField
                disabled={disabled}
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value)
                }
                }
                fullWidth
                label="Date of Birth"
                type="date"
                variant="standard"
                InputLabelProps={{
                  shrink: true
                }}
              />
              {errors.date_of_birth && <Error>{errors.date_of_birth.message}</Error>}
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <Autocomplete
                disabled={disabled}
                defaultValue={State.getStateByCode(defaultValues?.state)?.name}
                id="combo-box-demo"
                options={states}
                {...register("state", { required: "Please select state" })}
                onChange={(e, option) => {
                  setValue('state', option.code);
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="State" variant="standard" fullWidth />
                )}
              />
              {errors.state && <Error>{errors.state.message}</Error>}
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <Autocomplete
                disabled={disabled}
                defaultValue={defaultValues?.city}
                id="combo-box-demo"
                {...register("city", { required: "Please select city" })}
                options={cities}
                onChange={(e, option) => {
                  setValue('city', option)
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="City" variant="standard" fullWidth />
                )}
              />
              {errors.city && <Error>{errors.city.message}</Error>}
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <TextField {...register("address", { required: "Address is required" })} label="Address" fullWidth variant="standard" multiline disabled={disabled} />
              {errors.address && <Error>{errors.address.message}</Error>}
            </Grid>
            <Grid item xs={12} md={6} xl={6}>

              <TextField label="Adhar Card Number" fullWidth variant="standard" disabled={disabled}
                {...register('adhar_number')} />
              {errors.adhar_number && <Error>{errors.adhar_number.message}</Error>}
            </Grid>
            <Grid item xs={12} md={2} xl={2}>
              <Typography sx={{ fontSize: 16, marginTop: 5, fontFamily: "sans-serif" }}>
                Please Select the Front and Back of the Adhar Card
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} xl={5}>
              <CustomPhoto {...register("adhar_front", { required: false })} handleImageSelect={handleImageAdharFrontSelect} selectedImage={selectedAdharFrontImage} disabled={disabled} />
            </Grid>
            <Grid item xs={12} md={5} xl={5}>
              <CustomPhoto {...register("adhar_back", { required: false })} handleImageSelect={handleImageAdharBackSelect}
                selectedImage={selectedAdharBackImage}
                disabled={disabled} />
            </Grid>
            {
              !disabled &&
              <Grid item xs={12} md={12} xl={12} mt={3} ml={12} mr={12} mb={6}>
                {
                  !editable ?
                    <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                      &nbsp;add new labour
                    </MDButton>
                    :
                    <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                      &nbsp;edit labour
                    </MDButton>
                }
              </Grid>
            }
          </Grid>
        </FormContainer>
      </MDBox>
    </MDBox>
  );
}

// Setting default props for the CreateUser
LabourForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false
};

// Typechecking props for the CreateUser
LabourForm.propTypes = {
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


export default LabourForm;
