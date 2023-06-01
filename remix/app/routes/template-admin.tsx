import { useEffect, useState } from 'react';
import { Form, useLoaderData } from '@remix-run/react';
import TemplateFormModal from '../components/TemplateAdmin/TemplateFormModal';
import type { ActionArgs } from '@remix-run/node';
import { json, type LoaderArgs, type LoaderFunction } from '@remix-run/node';
import type { Template } from '~/models/template.server';
import {
  createTemplate,
  deleteTemplate,
  updateTemplate,
  getTemplates,
} from '~/models/template.server';

export async function action({ request, params }: ActionArgs) {
  try {
    const form = await request.formData();
    const name = form.get('name');
    const body = form.get('body');
    const id = form.get('id');
    const preview = form.get('preview');
    const initialPrompt = form.get('initialPrompt');
    const actionVerb = form.get('action');
    let response;
    const fields = [];

    console.log('preview', preview);
    console.log('initialPrompt', preview);

    for (let i = 0; i < 100; i++) {
      const fieldName = form.get(`fieldname${i}`);
      const question = form.get(`question${i}`);
      if (!fieldName || !question) break;
      fields.push({ name: fieldName, question });
    }

    if (actionVerb === 'create') {
      const template = {
        name,
        body,
        preview,
        initialPrompt,
        fields: JSON.stringify(fields || []),
      } as Template;
      const createResponse = await createTemplate(template);
      response = createResponse;
    }
    if (actionVerb === 'update') {
      if (!id) return;
      const template = {
        name,
        body,
        preview,
        initialPrompt,
        fields: JSON.stringify(fields || []),
      } as Template;
      const updateResponse = await updateTemplate(+id, template);
      response = updateResponse;
    } else if (actionVerb === 'delete') {
      if (id) {
        const deleteResponse = await deleteTemplate(+id);
        response = deleteResponse;
      }
    }
    return json({ success: true, data: response });
  } catch (e) {
    return json({ success: false, data: e });
  }
}

export type AdminTemplate = {
  id: string;
  body: string;
  fields: string;
  name: string;
  preview: string;
  initialPrompt: string;
};

export let loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const data = await getTemplates();
  return json(data);
};

export default function TemplateAdmin() {
  const loaderData = useLoaderData<AdminTemplate[]>();
  const [templates, setTemplates] = useState<AdminTemplate[]>(loaderData);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<
    'create' | 'update' | undefined
  >(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState<
    AdminTemplate | undefined
  >(undefined);

  useEffect(() => {
    setTemplates(loaderData);
  }, [loaderData]);

  const handleNewTemplate = (newTemplate: AdminTemplate) => {
    setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
  };

  const handleUpdateTemplate = (updatedTemplate: AdminTemplate) => {
    setTemplates((prevTemplates) => {
      const copy = [...prevTemplates];
      const index = copy.findIndex(
        (template) => template.id == updatedTemplate.id
      );
      if (index !== -1) {
        copy[index] = updatedTemplate;
      }
      return copy;
    });
  };

  const handleOpenModalForCreate = () => {
    setModalAction('create');
    setSelectedTemplate(undefined);
  };

  const handleOpenModalForUpdate = (id: string) => {
    setModalAction('update');
    setSelectedTemplate(templates.find((template) => template.id === id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalAction(undefined);
    setSelectedTemplate(undefined);
  };

  useEffect(() => {
    if (
      (selectedTemplate && modalAction === 'update') ||
      (!selectedTemplate && modalAction === 'create')
    ) {
      setShowModal(true);
    }
  }, [selectedTemplate, modalAction]);

  const generateTableRow = (template: AdminTemplate, index: number) => {
    return (
      <tr key={`table-row-${template.id}`}>
        <td className='border px-4 py-2'>{index + 1}</td>
        <td className='border px-4 py-2'>{template.name}</td>
        <td className='border px-4 py-2'>
          {template.body.substring(0, 200) + '...'}
        </td>
        <td className='border px-4 py-2 '>
          {JSON.parse(template.fields)
            .map((field: { name: string }) => field.name)
            .join(' | ') || 'No fields found.'}
        </td>
        <td className='border px-4 py-2 text-center'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
            onClick={() => handleOpenModalForUpdate(template.id)}
          >
            Edit
          </button>
        </td>
        <td className='border px-4 py-2 text-center'>
          <Form method='POST'>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'
              type='submit'
            >
              Delete
            </button>
            <input
              name='id'
              defaultValue={template.id}
              style={{ display: 'none' }}
            />
            <input
              name='action'
              defaultValue={'delete'}
              style={{ display: 'none' }}
            />
          </Form>
        </td>
      </tr>
    );
  };

  const generateTable = () => {
    return (
      <div style={{ height: '75vh', overflowY: 'scroll' }}>
        <table className='table-auto w-full'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='px-4 py-2'>#</th>
              <th className='px-4 py-2'>Name</th>
              <th className='px-4 py-2'>Body</th>
              <th className='px-4 py-2'>Fields</th>
              <th className='px-4 py-2 text-center'>Edit</th>
              <th className='px-4 py-2 text-center'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) =>
              generateTableRow(template, index)
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-5 mx-5'>
      <h1 className='text-2xl text-center mt-5 font-bold'>Template Admin</h1>
      {/* Button to trigger the modal */}
      <button
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        onClick={handleOpenModalForCreate}
      >
        + Create Template
      </button>
      {templates && generateTable()}
      <TemplateFormModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleNewTemplate={handleNewTemplate}
        handleUpdateTemplate={handleUpdateTemplate}
        selectedTemplate={selectedTemplate}
        modalAction={modalAction}
      />
    </div>
  );
}
