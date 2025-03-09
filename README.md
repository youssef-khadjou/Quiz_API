# Projet de Gestion de Questionnaires avec Flask et JavaScript

## Auteurs
- **Youssef Khadjou 23A**

---

## Sommaire
- [Description du Projet](#description-du-projet)
- [Installation et Configuration](#installation-et-configuration)
- [Commandes Utiles](#commandes-utiles)
- [Fonctionnalités](#fonctionnalités)
- [API Endpoints](#api-endpoints)

---

## Description du Projet
Cette application web permet de gérer des questionnaires (quizz) via une interface simple et intuitive. L'application utilise Flask pour le backend API RESTful et JavaScript vanilla pour le frontend.


---

## Installation et Configuration
1. **Créer un environnement virtuel :**
```bash
python3 -m venv venv
```

2. **Activer l'environnement :**
- Sur Linux :
```bash
source venv/bin/activate
```

3. **Installer les dépendances :**
```bash
pip install -r requirements.txt
```

---

## Commandes Utiles
1. **Initialiser la base de données :**
```bash
flask --app todo/app.py loaddb
```

2. **Synchroniser la base de données :**
```bash
flask --app todo/app.py syncdb
```

3. **Lancer le serveur :**
```bash
flask --app todo/app.py run
```

---

## Fonctionnalités

### Gestion des Questionnaires
- **Afficher** tous les questionnaires disponibles
- **Créer** un nouveau questionnaire avec nom et URL
- **Modifier** le nom et l'URL d'un questionnaire existant
- **Supprimer** un questionnaire spécifique
- **Supprimer** tous les questionnaires en une seule opération

### Gestion des Questions
- **Afficher** toutes les questions d'un questionnaire
- **Ajouter** de nouvelles questions à un questionnaire existant
- **Modifier** le contenu d'une question
- **Supprimer** une question spécifique

---

## API Endpoints

### Questionnaires
- `GET /questionnaires` - Récupérer tous les questionnaires
- `GET /questionnaires/{id}` - Récupérer un questionnaire par ID
- `POST /questionnaires` - Créer un nouveau questionnaire
- `PUT /questionnaires/{id}` - Mettre à jour un questionnaire
- `DELETE /questionnaires` - Supprimer tous les questionnaires
- `DELETE /questionnaires/{id}` - Supprimer un questionnaire spécifique

### Questions
- `GET /questionnaires/{id}/questions` - Récupérer toutes les questions d'un questionnaire
- `GET /questionnaires/{id}/questions/{q_id}` - Récupérer une question spécifique
- `POST /questionnaires/{id}/questions` - Ajouter une nouvelle question
- `PUT /questionnaires/{id}/questions/{q_id}` - Mettre à jour une question
- `DELETE /questionnaires/{id}/questions` - Supprimer toutes les questions d'un questionnaire
- `DELETE /questionnaires/{id}/questions/{q_id}` - Supprimer une question spécifique

### Contrôles Principaux
- ![New](todo_client/img/new.png) Bouton "Nouvelle quizz" - Crée un nouveau questionnaire
- ![Delete](todo_client/img/delete.png) Bouton "Supprimer" - Supprime tous les questionnaires

---
