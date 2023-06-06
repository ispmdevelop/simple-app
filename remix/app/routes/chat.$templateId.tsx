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
  try {
    const templateId = params?.templateId;
    if (!templateId) return redirect('/');
    const template = await getTemplatesById(templateId);
    if (!template) return redirect('/');
    const messages: ChatGPTMessage[] | undefined = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: template.initialPrompt,
      },
    ];
    const aiResponse = await chatCompletion(messages);
    const message = aiResponse.choices[0].message as ChatGPTMessage;
    messages.push(message);
    if (aiResponse.usage?.completion_tokens === undefined) return redirect('/');
    const response = await createChatRun({
      messages,
      targetTokenCount: aiResponse.usage.prompt_tokens / 3 ?? 300,
    });
    if (!response) return redirect('/');
    return redirect(`/chat-run/${response.id}`);
  } catch (e) {
    console.error(e);
    return redirect(
      `/template?error=${`There has been an error please try again (${e.message})`}`
    );
  }
};
