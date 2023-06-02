import { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
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

export let loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const data = await getTemplates();
  return json(data);
};

export default function Template() {
  const loaderData = useLoaderData<MainTemplate[]>();
  const [templates, setTemplates] = useState<MainTemplate[]>(loaderData);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [showResult, setShowResult] = useState(false);

  const handleShowResult = (value: boolean | undefined | null) => {
    if (value !== undefined && value !== null) {
      return setShowResult(value);
    }
    setShowResult((prev) => !prev);
  };

  const handleSelectedTemplateId = (id: string) => {
    if (id == selectedTemplateId || !id) return;
    setSelectedTemplateId(id);
    const selectedTemplate: MainTemplate | undefined = templates.find(
      (template) => template.id == id
    );
    if (!selectedTemplate) return;
    setShowResult(false);
  };

  return (
    <div className='flex flex-col md:flex-row xs:flex-col'>
      <TemplateForm
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        setTemplateSelected={handleSelectedTemplateId}
        setShowResult={handleShowResult}
        showResult={showResult}
      />
      <TemplateDisplay
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        showResult={showResult}
      />
    </div>
  );
}
