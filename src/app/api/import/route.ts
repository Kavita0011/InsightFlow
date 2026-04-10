import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

interface ParsedData {
  columns: string[];
  rows: Record<string, string>[];
}

function parseCSV(content: string): ParsedData {
  const lines = content.trim().split('\n');
  if (lines.length === 0) {
    return { columns: [], rows: [] };
  }

  const columns = lines[0].split(',').map(col => col.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    columns.forEach((col, index) => {
      row[col] = values[index] || '';
    });
    rows.push(row);
  }

  return { columns, rows };
}

function parseExcel(buffer: Buffer): ParsedData {
  return parseCSV(buffer.toString('utf-8'));
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const dataSourceId = formData.get('dataSourceId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: 'Invalid file type. Only CSV and Excel files are allowed.' }, { status: 400 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let parsed: ParsedData;
    if (file.name.endsWith('.csv')) {
      parsed = parseCSV(buffer.toString('utf-8'));
    } else {
      parsed = parseExcel(buffer);
    }

    if (parsed.columns.length === 0 || parsed.rows.length === 0) {
      return NextResponse.json({ error: 'File is empty or invalid format' }, { status: 400 });
    }

    const { data: dataUpload, error } = await supabase
      .from('data_uploads')
      .insert({
        org_id: userData.org_id,
        data_source_id: dataSourceId || undefined,
        file_name: file.name,
        row_count: parsed.rows.length,
        column_count: parsed.columns.length,
        columns: parsed.columns,
        parsed_data: parsed.rows,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (dataSourceId) {
      await supabase
        .from('data_sources')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', dataSourceId);
    }

    return NextResponse.json({
      success: true,
      dataUpload: {
        ...dataUpload,
        columns: parsed.columns,
        rowCount: parsed.rows.length,
      },
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to upload CSV/Excel files',
    supportedFormats: ['.csv', '.xlsx', '.xls'],
    maxSize: '10MB',
  });
}
