# Module: Tâches & Checklists

> Spec basée sur l'analyse de DisQnet et les insights terrain

---

## Vue d'ensemble

Gestion des tâches quotidiennes, hebdomadaires et ponctuelles. Inclut les checklists de vérification (ambulance, équipement, inventaire).

**Insight terrain:** Les checklists sont liées à des emplacements physiques (QR code sur trousse/armoire).

---

## Rôles et permissions

| Rôle | Voir tâches | Valider | Créer tâches | Config checklists |
|------|-------------|---------|--------------|-------------------|
| Ambulancier | ✅ | ✅ | ❌ | ❌ |
| Responsable de base | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## Concepts clés

### Types de tâches

```typescript
enum TypeTache {
  JOURNALIERE = 'journaliere',   // Chaque jour
  HEBDOMADAIRE = 'hebdomadaire', // Chaque semaine (lundi par défaut)
  MENSUELLE = 'mensuelle',       // Chaque mois
  PONCTUELLE = 'ponctuelle'      // Une seule fois
}
```

### Checklist

Une liste d'items à vérifier, liée à un emplacement (ambulance, trousse, armoire).

---

## Vues

### 1. Dashboard tâches du jour

**URL:** `/taches`

**Objectif:** Vue rapide de ce qu'il y a à faire aujourd'hui

**Sections:**
1. Météo locale (widget optionnel)
2. Tâches journalières
3. Tâches hebdomadaires (si jour concerné)
4. Tâches en retard

**Wireframe:**
```
┌─────────────────────────────────────────────────────┐
│  Tâches du jour                    Lun 19.01.2026  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐  MORGES                       │
│  │    ☁️ 9°C       │  Couvert, 2°C demain          │
│  └─────────────────┘                               │
│                                                     │
│  ── Tâches journalières (8/12) ─────────────────── │
│  ☑ Contrôle des feux + AdBlue                      │
│  ☑ Nettoyage sol ambulance                         │
│  ☐ Désinfection appareils intervention             │
│  ☐ Lavage extérieur véhicule                       │
│  ☐ Contrôle sécurité équipe de jour                │
│  ☐ Contrôle des pneus                              │
│  ☑ Configuration tablettes                          │
│  ☐ Test défibrillateur                             │
│  [Voir tout...]                                    │
│                                                     │
│  ── Tâches hebdomadaires (lundi) ────────────────  │
│  ☐ Tâches centrale                                 │
│  ☐ Inventaire hebdo                                │
│                                                     │
│  ── En retard (1) ───────────────────────────────  │
│  ⚠️ Contrôle extincteurs (depuis 3 jours)          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2. Validation d'une tâche

**Comportement:**
- Clic sur checkbox → marque comme fait
- Certaines tâches ouvrent une checklist détaillée
- Timestamp + utilisateur enregistrés

#### Tâche simple

| Champ | Type | Notes |
|-------|------|-------|
| fait | Boolean | Checkbox |
| commentaire | Text | Optionnel, si problème |
| validated_by | Auto | Utilisateur connecté |
| validated_at | Auto | Timestamp |

#### Tâche avec checklist

Ouvre une vue détaillée avec tous les items à cocher.

---

### 3. Checklist détaillée

**URL:** `/taches/checklist/:id` ou via scan QR

**Contexte:** Ampoularium, trousse médicale, contrôle véhicule...

**Structure:**
- Sections (Partie gauche, Partie centrale, etc.)
- Items avec quantités attendues
- Validation item par item

**Wireframe:**
```
┌─────────────────────────────────────────────────────┐
│  ← Checklist: Ampoularium ASCO 070                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Date: 19.01.2026                                   │
│                                                     │
│  ── Partie gauche ──────────────────────────────── │
│  ☑ 2x Seringue 1ml                                 │
│  ☑ 3x Seringue 3ml                                 │
│  ☑ 3x Seringue 5ml                                 │
│  ☑ 3x Seringue 10ml                                │
│  ☑ 5x Aiguille rose                                │
│  ☐ 3x Aiguille orange IM 25G        [Manquant: 1]  │
│  ☑ 3x Aiguille verte IM 21G                        │
│  ☑ 5x Bouchon rouge                                │
│                                                     │
│  ── Partie centrale ────────────────────────────── │
│  ☑ 1x GlucaGen                                     │
│  ☑ 1x Glucose per os                               │
│  ☑ 1x Temesta expidet 1mg                          │
│  ☐ 1x Benuron 125mg                 [Manquant: 1]  │
│  ...                                               │
│                                                     │
│  ── Résumé ─────────────────────────────────────── │
│  ✅ 18 items conformes                              │
│  ⚠️ 2 items manquants                              │
│                                                     │
│  Commentaire (optionnel)                           │
│  [________________________________]                │
│                                                     │
│  [        Valider la checklist        ]            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 4. Administration des tâches

**URL:** `/admin/taches`

#### Créer une tâche récurrente

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| titre | Text | ✅ | Nom de la tâche |
| description | Textarea | ❌ | Instructions détaillées |
| type | Select | ✅ | journalière, hebdo, mensuelle |
| jour_semaine | Select | Si hebdo | Lundi, mardi... |
| jour_mois | Number | Si mensuelle | 1-31 |
| base_id | Select | ✅ | Quelle base |
| checklist_id | Select | ❌ | Lier une checklist |
| ordre | Number | ❌ | Ordre d'affichage |
| actif | Boolean | ✅ | Activer/désactiver |

#### Créer/modifier une checklist

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| nom | Text | ✅ | Ex: "Ampoularium ASCO 070" |
| emplacement_id | Select | ❌ | Lier à un emplacement |
| qr_code | Auto | - | Généré automatiquement |
| sections | Repeater | ✅ | Liste des sections |

#### Section de checklist

| Champ | Type | Requis |
|-------|------|--------|
| titre | Text | ✅ |
| items | Repeater | ✅ |

#### Item de checklist

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| nom | Text | ✅ | Ex: "Seringue 1ml" |
| quantite | Number | ✅ | Quantité attendue |
| obligatoire | Boolean | ❌ | Si manquant = bloquant |

---

## Modèle de données

```typescript
interface TacheRecurrente {
  id: string;
  titre: string;
  description?: string;
  type: TypeTache;

  // Récurrence
  jour_semaine?: number;  // 0-6 pour hebdo
  jour_mois?: number;     // 1-31 pour mensuelle

  // Relations
  base_id: string;
  checklist_id?: string;

  // Config
  ordre: number;
  actif: boolean;

  created_at: DateTime;
  updated_at: DateTime;
}

interface TacheInstance {
  id: string;
  tache_recurrente_id: string;
  date: Date;

  // Validation
  fait: boolean;
  validated_by?: string;
  validated_at?: DateTime;
  commentaire?: string;

  // Si checklist
  checklist_validation?: ChecklistValidation;
}

interface Checklist {
  id: string;
  nom: string;
  emplacement_id?: string;
  qr_code: string;
  sections: ChecklistSection[];

  created_at: DateTime;
  updated_at: DateTime;
}

interface ChecklistSection {
  id: string;
  titre: string;
  ordre: number;
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  nom: string;
  quantite: number;
  obligatoire: boolean;
  ordre: number;
}

interface ChecklistValidation {
  id: string;
  checklist_id: string;
  date: Date;
  validated_by: string;
  validated_at: DateTime;

  items: ChecklistItemValidation[];
  commentaire?: string;
  conforme: boolean;
}

interface ChecklistItemValidation {
  item_id: string;
  conforme: boolean;
  quantite_constatee?: number;
  commentaire?: string;
}
```

---

## API Endpoints

```
# Tâches du jour
GET    /api/taches/today              # Tâches du jour pour ma base
POST   /api/taches/:id/validate       # Valider une tâche

# Checklists
GET    /api/checklists/:id            # Détail checklist
POST   /api/checklists/:id/validate   # Valider une checklist
GET    /api/checklists/qr/:code       # Récupérer par QR code

# Admin
GET    /api/admin/taches              # Liste des tâches récurrentes
POST   /api/admin/taches              # Créer
PUT    /api/admin/taches/:id          # Modifier
DELETE /api/admin/taches/:id          # Supprimer

GET    /api/admin/checklists          # Liste des checklists
POST   /api/admin/checklists          # Créer
PUT    /api/admin/checklists/:id      # Modifier
```

---

## QR Code

**Usage:** Scanner le QR code sur une trousse/armoire ouvre directement la checklist correspondante.

**Format:** URL vers `/taches/checklist/:qr_code`

**Génération:** Automatique à la création de la checklist.

---

## Notifications

| Événement | Destinataire | Canal |
|-----------|--------------|-------|
| Tâche non faite à 18h | Équipe de la base | In-app |
| Tâche en retard > 24h | Responsable de base | Email |
| Item manquant sur checklist | Responsable logistique | In-app |

---

## Questions ouvertes

- [ ] Tâches reportables au lendemain automatiquement?
- [ ] Historique de validation consultable?
- [ ] Impression des checklists pour backup papier?
- [ ] Tâches assignables à une personne spécifique?

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-01-19 | Création initiale basée sur recherche terrain |
