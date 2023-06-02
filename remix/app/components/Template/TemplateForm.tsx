import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from 'app/components/ui/scroll-area';

interface TemplateFormProps {
  templates: FormTemplate[];
  setTemplateSelected: (templateId: string) => void;
  setShowResult: (value: boolean) => void;
  showResult: boolean;
  selectedTemplateId: string | null;
}

interface FormTemplate {
  id: string;
  name: string;
  preview: string;
  initialPrompt: string;
}

export default function TemplateForm(props: TemplateFormProps) {
  const {
    templates,
    setTemplateSelected,
    setShowResult,
    showResult,
    selectedTemplateId,
  } = props;

  const capitalize = (str: string) => {
    if (!str || str.length <= 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSelectedTemplateId = (templateId: string) => {
    console.log('selected template id', templateId);
    setTemplateSelected(templateId);
  };

  const getTemplateListWithCheckbox = () => {
    return templates.map((template) => {
      const checked = selectedTemplateId == template.id;
      return (
        <div key={template.id} className='flex flex-row items-center'>
          <Checkbox
            className={`text-red-700 mr-2 rounded   ${
              checked ? 'border border-neutral-950' : ''
            }`}
            name='template'
            value={template.id}
            checked={checked}
            onClick={(event) => handleSelectedTemplateId(template.id)}
          />
          <label className='text-base break-words whitespace-normal'>
            {template.name}
          </label>
        </div>
      );
    });
  };

  return (
    <ScrollArea className='h-screen w-2/6 border-r-2'>
      <div className='w-6/6 max-w-xl ml-6 mr-3'>
        <h1 className='text-base my-5 font-bold '>Templates:</h1>
        <div>
          <div className='flex flex-col justify-left w-full m-0 gap-2'>
            {getTemplateListWithCheckbox()}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
