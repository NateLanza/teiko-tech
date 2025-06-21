import React, { useMemo, useState } from 'react';
import type { TrialRecord } from '../core/globals';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

const COLUMNS = [
  { field: 'sample', headerName: 'Sample', width: 150 },
  { field: 'subject', headerName: 'Subject', width: 100 },
  { field: 'project', headerName: 'Project', width: 80 },
  { field: 'age', headerName: 'Age', width: 80 },
  { field: 'sex', headerName: 'Sex', width: 50 },
  { field: 'response', headerName: 'Response', width: 100 },
  { field: 'b_cell', headerName: 'B Cell', width: 80 },
  { field: 'cd4_t_cell', headerName: 'CD4 T Cell', width: 100 },
  { field: 'cd8_t_cell', headerName: 'CD8 T Cell', width: 100 },
  { field: 'nk_cell', headerName: 'NK Cell', width: 100 },
  { field: 'monocyte', headerName: 'Monocyte', width: 100 },
];

const SubsetAnalysis: React.FC<{ data: TrialRecord[] }> = ({ data }) => {
  const projectNames: string[] = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .filter((record) => record.project)
            .map((record) => record.project as string),
        ),
      ),
    [data],
  );

  const [projects, setProjects] = useState<string[]>(projectNames);
  const [responses, setResponses] = useState(['yes' as const, 'no' as const]);
  const [sex, setSex] = useState(['M' as const, 'F' as const]);

  const filteredData = useMemo(
    () =>
      data
        .filter(
          (record) =>
            record.condition === 'melanoma' &&
            record.sample_type === 'PBMC' &&
            record.treatment === 'miraclib' &&
            record.time_from_treatment_start === 0 &&
            projects.includes(record.project) &&
            record.response &&
            responses.includes(record.response) &&
            sex.includes(record.sex),
        )
        .map((record) => ({
          ...record,
          id: record.sample, // DataGrid requires a unique id field
        })),
    [data, projects, responses, sex],
  );

  const dataCount = useMemo(() => filteredData.length, [filteredData]);

  return (
    <div>
      <Typography variant="h4">Analyzing Subset of {dataCount} Records</Typography>
      <Typography variant="subtitle1" gutterBottom>
        This subset is filtered to PMBC samples from melanoma patients treated with
        Miraclib, with a time from treatment start of 0 days.
      </Typography>
      <Box width="75%" display="inline-block">
        <DataGrid
          // For reasons I cannot fathom nor believe, expanding the height of the Card in the other Box
          // pushes the DataGrid down (even though they're unconnected...) so we get to manually fix that :D
          style={{ position: 'relative', top: '-235px' }}
          rows={filteredData}
          columns={COLUMNS}
        />
      </Box>
      <Box width="25%" display="inline-block">
        <Card
          style={{
            margin: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Filters
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="project-select-label">Project</InputLabel>
              <Select
                labelId="project-select-label"
                multiple
                value={projects}
                // This keeps the outline of the box from going thru the above input label (which is also necesary) lol
                label="Project"
                onChange={(e) => setProjects([...e.target.value])} // Destructure/restructure converts string | string[] to string[]
                renderValue={(selected) => selected.join(', ')}
              >
                {projectNames.map((project) => (
                  <MenuItem key={project} value={project}>
                    {project}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginTop: '1em' }}>
              <InputLabel id="response-select-label">Response</InputLabel>
              <Select
                labelId="response-select-label"
                multiple
                value={responses}
                label="Response"
                onChange={(e) => setResponses([...e.target.value] as ('yes' | 'no')[])}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginTop: '1em' }}>
              <InputLabel id="sex-select-label">Sex</InputLabel>
              <Select
                labelId="sex-select-label"
                multiple
                value={sex}
                label="Sex"
                onChange={(e) => setSex([...e.target.value] as ('M' | 'F')[])}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default SubsetAnalysis;
