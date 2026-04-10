'use client';

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface ImportResult {
  success: boolean;
  rowCount?: number;
  columns?: string[];
  error?: string;
}

export function FileImport({ dataSourceId, onSuccess }: { dataSourceId?: string; onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setResult({ success: false, error: 'Invalid file type. Use CSV or Excel.' });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setResult({ success: false, error: 'File too large. Max 10MB.' });
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (dataSourceId) formData.append('dataSourceId', dataSourceId);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          rowCount: data.dataUpload?.rowCount,
          columns: data.dataUpload?.columns,
        });
        onSuccess?.();
      } else {
        setResult({ success: false, error: data.error || 'Import failed' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Upload className="w-4 h-4" />
        Import File
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Import Data
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="font-medium">Click to upload file</p>
            <p className="text-sm text-gray-500 mt-1">CSV, XLSX, or XLS (max 10MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={reset} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={result.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                    {result.success ? `Imported ${result.rowCount} rows successfully!` : result.error}
                  </span>
                </div>
                {result.success && result.columns && (
                  <p className="text-sm text-gray-500 mt-2">
                    Columns: {result.columns.join(', ')}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
