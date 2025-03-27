import React, { useState, useEffect } from 'react';

const EmailSender = ({ structuredContent, markdown }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Compte Rendu Médical',
    message: 'Veuillez trouver ci-joint votre compte rendu médical.',
    format: 'pdf'
  });
  const [correspondants, setCorrespondants] = useState([]);

  // Récupérer les correspondants au chargement du composant
  useEffect(() => {
    const fetchCorrespondants = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/correspondants');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des correspondants');
        }
        const data = await response.json();
        setCorrespondants(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Une erreur est survenue lors de la récupération des correspondants');
      }
    };

    fetchCorrespondants();
  }, []);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  // Envoyer l'email
  const sendEmail = async (e) => {
    e.preventDefault();
    
    if (!markdown) {
      setError('Veuillez d\'abord saisir du texte à analyser');
      return;
    }
    
    if (!structuredContent) {
      setError('Veuillez d\'abord analyser le texte avec LM Studio');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emailData,
          text: markdown
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Erreur lors de l\'envoi de l\'email');
      }

      setSuccess(true);
      // Réinitialiser certains champs
      setEmailData({
        ...emailData,
        message: 'Veuillez trouver ci-joint votre compte rendu médical.'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  // Sélectionner un correspondant
  const selectCorrespondant = (e) => {
    const selectedId = e.target.value;
    if (selectedId === "") return;
    
    const correspondant = correspondants.find(c => c.id === selectedId);
    if (correspondant) {
      setEmailData({
        ...emailData,
        to: correspondant.email
      });
    }
  };

  return (
    <div className="email-sender">
      <h3>Envoyer par Email</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Email envoyé avec succès!</div>}
      
      <form onSubmit={sendEmail}>
        <div className="form-group">
          <label htmlFor="correspondant">Sélectionner un correspondant</label>
          <select 
            id="correspondant" 
            onChange={selectCorrespondant}
            className="select-input"
          >
            <option value="">-- Sélectionner --</option>
            {correspondants.map(c => (
              <option key={c.id} value={c.id}>
                {c.nom} {c.prenom} ({c.specialite || 'Patient'})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="to">Destinataire</label>
          <input
            type="email"
            id="to"
            name="to"
            value={emailData.to}
            onChange={handleChange}
            required
            className="text-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Sujet</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            required
            className="text-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={emailData.message}
            onChange={handleChange}
            rows="4"
            className="text-input"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="format">Format</label>
          <select
            id="format"
            name="format"
            value={emailData.format}
            onChange={handleChange}
            className="select-input"
          >
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="send-button"
          disabled={loading || !structuredContent}
        >
          {loading ? (
            <span className="loading-spinner">
              <span className="spinner"></span>
              Envoi en cours...
            </span>
          ) : (
            'Envoyer'
          )}
        </button>
      </form>
    </div>
  );
};

export default EmailSender; 