import React, { useEffect, useState } from 'react';
import TemplateDisplay from './components/TemplateDisplay';
import TemplateForm from './components/TemplateForm';

export default function Template(props) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [fields, setFields] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleShowResult = (value) => {
    if (value !== undefined || value !== null) {
      return setShowResult(value);
    }
    setShowResult((prev) => !prev);
  };

  const handleSelectedTemplateId = (id) => {
    if (id === selectedTemplateId || !id) return;
    setSelectedTemplateId(id);
    const selectedTemplate = templates.find((template) => template.id === id);
    let fieldObject = {};
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
      const copy = JSON.parse(JSON.stringify(prevFields));
      copy.forEach((field) => {
        field.value = '';
        field.error = '';
      });
      console.log('resetFields');
      return copy;
    });
  };

  const handleSetFields = (name, value, error) => {
    setFields((prevFields) => {
      const copy = JSON.parse(JSON.stringify(prevFields));
      const fieldObject = copy.find((field) => field.name === name);
      if (fieldObject) {
        fieldObject.value = value;
        fieldObject.error = error;
      }
      return copy;
    });
  };

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/template')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.data);
      });
  }, []);

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
