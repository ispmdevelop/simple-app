import axios from 'axios';
import { v4 as uuidGenerator } from 'uuid';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_API_KEY = process.env.SUPABASE_SERVICE_ROL_KEY || '';

const supaHeaders = {
  Authorization: `Bearer ${SUPABASE_API_KEY}`,
  apiKey: SUPABASE_API_KEY,
};

export interface Message {
  role: string;
  content: string;
  tokenCount?: number;
}

export interface ChatRun {
  id?: string;
  messages: Message[];
  targetTokenCount?: number | undefined;
}

export async function getChatRuns(): Promise<ChatRun[] | null> {
  try {
    const response = await axios.get(`${SUPABASE_URL}/chat_run`, {
      headers: { ...supaHeaders },
    });

    return (response.data as ChatRun[]) || null;
  } catch (error) {
    throw new Error(`Error fetching chatRuns: ${error}`);
  }
}

export async function getChatRunsById(id: string): Promise<ChatRun | null> {
  try {
    const response = await axios.get(
      `${SUPABASE_URL}/chat_run?id=eq.${id}&select=*`,
      {
        headers: { ...supaHeaders },
      }
    );

    return (response.data[0] as ChatRun) || null;
  } catch (error) {
    throw new Error(`Error fetching chatRuns: ${error}`);
  }
}

export async function createChatRun(chatRun: ChatRun): Promise<ChatRun | null> {
  try {
    const uuid = uuidGenerator();
    await axios.post(
      `${SUPABASE_URL}/chat_run`,
      { ...chatRun, id: uuid },
      {
        headers: { ...supaHeaders },
      }
    );

    const data = await getChatRunsById(uuid);

    return (data as ChatRun) || null;
  } catch (error) {
    throw new Error(`Error fetching chatRuns: ${error}`);
  }
}

export async function updateChatRun(
  id: string,
  chatRun: ChatRun
): Promise<ChatRun | null> {
  try {
    await axios.put(
      `${SUPABASE_URL}/chat_run?id=eq.${id}`,
      { ...chatRun, id },
      {
        headers: { ...supaHeaders },
      }
    );
    const data = await getChatRunsById(id);
    return data;
  } catch (error) {
    throw new Error(`Error fetching chatRuns: ${error}`);
  }
}

export async function deleteChatRun(id: string): Promise<boolean> {
  try {
    await axios.delete(`${SUPABASE_URL}/chat_run?id=eq.${id}`, {
      headers: { ...supaHeaders },
    });

    return true;
  } catch (error) {
    throw new Error(`Error fetching chatRuns: ${error}`);
  }
}
