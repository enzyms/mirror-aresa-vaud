# Module: Pannes & Équipement

> Spec basée sur l'analyse de DisQnet et les insights terrain

---

## Vue d'ensemble

Déclaration et suivi des pannes de véhicules, d'infrastructure et d'équipement. Notification automatique à la logistique pour intervention.

**4 types de pannes identifiés** dans le système actuel.

---

## Rôles et permissions

| Rôle | Déclarer | Voir | Traiter | Clôturer |
|------|----------|------|---------|----------|
| Ambulancier | ✅ | Siennes | ❌ | ❌ |
| Responsable logistique | ✅ | Toutes | ✅ | ✅ |
| Admin | ✅ | Toutes | ✅ | ✅ |

---

## Types de pannes

```typescript
enum TypePanne {
  VEHICULE = 'vehicule',           // Pannes sur véhicule/ambulance
  INFRASTRUCTURE = 'infrastructure', // Bâtiment, locaux
  EQUIPEMENT = 'equipement',       // Matériel médical
  SI = 'si'                        // Système d'information
}
```

---

## Vues

### 1. Liste des pannes

**URL:** `/pannes`

**Filtres:**
- Par type (véhicule, infrastructure, équipement, SI)
- Par statut (déclaré, en cours, résolu)
- Par base
- Par période

**Colonnes:**
| Champ | Description |
|-------|-------------|
| Date | Date de déclaration |
| Type | Icône + type |
| Objet | Véhicule ou équipement concerné |
| Genre | Catégorie spécifique |
| Description | Extrait |
| Statut | Badge coloré |
| Priorité | Urgent / Normal |

---

### 2. Déclaration - Panne véhicule

**URL:** `/pannes/vehicule/new`

#### Champs

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| vehicule | Select | ✅ | Liste des véhicules (ASCO 070, etc.) |
| kilometrage | Number | ❌ | Kilométrage actuel |
| type_panne | Select | ✅ | Voir enum ci-dessous |
| genre | Select | ✅ | Catégorie spécifique |
| description | Textarea | ✅ | Description du problème |
| urgent | Checkbox | ❌ | Empêche l'utilisation du véhicule |
| photos | FileUpload | ❌ | Photos du problème |

#### Genre de panne véhicule

```typescript
enum GenrePanneVehicule {
  MOTEUR = 'moteur',
  PHARES_FEUX = 'phares_feux',
  CELLULE_ARRIERE = 'cellule_arriere',
  CARROSSERIE = 'carrosserie',
  PNEUS = 'pneus',
  FREINS = 'freins',
  CLIMATISATION = 'climatisation',
  ELECTRONIQUE = 'electronique',
  AUTRES = 'autres'
}
```

#### Type spécifique (sous-genre)

```typescript
enum TypePanneVehicule {
  PANNE = 'panne',              // Dysfonctionnement
  ACCIDENT = 'accident',        // Collision
  TOUCHETTE = 'touchette',      // Accrochage mineur
  USURE = 'usure'               // Usure normale à signaler
}
```

---

### 3. Déclaration - Panne infrastructure

**URL:** `/pannes/infrastructure/new`

#### Champs

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| base | Select | ✅ | Base concernée |
| genre | Select | ✅ | Voir enum ci-dessous |
| localisation | Text | ✅ | Où dans le bâtiment |
| description | Textarea | ✅ | Description du problème |
| urgent | Checkbox | ❌ | Sécurité compromise |
| photos | FileUpload | ❌ | Photos du problème |

#### Genre de panne infrastructure

```typescript
enum GenrePanneInfrastructure {
  EAU = 'eau',                 // Plomberie, fuite
  ELECTRICITE = 'electricite', // Électricité, éclairage
  CHAUFFAGE = 'chauffage',     // Chauffage, ventilation
  ACCES = 'acces',             // Portes, serrures, digicodes
  SECURITE = 'securite',       // Alarmes, détecteurs
  AUTRES = 'autres'
}
```

---

### 4. Déclaration - Panne équipement

**URL:** `/pannes/equipement/new`

#### Champs

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| equipement | Autocomplete | ✅ | Recherche ou sélection |
| numero_serie | Text | ❌ | Si connu |
| emplacement | Select | ✅ | Où est l'équipement (ambulance, base) |
| description | Textarea | ✅ | Description du problème |
| urgent | Checkbox | ❌ | Équipement critique indisponible |
| photos | FileUpload | ❌ | Photos du problème |

#### Types d'équipement courants

```typescript
const equipementsCourants = [
  'Défibrillateur',
  'Moniteur ECG',
  'Aspirateur de mucosités',
  'Pousse-seringue',
  'Tensiomètre',
  'Oxymètre',
  'Brancard',
  'Chaise portoir',
  'Tablette',
  'Radio',
  'Autre'
];
```

---

### 5. Déclaration - Panne SI

**URL:** `/pannes/si/new`

#### Champs

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| systeme | Select | ✅ | Système concerné |
| description | Textarea | ✅ | Description du problème |
| impact | Select | ✅ | Niveau d'impact |
| urgent | Checkbox | ❌ | Bloque le travail |
| screenshot | FileUpload | ❌ | Capture d'écran |

---

### 6. Traitement d'une panne (Logistique)

**URL:** `/pannes/:id`

#### Informations affichées

- Toutes les données de la déclaration
- Photos jointes
- Historique des actions

#### Actions de traitement

| Champ | Type | Notes |
|-------|------|-------|
| statut | Select | DECLARE / EN_COURS / RESOLU |
| assignee | Select | Technicien responsable |
| diagnostic | Textarea | Diagnostic technique |
| actions | Textarea | Actions réalisées |
| pieces_commandees | Text | Si pièces nécessaires |
| date_resolution | Date | Date de résolution |
| cout | Number | Coût de la réparation |

---

## Modèle de données

```typescript
interface Panne {
  id: string;
  type: TypePanne;

  // Commun
  description: string;
  urgent: boolean;
  photos: string[];  // URLs

  // Selon le type
  vehicule_id?: string;
  kilometrage?: number;
  genre_vehicule?: GenrePanneVehicule;
  type_panne_vehicule?: TypePanneVehicule;

  base_id?: string;
  localisation?: string;
  genre_infrastructure?: GenrePanneInfrastructure;

  equipement_nom?: string;
  numero_serie?: string;
  emplacement_id?: string;

  systeme_si?: string;
  impact_si?: string;

  // Métadonnées
  created_at: DateTime;
  created_by: string;
  service_id: string;

  // Traitement
  statut: PanneStatut;
  assignee_id?: string;
  diagnostic?: string;
  actions_realisees?: string;
  pieces_commandees?: string;
  date_resolution?: DateTime;
  cout?: number;

  // Historique
  historique: PanneHistorique[];
}

enum PanneStatut {
  DECLARE = 'declare',
  EN_COURS = 'en_cours',
  EN_ATTENTE = 'en_attente',  // Attente pièces
  RESOLU = 'resolu'
}

interface PanneHistorique {
  id: string;
  panne_id: string;
  action: string;
  commentaire?: string;
  created_at: DateTime;
  created_by: string;
}
```

---

## API Endpoints

```
# Déclaration
GET    /api/pannes                  # Liste avec filtres
POST   /api/pannes                  # Nouvelle déclaration
GET    /api/pannes/:id              # Détail

# Traitement (logistique)
PUT    /api/pannes/:id              # Mettre à jour
POST   /api/pannes/:id/historique   # Ajouter une action

# Référentiels
GET    /api/vehicules               # Liste des véhicules
GET    /api/equipements             # Liste des équipements
```

---

## Notifications

| Événement | Destinataire | Canal |
|-----------|--------------|-------|
| Nouvelle panne | Responsable logistique | Email |
| Panne urgente | Responsable logistique | Email + SMS |
| Panne résolue | Déclarant | In-app |
| Panne en attente > 7j | Responsable logistique | Email rappel |

---

## Wireframe - Déclaration véhicule

```
┌─────────────────────────────────────────────────────┐
│  ← Déclarer une panne véhicule                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Véhicule *                                         │
│  [ASCO 070                            ▼]           │
│                                                     │
│  Kilométrage                                        │
│  [305198        ]                                   │
│                                                     │
│  Type *                      Genre *                │
│  [Panne             ▼]      [Moteur          ▼]    │
│                                                     │
│  Description *                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Décrivez le problème en détail...           │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Photos (optionnel)                                 │
│  [+ Ajouter des photos]                            │
│                                                     │
│  ☐ Urgent - Le véhicule ne peut plus rouler        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              Envoyer                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Questions ouvertes

- [ ] Intégration avec système de maintenance préventive?
- [ ] Historique des pannes par véhicule/équipement?
- [ ] Coûts consolidés par période?
- [ ] Notification au fournisseur/garage directement?

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-01-19 | Création initiale basée sur recherche terrain |
