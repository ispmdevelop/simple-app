import { useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import TemplateDisplay from '../components/Template/TemplateDisplay';
import TemplateForm from '../components/Template/TemplateForm';
import { getTemplates } from '../models/template.server';

type MainTemplate = {
  id: string;
  body: string;
  fields: string;
  name: string;
};

type Field = {
  name: string;
  value: string;
  error: string;
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
  const [fields, setFields] = useState<Field[]>([]);
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
    let fieldObject: Field[] = [];
    try {
      fieldObject = JSON.parse(selectedTemplate.fields);
    } catch (e) {
      console.log(e);
    }
    console.log(fieldObject);
    setFields(fieldObject);
    setShowResult(false);
  };

  const resetFields = () => {
    setFields((prevFields) => {
      const copy: Field[] = JSON.parse(JSON.stringify(prevFields));
      copy.forEach((field) => {
        field.value = '';
        field.error = '';
      });
      console.log('resetFields');
      return copy;
    });
  };

  const handleSetFields = (name: string, value: string, error: string) => {
    setFields((prevFields) => {
      const copy = JSON.parse(JSON.stringify(prevFields));
      const fieldObject = copy.find((field: Field) => field.name === name);
      if (fieldObject) {
        fieldObject.value = value;
        fieldObject.error = error;
      }
      return copy;
    });
  };

  return (
    <div className='flex flex-col md:flex-row xs:flex-col'>
      <TemplateForm
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        setTemplateSelected={handleSelectedTemplateId}
        fields={fields}
        handleSetFields={handleSetFields}
        setShowResult={handleShowResult}
        showResult={showResult}
        resetFields={resetFields}
      />
      <TemplateDisplay
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        fields={fields}
        showResult={showResult}
      />
    </div>
  );
}
