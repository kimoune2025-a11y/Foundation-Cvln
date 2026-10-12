# 02 — Entity Inventory (Phase 1)

- **Mission :** CVLN-GOV-RECON-001
- **Phase :** 1 — Inventaire exhaustif
- **Date :** 2026-10-11
- **Statut :** DRAFT — aucune fusion, aucun renommage, aucune modification du registre
- **Révision :** 2026-10-12 — contre-vérification adversariale (sources complétées, SRC-29, CAND-08 à CAND-12)

## Règles appliquées

- Les identifiants `ENT-*` sont ceux du registre canonique (SRC-01) et ne sont pas modifiés.
- Les éléments absents du registre reçoivent un identifiant **candidat** `CAND-*`. Ce n’est pas une entrée au registre.
- Les composants techniques observés (code, applications) reçoivent un identifiant `TECH-*`. Un composant technique n’est pas une entité juridique ou métier.
- Les fournisseurs externes reçoivent un identifiant `EXT-*`.
- Statuts selon le mandat §6 : `VERIFIED_OPERATIONAL`, `PARTIALLY_VERIFIED`, `DOCUMENTED_ONLY`, `IN_PROGRESS`, `BLOCKED`, `UNKNOWN`, `DEPRECATED`.
- **Implémentation** = existence de code dans le périmètre accessible. **Opérationnel** = fonctionnement démontré par une preuve actuelle. **Juridique** = existence attestée par une pièce.
- `DOCUMENTED_ONLY*` signifie : décrit uniquement dans des documents, **dans le périmètre accessible** (2 dépôts). Des réalisations peuvent exister ailleurs (voir D-02).

## 1. Entités du registre canonique (29)

Pour les 29 entités : `architectural_status: DECIDED` au registre, mais la validation des rattachements par Laurent CŒURVOLAN n’est pas tracée (C-01). Le statut juridique est `UNKNOWN` pour toutes : aucune pièce n’a été fournie.

| ID | Nom | Type registre | Rôle déclaré | Parent (`PART_OF`) | Autres sources | Implémentation | Opérationnel | Notes / contradictions |
|---|---|---|---|---|---|---|---|---|
| ENT-CVLN-FOUNDATION | CVLN Foundation | LEGAL_ENTITY | Gouvernance · vision · racine | — (racine) | SRC-10 (« Fondation COEURVOLAN »), SRC-12 (« CVLN Foundation / Cœurvolan ») | DOCUMENTED_ONLY* (une vitrine existe : TECH-01) | UNKNOWN | Alias non formalisé ; type juridique non prouvé (C-09) |
| ENT-CVLN-GROUP | CVLN Group | BUSINESS_ENTITY | Écosystème global · portefeuille | Foundation | SRC-04/05 (« CVLN Holding » ?), SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | Relation avec CVLN Holding inconnue (C-04) |
| ENT-META-CVLN | Meta CVLN | BUSINESS_ENTITY | Gouvernance groupe · portefeuille | Group | SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | — |
| ENT-INFRASTRUCTURES-CVLN | Infrastructures CVLN | INFRASTRUCTURE | Fondations techniques | Meta CVLN | — | DOCUMENTED_ONLY* | UNKNOWN | Catégorie de regroupement |
| ENT-FREKCORE | FREKCORE | INFRASTRUCTURE | Identité · provenance · preuve | Infrastructures CVLN | SRC-04/05 (« La voix créative », pôle Média & Content), SRC-12, SRC-29 (alias candidat « FREK », type `brand`, l. 55) | DOCUMENTED_ONLY* | UNKNOWN | Définition historique différente (C-02) |
| ENT-FREK-ID | FREK-ID | SERVICE | Identité | FREKCORE | SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | — |
| ENT-FREK-CHAIN | FREK-CHAIN | PROTOCOL | Provenance | FREKCORE | — | DOCUMENTED_ONLY* | UNKNOWN | — |
| ENT-FREK-FORMATS | .FK · FREKANSLA · FREKRAW · Verified | FORMAT | Formats · preuve | FREKCORE | — | DOCUMENTED_ONLY* | UNKNOWN | 4 éléments regroupés sous une seule entité ; à confirmer |
| ENT-PROOF-LAYER | Proof Layer | INFRASTRUCTURE | Evidence · notarial | Infrastructures CVLN | — | DOCUMENTED_ONLY* | UNKNOWN | « Valeur notariale » : affirmation à portée juridique, non étayée |
| ENT-CVLN-WALLET | CVLN Wallet | PLATFORM | Économie · JCC · paiements | Infrastructures CVLN | SRC-04/05 (pôle Fintech), doctrine JCC, SRC-12 (« Wallet/JCC », « CVLN Wallet et JCC ») | DOCUMENTED_ONLY* | UNKNOWN | Risque réglementaire des paiements (R-17) |
| ENT-ENTITES-METIER-CVLN | Entités Métier CVLN | BUSINESS_ENTITY | Activités opérationnelles | Meta CVLN | — | DOCUMENTED_ONLY* | UNKNOWN | Catégorie de regroupement |
| ENT-KORA | KORA | PLATFORM | Streaming · média | Entités Métier CVLN | SRC-04/05 (pôle Média & Content), SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | — |
| ENT-LABELOS | LabelOS | PLATFORM | Label · droits | KORA | SRC-05, SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | Command Center connaît un type d’entité « label » (C-06) |
| ENT-FACTORY-MAKER-STUDIO | Factory Maker Studio | PLATFORM | Création · studio | KORA | SRC-04/05 (pôle Tech & Data), SRC-12, SRC-24 (entité déclarée pré-chargée par l’agent de test, non vérifiée), SRC-29 (type `studio`, l. 49) | DOCUMENTED_ONLY* | UNKNOWN | Rattachement divergent (C-17) |
| ENT-KILTIKONET | Kiltikonet | PLATFORM | Réseau culturel | Entités Métier CVLN | SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | Regroupement du mandat non reflété (C-13) |
| ENT-CVLN-ACADEMY | CVLN Academy | PROGRAM | Formation · skills | Entités Métier CVLN | SRC-04/05 (pôle Éducation), SRC-12 (« CVLN Academy et les académies associées »), SRC-29 (alias candidat « CVL Academy », l. 54) | DOCUMENTED_ONLY* | UNKNOWN | Académies réparties sur deux branches (C-18) |
| ENT-CVLN-INTELLIGENCE-OS | CVLN Intelligence OS | INFRASTRUCTURE | Système commun d’intelligence | Group | SRC-06 (`886ac8c` : « NON branché (comme demandé) »), SRC-12 (« Infrastructure d’intelligence partagée ») | DOCUMENTED_ONLY* | UNKNOWN | Branchement suggéré, non réalisé (C-12) |
| ENT-CVLN-BRAIN | CVLN Brain | SERVICE | Intelligence · LLM | Intelligence OS | SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | — |
| ENT-CVLN-AGENT-FACTORY | CVLN Agent Factory | PLATFORM | Système nerveux · agents | CVLN Brain | SRC-04 (pôle Tech & Data), SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | Double relation avec Brain (C-14) |
| ENT-LAURENTIA | Laurentia | AGENT | Agent · interface métier | Agent Factory | SRC-05 (« La terre au cœur du projet », pôle Agriculture & Terroir), SRC-12 (« opérateur IA … personnelle et métier ») | DOCUMENTED_ONLY* | UNKNOWN | Trois définitions différentes (C-03) |
| ENT-CVLN-COMMAND-CENTER | CVLN Command Center | PLATFORM | Supervision · pilotage | Intelligence OS | SRC-04 (pôle Gouvernance), SRC-12 (« Supervision opérationnelle privée et pilotage »), SRC-R2 (application) | **IN_PROGRESS** (TECH-02) | UNKNOWN | Rattachement divergent de la réalité technique (C-05) |
| ENT-STRUCTURES-ENTITES | Structures & Entités | BUSINESS_ENTITY | Opérationnelles · programmes | Group | — | DOCUMENTED_ONLY* | UNKNOWN | Catégorie de regroupement |
| ENT-CULTURE-CONNECT | Culture Connect | PROGRAM | Programme | Structures & Entités | SRC-12, SRC-29 (type `agency`, l. 50) | DOCUMENTED_ONLY* | UNKNOWN | C-13 |
| ENT-GOOD-MOOD | Good Mood | PROGRAM | Programme | Structures & Entités | SRC-04/05 (pôle Events), SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | — |
| ENT-GOOD-MOOD-FEST | Good Mood Fest | PROGRAM | Événement | Structures & Entités | SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | — |
| ENT-GALA-COOK-FOOD | Gala Cook & Food | PROGRAM | Gastronomie | Structures & Entités | SRC-05 (pôle Events & Art de vivre), SRC-12 | DOCUMENTED_ONLY* | UNKNOWN | Lien avec CAND-04, CAND-05 et CAND-08 à examiner |
| ENT-FACTORY-MAKER-ACADEMY | Factory Maker Academy | PROGRAM | Formation | Structures & Entités | — | DOCUMENTED_ONLY* | UNKNOWN | C-18 |
| ENT-KORA-ACADEMY | KORA Academy | PROGRAM | Formation | Structures & Entités | — | DOCUMENTED_ONLY* | UNKNOWN | C-18 |
| ENT-FREK-ACADEMY | FREK Academy | PROGRAM | Formation | Structures & Entités | — | DOCUMENTED_ONLY* | UNKNOWN | C-18 |

## 2. Éléments absents du registre (candidats)

| ID | Nom | Sources | Nature apparente | Statut | Notes |
|---|---|---|---|---|---|
| CAND-01 | CVLN Holding | SRC-04, SRC-05 (« La structure mère qui porte la vision et coordonne l’ensemble de l’écosystème ») ; SRC-23 (module Entités demandé avec CVLN Holding) ; SRC-24 (déclarée pré-chargée par l’agent de test) ; SRC-29 (type `holding`, l. 48) | Entité juridique ou de gouvernance ? | UNKNOWN | Absente du registre et du mandat, mais **déclarée pré-chargée dans la base de prévisualisation de Command Center** par l’agent de test (EV-P1-07 ; état actuel de la base inconnu) (C-04) |
| CAND-02 | Impact & Normes | SRC-04 | Pôle / programme ? | UNKNOWN | Disparu après `ec89531` ; aucune décision de retrait tracée (≠ DEPRECATED) |
| CAND-03 | Observatory | SRC-12 | Composant culturel / observation | UNKNOWN | Aucune autre source |
| CAND-04 | CVLN Hospitality | SRC-12 ; SRC-29 (« Hospitality », type `hospitality`, `server.py@31036ce:57`) | Activité | UNKNOWN | Présent dans la liste d’entités historique de Command Center ; identité avec « CVLN Hospitality » à confirmer |
| CAND-05 | CVL Culinary Innovations | SRC-12 ; SRC-29 (« CVL Culinary », type `food`, `server.py@31036ce:53`) | Activité / entité | UNKNOWN | Préfixe « CVL » (et non « CVLN ») également employé dans SRC-29 pour CVL Events, CVL Agro et CVL Academy : variante de nommage ou entités distinctes, à confirmer |
| CAND-06 | JCC | SRC-01 (doctrine), SRC-12 | Monnaie interne (doctrine) | DOCUMENTED_ONLY* | Doctrine sans entité ; requalification interdite sans preuve |
| CAND-07 | COEURVOLAN / Cœurvolan | SRC-10, SRC-12, `app/layout.js` | Nom fondateur, marque, alias de la Fondation ? | UNKNOWN | La vitrine distingue « COEURVOLAN inspire » de « CVLN construit » (C-09) |
| CAND-08 | CVL Events | SRC-29 (`server.py@31036ce:51`, type `events`) | Activité ? | UNKNOWN | Lien avec le pôle Events & Art de vivre à examiner |
| CAND-09 | CVL Agro | SRC-29 (`server.py@31036ce:52`, type `agriculture`) | Activité ? | UNKNOWN | Lien avec le pôle Agriculture & Terroir et Laurentia « terroir » (C-03) à examiner |
| CAND-10 | CIP | SRC-29 (`server.py@31036ce:56`, type `investment`) | Investissement ? | UNKNOWN | Sigle non développé ; aucune autre source |
| CAND-11 | Tokenomics | SRC-29 (`server.py@31036ce:58`, type `blockchain`) | Composant blockchain ? | UNKNOWN | Lien avec Wallet/JCC (R-17) à examiner |
| CAND-12 | Umbrella Trust | SRC-29 (`server.py@31036ce:59`, type `trust`) | Structure juridique faîtière ? | UNKNOWN | À rapprocher de la structure de tête (C-04) |

Pôles historiques, conservés comme **catégories** et non comme entités : Gouvernance, Fintech, Tech & Data, Média & Content, Éducation, Events / Events & Art de vivre, Agriculture & Terroir, Impact & Normes (SRC-04, SRC-05).

## 3. Composants techniques observés

| ID | Composant | Dépôt | Pile | Fonction observée | Implémentation | Opérationnel | Correspondance déclarée |
|---|---|---|---|---|---|---|---|
| TECH-01 | Vitrine « Fondation COEURVOLAN » + API du registre | SRC-R1 | Next.js 15.5.18, React 18.3.1, MongoDB | Site contemplatif ; API registre en lecture ; capture de contacts | IN_PROGRESS | **PARTIALLY_VERIFIED** : `validateRegistry()` réexécuté localement avec succès ; API et site non exécutés | Présentation de ENT-CVLN-FOUNDATION ; héberge SRC-01 |
| TECH-02 | Application CVLN Command Center v1.0 | SRC-R2 | FastAPI, React 19, MongoDB, JWT | Tableau de bord interne : authentification JWT + RBAC, vue d’ensemble, projets, tâches, finances, contacts CRM, événements, documents, KPI, entités, Board Pack ; administration des utilisateurs ; paramètres ; FR/EN | IN_PROGRESS | UNKNOWN (tests Emergent déclarés 44/44, non reproduits) | ENT-CVLN-COMMAND-CENTER (H-03 confirmée sur le nom et la fonction) |
| TECH-03 | Registre d’entités de Command Center | SRC-R2 (`/api/entities`, collection `entities`) | MongoDB | Entités opérationnelles (types proposés par l’interface `holding`/`studio`/`label`/`agency`/`other`, champ libre côté serveur), rattachement des projets | IN_PROGRESS | UNKNOWN | **Second registre, indépendant de SRC-01** (C-06) |
| TECH-04 | Évolutions demandées de Command Center (non réalisées) | SRC-R2 (SRC-23) | — | Journal des décisions, registre des risques, Kanban, automatisations (tâches, CRM, finance, événements, sauvegardes, notifications), journal d’audit, versionnement | DOCUMENTED_ONLY | — | HIST-07 à HIST-09 ; recoupe les registres de la mission (C-19) |

## 4. Fournisseurs et dépendances externes

| ID | Fournisseur | Utilisé par | Rôle observé | Souveraineté |
|---|---|---|---|---|
| EXT-01 | Emergent (emergent.sh / emergentagent.com) | TECH-01, TECH-02 | Génération du code, identité Git, images d’environnement, prévisualisations, tâches planifiées (TECH-01), agents de test | **Dépendance forte** : tous les commits d’origine (44) sont faits par l’agent Emergent |
| EXT-02 | MongoDB (instance inconnue ; `localhost` dans l’historique de Command Center) | TECH-01, TECH-02 | Persistance | Hébergeur inconnu |
| EXT-03 | Google Fonts | TECH-01, TECH-02 | Polices (Foundation : Cormorant Garamond, Inter ; Command Center : Rajdhani, DM Sans, JetBrains Mono, Inter) | Remplaçable |
| EXT-04 | GitHub | TECH-01, TECH-02 | Hébergement du code | Compte personnel `kimoune2025-a11y`, créé le 2026-08-31 |

## 5. Éléments manquants (à obtenir)

1. Le schéma ASCII original de l’architecture (SRC-X1), seule source pouvant trancher C-01.
2. Les dépôts ou emplacements des 22 composants nommés dans les 17 autres entrées du mandat §5, sans code accessible (D-02).
3. Les pièces juridiques : statuts, immatriculations, marques, contrats (SRC-X6).
4. La liste réelle des entités de la base Command Center (SRC-X5).
