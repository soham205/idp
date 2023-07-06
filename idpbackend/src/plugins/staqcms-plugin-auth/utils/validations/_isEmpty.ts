export const isEmpty = (value: unknown | unknown[]) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && (Object.keys(value).length === 0 || (Array.isArray(value) && value.length === 0))) ||
  (typeof value === 'string' && value.trim().length === 0);
