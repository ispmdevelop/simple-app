export default function TemplateForm(props) {
  const {
    templates,
    setTemplateSelected,
    fields,
    handleSetFields,
    setShowResult,
    showResult,
    selectedTemplateId,
    resetFields,
  } = props;

  const onFieldValueChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    handleSetFields(name, value);
  };

  const handleRetry = () => {
    setShowResult(false);
    resetFields();
  };

  const handleGenerateSubmit = () => {
    validateForm();
    if (isFormCompleted()) {
      setShowResult(true);
    }
  };

  const capitalize = (str) => {
    if (!str || str.length <= 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getInputFields = () => {
    if (!fields || !Array.isArray(fields)) return <></>;
    return fields.map((field) => {
      const name = field.name;
      const placeholder = field.placeholder || name;
      return (
        <div
          key={`field-${selectedTemplateId}-${name}`}
          className='flex flex-col'
        >
          <label className='text-left ml-1' htmlFor={name}>
            {capitalize(placeholder || '')}
          </label>
          <input
            type='text'
            name={name}
            id={name}
            className={`border rounded py-2 px-3 w-full m-auto ${
              field.error ? 'border-red-500' : ''
            }`}
            value={field.value || ''}
            placeholder={capitalize(placeholder || '')}
            onChange={onFieldValueChange}
            disabled={showResult ? true : false}
          />
          {field.error && <span className='text-red-500'>{field.error}</span>}
        </div>
      );
    });
  };

  const handleSelectedTemplateId = (event) => {
    const templateId = event.target.value;
    setTemplateSelected(templateId);
  };

  const isFormCompleted = () => {
    if (!selectedTemplateId) return false;
    if (!fields || !Array.isArray(fields)) return false;
    const isAllFieldsFilled = fields.every((field) => {
      const value = field.value;
      if (value && value.length > 0) {
        return true;
      } else {
        handleSetFields(field.name, field.value, 'Missing value');
        return false;
      }
    });
    return isAllFieldsFilled;
  };

  const validateForm = () => {
    if (!selectedTemplateId) return;
    if (!fields || !Array.isArray(fields)) return;
    const isAllFieldsFilled = fields.forEach((field) => {
      const value = field.value;
      if (!value || value.length <= 0) {
        handleSetFields(field.name, field.value, 'Missing value');
      }
    });
    return isAllFieldsFilled;
  };

  const getGenerateButton = () => {
    if (showResult || !selectedTemplateId) {
      return (
        <div className='flex w-full gap-5'>
          <button className='bg-neutral-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-not-allowed hover:bg-neutral w-full'>
            Generate
          </button>
          {showResult && (
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full'
              onClick={handleRetry}
            >
              Retry
            </button>
          )}
        </div>
      );
    }
    return (
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        onClick={handleGenerateSubmit}
      >
        Generate
      </button>
    );
  };

  return (
    <div className='w-4/6 px-3 max-w-xl mx-auto text-center'>
      <h1 className='text-2xl my-5'>Create Your Script:</h1>
      <div className='flex flex-col justify-center w-full m-0 gap-5'>
        <select
          className='border rounded py-2 px-3'
          onChange={handleSelectedTemplateId}
          defaultValue=''
        >
          <option value='' disabled>
            Script Type
          </option>
          {templates &&
            templates.map((template) => (
              <option
                key={`template-option-${template.id}`}
                value={template.id}
              >
                {capitalize(template.name || '')}
              </option>
            ))}
        </select>
        {getInputFields()}
        {getGenerateButton()}
      </div>
    </div>
  );
}
