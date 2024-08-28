// src/components/IncidentTable.js

import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Collapse, Typography } from '@mui/material';

const IncidentTable = ({ filteredData }) => {
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

  return (
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
  );
};

export default IncidentTable;
