import React, { useState, useEffect } from 'react';

const Correspondants = () => {
  const [correspondants, setCorrespondants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCorrespondant, setNewCorrespondant] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    adresse: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [filterText, setFilterText] = useState('');

  // Charger les correspondants au chargement du composant
  useEffect(() => {
    fetchCorrespondants();
  }, []);

  // Récupérer tous les correspondants
  const fetchCorrespondants = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un nouveau correspondant
  const addCorrespondant = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/correspondants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCorrespondant),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du correspondant');
      }

      const data = await response.json();
      setCorrespondants([...correspondants, data]);
      setNewCorrespondant({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        specialite: '',
        adresse: ''
      });
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de l\'ajout du correspondant');
    }
  };

  // Supprimer un correspondant
  const deleteCorrespondant = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce correspondant ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/correspondants/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du correspondant');
      }

      setCorrespondants(correspondants.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de la suppression du correspondant');
    }
  };

  // Mettre à jour un correspondant
  const updateCorrespondant = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/correspondants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du correspondant');
      }

      const data = await response.json();
      setCorrespondants(correspondants.map(c => c.id === id ? data : c));
      setEditingId(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de la mise à jour du correspondant');
    }
  };

  // Gérer le changement dans le formulaire d'ajout
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCorrespondant({ ...newCorrespondant, [name]: value });
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setFilterText(e.target.value);
  };

  // Filtrer les correspondants selon la recherche
  const filteredCorrespondants = correspondants.filter(c => {
    const searchText = filterText.toLowerCase();
    return (
      c.nom?.toLowerCase().includes(searchText) ||
      c.prenom?.toLowerCase().includes(searchText) ||
      c.email?.toLowerCase().includes(searchText) ||
      c.specialite?.toLowerCase().includes(searchText)
    );
  });

  // Éditer un correspondant
  const startEditing = (correspondant) => {
    setEditingId(correspondant.id);
    setNewCorrespondant(correspondant);
  };

  // Annuler l'édition
  const cancelEditing = () => {
    setEditingId(null);
    setNewCorrespondant({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      specialite: '',
      adresse: ''
    });
  };

  // Appliquer les modifications
  const applyEditing = () => {
    updateCorrespondant(editingId, newCorrespondant);
  };

  return (
    <div className="correspondants-container">
      <h2>Gestion des Correspondants</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un correspondant..."
          value={filterText}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      <div className="correspondants-form">
        <h3>{editingId ? 'Modifier un correspondant' : 'Ajouter un correspondant'}</h3>
        <form onSubmit={editingId ? (e) => { e.preventDefault(); applyEditing(); } : addCorrespondant}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={newCorrespondant.nom}
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
                value={newCorrespondant.prenom}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newCorrespondant.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={newCorrespondant.telephone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specialite">Spécialité</label>
              <input
                type="text"
                id="specialite"
                name="specialite"
                value={newCorrespondant.specialite}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="adresse">Adresse</label>
            <textarea
              id="adresse"
              name="adresse"
              value={newCorrespondant.adresse}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-buttons">
            {editingId ? (
              <>
                <button type="submit" className="save-button">Enregistrer</button>
                <button type="button" className="cancel-button" onClick={cancelEditing}>Annuler</button>
              </>
            ) : (
              <button type="submit" className="add-button">Ajouter</button>
            )}
          </div>
        </form>
      </div>
      
      <div className="correspondants-list">
        <h3>Liste des Correspondants</h3>
        {loading ? (
          <div className="loading-spinner">
            <span className="spinner"></span>
            Chargement...
          </div>
        ) : (
          <>
            {filteredCorrespondants.length === 0 ? (
              <p className="no-results">Aucun correspondant trouvé.</p>
            ) : (
              <table className="correspondants-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Spécialité</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCorrespondants.map(correspondant => (
                    <tr key={correspondant.id}>
                      <td>{correspondant.nom}</td>
                      <td>{correspondant.prenom}</td>
                      <td>{correspondant.email}</td>
                      <td>{correspondant.telephone}</td>
                      <td>{correspondant.specialite}</td>
                      <td className="actions">
                        <button
                          className="edit-button"
                          onClick={() => startEditing(correspondant)}
                        >
                          Éditer
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteCorrespondant(correspondant.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Correspondants; 