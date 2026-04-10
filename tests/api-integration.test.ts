import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const mockServer = setupServer(
  http.get('/api/data/sources', () => {
    return HttpResponse.json({
      dataSources: [
        { id: '1', name: 'Test Source', type: 'manual', last_sync: null },
      ],
    });
  }),
  http.post('/api/data/sources', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      dataSource: { id: '2', ...body },
    });
  }),
  http.post('/api/data/entries', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      dataUpload: { id: '1', ...body },
    });
  }),
  http.post('/api/import', async ({ request }) => {
    return HttpResponse.json({
      success: true,
      dataUpload: { rowCount: 10, columns: ['col1', 'col2'] },
    });
  })
);

beforeAll(() => mockServer.listen());
afterAll(() => mockServer.close());

describe('Data API Integration', () => {
  describe('GET /api/data/sources', () => {
    it('returns list of data sources', async () => {
      const response = await fetch('/api/data/sources');
      const data = await response.json();
      
      expect(response.ok).toBe(true);
      expect(data.dataSources).toBeDefined();
      expect(Array.isArray(data.dataSources)).toBe(true);
    });
  });

  describe('POST /api/data/sources', () => {
    it('creates a new data source', async () => {
      const newSource = {
        name: 'My Data Source',
        type: 'manual',
        fields: [{ name: 'field1', type: 'string' }],
      };
      
      const response = await fetch('/api/data/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource),
      });
      
      const data = await response.json();
      
      expect(response.ok).toBe(true);
      expect(data.dataSource).toBeDefined();
      expect(data.dataSource.name).toBe('My Data Source');
    });
  });

  describe('POST /api/data/entries', () => {
    it('saves data entries', async () => {
      const entries = {
        dataSourceId: '1',
        rows: [
          { field1: 'value1', field2: 'value2' },
          { field1: 'value3', field2: 'value4' },
        ],
      };
      
      const response = await fetch('/api/data/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      });
      
      const data = await response.json();
      
      expect(response.ok).toBe(true);
      expect(data.dataUpload).toBeDefined();
    });
  });
});

describe('Import API Integration', () => {
  it('handles file upload', async () => {
    const formData = new FormData();
    formData.append('file', new File(['name,age\nJohn,30'], 'test.csv'));
    formData.append('dataSourceId', '1');

    const response = await fetch('/api/import', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(data.dataUpload).toBeDefined();
  });
});

describe('Error Handling', () => {
  it('returns 401 for unauthorized requests', async () => {
    vi.mock('@clerk/nextjs/server', () => ({
      currentUser: vi.fn(() => Promise.resolve(null)),
    }));

    const response = await fetch('/api/data/sources');
    
    expect(response.status).toBe(401);
  });

  it('validates required fields', async () => {
    const response = await fetch('/api/data/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.ok).toBe(false);
  });
});
