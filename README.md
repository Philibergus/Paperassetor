# Paperassetor - Assistant de Compte-Rendu Médical

## 🌟 Fonctionnalités

- 📝 Génération de comptes-rendus médicaux structurés
- 📸 Reconnaissance de texte (OCR) depuis des images
- 📋 Checklists personnalisées par type de compte-rendu
- 🎤 Reconnaissance vocale pour la dictée
- 📊 Gestion des correspondants avec import CSV
- 📅 Scanner d'agenda avec reconnaissance automatique des rendez-vous
- 💾 Sauvegarde automatique des données en local
- 📤 Export en PDF et DOCX

## 📋 Prérequis

1. **Node.js** (v18 ou supérieur)
2. **LM Studio** (pour le traitement du texte)
   - Téléchargez [LM Studio](https://lmstudio.ai/)
   - Installez un modèle compatible (recommandé : Mistral-7B)
   - Configurez le serveur local sur le port 1234 (port par défaut)

## 🚀 Installation

1. **Clonez le repository**
   ```bash
   git clone https://github.com/votre-username/paperassetor.git
   cd paperassetor
   ```

2. **Installez les dépendances du frontend**
   ```bash
   npm install
   ```

3. **Installez les dépendances du backend**
   ```bash
   cd server
   npm install
   ```

4. **Configuration de LM Studio**
   - Lancez LM Studio
   - Allez dans l'onglet "Local Server"
   - Chargez le modèle Mistral-7B
   - Cliquez sur "Start Server"
   - Vérifiez que le serveur est accessible sur `http://localhost:1234`

## 🎯 Démarrage

1. **Démarrez le serveur backend**
   ```bash
   cd server
   node server.js
   ```
   Le serveur démarrera sur `http://localhost:3001`

2. **Démarrez l'application frontend**
   ```bash
   # Dans un nouveau terminal, à la racine du projet
   npm start
   ```
   L'application sera accessible sur `http://localhost:3000`

## 💡 Utilisation

### OCR et Reconnaissance d'Agenda

1. Ouvrez l'onglet "Scanner d'Agenda"
2. Glissez-déposez une image de votre agenda ou utilisez le presse-papier (Ctrl+V)
3. L'OCR détectera automatiquement :
   - Les noms des patients
   - Les horaires de rendez-vous
   - Les types de consultation

### Création de Compte-Rendu

1. Sélectionnez un template (MP, Bilan Paro, Implantologie, Muccochirurgie)
2. Utilisez la checklist pour vérifier les éléments requis
3. Dictez votre compte-rendu avec le bouton microphone ou tapez-le
4. Exportez en PDF ou DOCX

### Gestion des Correspondants

1. Importez une liste via CSV ou ajoutez manuellement
2. Format CSV requis :
   ```csv
   nom,prenom,specialite,email,telephone
   Dupont,Jean,Orthodontiste,jean.dupont@email.com,0123456789
   ```

## ⚙️ Configuration Avancée

### LM Studio

Pour des résultats optimaux :
- Modèle recommandé : Mistral-7B
- Paramètres du serveur :
  - Temperature : 0.7
  - Max Tokens : 2000
  - Context Length : 4096
  - Top P : 0.9

### Personnalisation des Templates

Les templates sont configurables dans `src/components/TemplateSelector.jsx`

## 🔍 Dépannage

### Erreur "Failed to fetch"
- Vérifiez que LM Studio est bien lancé
- Vérifiez que le serveur est accessible sur `http://localhost:1234`
- Redémarrez le serveur backend

### OCR ne détecte pas les rendez-vous
- Vérifiez la qualité de l'image
- Assurez-vous que le texte est bien lisible
- Utilisez des images avec un bon contraste

## 📱 Compatibilité

- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux
- ✅ Navigateurs modernes (Chrome, Firefox, Edge)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout de fonctionnalité'`)
4. Push sur la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- LM Studio pour le traitement du langage naturel
- Tesseract.js pour l'OCR
- React pour l'interface utilisateur
- Express pour le serveur backend 