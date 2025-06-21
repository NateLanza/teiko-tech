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

export function isRecordErroneous(
  record: Record<string, string | undefined | null | number>,
): false | string {
  // Check if record exists
  if (!record || typeof record !== 'object') {
    return 'Record must be a valid object';
  }

  // Check required fields
  if (!record.sample || typeof record.sample !== 'string') {
    return 'Sample is required and must be a string';
  }

  if (!record.project || typeof record.project !== 'string') {
    return 'Project is required and must be a string';
  }

  if (!record.sex || (record.sex !== 'M' && record.sex !== 'F')) {
    return 'Sex is required and must be either "M" or "F"';
  }

  // Check required cell count fields
  const requiredCellFields = [
    'b_cell',
    'cd8_t_cell',
    'cd4_t_cell',
    'nk_cell',
    'monocyte',
  ];
  for (const field of requiredCellFields) {
    if (typeof record[field] !== 'number' || record[field] < 0) {
      return `${field} is required and must be a non-negative number`;
    }
  }

  // Check optional string fields
  if (
    record.subject !== null &&
    record.subject !== undefined &&
    typeof record.subject !== 'string'
  ) {
    return 'Subject must be a string or null/undefined';
  }

  // Check enum fields
  if (
    record.condition !== null &&
    record.condition !== undefined &&
    !['healthy', 'carcinoma', 'melanoma'].includes(record.condition.toString())
  ) {
    return 'Condition must be "healthy", "carcinoma", "melanoma", or null/undefined';
  }

  if (
    record.treatment !== null &&
    record.treatment !== undefined &&
    !['miraclib', 'phauximab', 'none'].includes(record.treatment.toString())
  ) {
    return 'Treatment must be "miraclib", "phauximab", "none", or null/undefined';
  }

  if (
    record.response !== null &&
    record.response !== undefined &&
    !['yes', 'no'].includes(record.response.toString())
  ) {
    return 'Response must be "yes", "no", or null/undefined';
  }

  if (
    record.sample_type !== null &&
    record.sample_type !== undefined &&
    !['PBMC', 'WB'].includes(record.sample_type.toString())
  ) {
    return 'Sample type must be "PBMC", "WB", or null/undefined';
  }

  // Check optional number fields
  if (
    record.age !== null &&
    record.age !== undefined &&
    (typeof record.age !== 'number' || record.age < 0)
  ) {
    return 'Age must be a non-negative number or null/undefined';
  }

  if (
    record.time_from_treatment_start !== null &&
    record.time_from_treatment_start !== undefined &&
    (typeof record.time_from_treatment_start !== 'number' ||
      record.time_from_treatment_start < 0)
  ) {
    return 'Time from treatment start must be a non-negative number or null/undefined';
  }

  return false; // No errors found
}
