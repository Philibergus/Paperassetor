import React, { useState, useEffect } from 'react';

const PatientsTodoList = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ 
    nom: '', 
    prenom: '', 
    heure: '',
    envoyePraticien: false,
    envoyePatient: false,
    enregistreDossier: false
  });

  // Ajouter un patient à la liste
  const addPatient = (e) => {
    e.preventDefault();
    const patient = {
      id: Date.now().toString(),
      ...newPatient,
      date: new Date().toISOString().split('T')[0]
    };
    setPatients([...patients, patient]);
    setNewPatient({ 
      nom: '', 
      prenom: '', 
      heure: '',
      envoyePraticien: false,
      envoyePatient: false,
      enregistreDossier: false
    });

    // Sauvegarder dans le localStorage
    saveToLocalStorage([...patients, patient]);
  };

  // Sauvegarder dans le localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('patientsTodoList', JSON.stringify(data));
  };

  // Charger depuis le localStorage au chargement du composant
  useEffect(() => {
    const savedPatients = localStorage.getItem('patientsTodoList');
    if (savedPatients) {
      // Filtrer pour ne garder que les patients du jour
      const today = new Date().toISOString().split('T')[0];
      const patientsOfDay = JSON.parse(savedPatients).filter(
        patient => patient.date === today
      );
      setPatients(patientsOfDay);
    }
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  // Mettre à jour les statuts
  const updateStatus = (id, field) => {
    const updatedPatients = patients.map(patient => {
      if (patient.id === id) {
        return { ...patient, [field]: !patient[field] };
      }
      return patient;
    });
    setPatients(updatedPatients);
    saveToLocalStorage(updatedPatients);
  };

  // Supprimer un patient
  const deletePatient = (id) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    setPatients(updatedPatients);
    saveToLocalStorage(updatedPatients);
  };

  return (
    <div className="patients-todolist">
      <h2>Patients du jour</h2>

      <div className="patient-form">
        <h3>Ajouter un patient</h3>
        <form onSubmit={addPatient}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={newPatient.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={newPatient.prenom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="heure">Heure</label>
              <input
                type="time"
                id="heure"
                name="heure"
                value={newPatient.heure}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="add-button">Ajouter à la liste</button>
        </form>
      </div>

      <div className="patient-list">
        <h3>Liste des patients</h3>
        {patients.length === 0 ? (
          <p className="no-patients">Aucun patient pour aujourd'hui.</p>
        ) : (
          <ul className="todo-list">
            {patients
              .sort((a, b) => a.heure.localeCompare(b.heure))
              .map(patient => (
                <li key={patient.id} className="todo-item">
                  <div className="patient-info">
                    <span className="patient-time">{patient.heure}</span>
                    <span className="patient-name">{patient.nom} {patient.prenom}</span>
                  </div>
                  
                  <div className="status-checkboxes">
                    <div className="status-item">
                      <input
                        type="checkbox"
                        id={`praticien-${patient.id}`}
                        checked={patient.envoyePraticien}
                        onChange={() => updateStatus(patient.id, 'envoyePraticien')}
                      />
                      <label htmlFor={`praticien-${patient.id}`}>Praticien</label>
                    </div>
                    
                    <div className="status-item">
                      <input
                        type="checkbox"
                        id={`patient-${patient.id}`}
                        checked={patient.envoyePatient}
                        onChange={() => updateStatus(patient.id, 'envoyePatient')}
                      />
                      <label htmlFor={`patient-${patient.id}`}>Patient</label>
                    </div>
                    
                    <div className="status-item">
                      <input
                        type="checkbox"
                        id={`dossier-${patient.id}`}
                        checked={patient.enregistreDossier}
                        onChange={() => updateStatus(patient.id, 'enregistreDossier')}
                      />
                      <label htmlFor={`dossier-${patient.id}`}>Logosw</label>
                    </div>
                    
                    <button
                      className="delete-button"
                      onClick={() => deletePatient(patient.id)}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientsTodoList; 