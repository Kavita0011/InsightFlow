'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Widget {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'table' | 'kpi';
  title: string;
  data: Record<string, unknown>[];
}

interface Dashboard {
  id: string;
  name: string;
  layout: Record<string, unknown>;
  is_public: boolean;
}

interface Org {
  id: string;
  name: string;
  primary_color: string;
  logo_url?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
];

function ChartRenderer({ type, data }: { type: Widget['type']; data: Record<string, unknown>[] }) {
  if (type === 'kpi') {
    const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-5xl font-bold">{total.toLocaleString()}</div>
          <div className="text-gray-500 mt-2">Total</div>
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
                <th key={key} className="px-3 py-2 text-left font-medium">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t">
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-3 py-2">{String(val)}</td>
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
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
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
          <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
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
        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function EmbedPage() {
  const params = useParams();
  const dashboardId = params.dashboardId as string;
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmbedData() {
      try {
        const response = await fetch(`/api/embed/${dashboardId}`);
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Failed to load dashboard');
          return;
        }

        setDashboard(data.dashboard);
        setOrg(data.org);
        setWidgets(data.widgets || []);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    if (dashboardId) {
      fetchEmbedData();
    }
  }, [dashboardId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const primaryColor = org?.primary_color || '#3B82F6';

  return (
    <div className="min-h-screen bg-gray-50" style={{ '--accent': primaryColor } as React.CSSProperties}>
      {org?.logo_url && (
        <div className="absolute top-4 left-4">
          <img src={org.logo_url} alt={org.name} className="h-8" />
        </div>
      )}
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>
          {dashboard?.name || 'Dashboard'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="bg-white rounded-xl border shadow-sm"
              style={{ borderColor: '#e5e7eb' }}
            >
              <div className="px-4 py-3 border-b font-medium">{widget.title}</div>
              <div className="p-4 h-64">
                <ChartRenderer type={widget.type} data={widget.data} />
              </div>
            </div>
          ))}
        </div>

        {widgets.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No widgets available
          </div>
        )}
      </div>

      <div className="fixed bottom-2 right-4 text-xs text-gray-400">
        Powered by InsightFlow
      </div>
    </div>
  );
}
