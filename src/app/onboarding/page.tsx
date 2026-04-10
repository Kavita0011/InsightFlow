'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, Palette, BarChart3, Check, ArrowRight, ArrowLeft,
  Sparkles, Users, Globe, CreditCard, Zap, FileText
} from 'lucide-react';

const onboardingSchema = z.object({
  orgName: z.string().min(1, 'Organization name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  domain: z.string().url('Invalid URL').optional().or(z.literal('')),
  plan: z.enum(['free', 'starter', 'pro', 'enterprise']),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  currency: z.enum(['USD', 'INR', 'EUR', 'GBP']),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const plans = [
  { id: 'free', name: 'Free', price: 0, features: ['1 Organization', '3 Dashboards', '5 Users'], popular: false },
  { id: 'starter', name: 'Starter', price: 29, features: ['5 Organizations', '15 Dashboards', '25 Users'], popular: true },
  { id: 'pro', name: 'Pro', price: 99, features: ['25 Organizations', 'Unlimited Dashboards', '100 Users'], popular: false },
  { id: 'enterprise', name: 'Enterprise', price: 299, features: ['Unlimited Everything', 'Priority Support', 'Custom Integrations'], popular: false },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      plan: 'starter',
      primaryColor: '#3B82F6',
      currency: 'INR',
    },
  });

  const orgName = watch('orgName');
  const selectedPlan = watch('plan');

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('orgName', name);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setValue('slug', slug);
  };

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/org/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to create organization. Please try again.');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const steps = [
    { num: 1, title: 'Organization', icon: Building2 },
    { num: 2, title: 'Branding', icon: Palette },
    { num: 3, title: 'Choose Plan', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-gray-900 dark:to-black">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-2 ${step >= s.num ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step > s.num ? 'bg-green-500 text-white' : 
                  step === s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className="hidden sm:inline font-medium">{s.title}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${step > s.num ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Organization */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Create Your Organization</h1>
                  <p className="text-gray-500 mt-1">Let&apos;s set up your workspace</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Organization Name</label>
                  <input
                    {...register('orgName')}
                    onChange={handleOrgNameChange}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Acme Corporation"
                  />
                  {errors.orgName && <p className="text-red-500 text-sm mt-1">{errors.orgName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-3 py-3 bg-gray-100 dark:bg-gray-800 border border-r-0 rounded-l-lg text-gray-500">insightflow.app/</span>
                    <input
                      {...register('slug')}
                      className="flex-1 px-4 py-3 border rounded-r-lg dark:bg-gray-800 dark:border-gray-700"
                      placeholder="acme-corp"
                    />
                  </div>
                  {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Custom Domain (Optional)</label>
                  <input
                    {...register('domain')}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    placeholder="https://dashboard.acme.com"
                  />
                  {errors.domain && <p className="text-red-500 text-sm mt-1">{errors.domain.message}</p>}
                </div>

                <button type="button" onClick={nextStep} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Branding */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Brand Your Workspace</h1>
                  <p className="text-gray-500 mt-1">Customize your dashboard appearance</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setValue('primaryColor', color)}
                        className={`w-10 h-10 rounded-lg border-2 ${watch('primaryColor') === color ? 'border-gray-900 dark:border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      {...register('primaryColor')}
                      className="w-12 h-10 border rounded cursor-pointer"
                    />
                    <input
                      {...register('primaryColor')}
                      className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      placeholder="#3B82F6"
                    />
                  </div>
                  {errors.primaryColor && <p className="text-red-500 text-sm mt-1">{errors.primaryColor.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    {...register('currency')}
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="INR">INR (₹) - India</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Choose Plan */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Choose Your Plan</h1>
                  <p className="text-gray-500 mt-1">Select the plan that fits your needs</p>
                </div>

                <div className="space-y-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setValue('plan', plan.id as OnboardingData['plan'])}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPlan === plan.id ? 'border-blue-500' : 'border-gray-300'
                          }`}>
                            {selectedPlan === plan.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                          </div>
                          <div>
                            <h3 className="font-semibold">{plan.name}</h3>
                            <p className="text-sm text-gray-500">{plan.features[0]} • {plan.features[1]}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">₹{plan.price}</p>
                          <p className="text-xs text-gray-500">/month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                    {isSubmitting ? 'Creating...' : 'Complete Setup'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
