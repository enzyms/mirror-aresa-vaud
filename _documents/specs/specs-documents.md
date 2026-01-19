# Module: Documents & Procédures

> Spec basée sur l'analyse de DisQnet et les insights terrain

---

## Vue d'ensemble

Gestion documentaire avec arborescence, tags et traçabilité de lecture. Permet de publier des procédures, cahiers des charges, et de les lier aux annonces.

**Pain point:** Beaucoup de documents, difficile à naviguer. Pas de traçabilité de qui a lu quoi.

---

## Rôles et permissions

| Rôle | Consulter | Publier | Modifier | Supprimer | Voir stats |
|------|-----------|---------|----------|-----------|------------|
| Collaborateur | ✅ | ❌ | ❌ | ❌ | ❌ |
| Responsable | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Concepts clés

### Catégorie (arborescence)

Structure hiérarchique pour organiser les documents:
- Gouvernance
  - RH
  - Organisation
  - Organigramme
- Procédures
  - Médicales
  - Logistiques
- Formation
- etc.

### Traçabilité

Suivi de qui a lu/téléchargé chaque document.

### Lien avec annonces

Possibilité de créer une annonce liée lors de la publication d'un nouveau document.

---

## Vues

### 1. Liste des documents

**URL:** `/documents`

**Navigation:**
- Arborescence de catégories à gauche
- Liste des documents à droite
- Recherche globale
- Filtres par tags

**Wireframe:**
```
┌─────────────────────────────────────────────────────┐
│  Documents                          🔍 Rechercher   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐ ┌─────────────────────────────┐  │
│  │ Catégories   │ │ Gouvernance > RH            │  │
│  │              │ │                             │  │
│  │ ▼ Gouvernance│ │ Accueil et intégration...   │  │
│  │   ▸ RH      │ │ PDF · 273 Ko · 12.01.2026   │  │
│  │   ▸ Orga    │ │ #onboarding                 │  │
│  │   ▸ Organi..│ │                             │  │
│  │ ▸ Procédures │ │ Cahier des charges AD       │  │
│  │ ▸ Formation  │ │ PDF · 169 Ko · 08.01.2026   │  │
│  │ ▸ Qualité    │ │ #cahier-charges #AD         │  │
│  │              │ │                             │  │
│  │              │ │ Procédure RCP CSUMA         │  │
│  │              │ │ PDF · 142 Ko · 05.01.2026   │  │
│  │              │ │ #procedure #RCP ⭐ Favori   │  │
│  │              │ │                             │  │
│  │              │ │ [Charger plus...]           │  │
│  └──────────────┘ └─────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2. Détail d'un document

**URL:** `/documents/:id`

**Informations:**
- Titre et description
- Fichier (prévisualisation PDF ou téléchargement)
- Métadonnées (date, auteur, version)
- Tags
- Statistiques de lecture (pour responsables)
- Documents liés

**Actions:**
- Télécharger
- Ajouter aux favoris
- Partager le lien
- Voir l'historique des versions

---

### 3. Publication d'un document (Responsable)

**URL:** `/documents/new`

#### Champs

| Champ | Type | Requis | Validation | Notes |
|-------|------|--------|------------|-------|
| titre | Text | ✅ | 5-200 chars | Titre du document |
| description | Textarea | ❌ | Max 1000 chars | Description/résumé |
| categorie | TreeSelect | ✅ | - | Catégorie dans l'arborescence |
| fichier | FileUpload | ✅ | PDF, DOCX, etc. | Le document à publier |
| tags | MultiSelect | ❌ | Max 10 | Tags pour faciliter la recherche |
| version | Text | ❌ | - | Numéro de version (ex: v2.1) |
| remplace_document_id | Select | ❌ | - | Si c'est une mise à jour |
| date_validite | Date | ❌ | Future | Date d'expiration optionnelle |
| creer_annonce | Checkbox | ❌ | Boolean | Créer une annonce liée |
| annonce_texte | Textarea | Si annonce | - | Texte de l'annonce |

---

### 4. Gestion des catégories (Admin)

**URL:** `/admin/documents/categories`

#### Structure d'une catégorie

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| nom | Text | ✅ | Nom de la catégorie |
| parent_id | Select | ❌ | Catégorie parente |
| description | Text | ❌ | Description |
| icone | Select | ❌ | Icône optionnelle |
| ordre | Number | ❌ | Ordre d'affichage |

---

### 5. Statistiques de lecture (Responsable)

**URL:** `/documents/:id/stats`

**Informations:**
- Nombre de vues / téléchargements
- Liste des personnes ayant lu
- Date de dernière consultation
- Personnes n'ayant pas encore lu (si document obligatoire)

---

## Modèle de données

```typescript
interface Categorie {
  id: string;
  nom: string;
  description?: string;
  parent_id?: string;  // Pour l'arborescence
  icone?: string;
  ordre: number;

  // Relations
  children?: Categorie[];  // Sous-catégories
}

interface Document {
  id: string;
  titre: string;
  description?: string;

  // Fichier
  fichier_url: string;
  fichier_nom: string;
  fichier_taille: number;  // en bytes
  fichier_type: string;    // mime type

  // Organisation
  categorie_id: string;
  tags: string[];
  version?: string;

  // Versioning
  remplace_document_id?: string;
  remplace_par_document_id?: string;

  // Validité
  date_validite?: Date;
  archive: boolean;

  // Métadonnées
  created_at: DateTime;
  created_by: string;
  updated_at: DateTime;

  // Relations
  service_id: string;
  annonce_id?: string;  // Annonce liée
}

interface DocumentLecture {
  id: string;
  document_id: string;
  user_id: string;
  action: 'vue' | 'telechargement';
  timestamp: DateTime;
}

interface DocumentFavori {
  document_id: string;
  user_id: string;
  created_at: DateTime;
}
```

---

## API Endpoints

```
# Documents
GET    /api/documents                 # Liste avec filtres
GET    /api/documents/:id             # Détail
POST   /api/documents                 # Créer (responsable)
PUT    /api/documents/:id             # Modifier
DELETE /api/documents/:id             # Supprimer (archive)

# Actions utilisateur
POST   /api/documents/:id/lecture     # Enregistrer une lecture
POST   /api/documents/:id/favori      # Ajouter aux favoris
DELETE /api/documents/:id/favori      # Retirer des favoris
GET    /api/documents/favoris         # Mes favoris

# Catégories
GET    /api/documents/categories      # Arborescence complète
POST   /api/documents/categories      # Créer (admin)
PUT    /api/documents/categories/:id  # Modifier
DELETE /api/documents/categories/:id  # Supprimer

# Stats (responsable)
GET    /api/documents/:id/stats       # Statistiques de lecture
GET    /api/documents/:id/lecteurs    # Liste des lecteurs

# Recherche
GET    /api/documents/search?q=...    # Recherche full-text
```

---

## Tags prédéfinis (configurable)

```typescript
const defaultDocumentTags = [
  'procedure',
  'cahier-charges',
  'formulaire',
  'protocole',
  'formation',
  'RH',
  'logistique',
  'qualite',
  'urgence',
  'obligatoire'
];
```

---

## Fonctionnalités avancées

### Recherche full-text

- Recherche dans le titre, description et tags
- Optionnel: recherche dans le contenu du PDF (OCR)

### Favoris

- Accès rapide aux documents fréquemment consultés
- Section "Mes favoris" dans la navigation

### Versioning

- Historique des versions d'un document
- Lien entre versions successives
- Notification lors de mise à jour

### Lien avec annonces

- Option "Créer une annonce" à la publication
- L'annonce contient un lien direct vers le document
- Facilite la diffusion des nouvelles procédures

---

## Notifications

| Événement | Destinataire | Canal |
|-----------|--------------|-------|
| Nouveau document obligatoire | Tous les collaborateurs | Email |
| Document mis à jour | Ceux qui ont lu l'ancienne version | In-app |
| Document expiré | Responsable | In-app |

---

## Wireframe - Publication

```
┌─────────────────────────────────────────────────────┐
│  ← Publier un document                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Titre *                                            │
│  [Procédure de réanimation cardio-pulmonaire     ] │
│                                                     │
│  Description                                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ Mise à jour du protocole RCP selon les      │   │
│  │ recommandations 2026...                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Catégorie *                                        │
│  [Procédures > Médicales                     ▼]    │
│                                                     │
│  Fichier *                                          │
│  [📄 procedure_rcp_v3.pdf          ] [Parcourir]   │
│                                                     │
│  Tags                                               │
│  [procedure] [RCP] [urgence] [+ Ajouter]           │
│                                                     │
│  Version                                            │
│  [v3.0      ]                                       │
│                                                     │
│  ☐ Ce document remplace une version précédente     │
│    [Sélectionner le document remplacé       ▼]     │
│                                                     │
│  ── Diffusion ──────────────────────────────────── │
│                                                     │
│  ☑ Créer une annonce pour informer les équipes     │
│                                                     │
│  Texte de l'annonce                                │
│  ┌─────────────────────────────────────────────┐   │
│  │ Nouvelle version du protocole RCP disponible │   │
│  │ dans la section Documents > Procédures.      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [        Publier le document        ]             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Questions ouvertes

- [ ] Recherche dans le contenu des PDF (OCR)?
- [ ] Documents avec lecture obligatoire et deadline?
- [ ] Export de la liste des non-lecteurs?
- [ ] Intégration avec SharePoint ou autre GED existante?

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-01-19 | Création initiale basée sur recherche terrain |
