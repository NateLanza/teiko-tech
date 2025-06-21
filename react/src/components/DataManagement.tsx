import React, { useMemo } from 'react';
import { CARD_STYLE, type TrialRecord } from '../core/globals';
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

const SIDEBAR_WIDTH = '300px'; // Width of the sidebar

const COLUMNS = [
  { field: 'sample', headerName: 'Sample', width: 150 },
  { field: 'project', headerName: 'Project', width: 80 },
  { field: 'subject', headerName: 'Subject', width: 80 },
  { field: 'condition', headerName: 'Condition', width: 100 },
  { field: 'age', headerName: 'Age', width: 50 },
  { field: 'sex', headerName: 'Sex', width: 50 },
  { field: 'treatment', headerName: 'Treatment', width: 100 },
  { field: 'response', headerName: 'Response', width: 100 },
  { field: 'sample_type', headerName: 'Sample Type', width: 120 },
  { field: 'time_from_treatment_start', headerName: 'Time from Start', width: 120 },
  { field: 'b_cell', headerName: 'B Cell', width: 80 },
  { field: 'cd8_t_cell', headerName: 'CD8 T Cell', width: 100 },
  { field: 'cd4_t_cell', headerName: 'CD4 T Cell', width: 100 },
  { field: 'nk_cell', headerName: 'NK Cell', width: 100 },
  { field: 'monocyte', headerName: 'Monocyte', width: 100 },
];

export const DataManagement: React.FC<{ data: TrialRecord[] }> = ({ data }) => {
  const dataWithId = useMemo(
    () =>
      data.map((record) => ({
        ...record,
        id: record.sample, // Use sample as the unique ID
      })),
    [data],
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Management
      </Typography>
      {/* Unbelievably, expanding the card in the OTHER BOX pushes this datagrid down, so this is an acceptable fix for these purposes */}
      <Box
        width={`calc(100% - ${SIDEBAR_WIDTH})`}
        display="inline-block"
        position="relative"
        top="-1100px"
      >
        <DataGrid columns={COLUMNS} rows={dataWithId} />
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
