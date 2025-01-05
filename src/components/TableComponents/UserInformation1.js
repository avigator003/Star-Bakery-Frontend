import AvatarWithoutEdit from 'components/CustomAvatar/AvatarWithoutEdit'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import React from 'react'
// prop-types is library for typechecking of props
import PropTypes from "prop-types";

function UserInformation1({ image, name, mobile }) {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox lineHeight={1} mt={2}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{mobile}</MDTypography>
      </MDBox>
    </MDBox>
  )
}

  // Typechecking props for the CreateUser
  UserInformation1.propTypes = {
    image: PropTypes.string.isRequired,
    name :PropTypes.string.isRequired,
    mobile :PropTypes.string.isRequired
  };
  
export default UserInformation1