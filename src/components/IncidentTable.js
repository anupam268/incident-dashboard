import React, { useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, Typography, TextField, MenuItem, Paper, Grid, Collapse } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import incidentData from '../data/incidentData'; // Importing incident data

const IncidentTable = () => {
  const [filters, setFilters] = useState({
    iceboardId: '',
    application: '',
    incidentMonth: '',
    incidentWeek: '',
  });

  const filteredData = useMemo(() => {
    return incidentData.filter((item) => {
      const incidentDate = new Date(item.incident_creation_date);
      const incidentMonth = incidentDate.toLocaleString('default', { month: 'long' });
      const incidentWeek = Math.ceil(incidentDate.getDate() / 7);

      return (
        (filters.iceboardId ? item.iceboard_id.includes(filters.iceboardId) : true) &&
        (filters.application ? item.main_application.includes(filters.application) : true) &&
        (filters.incidentMonth ? incidentMonth === filters.incidentMonth : true) &&
        (filters.incidentWeek ? incidentWeek.toString() === filters.incidentWeek : true)
      );
    });
  }, [filters]);

  const columns = useMemo(() => [
    { accessorKey: 'iceboard_id', header: 'Iceboard ID', size: 150, grow: true },
    { accessorKey: 'incident_creation_date', header: 'Incident Creation Date', size: 200, grow: true },
    { accessorKey: 'main_application', header: 'Application', size: 150, grow: true },
    { accessorKey: 'title', header: 'Title', size: 300, grow: true, Cell: ({ cell }) => (
        <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {cell.getValue()}
        </Box>
      ),
    },
  ], []);

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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
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
            <TextField
              select
              label="Iceboard ID"
              aria-label="Iceboard ID Filter"
              role="combobox"
              value={filters.iceboardId}
              onChange={(e) => handleFilterChange('iceboardId', e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                  fontWeight: '500',
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {incidentData.map((item) => (
                <MenuItem key={item.iceboard_id} value={item.iceboard_id}>
                  {item.iceboard_id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Application"
              aria-label="Application Filter"
              role="combobox"
              value={filters.application}
              onChange={(e) => handleFilterChange('application', e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                  fontWeight: '500',
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(incidentData.map((item) => item.main_application))].map((app) => (
                <MenuItem key={app} value={app}>
                  {app}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Incident Month"
              aria-label="Incident Month Filter"
              role="combobox"
              value={filters.incidentMonth}
              onChange={(e) => handleFilterChange('incidentMonth', e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                  fontWeight: '500',
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(incidentData.map((item) =>
                new Date(item.incident_creation_date).toLocaleString('default', { month: 'long' })
              ))].map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Incident Week"
              aria-label="Incident Week Filter"
              role="combobox"
              value={filters.incidentWeek}
              onChange={(e) => handleFilterChange('incidentWeek', e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                  fontWeight: '500',
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(incidentData.map((item) =>
                Math.ceil(new Date(item.incident_creation_date).getDate() / 7).toString()
              ))].map((week) => (
                <MenuItem key={week} value={week}>
                  Week {week}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <MaterialReactTable
          columns={columns}
          data={filteredData}
          enableSorting
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
                <Box
                  sx={{
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    marginBottom: '16px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: '600', marginBottom: '8px' }}>
                    Cause Description:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {row.original.cause_description || 'N/A'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    marginBottom: '16px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: '600', marginBottom: '8px' }}>
                    Communication:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {row.original.communication || 'N/A'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    marginBottom: '16px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: '600', marginBottom: '8px' }}>
                    Impact Description:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {row.original.impact_description || 'N/A'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    marginBottom: '8px',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: '600', marginBottom: '8px' }}>
                    Information on Resolution:
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {row.original.information_on_resolution || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          )}
        />
      </Paper>
    </Box>
  );
};

export default IncidentTable;
