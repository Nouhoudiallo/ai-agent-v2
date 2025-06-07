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

### Suppression d’un utilisateur et gestion des entités liées
- **Suppression en cascade** : Lorsqu’un utilisateur est supprimé, toutes ses discussions et les messages associés sont également supprimés automatiquement grâce à la configuration `onDelete: Cascade` dans le schéma Prisma.
- **Attention** : Si d’autres entités référencent l’utilisateur sans suppression en cascade, une erreur de contrainte étrangère peut survenir. Dans ce cas, il faut d’abord supprimer ou détacher ces entités avant de supprimer l’utilisateur.

### Gestion des erreurs de suppression
- Si la suppression échoue avec une erreur de type `Foreign key constraint violated`, cela signifie que des entités liées empêchent la suppression. Vérifiez la configuration du schéma Prisma ou supprimez d’abord les entités dépendantes.

### Exemple de réponse d’erreur lors de la suppression
```json
{
  "error": "Erreur lors de la suppression de l'utilisateur.",
  "details": "Foreign key constraint violated on the constraint: Message_discussionId_fkey"
}
```

### Mise à jour du schéma Prisma (extrait)
```prisma
model Discussion {
  // ...
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  // ...
}

model Message {
  // ...
  discussion   Discussion @relation(fields: [discussionId], references: [id], onDelete: Cascade)
  // ...
}
```

> La suppression d’un utilisateur entraîne donc la suppression de ses discussions et messages associés.

### Gestion des Documents
- **Uploader un document** : Permet d'envoyer un fichier (PDF, DOCX, TXT) qui sera découpé en morceaux (chunks) et stocké en base de données.
- **Stockage des chunks** : Chaque document est découpé en segments de 1000 caractères avec un chevauchement de 200 caractères pour une meilleure gestion et recherche.
- **Suppression** : Les documents et leurs chunks sont liés à l'utilisateur uploader.

### Nouveaux Endpoints

#### POST `/uploadDocument`
**Description** : Permet d'uploader un document (PDF, DOCX, TXT) pour un utilisateur donné.
**Body attendu** :
- `file` (multipart/form-data)
- `userId` (string)

**Réponse** :
```json
{
  "success": true,
  "documentId": "id-du-document",
  "chunks": 5
}
```

#### POST `/addMessageToDiscussion`
**Description** : Ajoute un message à une discussion existante.
**Body attendu** :
```json
{
  "discussionId": "id-de-la-discussion",
  "content": "Votre message",
  "sender": "USER" // ou "AGENT"
}
```

#### POST `/createDiscussion`
**Description** : Crée une nouvelle discussion pour un utilisateur.
**Body attendu** :
```json
{
  "title": "Titre de la discussion",
  "authorId": "id-utilisateur"
}
```

#### POST `/getUserByEmail`
**Description** : Récupère un utilisateur par son email.
**Body attendu** :
```json
{
  "email": "user@example.com"
}
```

#### POST `/getUserDiscussions`
**Description** : Récupère toutes les discussions d'un utilisateur avec leurs messages.
**Body attendu** :
```json
{
  "userId": "id-utilisateur"
}
```

### Améliorations de l'agent
- L'agent conserve l'historique des discussions et peut reconnaître les questions déjà posées ou rappeler des informations personnelles déjà données.
- L'agent utilise la mémoire contextuelle pour fournir des réponses plus pertinentes.

### Modifications techniques
- Ajout des modèles `Document` et `DocumentChunk` dans Prisma pour la gestion documentaire.
- Ajout de la gestion des rôles et de la création d'admin via script.
- Sécurisation des routes par clé API.
- Factorisation de la connexion Prisma avec le helper `withPrisma`.

---