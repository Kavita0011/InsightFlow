'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, Book, Zap, Shield, BarChart3, Users, CreditCard, Globe, Database } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      question: 'What is InsightFlow and who is it for?',
      answer: 'InsightFlow is a multi-tenant analytics platform designed for agencies managing multiple clients and SMBs seeking branded analytics. It provides form-based data intake, drag-and-drop dashboard building, and per-tenant branding with embedding capabilities.',
      category: 'general',
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      question: 'How does multi-tenancy work in InsightFlow?',
      answer: 'Each organization (tenant) maintains completely isolated data. Users belong to one organization, and role-based access control (RBAC) ensures proper permissions. Agencies can manage multiple client tenants under their account, making it ideal for multi-client management.',
      category: 'features',
      icon: <Users className="w-5 h-5" />
    },
    {
      question: 'What authentication method do you use?',
      answer: 'InsightFlow integrates with Clerk for secure authentication. This provides features like social login, two-factor authentication, and seamless user management without handling passwords directly.',
      category: 'security',
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: 'Can I import data from CSV or Excel files?',
      answer: 'Yes! Phase 2 includes CSV/Excel import capabilities. For MVP, you can use our forms-based data intake or manually enter data through the data entry interface. Google Sheets integration is planned for Phase 3.',
      category: 'data',
      icon: <Database className="w-5 h-5" />
    },
    {
      question: 'What payment gateways do you support?',
      answer: 'We support Razorpay (primary for India - supports GPay, SBI bank, Paytm) and Stripe (for international payments). This provides comprehensive payment options for both Indian and global clients.',
      category: 'billing',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      question: 'How does the drag-and-drop dashboard builder work?',
      answer: 'Our dashboard builder provides a canvas where you can add widgets (bar, line, pie, area, table, KPI charts), resize and position them, and save layouts. Layouts are persisted as JSON and can be loaded later. You can also generate embed codes for sharing.',
      category: 'features',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      question: 'Can I white-label dashboards for my clients?',
      answer: 'Yes! InsightFlow supports per-tenant branding including primary colors, logos, and custom themes. You can generate embed codes that display your client\'s branding when embedded on their website.',
      category: 'features',
      icon: <Globe className="w-5 h-5" />
    },
    {
      question: 'What happens to my data if I cancel my subscription?',
      answer: 'You retain ownership of all your data. Before cancellation, you can export your dashboards and data in standard formats. After account termination, data is deleted within 30 days per our data retention policy.',
      category: 'billing',
      icon: <Database className="w-5 h-5" />
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a Free plan for you to explore the platform\'s core features. You can upgrade to Starter, Pro, or Enterprise plans as your needs grow. All plans include multi-tenant capabilities.',
      category: 'billing',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      question: 'What AI features are available?',
      answer: 'Our architecture is AI-ready with feature-gating. Currently, we offer rule-based templates and deterministic analytics. Once an OpenAI key is available, we\'ll enable AI-powered dashboard generation, natural language queries, and predictive analytics.',
      category: 'features',
      icon: <Zap className="w-5 h-5" />
    },
    {
      question: 'How secure is my data?',
      answer: 'We implement enterprise-grade security: TLS 1.3 for data in transit, AES-256 encryption at rest, role-based access control with tenant isolation, and regular security audits. We also use Clerk for secure authentication.',
      category: 'security',
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: 'Can agencies manage multiple client organizations?',
      answer: 'Yes! Our agency mode allows you to manage multiple client tenants under a single parent account. Each client has isolated data, branding, and dashboards while you maintain overall control.',
      category: 'features',
      icon: <Users className="w-5 h-5" />
    },
    {
      question: 'How do I embed dashboards on my website?',
      answer: 'Each dashboard has a generated embed code. Simply copy the iframe code and paste it into your website. The embedded dashboard will use your tenant\'s branding settings (colors, logo) for a seamless white-label experience.',
      category: 'features',
      icon: <Globe className="w-5 h-5" />
    },
    {
      question: 'What happens if I need more storage or features?',
      answer: 'Our tiered plans (Free, Starter, Pro, Enterprise) scale with your needs. You can upgrade anytime, and we\'ll prorate the difference. Enterprise plans include custom features, dedicated support, and higher limits.',
      category: 'billing',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes! All plans include email support. Pro and Enterprise plans include priority support with faster response times. We also provide documentation, video tutorials, and a knowledge base to help you get started.',
      category: 'general',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      question: 'Can I get an invoice for my subscription?',
      answer: 'Yes, all payments generate invoices that are available in your account. You can download PDFs for your records. Invoices include all required details for business accounting.',
      category: 'billing',
      icon: <Book className="w-5 h-5" />
    },
    {
      question: 'Is my data backed up?',
      answer: 'Yes, we maintain regular backups for disaster recovery purposes. Your data is stored in Supabase with redundancy. While we maintain backups, we recommend you also export important data regularly.',
      category: 'security',
      icon: <Database className="w-5 h-5" />
    },
    {
      question: 'How do I invite team members to my organization?',
      answer: 'Organization admins can invite users through the admin portal. You can assign roles (admin, editor, viewer) to control access levels. Invited users receive email invitations to join your organization.',
      category: 'features',
      icon: <Users className="w-5 h-5" />
    }
  ];

  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'general', label: 'General', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'features', label: 'Features', icon: <Zap className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Database className="w-4 h-4" /> }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about InsightFlow</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 dark:text-blue-400">{faq.icon}</span>
                  <span className="font-medium">{faq.question}</span>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 pl-14 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="mb-6 opacity-90">Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:support@insightflow.app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
