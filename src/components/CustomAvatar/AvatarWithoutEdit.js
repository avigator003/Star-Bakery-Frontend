import styled from "@emotion/styled";
import { Avatar, Badge, Icon, IconButton } from "@mui/material";
import React, { useRef, } from "react";
import CardMedia from "@mui/material/CardMedia";
import PropTypes from "prop-types";

function AvatarWithoutEdit(props) {
    const { selectedImage } = props;
    return (
                <CardMedia
                    src={selectedImage}
                    component="img"
                    sx={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                    }}
                />
    );
}

AvatarWithoutEdit.propTypes = {
    selectedImage: PropTypes.string.isRequired,
};

export default AvatarWithoutEdit;
