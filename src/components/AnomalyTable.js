// src/components/AnomalyTable.js

import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box } from '@mui/material';

const AnomalyTable = ({ filteredData }) => {
  const columns = useMemo(() => [
    { accessorKey: 'iceboard_id', header: 'Iceboard ID', size: 150 },
    { accessorKey: 'anomaly_detection_date', header: 'Anomaly Detection Date', size: 200 },
    { accessorKey: 'main_application', header: 'Application', size: 150 },
    { accessorKey: 'metric_name', header: 'Metric Name', size: 150 },
    { accessorKey: 'metric_family', header: 'Metric Family', size: 150 },
    { accessorKey: 'host_anomaly_count', header: 'Host Anomaly Count', size: 150 },
  ], []);

  return (
    <MaterialReactTable
      columns={columns}
      data={filteredData.anomalyData}
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
    />
  );
};

export default AnomalyTable;
