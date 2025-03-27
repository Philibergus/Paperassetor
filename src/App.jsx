import React, { useState } from 'react';
import InputArea from './components/InputArea';
import OutputPreview from './components/OutputPreview';
import TemplateSelector from './components/TemplateSelector';
import AgendaScanner from './components/AgendaScanner';
import PatientsTodoList from './components/PatientsTodoList';
import Correspondants from './components/Correspondants';
import EmailSender from './components/EmailSender';
import './styles.css';

const App = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('CR - Bilan Paro');
  const [patients, setPatients] = useState([]);
  const [markdown, setMarkdown] = useState('');

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleMarkdownChange = (newMarkdown) => {
    setMarkdown(newMarkdown);
  };

  const handlePatientsImported = (newPatients) => {
    setPatients(newPatients);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1>Paperassetor</h1>
        <ul className="nav-links">
          <li className="nav-item">
            <a 
              href="#redaction" 
              className="nav-link active"
            >
              Rédaction CR
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#correspondants" 
              className="nav-link"
            >
              Correspondants
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#patients" 
              className="nav-link"
            >
              Patients du Jour
            </a>
          </li>
        </ul>
      </aside>
      
      <main className="main-content">
        <div className="container">
          <section id="redaction">
            <TemplateSelector
              onSelect={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
            <div className="editor-container">
              <InputArea 
                markdown={markdown}
                onMarkdownChange={handleMarkdownChange}
              />
              <div className="preview-section">
                <OutputPreview markdown={markdown} />
              </div>
            </div>
          </section>

          <section id="patients" className="patients-section">
            <h2>Patients du Jour</h2>
            <AgendaScanner onPatientsImported={handlePatientsImported} />
            <PatientsTodoList patients={patients} />
          </section>

          <section id="correspondants" className="correspondants-section">
            <h2>Gestion des Correspondants</h2>
            <Correspondants />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App; 