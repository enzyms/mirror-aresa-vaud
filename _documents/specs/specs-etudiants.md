# Module: Formation & Étudiants

> Spec basée sur l'analyse de DisQnet et les insights terrain

---

## Vue d'ensemble

Suivi des étudiants en stage (2 mois) ou en formation longue (3 ans). L'étudiant saisit ses propres objectifs, le mentor donne du feedback.

---

## Rôles et permissions

| Rôle | Voir étudiants | Gérer objectifs | Donner feedback | Admin |
|------|----------------|-----------------|-----------------|-------|
| Étudiant | Soi-même | ✅ (les siens) | ❌ | ❌ |
| Mentor/AD | Ses étudiants | ❌ | ✅ | ❌ |
| Responsable formation | Tous | ✅ | ✅ | ✅ |

---

## Concepts clés

### Types de formation

```typescript
enum TypeFormation {
  STAGE_COURT = 'stage_court',     // 2 mois
  STAGE_LONG = 'stage_long',       // 6 mois
  FORMATION_ES = 'formation_es'    // 3 ans (École Supérieure)
}
```

### Objectif

Un objectif d'apprentissage défini par l'étudiant, validé progressivement par le mentor.

### Évaluation

Feedback du mentor sur une journée ou une intervention spécifique.

---

## Vues

### 1. Liste des étudiants (Responsable)

**URL:** `/etudiants`

**Colonnes:**
| Champ | Description |
|-------|-------------|
| Nom | Nom complet |
| Type | Stage court / long / Formation ES |
| Période | Dates de début et fin |
| Mentor | Mentor assigné |
| Progression | Barre de progression objectifs |
| Statut | Actif / Terminé |

**Actions:**
- Ajouter un étudiant
- Exporter la liste
- Voir les statistiques

---

### 2. Profil étudiant

**URL:** `/etudiants/:id`

**Sections:**
1. Informations personnelles
2. Objectifs de stage
3. Évaluations reçues
4. Historique des interventions (lien Attrib)

---

### 3. Gestion des objectifs (Étudiant)

**URL:** `/etudiants/:id/objectifs`

**Fonctionnalité:** L'étudiant définit et suit ses propres objectifs.

#### Créer un objectif

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| titre | Text | ✅ | Titre court |
| description | Textarea | ✅ | Description détaillée |
| categorie | Select | ❌ | Compétence technique, communication, etc. |
| date_cible | Date | ❌ | Objectif à atteindre avant... |
| priorite | Select | ❌ | Haute, moyenne, basse |

#### Statuts d'objectif

```typescript
enum StatutObjectif {
  A_TRAVAILLER = 'a_travailler',  // Pas encore commencé
  EN_COURS = 'en_cours',          // En progression
  ACQUIS = 'acquis',              // Validé par le mentor
  REPORTE = 'reporte'             // Reporté à plus tard
}
```

**Wireframe:**
```
┌─────────────────────────────────────────────────────┐
│  Mes objectifs de stage                [+ Ajouter] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Progression: ████████░░░░░░░░ 53% (8/15)          │
│                                                     │
│  ── À travailler (4) ───────────────────────────── │
│  ○ Réaliser une évaluation secondaire complète     │
│  ○ Poser un cathéter intraveineux                  │
│  ○ Effectuer une transmission SBAR                 │
│  ○ Gérer une situation de stress                   │
│                                                     │
│  ── En cours (3) ───────────────────────────────── │
│  ◐ Maîtriser le protocole RCP                      │
│    → Feedback mentor: "Bon progrès, continuer"     │
│  ◐ Communication avec le patient                   │
│  ◐ Utilisation du moniteur ECG                     │
│                                                     │
│  ── Acquis (8) ─────────────────────────────────── │
│  ● Prise des constantes vitales                    │
│  ● Installation du patient sur brancard            │
│  ● Utilisation du DEA                              │
│  ...                                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 4. Donner une évaluation (Mentor)

**URL:** `/etudiants/:id/evaluations/new`

#### Types d'évaluation

```typescript
enum TypeEvaluation {
  JOURNALIER = 'journalier',       // Fin de service
  INTERVENTION = 'intervention',   // Sur une intervention spécifique
  OBJECTIF = 'objectif'            // Validation d'un objectif
}
```

#### Champs - Évaluation journalière

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| date | Date | ✅ | Date du service |
| type_service | Text | ❌ | Jour, nuit, week-end |
| nombre_interventions | Number | ❌ | Nombre d'interventions |
| role_etudiant | Select | ✅ | Observateur / Assistant / Leader |
| points_positifs | Textarea | ❌ | Ce qui a bien fonctionné |
| axes_amelioration | Textarea | ❌ | Ce qu'il faut travailler |
| remarques | Textarea | ❌ | Commentaires généraux |
| objectifs_travailles | MultiSelect | ❌ | Objectifs abordés ce jour |

#### Champs - Évaluation intervention

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| numero_fip | Text | ❌ | Lien vers Attrib |
| type_intervention | Select | ✅ | P1, P2, P3, etc. |
| naca | Select | ❌ | Score NACA |
| trauma | Boolean | ❌ | Intervention trauma |
| role_etudiant | Select | ✅ | Observateur / Assistant / Leader |
| evaluation_technique | Textarea | ✅ | Évaluation des gestes |
| evaluation_communication | Textarea | ❌ | Communication patient/équipe |
| points_forts | Textarea | ❌ | Points forts observés |
| points_amelioration | Textarea | ❌ | Axes d'amélioration |

#### Champs - Validation d'objectif

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| objectif_id | Select | ✅ | Objectif à évaluer |
| statut | Select | ✅ | Acquis / En cours / À retravailler |
| commentaire | Textarea | ✅ | Feedback détaillé |
| date_prochaine_evaluation | Date | Si en cours | Quand réévaluer |

---

### 5. Historique des évaluations

**URL:** `/etudiants/:id/evaluations`

**Affichage chronologique** de toutes les évaluations avec filtres par type.

---

## Modèle de données

```typescript
interface Etudiant {
  id: string;
  user_id: string;  // Lien avec compte utilisateur

  // Infos personnelles
  nom: string;
  prenom: string;
  email: string;
  date_naissance: Date;

  // Formation
  type_formation: TypeFormation;
  date_debut: Date;
  date_fin: Date;
  ecole?: string;  // École d'origine

  // Relations
  mentor_id?: string;
  service_id: string;
  base_id: string;

  // Statut
  actif: boolean;

  created_at: DateTime;
  updated_at: DateTime;
}

interface Objectif {
  id: string;
  etudiant_id: string;

  titre: string;
  description: string;
  categorie?: string;
  date_cible?: Date;
  priorite?: 'haute' | 'moyenne' | 'basse';

  statut: StatutObjectif;
  notes_etudiant?: string;

  // Validation
  valide_par?: string;
  valide_at?: DateTime;
  commentaire_validation?: string;

  created_at: DateTime;
  updated_at: DateTime;
}

interface Evaluation {
  id: string;
  etudiant_id: string;
  mentor_id: string;
  type: TypeEvaluation;
  date: Date;

  // Commun
  role_etudiant: 'observateur' | 'assistant' | 'leader';
  remarques?: string;

  // Journalier
  type_service?: string;
  nombre_interventions?: number;
  points_positifs?: string;
  axes_amelioration?: string;
  objectifs_travailles?: string[];

  // Intervention
  numero_fip?: string;
  type_intervention?: string;
  naca?: number;
  trauma?: boolean;
  evaluation_technique?: string;
  evaluation_communication?: string;

  // Validation objectif
  objectif_id?: string;
  statut_objectif?: StatutObjectif;
  commentaire_objectif?: string;

  created_at: DateTime;
}
```

---

## API Endpoints

```
# Étudiants
GET    /api/etudiants                    # Liste (filtrée par rôle)
GET    /api/etudiants/:id                # Profil
POST   /api/etudiants                    # Créer (admin)
PUT    /api/etudiants/:id                # Modifier

# Objectifs
GET    /api/etudiants/:id/objectifs      # Liste objectifs
POST   /api/etudiants/:id/objectifs      # Créer (étudiant)
PUT    /api/objectifs/:id                # Modifier
DELETE /api/objectifs/:id                # Supprimer

# Évaluations
GET    /api/etudiants/:id/evaluations    # Liste évaluations
POST   /api/etudiants/:id/evaluations    # Créer (mentor)
GET    /api/evaluations/:id              # Détail
```

---

## Statistiques

**Pour le responsable formation:**
- Nombre d'étudiants actifs
- Progression moyenne des objectifs
- Nombre d'évaluations par mentor
- Répartition des types d'interventions vécues

---

## Questions ouvertes

- [ ] Export du carnet de stage au format PDF?
- [ ] Intégration avec le système de l'école (ES)?
- [ ] Signature électronique des évaluations?
- [ ] Planification automatique mentor/étudiant?

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-01-19 | Création initiale basée sur recherche terrain |
