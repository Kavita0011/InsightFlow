'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, type OnboardingFormData } from '@/lib/schemas';
import { useState } from 'react';
import { Building2, ArrowRight, Check } from 'lucide-react';

interface OnboardingFormProps {
  onSubmit: (data: OnboardingFormData) => Promise<void>;
}

export function OnboardingForm({ onSubmit }: OnboardingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      plan: 'free',
      primaryColor: '#3B82F6',
      currency: 'USD',
    },
  });

  const orgName = watch('orgName');

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('orgName', name);
    if (step === 1) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  };

  const handleFormSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold">Create Your Organization</h1>
        </div>
        <p className="text-gray-600">Set up your workspace to start building dashboards.</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Organization Name</label>
            <input
              {...register('orgName')}
              onChange={handleOrgNameChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Acme Inc."
            />
            {errors.orgName && (
              <p className="text-red-500 text-sm mt-1">{errors.orgName.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">URL Slug</label>
            <input
              {...register('slug')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="acme-inc"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Domain (Optional)</label>
            <input
              {...register('domain')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://acme.com"
            />
            {errors.domain && (
              <p className="text-red-500 text-sm mt-1">{errors.domain.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Plan</label>
            <select
              {...register('plan')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            {errors.plan && (
              <p className="text-red-500 text-sm mt-1">{errors.plan.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              {...register('currency')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            {errors.currency && (
              <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                {...register('primaryColor')}
                className="w-12 h-10 border rounded cursor-pointer"
              />
              <input
                {...register('primaryColor')}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="#3B82F6"
              />
            </div>
            {errors.primaryColor && (
              <p className="text-red-500 text-sm mt-1">{errors.primaryColor.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            'Creating...'
          ) : (
            <>
              Create Organization <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
