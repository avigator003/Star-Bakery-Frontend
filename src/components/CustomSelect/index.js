import { MenuItem, Select } from "@mui/material";
import React from "react";
// prop-types is library for typechecking of props
import PropTypes from "prop-types";

function CustomSelect(props) {
  const { placeholder, handleChange, value, children } = props;
  return (
    <Select
      fullWidth
      style={{ height: "45px" }}
      displayEmpty
      value={value}
      variant="standard"
      onChange={handleChange}
      renderValue={(selected) => {
        if (selected.length === 0) {
          return <em>{placeholder}</em>;
        }
        return selected.join(", ");
      }}
      inputProps={{ "aria-label": "Without label" }}
    >
      <MenuItem disabled value="">
        {placeholder}
      </MenuItem>
      {children}
    </Select>
  );
}

// Typechecking props for the CreateUser
CustomSelect.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

CustomSelect.defaultProps = {
  children: null,
};

export default CustomSelect;
