// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const { Document, Packer, Paragraph } = require('docx');
const PDFDocument = require('pdfkit');

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

// Endpoint pour générer le document PDF
app.post('/generate-pdf', (req, res) => {
    try {
        // Récupération du texte depuis la requête
        const { text } = req.body;

        // Création d'un nouveau document PDF
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Tableau pour stocker les buffers du PDF
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));

        // Une fois le PDF terminé, on l'envoie
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=rapport.pdf');
            res.send(pdfData);
        });

        // Configuration du style du document
        doc.font('Helvetica')
           .fontSize(12)
           .lineGap(10);

        // Ajout du texte au document
        doc.text(text, {
            align: 'left',
            lineGap: 10
        });

        // Finalisation du document
        doc.end();
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
    }
});

// Démarrage du serveur
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 