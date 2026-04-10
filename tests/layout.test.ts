import { describe, it, expect } from 'vitest';
import {
  createDefaultPosition,
  addWidget,
  removeWidget,
  updateWidgetPosition,
  updateWidgetData,
  serializeLayout,
  deserializeLayout,
  getWidgetById,
} from '@/lib/layout';
import type { ChartType, ChartPosition } from '@/types';

describe('Layout', () => {
  const baseLayout = { widgets: [], columns: 12, rowHeight: 100 };

  describe('createDefaultPosition', () => {
    it('should return correct default for bar chart', () => {
      const pos = createDefaultPosition('bar');
      expect(pos).toEqual({ x: 0, y: 0, w: 4, h: 3 });
    });

    it('should return correct default for table', () => {
      const pos = createDefaultPosition('table');
      expect(pos).toEqual({ x: 0, y: 0, w: 6, h: 4 });
    });

    it('should return correct default for KPI', () => {
      const pos = createDefaultPosition('kpi');
      expect(pos).toEqual({ x: 0, y: 0, w: 2, h: 2 });
    });

    it('should return generic default for unknown type', () => {
      const pos = createDefaultPosition('pie');
      expect(pos.w).toBeDefined();
      expect(pos.h).toBeDefined();
    });
  });

  describe('addWidget', () => {
    it('should add a widget to layout', () => {
      const layout = addWidget(baseLayout, 'bar', 'Test Chart');
      expect(layout.widgets.length).toBe(1);
      expect(layout.widgets[0].type).toBe('bar');
      expect(layout.widgets[0].title).toBe('Test Chart');
    });

    it('should assign unique id to widget', () => {
      const layout1 = addWidget(baseLayout, 'bar', 'Chart 1');
      const layout2 = addWidget(baseLayout, 'bar', 'Chart 2');
      expect(layout1.widgets[0].id).not.toBe(layout2.widgets[0].id);
    });
  });

  describe('removeWidget', () => {
    it('should remove widget by id', () => {
      const layout = addWidget(baseLayout, 'bar', 'Test');
      const withWidget = addWidget(layout, 'line', 'Test 2');
      const removed = removeWidget(withWidget, withWidget.widgets[0].id);
      expect(removed.widgets.length).toBe(1);
      expect(removed.widgets[0].type).toBe('line');
    });
  });

  describe('updateWidgetPosition', () => {
    it('should update widget position', () => {
      const layout = addWidget(baseLayout, 'bar', 'Test');
      const widgetId = layout.widgets[0].id;
      const newPos: ChartPosition = { x: 2, y: 2, w: 6, h: 4 };
      const updated = updateWidgetPosition(layout, widgetId, newPos);
      expect(updated.widgets[0].position).toEqual(newPos);
    });
  });

  describe('updateWidgetData', () => {
    it('should update widget data config', () => {
      const layout = addWidget(baseLayout, 'bar', 'Test');
      const widgetId = layout.widgets[0].id;
      const dataConfig = { data: [1, 2, 3] };
      const updated = updateWidgetData(layout, widgetId, dataConfig);
      expect(updated.widgets[0].dataConfig).toEqual(dataConfig);
    });
  });

  describe('serializeLayout', () => {
    it('should serialize layout to JSON', () => {
      const layout = addWidget(baseLayout, 'bar', 'Test');
      const json = serializeLayout(layout);
      expect(JSON.parse(json)).toBeDefined();
    });
  });

  describe('deserializeLayout', () => {
    it('should deserialize valid JSON', () => {
      const original = addWidget(baseLayout, 'bar', 'Test');
      const json = serializeLayout(original);
      const restored = deserializeLayout(json);
      expect(restored.widgets.length).toBe(1);
      expect(restored.widgets[0].type).toBe('bar');
    });

    it('should return default layout for invalid JSON', () => {
      const restored = deserializeLayout('invalid');
      expect(restored.widgets).toEqual([]);
    });
  });

  describe('getWidgetById', () => {
    it('should return widget by id', () => {
      const layout = addWidget(baseLayout, 'bar', 'Test');
      const widget = getWidgetById(layout, layout.widgets[0].id);
      expect(widget).toBeDefined();
      expect(widget?.title).toBe('Test');
    });

    it('should return undefined for unknown id', () => {
      const layout = addWidget(baseLayout, 'bar', 'Test');
      const widget = getWidgetById(layout, 'unknown-id');
      expect(widget).toBeUndefined();
    });
  });
});
