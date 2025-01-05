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

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import UserRepository from "layouts/user/repository/UserRepository";
import AlertBox from "components/AlertBox/AlertBox";
import styled from "styled-components";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [mobileNumber, setMobileNumber] = useState();
  const [password, setPassword] = useState();
  const [alertMessage, setAlertMessage] = useState("Mobile Number Or Password is Wrong!!");
  const [openAlert, setOpenAlert] = useState(false);
  const [error ,setError] = useState()
 
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = () => {
    return UserRepository.login(mobileNumber, password)
      .then((result) => {
        if (!result.success) {
          setOpenAlert(true)
        }
        else if (result.success && !result.data[0].admin) {
          setOpenAlert(true)
          setAlertMessage("You are not a admin!!")
        }
        else {
          window.location.href = '/';
          localStorage.setItem('user', result.data[0]._id);
          localStorage.setItem('admin', result.data[0].admin);
        }
      });
  }

  const handleMobileNumberChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 10 || onlyNums.length > 10) {
      setError('Mobile number should be 10 digits');
      setMobileNumber(onlyNums);
    } else if (onlyNums.length === 10) {
      setError('');
      setMobileNumber(onlyNums);
    } else {
      setError('Mobile number should contain only digits');
      setMobileNumber(onlyNums);
    }
  }
  return (
    <BasicLayout image={bgImage}>
      <AlertBox
        openAlert={openAlert}
        alertMessage={alertMessage}
        setOpenAlert={setOpenAlert}
      />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput label="Mobile Number" fullWidth value={mobileNumber} onChange={handleMobileNumberChange} />
              <Error>{error}</Error>
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" fullWidth value={password} onChange={e => setPassword(e.target.value)} />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleLogin}>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

export const Error = styled.p`
  color: red;
  font-weight: 600;
  font-size: 0.8rem;
`;

