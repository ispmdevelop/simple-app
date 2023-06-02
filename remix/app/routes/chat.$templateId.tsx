import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { chatCompletion } from '../models/chatgpt.server';
import { getTemplatesById } from '../models/template.server';
import { createChatRun } from '../models/chat-run.server';

import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export const loader: LoaderFunction = async ({ request, params }) => {
  const templateId = params?.templateId;
  if (!templateId) return redirect('/');
  const template = await getTemplatesById(+templateId);
  if (!template) return redirect('/');
  const messages:
    | { role: ChatCompletionRequestMessageRoleEnum; content: string }[]
    | undefined = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: template.initialPrompt,
    },
  ];
  const aiResponse = await chatCompletion(messages);
  const message = aiResponse.choices[0].message as {
    role: ChatCompletionRequestMessageRoleEnum;
    content: string;
  };
  messages.push(message);
  const response = await createChatRun({ messages });
  if (!response) return redirect('/');
  return redirect(`/chat-run/${response.id}`);
};
