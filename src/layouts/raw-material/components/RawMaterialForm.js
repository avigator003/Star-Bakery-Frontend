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
import RawMaterialRepository from "../repository/RawMaterialRepository";
import { useQuery } from "react-query";



function RawMaterialForm(props) {
  const { onFormSubmit, isLoading, defaultValues, disabled, editable, cat } = props;
  const [selectedImage, setSelectedImage] = useState("")
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(cat ? cat : []);
  const [availableCategories, setAvailableCategories] = useState([]);



  // Create Category
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ defaultValues });


  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file))
      setValue('raw_material_photo', file)
    }
  };
  const onSubmit = handleSubmit((data) => {
    // Ensure "category" key is present in the data object
    if (!data.hasOwnProperty("category")) {
      data.category = [];
    }

    const selectedCategoryIds = selectedCategories.map((category) => category._id);
 
    // Append the selected category IDs to the "category" key in the form data
    data.category = selectedCategoryIds;
  
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "category" && Array.isArray(data[key])) {
        // Convert selectedCategories array to a comma-separated string
        formData.append(key, data[key].join(","));
      } else {
        formData.append(key, data[key]);
      }
    });

    onFormSubmit(formData);

    if (!editable) {
      reset();
    }
  });

  const onEdit = handleSubmit((data) => {
    // Ensure "category" key is present in the data object
    if (!data.hasOwnProperty("category")) {
      data.category = [];
    }

    const selectedCategoryIds = selectedCategories.map((category) => category._id);
 
    // Append the selected category IDs to the "category" key in the form data
    data.category = selectedCategoryIds;
  
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "category" && Array.isArray(data[key])) {
        // Convert selectedCategories array to a comma-separated string
        formData.append(key, data[key].join(","));
      } else {
        formData.append(key, data[key]);
      }
    });

    onFormSubmit(formData);

    if (!editable) {
      reset();
    }
  });


  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = () => {
    return RawMaterialRepository
      .getCategories()
      .then((result) => {
        setCategories(result.data)
        const remainingCategories = result.data.filter(
          (category) => !selectedCategories.some((selectedCategory) => selectedCategory._id === category._id)
        );
        setAvailableCategories(remainingCategories);
        return result?.data;
      });
  };
  const handleCategorySelect = (e, options) => {
    // Convert options to an array of objects
    const selectedCategoriesOb = options.map((option) => option);
  
    // Update selected categories
    setSelectedCategories(selectedCategoriesOb);
  
    // Update available categories by filtering out the selected ones
    const remainingCategories = categories.filter(
      (category) => !selectedCategoriesOb.some((selectedCategory) => selectedCategory._id === category._id)
    );
  
    setAvailableCategories(remainingCategories);
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
            <CustomPhoto {...register("raw_material_photo", { required: false })} handleImageSelect={handleImageSelect} selectedImage={selectedImage ? selectedImage : `${defaultValues?.raw_material_photo}`} disabled={disabled} />
            {errors.user_profile && <Error>{errors.user_profile.message}</Error>}
          </Box>
          <Grid container spacing={4} mt={5}>
            <Grid item xs={12} md={12} xl={12}>
              <TextField label="Raw Material Name" fullWidth variant="standard" {...register("raw_material_name", { required: "Raw Material Name is required" })} disabled={disabled} />
              {errors.raw_material_name && <Error>{errors.raw_material_name.message}</Error>}
            </Grid>
            <Grid item xs={12} md={12} xl={12}>
              <Autocomplete
                multiple
                disabled={disabled}
                id="tags-standard"
                value={selectedCategories}
                options={availableCategories}
                getOptionLabel={(option) => {
                  return option?.name
                }}
                onChange={handleCategorySelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Category"
                    placeholder="Raw Material Category"
                  />
                )} />


              {errors?.category &&
                <Error>{errors?.category.message}</Error>}
            </Grid>
            <Grid item xs={12} md={12} xl={12}>
              <FormControl variant="standard" sx={{ minWidth: 120 }} fullWidth disabled={disabled}>
                <InputLabel id="demo-simple-select-standard-label" style={{ paddingBottom: 10 }}>
                  Qunatity Type
                </InputLabel>
                <Select
                  defaultValue={defaultValues?.quantity_type}
                  {...register("quantity_type", { required: "Please Select Raw Material Qunatity Type" })}
                  fullWidth
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  label="quantityType"
                  sx={{ pb: 1 }}
                >
                  <MenuItem value="KG">KG</MenuItem>
                  <MenuItem value="NO">NO.</MenuItem>
                </Select>
              </FormControl>
              {errors.quantity_type && <Error>{errors.quantity_type.message}</Error>}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField label="Raw Material Minimum Quantity" fullWidth variant="standard" {...register("raw_material_min_quantity")} disabled={disabled} multiline />
              {errors.raw_material_min_quantity && <Error>{errors.raw_material_min_quantity.message}</Error>}
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <TextField label="Raw Material Description" fullWidth variant="standard" {...register("raw_material_description")} disabled={disabled} multiline />
              {errors.raw_material_description && <Error>{errors.raw_material_description.message}</Error>}
            </Grid>

            {
              !disabled &&
              <Grid item xs={12} md={12} xl={12} mt={3} ml={12} mr={12} mb={6}>
                {
                  !editable ?
                    <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} type="submit">
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                      &nbsp;add new Raw Material
                    </MDButton>
                    :
                    <MDButton variant="gradient" color="dark" fullWidth style={{ height: "45px" }} onClick={onEdit}>
                      <Icon sx={{ fontWeight: "bold" }}>edit</Icon>
                      &nbsp;edit Raw Material
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
RawMaterialForm.defaultProps = {
  shadow: true,
  disabled: false,
  editable: false
};

// Typechecking props for the CreateUser
RawMaterialForm.propTypes = {
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


export default RawMaterialForm;
