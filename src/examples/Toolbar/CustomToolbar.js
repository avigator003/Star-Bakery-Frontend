import { Input, TextField } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid'
import SearchBar from 'material-ui-search-bar'
import React from 'react'

export default function CustomToolbar(props) {
  return (
    <GridToolbarContainer style={{ margin: 20 }}>
    <TextField
        variant="outlined"
        label="Search by Name"
        value={props?.value}
        onChange={(event) => props?.onChange && props.onChange(event.target.value)}
      />
    </GridToolbarContainer>
  );
}
