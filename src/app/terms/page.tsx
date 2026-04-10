'use client';

import { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Scale, Shield, Users, CreditCard } from 'lucide-react';

export default function TermsOfService() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using InsightFlow ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, do not use our Service.

InsightFlow reserves the right to update these terms at any time. Continued use of the Service constitutes acceptance of any modified terms.`
    },
    {
      title: '2. Description of Service',
      content: `InsightFlow is a multi-tenant analytics platform that provides:
• Form-based data intake and onboarding
• Drag-and-drop dashboard builder
• Data visualization and charting
• Tenant-specific branding and embedding
• Admin billing and payment management

The Service is provided "as is" and we reserve the right to modify or discontinue features at any time.`
    },
    {
      title: '3. User Accounts & Registration',
      content: `To use InsightFlow, you must:
• Provide accurate and complete registration information
• Be at least 18 years old or have parental consent
• Maintain the security of your account credentials
• Accept responsibility for all activities under your account

You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.`
    },
    {
      title: '4. Multi-Tenant Architecture',
      content: `InsightFlow operates as a multi-tenant platform:
• Each organization ("Tenant") maintains isolated data
• Users belong to one or more tenants based on their organization
• Role-based access control (RBAC) determines permissions
• Tenant admins manage their organization's users and data

Agencies may manage multiple client tenants under a single parent account, subject to their subscription tier.`
    },
    {
      title: '5. Acceptable Use Policy',
      content: `You agree NOT to use InsightFlow to:
• Upload or distribute viruses, malware, or harmful code
• Attempt to gain unauthorized access to other tenants' data
• Interfere with or disrupt the Service or servers
• Use the Service for any illegal purpose or in violation of rights
• Resell or redistribute the Service without authorization
• Harass, defame, or intimidate others

Violations may result in immediate termination of your account and potential legal action.`
    },
    {
      title: '6. Intellectual Property Rights',
      content: `Ownership:
• You retain ownership of data you upload to your dashboards
• InsightFlow retains ownership of the platform and all underlying technology
• Pre-built templates remain InsightFlow's property unless separately licensed

Restrictions:
• You may not copy, modify, or reverse engineer the Service
• Logo and branding elements are proprietary and may not be used without permission
• Feedback and suggestions you provide become our property`
    },
    {
      title: '7. Payment & Billing',
      content: `Subscription Terms:
• All subscriptions are billed in advance on a monthly or annual basis
• Prices are subject to change with 30 days' notice
• Refunds are provided according to our refund policy

Payment Gateways:
• We use Razorpay (India) and Stripe (international) for payments
• Payment processing is handled by third-party providers
• We do not store credit card information on our servers

Delinquency:
• Accounts with unpaid invoices may be suspended after 14 days
• Reinstatement requires payment of all outstanding amounts`
    },
    {
      title: '8. Data Ownership & Backups',
      content: `Your Data:
• You own all data you input into InsightFlow dashboards
• We access your data only to provide the Service
• You can export your data at any time before account termination

Data Retention:
• Deleted data is removed within 30 days
• Backups are retained for disaster recovery purposes
• We are not responsible for data loss due to user error`
    },
    {
      title: '9. Limitation of Liability',
      content: `To the maximum extent permitted by law:
• THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES
• WE DO NOT GUARANTEE UNINTERRUPTED OR ERROR-FREE SERVICE
• WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES
• OUR TOTAL LIABILITY IS LIMITED TO THE AMOUNT YOU PAID IN THE PAST 12 MONTHS

Some jurisdictions do not allow these limitations, so they may not apply to you.`
    },
    {
      title: '10. Indemnification',
      content: `You agree to indemnify and hold harmless InsightFlow and its officers, directors, and employees from:
• Any claims arising from your use of the Service
• Claims that your data infringes third-party rights
• Claims arising from your violation of these Terms
• Legal costs resulting from such claims

We will notify you of any claims and provide reasonable cooperation in your defense.`
    },
    {
      title: '11. Termination',
      content: `Termination by You:
• You may cancel your subscription at any time
• No refunds for partial billing periods
• You can export data before termination

Termination by Us:
• We may terminate your account for violation of these terms
• We may suspend service for non-payment
• We will provide 30 days' notice before termination (except for violations)

Upon termination, your data will be deleted within 30 days.`
    },
    {
      title: '12. Governing Law & Disputes',
      content: `This Agreement is governed by:
• The laws of [Jurisdiction], without regard to conflict of laws
• Any disputes will be resolved through binding arbitration
• Arbitration will be conducted in English

Exceptions:
• We may seek injunctive relief in any jurisdiction
• Small claims court may be used for qualifying disputes`
    },
    {
      title: '13. Third-Party Services',
      content: `InsightFlow integrates with third-party services:
• Clerk: User authentication
• Supabase: Database infrastructure
• Razorpay/Stripe: Payment processing
• Google Sheets: Optional data integration

We are not responsible for third-party services' privacy practices or availability.`
    },
    {
      title: '14. Changes to Terms',
      content: `We may modify these Terms of Service at any time:
• Material changes will be announced via email or platform notification
• Continued use after changes constitutes acceptance
• If you do not agree to new terms, you may terminate your account

The "Last Updated" date reflects the most recent changes.`
    },
    {
      title: '15. Contact Information',
      content: `For questions about these Terms of Service, contact:

Email: legal@insightflow.app
Mailing Address: InsightFlow Legal Team
[Company Address]

We will respond to inquiries within 30 business days.`
    }
  ];

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full mb-4">
            <Scale className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400">Last Updated: April 10, 2026</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
          <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800 dark:text-amber-200">Important Notice</span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              By using InsightFlow, you agree to these Terms of Service. Please read them carefully before using our platform.
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {sections.map((section, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="font-medium">{section.title}</span>
                  {openSection === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openSection === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm leading-relaxed">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <Shield className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium mb-1">Your Rights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">You own your data</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium mb-1">Multi-Tenant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Isolated tenant data</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <CreditCard className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium mb-1">Billing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Transparent pricing</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium mb-1">Termination</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Export your data anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
