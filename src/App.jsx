import React, { useState } from 'react';
import InputArea from './components/InputArea';
import OutputPreview from './components/OutputPreview';
import Correspondants from './components/Correspondants';
import PatientsTodoList from './components/PatientsTodoList';
import EmailSender from './components/EmailSender';
import './styles.css';

const App = () => {
  const [markdown, setMarkdown] = useState('');
  const [structuredContent, setStructuredContent] = useState(null);
  const [activeTab, setActiveTab] = useState('redaction');

  const handleMarkdownChange = (newMarkdown) => {
    setMarkdown(newMarkdown);
  };

  const handleStructuredContentChange = (content) => {
    setStructuredContent(content);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'redaction':
        return (
          <>
            <InputArea onMarkdownChange={handleMarkdownChange} />
            <OutputPreview 
              markdown={markdown} 
              onStructuredContentChange={handleStructuredContentChange}
            />
            <EmailSender 
              markdown={markdown} 
              structuredContent={structuredContent} 
            />
          </>
        );
      case 'correspondants':
        return <Correspondants />;
      case 'patients':
        return <PatientsTodoList />;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1>Paperassetor</h1>
        <ul className="nav-links">
          <li className="nav-item">
            <a 
              href="#redaction" 
              className={`nav-link ${activeTab === 'redaction' ? 'active' : ''}`}
              onClick={() => setActiveTab('redaction')}
            >
              Rédaction CR
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#correspondants" 
              className={`nav-link ${activeTab === 'correspondants' ? 'active' : ''}`}
              onClick={() => setActiveTab('correspondants')}
            >
              Correspondants
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#patients" 
              className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`}
              onClick={() => setActiveTab('patients')}
            >
              Patients du Jour
            </a>
          </li>
        </ul>
      </aside>
      
      <main className="main-content">
        <div className="container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App; 