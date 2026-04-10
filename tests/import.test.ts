import { describe, it, expect } from 'vitest';
import { parseCSV, parseExcel, detectColumnType, inferColumnTypes, convertToDataSourceFormat } from '@/lib/import';

describe('CSV/Excel Import', () => {
  describe('parseCSV', () => {
    it('should parse simple CSV', () => {
      const csv = 'name,age,city\nJohn,30,NYC\nJane,25,LA';
      const result = parseCSV(csv);
      expect(result.columns).toEqual(['name', 'age', 'city']);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].name).toBe('John');
      expect(result.rows[0].age).toBe(30);
    });

    it('should handle empty CSV', () => {
      const result = parseCSV('');
      expect(result.columns.length).toBeGreaterThanOrEqual(0);
      expect(result.rows).toEqual([]);
    });

    it('should convert numbers', () => {
      const csv = 'value\n100\n200';
      const result = parseCSV(csv);
      expect(result.rows[0].value).toBe(100);
      expect(result.rows[1].value).toBe(200);
    });

    it('should handle quoted values', () => {
      const csv = 'name\n"John Doe"';
      const result = parseCSV(csv);
      expect(result.rows[0].name).toBe('John Doe');
    });
  });

  describe('parseExcel', () => {
    it('should parse 2D array', () => {
      const data = [
        ['name', 'age'],
        ['John', '30'],
        ['Jane', '25'],
      ];
      const result = parseExcel(data);
      expect(result.columns).toEqual(['name', 'age']);
      expect(result.rows).toHaveLength(2);
    });

    it('should handle empty array', () => {
      const result = parseExcel([]);
      expect(result.columns).toEqual([]);
      expect(result.rows).toEqual([]);
    });
  });

  describe('detectColumnType', () => {
    it('should detect number type', () => {
      expect(detectColumnType([1, 2, 3])).toBe('number');
    });

    it('should detect string type', () => {
      expect(detectColumnType(['a', 'b', 'c'])).toBe('string');
    });

    it('should detect date type', () => {
      expect(detectColumnType(['2024-01-01', '2024-01-02'])).toBe('date');
    });

    it('should detect boolean type', () => {
      expect(detectColumnType(['true', 'false', 'yes'])).toBe('boolean');
    });

    it('should default to string', () => {
      expect(detectColumnType([])).toBe('string');
      expect(detectColumnType([''])).toBe('string');
    });
  });

  describe('inferColumnTypes', () => {
    it('should infer types for all columns', () => {
      const data = {
        columns: ['name', 'age', 'active', 'date'],
        rows: [
          { name: 'John', age: 30, active: 'true', date: '2024-01-01' },
          { name: 'Jane', age: 25, active: 'false', date: '2024-01-02' },
        ],
        rowCount: 2,
        columnCount: 4,
      };
      const types = inferColumnTypes(data);
      expect(types.name).toBe('string');
      expect(types.age).toBe('number');
      expect(types.active).toBe('boolean');
      expect(types.date).toBe('date');
    });
  });

  describe('convertToDataSourceFormat', () => {
    it('should convert to data source format', () => {
      const data = {
        columns: ['name', 'age'],
        rows: [{ name: 'John', age: 30 }],
        rowCount: 1,
        columnCount: 2,
      };
      const result = convertToDataSourceFormat(data, 'Test Source');
      expect(result.name).toBe('Test Source');
      expect(result.type).toBe('csv');
      expect(result.config.columns).toEqual(['name', 'age']);
    });
  });
});
