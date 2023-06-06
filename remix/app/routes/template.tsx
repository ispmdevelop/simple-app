import { useEffect, useState } from 'react';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import type { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import TemplateDisplay from '../components/Template/TemplateDisplay';
import TemplateForm from '../components/Template/TemplateForm';
import { getTemplates } from '../models/template.server';

type MainTemplate = {
  id: string;
  name: string;
  preview: string;
  initialPrompt: string;
};

type Response = {
  error: boolean;
  data: MainTemplate[];
  message: string;
};

export let loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  try {
    const data = await getTemplates();
    return json({
      error: false,
      data,
    });
  } catch (e) {
    console.log('Error when posting message', e);
    return json({
      error: true,
      message:
        'There was an error loading the templates, please refresh the page or try again later.',
    });
  }
};

export default function Template() {
  const loaderData = useLoaderData<Response>();
  const [templates, setTemplates] = useState<MainTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error')) {
      setError(searchParams.get('error') ?? '');
    } else {
      setError('');
    }
  }, []);

  useEffect(() => {
    if (loaderData.error === false) {
      setTemplates(loaderData.data);
      setError('');
    } else {
      setError(loaderData.message);
    }
  }, [loaderData]);

  const handleSelectedTemplateId = (id: string) => {
    if (id == selectedTemplateId || !id) return;
    setSelectedTemplateId(id);
    const selectedTemplate: MainTemplate | undefined = templates.find(
      (template) => template.id == id
    );
    if (!selectedTemplate) return;
  };

  const getURLErrorMessage = () => {
    const error = searchParams.get('error');
    if (!error) return '';
    return (
      <div>
        <p className='text-red-500'>{searchParams.get('error')}</p>
      </div>
    );
  };

  return (
    <>
      <div className='flex flex-col md:flex-row xs:flex-col'>
        {error && error.length > 0 ? (
          <div
            className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 w-full'
            role='alert'
          >
            <p className='font-bold'>Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <TemplateForm
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            setTemplateSelected={handleSelectedTemplateId}
          />
        )}
        <div className='w-full'>
          <TemplateDisplay
            templates={templates}
            selectedTemplateId={selectedTemplateId}
          />
          <div className='text-center'>{getURLErrorMessage()}</div>
        </div>
      </div>
    </>
  );
}
