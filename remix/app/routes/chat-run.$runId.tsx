import { ScrollArea } from '~/components/ui/scroll-area';
import { Spinner } from '~/components/ui/spinner';
import { Button } from '~/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import type { ActionArgs, LoaderFunction } from '@remix-run/node';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { json } from '@remix-run/node';
import {
  useLoaderData,
  Form,
  useParams,
  useActionData,
  useNavigation,
} from '@remix-run/react';
import { useEffect, useState, useRef } from 'react';
import type {
  Message as ChatRunMessage,
  Message,
} from '../models/chat-run.server';
import {
  getChatRunsById,
  type ChatRun as ChatRunDto,
  updateChatRun,
} from '../models/chat-run.server';
import { chatCompletion } from '../models/chatgpt.server';
import type { ChatCompletionRequestMessage } from 'openai';
import airLogo from '~/assets/airIcon.png';
import { Input } from '~/components/ui/input';

export async function action({ request, params }: ActionArgs) {
  try {
    const form = await request.formData();
    const content = form.get('message');
    const message = {
      role: 'user',
      content,
    };
    const chatRunId = params?.runId;
    if (!chatRunId) return json({ success: false, data: 'no chat run id' });
    const chatRun = await getChatRunsById(chatRunId);
    if (!chatRun) return json({ success: false, data: 'no chat run' });
    chatRun.messages.push(message as Message);
    const formattedMessages = chatRun.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
    const response = await chatCompletion(
      formattedMessages as ChatCompletionRequestMessage[]
    );
    chatRun.messages.push({
      ...response.choices[0].message,
      tokenCount: response.usage?.completion_tokens,
    } as Message);
    const updatedChatRun = await updateChatRun(chatRunId, chatRun);
    return json({ success: true, data: updatedChatRun });
  } catch (e: unknown) {
    console.log('Error when posting message', e);
    return json({ success: false, data: 'Error when posting message' });
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log('params', params);
  if (params?.runId === undefined) return json({});
  const chatRun = await getChatRunsById(params?.runId);
  return json(chatRun);
};

export default function ChatRun() {
  const loaderData = useLoaderData<ChatRunDto | null>();
  const routeParams = useParams();
  const actionData = useActionData<ChatRunDto | string>();
  const [message, setMessage] = useState<string>();
  const [chatOver, setChatOver] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigation = useNavigation();
  const scrollRef = useRef<HTMLDivElement>();

  useEffect(() => {
    console.log('loaderData', loaderData);
    isFinalScriptResponse(loaderData?.messages || []);
  }, [loaderData]);

  useEffect(() => {
    console.log('actionData', actionData);
  }, [actionData]);

  useEffect(() => {
    if (navigation.state === 'submitting') {
      setMessage('');
    }
    console.log(scrollRef.current);
    scrollRef.current?.scrollIntoView(false);
  }, [navigation.state]);

  const renderMessages = (message: ChatRunMessage, index: number) => {
    if (index === 0) return null;
    if (message.role === 'user') {
      return (
        <div className='h-fit' key={`gtp-message-${index}`}>
          <div
            className='bg-blue-500 w-fit p-2 rounded-lg ml-auto'
            style={{ maxWidth: '70%' }}
          >
            <p className='whitespace-pre-line text-white'>{message.content}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className='flex flex-row h-fit' key={`gtp-message-${index}`}>
          <Avatar className='my-auto mr-2'>
            <AvatarImage src={airLogo} />
            <AvatarFallback className='bg-gray-500  text-white'>
              S
            </AvatarFallback>
          </Avatar>
          <div
            className='bg-gray-200 w-fit p-2 rounded-lg'
            style={{ maxWidth: '70%' }}
          >
            <p className='whitespace-pre-line'>{message.content}</p>
          </div>
        </div>
      );
    }
  };

  const renderLoadingMessage = () => {
    return (
      <div className='flex flex-row h-fit' key={`gtp-message-loading`}>
        <Avatar className='my-auto mr-2'>
          <AvatarImage src={airLogo} />
          <AvatarFallback className='bg-gray-500  text-white'>S</AvatarFallback>
        </Avatar>
        <div
          className='bg-gray-200 w-fit p-2 rounded-lg'
          style={{ maxWidth: '70%' }}
        >
          <Spinner />
        </div>
      </div>
    );
  };

  const isFinalScriptResponse = (messages: ChatRunMessage[]) => {
    if (chatOver) return;
    if (!loaderData) return false;
    messages.forEach((message) => {
      if (!message.tokenCount || !loaderData?.targetTokenCount) return;
      if (
        message.role === 'assistant' &&
        message.tokenCount >= loaderData?.targetTokenCount
      ) {
        setChatOver(true);
      }
    });
  };

  return (
    <>
      <div className='flex flex-col p-3 gap-2' style={{ height: '100vh' }}>
        <ScrollArea
          className='flex flex-col gap-2 overflow-y-auto border-2 px-2 py-1 rounded'
          style={{ height: '94%' }}
        >
          <div
            className='flex flex-col p-2 w-full gap-2'
            ref={scrollRef as any}
          >
            {loaderData &&
              loaderData.messages &&
              loaderData.messages.map((message, index) =>
                renderMessages(message, index)
              )}
            {navigation.state === 'submitting' && renderLoadingMessage()}
          </div>
        </ScrollArea>
        <Form
          method='post'
          action={`/chat-run/${routeParams.runId}`}
          className='flex flex-row border-2 rounded'
          style={{ height: '7%' }}
        >
          {chatOver === true ? (
            <div className='w-full min-h-full'>
              {copied ? (
                <button className='w-full min-h-full bg-blue-500 text-white font-bold rounded'>
                  Successfully copied! You can now close this popup
                </button>
              ) : (
                <CopyToClipboard
                  text={
                    loaderData?.messages[loaderData?.messages.length - 1]
                      .content || ''
                  }
                  onCopy={() => setCopied(true)}
                >
                  <button className='w-full min-h-full bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'>
                    Copy script to clipboard
                  </button>
                </CopyToClipboard>
              )}
            </div>
          ) : (
            <>
              <Input
                onChange={(e) => setMessage(e.target.value)}
                name='message'
                className='m-w-full m-h-full min-h-full resize-none  border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:ring-white focus-visible:ring-opacity-50 focus-visible:ring-offset-opacity-50
            focus-visible:border-2 focus-visible:border-blue-500'
                placeholder='Type your message here...'
                value={message}
              />
              <Button
                type='submit'
                variant='outline'
                disabled={
                  navigation.state === 'submitting' ||
                  !message ||
                  message.trim() === ''
                }
                className='m-w-full m-h-full min-h-full text-blue-500 hover:bg-blue-500  border-0 hover:text-white'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  className='fill-blue-700 w-6 h-6 hover:fill-white'
                >
                  <path d='M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z' />
                </svg>
              </Button>{' '}
            </>
          )}
        </Form>
      </div>
    </>
  );
}
