import { useState, useEffect } from 'react';
import TemplateFormModal from './components/TemplateFormModal';

export default function TemplateAdmin() {
  const [templates, setTemplates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(undefined);

  const handleNewTemplate = (newTemplate) => {
    setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
  };

  const handleUpdateTemplate = (updatedTemplate) => {
    setTemplates((prevTemplates) => {
      const copy = JSON.parse(JSON.stringify(prevTemplates));
      const index = copy.findIndex(
        (template) => template.id === updatedTemplate.id
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

  const handleOpenModalForUpdate = (id) => {
    setModalAction('update');
    setSelectedTemplate(templates.find((template) => template.id === id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalAction('');
    setSelectedTemplate(undefined);
  };

  // Makes sure all props are loaded before rendering
  useEffect(() => {
    if (
      (selectedTemplate && modalAction === 'update') ||
      (!selectedTemplate && modalAction === 'create')
    ) {
      setShowModal(true);
    }
  }, [selectedTemplate, modalAction]);

  const handleDeleteTemplate = (id) => {
    fetch(process.env.REACT_APP_API_URL + '/template/' + id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data);
        if (data.status === 200) {
          setTemplates((prevTemplates) => {
            const copy = JSON.parse(JSON.stringify(prevTemplates));
            const index = copy.findIndex((template) => template.id === id);
            console.log('index', index);
            if (index !== -1) {
              copy.splice(index, 1);
            }
            console.log('copy', copy);
            return copy;
          });
        }
      });
  };

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/template')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.data);
      });
  }, []);

  const generateTableRow = (template, index) => {
    return (
      <tr key={`table-row-${template.id}`}>
        <td className='border px-4 py-2'>{index + 1}</td>
        <td className='border px-4 py-2'>{template.name}</td>
        <td className='border px-4 py-2'>
          {template.body.substring(0, 200) + '...'}
        </td>
        <td className='border px-4 py-2 '>
          {JSON.parse(template.fields)
            .map((field) => field.name)
            .join(' | ') || 'No fields found.'}
        </td>
        <td className='border px-4 py-2 text-center'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
            onClick={handleOpenModalForUpdate.bind(this, template.id)}
          >
            Edit
          </button>
        </td>
        <td className='border px-4 py-2 text-center'>
          <button
            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'
            onClick={handleDeleteTemplate.bind(this, template.id)}
          >
            Delete
          </button>
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
