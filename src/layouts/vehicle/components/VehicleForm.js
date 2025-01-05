// Material Dashboard 2 React components
import { useState } from "react";
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
  Typography,
} from "@mui/material";

import { getDate } from "assets/utils/common-helper";
import CustomPhoto from "components/CustomPhoto/CustomPhoto";
import { VEHICLE_STATUS } from "assets/utils/constant";

function VehicleForm(props) {
  const { onFormSubmit, defaultValues, disabled, editable } = props;
  const [RCExpireDate, setRCExpireDate] = useState(getDate());
  const [selectedRCImage, setSelectedRCImage] = useState(
    defaultValues?.rc_photo
  );
  const [selectedPUCImage, setSelectedPUCImage] = useState(
    defaultValues?.puc_photo
  );
  const [selectedINCImage, setSelectedINCImage] = useState(
    defaultValues?.inc_photo
  );
  const [selectedFitnessImage, setSelectedFitnessImage] = useState(
    defaultValues?.fitness_photo
  );
  const [PUCExpireDate, setPUCExpireDate] = useState(getDate());
  const [INCExpireDate, setINCExpireDate] = useState(getDate());
  const [fitnessExpireDate, setFitnessExpireDate] = useState(getDate());

  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "vehicle_Date_time") {
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

  const handleRCExpireDate = (e) => {
    setRCExpireDate(e.target.value);
    setValue("rc_expire_date", e.target.value);
  };
  const handlePUCExpireDate = (e) => {
    setPUCExpireDate(e.target.value);
    setValue("puc_expire_date", e.target.value);
  };
  const handleINCExpireDate = (e) => {
    setINCExpireDate(e.target.value);
    setValue("inc_expire_date", e.target.value);
  };
  const handleFitnessExpireDate = (e) => {
    setFitnessExpireDate(e.target.value);
    setValue("fitness_expire_date", e.target.value);
  };

  const handleImageRCPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedRCImage(URL.createObjectURL(file));
      setValue("rc_photo", file);
    }
  };
  const handleImagePUCPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedPUCImage(URL.createObjectURL(file));
      setValue("puc_photo", file);
    }
  };
  const handleImageINCPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedINCImage(URL.createObjectURL(file));
      setValue("inc_photo", file);
    }
  };
  const handleImageFitnessPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFitnessImage(URL.createObjectURL(file));
      setValue("fitness_photo", file);
    }
  };
  return (
    <MDBox>
      <MDBox mr={2}>
        <FormContainer onSubmit={onSubmit}>
          <Grid container spacing={4} mt={5}>
            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="VEHICLE No."
                fullWidth
                type="vehicle no."
                variant="standard"
                {...register("vehicle_no", {
                  required: "VEHICLE No. is required",
                })}
                disabled={disabled}
              />
              {errors.vehicle_no && <Error>{errors.vehicle_no.message}</Error>}
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
                  Vehicle Status
                </InputLabel>
                <Select
                  defaultValue={defaultValues?.vehicle_status}
                  {...register("vehicle_status", {
                    required: "Please Select vehicle Status",
                  })}
                  fullWidth
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="vehicle_status"
                  sx={{ pb: 1 }}
                >
                  {VEHICLE_STATUS &&
                    VEHICLE_STATUS.map((option) => (
                      <MenuItem value={option.value} key={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {errors.vehicle_status && (
                <Error>{errors.vehicle_status.message}</Error>
              )}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="RC Expire Date"
                type="date"
                name="rc_expire_date"
                dateFormat="MM/dd/yyyy h:mm aa"
                variant="standard"
                value={RCExpireDate}
                fullWidth
                {...register("rc_expire_date", {
                  required: "Please Select proper date",
                })}
                onChange={handleRCExpireDate}
              />
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="PUC Expire Date"
                type="date"
                name="puc_expire_date"
                dateFormat="MM/dd/yyyy h:mm aa"
                variant="standard"
                value={PUCExpireDate}
                fullWidth
                {...register("puc_expire_date", {
                  required: "Please Select proper date",
                })}
                onChange={handlePUCExpireDate}
              />
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="INC Expire Date"
                type="date"
                name="inc_expire_date"
                dateFormat="MM/dd/yyyy h:mm aa"
                variant="standard"
                value={INCExpireDate}
                // value={defaultValues?.inc_expire_date}
                fullWidth
                {...register("inc_expire_date", {
                  required: "Please Select proper date",
                })}
                onChange={handleINCExpireDate}
              />
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField
                label="Fitness Expire Date"
                type="date"
                name="fitness_expire_date"
                dateFormat="MM/dd/yyyy h:mm aa"
                variant="standard"
                value={fitnessExpireDate}
                // value={defaultValues?.fitness_expire_date}
                fullWidth
                {...register("fitness_expire_date", {
                  required: "Please Select proper date",
                })}
                onChange={handleFitnessExpireDate}
              />
            </Grid>

            <Grid
              container
              spacing={3}
              sx={{ marginTop: 5 }}
              justifyContent="center"
            >
              <Grid item xs={12} md={3} xl={3}>
                <CustomPhoto
                  {...register("rc_photo", { required: false })}
                  handleImageSelect={handleImageRCPhotoSelect}
                  selectedImage={selectedRCImage}
                  disabled={disabled}
                />
                <Typography align="center" variant="subtitle2">
                  RC
                </Typography>
              </Grid>
              <Grid item xs={12} md={3} xl={3}>
                <CustomPhoto
                  {...register("puc_photo", { required: false })}
                  handleImageSelect={handleImagePUCPhotoSelect}
                  selectedImage={selectedPUCImage}
                  disabled={disabled}
                />
                <Typography align="center" variant="subtitle2">
                  PUC
                </Typography>
              </Grid>
              <Grid item xs={12} md={3} xl={3}>
                <CustomPhoto
                  {...register("inc_photo", { required: false })}
                  handleImageSelect={handleImageINCPhotoSelect}
                  selectedImage={selectedINCImage}
                  disabled={disabled}
                />
                <Typography align="center" variant="subtitle2">
                  INC
                </Typography>
              </Grid>
              <Grid item xs={12} md={3} xl={3}>
                <CustomPhoto
                  {...register("fitness_photo", { required: false })}
                  handleImageSelect={handleImageFitnessPhotoSelect}
                  selectedImage={selectedFitnessImage}
                  disabled={disabled}
                />
                <Typography align="center" variant="subtitle2">
                  Fitness
                </Typography>
              </Grid>
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
                    &nbsp;add vehicle
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
                    &nbsp;edit vehicle
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
VehicleForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false,
};

// Typechecking props for the CreateUser
VehicleForm.propTypes = {
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

export default VehicleForm;
