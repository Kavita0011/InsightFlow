import type { Chart, ChartType, ChartPosition } from '@/types';

export interface Widget {
  id: string;
  type: ChartType;
  title: string;
  dataConfig: Record<string, unknown>;
  position: ChartPosition;
}

export interface Layout {
  widgets: Widget[];
  columns: number;
  rowHeight: number;
}

export function createDefaultPosition(type: ChartType): ChartPosition {
  const defaults: Record<ChartType, ChartPosition> = {
    bar: { x: 0, y: 0, w: 4, h: 3 },
    line: { x: 0, y: 0, w: 4, h: 3 },
    pie: { x: 0, y: 0, w: 3, h: 3 },
    area: { x: 0, y: 0, w: 4, h: 3 },
    table: { x: 0, y: 0, w: 6, h: 4 },
    kpi: { x: 0, y: 0, w: 2, h: 2 },
  };
  return defaults[type] || { x: 0, y: 0, w: 4, h: 3 };
}

export function addWidget(layout: Layout, type: ChartType, title: string): Layout {
  const newWidget: Widget = {
    id: crypto.randomUUID(),
    type,
    title,
    dataConfig: {},
    position: calculateNextPosition(layout),
  };
  return {
    ...layout,
    widgets: [...layout.widgets, newWidget],
  };
}

export function removeWidget(layout: Layout, widgetId: string): Layout {
  return {
    ...layout,
    widgets: layout.widgets.filter((w) => w.id !== widgetId),
  };
}

export function updateWidgetPosition(
  layout: Layout,
  widgetId: string,
  position: ChartPosition
): Layout {
  return {
    ...layout,
    widgets: layout.widgets.map((w) =>
      w.id === widgetId ? { ...w, position } : w
    ),
  };
}

export function updateWidgetData(
  layout: Layout,
  widgetId: string,
  dataConfig: Record<string, unknown>
): Layout {
  return {
    ...layout,
    widgets: layout.widgets.map((w) =>
      w.id === widgetId ? { ...w, dataConfig } : w
    ),
  };
}

function calculateNextPosition(layout: Layout): ChartPosition {
  const maxY = layout.widgets.reduce((max, w) => Math.max(max, w.position.y + w.position.h), 0);
  return { x: 0, y: maxY, w: 4, h: 3 };
}

export function serializeLayout(layout: Layout): string {
  return JSON.stringify(layout);
}

export function deserializeLayout(json: string): Layout {
  try {
    const parsed = JSON.parse(json);
    return parsed as Layout;
  } catch {
    return { widgets: [], columns: 12, rowHeight: 100 };
  }
}

export function getWidgetById(layout: Layout, id: string): Widget | undefined {
  return layout.widgets.find((w) => w.id === id);
}
