'use client';

import { useState } from 'react';
import {
  Users, Building2, CreditCard, BarChart3, Settings, Search, Filter,
  MoreVertical, Plus, Mail, Phone, Globe, Calendar, DollarSign,
  CheckCircle, XCircle, Clock, AlertTriangle, Download, RefreshCw,
  PieChart, TrendingUp, UserCheck, UserX, Activity, Shield
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  slug: string;
  email: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  users: number;
  dashboards: number;
  createdAt: string;
  lastActive: string;
  revenue: number;
  primaryColor: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    email: 'admin@acme.com',
    plan: 'enterprise',
    status: 'active',
    users: 12,
    dashboards: 8,
    createdAt: '2025-06-15',
    lastActive: '2026-04-09',
    revenue: 24000,
    primaryColor: '#3B82F6'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    slug: 'techstart',
    email: 'hello@techstart.io',
    plan: 'pro',
    status: 'active',
    users: 5,
    dashboards: 4,
    createdAt: '2025-09-22',
    lastActive: '2026-04-10',
    revenue: 4800,
    primaryColor: '#10B981'
  },
  {
    id: '3',
    name: 'Global Media',
    slug: 'global-media',
    email: 'team@globalmedia.com',
    plan: 'starter',
    status: 'active',
    users: 3,
    dashboards: 2,
    createdAt: '2025-11-08',
    lastActive: '2026-04-05',
    revenue: 1200,
    primaryColor: '#F59E0B'
  },
  {
    id: '4',
    name: 'DataDriven Co',
    slug: 'datadriven',
    email: 'info@datadriven.co',
    plan: 'free',
    status: 'pending',
    users: 1,
    dashboards: 0,
    createdAt: '2026-04-01',
    lastActive: '2026-04-01',
    revenue: 0,
    primaryColor: '#8B5CF6'
  },
  {
    id: '5',
    name: 'FinServe Ltd',
    slug: 'finserve',
    email: 'admin@finserve.com',
    plan: 'enterprise',
    status: 'suspended',
    users: 8,
    dashboards: 6,
    createdAt: '2025-03-20',
    lastActive: '2026-02-15',
    revenue: 18000,
    primaryColor: '#EF4444'
  },
];

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const stats: StatCard[] = [
    {
      title: 'Total Clients',
      value: '156',
      change: '+12%',
      changeType: 'up',
      icon: <Building2 className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8%',
      changeType: 'up',
      icon: <Users className="w-6 h-6 text-green-600" />
    },
    {
      title: 'Monthly Revenue',
      value: '$48,200',
      change: '+15%',
      changeType: 'up',
      icon: <DollarSign className="w-6 h-6 text-purple-600" />
    },
    {
      title: 'Total Dashboards',
      value: '892',
      change: '+24%',
      changeType: 'up',
      icon: <BarChart3 className="w-6 h-6 text-orange-600" />
    },
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || client.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getStatusBadge = (status: Client['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    };
    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      suspended: <XCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPlanBadge = (plan: Client['plan']) => {
    const styles = {
      free: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      pro: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[plan]}`}>
        {plan}
      </span>
    );
  };

  const totalRevenue = clients.reduce((sum, c) => sum + c.revenue, 0);
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalUsers = clients.reduce((sum, c) => sum + c.users, 0);
  const totalDashboards = clients.reduce((sum, c) => sum + c.dashboards, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your clients and platform</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add Client
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'up' ? 'text-green-600' : 
                  stat.changeType === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dashboards</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: client.primaryColor }}
                        >
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getPlanBadge(client.plan)}</td>
                    <td className="px-6 py-4">{getStatusBadge(client.status)}</td>
                    <td className="px-6 py-4 text-sm">{client.users}</td>
                    <td className="px-6 py-4 text-sm">{client.dashboards}</td>
                    <td className="px-6 py-4 text-sm font-medium">${client.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{client.lastActive}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredClients.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No clients found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeClients}</div>
                <div className="text-sm text-gray-500">Active Clients</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalDashboards}</div>
                <div className="text-sm text-gray-500">Total Dashboards</div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: selectedClient.primaryColor }}
                  >
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                    <p className="text-gray-500">@{selectedClient.slug}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Plan</div>
                  <div className="font-medium capitalize">{selectedClient.plan}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  {getStatusBadge(selectedClient.status)}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Users</div>
                  <div className="font-medium">{selectedClient.users}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Dashboards</div>
                  <div className="font-medium">{selectedClient.dashboards}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Settings className="w-4 h-4" />
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
