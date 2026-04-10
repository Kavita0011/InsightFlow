'use client';

import { useState, useEffect } from 'react';
import { 
  Database, Plus, Trash2, Edit3, Upload, FileSpreadsheet, 
  Table, Clock, RefreshCw, MoreVertical, Check, X, Search,
  ArrowRight, Download, ChevronRight
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'manual' | 'csv' | 'excel' | 'google_sheets';
  last_sync: string | null;
  created_at: string;
  row_count?: number;
}

export default function DataSourcesPage() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data/sources');
      const data = await response.json();
      setDataSources(data.dataSources || []);
    } catch (error) {
      console.error('Error fetching data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDataSource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this data source?')) return;
    
    try {
      const response = await fetch(`/api/data/sources/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setDataSources(dataSources.filter(ds => ds.id !== id));
      }
    } catch (error) {
      console.error('Error deleting data source:', error);
    }
  };

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'manual': return <Table className="w-5 h-5" />;
      case 'csv': return <FileSpreadsheet className="w-5 h-5" />;
      case 'excel': return <FileSpreadsheet className="w-5 h-5" />;
      case 'google_sheets': return <Database className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: DataSource['type']) => {
    switch (type) {
      case 'manual': return 'Manual Entry';
      case 'csv': return 'CSV Import';
      case 'excel': return 'Excel Import';
      case 'google_sheets': return 'Google Sheets';
      default: return type;
    }
  };

  const filteredSources = dataSources.filter(ds => 
    ds.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Data Sources</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your data connections and imports</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Data Source
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search data sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Data Sources Grid */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-gray-400" />
            <p className="text-gray-500 mt-2">Loading data sources...</p>
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Sources Yet</h2>
            <p className="text-gray-500 mb-4">Connect your first data source to start building dashboards</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Data Source
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map((source) => (
              <div 
                key={source.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                      {getTypeIcon(source.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      <p className="text-sm text-gray-500">{getTypeLabel(source.type)}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Table className="w-4 h-4" />
                    {source.row_count || 0} rows
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {source.last_sync ? new Date(source.last_sync).toLocaleDateString() : 'Never'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Upload className="w-4 h-4" />
                    Import
                  </button>
                  <button 
                    onClick={() => deleteDataSource(source.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Data Source Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Add Data Source</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Table className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Manual Entry</h3>
                      <p className="text-sm text-gray-500">Enter data directly through forms</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                  </div>
                </button>

                <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">CSV/Excel Import</h3>
                      <p className="text-sm text-gray-500">Upload CSV or Excel files</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                  </div>
                </button>

                <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Google Sheets</h3>
                      <p className="text-sm text-gray-500">Connect to Google Sheets (Phase 3)</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
