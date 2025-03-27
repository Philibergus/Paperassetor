// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const PDFDocument = require('pdfkit');
const { processText } = require('./lmStudio');
const { documentTemplate, applyTemplate, baseTemplate } = require('./templates');
require('dotenv').config();

// Création de l'application Express
const app = express();

// Configuration du middleware
app.use(cors());
app.use(express.json());

// Fonction pour créer un document Word structuré
async function createStructuredDocx(structuredContent) {
    const doc = new Document({
        sections: [{
            properties: {},
            children: Object.entries(documentTemplate).map(([key, section]) => [
                new Paragraph({
                    text: section.title,
                    heading: HeadingLevel.HEADING_1,
                    spacing: {
                        after: 200,
                        before: 400,
                    },
                }),
                new Paragraph({
                    text: structuredContent[key] || '',
                    spacing: {
                        after: 200,
                        line: 360,
                    },
                }),
            ]).flat(),
        }],
    });

    return await Packer.toBuffer(doc);
}

// Fonction pour créer un PDF structuré
function createStructuredPdf(structuredContent) {
    return new Promise((resolve) => {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Tableau pour stocker les buffers du PDF
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Style du document
        doc.font('Helvetica-Bold');
        doc.fontSize(16);

        // Ajout des sections
        Object.entries(documentTemplate).forEach(([key, section], index) => {
            if (index > 0) doc.moveDown(2);
            
            doc.text(section.title);
            doc.moveDown();
            
            doc.font('Helvetica');
            doc.fontSize(12);
            doc.text(structuredContent[key] || '', {
                align: 'left',
                lineGap: 10
            });
            
            doc.font('Helvetica-Bold');
            doc.fontSize(16);
        });

        doc.end();
    });
}

// Endpoint pour analyser le texte avec LM Studio
app.post('/analyze-text', async (req, res) => {
    try {
        const { text } = req.body;
        const structuredContent = await processText(text);
        res.json(structuredContent);
    } catch (error) {
        console.error('Erreur lors de l\'analyse du texte:', error);
        res.status(500).json({ 
            error: 'Erreur lors de l\'analyse du texte',
            details: error.message
        });
    }
});

// Endpoint pour générer les documents structurés
app.post('/generate-structured-doc', async (req, res) => {
    try {
        const { text, format = 'docx' } = req.body;

        // Analyse du texte avec LM Studio
        const structuredContent = await processText(text);

        // Génération du document selon le format demandé
        let buffer;
        let contentType;
        let filename;

        if (format === 'pdf') {
            buffer = await createStructuredPdf(structuredContent);
            contentType = 'application/pdf';
            filename = 'rapport.pdf';
        } else {
            buffer = await createStructuredDocx(structuredContent);
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            filename = 'rapport.docx';
        }

        // Configuration des headers pour le téléchargement
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Envoi du fichier
        res.send(buffer);
    } catch (error) {
        console.error('Erreur lors de la génération du document:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la génération du document',
            details: error.message
        });
    }
});

// Conservation des anciens endpoints pour la rétrocompatibilité
app.post('/generate-docx', async (req, res) => {
    req.body.format = 'docx';
    app.handle(req, res);
});

app.post('/generate-pdf', async (req, res) => {
    req.body.format = 'pdf';
    app.handle(req, res);
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 