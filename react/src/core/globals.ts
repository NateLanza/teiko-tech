export type TrialRecord = {
  sample: string; // primary key, required
  project: string;
  subject?: string | null;
  condition?: 'healthy' | 'carcinoma' | 'melanoma' | null;
  age?: number | null;
  sex: 'M' | 'F';
  treatment?: 'miraclib' | 'phauximab' | 'none' | null;
  response?: 'yes' | 'no' | null;
  sample_type?: 'PBMC' | 'WB' | null;
  time_from_treatment_start?: number | null;
  b_cell: number;
  cd8_t_cell: number;
  cd4_t_cell: number;
  nk_cell: number;
  monocyte: number;
};

export type CellName = 'b_cell' | 'cd8_t_cell' | 'cd4_t_cell' | 'nk_cell' | 'monocyte';

export const CELL_NAMES: CellName[] = [
  'b_cell',
  'cd8_t_cell',
  'cd4_t_cell',
  'nk_cell',
  'monocyte',
];

export function totalCellCount(record: TrialRecord): number {
  return CELL_NAMES.reduce((sum, cell) => sum + (record[cell] || 0), 0);
}

export const CARD_STYLE = {
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '8px',
};
