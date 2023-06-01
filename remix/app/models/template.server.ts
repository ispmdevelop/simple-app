import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_API_KEY = process.env.SUPABASE_SERVICE_ROL_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export interface Template {
  id?: string;
  body: string;
  fields: string;
  name: string;
  preview: string;
  initialPrompt: string;
}

export async function getTemplates(): Promise<Template[] | null> {
  const { data, error } = await supabase.from('template').select('*');

  if (error) {
    throw new Error(`Error fetching template: ${error.message}`);
  }

  return (data as Template[]) || null;
}

export async function createTemplate(
  template: Template
): Promise<Template | null> {
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

export async function updateTemplate(
  id: number,
  template: Template
): Promise<Template | null> {
  const { data, error } = await supabase
    .from('template')
    .update([template])
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating template: ${error.message}`);
  }

  return (data as Template) || null;
}

export async function deleteTemplate(id: number): Promise<boolean> {
  const { error } = await supabase
    .from<'template', Template>('template')
    .delete()
    .match({ id });

  if (error) {
    throw new Error(`Error deleting template: ${error.message}`);
  }

  return true;
}
