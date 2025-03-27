import React from 'react';

const InputArea = ({ onTextChange, onGenerate }) => {
  return (
    <div className="input-area">
      <textarea
        placeholder="Collez ou saisissez votre texte ici..."
        onChange={(e) => onTextChange(e.target.value)}
        className="text-input"
      />
      <div className="button-group">
        <div className="right-buttons">
          <button className="secondary" title="Dictée vocale">
            💬
          </button>
          <button className="secondary" title="Importer un document">
            Importer
          </button>
        </div>
        <button onClick={onGenerate} className="generate-button">
          Générer le compte rendu
        </button>
      </div>
    </div>
  );
};

export default InputArea; 