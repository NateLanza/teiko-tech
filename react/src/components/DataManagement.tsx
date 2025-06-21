import React, { useCallback, useMemo, useState } from 'react';
import { CARD_STYLE, isRecordErroneous, type TrialRecord } from '../core/globals';
import {
  Alert,
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
import { createRecord, deleteRecord } from '../core/api';

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

  // The current alert
  const [alert, setAlert] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // State for remove sample form
  const [removeSampleName, setRemoveSampleName] = useState('');

  // State for add sample form
  const [addSampleName, setAddSampleName] = useState('');
  const [project, setProject] = useState('');
  const [subject, setSubject] = useState('');
  const [condition, setCondition] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [treatment, setTreatment] = useState('');
  const [response, setResponse] = useState('');
  const [sampleType, setSampleType] = useState('');
  const [timeFromTreatmentStart, setTimeFromTreatmentStart] = useState('');
  const [bCellCount, setBCellCount] = useState('');
  const [cd8TCellCount, setCd8TCellCount] = useState('');
  const [cd4TCellCount, setCd4TCellCount] = useState('');
  const [nkCellCount, setNkCellCount] = useState('');
  const [monocyteCount, setMonocyteCount] = useState('');

  const handleRemove = useCallback(() => {
    deleteRecord(removeSampleName)
      .then((response) => {
        if (response.status === 200)
          setAlert({ message: 'Sample removed successfully', type: 'success' });
        else setAlert({ message: 'Failed to remove sample', type: 'error' });
      })
      .catch((error) => {
        setAlert({ message: `Error removing sample: ${error.message}`, type: 'error' });
      });
  }, [removeSampleName, setAlert]);

  const handleAdd = useCallback(() => {
    const newRecord: Record<string, string | undefined | null | number> = {
      sample: addSampleName,
      project,
      subject,
      condition,
      age: age ? parseInt(age, 10) : undefined,
      sex,
      treatment,
      response,
      sample_type: sampleType,
      time_from_treatment_start: timeFromTreatmentStart
        ? parseInt(timeFromTreatmentStart, 10)
        : undefined,
      b_cell: bCellCount ? parseInt(bCellCount, 10) : undefined,
      cd8_t_cell: cd8TCellCount ? parseInt(cd8TCellCount, 10) : undefined,
      cd4_t_cell: cd4TCellCount ? parseInt(cd4TCellCount, 10) : undefined,
      nk_cell: nkCellCount ? parseInt(nkCellCount, 10) : undefined,
      monocyte: monocyteCount ? parseInt(monocyteCount, 10) : undefined,
    };

    const error = isRecordErroneous(newRecord);
    if (error) {
      setAlert({ message: `Error adding sample: ${error}`, type: 'error' });
      return;
    } else
      createRecord(newRecord as TrialRecord).then((response) => {
        if (response.status === 201)
          setAlert({ message: 'Sample added successfully', type: 'success' });
        else setAlert({ message: 'Failed to add sample', type: 'error' });
      });
  }, [
    addSampleName,
    project,
    subject,
    condition,
    age,
    sex,
    treatment,
    response,
    sampleType,
    timeFromTreatmentStart,
    bCellCount,
    cd8TCellCount,
    cd4TCellCount,
    nkCellCount,
    monocyteCount,
    setAlert,
  ]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Management
      </Typography>
      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{ marginBottom: '20px' }}
        >
          {alert.message}
        </Alert>
      )}
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
            <TextField
              label="Sample Name"
              variant="outlined"
              fullWidth
              value={removeSampleName}
              onChange={(e) => setRemoveSampleName(e.target.value)}
            />
            <Button variant="contained" color="error" fullWidth onClick={handleRemove}>
              Remove
            </Button>
          </CardContent>
        </Card>
        <Card style={CARD_STYLE}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add Sample
            </Typography>
            <TextField
              label="Sample Name"
              variant="outlined"
              fullWidth
              value={addSampleName}
              onChange={(e) => setAddSampleName(e.target.value)}
            />
            <TextField
              label="Project"
              variant="outlined"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="condition-label">Condition</InputLabel>
              <Select
                labelId="condition-label"
                label="Condition"
                variant="outlined"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <MenuItem value="healthy">Healthy</MenuItem>
                <MenuItem value="carcinoma">Carcinoma</MenuItem>
                <MenuItem value="melanoma">Melanoma</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Age"
              variant="outlined"
              type="number"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="sex-label">Sex</InputLabel>
              <Select
                labelId="sex-label"
                label="Sex"
                variant="outlined"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="treatment-label">Treatment</InputLabel>
              <Select
                labelId="treatment-label"
                label="Treatment"
                variant="outlined"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
              >
                <MenuItem value="miraclib">Miraclib</MenuItem>
                <MenuItem value="phauximab">Phauximab</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="response-label">Response</InputLabel>
              <Select
                labelId="response-label"
                label="Response"
                variant="outlined"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="sample-type-label">Sample Type</InputLabel>
              <Select
                labelId="sample-type-label"
                label="Sample Type"
                variant="outlined"
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value)}
              >
                <MenuItem value="PBMC">PBMC</MenuItem>
                <MenuItem value="WB">WB</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Time from Treatment Start"
              variant="outlined"
              type="number"
              fullWidth
              value={timeFromTreatmentStart}
              onChange={(e) => setTimeFromTreatmentStart(e.target.value)}
            />
            <TextField
              label="B Cell Count"
              variant="outlined"
              type="number"
              fullWidth
              value={bCellCount}
              onChange={(e) => setBCellCount(e.target.value)}
            />
            <TextField
              label="CD8 T Cell Count"
              variant="outlined"
              type="number"
              fullWidth
              value={cd8TCellCount}
              onChange={(e) => setCd8TCellCount(e.target.value)}
            />
            <TextField
              label="CD4 T Cell Count"
              variant="outlined"
              type="number"
              fullWidth
              value={cd4TCellCount}
              onChange={(e) => setCd4TCellCount(e.target.value)}
            />
            <TextField
              label="NK Cell Count"
              variant="outlined"
              type="number"
              fullWidth
              value={nkCellCount}
              onChange={(e) => setNkCellCount(e.target.value)}
            />
            <TextField
              label="Monocyte Count"
              variant="outlined"
              type="number"
              fullWidth
              value={monocyteCount}
              onChange={(e) => setMonocyteCount(e.target.value)}
            />
            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              onClick={handleAdd}
            >
              Add
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
