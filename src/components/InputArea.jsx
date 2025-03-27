import React, { useState, useEffect } from 'react';

const InputArea = ({ markdown, onMarkdownChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        onMarkdownChange(markdown + ' ' + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    onMarkdownChange(newText);
  };

  // Exemple de template
  const insertTemplate = () => {
    const template = `# Compte Rendu Médical

## Informations Patient
Nom:
Prénom:
Date de naissance:
Numéro de sécurité sociale:

## Bilan parodontal
- État général:
- Observations:

## Motif de consultation

## Diagnostic

## Plan de traitement
`;
    onMarkdownChange(template);
  };

  return (
    <div className="input-area">
      <div className="input-controls">
        <button onClick={insertTemplate} className="template-button" title="Insérer un template">
          <i className="fas fa-file-medical"></i>
        </button>
        <button 
          onClick={toggleListening} 
          className={`mic-button ${isListening ? 'active' : ''}`}
          title="Activer/désactiver la reconnaissance vocale"
        >
          <i className={`fas fa-microphone${isListening ? '-slash' : ''}`}></i>
        </button>
      </div>
      <textarea
        value={markdown}
        onChange={handleTextChange}
        placeholder="Saisissez votre texte en format Markdown..."
        className="markdown-input"
      />
    </div>
  );
};

export default InputArea; 