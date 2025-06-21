import './App.css';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { Box, createTheme, Tab, ThemeProvider } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import type { TrialRecord } from './core/types';
import { getAllRecords } from './core/api';
import DataOverview from './components/DataOverview';

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

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Data Overview" value="1" color="white" />
              <Tab label="Item Two" value="2" color="white" />
              <Tab label="Item Three" value="3" color="white" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <DataOverview data={records} />
          </TabPanel>
          <TabPanel value="2">Part 3</TabPanel>
          <TabPanel value="3">Part 4</TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
}

export default App;
