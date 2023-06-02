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

export async function chatCompletion(
  messages: ChatCompletionRequestMessage[]
): Promise<CreateChatCompletionResponse> {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching chatRuns: ${error}`);
  }
}
