import type { TrialRecord } from './globals';

const API_IP = '3.134.233.172'; // Normally this should go in .env but yadda yadda example
const API_URL = `http://${API_IP}:5000/api`;

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

export async function createRecord(
  record: TrialRecord,
): Promise<{ status: number; data: unknown }> {
  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
}

export async function deleteRecord(
  sample: string,
): Promise<{ status: number; data: unknown }> {
  const response = await fetch(`${API_URL}/delete/${sample}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  console.log('Delete response:', data);

  return {
    status: response.status,
    data,
  };
}
