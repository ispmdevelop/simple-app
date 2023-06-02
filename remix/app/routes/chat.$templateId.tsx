import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { chatCompletion } from '../models/chatgpt.server';
import { getTemplatesById } from '../models/template.server';
import { createChatRun } from '../models/chat-run.server';

import { ChatCompletionRequestMessageRoleEnum } from 'openai';

type ChatGPTMessage = {
  role: ChatCompletionRequestMessageRoleEnum;
  content: string;
  tokenCount?: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const templateId = params?.templateId;
  if (!templateId) return redirect('/');
  const template = await getTemplatesById(templateId);
  console.log('template', template);
  if (!template) return redirect('/');
  const messages: ChatGPTMessage[] | undefined = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: template.initialPrompt,
    },
  ];
  console.log('messages', messages);
  const aiResponse = await chatCompletion(messages);
  console.log('aiResponse', aiResponse);
  const message = aiResponse.choices[0].message as ChatGPTMessage;
  messages.push(message);
  if (aiResponse.usage?.completion_tokens === undefined) return redirect('/');
  const response = await createChatRun({
    messages,
    targetTokenCount: aiResponse.usage.prompt_tokens / 3 ?? 300,
  });
  console.log('createChatRun', response);
  if (!response) return redirect('/');
  return redirect(`/chat-run/${response.id}`);
};
