# ai-agent-v2

# Documentation Complète de l'Agent et de l'API

## Introduction
Bienvenue dans le projet **ai-agent-v2**. Ce projet fournit une API robuste et un agent intelligent conçu pour faciliter les interactions entre les utilisateurs et les systèmes automatisés. L'agent est capable de gérer des discussions, des utilisateurs, et des clés API tout en offrant une extensibilité pour des cas d'utilisation avancés.

## Fonctionnalités Principales

### Gestion des Utilisateurs
- **Créer un utilisateur** : Permet de créer un utilisateur avec un email, un mot de passe (haché pour la sécurité), et un rôle.
- **Mettre à jour un utilisateur** : Modifie les informations d'un utilisateur existant.
- **Supprimer un utilisateur** : Supprime un utilisateur de la base de données.

### Gestion des Discussions
- **Créer une discussion** : Crée une nouvelle discussion associée à un utilisateur.
- **Ajouter un message** : Ajoute un message à une discussion existante.
- **Récupérer les discussions** : Récupère toutes les discussions associées à un utilisateur.

### Gestion des Clés API
- **Créer une clé API** : Génère une clé API unique pour un utilisateur avec le rôle ADMIN (voir endpoint dédié).
- **Vérifier une clé API** : Valide une clé API pour l'accès sécurisé à toutes les routes.

### Agents et Outils
- **Agent Gemini** : Génération de texte et réponses contextuelles via Google Gemini.
- **Recherche Web** : Recherche d'informations sur le web via l'API Google Custom Search.
- **Parser Gemini** : Formatage avancé des réponses Gemini.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   cd ai-agent-v2
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env` et ajoutez les informations nécessaires (voir ci-dessous).

4. Appliquez les migrations Prisma :
   ```bash
   npx prisma migrate dev
   ```

5. Lancez le serveur :
   ```bash
   npm run build
   npm start
   ```

### Variables d'environnement requises
- `DATABASE_URL` (PostgreSQL)
- `GOOGLE_API_KEY` (pour la recherche web)
- `GOOGLE_SEARCH_ENGINE_ID` (pour la recherche web)
- `GOOGLE_GEMINI_API_KEY` (pour l'agent Gemini)

## Utilisation de l'API

### Endpoints principaux

#### POST `/ask`
**Description** : Interroge l'agent Gemini avec une question.
**Exemple** :
```json
{
  "question": "Quelle est la capitale de la France ?"
}
```
**Réponse** :
```json
{
  "response": "La capitale de la France est Paris."
}
```

#### POST `/addUser`
**Description** : Crée un nouvel utilisateur.
**Exemple** :
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### POST `/updateUser`
**Description** : Met à jour un utilisateur (en développement).
**Exemple** :
```json
{
  "userId": "user-id",
  "email": "nouvel@email.com"
}
```

### Sécurisation des Routes

Toutes les routes sont protégées par une clé API à fournir dans l'en-tête :
```
'x-api-key': '<votre-clé-api>'
```
Sans clé API valide, l'accès est refusé (HTTP 403).

#### Création et gestion des clés API
- Seuls les utilisateurs avec le rôle `ADMIN` peuvent générer une clé API.
- La table `ApiKey` relie chaque clé à son auteur (voir migrations Prisma).
- Utilisez le script ou endpoint dédié pour générer une clé API après avoir créé un admin.

### Exemple d'intégration avec React

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const createUser = async () => {
    try {
      const res = await axios.post('/addUser', { email, password }, {
        headers: { 'x-api-key': apiKey },
      });
      alert('Utilisateur créé : ' + JSON.stringify(res.data));
    } catch (error) {
      alert('Erreur : ' + error);
    }
  };

  const askAgent = async () => {
    try {
      const res = await axios.post('/ask', { question }, {
        headers: { 'x-api-key': apiKey },
      });
      setResponse(res.data.response);
    } catch (error) {
      setResponse('Erreur : ' + error);
    }
  };

  return (
    <div>
      <h1>Créer un utilisateur</h1>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <input type="text" placeholder="Clé API" value={apiKey} onChange={e => setApiKey(e.target.value)} />
      <button onClick={createUser}>Créer</button>
      <h2>Interroger l'agent</h2>
      <input type="text" placeholder="Votre question" value={question} onChange={e => setQuestion(e.target.value)} />
      <button onClick={askAgent}>Envoyer</button>
      <div>Réponse : {response}</div>
    </div>
  );
};

export default App;
```

## Architecture technique

- **RouteAgent** : Classe utilitaire pour créer des routes Express sécurisées par clé API.
- **Prisma** : ORM pour la gestion des utilisateurs, discussions, messages et clés API.
- **Agents** : Intégration Gemini, recherche web, etc.
- **Outils** : Fonctions utilitaires, parsers, gestion des variables d'environnement.

## Extensibilité
L'agent peut être étendu pour inclure des fonctionnalités supplémentaires comme :
- Analyse des données
- Intégration avec des services tiers
- Automatisation des tâches complexes

## Support
Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub ou contacter l'équipe de développement.

---

Merci d'utiliser **ai-agent-v2** !