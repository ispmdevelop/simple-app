import {
  Configuration,
  OpenAIApi,
  type CreateChatCompletionResponse,
  type ChatCompletionRequestMessage,
} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const temperature = process.env.OPEN_AI_TEMPERATURE || 0;
const model = process.env.OPEN_AI_MODEL || '';

export async function chatCompletion(
  messages: ChatCompletionRequestMessage[]
): Promise<CreateChatCompletionResponse> {
  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
      temperature: +temperature,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching chatRuns: ${error}`);
  }
}
