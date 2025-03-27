const fs = require('fs').promises;
const path = require('path');

// Chemin vers le fichier de base de données JSON
const DB_PATH = path.join(__dirname, 'data', 'correspondants.json');

// S'assurer que le dossier data existe
async function ensureDataDirExists() {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch (error) {
        // Le dossier n'existe pas, on le crée
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Charger la base de données
async function loadDatabase() {
    await ensureDataDirExists();
    
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si le fichier n'existe pas, on retourne une base vide
        if (error.code === 'ENOENT') {
            return { correspondants: [] };
        }
        throw error;
    }
}

// Sauvegarder la base de données
async function saveDatabase(data) {
    await ensureDataDirExists();
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Récupérer tous les correspondants
async function getAllCorrespondants() {
    const db = await loadDatabase();
    return db.correspondants;
}

// Récupérer un correspondant par ID
async function getCorrespondantById(id) {
    const db = await loadDatabase();
    return db.correspondants.find(c => c.id === id);
}

// Ajouter un nouveau correspondant
async function addCorrespondant(correspondant) {
    const db = await loadDatabase();
    
    // Générer un ID unique
    const id = Date.now().toString();
    const newCorrespondant = {
        id,
        ...correspondant,
        dateCreation: new Date().toISOString()
    };
    
    db.correspondants.push(newCorrespondant);
    await saveDatabase(db);
    return newCorrespondant;
}

// Mettre à jour un correspondant
async function updateCorrespondant(id, updates) {
    const db = await loadDatabase();
    const index = db.correspondants.findIndex(c => c.id === id);
    
    if (index === -1) {
        throw new Error('Correspondant non trouvé');
    }
    
    db.correspondants[index] = {
        ...db.correspondants[index],
        ...updates,
        dateModification: new Date().toISOString()
    };
    
    await saveDatabase(db);
    return db.correspondants[index];
}

// Supprimer un correspondant
async function deleteCorrespondant(id) {
    const db = await loadDatabase();
    const index = db.correspondants.findIndex(c => c.id === id);
    
    if (index === -1) {
        throw new Error('Correspondant non trouvé');
    }
    
    const deleted = db.correspondants.splice(index, 1)[0];
    await saveDatabase(db);
    return deleted;
}

// Rechercher des correspondants par critères
async function searchCorrespondants(criteria) {
    const db = await loadDatabase();
    
    return db.correspondants.filter(c => {
        return Object.entries(criteria).every(([key, value]) => {
            if (typeof value === 'string') {
                return c[key] && c[key].toLowerCase().includes(value.toLowerCase());
            }
            return c[key] === value;
        });
    });
}

module.exports = {
    getAllCorrespondants,
    getCorrespondantById,
    addCorrespondant,
    updateCorrespondant,
    deleteCorrespondant,
    searchCorrespondants
}; 