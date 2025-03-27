import React, { useState, useEffect } from 'react';
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

  // Charger les patients depuis le localStorage au démarrage
  useEffect(() => {
    const savedPatients = localStorage.getItem('patients');
    if (savedPatients) {
      const today = new Date().toISOString().split('T')[0];
      const patientsOfDay = JSON.parse(savedPatients).filter(patient => {
        const patientDate = new Date().toISOString().split('T')[0];
        return patientDate === today;
      });
      setPatients(patientsOfDay);
    }
  }, []);

  // Sauvegarder les patients dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleMarkdownChange = (newMarkdown) => {
    setMarkdown(newMarkdown);
  };

  const handlePatientsChange = (newPatients) => {
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
            <AgendaScanner onPatientsImported={handlePatientsChange} />
            <PatientsTodoList 
              patients={patients}
              onPatientsChange={handlePatientsChange}
            />
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