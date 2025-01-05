import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import LabourRepository from 'layouts/labour/repository/LabourRepository';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import LabourAttendanceExport from 'components/LabourAttendanceExport';
function SeeAttendance() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const { state } = useLocation();
  const { id } = state;
  const [value, onChange] = useState(new Date());
  const [labourName, setLabourName] = useState("");
  const [data, setData] = useState();
  const [workingDays, setWorkingDays] = useState(0);
  const [leaves, setLeaves] = useState(0);
  const [fullDays, setFullDays] = useState(0);
  const [halfDays, setHalfDays] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [excelData, setExcelData] = useState()




  const getLabour = () => {
    return LabourRepository.getById(id)
      .then((result) => {
        return result;
      });
  };

  const calculateDays = (attendanceHistory) => {
    let totalWorkingDays = 0;
    let totalLeaves = 0;
    let totalFullDays = 0;
    let totalHalfDays = 0;

    attendanceHistory.forEach((item) => {
      if (item.status === 'Leave') {
        totalLeaves++;
      } else if (item.status === 'Full Day') {
        totalFullDays++;
      } else if (item.status === 'Half Day') {
        totalHalfDays++;
      }


      totalWorkingDays++;

    });

    setWorkingDays(totalWorkingDays);
    setLeaves(totalLeaves);
    setFullDays(totalFullDays);
    setHalfDays(totalHalfDays);
    return {
      totalWorkingDays,
      totalLeaves,
      totalFullDays,
      totalHalfDays
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const labourData = await getLabour();
      setLabourName(labourData.labour.labour_name)
      setData(labourData);
      if (labourData && labourData.labour && labourData.labour.attendance_history) {
        const selectedMonthIndex = months.findIndex((month) => month === selectedMonth);
        const filteredHistory = labourData.labour.attendance_history.filter((item) => {
          const itemDate = new Date(item.created_at);
          return itemDate.getMonth() === selectedMonthIndex;
        });
        generateExcelData(filteredHistory, labourData.labour.labour_name)
      }
      if (labourData && labourData.labour && labourData.labour.attendance_history) {
        calculateDays(labourData.labour.attendance_history);
      }
    };
    fetchData();
  }, []);


  const tileContent = ({ date, view }) => {
    const status = data?.labour?.attendance_history?.find((item) => {
      const itemDate = new Date(item.created_at);
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    });

    if (status) {
      return (
        <>
          {status.status === 'Leave' && (
            <div className="hover-text" style={{ backgroundColor: '#E70022', color: 'white', padding: 8, borderRadius: 50 }}>
              {status.status}
            </div>
          )}
          {status.status === 'Half Day' && (
            <div className="hover-text" style={{ backgroundColor: '#F6B900', color: 'white', padding: 8, borderRadius: 50, fontSize: 14 }}>
              {status.status}
            </div>
          )}
          {status.status === 'Full Day' && (
            <div className="hover-text" style={{ backgroundColor: '#6EB673', color: 'white', padding: 8, borderRadius: 50 }}>
              {status.status}
            </div>
          )}
        </>
      );
    }
    return null;
  };

  useEffect(() => {
    handleCalendarChange()
  }, [selectedMonth])



  const handleCalendarChange = () => {
    if (data && data.labour && data.labour.attendance_history) {
      // Filter attendance history for the selected month
      const selectedMonthIndex = months.findIndex((month) => month === selectedMonth);

      const filteredHistory = data.labour.attendance_history.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate.getMonth() === selectedMonthIndex;
      });
      // Recalculate the days based on filtered attendance history
      calculateDays(filteredHistory);
    }
  };

  useEffect(() => {
    if (data && data.labour && data.labour.attendance_history) {
      const selectedMonthIndex = months.findIndex((month) => month === selectedMonth);

      const filteredHistory = data.labour.attendance_history.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate.getMonth() === selectedMonthIndex;
      });
      generateExcelData(filteredHistory, data.labour.labour_name)
    }
  }, [selectedMonth])


  const getDate = (date) => {
    const today = new Date(date);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }


  const generateExcelData = (filtData, name) => {
    const data = [];
    const {
      totalWorkingDays,
      totalLeaves,
      totalFullDays,
      totalHalfDays
    } = calculateDays(filtData);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Add Totals
    const totalsRow = [
      'Month:',
      `${selectedMonth.substring(0, 3)}, ${currentYear}`,
      'Labour Name:',
      name,
      'Total Working Days:',
      totalWorkingDays
    ];

    data.push(totalsRow);

    const totalsRow1 = [
      'Full Days:',
      totalFullDays,
      'Half Days',
      totalHalfDays,
      'Leaves:',
      totalLeaves
    ]

    data.push(totalsRow1);
    // Empty Rows
    data.push([]);
    data.push([]);

    // Add Totals
    const headerRows = [
      'Date',
      'Status'
    ];

    data.push(headerRows);

    // Data Rows
    filtData?.forEach((lab) => {
      const rowData = [
        getDate(lab.created_at),
        lab.status
      ];
      data.push(rowData);
    });

    setExcelData(data);
  };


  return (
    <DashboardLayout justifyContent="center" alignItems="center" display="flex">
      {data && (
        <>
          <DashboardNavbar />

          <Box mt={6} mb={3} height="100%">
            <MDBox
              display="flex"
              mx={2}
              mt={-7}
              bgColor="#2D8F29"
              py={0}
              px={2}
            >
              <Box borderRight={1} borderColor="white" p={1} pr={1}>
                <MDTypography
                  component="a"
                  href="#"
                  style={{ marginLeft: 0, fontSize: 12 }}
                  variant="caption"
                  color="white"
                  fontWeight="medium"
                >
                  Total Working Days: {workingDays}
                </MDTypography>
              </Box>
              <Box borderRight={1} borderColor="white" p={1} pr={2}>
                <MDTypography
                  component="a"
                  href="#"
                  style={{ marginLeft: 0, fontSize: 12 }}
                  variant="caption"
                  color="white"
                  fontWeight="medium"
                >
                  Total Full Days: {fullDays}
                </MDTypography>
              </Box>
              <Box p={1} pr={2} borderRight={1}>
                <MDTypography
                  component="a"
                  href="#"
                  style={{ marginLeft: 0, fontSize: 12 }}
                  variant="caption"
                  color="white"
                  fontWeight="medium"
                >
                  Total Half Days: {halfDays}
                </MDTypography>
              </Box>
              <Box p={1} pr={2}>
                <MDTypography
                  component="a"
                  href="#"
                  style={{ marginLeft: 0, fontSize: 12 }}
                  variant="caption"
                  color="white"
                  fontWeight="medium"
                >
                  Total Leaves: {leaves}
                </MDTypography>
              </Box>
              <MDBox style={{ marginLeft: 100, display: "flex", flexDirection: "row" }}>
                <Box p={1} pr={2}>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ height: 40, borderRadius: 20, paddingRight: 10, paddingLeft: 10, cursor: "default", fontSize: 15 }}>
                    <option value="">Select a Month</option>
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </Box>
                <Box p={1} pr={2}>
                  <LabourAttendanceExport excelData={excelData} fileName="LabourAttendanceData" month={selectedMonth} />
                </Box>
              </MDBox>
            </MDBox>
            <Grid container>
              <Grid item xs={12} md={12} xl={12}>
                <CalendarContainer>
                  <Calendar value={value} tileContent={tileContent} sx={{ justifyContent: 'center', alignItems: 'center' }} />
                </CalendarContainer>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </DashboardLayout>
  );
}

export default SeeAttendance;

const CalendarContainer = styled.div`
  max-width: 3050px;
  padding: 10px;
  border-radius: 3px;
  .react-calendar {
    width: 3050px !important;
    height: 480px !important;
  }
  .react-calendar__tile {
    height: 70px !important;
    border-radius: 10px;
    font-size: 15px;
  }
`;
