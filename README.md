# API Bibliothèque - Node.js & MongoDB

API REST pour la gestion d'une bibliothèque avec authentification JWT, permettant de gérer des auteurs et des livres.

## 🚀 Fonctionnalités

- **Authentification** : Inscription et connexion avec JWT
- **Gestion des auteurs** : CRUD complet pour les auteurs
- **Gestion des livres** : CRUD complet pour les livres (création protégée par authentification)
- **Validation** : Validation des données avec Joi
- **Tests** : Suite de tests avec Jest et Supertest

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🔧 Installation

1. Clonez le repository :
```bash
git clone <url-du-repo>
cd day4
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet :
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/bibliotheque
MONGODB_URI_TEST=mongodb://localhost:27017/bibliotheque_test

# JWT
JWT_SECRET=votre_secret_jwt_super_securise
```

4. Démarrez le serveur :
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## 📚 Structure du projet

```
day4/
├── config/
│   └── mongo.config.js      # Configuration MongoDB
├── middlewares/
│   ├── auth.js              # Middleware d'authentification JWT
│   └── validate.js         # Middleware de validation Joi
├── models/
│   ├── User.js              # Modèle utilisateur
│   ├── Auteur.js            # Modèle auteur
│   └── Livre.js             # Modèle livre
├── routes/
│   ├── auth.js              # Routes d'authentification
│   ├── auteur.js            # Routes des auteurs
│   └── livre.js             # Routes des livres
├── tests/
│   └── api.test.js          # Tests de l'API
├── validation/
│   └── schemas.js           # Schémas de validation Joi
├── server.js                 # Point d'entrée de l'application
└── package.json
```

## 🔌 API Endpoints

### Authentification

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "motDePasse": "password123"
}
```

**Réponse (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "motDePasse": "password123"
}
```

**Réponse (200):**
```json
{
  "user": {
    "_id": "...",
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Auteurs

#### GET `/api/auteurs`
Récupère tous les auteurs (triés par date de création décroissante).

**Réponse (200):**
```json
[
  {
    "_id": "...",
    "nom": "Victor Hugo",
    "nationalite": "Française",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET `/api/auteurs/:id`
Récupère un auteur avec ses livres.

**Réponse (200):**
```json
{
  "_id": "...",
  "nom": "Victor Hugo",
  "nationalite": "Française",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "livres": [...]
}
```

#### POST `/api/auteurs`
Crée un nouvel auteur.

**Body:**
```json
{
  "nom": "Victor Hugo",
  "nationalite": "Française"
}
```

**Réponse (201):**
```json
{
  "_id": "...",
  "nom": "Victor Hugo",
  "nationalite": "Française",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Livres

#### GET `/api/livres`
Récupère tous les livres avec leurs auteurs (triés par date de création décroissante).

**Réponse (200):**
```json
[
  {
    "_id": "...",
    "titre": "Les Misérables",
    "anneePublication": 1862,
    "auteurId": {
      "_id": "...",
      "nom": "Victor Hugo",
      "nationalite": "Française"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET `/api/livres/:id`
Récupère un livre avec son auteur.

**Réponse (200):**
```json
{
  "_id": "...",
  "titre": "Les Misérables",
  "anneePublication": 1862,
  "auteurId": {
    "_id": "...",
    "nom": "Victor Hugo",
    "nationalite": "Française"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST `/api/livres`
Crée un nouveau livre. **Requiert une authentification.**

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "titre": "Les Misérables",
  "anneePublication": 1862,
  "auteurId": "<id_de_l_auteur>"
}
```

**Réponse (201):**
```json
{
  "_id": "...",
  "titre": "Les Misérables",
  "anneePublication": 1862,
  "auteurId": {
    "_id": "...",
    "nom": "Victor Hugo",
    "nationalite": "Française"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT `/api/livres/:id`
Met à jour un livre.

**Body:**
```json
{
  "titre": "Nouveau titre",
  "anneePublication": 1863,
  "auteurId": "<id_de_l_auteur>"
}
```

**Réponse (200):**
```json
{
  "_id": "...",
  "titre": "Nouveau titre",
  "anneePublication": 1863,
  "auteurId": {...},
  "createdAt": "..."
}
```

#### DELETE `/api/livres/:id`
Supprime un livre.

**Réponse (200):**
```json
{
  "message": "Livre supprimé avec succès."
}
```

## 🔐 Authentification

Pour accéder aux routes protégées, vous devez inclure le token JWT dans l'en-tête `Authorization` :

```
Authorization: Bearer <votre_token_jwt>
```

Le token expire après 1 heure.

## ✅ Tests

Exécutez les tests avec :

```bash
npm test
```

Les tests couvrent :
- L'inscription et la connexion des utilisateurs
- La validation des emails existants
- La validation des mots de passe
- La création d'auteurs
- La création de livres avec authentification

## 🛠️ Technologies utilisées

- **Express.js** : Framework web pour Node.js
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM pour MongoDB
- **JWT** : Authentification par tokens
- **bcryptjs** : Hachage des mots de passe
- **Joi** : Validation des données
- **Jest** : Framework de tests
- **Supertest** : Tests HTTP

## 📝 Scripts disponibles

- `npm run dev` : Démarre le serveur en mode développement avec nodemon
- `npm test` : Lance les tests avec Jest

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt (10 rounds de salt)
- Les tokens JWT sont signés avec un secret
- Validation des données d'entrée avec Joi
- Protection des routes sensibles avec middleware d'authentification

## 📄 Licence

ISC

## 👤 Auteur

Projet développé dans le cadre de Node Paris - Day 4

