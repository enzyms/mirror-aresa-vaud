# Module: Annonces & Livre de bord

> Spec basée sur l'analyse de DisQnet et les insights terrain

---

## Vue d'ensemble

Le module Annonces centralise la communication entre équipes : relève, alertes, informations générales. Il remplace le livre de bord papier et les annonces dispersées.

---

## Rôles et permissions

| Rôle | Créer | Lire | Modifier | Supprimer | Valider lu |
|------|-------|------|----------|-----------|------------|
| Ambulancier (AD/TA) | ✅ | ✅ | Ses propres | ❌ | ✅ |
| Responsable de base | ✅ | ✅ | Base | ✅ | ✅ |
| Admin service | ✅ | ✅ | Service | ✅ | ✅ |

---

## Vues

### 1. Liste des annonces

**URL:** `/annonces`

**Fonctionnalités:**
- Affichage des annonces triées par date (récentes en premier)
- Badge "non lu" sur les annonces non consultées
- Filtre par statut (non lues / toutes)
- Filtre par type
- Filtre par tags
- Recherche texte
- Pagination ou scroll infini

**Colonnes / Informations affichées:**
| Champ | Type | Description |
|-------|------|-------------|
| Statut lu | Badge | ● non lu / ○ lu |
| Icône type | Icon | Selon le type d'annonce |
| Titre | Text | Titre de l'annonce |
| Extrait | Text | Premiers 100 caractères |
| Date | DateTime | Date de création |
| Auteur | Text | Nom du créateur |
| Tags | Chips | Liste des tags |
| Important | Badge | ⚠️ si marqué important |

---

### 2. Détail d'une annonce

**URL:** `/annonces/:id`

**Comportement:**
- Marque automatiquement comme "lu" à l'ouverture
- Affiche le contenu complet
- Liste des personnes ayant lu (pour responsables)

**Actions disponibles:**
- Modifier (si auteur ou responsable)
- Supprimer (si responsable)
- Partager / Copier lien

---

### 3. Création / Édition d'annonce

**URL:** `/annonces/new` ou `/annonces/:id/edit`

#### Champs du formulaire

| Champ | Type | Requis | Validation | Notes |
|-------|------|--------|------------|-------|
| type | Select | ✅ | Enum | Voir types ci-dessous |
| titre | Text | ✅ | 3-100 chars | Titre court et descriptif |
| contenu | Textarea | ✅ | 10-5000 chars | Contenu principal, markdown supporté |
| tags | MultiSelect | ❌ | Max 5 | Tags prédéfinis + custom |
| visibilite | Radio | ✅ | Enum | base / service / tous |
| important | Checkbox | ❌ | Boolean | Met en avant l'annonce |
| date_expiration | Date | ❌ | Future date | Optionnel, archive auto après |
| destinataire_externe | Select | ❌ | Si cross-service | Pompiers, Hôpital, autre service |
| pieces_jointes | FileUpload | ❌ | PDF, images | Max 5 fichiers, 10MB chacun |

#### Types d'annonces (enum)

```typescript
enum AnnonceType {
  BRIEFING = 'briefing',       // Information pour l'équipe entrante
  DEBRIEFING = 'debriefing',   // Transmission de l'équipe sortante
  INFO = 'info',               // Information générale
  ALERTE = 'alerte',           // Alerte importante
  MAINTENANCE = 'maintenance', // Travaux, indisponibilités
  FORMATION = 'formation',     // Annonces formation
  PROCEDURE = 'procedure',     // Nouvelle procédure
  AUTRE = 'autre'
}
```

#### Visibilité (enum)

```typescript
enum Visibilite {
  BASE = 'base',       // Visible uniquement sur ma base
  SERVICE = 'service', // Visible pour tout le service
  TOUS = 'tous'        // Visible pour tous (cross-services)
}
```

#### Tags prédéfinis (configurable par service)

```typescript
const defaultTags = [
  'O2', 'RCP', 'Véhicule', 'Stock', 'CHUV', 'EHC',
  'Matériel', 'Urgent', 'Relève', 'Formation'
];
```

---

## Modèle de données

```typescript
interface Annonce {
  id: string;
  type: AnnonceType;
  titre: string;
  contenu: string;
  tags: string[];
  visibilite: Visibilite;
  important: boolean;

  // Métadonnées
  created_at: DateTime;
  updated_at: DateTime;
  created_by: string; // user_id

  // Relations
  service_id: string;
  base_id: string;

  // Optionnel
  date_expiration?: DateTime;
  destinataire_externe_id?: string;
  pieces_jointes?: Attachment[];

  // Tracking lecture
  lectures: AnnonceLecture[];
}

interface AnnonceLecture {
  annonce_id: string;
  user_id: string;
  read_at: DateTime;
}

interface Attachment {
  id: string;
  filename: string;
  url: string;
  mime_type: string;
  size: number;
}
```

---

## API Endpoints

```
GET    /api/annonces              # Liste avec filtres
GET    /api/annonces/:id          # Détail
POST   /api/annonces              # Créer
PUT    /api/annonces/:id          # Modifier
DELETE /api/annonces/:id          # Supprimer
POST   /api/annonces/:id/read     # Marquer comme lu
GET    /api/annonces/:id/readers  # Liste des lecteurs
```

---

## Fonctionnalités avancées

### Validation lu/non-lu

**Comportement:**
- Badge visible sur chaque annonce non lue
- Compteur dans la navigation "Annonces (3)"
- Auto-marquage à l'ouverture (après 3 secondes)
- Option "Marquer tout comme lu"

### Notifications

- Email optionnel pour annonces "importantes"
- Push notification (si PWA)
- Notification in-app (badge dans nav)

### Annonces cross-services (futur)

- Sélection du service destinataire
- Workflow de validation si nécessaire
- Historique des échanges

### IA - Résumé automatique (futur)

- Résumé des annonces de la journée
- Extraction des points clés pour le briefing

---

## Wireframe

```
┌─────────────────────────────────────────────────────┐
│  Annonces                    [+ Nouvelle] [Filtres] │
├─────────────────────────────────────────────────────┤
│  ○ Non lues (3)  ○ Toutes  ○ Importantes           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ● ⚠️ Procédure RCP mise à jour                    │
│     Nouvelle version du protocole disponible...     │
│     il y a 2h · Lucas P. · #procédure #RCP         │
│  ─────────────────────────────────────────────────  │
│  ● 📢 Briefing: congestion CHUV                    │
│     Temps d'attente estimé 45min aux urgences...   │
│     il y a 4h · Marie D. · #CHUV                   │
│  ─────────────────────────────────────────────────  │
│  ● 🔄 Relève: vérifier O2 ambulance 3              │
│     Niveau bas constaté en fin de service...       │
│     il y a 6h · Jean M. · #relève #O2              │
│  ─────────────────────────────────────────────────  │
│  ○ Formation défib. mercredi 14h                   │
│     Rappel: formation obligatoire pour tous...     │
│     hier · Admin · #formation                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Questions ouvertes

- [ ] Durée de rétention des annonces? (archivage auto après X jours?)
- [ ] Qui peut créer des annonces "importantes"? (tous ou responsables?)
- [ ] Format des annonces cross-services? (email, API, in-app?)
- [ ] Faut-il un système de commentaires sur les annonces?

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-01-19 | Création initiale basée sur recherche terrain |
