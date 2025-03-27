// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const { Document, Packer, Paragraph } = require('docx');

// Création de l'application Express
const app = express();

// Configuration du middleware
app.use(cors()); // Permet les requêtes CORS depuis le frontend
app.use(express.json()); // Permet de parser le JSON des requêtes

// Endpoint pour générer le document Word
app.post('/generate-docx', async (req, res) => {
    try {
        // Récupération du texte depuis la requête
        const { text } = req.body;

        // Création du document Word
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Création d'un paragraphe avec le texte fourni
                    new Paragraph({
                        text: text,
                        spacing: {
                            after: 200,
                            line: 360,
                        },
                    }),
                ],
            }],
        });

        // Conversion du document en buffer
        const buffer = await Packer.toBuffer(doc);

        // Configuration des headers pour le téléchargement
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=rapport.docx');

        // Envoi du fichier
        res.send(buffer);
    } catch (error) {
        console.error('Erreur lors de la génération du document:', error);
        res.status(500).json({ error: 'Erreur lors de la génération du document' });
    }
});

// Démarrage du serveur
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 