import React, { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

const AgendaScanner = ({ onPatientsImported }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');

  const addDebugInfo = (info) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${info}`;
    console.log('Debug OCR:', logMessage);
    setDebugInfo(prev => prev + '\n' + logMessage);
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    setProgress(0);
    setDebugInfo('');

    try {
      addDebugInfo('Début du traitement de l\'image');
      addDebugInfo(`Type d'image reçu: ${imageData instanceof Blob ? 'Blob' : typeof imageData}`);
      addDebugInfo(`Taille de l'image: ${imageData.size} octets`);
      addDebugInfo(`Type MIME: ${imageData.type}`);

      const result = await Tesseract.recognize(
        imageData,
        'fra',
        {
          logger: data => {
            if (data.status === 'recognizing text') {
              const currentProgress = parseInt(data.progress * 100);
              setProgress(currentProgress);
              addDebugInfo(`Progression OCR: ${currentProgress}%`);
            }
            addDebugInfo(`Status OCR: ${data.status} - ${JSON.stringify(data.progress)}`);
          }
        }
      );

      addDebugInfo('Texte extrait brut:');
      addDebugInfo('---START---');
      addDebugInfo(result.data.text);
      addDebugInfo('---END---');

      const text = result.data.text;
      addDebugInfo('Début de l\'analyse du texte extrait');
      const appointments = parseAppointments(text);
      addDebugInfo(`Nombre de rendez-vous trouvés: ${appointments.length}`);
      addDebugInfo('Rendez-vous détectés:');
      appointments.forEach((apt, index) => {
        addDebugInfo(`[${index + 1}] ${apt.time} - ${apt.patientInfo}`);
      });
      
      if (appointments.length > 0) {
        onPatientsImported(appointments);
        addDebugInfo('Rendez-vous importés avec succès dans l\'application');
      } else {
        addDebugInfo('⚠️ Aucun rendez-vous n\'a été trouvé dans le texte');
      }
    } catch (error) {
      const errorMsg = `❌ Erreur lors de l'analyse de l'image: ${error.message}`;
      console.error(errorMsg);
      addDebugInfo(errorMsg);
      if (error.stack) {
        addDebugInfo('Stack trace:');
        addDebugInfo(error.stack);
      }
    } finally {
      setIsProcessing(false);
      addDebugInfo('Fin du traitement de l\'image');
    }
  };

  const parseAppointments = (text) => {
    addDebugInfo('Début de l\'analyse du texte pour extraction des rendez-vous');
    const appointmentRegex = /(\d{1,2}[h:]\d{0,2})\s*(?:[-–]|\s+)([A-ZÀ-Ÿ][a-zà-ÿ\s-]+)(?:\s*>|\s*$|\n)/gm;
    addDebugInfo(`Expression régulière utilisée: ${appointmentRegex.source}`);
    
    const appointments = [];
    let match;
    let matchCount = 0;

    while ((match = appointmentRegex.exec(text)) !== null) {
      matchCount++;
      addDebugInfo(`Match #${matchCount} trouvé: "${match[0]}"`);
      
      let time = match[1].replace('h', ':');
      addDebugInfo(`Heure brute: "${match[1]}" -> Formatée: "${time}"`);
      
      if (time.length === 4 && time.includes(':')) {
        time = '0' + time;
        addDebugInfo(`Ajout du 0 initial: "${time}"`);
      }
      if (!time.includes(':')) {
        time = time + ':00';
        addDebugInfo(`Ajout des minutes: "${time}"`);
      }
      
      const patientName = match[2].trim();
      addDebugInfo(`Nom du patient: "${patientName}"`);

      if (patientName && 
          !patientName.toLowerCase().includes('absence') && 
          !patientName.toLowerCase().includes('pause')) {
        appointments.push({
          time,
          patientInfo: patientName,
          isDone: false,
          sentToPractitioner: false,
          sentToPatient: false,
          savedInLogosw: false
        });
        addDebugInfo(`✅ Rendez-vous ajouté: ${time} - ${patientName}`);
      } else {
        addDebugInfo(`⚠️ Rendez-vous ignoré (absence/pause): ${time} - ${patientName}`);
      }
    }

    addDebugInfo(`Total des correspondances trouvées: ${matchCount}`);
    addDebugInfo(`Rendez-vous valides extraits: ${appointments.length}`);

    const sortedAppointments = appointments.sort((a, b) => a.time.localeCompare(b.time));
    addDebugInfo('Rendez-vous triés par ordre chronologique:');
    sortedAppointments.forEach((apt, index) => {
      addDebugInfo(`[${index + 1}] ${apt.time} - ${apt.patientInfo}`);
    });

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
          tabIndex={0}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          {isProcessing ? (
            <div className="processing-status">
              <div className="spinner"></div>
              <p>Traitement en cours... {progress}%</p>
            </div>
          ) : (
            <p>Cliquez ou déposez une image ici</p>
          )}
        </div>
        <div className="debug-info">
          <h4>Logs de débogage :</h4>
          <pre>{debugInfo}</pre>
        </div>
      </div>
    </div>
  );
};

export default AgendaScanner; 