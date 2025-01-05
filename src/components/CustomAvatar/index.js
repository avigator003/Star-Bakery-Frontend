import styled from "@emotion/styled";
import { Avatar, Badge, Icon, IconButton, Tooltip } from "@mui/material";
import React, { useRef, } from "react";
import CardMedia from "@mui/material/CardMedia";
import PropTypes from "prop-types";

function CustomAvatar(props) {
    const { selectedImage, handleImageSelect ,disabled} = props;
    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 50,
        height: 50,
        border: `2px solid ${theme.palette.background.paper}`,
        zIndex: 11,
    }));

    const fileInputRef = useRef(null);

    const handleIconButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                style={{ display: 'none' }}
                disabled={disabled}
            />
            <IconButton aria-label="cart" onClick={handleIconButtonClick} disableRipple style={{ zIndex: 20 }}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                        <Tooltip title="Edit">
                            <SmallAvatar alt="edit">
                                <Icon fontSize="small">edit</Icon>
                            </SmallAvatar>
                        </Tooltip>
                    }
                    style={{
                        borderRadius: '50%',
                    }}
                >
                    <CardMedia
                        src={selectedImage}
                        component="img"
                        sx={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                </Badge>
            </IconButton>
        </>
    );
}

// Setting default props for the CreateUser
CustomAvatar.defaultProps = {
    disabled: false,
};

CustomAvatar.propTypes = {
    selectedImage: PropTypes.string.isRequired,
    handleImageSelect: PropTypes.func.isRequired,
    disabled :PropTypes.bool
};

export default CustomAvatar;
