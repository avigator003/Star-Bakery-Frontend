import styled from "@emotion/styled";
import { Avatar, Badge, Icon, IconButton, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import CardMedia from "@mui/material/CardMedia";
import PropTypes from "prop-types";

function CustomPhoto(props) {
  const { selectedImage, handleImageSelect, disabled } = props;
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 60,
    height: 60,
    border: `2px solid ${theme.palette.background.paper}`,
    zIndex: 11,
  }));

  const fileInputRef = useRef(null);

  const handleIconButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleOpenImage = () => {
    if (selectedImage.includes("http")) window.open(selectedImage, "_blank");
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
        disabled={disabled}
      />
      <IconButton>
        <Badge
          // overlap="circular"
          // anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Tooltip title="Edit">
              <SmallAvatar alt="edit">
                <Icon fontSize="small">edit</Icon>
              </SmallAvatar>
            </Tooltip>
          }
          style={{
            borderRadius: "50%",
            position: "absolute",
            right: "40%",
            top: "90%",
          }}
          onClick={handleIconButtonClick}
          disableRipple
        ></Badge>
        <CardMedia
          src={selectedImage}
          component="img"
          onClick={handleOpenImage}
          sx={{
            width: "180px",
            height: "180px",
            borderRadius: "10%",
            objectFit: "cover",
            border: "0.1px solid grey",
          }}
        />
      </IconButton>
    </>
  );
}

// Setting default props for the CreateUser
CustomPhoto.defaultProps = {
  disabled: false,
};

CustomPhoto.propTypes = {
  selectedImage: PropTypes.string.isRequired,
  handleImageSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CustomPhoto;
