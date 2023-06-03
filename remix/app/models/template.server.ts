import axios from 'axios';
import { v4 as uuidGenerator } from 'uuid';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_API_KEY = process.env.SUPABASE_SERVICE_ROL_KEY || '';

const supaHeaders = {
  Authorization: `Bearer ${SUPABASE_API_KEY}`,
  apiKey: SUPABASE_API_KEY,
};

export interface Template {
  id?: string;
  name: string;
  preview: string;
  initialPrompt: string;
}

export async function getTemplates(): Promise<Template[] | null> {
  try {
    const response = await axios.get(`${SUPABASE_URL}/template`, {
      headers: { ...supaHeaders },
    });

    return (response.data as Template[]) || null;
  } catch (error) {
    throw new Error(`Error getTemplates: ${error}`);
  }
}

export async function getTemplatesById(id: string): Promise<Template | null> {
  try {
    const response = await axios.get(
      `${SUPABASE_URL}/template?id=eq.${id}&select=*`,
      {
        headers: { ...supaHeaders },
      }
    );

    return (response.data[0] as Template) || null;
  } catch (error) {
    throw new Error(`Error getTemplatesById: ${error}`);
  }
}

export async function createTemplate(
  template: Template
): Promise<Template | null> {
  try {
    const uuid = uuidGenerator();
    await axios.post(
      `${SUPABASE_URL}/template`,
      { ...template, id: uuid },
      {
        headers: { ...supaHeaders },
      }
    );

    const data = await getTemplatesById(uuid);

    return (data as Template) || null;
  } catch (error) {
    throw new Error(`Error createTemplate: ${error}`);
  }
}

export async function updateTemplate(
  id: string,
  template: Template
): Promise<Template | null> {
  try {
    await axios.put(
      `${SUPABASE_URL}/template?id=eq.${id}`,
      { ...template, id },
      {
        headers: { ...supaHeaders },
      }
    );
    const data = await getTemplatesById(id);
    return data;
  } catch (error) {
    throw new Error(`Error updateTemplate: ${error}`);
  }
}

export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    await axios.delete(`${SUPABASE_URL}/template?id=eq.${id}`, {
      headers: { ...supaHeaders },
    });

    return true;
  } catch (error) {
    throw new Error(`Error deleteTemplate: ${error}`);
  }
}
