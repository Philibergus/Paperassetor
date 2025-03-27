import React from 'react';

const templates = {
  'CR - MP': {
    title: 'Compte Rendu Maintenance Parodontale',
    checklist: [
      'Données patient',
      'Antécédents',
      'BOP (%)',
      'Indice de Plaque (%)',
      'Facteurs de risque',
      'Écart recommandé prochain RDV',
      'Sites réfractaires',
      'Recommandations hygiène'
    ]
  },
  'CR - Bilan Paro': {
    title: 'Compte Rendu Bilan Parodontal',
    checklist: [
      'Données patient',
      'Antécédents',
      'BOP (%)',
      'Indice de Plaque (%)',
      'Profondeurs de sondage',
      'Récessions',
      'Mobilités dentaires',
      'Atteintes interradiculaires',
      'Diagnostic parodontal'
    ]
  },
  'CR - Implantologie': {
    title: 'Compte Rendu Chirurgical Implantaire',
    checklist: [
      'Données patient',
      'Antécédents',
      'Site implantaire',
      'Type d\'implant',
      'Dimensions implant',
      'Type d\'incision',
      'Torque d\'insertion',
      'ISQ',
      'Type de sutures',
      'Prescription post-op'
    ]
  },
  'CR - Muccochirurgie': {
    title: 'Compte Rendu Chirurgical Muccogingival',
    checklist: [
      'Données patient',
      'Antécédents',
      'Site opératoire',
      'Type de greffe',
      'Site donneur',
      'Type d\'incision',
      'Type de sutures',
      'Prescription post-op'
    ]
  }
};

const TemplateSelector = ({ onSelect, selectedTemplate }) => {
  return (
    <div className="template-selector">
      <div className="template-buttons">
        {Object.keys(templates).map((templateKey) => (
          <button
            key={templateKey}
            className={`template-button ${selectedTemplate === templateKey ? 'selected' : ''}`}
            onClick={() => onSelect(templateKey)}
          >
            {templateKey}
          </button>
        ))}
      </div>
      {selectedTemplate && (
        <div className="checklist-container">
          <h3>Checklist - {templates[selectedTemplate].title}</h3>
          <div className="checklist">
            {templates[selectedTemplate].checklist.map((item, index) => (
              <div key={index} className="checklist-item">
                <input type="checkbox" id={`check-${index}`} />
                <label htmlFor={`check-${index}`}>{item}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector; 