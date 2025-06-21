import './App.css';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { Box, createTheme, Tab, ThemeProvider } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import type { TrialRecord } from './core/globals';
import { getAllRecords } from './core/api';
import { DataOverview } from './components/DataOverview';
import { StatisticalAnalysis } from './components/StatisticalAnalysis';
import SubsetAnalysis from './components/SubsetAnalysis';
import { DataManagement } from './components/DataManagement';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [value, setValue] = useState('1');
  const [records, setRecords] = useState<TrialRecord[]>([]);

  // Fetch records from the API when the component mounts
  useEffect(() => {
    getAllRecords().then((data) => {
      setRecords(data);
    });
  }, []);

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Data Management" value="1" color="white" />
              <Tab label="Data Overview" value="2" color="white" />
              <Tab label="Statistical Analysis" value="3" color="white" />
              <Tab label="Data Subset Analysis" value="4" color="white" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <DataManagement data={records} />
          </TabPanel>
          <TabPanel value="2">
            <DataOverview data={records} />
          </TabPanel>
          <TabPanel value="3">
            <StatisticalAnalysis data={records} />
          </TabPanel>
          <TabPanel value="4">
            <SubsetAnalysis data={records} />
          </TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
}

export default App;
