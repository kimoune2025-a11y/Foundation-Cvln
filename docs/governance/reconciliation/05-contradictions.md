# 05 — Contradictions and Risks (Phase 3)

- **Mission :** CVLN-GOV-RECON-001
- **Phase :** 3 — Réconciliation et détection des contradictions
- **Date :** 2026-10-11
- **Statut :** DRAFT — aucune contradiction n’est résolue sans arbitrage

Chaque contradiction est accompagnée de ses preuves, de ses conséquences, d’une résolution **proposée** et, si nécessaire, d’une demande d’arbitrage.
Gravité : **Critique** (bloque la mission ou expose le groupe), **Haute**, **Moyenne**, **Faible**.

## 1. Contradictions

### C-01 — Le registre « décidé » repose sur une interprétation non validée · Critique

- **Constat :** le registre qualifie les 29 entités de `DECIDED` et les 28 `PART_OF` de `founding_architecture_tree`. Or l’auteur du TREE écrit en `362a81d` : « l’arborescence reflète mon interprétation de votre schéma ASCII (liens parent/enfant). À valider — ajustable facilement ». Il redemande la validation en `561ddf8`. Aucune validation n’est tracée avant le gel de la baseline (`886ac8c`).
- **Preuves :** EV-P1-09, EV-P0-06, SRC-01, SRC-03.
- **Conséquence :** la source canonique peut figer des rattachements que Laurent n’a jamais confirmés. Toute construction en aval (Intelligence OS, Command Center, gouvernance) hériterait de l’erreur.
- **Résolution proposée :** conserver le registre tel quel (PRESERVE). Obtenir le schéma ASCII original (SRC-X1) ou une validation écrite des 28 `PART_OF`. Tant que ce n’est pas fait, lire `DECIDED` comme « présent dans l’interprétation gelée », sans plus.
- **Arbitrage requis :** oui — Laurent CŒURVOLAN.

### C-02 — Deux définitions de FREKCORE · Haute

- **Constat :** FREKCORE est « La voix créative — sons, images et récits » (pôle Média & Content) en `124ec63`/`ec89531`/`2b02b2c`. Il devient « Identité · provenance · preuve » (Infrastructures) à partir de `362a81d`.
- **Preuves :** SRC-04, SRC-05, SRC-01.
- **Conséquence :** il peut s’agir d’un même nom pour deux réalités (une marque média et un protocole de preuve) ou d’une évolution de doctrine. Le risque porte sur la propriété intellectuelle et sur le positionnement.
- **Résolution proposée :** CORRECT par alias documenté si c’est une évolution ; ADD d’une entité distincte si ce sont deux réalités.
- **Arbitrage requis :** oui.

### C-03 — Trois définitions de Laurentia · Haute

- **Constat :** « La terre au cœur du projet. Cultiver, préserver… » (pôle Agriculture & Terroir, `2b02b2c`) ; « Agent · interface métier » (registre) ; « Opérateur IA et interface de travail personnelle et métier » (mandat §3).
- **Preuves :** SRC-05, SRC-01, SRC-12.
- **Conséquence :** confusion entre un projet agricole ou patrimonial et un agent IA ; le périmètre « personnel » du mandat n’apparaît pas au registre.
- **Résolution proposée :** déterminer s’il existe deux réalités (par exemple « Laurentia — terroir » et « Laurentia — opérateur IA »). Sinon, aligner le rôle déclaré sur la définition du mandat (CORRECT, après validation).
- **Arbitrage requis :** oui.

### C-04 — CVLN Holding existe dans l’historique et dans Command Center, mais pas dans le registre · Haute

- **Constat :** « CVLN Holding — la structure mère qui porte la vision et coordonne l’ensemble de l’écosystème » (`POLES`). Elle disparaît du TREE et du registre, mais elle est **pré-chargée comme entité de type `holding`** dans la base de Command Center.
- **Preuves :** SRC-04, SRC-05, SRC-23, EV-P1-07.
- **Conséquence :** la structure juridique de tête du groupe est ambiguë (Foundation ? Group ? Meta CVLN ? Holding distincte ?). C’est le point le plus structurant pour un groupe : il conditionne la détention des participations, de la propriété intellectuelle et la consolidation.
- **Résolution proposée :** ADD de `CVLN Holding` au registre **si** elle existe ou est décidée, avec une relation `OWNS` étayée par des pièces. Sinon, la documenter comme alias historique.
- **Arbitrage requis :** oui, avec pièces juridiques.

### C-05 — Command Center : sous-composant d’Intelligence OS au registre, application autonome dans la réalité · Moyenne

- **Constat :** au registre, `ENT-CVLN-COMMAND-CENTER PART_OF ENT-CVLN-INTELLIGENCE-OS` et `SUPERVISES` Group (inféré). Le code est une application de gestion autonome (FastAPI/React) : aucune dépendance à Intelligence OS ou Brain, et aucune lecture du registre. Historiquement, elle était rattachée au pôle Gouvernance.
- **Preuves :** SRC-01, OBS-07, OBS-08, SRC-04.
- **Conséquence :** la supervision du groupe est déclarée mais pas réalisée ; il n’y a aucun flux entre Command Center et le reste.
- **Résolution proposée :** KEEP du rattachement déclaré (vision) et requalification de `REL-0032` en relation cible non réalisée. Intégrer Command Center au registre canonique (voir C-06).
- **Arbitrage requis :** oui (rattachement).

### C-06 — Deux registres d’entités indépendants · Haute

- **Constat :** Foundation porte le registre canonique (29 entités, identifiants `ENT-*`, en code). Command Center possède son propre modèle d’entités (base de données, identifiants UUID, types `holding/studio/label/agency/other`). Aucun identifiant n’est partagé, aucune synchronisation n’existe.
- **Preuves :** SRC-01, EV-P1-07, OBS-07.
- **Conséquence :** dérive garantie entre les deux référentiels ; les finances et projets de Command Center sont rattachés à des entités hors du référentiel canonique.
- **Résolution proposée :** RESTRUCTURE (proposée) : Command Center référence les `entity_id` du registre canonique (lecture de `/api/registry/export`) au lieu de gérer ses propres entités. Migration douce, sans suppression.
- **Arbitrage requis :** oui (décision d’architecture).

### C-07 — Inscription de Command Center plus permissive que l’exigence · Critique (sécurité)

- **Constat :** le PRD exige une inscription limitée au rôle Viewer. Le code accorde des droits supérieurs à l’inscription publique.
- **Preuves :** EV-P1-04.
- **Conséquence :** des tiers peuvent créer ou modifier des données internes (finances, contacts, projets), sous réserve que l’application soit déployée et joignable.
- **Résolution proposée :** CORRECT — aligner le code sur l’exigence (Phase 6, dépôt Command-center).
- **Arbitrage requis :** non (l’exigence est déjà décidée). Le blocage est l’accès en écriture au dépôt.

### C-08 — Résumé de session Emergent obsolète · Faible

- **Constat :** `.emergent/summary.txt` (Command Center) indique « retour à la v1.0 non commencé » et « module Entités à faire ». Le PRD et le code montrent ces travaux réalisés.
- **Preuves :** EV-P1-11.
- **Conséquence :** un agent qui reprendrait le projet depuis ce résumé pourrait refaire ou casser des travaux terminés.
- **Résolution proposée :** CORRECT — marquer `summary.txt` comme historique ; le PRD et le code font foi.
- **Arbitrage requis :** non.

### C-09 — « CVLN Foundation », « Fondation COEURVOLAN », « Cœurvolan » · Moyenne

- **Constat :** le registre nomme la racine « CVLN Foundation » ; la vitrine dit « Fondation COEURVOLAN » et distingue « Là où COEURVOLAN inspire, CVLN construit » ; le mandat écrit « CVLN Foundation / Cœurvolan ». La racine est typée `LEGAL_ENTITY` sans pièce.
- **Preuves :** SRC-01, SRC-10, SRC-12.
- **Conséquence :** ambiguïté sur la dénomination légale, la marque et la séparation entre la vision (COEURVOLAN) et la structure (CVLN).
- **Résolution proposée :** EXTEND — champ `aliases` et `legal_status` au registre (schéma v1.1) ; dénomination légale à fournir.
- **Arbitrage requis :** oui.

### C-10 — Date de baseline antérieure à toute trace · Faible

- **Constat :** `BASELINE_DATE = 2025-06-15`. Le dépôt commence le 2026-07-25 et le TREE apparaît le 2026-08-31 ; la baseline est générée le 2026-08-31.
- **Preuves :** EV-P0-05, EV-P0-06.
- **Résolution proposée :** PRESERVE ; documenter la source si elle existe, sinon qualifier la date de « non sourcée » dans une baseline v2.
- **Arbitrage requis :** oui (source).

### C-11 — Tests déclarés réussis, non reproductibles · Haute

- **Constat :** « Tests 15/15 ✅ » (Foundation) et « 44/44 » (Command Center) sont produits par des agents Emergent contre des prévisualisations Emergent. Aucune CI, aucun test local.
- **Preuves :** SRC-07, SRC-24, EV-P0-02.
- **Conséquence :** aucune garantie actuelle ; un test unitaire ou de prévisualisation n’est pas une preuve d’exploitation (mandat §6).
- **Résolution proposée :** ADD d’un contrôle d’intégrité exécutable localement et en CI (Phase 6, réalisé pour le registre ; voir 08).
- **Arbitrage requis :** non.

### C-12 — Interface Intelligence OS annoncée, inexistante · Moyenne

- **Constat :** l’agent a écrit « Prêt au branchement : connectez CVLN Intelligence OS … sur `/api/registry/export` ». Aucun Intelligence OS n’existe dans le périmètre accessible. Le non-branchement était demandé.
- **Preuves :** EV-P1-10, OBS-09.
- **Résolution proposée :** KEEP (décision respectée) ; documenter `/api/registry/export` comme **contrat candidat**, pas comme intégration.
- **Arbitrage requis :** non.

### C-13 — Kiltikonet / Culture Connect / Observatory · Faible

- **Constat :** le mandat les regroupe ; le registre les sépare (Kiltikonet `PLATFORM` sous Entités Métier, Culture Connect `PROGRAM` sous Structures & Entités) ; Observatory est absent.
- **Résolution proposée :** clarifier s’il s’agit d’un seul écosystème ; ADD d’Observatory si confirmé.
- **Arbitrage requis :** oui.

### C-14 — Relations inférées superposées à la structure · Faible

- **Constat :** `REL-0029`, `REL-0030`, `REL-0031` (GOVERNS, sens inverse d’un `PART_OF`) et `REL-0033` (DEPENDS_ON, même sens qu’un `PART_OF`).
- **Conséquence :** la structure, la gouvernance et la dépendance sont mélangées, alors que le mandat §3 les distingue.
- **Résolution proposée :** les conserver avec leur marquage INFERRED ; les faire valider ou rejeter une par une.
- **Arbitrage requis :** oui (7 relations).

### C-17 — Factory Maker Studio : sous KORA (média) ou Tech & Data · Faible

- **Constat :** registre : `PART_OF KORA` ; historique : pôle Tech & Data ; Command Center : entité autonome pré-chargée.
- **Arbitrage requis :** oui.

### C-18 — Académies réparties sur deux branches · Faible

- **Constat :** CVLN Academy est sous Entités Métier ; Factory Maker Academy, KORA Academy et FREK Academy sont sous Structures & Entités. Aucune relation entre CVLN Academy et les trois autres.
- **Résolution proposée :** clarifier si CVLN Academy chapeaute les autres académies (relation à ajouter) ou non.
- **Arbitrage requis :** oui.

*(C-15 et C-16, envisagés pendant l’analyse, ont été fusionnés dans C-03 et R-17 ; les numéros ne sont pas réattribués.)*

## 2. Registre des risques (consolidé)

Les risques R-01 à R-12 sont décrits dans [00-scope-and-access.md](00-scope-and-access.md) §7.1. Ajouts de la Phase 1–3 :

| ID | Risque | Preuve | Gravité | Traitement |
|---|---|---|---|---|
| R-13 | Informations d’authentification et secrets applicatifs exposés dans le dépôt **public** Command-center (version courante et historique) | EV-P1-05, EV-P1-06 | **Critique** | Actions immédiates du propriétaire (voir 08, P0) ; détails transmis hors dépôt |
| R-14 | Inscription publique trop permissive dans Command Center | EV-P1-04 (C-07) | **Critique si déployé** | Correctif de code (P0/P1) |
| R-15 | Deux sources de vérité possibles : l’espace de travail Emergent et GitHub. Un commit poussé sur GitHub peut être écrasé ou entrer en conflit lors d’une prochaine synchronisation depuis Emergent | EV-P0-13, EV-P1-02 | Haute | Décider qui fait foi (proposé : GitHub) avant toute fusion sur `main` |
| R-16 | Données internes sensibles (finances, CRM, documents) gérées par une application dont le dépôt est public, sans CI ni revue | SRC-R2 | Haute | Dépôt privé, CI, revue |
| R-17 | Wallet / JCC / paiements : une activité de paiement ou de monnaie interne peut relever d’une réglementation (monnaie électronique, services de paiement, actifs numériques) quelle que soit la doctrine interne | SRC-01 (doctrine JCC) | Haute (avant toute mise en œuvre) | Analyse juridique préalable ; la doctrine reste inchangée |
| R-18 | Propriété intellectuelle non tracée (marques, noms, logiciels générés par un tiers, conditions d’Emergent sur la propriété du code) | SRC-X6, EXT-01 | Haute | Registre de PI ; revue des conditions Emergent |
| R-19 | Compte GitHub personnel unique pour tous les actifs logiciels, pas d’organisation | EV-P0-03 | Moyenne | Organisation GitHub du groupe |
