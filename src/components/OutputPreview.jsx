import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const OutputPreview = ({ markdown }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [structuredContent, setStructuredContent] = useState(null);
  const [error, setError] = useState(null);

  // Fonction pour analyser le texte avec LM Studio
  const analyzeText = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: markdown }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse du texte');
      }

      const data = await response.json();
      setStructuredContent(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de l\'analyse du texte');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction générique pour télécharger un document
  const downloadDocument = async (format) => {
    try {
      const response = await fetch('http://localhost:3001/generate-structured-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: markdown,
          format: format 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération du document ${format}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Une erreur est survenue lors de la génération du document ${format}`);
    }
  };

  const downloadDocx = () => downloadDocument('docx');
  const downloadPdf = () => downloadDocument('pdf');

  return (
    <div className="output-preview">
      <div className="preview-container">
        <div className="preview-section">
          <h3>Aperçu Markdown</h3>
          <div className="markdown-preview">
            <pre>{markdown}</pre>
          </div>
        </div>
        <div className="preview-section">
          <h3>Aperçu HTML</h3>
          <div className="html-preview">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="structured-preview">
        <div className="preview-header">
          <h3>Compte Rendu Structuré</h3>
          <button 
            className="analyze-button" 
            onClick={analyzeText}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Analyse en cours...
              </span>
            ) : (
              'Analyser avec LM Studio'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {structuredContent && (
          <div className="structured-content">
            {Object.entries(structuredContent).map(([key, value]) => (
              <div key={key} className="content-section">
                <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="download-buttons">
        <button 
          className="download-button" 
          onClick={downloadDocx}
          disabled={!structuredContent}
        >
          Télécharger en .docx
        </button>
        <button 
          className="download-button" 
          onClick={downloadPdf}
          disabled={!structuredContent}
        >
          Télécharger en .pdf
        </button>
      </div>
    </div>
  );
};

export default OutputPreview; 