'use client';

import { useState } from 'react';
import { 
  CreditCard, Download, Receipt, Shield, Check, X, 
  Calendar, DollarSign, AlertCircle, TrendingUp, Settings, 
  Wallet, Building2, Smartphone, Copy, ExternalLink
} from 'lucide-react';

interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  plan: string;
}

const mockInvoices: Invoice[] = [
  { id: 'INV-001', amount: 9999, date: '2026-04-01', status: 'paid', plan: 'Enterprise' },
  { id: 'INV-002', amount: 9999, date: '2026-03-01', status: 'paid', plan: 'Enterprise' },
  { id: 'INV-003', amount: 9999, date: '2026-02-01', status: 'paid', plan: 'Enterprise' },
];

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState('enterprise');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay');

  const plans = [
    { id: 'free', name: 'Free', price: 0, features: ['1 Org', '3 Dashboards', '5 Users'] },
    { id: 'starter', name: 'Starter', price: 29, features: ['5 Orgs', '15 Dashboards', '25 Users', 'Email Support'] },
    { id: 'pro', name: 'Pro', price: 99, features: ['25 Orgs', 'Unlimited Dashboards', '100 Users', 'Priority Support'] },
    { id: 'enterprise', name: 'Enterprise', price: 299, features: ['Unlimited Orgs', 'Unlimited Users', 'Dedicated Support', 'Custom Integrations'] },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your subscription and payment methods</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Enterprise Plan</p>
                    <p className="text-3xl font-bold">₹9,999<span className="text-lg font-normal">/month</span></p>
                  </div>
                  <TrendingUp className="w-12 h-12 opacity-50" />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                  Change Plan
                </button>
                <button className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20">
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Payment Methods
              </h2>

              <div className="space-y-3">
                <div 
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === 'razorpay' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Razorpay</p>
                        <p className="text-sm text-gray-500">UPI, Cards, Net Banking</p>
                      </div>
                    </div>
                    {paymentMethod === 'razorpay' && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === 'stripe' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Stripe</p>
                        <p className="text-sm text-gray-500">International Cards</p>
                      </div>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Billing History
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>

              <div className="space-y-3">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-gray-500">{invoice.date} • {invoice.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                        {invoice.status}
                      </span>
                      <p className="font-semibold">₹{invoice.amount.toLocaleString()}</p>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Admin Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Admin Account
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">devappkavita@gmail.com</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Role</label>
                  <p className="font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    Super Admin
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Organization</label>
                  <p className="font-medium">InsightFlow HQ</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Details
              </h2>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm">kavitabishtofficial1@oksbi</p>
                    <button 
                      onClick={() => copyToClipboard('kavitabishtofficial1@oksbi')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Bank Account</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm">45065191325</p>
                    <button 
                      onClick={() => copyToClipboard('45065191325')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm">SBIN0004633</p>
                    <button 
                      onClick={() => copyToClipboard('SBIN0004633')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">Google Pay</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm">+91 45065 191325</p>
                    <button 
                      onClick={() => copyToClipboard('+9145065191325')}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                    >
                      <Copy className="w-3 h-3 text-green-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </h2>
              
              <div className="space-y-2">
                <a href="/admin" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Admin Panel
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a href="/contact" className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-purple-600" />
                    Support
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
