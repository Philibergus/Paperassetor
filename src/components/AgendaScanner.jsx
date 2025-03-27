import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const AgendaScanner = ({ onPatientsImported }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processImage = async (file) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(
        file,
        'fra',
        {
          logger: data => {
            if (data.status === 'recognizing text') {
              setProgress(parseInt(data.progress * 100));
            }
          }
        }
      );

      // Analyse du texte extrait pour trouver les rendez-vous
      const text = result.data.text;
      const appointments = parseAppointments(text);
      
      onPatientsImported(appointments);
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseAppointments = (text) => {
    // Regex pour extraire les informations des RDV
    const appointmentRegex = /(\d{2}:\d{2})\s*[-–]\s*([^\n]+)/g;
    const appointments = [];
    let match;

    while ((match = appointmentRegex.exec(text)) !== null) {
      const time = match[1];
      const patientInfo = match[2].trim();
      
      appointments.push({
        time,
        patientInfo,
        isDone: false,
        sentToPractitioner: false,
        sentToPatient: false,
        savedInLogosw: false
      });
    }

    return appointments.sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <div className="agenda-scanner">
      <div className="upload-section">
        <h3>Scanner l'agenda du jour</h3>
        <p className="upload-instructions">
          Importez une capture d'écran de votre agenda pour générer automatiquement la liste des patients du jour
        </p>
        <div className="file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isProcessing}
            id="agenda-upload"
          />
          <label htmlFor="agenda-upload" className="upload-label">
            {isProcessing ? 'Analyse en cours...' : 'Sélectionner une image de l\'agenda'}
          </label>
        </div>
        {isProcessing && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress}% - Analyse de l'agenda en cours</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaScanner; 