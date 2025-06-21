import React, { useMemo } from 'react';
import type { CellName, TrialRecord } from '../core/types';
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

type FrequencySummaryRow = {
  sample: string;
  bCellPct: number;
  cd8TCellPct: number;
  cd4TCellPct: number;
  nkCellPct: number;
  monocytePct: number;
  totalCount: number;
};

const DataOverview: React.FC<{ data: TrialRecord[] }> = ({ data }) => {
  const singleRows = useMemo(() => {
    const rows: SingleFrequencyRow[] = [];
    const cellNames: CellName[] = [
      'b_cell',
      'cd8_t_cell',
      'cd4_t_cell',
      'nk_cell',
      'monocyte',
    ];

    // Iterate through each record
    data.forEach((record) => {
      const totalCount = cellNames.reduce((sum, cell) => sum + (record[cell] || 0), 0);
      console.log(`Processing sample: ${record.sample}, Total Count: ${totalCount}`);
      if (totalCount > 0) {
        cellNames.forEach((cell) => {
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

  console.log('Single Frequency Rows:', singleRows);

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
