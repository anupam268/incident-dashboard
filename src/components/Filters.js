// src/components/Filters.js

import React from 'react';
import { Grid, TextField, Autocomplete } from '@mui/material';

const Filters = ({ filters, handleFilterChange, incidentData, anomalyData }) => {
  const allOptions = [''];

  return (
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
  );
};

export default Filters;
