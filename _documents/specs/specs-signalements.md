# Module: Signalements Qualité

> Spec basée sur l'analyse de DisQnet et les insights terrain
> **Module prioritaire** selon les utilisateurs

---

## Vue d'ensemble

Le module Signalements permet de déclarer des incidents, événements indésirables ou suggestions d'amélioration dans une démarche **Just Culture** (amélioration continue, non punitive).

**Volume typique:** 2-4 signalements par mois par service.

---

## Rôles et permissions

| Rôle | Créer | Voir les siens | Voir tous | Traiter | Stats |
|------|-------|----------------|-----------|---------|-------|
| Collaborateur | ✅ | ✅ | ❌ | ❌ | ❌ |
| Responsable qualité | ✅ | ✅ | ✅ | ✅ | ✅ |
| Direction | ❌ | ❌ | ✅ (anonymisé) | ❌ | ✅ |

---

## Concepts clés

### Confidentialité

- **Standard:** Visible par le déclarant + responsable qualité
- **Anonyme:** Identité du déclarant masquée (même pour le responsable qualité)
- **Confidentiel:** Visible uniquement par le responsable qualité désigné

### Just Culture

Approche non punitive favorisant la déclaration pour amélioration continue. L'objectif n'est pas de blâmer mais d'apprendre.

---

## Vues

### 1. Liste des signalements (Collaborateur)

**URL:** `/signalements`

**Affiche:** Uniquement ses propres signalements

**Colonnes:**
| Champ | Description |
|-------|-------------|
| Date | Date de création |
| Type | Catégorie du signalement |
| Titre/Extrait | Premiers mots de la description |
| Criticité | Badge coloré |
| Statut | EN COURS / TEMPORISÉ / TERMINÉ |

---

### 2. Liste des signalements (Responsable qualité)

**URL:** `/signalements/gestion`

**Affiche:** Tous les signalements du service

**Filtres:**
- Par statut
- Par type
- Par criticité
- Par période
- Par déclarant (sauf anonymes)

**Actions:**
- Exporter CSV
- Voir statistiques

---

### 3. Création d'un signalement

**URL:** `/signalements/new`

#### Champs du formulaire

| Champ | Type | Requis | Validation | Notes |
|-------|------|--------|------------|-------|
| source | Select | ✅ | Enum | D'où vient l'info |
| type | Select | ✅ | Enum | Catégorie |
| description | Textarea | ✅ | 20-5000 chars | Description détaillée |
| criticite | Select | ✅ | Enum | Niveau de gravité |
| dicastere | Select | ✅ | Liste services | Service concerné |
| lieu | Text | ❌ | - | Lieu de l'événement |
| numero_fip | Text | ❌ | Format FIP | Si lié à une intervention |
| autre_constat | Textarea | ❌ | - | Observations additionnelles |
| constat_accident | Checkbox | ❌ | Boolean | Si accident |
| fichier_pdf | FileUpload | Si accident | PDF | Constat d'accident |
| actions_immediates | Textarea | ❌ | - | Actions déjà prises |
| anonyme | Checkbox | ❌ | Boolean | Masquer mon identité |
| confidentiel | Checkbox | ❌ | Boolean | Restreindre accès |
| destinataire | Select | Si confidentiel | User | Responsable désigné |

#### Source (enum)

```typescript
enum SignalementSource {
  COLLABORATEUR = 'collaborateur',    // Information directe
  PATIENT = 'patient',                // Retour patient/famille
  PARTENAIRE = 'partenaire',          // Hôpital, pompiers, etc.
  OBSERVATION = 'observation',        // Constat terrain
  AUTRE = 'autre'
}
```

#### Type de signalement (enum)

```typescript
enum SignalementType {
  EVENEMENT_INDESIRABLE = 'evenement_indesirable',  // Incident
  PRESQU_ACCIDENT = 'presqu_accident',              // Near miss
  ERREUR_IDENTITE = 'erreur_identite',              // Erreur d'identité patient
  REFUS_ADMISSION = 'refus_admission',              // Refus psy ou autre
  MATERIEL = 'materiel',                            // Problème équipement
  AMELIORATION = 'amelioration',                    // Suggestion
  AUTRE = 'autre'
}
```

#### Criticité (enum)

```typescript
enum Criticite {
  MINEUR = 'mineur',           // Impact faible
  MODERE = 'modere',           // Impact modéré
  MAJEUR = 'majeur',           // Impact significatif
  CRITIQUE = 'critique'        // Impact grave
}
```

---

### 4. Détail / Traitement (Responsable qualité)

**URL:** `/signalements/:id`

#### Informations affichées

- Toutes les données du signalement
- Historique des actions
- Documents joints

#### Actions de traitement

| Champ | Type | Notes |
|-------|------|-------|
| statut | Select | EN COURS / TEMPORISÉ / TERMINÉ |
| analyse | Textarea | Analyse de la situation |
| actions_correctives | Textarea | Actions mises en place |
| suivi | Textarea | Notes de suivi |
| transmission | MultiSelect | Transmettre à d'autres services |
| cloture_commentaire | Textarea | Commentaire de clôture |

---

### 5. Statistiques

**URL:** `/signalements/stats`

**Indicateurs:**
- Nombre par période (mois/trimestre/année)
- Répartition par type
- Répartition par criticité
- Temps moyen de traitement
- Taux de clôture

**Graphiques:**
- Évolution dans le temps
- Comparaison avec périodes précédentes

---

## Modèle de données

```typescript
interface Signalement {
  id: string;

  // Contenu
  source: SignalementSource;
  type: SignalementType;
  description: string;
  criticite: Criticite;
  lieu?: string;
  numero_fip?: string;
  autre_constat?: string;
  actions_immediates?: string;

  // Confidentialité
  anonyme: boolean;
  confidentiel: boolean;
  destinataire_id?: string;

  // Relations
  dicastere_id: string;
  service_id: string;

  // Accident
  constat_accident: boolean;
  fichier_constat_url?: string;

  // Métadonnées
  created_at: DateTime;
  created_by: string;  // Masqué si anonyme
  updated_at: DateTime;

  // Traitement
  statut: SignalementStatut;
  traite_par?: string;
  traite_at?: DateTime;
  analyse?: string;
  actions_correctives?: string;
  cloture_commentaire?: string;

  // Historique
  historique: SignalementHistorique[];
}

enum SignalementStatut {
  EN_COURS = 'en_cours',
  TEMPORISE = 'temporise',
  TERMINE = 'termine'
}

interface SignalementHistorique {
  id: string;
  signalement_id: string;
  action: string;
  commentaire?: string;
  created_at: DateTime;
  created_by: string;
}
```

---

## API Endpoints

```
# Collaborateur
GET    /api/signalements              # Mes signalements
POST   /api/signalements              # Créer
GET    /api/signalements/:id          # Détail (si propriétaire)

# Responsable qualité
GET    /api/signalements/gestion      # Tous les signalements
PUT    /api/signalements/:id          # Mettre à jour / traiter
GET    /api/signalements/stats        # Statistiques

# Admin
GET    /api/signalements/types        # Types configurables
POST   /api/signalements/types        # Ajouter un type
```

---

## Notifications

| Événement | Destinataire | Canal |
|-----------|--------------|-------|
| Nouveau signalement | Responsable qualité | Email |
| Signalement critique | Responsable qualité + Direction | Email immédiat |
| Changement de statut | Déclarant (si non anonyme) | In-app |
| Clôture | Déclarant (si non anonyme) | Email |

---

## Wireframe - Création

```
┌─────────────────────────────────────────────────────┐
│  ← Nouveau signalement                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Source *                                           │
│  [Information d'un collaborateur          ▼]       │
│                                                     │
│  Type de signalement *                              │
│  [Événement indésirable                   ▼]       │
│                                                     │
│  Description *                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Décrivez la situation en détail...          │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Criticité *                 Service concerné *     │
│  [Modéré            ▼]      [Ambulances       ▼]   │
│                                                     │
│  Lieu                        N° FIP (si applicable) │
│  [_____________________]     [_____________________]│
│                                                     │
│  Actions immédiates prises                          │
│  ┌─────────────────────────────────────────────┐   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ── Confidentialité ────────────────────────────── │
│                                                     │
│  ☐ Anonyme                                         │
│    Mon identité ne sera pas visible                │
│                                                     │
│  ☐ Confidentiel                                    │
│    Visible uniquement par le responsable qualité   │
│                                                     │
│  ── Constat d'accident ─────────────────────────── │
│                                                     │
│  ☐ Joindre un constat d'accident                   │
│    [Choisir un fichier PDF]                        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              Envoyer le signalement          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Questions ouvertes

- [ ] Faut-il permettre de transmettre un signalement à un service externe?
- [ ] Workflow de validation avant transmission?
- [ ] Intégration avec système qualité cantonal?
- [ ] Archivage: durée de rétention des signalements?

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-01-19 | Création initiale basée sur recherche terrain |
