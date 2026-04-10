export interface ParsedData {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  columnCount: number;
}

export function parseCSV(content: string): ParsedData {
  const lines = content.trim().split('\n');
  if (lines.length === 0) {
    return { columns: [], rows: [], rowCount: 0, columnCount: 0 };
  }

  const columns = lines[0].split(',').map((col) => col.trim().replace(/^["']|["']$/g, ''));
  const rows: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((val) => val.trim().replace(/^["']|["']$/g, ''));
    const row: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      const value = values[index] || '';
      const numValue = Number(value);
      row[col] = isNaN(numValue) ? value : numValue;
    });
    rows.push(row);
  }

  return {
    columns,
    rows,
    rowCount: rows.length,
    columnCount: columns.length,
  };
}

export function parseExcel(rows: string[][]): ParsedData {
  if (rows.length === 0) {
    return { columns: [], rows: [], rowCount: 0, columnCount: 0 };
  }

  const columns = rows[0];
  const dataRows = rows.slice(1);
  const parsedRows: Record<string, unknown>[] = [];

  for (const values of dataRows) {
    const row: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      const value = values[index] || '';
      const numValue = Number(value);
      row[col] = isNaN(numValue) ? value : numValue;
    });
    parsedRows.push(row);
  }

  return {
    columns,
    rows: parsedRows,
    rowCount: parsedRows.length,
    columnCount: columns.length,
  };
}

export function detectColumnType(values: unknown[]): 'string' | 'number' | 'date' | 'boolean' {
  const nonEmpty = values.filter((v) => v !== '' && v !== null && v !== undefined);
  if (nonEmpty.length === 0) return 'string';

  const isNumber = nonEmpty.every((v) => !isNaN(Number(v)));
  if (isNumber) return 'number';

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const isDate = nonEmpty.every((v) => datePattern.test(String(v)));
  if (isDate) return 'date';

  const boolValues = ['true', 'false', 'yes', 'no', '1', '0'];
  const isBoolean = nonEmpty.every((v) => boolValues.includes(String(v).toLowerCase()));
  if (isBoolean) return 'boolean';

  return 'string';
}

export function inferColumnTypes(data: ParsedData): Record<string, string> {
  const types: Record<string, string> = {};
  for (const col of data.columns) {
    const values = data.rows.map((row) => row[col]);
    types[col] = detectColumnType(values);
  }
  return types;
}

export function convertToDataSourceFormat(
  data: ParsedData,
  sourceName: string
): { name: string; type: string; config: Record<string, unknown> } {
  const columnTypes = inferColumnTypes(data);
  return {
    name: sourceName,
    type: 'csv',
    config: {
      columns: data.columns,
      columnTypes,
      sampleData: data.rows.slice(0, 100),
      rowCount: data.rowCount,
      columnCount: data.columnCount,
    },
  };
}
