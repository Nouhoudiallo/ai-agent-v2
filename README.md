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
- **Créer une clé API** : Génère une clé API unique pour un utilisateur avec le rôle ADMIN.
- **Vérifier une clé API** : Valide une clé API pour l'accès sécurisé.

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
   Créez un fichier `.env` et ajoutez les informations nécessaires, comme l'URL de la base de données.

4. Appliquez les migrations Prisma :
   ```bash
   npx prisma migrate dev
   ```

5. Lancez le serveur :
   ```bash
   npm start
   ```

## Utilisation de l'API

### Endpoints

#### POST `/api/users`
**Description** : Crée un nouvel utilisateur.
**Exemple** :
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### POST `/api/discussions`
**Description** : Crée une nouvelle discussion.
**Exemple** :
```json
{
  "title": "Nouvelle discussion",
  "authorId": "user-id"
}
```

#### POST `/api/messages`
**Description** : Ajoute un message à une discussion.
**Exemple** :
```json
{
  "discussionId": "discussion-id",
  "content": "Ceci est un message",
  "sender": "USER"
}
```

## Sécurisation des Routes

### Clé API Obligatoire
Toutes les requêtes effectuées sur l'API nécessitent une clé API valide. Cette clé doit être incluse dans les en-têtes de la requête sous la forme :

```
'x-api-key': '<votre-clé-api>'
```

Sans une clé API valide, l'accès sera refusé avec un code de statut HTTP 403.

### Route pour Interroger l'Agent
Une route sécurisée est disponible pour interroger l'agent. Voici un exemple d'utilisation :

#### POST `/api/agent-query`
**Description** : Permet d'envoyer une requête à l'agent.
**Exemple** :
```json
{
  "query": "Quelle est la météo aujourd'hui ?"
}
```
**En-tête requis** :
```json
{
  "x-api-key": "votre-clé-api"
}
```

**Réponse** :
```json
{
  "response": "La météo est ensoleillée avec une température de 25°C."
}
```

### Sécurisation des Routes de Gestion des Utilisateurs et Discussions

Toutes les routes de gestion des utilisateurs et des discussions nécessitent également une clé API valide. Cette clé doit être incluse dans les en-têtes de la requête sous la forme :

```
'x-api-key': '<votre-clé-api>'
```

Sans une clé API valide, l'accès sera refusé avec un code de statut HTTP 403.

## Exemple d'Intégration avec React

### Installation
Ajoutez Axios pour les requêtes HTTP :
```bash
npm install axios
```

### Exemple de Code
```jsx
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');

  const createUser = async () => {
    try {
      const response = await axios.post('/api/users', { email, password }, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      console.log('Utilisateur créé :', response.data);
    } catch (error) {
      console.error('Erreur lors de la création de l'utilisateur :', error);
    }
  };

  return (
    <div>
      <h1>Créer un utilisateur</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Clé API"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button onClick={createUser}>Créer</button>
    </div>
  );
};

export default App;
```

## Extensibilité
L'agent peut être étendu pour inclure des fonctionnalités supplémentaires comme :
- Analyse des données.
- Intégration avec des services tiers.
- Automatisation des tâches complexes.

## Support
Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub ou contacter l'équipe de développement.

---

Merci d'utiliser **ai-agent-v2** !