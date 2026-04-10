'use client';

import { useState } from 'react';
import { 
  User, Building2, Bell, Shield, Palette, Save, 
  Check, Upload, Globe, Mail, Lock, Smartphone
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Admin',
    email: 'devappkavita@gmail.com',
    phone: '+91 45065 191325',
    timezone: 'Asia/Kolkata'
  });

  const [org, setOrg] = useState({
    name: 'InsightFlow HQ',
    domain: 'insightflow.app',
    primaryColor: '#3B82F6',
    currency: 'INR'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReport: true,
    productUpdates: false,
    securityAlerts: true
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and organization settings</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Profile Settings</h2>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      A
                    </div>
                    <div>
                      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                        <Upload className="w-4 h-4" />
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Timezone</label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              )}

              {activeTab === 'organization' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Organization Settings</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Organization Name</label>
                      <input
                        type="text"
                        value={org.name}
                        onChange={(e) => setOrg({ ...org, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Domain</label>
                      <input
                        type="text"
                        value={org.domain}
                        onChange={(e) => setOrg({ ...org, domain: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={org.primaryColor}
                          onChange={(e) => setOrg({ ...org, primaryColor: e.target.value })}
                          className="w-12 h-10 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={org.primaryColor}
                          onChange={(e) => setOrg({ ...org, primaryColor: e.target.value })}
                          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Currency</label>
                      <select
                        value={org.currency}
                        onChange={(e) => setOrg({ ...org, currency: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'emailAlerts', label: 'Email Alerts', desc: 'Get notified about important events' },
                      { key: 'weeklyReport', label: 'Weekly Reports', desc: 'Receive weekly summary reports' },
                      { key: 'productUpdates', label: 'Product Updates', desc: 'Stay informed about new features' },
                      { key: 'securityAlerts', label: 'Security Alerts', desc: 'Get security notifications immediately' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications]
                              ? 'bg-blue-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Lock className="w-5 h-5 text-gray-600" />
                        <h3 className="font-medium">Change Password</h3>
                      </div>
                      <div className="grid gap-3">
                        <input type="password" placeholder="Current password" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                        <input type="password" placeholder="New password" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                        <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account</p>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <h3 className="font-medium">Active Sessions</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Manage your active sessions across devices</p>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                        View Sessions
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Appearance Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="p-4 border-2 border-blue-500 rounded-lg text-center">
                        <div className="w-full h-8 bg-white border rounded mb-2" />
                        <p className="text-sm">Light</p>
                      </button>
                      <button className="p-4 border rounded-lg text-center hover:border-gray-300">
                        <div className="w-full h-8 bg-gray-800 border border-gray-600 rounded mb-2" />
                        <p className="text-sm">Dark</p>
                      </button>
                      <button className="p-4 border rounded-lg text-center hover:border-gray-300">
                        <div className="w-full h-8 bg-gradient-to-r from-white to-gray-800 border rounded mb-2" />
                        <p className="text-sm">System</p>
                      </button>
                    </div>
                  </div>

                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
