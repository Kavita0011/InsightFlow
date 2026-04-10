'use client';

import { useState, useCallback } from 'react';
import { 
  Plus, Save, Layout, BarChart3, LineChart, PieChart, Table, 
  Activity, Grid, Settings, Trash2, Move, Edit3, Eye, Share2,
  ChevronLeft, ChevronRight, MoreVertical, Download, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, LineChart as RechartsLine, Line, PieChart as RechartsPie, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer, AreaChart, Area
} from 'recharts';

interface Widget {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'table' | 'kpi';
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  data: Record<string, unknown>[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const sampleData = [
  { name: 'Jan', value: 400, value2: 240 },
  { name: 'Feb', value: 300, value2: 139 },
  { name: 'Mar', value: 200, value2: 980 },
  { name: 'Apr', value: 278, value2: 390 },
  { name: 'May', value: 189, value2: 480 },
  { name: 'Jun', value: 239, value2: 380 },
  { name: 'Jul', value: 349, value2: 430 },
];

const pieData = [
  { name: 'Series A', value: 400 },
  { name: 'Series B', value: 300 },
  { name: 'Series C', value: 300 },
  { name: 'Series D', value: 200 },
];

interface ChartRendererProps {
  type: Widget['type'];
  data: Record<string, unknown>[];
}

function ChartRenderer({ type, data }: ChartRendererProps) {
  if (type === 'kpi') {
    const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600">{total.toLocaleString()}</div>
          <div className="text-gray-500 mt-2">Total Value</div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="h-full overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {Object.keys(data[0] || {}).map((key) => (
                <th key={key} className="px-3 py-2 text-left font-medium text-gray-600">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-gray-100">
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-3 py-2 text-gray-700">{String(val)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPie>
      </ResponsiveContainer>
    );
  }

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="value" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
          <Area type="monotone" dataKey="value2" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="value2" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
        </RechartsLine>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="name" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="value2" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', type: 'kpi', title: 'Total Revenue', x: 0, y: 0, w: 3, h: 2, data: sampleData },
    { id: '2', type: 'bar', title: 'Monthly Sales', x: 3, y: 0, w: 3, h: 3, data: sampleData },
    { id: '3', type: 'line', title: 'Revenue Trend', x: 0, y: 2, w: 3, h: 3, data: sampleData },
    { id: '4', type: 'pie', title: 'Distribution', x: 6, y: 0, w: 3, h: 3, data: sampleData },
  ]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardName, setDashboardName] = useState('My Dashboard');

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      x: 0,
      y: 0,
      w: type === 'kpi' ? 3 : 4,
      h: type === 'kpi' ? 2 : 3,
      data: sampleData,
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
    setSelectedWidget(null);
  };

  const updateWidgetTitle = (id: string, title: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, title } : w));
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    e.dataTransfer.setData('widgetId', widgetId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const widgetId = e.dataTransfer.getData('widgetId');
    if (!widgetId) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 100);
    const y = Math.floor((e.clientY - rect.top) / 80);

    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, x: Math.max(0, x), y: Math.max(0, y) } : w
    ));
  };

  const saveDashboard = async () => {
    console.log('Saving dashboard:', { name: dashboardName, layout: widgets });
    alert('Dashboard saved successfully!');
  };

  const widgetsToolbar = [
    { type: 'bar' as const, icon: BarChart3, label: 'Bar Chart' },
    { type: 'line' as const, icon: LineChart, label: 'Line Chart' },
    { type: 'pie' as const, icon: PieChart, label: 'Pie Chart' },
    { type: 'area' as const, icon: Activity, label: 'Area Chart' },
    { type: 'table' as const, icon: Table, label: 'Table' },
    { type: 'kpi' as const, icon: Activity, label: 'KPI Card' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all overflow-hidden flex-shrink-0`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Widgets
          </h2>
        </div>
        <div className="p-4 space-y-2">
          {widgetsToolbar.map((item) => (
            <button
              key={item.type}
              onClick={() => addWidget(item.type)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-colors text-left"
            >
              <item.icon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="font-medium mb-3 text-sm text-gray-500">Dashboard Settings</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              placeholder="Dashboard name"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="font-semibold text-lg">{dashboardName}</h1>
              <p className="text-sm text-gray-500">{widgets.length} widgets</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditing 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isEditing ? 'Editing' : 'View Mode'}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={saveDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          className="flex-1 overflow-auto p-6"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="grid grid-cols-12 gap-4 auto-rows-[80px]">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                draggable={isEditing}
                onDragStart={(e) => handleDragStart(e, widget.id)}
                onClick={() => setSelectedWidget(widget.id)}
                className={`relative bg-white dark:bg-gray-900 rounded-xl border-2 transition-all ${
                  selectedWidget === widget.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                } ${isEditing ? 'cursor-move' : 'cursor-pointer'}`}
                style={{
                  gridColumn: `span ${widget.w}`,
                  gridRow: `span ${widget.h}`,
                }}
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                    <input
                      type="text"
                      value={widget.title}
                      onChange={(e) => updateWidgetTitle(widget.id, e.target.value)}
                      disabled={!isEditing}
                      className="font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                    />
                    {isEditing && (
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                          <Move className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 min-h-0">
                    <ChartRenderer type={widget.type} data={widget.data} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {widgets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Grid className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No widgets yet</p>
              <p className="text-sm">Click on widgets from the sidebar to add them</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
