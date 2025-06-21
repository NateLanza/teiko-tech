import React, { useMemo } from 'react';
import type { TrialRecord } from '../core/globals';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const COLUMNS = [
  { field: 'sample', headerName: 'Sample', width: 150 },
  { field: 'subject', headerName: 'Subject', width: 100 },
  { field: 'age', headerName: 'Age', width: 80 },
  { field: 'sex', headerName: 'Sex', width: 50 },
  { field: 'response', headerName: 'Response', width: 100 },
  { field: 'b_cell', headerName: 'B Cell', width: 100 },
  { field: 'cd8_t_cell', headerName: 'CD8 T Cell', width: 120 },
  { field: 'nk_cell', headerName: 'NK Cell', width: 100 },
  { field: 'monocyte', headerName: 'Monocyte', width: 110 },
];

const SubsetAnalysis: React.FC<{ data: TrialRecord[] }> = ({ data }) => {
  const filteredData = useMemo(
    () =>
      data
        .filter(
          (record) =>
            record.condition === 'melanoma' &&
            record.sample_type === 'PBMC' &&
            record.treatment === 'miraclib' &&
            record.time_from_treatment_start === 0,
        )
        .map((record) => ({
          ...record,
          id: record.sample, // DataGrid requires a unique id field
        })),
    [data],
  );

  return (
    <div>
      <h2>Subset Analysis</h2>
      <Box width="50%">
        <DataGrid rows={filteredData} columns={COLUMNS} />
      </Box>
    </div>
  );
};

export default SubsetAnalysis;
