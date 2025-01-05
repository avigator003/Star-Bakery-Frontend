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
import { useLocation, useNavigate } from "react-router-dom";
import OrderRepository from "layouts/order/repository/OrderRepository";
import OrderForm from "../OrderForm";

function EditOrder({ shadow }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = state;
    const queryClient = useQueryClient();
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const[userId,setUserid] = useState()
   
    const updateOrder = async (data) => {
        return await OrderRepository.update(data,userId,id);
    };

    const { mutateAsync, isLoading: isUpdateLoading } = useMutation(updateOrder, {
        onSuccess: () => {
            setOpenAlert(true)
            setAlertMessage("Order Updated Succesfully")
        },
        onError: async (err) => {
            setOpenAlert(true)
            setAlertMessage("Order Updated Unsuccessful.")
        },
    });

    const getOrder = (id) => {
        return OrderRepository.getById(id)
            .then((result) => {
                return result;
            });
    };

    const { data, isLoading } = useQuery(
        ["orders", id],
        () => getOrder(id),
        { staleTime: 50000, retry: 1 }
    );

    const onFormSubmit = async (data,id) => {
        setUserid(id)
        await mutateAsync(data);
        queryClient.invalidateQueries("orders");
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
                                <OrderForm onFormSubmit={onFormSubmit} isLoading={isLoading} defaultValues={data?.orders} editable={true} />
                            </MDBox>
                        </MDBox>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

// Setting default props for the CreateUser
EditOrder.defaultProps = {
    shadow: true,
};

// Typechecking props for the CreateUser
EditOrder.propTypes = {
    shadow: PropTypes.bool,
};

export default EditOrder;
