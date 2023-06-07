import { Button, buttonVariants } from '../../components/ui/button';
import { Link, useNavigation } from '@remix-run/react';

type TemplateDisplayProps = {
  templates: DisplayTemplate[];
  selectedTemplateId: string | null;
};

type DisplayTemplate = {
  id: string;
  preview: string;
  initialPrompt: string;
};

export default function TemplateDisplay(props: TemplateDisplayProps) {
  const { templates, selectedTemplateId } = props;
  const navigation = useNavigation();
  const selectedTemplate = templates.find(
    (template) => template.id == selectedTemplateId
  );

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
      {selectedTemplateId && (
        <div className='w-full flex items-center' style={{ height: '10vh' }}>
          <Link className='mx-auto' to={`/chat/${selectedTemplateId}`}>
            <Button
              className={`${buttonVariants({
                variant: 'outline',
              })} bg-blue-700 text-white hover:bg-blue-500`}
            >
              {navigation.state === 'loading'
                ? 'Loading AI chat...'
                : 'Have AirChat Customize This Template'}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
