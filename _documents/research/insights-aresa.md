# ARESA - Insights & Specifications

> Recherche terrain du 19 janvier 2026

---

## Contexte

ARESA est une application complémentaire à **Attrib** (gestion des interventions d'urgence). Elle couvre tout ce qui **entoure** l'intervention : communication entre équipes, gestion du stock, signalements qualité, formation, documents.

### Périmètre

| Dans le scope ARESA | Hors scope (Attrib) |
|---------------------|---------------------|
| Livre de bord / Annonces | Gestion intervention temps réel |
| Relève entre équipes | Régulation 144/SAGA |
| Stock médicaments | Documentation patient (FIP) |
| Signalements qualité | Stats interventions |
| Pannes équipement | |
| Formation étudiants | |
| Documents / Procédures | |
| Inventaire / Checklists | |

### Organisation

- **Service** = entité (ex: Ambulances Région Morges)
- Un service peut avoir **plusieurs bases**
- **Équipe** = 2-3 personnes par ambulance
- Briefing quotidien à 07:00

---

## Modules & Insights

### 1. Livre de bord & Annonces

**Problèmes actuels**
- Manque de tags, vision tableau faible
- Difficile de trouver le bon formulaire
- Pas de validation lu/non-lu
- Modèles customs manquants

**Besoins**
- Dashboard centralisé (vues: base / service / équipe)
- Tags et recherche
- Validation lu/non-lu par collaborateur
- Modèles d'annonces personnalisables
- Annonces cross-services (vers pompiers, hôpitaux, etc.)
- Affichage sur TV dans les locaux

**Idées**
- IA qui résume les entrées du livre de bord
- Statut d'engorgement CHUV visible

---

### 2. Stock Médicaments

**Problèmes actuels**
- Actions dispersées dans plusieurs écrans
- Double saisie à cause de latence
- Stats médicaments incorrectes

**Besoins**
- Regrouper toutes les actions stock en un seul endroit
- Contrôle quotidien par emplacement (sac, armoire)
- Suivi stupéfiants (compliance légale)
- Liaison avec numéro d'intervention (pour traçabilité)

---

### 3. Signalements Qualité

> Module jugé **le plus important** par les utilisateurs

**Contexte**
- Approche **Just Culture** (amélioration continue, non-punitive)
- 2-4 signalements par mois typiquement
- Types: erreur d'identité, refus admission psy, incidents divers

**Problèmes actuels**
- Catégories pas toujours adaptées
- Pas de ciblage du destinataire
- Manque d'options confidentialité

**Besoins**
- Option **anonyme** (identité cachée)
- Option **confidentiel** (visible seulement par responsable qualité)
- Cibler le destinataire (service faitier, autre service)
- Notification email au responsable qualité
- Suivi du traitement du signalement

---

### 4. Pannes Équipement

**Processus actuel**
- Ambulancier fait l'annonce
- Email part vers logistique
- 4 types de pannes identifiés

**Besoins**
- Formulaire simple de déclaration
- Catégorisation (4 types)
- Notification automatique logistique
- Suivi état de réparation
- Historique par équipement

---

### 5. Formation Étudiants

**Contexte**
- Stages de 2 mois ou formations de 3 ans
- Étudiant saisit ses propres objectifs
- Mentor donne feedback

**Besoins**
- Profil étudiant avec objectifs
- Suivi des compétences acquises
- Journal de progression
- Feedback du mentor (sur le moment ou fin de service)

---

### 6. Documents & Procédures

**Problèmes actuels**
- Beaucoup de procédures, difficile à naviguer
- Pas d'arborescence claire
- Pas de traçabilité (qui a lu quoi)

**Besoins**
- Structure en arborescence
- Tags pour filtrer/rechercher
- Traçabilité de lecture
- Lier annonce ↔ document (ex: "nouvelle procédure, voir doc X")

---

### 7. Inventaire & Checklists

**Processus actuel**
- Vérification début de service
- Checklists existantes mais pas digitalisées

**Besoins**
- QR code sur trousse/armoire → ouvre la checklist correspondante
- Checklist liée à une tâche
- Validation digitale

---

### 8. Administration

**Besoins mentionnés**
- Simplifier création d'utilisateurs
- Profilage dynamique des rôles
- Éventuellement 2FA ou IP fixe au bureau

---

## Pain Points Résumés

| Problème | Impact | Priorité |
|----------|--------|----------|
| Actions stock dispersées | Double travail, erreurs | Haute |
| Pas de lu/non-lu sur annonces | Infos manquées | Haute |
| Signalement sans anonymat | Sous-déclaration | Haute |
| Latence → double saisie | Frustration quotidienne | Moyenne |
| Formulaires difficiles à trouver | Perte de temps | Moyenne |
| Stats incorrectes | Perte de confiance | Moyenne |
| Complexe pour nouveaux | Onboarding difficile | Basse |

---

## User Stories

### Module: Annonces & Livre de bord

```
US-ANN-01: Créer une annonce
En tant qu'ambulancier,
je veux créer une annonce rapidement,
afin d'informer les équipes suivantes d'une situation.

Critères:
- Choix du type d'annonce (modèle ou libre)
- Tags optionnels
- Visibilité: base / service / tous
- Option "important" (mise en avant)
```

```
US-ANN-02: Consulter les annonces
En tant qu'ambulancier arrivant en service,
je veux voir les annonces non lues en priorité,
afin de ne rien manquer d'important.

Critères:
- Badge "non lu" visible
- Marquer comme lu (explicite ou auto)
- Filtre par tags/type
- Recherche texte
```

```
US-ANN-03: Annonces cross-services
En tant que responsable de base,
je veux envoyer une annonce à un autre service (pompiers, hôpital),
afin de coordonner une action inter-services.

Critères:
- Sélection du destinataire externe
- Confirmation d'envoi
- Historique des échanges
```

### Module: Stock Médicaments

```
US-MED-01: Vue consolidée du stock
En tant qu'ambulancier,
je veux voir toutes les actions stock sur un seul écran,
afin de gagner du temps et éviter les erreurs.

Critères:
- Contrôle quotidien
- Entrée/sortie de stock
- Transfert entre emplacements
- Liaison intervention (optionnel)
```

```
US-MED-02: Contrôle stupéfiants
En tant qu'ambulancier,
je veux valider le contrôle quotidien des stupéfiants,
afin d'assurer la compliance légale.

Critères:
- Checklist par emplacement (sac, armoire)
- Double validation (2 signatures si requis)
- Historique des contrôles
- Alerte si non fait
```

```
US-MED-03: Alerte stock bas
En tant que responsable logistique,
je veux être alerté quand un médicament atteint le seuil minimum,
afin de réapprovisionner à temps.

Critères:
- Seuils configurables par produit
- Notification email/push
- Dashboard des alertes actives
```

### Module: Signalements Qualité

```
US-SIG-01: Créer un signalement
En tant que collaborateur,
je veux signaler un incident ou une amélioration,
afin de contribuer à la qualité du service.

Critères:
- Catégories prédéfinies + "autre"
- Description libre
- Option anonyme
- Option confidentiel
- Choix du destinataire
```

```
US-SIG-02: Traiter un signalement
En tant que responsable qualité,
je veux voir et traiter les signalements,
afin d'assurer le suivi et les actions correctives.

Critères:
- Liste des signalements (filtrable)
- Statut: nouveau / en cours / traité
- Notes de suivi
- Notification à l'auteur (si non anonyme)
```

```
US-SIG-03: Statistiques qualité
En tant que direction,
je veux voir les stats de signalements,
afin de mesurer la culture qualité.

Critères:
- Nombre par période/catégorie
- Temps moyen de traitement
- Tendances
```

### Module: Pannes Équipement

```
US-PAN-01: Déclarer une panne
En tant qu'ambulancier,
je veux signaler une panne rapidement,
afin que la logistique puisse intervenir.

Critères:
- Type de panne (4 catégories)
- Équipement concerné
- Description/photo optionnelle
- Urgence (bloquant / non-bloquant)
```

```
US-PAN-02: Suivi des pannes
En tant que responsable logistique,
je veux suivre l'état des pannes déclarées,
afin de gérer les réparations.

Critères:
- Liste des pannes actives
- Statut: déclaré / en cours / résolu
- Historique par équipement
- Notification quand résolu
```

### Module: Formation

```
US-FOR-01: Définir mes objectifs (étudiant)
En tant qu'étudiant,
je veux saisir mes objectifs de stage,
afin que mon mentor puisse m'accompagner.

Critères:
- Liste d'objectifs prédéfinis + custom
- Statut: à travailler / en cours / acquis
- Notes personnelles
```

```
US-FOR-02: Donner du feedback (mentor)
En tant que mentor,
je veux donner du feedback sur les compétences de l'étudiant,
afin de suivre sa progression.

Critères:
- Feedback par objectif
- Feedback général (fin de service)
- Visible par l'étudiant
- Historique
```

### Module: Documents

```
US-DOC-01: Trouver un document
En tant qu'ambulancier,
je veux trouver rapidement une procédure,
afin de la consulter sur le terrain.

Critères:
- Arborescence par thème
- Recherche texte
- Tags
- Favoris
```

```
US-DOC-02: Publier un document
En tant que responsable,
je veux publier une nouvelle procédure,
afin de la diffuser aux équipes.

Critères:
- Upload fichier (PDF, etc.)
- Métadonnées (titre, tags, catégorie)
- Option: créer annonce liée
- Traçabilité de lecture
```

### Module: Inventaire

```
US-INV-01: Scanner une checklist
En tant qu'ambulancier,
je veux scanner le QR code d'une trousse,
afin d'ouvrir directement sa checklist.

Critères:
- Scan QR → checklist correspondante
- Validation item par item
- Signaler manquant
- Historique des vérifications
```

---

## Wireframes (descriptions)

### Dashboard principal

```
┌─────────────────────────────────────────────────────┐
│  ARESA                          [Base ▼] [Profil]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ Annonces    │  │ Tâches      │  │ Alertes     │ │
│  │ 3 non lues  │  │ 2 en cours  │  │ 1 stock bas │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                     │
│  ── Annonces récentes ──────────────────────────── │
│  │ ⚠️ [Important] Procédure RCP mise à jour       │ │
│  │ 📢 Briefing: congestion CHUV ce matin          │ │
│  │ 📋 Relève: O2 ambulance 3 à vérifier           │ │
│                                                     │
│  ── Accès rapides ──────────────────────────────── │
│  [+ Annonce] [+ Signalement] [Stock] [Documents]   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Création d'annonce

```
┌─────────────────────────────────────────────────────┐
│  ← Nouvelle annonce                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Type:  ○ Libre  ○ Relève  ○ Info  ○ Alerte       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Titre                                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Contenu...                                   │   │
│  │                                              │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Tags: [+ ajouter]  ┌────┐ ┌────┐                  │
│                     │ O2 │ │RCP │                  │
│                     └────┘ └────┘                  │
│                                                     │
│  Visibilité:  ○ Ma base  ○ Mon service  ○ Tous    │
│                                                     │
│  ☐ Marquer comme important                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │            Publier l'annonce                 │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Stock médicaments (vue consolidée)

```
┌─────────────────────────────────────────────────────┐
│  ← Stock médicaments              [Sac A ▼]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔍 Rechercher...                                   │
│                                                     │
│  ── Alertes ────────────────────────────────────── │
│  │ ⚠️ Adrénaline: 2 restants (min: 5)             │ │
│                                                     │
│  ── Actions rapides ────────────────────────────── │
│  [Contrôle quotidien] [Entrée] [Sortie] [Transfert]│
│                                                     │
│  ── Inventaire ─────────────────────────────────── │
│  │ Adrénaline 1mg      │  2  │ [−] [+]            │ │
│  │ Morphine 10mg  🔒   │  4  │ [−] [+]            │ │
│  │ Paracétamol 1g      │ 12  │ [−] [+]            │ │
│  │ NaCl 0.9% 500ml     │  8  │ [−] [+]            │ │
│  │ ...                                            │ │
│                                                     │
│  🔒 = Stupéfiant (contrôle renforcé)               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Signalement qualité

```
┌─────────────────────────────────────────────────────┐
│  ← Nouveau signalement                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Catégorie:                                         │
│  ○ Erreur d'identité                               │
│  ○ Refus admission                                 │
│  ○ Incident matériel                               │
│  ○ Amélioration suggérée                           │
│  ○ Autre                                           │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Description de la situation...               │   │
│  │                                              │   │
│  │                                              │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Destinataire: [Responsable qualité ▼]             │
│                                                     │
│  Options:                                          │
│  ☐ Anonyme (mon identité ne sera pas visible)      │
│  ☐ Confidentiel (visible uniquement par le         │
│    responsable qualité)                            │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              Envoyer                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Liste annonces (avec lu/non-lu)

```
┌─────────────────────────────────────────────────────┐
│  ← Annonces                    [Filtrer ▼] 🔍      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ── Non lues (3) ───────────────────────────────── │
│  │ ● ⚠️ Procédure RCP mise à jour                 │ │
│  │     il y a 2h · #procédure #RCP                │ │
│  │                                                │ │
│  │ ● 📢 Briefing: congestion CHUV                 │ │
│  │     il y a 4h · #CHUV                          │ │
│  │                                                │ │
│  │ ● 📋 Relève: vérifier O2 amb. 3                │ │
│  │     il y a 6h · #relève #O2                    │ │
│                                                     │
│  ── Lues ────────────────────────────────────────  │
│  │ ○ Formation défib. mercredi 14h                │ │
│  │     hier · #formation                          │ │
│  │                                                │ │
│  │ ○ Nouveau protocole allergie                   │ │
│  │     il y a 3 jours · #procédure                │ │
│                                                     │
│  ● = non lu   ○ = lu                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Prochaines étapes

- [ ] Valider les user stories avec l'équipe
- [ ] Prioriser les modules (MVP)
- [ ] Créer maquettes Figma
- [ ] Définir le modèle de données
- [ ] Planifier les sprints

---

## Notes additionnelles

_Espace pour ajouter des notes manuellement..._

