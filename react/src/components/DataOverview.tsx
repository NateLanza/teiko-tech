import React, { useMemo } from 'react';
import {
  CARD_STYLE,
  CELL_NAMES,
  totalCellCount,
  type CellName,
  type TrialRecord,
} from '../core/globals';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

type SingleFrequencyRow = {
  id: string; // Required for DataGrid
  sample: string;
  totalCount: number;
  population: CellName;
  count: number;
  percentage: string;
};

const SIDEBAR_WIDTH = '300px'; // Width of the sidebar

const SINGLE_FREQUENCY_COLUMNS = [
  { field: 'sample', headerName: 'Sample', width: 150 },
  { field: 'totalCount', headerName: 'Total Count', width: 150 },
  { field: 'population', headerName: 'Population', width: 150 },
  { field: 'count', headerName: 'Count', width: 150 },
  { field: 'percentage', headerName: 'Relative Frequency', width: 150 },
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
              percentage: Math.round((count / totalCount) * 10000) / 100 + '%', // Round to two decimal places
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
      {/* Unbelievably, expanding the card in the OTHER BOX pushes this datagrid down, so this is an acceptable fix for these purposes */}
      <Box
        width={`calc(100% - ${SIDEBAR_WIDTH})`}
        display="inline-block"
        position="relative"
        top="-1100px"
      >
        <DataGrid columns={SINGLE_FREQUENCY_COLUMNS} rows={singleRows} />
      </Box>
      <Box width={SIDEBAR_WIDTH} display="inline-block">
        <Card style={CARD_STYLE}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Remove Sample
            </Typography>
            <TextField label="Sample Name" variant="outlined" fullWidth />
            <Button variant="contained" color="error" fullWidth>
              Remove
            </Button>
          </CardContent>
        </Card>
        <Card style={CARD_STYLE}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add Sample
            </Typography>
            <TextField label="Sample Name" variant="outlined" fullWidth />
            <TextField label="Project" variant="outlined" fullWidth />
            <TextField label="Subject" variant="outlined" fullWidth />
            <FormControl fullWidth>
              <InputLabel id="condition-label">Condition</InputLabel>
              <Select labelId="condition-label" label="Condition" variant="outlined">
                <MenuItem value="healthy">Healthy</MenuItem>
                <MenuItem value="carcinoma">Carcinoma</MenuItem>
                <MenuItem value="melanoma">Melanoma</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Age" variant="outlined" type="number" fullWidth />
            <FormControl fullWidth>
              <InputLabel id="sex-label">Sex</InputLabel>
              <Select labelId="sex-label" label="Sex" variant="outlined">
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="treatment-label">Treatment</InputLabel>
              <Select labelId="treatment-label" label="Treatment" variant="outlined">
                <MenuItem value="miraclib">Miraclib</MenuItem>
                <MenuItem value="phauximab">Phauximab</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="response-label">Response</InputLabel>
              <Select labelId="response-label" label="Response" variant="outlined">
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="sample-type-label">Sample Type</InputLabel>
              <Select labelId="sample-type-label" label="Sample Type" variant="outlined">
                <MenuItem value="PBMC">PBMC</MenuItem>
                <MenuItem value="WB">WB</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Time from Treatment Start"
              variant="outlined"
              type="number"
              fullWidth
            />
            <TextField label="B Cell Count" variant="outlined" type="number" fullWidth />
            <TextField
              label="CD8 T Cell Count"
              variant="outlined"
              type="number"
              fullWidth
            />
            <TextField
              label="CD4 T Cell Count"
              variant="outlined"
              type="number"
              fullWidth
            />
            <TextField label="NK Cell Count" variant="outlined" type="number" fullWidth />
            <TextField
              label="Monocyte Count"
              variant="outlined"
              type="number"
              fullWidth
            />
            <Button variant="contained" color="success" size="large" fullWidth>
              Add
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DataOverview;
