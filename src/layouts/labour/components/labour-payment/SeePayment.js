import { Box, Grid } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import LabourRepository from 'layouts/labour/repository/LabourRepository';
import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';


function SeePayment() {
  const { state } = useLocation();
  const { id } = state;
  const [value, onChange] = useState(new Date());
  const [data, setData] = useState();

  const getLaboutById = () => {
    return LabourRepository.getById(id)
      .then((result) => {
        return result;
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      const labourData = await getLaboutById();
      setData(labourData);
    };
    fetchData();
  }, []);

  const convertCurrency = (value) => {
    const options = { style: 'currency', currency: 'INR' };
    const formattedNumber = value.toLocaleString('en-IN', options);
    return formattedNumber;
  }

  const convertDate = (dateString) => {
    const utcDateString = dateString;
    const date = new Date(utcDateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const localDateString = date.toLocaleDateString('en-US', options);
    return localDateString;
  }

  const tileContent = ({ date, view }) => {
    const status = data?.labour?.salary_history?.find((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate.getDate() === date.getDate() && itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear();
    });


    if (status) {
      return (
        <>
          {/* {status.status === "Unpaid" &&
            <>
              <div className="hover-text" style={{ backgroundColor: "#E70022", color: "white", padding: 10, borderRadius: 50 }}>
                {status.status}
                <div>
                  Payable Amount : ₹{(data.labour?.payableAmount).toFixed(2)}
                </div>
                <div>
                  Due Amount : ₹{(data.labour?.dueAmount).toFixed(2)}
                </div>
              </div>
            </>
          }
          {
            status.status === "Paid" &&
            <>
              <div className="hover-text" style={{ backgroundColor: "#F6B900", color: "white", padding: 10, borderRadius: 50, }}>
                {status.status}
                <div>
                  Payable Amount : ₹{(data.labour?.payableAmount).toFixed(2)}
                </div>
                <div>
                  Due Amount : ₹{(data.labour?.dueAmount).toFixed(2)}
                </div>
              </div>
            </>
          }
          {
            status.status === "Advance Payment" &&
            <>
              <div className="hover-text" style={{ backgroundColor: "#6EB673", color: "white", padding: 10, borderRadius: 50 }}>
                {status.status} :     {convertCurrency(status.advance_payment)}
                <div>
                  Payable Amount : {(data.labour?.payableAmount).toFixed(2)}
                </div>
                <div>
                  Due Amount : {(data.labour?.dueAmount).toFixed(2)}
                </div>
              </div>
            </>
          } */}

          <div className="hover-text" style={{ backgroundColor: "#6EB673", color: "white", padding: 10, borderRadius: 50 }}>
            <div>
            {status.status}
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <DashboardLayout justifyContent="center" alignItems="center" display="flex">
      {data &&
        <>
          <DashboardNavbar />
          <Box mt={6} mb={3} height="100%">
            <Grid container>
              <Grid item xs={12} md={12} xl={12}>
                <CalendarContainer>
                  <Calendar onChange={onChange} value={value} tileContent={tileContent} view="year"
                    sx={{ justifyContent: "center", alignItems: "center" }} />
                 </CalendarContainer>
              </Grid>

            </Grid>
          </Box>
        </>}
    </DashboardLayout>
  )
}

export default SeePayment;

const CalendarContainer = styled.div`
  max-width: 3050px;
  padding: 10px;
  border-radius: 3px;
  .react-calendar {
    width:3050px !important;
    height:500px !important;
  },
  .react-calendar__tile{
    height:110px !important;
    border-radius:10px;
    font-size:13px
  }
`;


