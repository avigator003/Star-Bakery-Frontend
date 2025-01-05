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
import { Autocomplete, FormControl, Grid, Icon, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import styled from "styled-components";
import MDButton from "components/MDButton";
import { Box } from "@mui/system";
import avatar from "../../../assets/images/avatar.png";
import CustomPhoto from "components/CustomPhoto/CustomPhoto";
import { useEffect, useState } from "react";



function CategoryForm(props) {
  const { onFormSubmit, isLoading, defaultValues, disabled, editable } = props;
  const [selectedImage, setSelectedImage] = useState("")

  // Create Category
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({ defaultValues });


  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file))
      setValue('category_photo', file)
    }
  };

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    onFormSubmit(formData);
    if(!editable)
    {
      reset();
    }
  });


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
            <CustomPhoto {...register("category_photo", { required: false })} handleImageSelect={handleImageSelect} selectedImage={selectedImage ? selectedImage : `${defaultValues?.category_photo}`} disabled={disabled} />
            {errors.category_photo && <Error>{errors.category_photo.message}</Error>}
          </Box>
          <Grid container spacing={4} mt={5}>
            <Grid item xs={12} md={12} xl={12}>
              <TextField label="Category Name" fullWidth variant="standard" {...register("category_name", { required: "Category Name is required" })} disabled={disabled} />
              {errors.category_name && <Error>{errors.category_name.message}</Error>}
            </Grid>
            <Grid item xs={12} md={12} xl={12}>
              <TextField label="Category Description" fullWidth variant="standard" {...register("category_description")} disabled={disabled} multiline />
              {errors.pcategory_descriptionassword && <Error>{errors.category_description.message}</Error>}
            </Grid>

            {
              !disabled &&
              <Grid item xs={12} md={12} xl={12} mt={3} ml={12} mr={12} mb={6}>
                {
                  !editable ?
                    <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                      &nbsp;add new category
                    </MDButton>
                    :
                    <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                      <Icon sx={{ fontWeight: "bold" }}>edit</Icon>
                      &nbsp;edit category
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
CategoryForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false
};

// Typechecking props for the CreateUser
CategoryForm.propTypes = {
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


export default CategoryForm;
