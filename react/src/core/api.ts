import type { TrialRecord } from './types';

const API_URL = 'http://localhost:5000/api';

export async function getAllRecords(): Promise<TrialRecord[]> {
  return (
    fetch(`${API_URL}/list`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      // I normally would do some data validation here
      .then((data) => data as TrialRecord[])
  );
}
