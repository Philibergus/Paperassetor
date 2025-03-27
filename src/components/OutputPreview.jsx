import React from 'react';
import ReactMarkdown from 'react-markdown';

const OutputPreview = ({ markdown }) => {
  // Fonction pour télécharger le document Word
  const downloadDocx = async () => {
    try {
      const response = await fetch('http://localhost:3001/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: markdown }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rapport.docx';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la génération du document');
    }
  };

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
      <button className="download-button" onClick={downloadDocx}>
        Télécharger en .docx
      </button>
    </div>
  );
};

export default OutputPreview; 