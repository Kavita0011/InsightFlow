import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockQueryBuilder = {
  select: vi.fn(() => mockQueryBuilder),
  eq: vi.fn(() => mockQueryBuilder),
  single: vi.fn(() => ({ data: null, error: null })),
  order: vi.fn(() => mockQueryBuilder),
  insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: null, error: null })) })) })),
  update: vi.fn(() => ({ eq: vi.fn(() => mockQueryBuilder) })),
  delete: vi.fn(() => ({
    eq: vi.fn().mockReturnThis(),
  })),
};

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => mockQueryBuilder),
  },
}));

vi.mock('uuid', () => ({
  v4: () => 'test-uuid-123',
}));

describe('API - Dashboards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get dashboards for org', async () => {
    const { getDashboards } = await import('@/lib/api');
    const dashboards = await getDashboards('org-123');
    expect(dashboards).toEqual([]);
  });

  it('should create dashboard', async () => {
    const { createDashboard } = await import('@/lib/api');
    const dashboard = await createDashboard('org-123', { name: 'Test Dashboard' });
    expect(dashboard).toBeNull();
  });

  it('should get dashboard by id', async () => {
    const { getDashboard } = await import('@/lib/api');
    const dashboard = await getDashboard('dash-123', 'org-123');
    expect(dashboard).toBeNull();
  });

  it('should update dashboard', async () => {
    const { updateDashboard } = await import('@/lib/api');
    const dashboard = await updateDashboard('dash-123', 'org-123', { name: 'Updated' });
    expect(dashboard).toBeNull();
  });

  it('should delete dashboard', async () => {
    const { deleteDashboard } = await import('@/lib/api');
    await deleteDashboard('dash-123', 'org-123');
    expect(mockQueryBuilder.delete).toHaveBeenCalled();
  });
});

describe('API - Charts', () => {
  it('should get charts for dashboard', async () => {
    const { getCharts } = await import('@/lib/api');
    const charts = await getCharts('dash-123');
    expect(charts).toEqual([]);
  });

  it('should create chart', async () => {
    const { createChart } = await import('@/lib/api');
    const chart = await createChart('dash-123', { type: 'bar', title: 'Test Chart' });
    expect(chart).toBeNull();
  });

  it('should update chart', async () => {
    const { updateChart } = await import('@/lib/api');
    const chart = await updateChart('chart-123', { title: 'Updated' });
    expect(chart).toBeNull();
  });

  it('should delete chart', async () => {
    const { deleteChart } = await import('@/lib/api');
    await expect(deleteChart('chart-123')).resolves.not.toThrow();
  });
});

describe('API - DataSources', () => {
  it('should get data sources for org', async () => {
    const { getDataSources } = await import('@/lib/api');
    const dataSources = await getDataSources('org-123');
    expect(dataSources).toEqual([]);
  });

  it('should create data source', async () => {
    const { createDataSource } = await import('@/lib/api');
    const dataSource = await createDataSource('org-123', { name: 'Test Source' });
    expect(dataSource).toBeNull();
  });
});

describe('API - Embed', () => {
  it('should generate embed code', async () => {
    const { generateEmbedCode } = await import('@/lib/api');
    const embedCode = await generateEmbedCode('dash-123');
    expect(embedCode).toBe('https://insightflow.app/embed/dash-123');
  });
});
