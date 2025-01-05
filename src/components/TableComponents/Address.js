import AvatarWithoutEdit from 'components/CustomAvatar/AvatarWithoutEdit'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import React from 'react'
// prop-types is library for typechecking of props
import PropTypes from "prop-types";

function Address({ address, city, state }) {
  return (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {address}
      </MDTypography>
      <MDTypography variant="caption">
        {city}
        ,
        {state}
      </MDTypography>
    </MDBox>
  )
}

  // Typechecking props for the CreateUser
  Address.propTypes = {
    address: PropTypes.string.isRequired,
    city :PropTypes.string.isRequired,
    state :PropTypes.string.isRequired
  };
  
export default Address