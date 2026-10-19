export const fmt = (v, d = 1) =>
  v === null || v === undefined || Number.isNaN(v) ? "–" : Number(v).toFixed(d);

export const mean = (values) => {
  const xs = values.filter((v) => v !== null && v !== undefined && !Number.isNaN(v));
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
};

export const SERIES = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];
