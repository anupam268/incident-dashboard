import React, { useMemo, useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, Typography, Paper, Grid, Collapse, TextField, Autocomplete } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import data from '../data/data.json'; // Importing the merged data file

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncidentDashboard = () => {
  const [filters, setFilters] = useState({
    iceboardId: '',
    application: '',
    incidentMonth: '',
    incidentWeek: '',
  });

  const { anomaly_data: anomalyData, incident_data: incidentData } = data; // Destructuring the imported data

  useEffect(() => {
    resetFilters();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      iceboardId: '',
      application: '',
      incidentMonth: '',
      incidentWeek: '',
    });
  };

  const filteredData = useMemo(() => {
    const filterCondition = (item) => {
      const incidentDate = new Date(item.incident_creation_date || item.anomaly_detection_date);
      const incidentMonth = incidentDate.toLocaleString('default', { month: 'long' });
      const incidentWeek = Math.ceil(incidentDate.getDate() / 7);

      return (
        (!filters.iceboardId || item.iceboard_id.includes(filters.iceboardId)) &&
        (!filters.application || item.main_application.includes(filters.application)) &&
        (!filters.incidentMonth || incidentMonth === filters.incidentMonth) &&
        (!filters.incidentWeek || incidentWeek.toString() === filters.incidentWeek)
      );
    };

    return {
      incidentData: incidentData.filter(filterCondition),
      anomalyData: anomalyData.filter(filterCondition),
    };
  }, [filters, incidentData, anomalyData]);

  const aggregatedDataForChart = useMemo(() => {
    const dataToAggregate = filteredData.anomalyData.length > 0 ? filteredData.anomalyData : anomalyData;

    const aggregatedData = {};
    dataToAggregate.forEach((item) => {
      const date = new Date(item.anomaly_detection_date).toLocaleDateString('en-GB');
      if (aggregatedData[date]) {
        aggregatedData[date] += parseInt(item.host_anomaly_count, 10);
      } else {
        aggregatedData[date] = parseInt(item.host_anomaly_count, 10);
      }
    });

    return {
      labels: Object.keys(aggregatedData),
      datasets: [
        {
          label: 'Host Anomaly Count',
          data: Object.values(aggregatedData),
          backgroundColor: '#1976d2',
        },
      ],
    };
  }, [filteredData.anomalyData]);

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const columns = useMemo(() => [
    { accessorKey: 'iceboard_id', header: 'Iceboard ID', size: 150 },
    { accessorKey: 'incident_creation_date', header: 'Incident Creation Date', size: 200 },
    { accessorKey: 'main_application', header: 'Application', size: 150 },
    { accessorKey: 'priority', header: 'Priority', size: 100 },
    { accessorKey: 'title', header: 'Title', size: 300, Cell: ({ cell }) => (
        <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {cell.getValue()}
        </Box>
      ),
    },
  ], []);

  const allOptions = [''];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px' }}>
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
          marginBottom: '24px',
        }}
      >
        <Box sx={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#1976d2',
            }}
          >
            Incidents Details
          </Typography>
          <Button
            onClick={resetFilters}
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            sx={{
              borderRadius: '8px',
              padding: '8px 16px',
              minWidth: '120px',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              '&:focus': {
                outline: '2px solid #1976d2',
              },
            }}
          >
            Reset
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={[...allOptions, ...new Set([...incidentData.map((item) => item.iceboard_id), ...anomalyData.map((item) => item.iceboard_id)])]}
              inputValue={filters.iceboardId}
              onInputChange={(event, newValue) => handleFilterChange('iceboardId', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Iceboard ID" variant="outlined" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={[...allOptions, ...new Set([...incidentData.map((item) => item.main_application), ...anomalyData.map((item) => item.main_application)])]}
              inputValue={filters.application}
              onInputChange={(event, newValue) => handleFilterChange('application', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Application" variant="outlined" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={[...allOptions, ...new Set(incidentData.map((item) => new Date(item.incident_creation_date).toLocaleString('default', { month: 'long' })))]}
              inputValue={filters.incidentMonth}
              onInputChange={(event, newValue) => handleFilterChange('incidentMonth', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Incident Month" variant="outlined" fullWidth />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={[...allOptions, ...new Set(incidentData.map((item) => Math.ceil(new Date(item.incident_creation_date).getDate() / 7).toString()))]}
              inputValue={filters.incidentWeek}
              onInputChange={(event, newValue) => handleFilterChange('incidentWeek', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Incident Week" variant="outlined" fullWidth />
              )}
            />
          </Grid>
        </Grid>

        <MaterialReactTable
          columns={columns}
          data={filteredData.incidentData}
          enableSorting
          initialState={{
            pagination: { pageSize: 5 },
          }}
          muiTablePaperProps={{
            sx: {
              borderRadius: '8px',
              boxShadow: 'none',
              backgroundColor: 'transparent',
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              backgroundColor: '#f9f9f9',
              borderBottom: '1px solid #e0e0e0',
              padding: '8px',
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#1976d2',
              color: '#fff',
              fontWeight: 'bold',
              padding: '8px',
            },
          }}
          renderDetailPanel={({ row }) => (
            <Collapse in={row.getIsExpanded()}>
              <Box
                sx={{
                  padding: '16px',
                  backgroundColor: '#fafafa',
                  borderLeft: '4px solid #1976d2',
                  marginTop: '4px',
                  width: '100%',
                  flexGrow: 1,
                }}
              >
                <Typography variant="subtitle1"><strong>Cause Description:</strong> {row.original.cause_description}</Typography>
                <Typography variant="subtitle1"><strong>Communication:</strong> {row.original.communication}</Typography>
                <Typography variant="subtitle1"><strong>Impact Description:</strong> {row.original.impact_description}</Typography>
                <Typography variant="subtitle1"><strong>Information on Resolution:</strong> {row.original.information_on_resolution}</Typography>
              </Box>
            </Collapse>
          )}
        />
      </Paper>

      {/* Bar Chart Section */}
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
    </Box>
  );
};

export default IncidentDashboard;
