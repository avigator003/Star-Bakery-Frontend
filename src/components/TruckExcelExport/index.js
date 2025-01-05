import React from 'react'
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import MDButton from 'components/MDButton';
import { Icon } from '@mui/material';

function TruckExcelExport({ excelData, fileName ,category,date}) {

    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx"

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(excelData,{skipHeader:`AKshat: ${category}`});
        const commonColumnWidth = 4.2;

        // Initialize the column sizes array
        ws['!cols'] = [];
        ws['!rows'] = [];
    
        // Determine the number of columns based on the data
        const numColumns = XLSX.utils.decode_range(ws['!ref']).e.c + 1;
    
        // Set the common column width for all columns
        for (let i = 0; i < numColumns; i++) {
            ws['!cols'].push({ wch: commonColumnWidth });
        }

        ws['!cols'][0] = { wch: 10 };
        // Apply borders to the data
        const borderStyle = {
            top: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
        };

        for (let i = 3; i < excelData.length; i++) {
            // Apply borders to each row
            ws['!rows'] = ws['!rows'] || [];
            ws['!rows'][i] = { hpt: 27, hpx: 23 };
    
            for (let j = 0; j < numColumns; j++) {
                // Apply borders to each cell
                const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
                ws[cellRef] = ws[cellRef] || {};
                ws[cellRef].s = { ...borderStyle };
            }
        }
    
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <MDButton variant="gradient" color="light" style={{ height: "45px" }} onClick={(e) => exportToExcel()}>
            <Icon sx={{ fontWeight: "bold" }}>download</Icon>
            &nbsp;Export data
        </MDButton>
    )
}

export default TruckExcelExport