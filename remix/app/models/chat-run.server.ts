import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_API_KEY = process.env.SUPABASE_SERVICE_ROL_KEY || '';

export interface Message {
  role: string;
  content: string;
}

export interface ChatRun {
  id?: string;
  messages: Message[];
}

export async function getChatRuns(): Promise<ChatRun[] | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  const { data, error } = await supabase.from('chat_run').select('*');

  if (error) {
    throw new Error(`Error fetching chatRun: ${error.message}`);
  }

  return (data as ChatRun[]) || null;
}

export async function getChatRunsById(id: string): Promise<ChatRun | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  const { data, error } = await supabase
    .from('chat_run')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching chatRun by Id: ${error.message}`);
  }

  return (data as ChatRun) || null;
}

export async function createChatRun(chatRun: ChatRun): Promise<ChatRun | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  const { data, error } = await supabase
    .from('chat_run')
    .insert([chatRun])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating chatRun: ${error.message}`);
  }

  return (data as ChatRun) || null;
}

export async function updateChatRun(
  id: string,
  chatRun: ChatRun
): Promise<ChatRun | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  const { data, error } = await supabase
    .from('chat_run')
    .update([chatRun])
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating chatRun: ${error.message}`);
  }

  return (data as ChatRun) || null;
}

export async function deleteChatRun(id: string): Promise<boolean> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  const { error } = await supabase
    .from<'chatRun', ChatRun>('chatRun')
    .delete()
    .match({ id });

  if (error) {
    throw new Error(`Error deleting chatRun: ${error.message}`);
  }

  return true;
}
