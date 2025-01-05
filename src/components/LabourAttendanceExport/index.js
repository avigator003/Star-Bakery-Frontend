import React from "react";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";

function LabourAttendanceExport({ excelData, fileName, category, date }) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(excelData, {
      skipHeader: `AKshat:"mfkef"`,
    });
    ws["!cols"] = [];
    ws["!rows"] = [];

    const numColumns = XLSX.utils.decode_range(ws["!ref"]).e.c + 1;
    for (let i = 0; i < numColumns; i++) {
      ws["!cols"].push({ wch: 10 });
    }

    ws["!cols"][0] = { wch: 10 };
    // Apply borders to the data
    const borderStyle = {
      top: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
    };

    for (let i = 3; i < excelData.length; i++) {
      // Apply borders to each row
      ws["!rows"] = ws["!rows"] || [];
      ws["!rows"][i] = { hpt: 27, hpx: 23 };

      for (let j = 0; j < numColumns; j++) {
        // Apply borders to each cell
        const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
        ws[cellRef] = ws[cellRef] || {};
        ws[cellRef].s = { ...borderStyle };
        if (i === 4) {
          ws[cellRef].s.font = { bold: true };
        }
      }
    }
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <MDButton
      variant="gradient"
      color="light"
      style={{ height: "10px !important", fontSize: 10 }}
      onClick={(e) => exportToExcel()}
    >
      &nbsp;Download data
    </MDButton>
  );
}

export default LabourAttendanceExport;
