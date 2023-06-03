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
import { Link } from '@remix-run/react';

export async function action({ request, params }: ActionArgs) {
  try {
    const form = await request.formData();
    const name = form.get('name');
    const id = form.get('id');
    const preview = form.get('preview');
    const initialPrompt = form.get('initialPrompt');
    const actionVerb = form.get('action');
    const template = {
      name,
      preview,
      initialPrompt,
    } as Template;
    let response;

    if (actionVerb === 'create') {
      const createResponse = await createTemplate(template);
      response = createResponse;
    }
    if (actionVerb === 'update') {
      if (!id) return;
      const updateResponse = await updateTemplate(id + '', template);
      response = updateResponse;
    } else if (actionVerb === 'delete') {
      if (id) {
        const deleteResponse = await deleteTemplate(id + '');
        response = deleteResponse;
      }
    }
    return json({ success: true, data: response });
  } catch (e) {
    console.log('Error when posting message', e);
    return json({ success: false, data: e });
  }
}

export type AdminTemplate = {
  id: string;
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
          {template.preview?.substring(0, 200) + '...'}
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
              <th className='px-4 py-2'>Preview</th>
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
      <div className='flex flex-row gap-5'>
        <Link className='w-6/12' to='/'>
          <button className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded '>
            Back To App
          </button>
        </Link>
        <button
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-6/12'
          onClick={handleOpenModalForCreate}
        >
          + Create Template
        </button>
      </div>
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
