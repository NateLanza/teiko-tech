// Statistical testing utilities for immune cell frequency analysis

export type MannWhitneyResult = {
  uStatistic: number;
  zScore: number;
  pValue: number;
  n1: number;
  n2: number;
};

export type EffectSizeResult = {
  cohensD: number;
  rankBiserialCorrelation: number;
  interpretation: string;
};

export type StatisticalTestResult = {
  pValue: number;
  isSignificant: boolean;
  effectSize: EffectSizeResult;
  interpretation: string;
  sampleSizes: {
    responders: number;
    nonResponders: number;
  };
};

/**
 * Standard normal cumulative distribution function approximation
 */
function standardNormalCDF(z: number): number {
  // Using Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);

  const t = 1 / (1 + p * z);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

  return 0.5 * (1 + sign * y);
}

/**
 * Performs Mann-Whitney U test (Wilcoxon rank-sum test)
 * Tests if two independent samples come from populations with different distributions
 */
export function mannWhitneyU(group1: number[], group2: number[]): MannWhitneyResult {
  const n1 = group1.length;
  const n2 = group2.length;

  if (n1 === 0 || n2 === 0) {
    throw new Error('Both groups must contain at least one observation');
  }

  // Combine and rank all observations
  const combined = [
    ...group1.map((val) => ({ value: val, group: 1 })),
    ...group2.map((val) => ({ value: val, group: 2 })),
  ];

  // Sort by value
  combined.sort((a, b) => a.value - b.value);

  // Assign ranks (handling ties with average rank)
  const ranks: number[] = [];
  let i = 0;

  while (i < combined.length) {
    let j = i;
    // Find all tied values
    while (j < combined.length && combined[j].value === combined[i].value) {
      j++;
    }

    // Assign average rank to all tied values
    const avgRank = (i + j + 1) / 2;
    for (let k = i; k < j; k++) {
      ranks[k] = avgRank;
    }
    i = j;
  }

  // Calculate rank sums
  let R1 = 0; // Sum of ranks for group 1
  for (let i = 0; i < combined.length; i++) {
    if (combined[i].group === 1) {
      R1 += ranks[i];
    }
  }

  // Calculate U statistics
  const U1 = R1 - (n1 * (n1 + 1)) / 2;
  const U2 = n1 * n2 - U1;
  const U = Math.min(U1, U2);

  // Calculate z-score for large samples (normal approximation)
  const meanU = (n1 * n2) / 2;
  const stdU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);

  // Continuity correction
  const zScore = Math.abs(U - meanU - 0.5) / stdU;

  // Two-tailed p-value using normal approximation
  const pValue = 2 * (1 - standardNormalCDF(zScore));

  return {
    uStatistic: U,
    zScore,
    pValue,
    n1,
    n2,
  };
}

/**
 * Calculates effect sizes for the difference between two groups
 */
export function calculateEffectSize(
  group1: number[],
  group2: number[],
): EffectSizeResult {
  const n1 = group1.length;
  const n2 = group2.length;

  // Cohen's d
  const mean1 = group1.reduce((sum, val) => sum + val, 0) / n1;
  const mean2 = group2.reduce((sum, val) => sum + val, 0) / n2;

  const var1 = group1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1);
  const var2 = group2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1);

  const pooledSD = Math.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2));
  const cohensD = Math.abs(mean1 - mean2) / pooledSD;

  // Rank-biserial correlation (effect size for Mann-Whitney U)
  const mannWhitneyResult = mannWhitneyU(group1, group2);
  const rankBiserialCorrelation = (2 * mannWhitneyResult.uStatistic) / (n1 * n2) - 1;

  // Interpret effect size
  let interpretation: string;
  if (cohensD < 0.2) {
    interpretation = 'negligible';
  } else if (cohensD < 0.5) {
    interpretation = 'small';
  } else if (cohensD < 0.8) {
    interpretation = 'medium';
  } else {
    interpretation = 'large';
  }

  return {
    cohensD,
    rankBiserialCorrelation: Math.abs(rankBiserialCorrelation),
    interpretation,
  };
}

/**
 * Interprets statistical test results in biological context
 */
export function interpretResults(
  pValue: number,
  effectSize: EffectSizeResult,
  cellName: string,
): string {
  const isSignificant = pValue < 0.05;
  const { rankBiserialCorrelation, interpretation, cohensD } = effectSize;

  let result = '';

  if (isSignificant) {
    result += `There is a statistically significant difference in ${cellName} frequencies between responders and non-responders (p = ${pValue.toFixed(4)}). `;
  } else {
    result += `There is no statistically significant difference in ${cellName} frequencies between responders and non-responders (p = ${pValue.toFixed(4)}). `;
  }

  result += `The effect size is ${interpretation} (rank-biserial correlation = ${rankBiserialCorrelation.toFixed(3)}; Cohen's D = ${cohensD.toFixed(2)}), `;

  if (isSignificant && cohensD >= 0.5) {
    result +=
      'suggesting a meaningful biological difference that warrants further investigation.';
  } else if (isSignificant && cohensD < 0.5) {
    result +=
      'but the biological significance may be limited due to the small effect size.';
  } else {
    result +=
      'indicating that any observed differences are likely due to random variation.';
  }

  return result;
}

/**
 * Main function to test significance of immune cell frequency differences
 */
export function testSignificance(
  responderScores: number[],
  nonResponderScores: number[],
  cellName: string,
): StatisticalTestResult {
  if (responderScores.length === 0 || nonResponderScores.length === 0) {
    throw new Error('Both groups must contain at least one observation');
  }

  // Perform Mann-Whitney U test
  const mannWhitneyResult = mannWhitneyU(responderScores, nonResponderScores);

  // Calculate effect size
  const effectSize = calculateEffectSize(responderScores, nonResponderScores);

  // Generate interpretation
  const interpretation = interpretResults(mannWhitneyResult.pValue, effectSize, cellName);

  return {
    pValue: mannWhitneyResult.pValue,
    isSignificant: mannWhitneyResult.pValue < 0.05,
    effectSize,
    interpretation,
    sampleSizes: {
      responders: responderScores.length,
      nonResponders: nonResponderScores.length,
    },
  };
}
