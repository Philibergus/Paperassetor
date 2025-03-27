import React, { useState } from 'react';

const InputArea = ({ onMarkdownChange }) => {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
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
    setText(template);
    onMarkdownChange(template);
  };

  return (
    <div className="input-area">
      <div className="button-group">
        <button className="secondary" onClick={insertTemplate}>Insérer Template</button>
      </div>
      <textarea
        className="text-input"
        value={text}
        onChange={handleTextChange}
        placeholder="Saisissez votre texte en format Markdown..."
      />
    </div>
  );
};

export default InputArea; 