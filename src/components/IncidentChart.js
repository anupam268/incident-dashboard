// src/components/IncidentChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography, Box } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,  // X-axis scale
  LinearScale,    // Y-axis scale
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const IncidentChart = ({ aggregatedDataForChart, chartOptions }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        width: '100%',
        maxWidth: '1200px',
        overflowX: 'auto',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#1976d2',
          marginBottom: '16px',
        }}
      >
        Incident Analysis
      </Typography>

      <Box sx={{ height: 400 }}>
        <Bar data={aggregatedDataForChart} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default IncidentChart;
