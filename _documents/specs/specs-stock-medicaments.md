# Module: Stock Médicaments

> Spec basée sur l'analyse de DisQnet et les insights terrain

---

## Vue d'ensemble

Gestion du stock de médicaments par emplacement (ambulance, armoire, sac). Inclut le contrôle renforcé des stupéfiants avec traçabilité complète.

**Pain point principal:** Actions dispersées dans plusieurs écrans → objectif: tout regrouper.

---

## Rôles et permissions

| Rôle | Consulter | Entrée/Sortie | Transfert | Contrôle stup. | Config |
|------|-----------|---------------|-----------|----------------|--------|
| Ambulancier | ✅ | ✅ | ✅ | ✅ | ❌ |
| Responsable logistique | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Concepts clés

### Emplacement

Un lieu physique où sont stockés des médicaments:
- **Ambulance** (ex: ASCO 070, ASCO 072)
- **Armoire centrale** (à la base)
- **Sac médical** (trousse d'intervention)

### Médicament

- Nom générique + dosage
- Numéro de lot
- Date d'expiration
- Flag "stupéfiant" (contrôle renforcé)

### Mouvement

Toute entrée, sortie ou transfert de médicament avec traçabilité.

---

## Vues

### 1. Dashboard Stock

**URL:** `/stock`

**Objectif:** Vue consolidée de toutes les actions stock

**Sections:**
1. **Alertes** - Stock bas, périmés bientôt
2. **Actions rapides** - Contrôle quotidien, Entrée, Sortie, Transfert
3. **Inventaire par emplacement** - Liste filtrable

**Wireframe:**
```
┌─────────────────────────────────────────────────────┐
│  Stock Médicaments              [Emplacement ▼]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ── Alertes (2) ────────────────────────────────── │
│  │ ⚠️ Adrénaline: 2 restants (min: 5)             │ │
│  │ ⏰ Morphine lot#2345: expire dans 7 jours      │ │
│                                                     │
│  ── Actions rapides ────────────────────────────── │
│  [🔍 Contrôle quotidien] [📥 Entrée] [📤 Sortie]   │
│  [🔄 Transfert] [📋 Historique]                    │
│                                                     │
│  ── Inventaire ASCO 070 ────────────────────────── │
│  🔍 Rechercher...                                   │
│  ┌──────────────────┬─────┬───────────┬──────────┐ │
│  │ Médicament       │ Qté │ Lot       │ Exp.     │ │
│  ├──────────────────┼─────┼───────────┼──────────┤ │
│  │ Adrénaline 1mg   │  2  │ #2341     │ 06/2026  │ │
│  │ 🔒 Morphine 10mg │  4  │ #2508     │ 03/2027  │ │
│  │ Paracétamol 1g   │ 12  │ #1892     │ 12/2026  │ │
│  │ NaCl 0.9% 500ml  │  8  │ #3421     │ 08/2027  │ │
│  └──────────────────┴─────┴───────────┴──────────┘ │
│                                                     │
│  🔒 = Stupéfiant (contrôle renforcé)               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2. Contrôle quotidien

**URL:** `/stock/controle`

**Contexte:** Vérifié chaque jour par l'équipe. Obligatoire pour les stupéfiants.

#### Champs du formulaire

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| emplacement | Select | ✅ | Ambulance ou sac à contrôler |
| date_controle | Date | ✅ | Par défaut: aujourd'hui |
| items | Repeater | ✅ | Liste des médicaments à valider |

#### Item de contrôle

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| medicament_id | Hidden | ✅ | ID du médicament |
| conforme | Radio | ✅ | OUI / NON |
| remarque | Text | Si NON | Explication obligatoire si non conforme |
| quantite_constatee | Number | Si écart | Quantité réelle si différente |

**Comportement pour stupéfiants:**
- Double validation possible (2 signatures)
- Alerte immédiate si écart
- Notification au responsable

---

### 3. Entrée de stock

**URL:** `/stock/entree`

**Contexte:** Réapprovisionnement depuis la pharmacie centrale.

#### Champs

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| destination | Select | ✅ | Emplacement de destination |
| medicament | Autocomplete | ✅ | Recherche par nom |
| lot | Text | ✅ | Numéro de lot |
| date_expiration | Date | ✅ | Doit être future |
| quantite | Number | ✅ | Min: 1 |
| fournisseur | Select | ❌ | Pharmacie source |
| bon_livraison | Text | ❌ | Référence du bon |

---

### 4. Sortie de stock

**URL:** `/stock/sortie`

**Contexte:** Utilisation lors d'une intervention ou péremption.

#### Champs

| Champ | Type | Requis | Validation |
|-------|------|--------|------------|
| origine | Select | ✅ | Emplacement source |
| medicament | Autocomplete | ✅ | Parmi le stock disponible |
| quantite | Number | ✅ | Max: stock disponible |
| motif | Select | ✅ | Voir enum ci-dessous |
| numero_intervention | Text | Si utilisé | Lien avec Attrib |
| remarque | Textarea | ❌ | Notes additionnelles |

#### Motifs de sortie (enum)

```typescript
enum MotifSortie {
  UTILISATION = 'utilisation',     // Utilisé sur intervention
  PEREMPTION = 'peremption',       // Périmé, à détruire
  CASSE = 'casse',                 // Cassé/endommagé
  PERTE = 'perte',                 // Perdu
  TRANSFERT_HOPITAL = 'transfert', // Laissé à l'hôpital
  AUTRE = 'autre'
}
```

---

### 5. Transfert

**URL:** `/stock/transfert`

**Contexte:** Déplacement entre emplacements (ex: armoire → ambulance).

#### Champs

| Champ | Type | Requis |
|-------|------|--------|
| origine | Select | ✅ |
| destination | Select | ✅ |
| medicament | Autocomplete | ✅ |
| quantite | Number | ✅ |
| remarque | Textarea | ❌ |

---

### 6. Historique des mouvements

**URL:** `/stock/historique`

**Filtres:**
- Par emplacement
- Par médicament
- Par type de mouvement
- Par période
- Par utilisateur

**Colonnes:**
| Champ | Description |
|-------|-------------|
| Date/Heure | Timestamp du mouvement |
| Type | Entrée / Sortie / Transfert / Contrôle |
| Médicament | Nom + lot |
| Quantité | +X ou -X |
| Emplacement | Origine → Destination |
| Utilisateur | Qui a fait l'action |
| Motif | Si sortie |
| N° intervention | Si lié |

---

## Modèle de données

```typescript
interface Emplacement {
  id: string;
  type: 'ambulance' | 'armoire' | 'sac';
  nom: string;           // Ex: "ASCO 070", "Armoire centrale"
  base_id: string;
  actif: boolean;
}

interface Medicament {
  id: string;
  nom: string;           // Ex: "Adrénaline"
  dosage: string;        // Ex: "1mg/ml"
  forme: string;         // Ex: "ampoule", "comprimé"
  stupefiant: boolean;
  seuil_alerte: number;  // Stock minimum avant alerte
  service_id: string;
}

interface Stock {
  id: string;
  emplacement_id: string;
  medicament_id: string;
  lot: string;
  date_expiration: Date;
  quantite: number;
  created_at: DateTime;
  updated_at: DateTime;
}

interface Mouvement {
  id: string;
  type: 'entree' | 'sortie' | 'transfert';
  medicament_id: string;
  lot: string;
  quantite: number;

  // Emplacements
  emplacement_origine_id?: string;
  emplacement_destination_id?: string;

  // Contexte
  motif?: MotifSortie;
  numero_intervention?: string;
  remarque?: string;

  // Métadonnées
  created_at: DateTime;
  created_by: string;
}

interface ControleQuotidien {
  id: string;
  emplacement_id: string;
  date_controle: Date;

  // Validations
  validateur_1_id: string;
  validateur_1_at: DateTime;
  validateur_2_id?: string;  // Pour stupéfiants
  validateur_2_at?: DateTime;

  // Items
  items: ControleItem[];

  // Statut
  conforme: boolean;
  remarque_generale?: string;
}

interface ControleItem {
  medicament_id: string;
  lot: string;
  quantite_attendue: number;
  quantite_constatee: number;
  conforme: boolean;
  remarque?: string;
}
```

---

## API Endpoints

```
# Stock
GET    /api/stock                      # Liste par emplacement
GET    /api/stock/alertes              # Alertes (bas, périmés)
GET    /api/stock/:emplacement_id      # Stock d'un emplacement

# Mouvements
POST   /api/stock/entree               # Nouvelle entrée
POST   /api/stock/sortie               # Nouvelle sortie
POST   /api/stock/transfert            # Nouveau transfert
GET    /api/stock/mouvements           # Historique avec filtres

# Contrôle
POST   /api/stock/controle             # Nouveau contrôle quotidien
GET    /api/stock/controles            # Historique des contrôles
GET    /api/stock/controle/:id         # Détail d'un contrôle

# Admin
GET    /api/medicaments                # Liste des médicaments
POST   /api/medicaments                # Ajouter un médicament
GET    /api/emplacements               # Liste des emplacements
POST   /api/emplacements               # Ajouter un emplacement
```

---

## Alertes automatiques

| Type | Déclencheur | Notification |
|------|-------------|--------------|
| Stock bas | Quantité < seuil_alerte | In-app + Email responsable |
| Péremption proche | Expire dans < 30 jours | In-app |
| Péremption imminente | Expire dans < 7 jours | In-app + Email |
| Écart stupéfiant | Contrôle non conforme | Email immédiat |
| Contrôle manquant | Pas de contrôle depuis 24h | Notification équipe |

---

## Questions ouvertes

- [ ] Double signature obligatoire pour stupéfiants? (2 personnes)
- [ ] Intégration avec système de commande pharmacie?
- [ ] Scan code-barre pour entrée/sortie rapide?
- [ ] Qui peut modifier les seuils d'alerte?

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-01-19 | Création initiale basée sur recherche terrain |
