import { Box, FormControl, InputLabel, MenuItem, Select, Typography, Button } from '@mui/material';
import MDButton from 'components/MDButton';
import React, { useEffect, useState } from 'react';
import fetchVisualsData from './VisualFetch';
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import Spinner from 'components/Spinner/Spinner';

const Attributes = {
    Day: "day",
    Month: "month",
    Year: "year"
};

const monthMap = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12
};

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function SalesBarChart() {
    const [attribute, setAttribute] = useState('');
    const [value, setValue] = useState(-1);
    const [value2, setValue2] = useState(-1);
    const [valueOptions, setValueOptions] = useState([]);
    const [valueOptions2, setValueOptions2] = useState([]);
    const [graphData, setGraphData] = useState({})
    const [chartData, setChartData] = useState({});
    const [options, setOptions] = useState({});
    const [loading, setLoading] = useState(false);
    function getMonthsFromNumbers(numbers) {
        return numbers.map((number) => {
            for (const [month, value] of Object.entries(monthMap)) {
                console.log("month", month, value);
                console.log("number", number);
                if (value === parseInt(number)) {
                    return month;
                }
            }
            return null; // Return null if the number doesn't match any month
        });
    }

    const fetchInitialVisualsData = async ({ attribute, value, value2 = undefined }) => {
        setLoading(true);
        const data = await fetchVisualsData({ attribute, value, value2 });
        setGraphData(data.data);
    }

    const handleAttributeChange = (event) => {
        setAttribute(event.target.value);
    };

    const handleValueChange = (event) => {
        setValue(event.target.value);
    };

    const handleValue2Change = (event) => {
        setValue2(event.target.value);
    }

    const handleFilterClick = async () => {
        setLoading(true);
        let apiValue = value;
        const year = parseInt(value2)
        if (attribute === 'day') {
            // If it's Day, map the month string to a number (1 to 12)
            apiValue = monthMap[value] || value; // Map the selected month to its integer value
        }
        const data = await fetchVisualsData({ attribute, value: apiValue, value2:year })
        console.log(data.data)
        setGraphData(data.data)

        // Here, you would send the apiValue along with the selected attribute to the API
        // Example: sendToApi({ attribute, value: apiValue });
    };

    useEffect(() => {
        setAttribute('day');
        const currentMonth = new Date().getMonth() + 1;
        fetchInitialVisualsData({ attribute: 'day', value: currentMonth, value2: new Date().getFullYear() });
        setValue(Object.keys(monthMap).find(key => monthMap[key] === currentMonth))
        setValue2(new Date().getFullYear())
    }, [])

    useEffect(() => {
        if (attribute === 'day') {
            const values = [];
            const currentYear = new Date().getFullYear();
            for (let year = currentYear; year >= 2023; year--) {
                console.log(year)
                values.push(year);
            }
            setValueOptions2(values);
            
            const allMonths = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            if (value2 === new Date().getFullYear()) {
                // If the selected year is the current year, only show months up to the current month
                const currentMonthIndex = new Date().getMonth();
                setValueOptions(allMonths.slice(0, currentMonthIndex + 1));
            } else {
                // Otherwise, show all months
                setValueOptions(allMonths);
            }
            
        } else if (attribute === 'month') {
            const values = [];
            const currentYear = new Date().getFullYear();
            for (let year = currentYear; year >= 2023; year--) {
                console.log(year)
                values.push(year);
            }
            setValueOptions(values);
        }
    }, [attribute]);

    useEffect(()=>{
        if (attribute === 'day') {
            const allMonths = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            if (value2 === new Date().getFullYear()) {
                // If the selected year is the current year, only show months up to the current month
                const currentMonthIndex = new Date().getMonth();
                setValueOptions(allMonths.slice(0, currentMonthIndex + 1));
            } else {
                // Otherwise, show all months
                setValueOptions(allMonths);
            }
        }
    },[value2])
    useEffect(() => {
        if (Object.keys(graphData).length !== 0) {
            setLoading(false);
            const months = getMonthsFromNumbers(Object.keys(graphData))
            setChartData({
                labels: attribute === "month" ? months : Object.keys(graphData),
                datasets: [
                    {
                        label: "Sales",
                        data: Object.values(graphData),
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            });
            setOptions({
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: attribute === "day" ? "Days" : attribute === "month" ? "Months" : "Years",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Sales",
                        },
                    },
                },
            })
        }

    }, [graphData])

    // Generate the options based on the selected attribute
    return (
        <>
            <Box sx={{ width: '100%', padding: 3, display: 'flex', gap: 7 }}>
                <Typography variant="h4" gutterBottom>
                    Visualization Component
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                    {/* Attribute Selector */}
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Attribute</InputLabel>
                        <Select
                            value={attribute}
                            onChange={handleAttributeChange}
                            label="Attribute"
                            sx={{ height: 40 }} // Adjust the height here
                        >
                            {Object.entries(Attributes).map(([label, value]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Value Selector */}
                    {attribute !== "" && attribute !== "year" && valueOptions.length > 0 &&
                        <FormControl sx={{ minWidth: 180 }}>
                            <InputLabel>{ attribute==="day"?"Month":"Year"}</InputLabel>
                            <Select
                                value={value}
                                onChange={handleValueChange}
                                label="Value"
                                sx={{ height: 40 }} // Adjust the height here
                            >
                                {valueOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>}
                        {attribute === "day" && valueOptions2.length > 0 &&
                        <FormControl sx={{ minWidth: 180 }}>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={value2}
                                onChange={handleValue2Change}
                                label="Value"
                                sx={{ height: 40 }} // Adjust the height here
                            >
                                {valueOptions2.map((option, index) => (
                                    <MenuItem key={index} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>}

                </Box>
                {/* Filter Button */}
                <MDButton
                    variant="gradient"
                    color="dark"
                    style={{ height: "40px" }}
                    onClick={handleFilterClick}
                >
                    Filter
                </MDButton>

            </Box>

            <Box sx={{ width: "100%", mx: "auto", mt: 4 }}>
                {
                    loading ? <Spinner /> : <Bar data={chartData} options={options} />
                }
            </Box>
        </>
    );
}

export default SalesBarChart;
