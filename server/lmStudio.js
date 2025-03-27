const axios = require('axios');
require('dotenv').config();

// Instructions pour LM Studio sur la structure attendue
const STRUCTURE_PROMPT = `
Analyse le texte suivant et structure-le en sections distinctes :
- En-tête (informations patient)
- Bilan parodontal
- Motif de consultation
- Diagnostic
- Plan de traitement

Format de sortie attendu (JSON uniquement, pas de texte supplémentaire) :
{
    "entete": "...",
    "bilan": "...",
    "motif": "...",
    "diagnostic": "...",
    "plan": "..."
}
`;

// Fonction pour appeler LM Studio
async function processText(rawText) {
    try {
        console.log('Envoi de la requête à LM Studio...');
        const response = await axios.post(process.env.LM_STUDIO_URL, {
            prompt: `${STRUCTURE_PROMPT}\n\nTexte à analyser:\n${rawText}`,
            temperature: 0.3,
            max_tokens: 500,
            stream: false,
            stop: ["<|end_of_text|>", "<|begin_of_text|>"]
        });

        console.log('Réponse reçue de LM Studio');

        if (response.data && response.data.choices && response.data.choices[0]) {
            const content = response.data.choices[0].text;
            try {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw new Error('Aucun JSON trouvé dans la réponse');
            } catch (e) {
                console.error('Contenu reçu non parsable:', content);
                throw new Error('Format de réponse invalide de LM Studio');
            }
        }

        throw new Error('Structure de réponse invalide de LM Studio');
    } catch (error) {
        console.error('Erreur détaillée:', error.response?.data || error.message);
        throw new Error('Erreur lors de l\'analyse du texte');
    }
}

module.exports = {
    processText
}; 