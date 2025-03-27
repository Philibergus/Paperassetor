import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const OutputPreview = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [structuredContent, setStructuredContent] = useState(null);
  const [error, setError] = useState(null);

  const analyzeWithLMStudio = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: markdown }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse du texte');
      }

      const data = await response.json();
      setStructuredContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadDocument = async (format) => {
    try {
      const response = await fetch(`http://localhost:3001/generate-${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: markdown,
          structuredContent 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération du document ${format}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compte_rendu.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="output-preview">
      <div className="preview-header">
        <h3>Aperçu Markdown</h3>
        <button
          onClick={analyzeWithLMStudio}
          disabled={isAnalyzing}
          className="analyze-button"
        >
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser avec LM Studio'}
        </button>
      </div>

      <div className="preview-content">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {structuredContent && (
        <div className="structured-preview">
          <h3>Compte Rendu Structuré</h3>
          <div className="structured-content">
            {Object.entries(structuredContent).map(([key, value]) => (
              <div key={key} className="content-section">
                <h4>{key}</h4>
                <p>{value}</p>
              </div>
            ))}
          </div>
          <div className="download-buttons">
            <button onClick={() => downloadDocument('docx')}>
              Télécharger en .docx
            </button>
            <button onClick={() => downloadDocument('pdf')}>
              Télécharger en .pdf
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputPreview; 