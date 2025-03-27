import React from 'react';

const InputArea = ({ markdown, onMarkdownChange }) => {
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
      <button onClick={insertTemplate} className="template-button">
        Insérer Template
      </button>
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