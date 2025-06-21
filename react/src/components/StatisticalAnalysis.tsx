import React, { useMemo } from 'react';
import { totalCellCount, type TrialRecord } from '../core/globals';
import { VegaLite } from 'react-vega';

const PLOT_WIDTH = 800;
const PLOT_HEIGHT = 250;

function createBoxplotSpec(title: string, numericalField: string = 'value') {
  return {
    title,
    width: PLOT_WIDTH,
    height: PLOT_HEIGHT,
    data: {
      name: 'source',
    },
    transform: [
      {
        calculate: "datum.response ? 'Yes' : 'No'",
        as: 'responseLabel',
      },
    ],
    mark: {
      type: 'boxplot',
      size: 60,
    },
    encoding: {
      x: {
        field: numericalField,
        type: 'quantitative',
        title: 'Value',
      },
      y: {
        field: 'responseLabel',
        type: 'nominal',
        title: 'Response',
        scale: {
          domain: ['No', 'Yes'],
        },
      },
      color: {
        field: 'responseLabel',
        type: 'nominal',
        scale: {
          domain: ['No', 'Yes'],
          range: ['#e74c3c', '#2ecc71'],
        },
        legend: null,
      },
    },
  };
}

const bCellSpec = createBoxplotSpec(
  'B Cell Relative Frequencies (%), Responders vs Non-Responders',
);

const cd8TCellSpec = createBoxplotSpec(
  'CD8 T Cell Relative Frequencies (%), Responders vs Non-Responders',
);

const cd4TCellSpec = createBoxplotSpec(
  'CD4 T Cell Relative Frequencies (%), Responders vs Non-Responders',
);

const nkCellSpec = createBoxplotSpec(
  'NK Cell Relative Frequencies (%), Responders vs Non-Responders',
);

const monocyteSpec = createBoxplotSpec(
  'Monocyte Relative Frequencies (%), Responders vs Non-Responders',
);

type PatientVegaElement = {
  value: number;
  response: boolean;
};

export const StatisticalAnalysis: React.FC<{ data: TrialRecord[] }> = ({ data }) => {
  const filteredData: (Omit<TrialRecord, 'response'> & {
    response: 'yes' | 'no';
    totalCount: number;
  })[] = useMemo(
    () =>
      data
        .filter(
          (record) =>
            record.sample_type === 'PBMC' &&
            record.condition === 'melanoma' &&
            record.treatment === 'miraclib' &&
            record.response,
        )
        .map((record) => ({
          ...record,
          response: record.response as 'yes' | 'no', // Cast is safe bc we filtered for response
          totalCount: totalCellCount(record),
        })),
    [data],
  );

  const bCellData: PatientVegaElement[] = useMemo(
    () =>
      filteredData.map((record) => ({
        value: (record.b_cell / record.totalCount) * 100,
        response: record.response === 'yes',
      })),
    [filteredData],
  );

  console.log(bCellData);

  const cd8TCellData: PatientVegaElement[] = useMemo(
    () =>
      filteredData.map((record) => ({
        value: (record.cd8_t_cell / record.totalCount) * 100,
        response: record.response === 'yes',
      })),
    [filteredData],
  );

  const cd4TCellData: PatientVegaElement[] = useMemo(
    () =>
      filteredData.map((record) => ({
        value: (record.cd4_t_cell / record.totalCount) * 100,
        response: record.response === 'yes',
      })),
    [filteredData],
  );

  const nkCellData: PatientVegaElement[] = useMemo(
    () =>
      filteredData.map((record) => ({
        value: (record.nk_cell / record.totalCount) * 100,
        response: record.response === 'yes',
      })),
    [filteredData],
  );

  const monocyteData: PatientVegaElement[] = useMemo(
    () =>
      filteredData.map((record) => ({
        value: (record.monocyte / record.totalCount) * 100,
        response: record.response === 'yes',
      })),
    [filteredData],
  );

  return (
    <div>
      <h2>Statistical Analysis</h2>
      <VegaLite actions={false} spec={bCellSpec} data={{ source: bCellData }} />
      <VegaLite actions={false} spec={cd8TCellSpec} data={{ source: cd8TCellData }} />
      <VegaLite actions={false} spec={cd4TCellSpec} data={{ source: cd4TCellData }} />
      <VegaLite actions={false} spec={nkCellSpec} data={{ source: nkCellData }} />
      <VegaLite actions={false} spec={monocyteSpec} data={{ source: monocyteData }} />
    </div>
  );
};
