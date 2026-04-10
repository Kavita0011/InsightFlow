'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dashboardGoalsSchema, type DashboardGoalsFormData } from '@/lib/schemas';
import { useState } from 'react';
import { LayoutDashboard, BarChart3, LineChart, PieChart, Table, Activity } from 'lucide-react';

interface DashboardGoalsFormProps {
  onSubmit: (data: DashboardGoalsFormData) => Promise<void>;
}

const chartTypeIcons: Record<string, React.ReactNode> = {
  bar: <BarChart3 className="w-5 h-5" />,
  line: <LineChart className="w-5 h-5" />,
  pie: <PieChart className="w-5 h-5" />,
  table: <Table className="w-5 h-5" />,
  area: <Activity className="w-5 h-5" />,
  kpi: <Activity className="w-5 h-5" />,
};

export function DashboardGoalsForm({ onSubmit }: DashboardGoalsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DashboardGoalsFormData>({
    resolver: zodResolver(dashboardGoalsSchema),
    defaultValues: {
      chartTypes: [],
      primaryGoal: 'analytics',
    },
  });

  const handleFormSubmit = async (data: DashboardGoalsFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartTypes = ['bar', 'line', 'pie', 'area', 'table', 'kpi'] as const;
  const goals = ['analytics', 'reporting', 'monitoring', 'forecasting'] as const;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold">Create Your First Dashboard</h1>
        </div>
        <p className="text-gray-600">Tell us about your dashboard goals.</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Dashboard Name</label>
          <input
            {...register('dashboardName')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Sales Analytics"
          />
          {errors.dashboardName && (
            <p className="text-red-500 text-sm mt-1">{errors.dashboardName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (Optional)</label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describe your dashboard..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Chart Types You Need</label>
          <Controller
            name="chartTypes"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-3">
                {chartTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      const newTypes = field.value.includes(type)
                        ? field.value.filter((t) => t !== type)
                        : [...field.value, type];
                      field.onChange(newTypes);
                    }}
                    className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                      field.value.includes(type)
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    {chartTypeIcons[type]}
                    <span className="text-sm capitalize">{type}</span>
                  </button>
                ))}
              </div>
            )}
          />
          {errors.chartTypes && (
            <p className="text-red-500 text-sm mt-1">{errors.chartTypes.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data Source Name</label>
          <input
            {...register('dataSourceName')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Sales Data"
          />
          {errors.dataSourceName && (
            <p className="text-red-500 text-sm mt-1">{errors.dataSourceName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Primary Goal</label>
          <Controller
            name="primaryGoal"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => field.onChange(goal)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      field.value === goal
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <span className="capitalize">{goal}</span>
                  </button>
                ))}
              </div>
            )}
          />
          {errors.primaryGoal && (
            <p className="text-red-500 text-sm mt-1">{errors.primaryGoal.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Dashboard'}
        </button>
      </form>
    </div>
  );
}
