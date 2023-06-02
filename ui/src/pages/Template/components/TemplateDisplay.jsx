import { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function TemplateDisplay(props) {
  const { templates, selectedTemplateId, fields, showResult } = props;

  const [response, setResponse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [injectedText, setInjectedText] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedTemplate = templates.find(
    (template) => template.id === selectedTemplateId
  );

  useEffect(() => {
    if (isTyping && injectedText) {
      simulateTyping(injectedText);
    }
  }, [isTyping, injectedText]);

  const simulateTyping = (text) => {
    let i = -1;
    let whiteSpaceCount = 1;
    let multiplier = 1.15;

    console.log('text', text);

    const typeLetter = (currentSpeed) => {
      i++;
      setResponse((prevResponse) => prevResponse + text.charAt(i));
      if (!isTyping) return;
      if (i < text.length) {
        let newSpeed = currentSpeed;
        if (text.charAt(i) === ' ') {
          whiteSpaceCount++;
          newSpeed =
            Math.floor(Math.random() * 25 * multiplier) + 10 * multiplier;
        }
        if (
          i >= 1 &&
          text.charAt(i - 1) === ' ' &&
          whiteSpaceCount > Math.floor(Math.random() * 3) + 1
        ) {
          newSpeed =
            Math.floor(Math.random() * 5 * multiplier) + 2.5 * multiplier;
        }
        setTimeout(typeLetter.bind(this, newSpeed), newSpeed);
      } else {
        setIsTyping(false);
        setInjectedText('');
      }
    };

    // start the typing simulation
    const firstRandSpeed =
      Math.floor(Math.random() * 5 * multiplier) + 2.5 * multiplier; // generate a random initial typing delay between 100 and 300 ms
    setTimeout(typeLetter.bind(this, firstRandSpeed), firstRandSpeed);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  }, [copied]);

  useEffect(() => {
    if (showResult !== true || !selectedTemplate) return;
    const initialText = selectedTemplate.body;
    if (!fields || !Array.isArray(fields)) return;

    console.log('initialText', initialText);

    let injectedText = initialText;
    fields.forEach((field) => {
      const name = field.name;
      const value = field.value;
      if (!name || !value) return;
      const exp = new RegExp(`\\$\\{${name}\\}`, 'gm');
      injectedText = injectedText.replace(exp, value);
    });
    setResponse('');
    setInjectedText(injectedText);
    setIsTyping(true);
    return () => {
      setResponse('');
      setIsTyping(false);
    };
  }, [showResult, selectedTemplate, fields]);

  return (
    <div id='template-display' className='w-full mt-5 '>
      <div
        className='w-11/12 p-4 bg-white w-100 border-neutral-300 border rounded-md m-auto'
        style={{ height: '95vh', position: 'relative' }}
        onMouseEnter={() => {
          setShowModal(true);
        }}
        onMouseLeave={() => {
          setShowModal(false);
        }}
      >
        <textarea
          disabled
          className='w-full h-full bg-transparent outline-none resize-none  text-lg  '
          value={
            showResult ? response : 'Your script will be generated here...'
          }
        />
        {showModal && (
          <div
            id='template-display-copy-modal'
            className='modal absolute bg-gray-200 opacity-75 flex justify-center items-center'
            style={{ width: '100%', height: '100%', left: '0', top: '0' }}
          >
            {copied ? (
              <div className='bg-green-500 text-white font-bold py-2 px-4 rounded'>
                Successfully Copied!
              </div>
            ) : (
              <CopyToClipboard text={response} onCopy={() => setCopied(true)}>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                  Copy to Clipboard
                </button>
              </CopyToClipboard>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
