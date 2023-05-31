import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_API_KEY = process.env.SUPABASE_SERVICE_ROL_KEY || '';

export interface Template {
  id?: string;
  body: string;
  fields: string;
  name: string;
}

export async function getTemplates(): Promise<Template[] | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  const { data, error } = await supabase.from('template').select('*');

  if (error) {
    throw new Error(`Error fetching template: ${error.message}`);
  }

  return (data as Template[]) || null;
}

export async function createTemplate(
  template: Template
): Promise<Template | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  const { data, error } = await supabase
    .from('template')
    .insert([template])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating template: ${error.message}`);
  }

  return (data as Template) || null;
}

export async function deleteTemplate(id: number): Promise<boolean> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  const { error } = await supabase
    .from<'template', Template>('template')
    .delete()
    .match({ id });

  if (error) {
    throw new Error(`Error deleting template: ${error.message}`);
  }

  return true;
}
