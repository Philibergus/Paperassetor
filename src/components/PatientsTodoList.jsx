import React, { useState } from 'react';

const PatientsTodoList = ({ patients, onPatientsChange }) => {
  const [newPatient, setNewPatient] = useState('');

  const handleAddPatient = (e) => {
    if (e.key === 'Enter' && newPatient.trim()) {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newPatientObj = {
        time,
        patientInfo: newPatient.trim(),
        isDone: false,
        sentToPractitioner: false,
        sentToPatient: false,
        savedInLogosw: false
      };

      onPatientsChange([...patients, newPatientObj].sort((a, b) => a.time.localeCompare(b.time)));
      setNewPatient('');
    }
  };

  const togglePatientStatus = (index, field) => {
    const updatedPatients = [...patients];
    updatedPatients[index][field] = !updatedPatients[index][field];
    onPatientsChange(updatedPatients);
  };

  const removePatient = (index) => {
    const updatedPatients = patients.filter((_, i) => i !== index);
    onPatientsChange(updatedPatients);
  };

  return (
    <div className="patients-list">
      <div className="add-patient">
        <input
          type="text"
          value={newPatient}
          onChange={(e) => setNewPatient(e.target.value)}
          onKeyPress={handleAddPatient}
          placeholder="Ajouter un patient (Appuyez sur Entrée)"
          className="patient-input"
        />
      </div>

      {patients.map((patient, index) => (
        <div key={index} className="patient-item">
          <span className="patient-time">{patient.time}</span>
          <span className="patient-name">{patient.patientInfo}</span>
          <div className="patient-actions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={patient.isDone}
                onChange={() => togglePatientStatus(index, 'isDone')}
                className="patient-checkbox"
              />
              Fait
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={patient.sentToPractitioner}
                onChange={() => togglePatientStatus(index, 'sentToPractitioner')}
                className="patient-checkbox"
              />
              Envoyé
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={patient.savedInLogosw}
                onChange={() => togglePatientStatus(index, 'savedInLogosw')}
                className="patient-checkbox"
              />
              Logiciel
            </label>
            <button
              onClick={() => removePatient(index)}
              className="remove-button"
              title="Supprimer"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientsTodoList; 