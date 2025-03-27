# Assistant de Rédaction Médicale

Une application web pour générer des comptes rendus médicaux en format Word (.docx).

## Fonctionnalités

- Interface utilisateur intuitive
- Prévisualisation en Markdown et HTML
- Génération de documents Word (.docx)
- Design responsive

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd Paperassetor
```

2. Installer les dépendances du frontend :
```bash
npm install
```

3. Installer les dépendances du backend :
```bash
cd server
npm install
```

## Lancement

1. Démarrer le serveur backend (dans un terminal) :
```bash
cd server
node server.js
```

2. Démarrer l'application React (dans un autre terminal) :
```bash
npm start
```

L'application sera accessible sur http://localhost:3000

## Structure du projet

```
Paperassetor/
  ├── server/           # Backend Node.js
  │   ├── server.js     # Serveur Express
  │   └── package.json
  └── src/             # Frontend React
      ├── components/   # Composants React
      ├── App.jsx
      └── index.js
```

## Technologies utilisées

- Frontend : React
- Backend : Node.js, Express
- Génération de documents : docx 