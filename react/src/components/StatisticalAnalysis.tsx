import React, { useMemo } from 'react';
import { totalCellCount, type TrialRecord } from '../core/globals';
import { VegaLite } from 'react-vega';
import { testSignificance } from '../core/stats-tests';

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
        title: 'Relative Frequency (%)',
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

  // We use the Mann-Whitney U test to compare the distributions of responders and non-responders
  const bCellResult = useMemo(() => {
    const responders = bCellData.filter((d) => d.response).map((d) => d.value);
    const nonResponders = bCellData.filter((d) => !d.response).map((d) => d.value);
    return testSignificance(responders, nonResponders, 'B cell');
  }, [bCellData]);

  const cd8TCellResult = useMemo(() => {
    const responders = cd8TCellData.filter((d) => d.response).map((d) => d.value);
    const nonResponders = cd8TCellData.filter((d) => !d.response).map((d) => d.value);
    return testSignificance(responders, nonResponders, 'CD8 T cell');
  }, [cd8TCellData]);

  const cd4TCellResult = useMemo(() => {
    const responders = cd4TCellData.filter((d) => d.response).map((d) => d.value);
    const nonResponders = cd4TCellData.filter((d) => !d.response).map((d) => d.value);
    return testSignificance(responders, nonResponders, 'CD4 T cell');
  }, [cd4TCellData]);

  const nkCellResult = useMemo(() => {
    const responders = nkCellData.filter((d) => d.response).map((d) => d.value);
    const nonResponders = nkCellData.filter((d) => !d.response).map((d) => d.value);
    return testSignificance(responders, nonResponders, 'NK cell');
  }, [nkCellData]);

  const monocyteResult = useMemo(() => {
    const responders = monocyteData.filter((d) => d.response).map((d) => d.value);
    const nonResponders = monocyteData.filter((d) => !d.response).map((d) => d.value);
    return testSignificance(responders, nonResponders, 'Monocyte');
  }, [monocyteData]);

  return (
    <div>
      <h2>Statistical Analysis</h2>
      <p>{bCellResult.interpretation}</p>
      <p>{cd8TCellResult.interpretation}</p>
      <p>{cd4TCellResult.interpretation}</p>
      <p>{nkCellResult.interpretation}</p>
      <p>{monocyteResult.interpretation}</p>
      <VegaLite
        actions={false}
        style={{ margin: '5px' }}
        spec={bCellSpec}
        data={{ source: bCellData }}
      />
      <VegaLite
        actions={false}
        style={{ margin: '5px' }}
        spec={cd8TCellSpec}
        data={{ source: cd8TCellData }}
      />
      <VegaLite
        actions={false}
        style={{ margin: '5px' }}
        spec={cd4TCellSpec}
        data={{ source: cd4TCellData }}
      />
      <VegaLite
        actions={false}
        style={{ margin: '5px' }}
        spec={nkCellSpec}
        data={{ source: nkCellData }}
      />
      <VegaLite
        actions={false}
        style={{ margin: '5px' }}
        spec={monocyteSpec}
        data={{ source: monocyteData }}
      />
    </div>
  );
};
