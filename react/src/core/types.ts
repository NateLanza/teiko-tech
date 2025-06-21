export type TrialRecord = {
  sample: string; // primary key, required
  project?: string | null;
  subject?: string | null;
  condition?: 'healthy' | 'carcinoma' | 'melanoma' | null;
  age?: number | null;
  sex?: 'M' | 'F' | null;
  treatment?: 'miraclib' | 'phauximab' | 'none' | null;
  response?: boolean | null;
  sample_type?: 'PBMC' | 'WB' | null;
  time_from_treatment?: number | null;
  b_cell?: number | null;
  cd8_t_cell?: number | null;
  cd4_t_cell?: number | null;
  nk_cell?: number | null;
  monocyte?: number | null;
};

export type CellName = 'b_cell' | 'cd8_t_cell' | 'cd4_t_cell' | 'nk_cell' | 'monocyte';
