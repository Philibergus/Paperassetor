import React, { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

const AgendaScanner = ({ onPatientsImported }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');

  const addDebugInfo = (info) => {
    console.log('Debug OCR:', info);
    setDebugInfo(prev => prev + '\n' + info);
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    setProgress(0);
    setDebugInfo('');

    try {
      addDebugInfo('Début du traitement de l\'image');
      addDebugInfo('Type d\'image reçu: ' + (imageData instanceof Blob ? 'Blob' : typeof imageData));

      const result = await Tesseract.recognize(
        imageData,
        'fra',
        {
          logger: data => {
            if (data.status === 'recognizing text') {
              setProgress(parseInt(data.progress * 100));
              addDebugInfo(`Progression OCR: ${parseInt(data.progress * 100)}%`);
            }
            addDebugInfo(`Status OCR: ${data.status}`);
          }
        }
      );

      addDebugInfo('Texte extrait: ' + result.data.text);
      const text = result.data.text;
      const appointments = parseAppointments(text);
      addDebugInfo('Rendez-vous trouvés: ' + JSON.stringify(appointments, null, 2));
      
      if (appointments.length > 0) {
        onPatientsImported(appointments);
        addDebugInfo('Rendez-vous importés avec succès');
      } else {
        addDebugInfo('Aucun rendez-vous trouvé dans le texte');
      }
    } catch (error) {
      const errorMsg = 'Erreur lors de l\'analyse de l\'image: ' + error.message;
      console.error(errorMsg);
      addDebugInfo(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseAppointments = (text) => {
    addDebugInfo('Début de l\'analyse du texte');
    // Regex améliorée pour détecter différents formats d'heures et de noms
    const appointmentRegex = /(\d{1,2}[h:]\d{0,2})\s*(?:[-–]|\s+)([A-ZÀ-Ÿ][a-zà-ÿ\s-]+)(?:\s*>|\s*$|\n)/gm;
    const appointments = [];
    let match;

    while ((match = appointmentRegex.exec(text)) !== null) {
      addDebugInfo('Match trouvé: ' + JSON.stringify(match));
      let time = match[1].replace('h', ':');
      if (time.length === 4 && time.includes(':')) time = '0' + time;
      if (!time.includes(':')) time = time + ':00';
      
      const patientName = match[2].trim();
      addDebugInfo(`Heure formatée: ${time}, Nom: ${patientName}`);

      if (patientName && !patientName.toLowerCase().includes('absence') && 
          !patientName.toLowerCase().includes('pause')) {
        appointments.push({
          time,
          patientInfo: patientName,
          isDone: false,
          sentToPractitioner: false,
          sentToPatient: false,
          savedInLogosw: false
        });
        addDebugInfo(`Rendez-vous ajouté: ${time} - ${patientName}`);
      } else {
        addDebugInfo(`Rendez-vous ignoré (absence/pause): ${time} - ${patientName}`);
      }
    }

    const sortedAppointments = appointments.sort((a, b) => a.time.localeCompare(b.time));
    addDebugInfo('Rendez-vous triés: ' + JSON.stringify(sortedAppointments, null, 2));
    return sortedAppointments;
  };

  const handlePaste = useCallback(async (e) => {
    e.preventDefault();
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        await processImage(blob);
        return;
      }
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    if (files.length > 0 && files[0].type.startsWith('image/')) {
      await processImage(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await processImage(file);
    }
  };

  return (
    <div className="agenda-scanner">
      <div 
        className="upload-section"
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h3>Scanner l'agenda du jour</h3>
        <p className="upload-instructions">
          Collez directement une capture d'écran (Ctrl+V) ou déposez une image ici
        </p>
        <div 
          className="drop-zone"
          role="button"
          tabIndex="0"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isProcessing}
            id="agenda-upload"
            className="file-input"
          />
          <label htmlFor="agenda-upload" className="upload-label">
            {isProcessing ? 'Analyse en cours...' : 'Cliquez ou déposez une image ici'}
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
        {debugInfo && (
          <div className="debug-info">
            <pre>{debugInfo}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaScanner; 