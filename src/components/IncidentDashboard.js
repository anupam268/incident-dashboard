import React, { useMemo, useState, useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Filters from './Filters';
import IncidentTable from './IncidentTable';
import IncidentChart from './IncidentChart';
import AnomalyTable from './AnomalyTable';

const IncidentDashboard = () => {
  const [data, setData] = useState(null); // Initial state is null to differentiate between loading and empty data
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    iceboardId: '',
    application: '',
    incidentMonth: '',
    incidentWeek: '',
  });

  const fetchData = async () => {
    try {
      const endpoint = 'http://127.0.0.1:5000/analysis';
      const response = await fetch(endpoint);
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false); // Data fetched, loading is false
    } catch (error) {
      console.error('Error fetching data from backend: ', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  const filterCondition = (item) => {
    if (!item) return false; // Ensure item is defined

    const incidentDate = new Date(item.incident_creation_date || item.anomaly_detection_date);
    const incidentMonth = incidentDate.toLocaleString('default', { month: 'long' });
    const incidentWeek = Math.ceil(incidentDate.getDate() / 7);

    return (
      (!filters.iceboardId || item.iceboard_id?.includes(filters.iceboardId)) &&
      (!filters.application || item.main_application?.includes(filters.application)) &&
      (!filters.incidentMonth || incidentMonth === filters.incidentMonth) &&
      (!filters.incidentWeek || incidentWeek.toString() === filters.incidentWeek)
    );
  };

  const filteredData = useMemo(() => {
    if (!data) return { incidentData: [], anomalyData: [] };

    return {
      incidentData: data.incident_data?.filter(filterCondition) || [],
      anomalyData: data.anomaly_data?.filter(filterCondition) || [],
    };
  }, [filters, data]);

  const aggregatedDataForChart = useMemo(() => {
    if (!filteredData.anomalyData.length && !data?.anomaly_data) return { labels: [], datasets: [] };

    const dataToAggregate = filteredData.anomalyData.length > 0 ? filteredData.anomalyData : data.anomaly_data;

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px' }}>
      {/* Filters Section */}
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
            Filters
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

        <Filters
          filters={filters}
          handleFilterChange={handleFilterChange}
          incidentData={data?.incident_data || []}
          anomalyData={data?.anomaly_data || []}
        />
      </Paper>

      {/* Incident Table Section */}
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
        <IncidentTable filteredData={filteredData.incidentData} />
      </Paper>

      {/* Bar Chart Section */}
      <IncidentChart aggregatedDataForChart={aggregatedDataForChart} chartOptions={chartOptions} />

      {/* Anomaly Table Section */}
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
          marginTop: '24px',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: '#1976d2',
            marginBottom: '16px',
          }}
        >
          Anomalies Details
        </Typography>

        <AnomalyTable filteredData={filteredData.anomalyData} />
      </Paper>
    </Box>
  );
};

export default IncidentDashboard;
