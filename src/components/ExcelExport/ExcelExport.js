import React from 'react'
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import MDButton from 'components/MDButton';
import { Icon } from '@mui/material';

function ExcelExport({ excelData, fileName }) {

    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx"
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension)
    }
    
    return (
        <MDButton variant="gradient" color="light" style={{ height: "45px" }} onClick={(e) => exportToExcel()}>
            <Icon sx={{ fontWeight: "bold" }}>download</Icon>
            &nbsp;Export data
        </MDButton>
    )
}

export default ExcelExport