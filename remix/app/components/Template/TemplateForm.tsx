import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from 'app/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
} from '~/components/ui/table';

interface TemplateFormProps {
  templates: FormTemplate[];
  setTemplateSelected: (templateId: string) => void;
  selectedTemplateId: string | null;
}

interface FormTemplate {
  id: string;
  name: string;
  preview: string;
  initialPrompt: string;
}

export default function TemplateForm(props: TemplateFormProps) {
  const { templates, setTemplateSelected, selectedTemplateId } = props;

  const handleSelectedTemplateId = (templateId: string) => {
    setTemplateSelected(templateId);
  };

  const getTable = () => {
    return (
      <Table className='table table-auto w-full'>
        <TableHeader className='table-header-group'>
          <TableRow className='table-row'>
            <TableHead className='table-cell text-base my-5 font-bold'>
              Templates:
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => {
            const checked = selectedTemplateId == template.id;
            return (
              <TableRow
                key={template.id}
                className={`table-row hover:cursor-pointer`}
                onClick={(event) => handleSelectedTemplateId(template.id)}
              >
                <TableCell
                  className={`font-medium table-cell hover:bg-blue-50 ${
                    checked ? 'bg-blue-50' : ''
                  }`}
                >
                  <button>{template.name}</button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <ScrollArea
      className='h-fit md:h-screen border-r-2 max-w-xl'
      style={{ minWidth: '25vw' }}
    >
      <div className='w-6/6 p-0'>
        <div>{getTable()}</div>
      </div>
    </ScrollArea>
  );
}
