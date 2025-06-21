import React, { useMemo } from 'react';
import {
  CELL_NAMES,
  totalCellCount,
  type CellName,
  type TrialRecord,
} from '../core/globals';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

type SingleFrequencyRow = {
  id: string; // Required for DataGrid
  sample: string;
  totalCount: number;
  population: CellName;
  count: number;
  percentage: number;
};

const SINGLE_FREQUENCY_COLUMNS = [
  { field: 'sample', headerName: 'Sample', width: 150 },
  { field: 'totalCount', headerName: 'Total Count', width: 150 },
  { field: 'population', headerName: 'Population', width: 150 },
  { field: 'count', headerName: 'Count', width: 150 },
  { field: 'percentage', headerName: 'Percentage (%)', width: 150 },
];

const DataOverview: React.FC<{ data: TrialRecord[] }> = ({ data }) => {
  const singleRows = useMemo(() => {
    const rows: SingleFrequencyRow[] = [];

    // Iterate through each record
    data.forEach((record) => {
      const totalCount = totalCellCount(record);
      if (totalCount > 0) {
        CELL_NAMES.forEach((cell) => {
          const count = record[cell] || 0;
          if (count > 0) {
            rows.push({
              id: `${record.sample}-${cell}`,
              sample: record.sample,
              totalCount,
              population: cell,
              count,
              percentage: Math.round((count / totalCount) * 10000) / 100, // Round to two decimal places
            });
          }
        });
      }
    });

    return rows;
  }, [data]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Overview
      </Typography>
      <DataGrid columns={SINGLE_FREQUENCY_COLUMNS} rows={singleRows} />
    </Box>
  );
};

export default DataOverview;
