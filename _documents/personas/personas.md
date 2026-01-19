# ARESA - Rôles & Permissions

> Basé sur la recherche terrain du 19 janvier 2026

---

## Philosophie

Les rôles ne sont pas des personas figés. Un utilisateur a:
1. Un **rôle de base** (AD, TA, Étudiant)
2. Zéro, une ou plusieurs **responsabilités additionnelles**

Exemple: Marie est AD + Responsable Qualité + Adjointe Formation

---

## Rôles de base

Chaque utilisateur a UN rôle de base qui définit son niveau d'accès minimal.

### Ambulancier Diplômé (AD)

| | |
|---|---|
| **Formation** | École Supérieure (ES) - 3 ans |
| **Terrain** | Leader clinique, gestes médicaux avancés |
| **Accès ARESA** | Complet (tous modules, stupéfiants inclus) |

### Technicien Ambulancier (TA)

| | |
|---|---|
| **Formation** | CFC ou formation courte |
| **Terrain** | Conduite, assistance, logistique |
| **Accès ARESA** | Identique à AD (même UI, même fonctionnalités) |

> **Note terrain:** "Les TA utilisent le même système que les AD"

### Étudiant / Stagiaire

| | |
|---|---|
| **Formation** | Stage 2 mois, 6 mois, ou formation ES 3 ans |
| **Terrain** | Observation, assistance supervisée |
| **Accès ARESA** | Limité (ses objectifs, documents, lecture annonces) |

---

## Responsabilités additionnelles

Ces responsabilités s'ajoutent au rôle de base. Un utilisateur peut en avoir plusieurs.

### Responsable Qualité

| | |
|---|---|
| **Mission** | Traitement signalements, Just Culture, audits |
| **Accès supplémentaire** | Module Signalements complet, stats qualité |
| **Peut avoir un adjoint** | Oui |

### Responsable Formation

| | |
|---|---|
| **Mission** | Suivi étudiants, lien écoles, validation stages |
| **Accès supplémentaire** | Module Étudiants complet, tous les étudiants |
| **Peut avoir un adjoint** | Oui |

### Responsable Logistique

| | |
|---|---|
| **Mission** | Stock, pannes, commandes, maintenance |
| **Accès supplémentaire** | Modules Stock et Pannes complets, alertes |
| **Peut avoir un adjoint** | Oui |

### Responsable de Base

| | |
|---|---|
| **Mission** | Gestion équipe locale, coordination |
| **Accès supplémentaire** | Config tâches/checklists de sa base |
| **Peut avoir un adjoint** | Oui |

### Direction

| | |
|---|---|
| **Mission** | Pilotage du service, décisions stratégiques |
| **Accès supplémentaire** | Stats globales, vue multi-bases, config service |
| **Peut avoir un adjoint** | Oui |

### Adjoint(e)

| | |
|---|---|
| **Mission** | Seconder un responsable |
| **Accès supplémentaire** | Mêmes accès que le responsable qu'il seconde |

---

## Modèle de données

```typescript
interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;

  // Rôle de base (obligatoire, un seul)
  role_base: 'ad' | 'ta' | 'etudiant';

  // Responsabilités additionnelles (0 à n)
  responsabilites: Responsabilite[];

  // Affectation
  service_id: string;
  base_id: string;        // Base principale
  bases_secondaires: string[];  // Si multi-sites
}

interface Responsabilite {
  type: ResponsabiliteType;
  scope: 'base' | 'service';  // Périmètre
  adjoint: boolean;           // Est adjoint?
  adjoint_de?: string;        // User ID du responsable
}

enum ResponsabiliteType {
  QUALITE = 'qualite',
  FORMATION = 'formation',
  LOGISTIQUE = 'logistique',
  BASE = 'base',
  DIRECTION = 'direction'
}
```

---

## Matrice des permissions

### Par rôle de base

| Module | AD | TA | Étudiant |
|--------|----|----|----------|
| Annonces | CRUD | CRUD | R |
| Stock | CRUD | CRUD | R |
| Stupéfiants | CRUD | CRUD | ❌ |
| Signalements | C (sien) | C (sien) | C (sien) |
| Pannes | C | C | R |
| Tâches | Valider | Valider | R |
| Étudiants | - | - | Soi-même |
| Documents | R | R | R |

### Permissions additionnelles par responsabilité

| Responsabilité | Permissions supplémentaires |
|----------------|----------------------------|
| **+ Qualité** | Signalements: voir tous, traiter, stats |
| **+ Formation** | Étudiants: voir tous, gérer, évaluer |
| **+ Logistique** | Stock: config, alertes / Pannes: traiter |
| **+ Base** | Tâches: CRUD / Annonces: modérer |
| **+ Direction** | Stats globales, config service, users |

---

## Exemples concrets

### Lucas - AD simple

```
Rôle de base: AD
Responsabilités: aucune
```

**Accès:** Annonces, Stock, Tâches, Documents, créer signalements/pannes

---

### Marie - AD + Resp. Qualité

```
Rôle de base: AD
Responsabilités: [{ type: 'qualite', scope: 'service' }]
```

**Accès:** Tout ce qu'un AD a + voir/traiter tous les signalements + stats qualité

---

### Jean - TA + Adjoint Logistique

```
Rôle de base: TA
Responsabilités: [{ type: 'logistique', adjoint: true, adjoint_de: 'user_123' }]
```

**Accès:** Tout ce qu'un TA a + traiter pannes + gérer stock

---

### Sophie - AD + Resp. Base + Resp. Formation

```
Rôle de base: AD
Responsabilités: [
  { type: 'base', scope: 'base' },
  { type: 'formation', scope: 'service' }
]
```

**Accès:** Tout ce qu'un AD a + config tâches base + gérer tous les étudiants

---

### Pierre - Étudiant

```
Rôle de base: Étudiant
Responsabilités: aucune
```

**Accès:** Lire annonces/documents, gérer ses objectifs, voir ses évaluations

---

## UI: Sélecteur de contexte

Pour les utilisateurs avec plusieurs responsabilités, proposer un switch de contexte:

```
┌─────────────────────────────────────────────────────┐
│  👤 Marie Dupont                                    │
│                                                     │
│  Casquette active:                                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🚑 Ambulancière (par défaut)            ▼  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ○ 🚑 Ambulancière                                 │
│  ○ ✅ Responsable Qualité                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Ou afficher les modules supplémentaires directement dans la nav quand l'utilisateur a les droits.

---

## Configuration admin

### Assigner une responsabilité

```
┌─────────────────────────────────────────────────────┐
│  Modifier: Marie Dupont                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Rôle de base: [AD ▼]                              │
│                                                     │
│  Responsabilités:                                   │
│  ☑ Responsable Qualité     Scope: [Service ▼]      │
│  ☐ Responsable Formation   Scope: [       ▼]      │
│  ☐ Responsable Logistique  Scope: [       ▼]      │
│  ☐ Responsable de Base     Scope: [       ▼]      │
│  ☐ Direction               Scope: [       ▼]      │
│                                                     │
│  [Enregistrer]                                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Questions résolues

| Question | Réponse |
|----------|---------|
| AD et TA ont-ils une UI différente? | Non, même interface |
| Peut-on cumuler les responsabilités? | Oui, sans limite |
| Un étudiant peut-il avoir des responsabilités? | Non (en principe) |
| Adjoint = mêmes droits? | Oui, pour son périmètre |

---

## Questions ouvertes

- [ ] Un TA peut-il devenir Responsable Formation? (rare mais possible?)
- [ ] Scope "base" vs "service" pour chaque responsabilité?
- [ ] Historique des changements de rôles?
- [ ] Délégation temporaire (vacances)?
