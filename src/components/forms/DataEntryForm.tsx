'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Save } from 'lucide-react';

const dataEntrySchema = z.object({
  fields: z.array(
    z.object({
      name: z.string().min(1, 'Field name required'),
      type: z.enum(['string', 'number', 'date', 'boolean']),
    })
  ),
  rows: z.array(
    z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.literal('')]))
  ),
});

export type DataEntryFormData = z.infer<typeof dataEntrySchema>;

interface DataEntryFormProps {
  dataSourceName: string;
  initialFields?: Array<{ name: string; type: 'string' | 'number' | 'date' | 'boolean' }>;
  onSubmit: (data: DataEntryFormData) => Promise<void>;
}

export function DataEntryForm({ dataSourceName, initialFields = [], onSubmit }: DataEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DataEntryFormData>({
    resolver: zodResolver(dataEntrySchema),
    defaultValues: {
      fields: initialFields.length > 0 ? initialFields : [{ name: '', type: 'string' }],
      rows: [{}],
    },
  });

  const { fields: fieldArray, append: addField, remove: removeField } = useFieldArray({
    control,
    name: 'fields',
  });

  const { fields: rowArray, append: addRow, remove: removeRow } = useFieldArray({
    control,
    name: 'rows',
  });

  const handleFormSubmit = async (data: DataEntryFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Data Entry: {dataSourceName}</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Field Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {fieldArray.map((field, index) => (
                <tr key={field.id}>
                  <td className="px-4 py-2">
                    <input
                      {...register(`fields.${index}.name`)}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="field_name"
                    />
                    {errors.fields?.[index]?.name && (
                      <p className="text-red-500 text-xs">{errors.fields[index]?.name?.message}</p>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      {...register(`fields.${index}.type`)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="string">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="boolean">Yes/No</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      disabled={fieldArray.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 border-t bg-gray-50">
            <button
              type="button"
              onClick={() => addField({ name: '', type: 'string' })}
              className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" /> Add Field
            </button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b font-medium">Data Rows</div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {fieldArray.map((field, index) => (
                    <th key={field.id} className="px-4 py-2 text-left text-sm font-medium">
                      {`fields.${index}.name` || `Field ${index + 1}`}
                    </th>
                  ))}
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {rowArray.map((row, rowIndex) => (
                  <tr key={row.id}>
                    {fieldArray.map((field, fieldIndex) => (
                      <td key={field.id} className="px-4 py-2">
                        <input
                          {...register(`rows.${rowIndex}.${field.name || `field_${fieldIndex}`}`)}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="Enter value..."
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeRow(rowIndex)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        disabled={rowArray.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t bg-gray-50">
            <button
              type="button"
              onClick={() => addRow({})}
              className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Data'}
        </button>
      </form>
    </div>
  );
}
