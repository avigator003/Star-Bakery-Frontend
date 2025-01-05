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

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import Spinner from "components/Spinner/Spinner";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import AlertBox from "components/AlertBox/AlertBox";
import CategoryForm from "../CategoryForm";
import UserRepository from "layouts/user/repository/UserRepository";
import CategoryRepository from "layouts/category/repository/CategoryRepository";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";

function EditCategory({ shadow }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = state;
    const queryClient = useQueryClient();
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const updateCategory = async (data) => {
        return await CategoryRepository.update(data,id);
    };

    const { mutateAsync, isLoading: isUpdateLoading } = useMutation(updateCategory, {
        onSuccess: () => {
            setOpenAlert(true)
            setAlertMessage("Category Updated Succesfully")
        },
        onError: async (err) => {
            setOpenAlert(true)
            setAlertMessage("Category Updated Unsuccessful.")
        },
    });

    const getCategory = (id) => {
        return CategoryRepository.getById(id)
            .then((result) => {
                return result;
            });
    };

    const { data, isLoading } = useQuery(
        ["category", id],
        () => getCategory(id),
        { staleTime: 50000, retry: 1 }
    );

    const onFormSubmit = async (data) => {
        await mutateAsync(data);
        queryClient.invalidateQueries("category");
    };

    if (isLoading) {
        return (
            <Spinner />
        );
    }

    return (
        <>
            <AlertBox
                openAlert={openAlert}
                alertMessage={alertMessage}
                setOpenAlert={setOpenAlert}
            />
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} lg={9} style={{ position: "relative" }}>
                    <Card
                        sx={{
                            height: "100%",
                            boxShadow: !shadow && "none",
                        }}
                    >
                        <MDBox p={2}>
                            <MDBox
                                component="ul"
                                display="flex"
                                flexDirection="column"
                                p={0}
                                mt={20}
                                ml={4}
                                mr={4}
                            >
                                <CategoryForm onFormSubmit={onFormSubmit} isLoading={isLoading} defaultValues={data?.categories} editable={true} />
                            </MDBox>
                        </MDBox>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

// Setting default props for the CreateUser
EditCategory.defaultProps = {
    shadow: true,
};

// Typechecking props for the CreateUser
EditCategory.propTypes = {
    shadow: PropTypes.bool,
};

export default EditCategory;
