import { useState, useEffect } from 'react';
import { Button, buttonVariants } from '../../components/ui/button';

type TemplateDisplayProps = {
  templates: DisplayTemplate[];
  selectedTemplateId: string | null;
  fields: Field[];
  showResult: boolean;
};

type DisplayTemplate = {
  id: string;
  fields: string;
  body: string;
  preview: string;
  initialPrompt: string;
};

type Field = {
  name: string;
  value: string;
};

export default function TemplateDisplay(props: TemplateDisplayProps) {
  const { templates, selectedTemplateId, fields, showResult } = props;

  const [response, setResponse] = useState('');

  const [copied, setCopied] = useState(false);

  const selectedTemplate = templates.find(
    (template) => template.id == selectedTemplateId
  );

  useEffect(() => {
    console.log('Change copied!', copied);
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  }, [copied]);

  return (
    <div id='template-display' className='w-full mt-4'>
      <h1 className='text-3xl text-bold text-center mb-3'>
        Preview Of Selected Script
      </h1>
      <div
        className='w-11/12 p-4 bg-white w-100 rounded-md m-auto'
        style={{ height: '80vh' }}
      >
        <textarea
          disabled
          className='w-full h-full bg-transparent outline-none resize-none text-lg '
          value={selectedTemplate?.preview || ''}
        />
      </div>
      <div className='w-full flex items-center' style={{ height: '10vh' }}>
        <Button
          className={`${buttonVariants({
            variant: 'outline',
          })} bg-blue-700 text-white mx-auto hover:bg-blue-500`}
        >
          Have AirChat Customize This Template
        </Button>
      </div>
    </div>
  );
}
