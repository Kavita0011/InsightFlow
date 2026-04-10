'use client';

import { useState } from 'react';
import { Shield, Lock, Eye, Database, Mail, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const sections = [
    {
      title: '1. Introduction',
      content: `InsightFlow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our multi-tenant analytics platform.

By accessing or using InsightFlow, you agree to this Privacy Policy. If you do not agree with the terms of this policy, please do not access our platform.`
    },
    {
      title: '2. Information We Collect',
      content: `We collect information you provide directly to us:
• Account Information: Organization name, business details, contact information
• User Data: Name, email, role within your organization
• Dashboard Data: Data you enter, import, or create in your dashboards
• Payment Information: Billing details (processed securely via third-party payment gateways)

We also automatically collect:
• Usage Data: Features used, time spent, interaction patterns
• Device Data: IP address, browser type, device information
• Cookies: Essential cookies for authentication and preferences`
    },
    {
      title: '3. How We Use Your Information',
      content: `We use the collected information for:
• Providing Services: Operating and maintaining our analytics platform
• Account Management: Creating and managing tenant organizations
• Data Processing: Processing your data for dashboard creation and visualization
• Communication: Sending service updates, newsletters, and support responses
• Improvement: Analyzing usage patterns to enhance our services
• Security: Detecting and preventing fraud, abuse, and security threats`
    },
    {
      title: '4. Data Sharing & Disclosure',
      content: `We do NOT sell your personal data. We may share information with:
• Service Providers: Third-party vendors who assist in our operations (payment processing, cloud storage)
• Legal Requirements: When required by law or in response to valid legal requests
• Business Transfers: In connection with merger, sale, or reorganization of our business

Your dashboard data is isolated per tenant and accessible only to authorized users within your organization.`
    },
    {
      title: '5. Data Security',
      content: `We implement robust security measures:
• Encryption: Data encrypted in transit (TLS 1.3) and at rest (AES-256)
• Access Controls: Role-based access control (RBAC) with tenant isolation
• Authentication: Secure Clerk authentication integration
• Regular Audits: Security reviews and vulnerability assessments

While we strive to protect your data, no method of transmission over the internet is 100% secure.`
    },
    {
      title: '6. Data Retention',
      content: `We retain your information as long as your account is active:
• Account Data: Retained while account exists, deleted within 30 days of termination
• Dashboard Data: Available for export before deletion
• Logs: Anonymized analytics retained for up to 2 years
• Payment Records: Retained as required by financial regulations

You can request data export or account deletion at any time through your account settings.`
    },
    {
      title: '7. Your Rights',
      content: `Under applicable data protection laws, you have the right to:
• Access: Request copies of your personal data
• Correction: Request correction of inaccurate data
• Deletion: Request deletion of your personal data
• Data Portability: Request your data in a structured format
• Opt-Out: Unsubscribe from marketing communications

To exercise these rights, contact us at privacy@insightflow.app`
    },
    {
      title: '8. Third-Party Services',
      content: `Our platform integrates with third-party services:
• Clerk: User authentication
• Supabase: Database and backend services
• Razorpay/Stripe: Payment processing
• Google Sheets: Optional data integration

Each third-party service has its own privacy policy. We encourage you to review their policies.`
    },
    {
      title: "9. Children's Privacy",
      content: `InsightFlow is not intended for use by children under 16 years of age. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us.`
    },
    {
      title: '10. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by:
• Posting the new policy on our platform
• Sending an email notification
• Displaying a prominent notice

The "Last Updated" date at the top of this policy indicates when changes were made.`
    },
    {
      title: '11. International Data Transfers',
      content: `Your data may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards:
• Standard Contractual Clauses for international transfers
• Adequacy decisions where applicable
• Encryption during data transmission

By using InsightFlow, you consent to such transfers.`
    },
    {
      title: '12. Contact Information',
      content: `For questions or concerns about this Privacy Policy, contact us:

Email: privacy@insightflow.app
Mailing Address: InsightFlow Privacy Team
[Company Address]

We will respond to your inquiry within 30 days.`
    }
  ];

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400">Last Updated: April 10, 2026</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-green-600" />
              <span className="font-medium">Your Data is Protected</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              InsightFlow is a multi-tenant analytics platform. Your organization&apos;s data is isolated and accessible only to authorized users within your tenant.
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <Eye className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium mb-1">Transparency</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Clear information about how we use your data</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <Database className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium mb-1">Tenant Isolation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your data is secure and isolated per organization</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <Mail className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium mb-1">Contact Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">We&apos;re here to help with any concerns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
