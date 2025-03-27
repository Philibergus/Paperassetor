// Templates pour les différentes sections du document
const documentTemplate = {
    entete: {
        title: "EN-TÊTE",
        placeholder: "{{entete}}"
    },
    bilan: {
        title: "BILAN PARODONTAL",
        placeholder: "{{bilan}}"
    },
    motif: {
        title: "MOTIF DE CONSULTATION",
        placeholder: "{{motif}}"
    },
    diagnostic: {
        title: "DIAGNOSTIC",
        placeholder: "{{diagnostic}}"
    },
    plan: {
        title: "PLAN DE TRAITEMENT",
        placeholder: "{{plan}}"
    }
};

// Fonction pour remplacer les placeholders par le contenu
function applyTemplate(template, content) {
    let result = template;
    for (const [key, value] of Object.entries(content)) {
        const placeholder = documentTemplate[key]?.placeholder;
        if (placeholder) {
            result = result.replace(placeholder, value);
        }
    }
    return result;
}

// Template de base pour le document
const baseTemplate = `
EN-TÊTE :
{{entete}}

BILAN PARODONTAL :
{{bilan}}

MOTIF DE CONSULTATION :
{{motif}}

DIAGNOSTIC :
{{diagnostic}}

PLAN DE TRAITEMENT :
{{plan}}
`;

module.exports = {
    documentTemplate,
    applyTemplate,
    baseTemplate
}; 