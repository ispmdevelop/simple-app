import { useState, useEffect } from 'react';
import type { AdminTemplate } from '../../routes/template-admin';
import { Form, useActionData, useSubmit } from '@remix-run/react';

export type FormModalTemplate = {
  id: string;
  name: string;
  preview: string;
  initialPrompt: string;
};

interface TemplateFormModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  handleNewTemplate: (newTemplate: AdminTemplate) => void;
  handleUpdateTemplate: (updatedTemplate: AdminTemplate) => void;
  selectedTemplate?: AdminTemplate | undefined;
  modalAction: 'create' | 'update' | undefined;
}

export default function TemplateFormModal(props: TemplateFormModalProps) {
  const {
    handleNewTemplate,
    handleCloseModal,
    modalAction,
    selectedTemplate,
    handleUpdateTemplate,
  } = props;

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [initialPromptError, setInitialPromptError] = useState('');
  const [preview, setPreview] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [httpError, setHttpError] = useState('');
  const submit = useSubmit();

  const formResponse: any = useActionData();

  useEffect(() => {
    if (formResponse?.success) {
      if (modalAction === 'create') {
        handleNewTemplate(formResponse.data);
        handleClose();
      } else if (modalAction === 'update') {
        handleUpdateTemplate(formResponse.data);
        handleClose();
      }
    } else if (formResponse?.success === false) {
      setHttpError(formResponse.data.message);
    }
  }, [formResponse]);

  const clearForm = () => {
    setName('');
    setInitialPrompt('');
    setPreview('');
    setInitialPromptError('');
    setPreviewError('');
    setHttpError('');
    setNameError('');
  };

  const handleClose = () => {
    clearForm();
    handleCloseModal();
  };

  useEffect(() => {
    if (selectedTemplate && modalAction === 'update') {
      setName(selectedTemplate.name);
      setInitialPrompt(selectedTemplate.initialPrompt);
      setPreview(selectedTemplate.preview);
    }
  }, [selectedTemplate, modalAction]);

  const handleValidateForm = () => {
    let isValid = true;
    const formFields = [
      { label: 'Name', value: name, setErrorFn: setNameError },
      {
        label: 'Initial Prompt',
        value: initialPrompt,
        setErrorFn: setInitialPromptError,
      },
      { label: 'Preview', value: preview, setErrorFn: setPreviewError },
    ];

    formFields.forEach((field) => {
      if (!field.value) {
        field.setErrorFn(`${field.label} is required`);
      } else {
        field.setErrorFn('');
      }
    });

    return isValid;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    if (name === 'name') setName(value);
    else if (name === 'preview') setPreview(value);
    else if (name === 'initialPrompt') setInitialPrompt(value);
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!handleValidateForm()) return;
    submit(event.currentTarget, { replace: true });
  }

  return (
    <Form method='POST' onSubmit={handleSubmit}>
      {/* The modal */}
      {props.showModal && (
        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity'
              aria-hidden='true'
            >
              <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
            </div>

            {/* Modal content */}
            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='sm:flex sm:items-start w-full'>
                  <div className='mt-3 text-center sm:mt-0 sm:text-left w-full'>
                    <h1
                      className={`text-center text-2xl text-slate-800 font-bold ${
                        modalAction === 'update'
                          ? 'text-blue-400'
                          : 'text-green-500'
                      }`}
                    >
                      {modalAction === 'update'
                        ? 'Update Template'
                        : 'New Template'}
                    </h1>
                    {/* Name input */}
                    <label
                      htmlFor='name'
                      className='block text-md font-medium text-gray-700'
                    >
                      Name:
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      value={name}
                      onChange={handleChange}
                      className={`mt-1 p-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        nameError ? 'border-red-500' : ''
                      }`}
                    />
                    {nameError && (
                      <p className='text-red-500 text-xs italic p-0 mt-1'>
                        {nameError}
                      </p>
                    )}

                    <label
                      htmlFor='initialPrompt'
                      className='block text-md font-medium text-gray-700 mt-4'
                    >
                      Initial Prompt:
                    </label>
                    <textarea
                      name='initialPrompt'
                      id='initialPrompt'
                      value={initialPrompt}
                      onChange={handleChange}
                      className={`mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-56 ${
                        initialPromptError ? 'border-red-500' : ''
                      }`}
                    ></textarea>
                    {initialPromptError && (
                      <p className='text-red-500 text-xs italic p-0 mt-1'>
                        {initialPromptError}
                      </p>
                    )}

                    <label
                      htmlFor='preview'
                      className='block text-md font-medium text-gray-700 mt-4'
                    >
                      Script Preview:
                    </label>
                    <textarea
                      name='preview'
                      id='preview'
                      value={preview}
                      onChange={handleChange}
                      className={`mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-56 ${
                        previewError ? 'border-red-500' : ''
                      }`}
                    ></textarea>
                    {previewError && (
                      <p className='text-red-500 text-xs italic p-0 mt-1'>
                        {previewError}
                      </p>
                    )}

                    <hr className='border border-1 border-gray-200 mt-4 mb-3' />
                    {/* Fields dynamic form section */}
                    <input
                      style={{ display: 'none' }}
                      type='text'
                      name='action'
                      id='action'
                      defaultValue={modalAction}
                    />
                    <input
                      style={{ display: 'none' }}
                      type='text'
                      name='id'
                      id='id'
                      defaultValue={selectedTemplate?.id || ''}
                    />
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                  <button
                    type='submit'
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      modalAction === 'update'
                        ? 'bg-blue-500 hover:bg-blue-700'
                        : 'bg-green-500 hover:bg-green-700'
                    }`}
                  >
                    {modalAction === 'update' ? 'Update' : 'Create'}
                  </button>
                  <button
                    type='button'
                    className='mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
                {httpError && (
                  <div
                    className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-1 mx-1'
                    role='alert'
                    onClick={() => setHttpError('')}
                  >
                    <strong className='font-bold'>Error!</strong>
                    <span className='block sm:inline'> {httpError}</span>
                    <span className='absolute top-0 bottom-0 right-0 px-4 py-3'>
                      <svg
                        className='fill-current h-6 w-6 text-red-500'
                        role='button'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                      >
                        <title>Close</title>
                        <path d='M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.93a1 1 0 01-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 011.414-1.414l2.93 2.93 2.93-2.93a1 1 0 011.414 1.414l-2.93 2.93 2.93 2.93a1 1 0 010 1.414z' />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
}
