import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Template } from './pages/Template';
import { Form } from './pages/Form';
import './App.css';
import { TemplateAdmin } from './pages/TemplateAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Template />} />
        <Route path='/template' element={<Template />} />
        <Route path='/template-admin' element={<TemplateAdmin />} />
        <Route path='/form' element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
