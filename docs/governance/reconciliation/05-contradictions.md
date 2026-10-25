# 05 — Contradictions and Risks (Phase 3)

- **Mission :** CVLN-GOV-RECON-001
- **Phase :** 3 — Réconciliation et détection des contradictions
- **Date :** 2026-10-11
- **Statut :** DRAFT — aucune contradiction n’est résolue sans arbitrage
- **Révision :** 2026-10-12 — contre-vérification adversariale (C-01, C-04, C-06, C-07, C-08, C-12, C-17, R-13, R-19)

Chaque contradiction est accompagnée de ses preuves, de ses conséquences, d’une résolution **proposée** et, si nécessaire, d’une demande d’arbitrage.
Gravité : **Critique** (bloque la mission ou expose le groupe), **Haute**, **Moyenne**, **Faible**.

## 0. Statut de résolution (2026-10-12, DEC-0010)

| ID | Statut | Résolution appliquée |
|---|---|---|
| C-01 | **Résolue** | Schéma original fourni (SRC-31) : 20 rattachements confirmés, 7 mises à jour validées (DEC-0008), 1 ambigu conservé ; champ `validation` dans la baseline v2 |
| C-02 | **Résolue** | FREKCORE = identité, provenance, preuve ; alias « FREK » (baseline v2) |
| C-03 | **Résolue** | Laurentia = « Opérateur IA · interface de travail personnelle et métier » (baseline v2) ; l’agriculture relève de CVL Agro (candidate) |
| C-04 | **Ouverte** | Existence juridique de CVLN Holding et détention des actifs : pièces nécessaires |
| C-05 | **Résolue** | Command Center reste sous Intelligence OS (schéma original) |
| C-06 | **Résolue** | Command Center synchronise le registre canonique (`registry_id`) ; une seule liste d’entités du groupe |
| C-07 | **Résolue** | Inscription fermée, fusionnée sur `main` de command-center (DEC-0006, DEC-0009) |
| C-08 | **Résolue** | `.emergent/summary.txt` traité comme historique ; le code et les registres font foi |
| C-09 | **Résolue** | Une entité, alias « Cœurvolan » et « Fondation COEURVOLAN » (baseline v2) ; statut juridique `UNKNOWN` |
| C-10 | **Résolue** | Date v1 conservée et qualifiée « non sourcée » ; baseline v2 datée du 2026-10-12 |
| C-11 | **Résolue** | CI d’intégrité du registre (Foundation) et CI de Command Center (branche `claude/cc-sovereign`) |
| C-12 | **Résolue** | Pas d’interface fictive : le branchement d’Intelligence OS reste une suggestion (HIST-01) |
| C-13 | **Résolue** | Observatory ajouté (baseline v2), avec Kiltikonet et Culture Connect comme écosystème culturel |
| C-14 | **Résolue** | Relations inférées conservées et marquées `INFERRED` |
| C-17 | **Résolue** | Factory Maker Studio reste sous KORA (registre) |
| C-18 | **Résolue** | CVLN Academy coordonne les trois académies (relations `GOVERNS` inférées, baseline v2) |
| C-19 | **Résolue** | Command Center porte le journal des décisions et le registre des risques, importés des documents de la mission |
| C-20 | **Tranchée** (DEC-0011) | Foundation = entités ; Meta CVLN = annuaire des services indexé par `ENT-*` ; Kiltikonet = structure interne |
| C-21 | **Tranchée** (DEC-0013) | Command Center de Kiltikonet = panneau interne du propriétaire, conservé sans renommage |
| C-22 | **Tranchée** (DEC-0012) | Baseline v3 autorisée (statuts d’implémentation constatés) |
| C-23 | **Tranchée** (DEC-0014) | Un dépôt de référence par brique ; les autres sont conservés comme versions antérieures |
| C-24 | **Tranchée** (DEC-0022) | Tous les agents restent en Production ; DEC-0017 amendée pour cette mise en production d’ensemble ; cycles toujours en `dry_run` |

## 1. Contradictions

### C-01 — Le registre « décidé » repose sur une interprétation dont la validation n’est pas tracée · Critique

- **Constat :** le registre qualifie les 29 entités de `DECIDED` et les 28 `PART_OF` de `founding_architecture_tree`. Or l’auteur du TREE écrit en `362a81d` : « l’arborescence reflète mon interprétation de votre schéma ASCII (liens parent/enfant). À valider — ajustable facilement ». Il redemande la validation en `561ddf8`. Aucune validation n’est tracée avant le gel de la baseline (`886ac8c`). Le commit `886ac8c` et l’en-tête du registre (`lib/registry/cvlnRegistry.js:6–11`, « RÈGLE ABSOLUE (mission CVLN Foundation v1) »), tous deux rédigés par l’agent Emergent, présentent la préservation du TREE comme une règle de la mission commandée : c’est un indice indirect que le TREE a été accepté, pas une validation explicite des 28 rattachements `PART_OF`.
- **Preuves :** EV-P1-09, EV-P0-06, SRC-01, SRC-03.
- **Conséquence :** la source canonique peut figer des rattachements que Laurent n’a jamais confirmés. Toute construction en aval (Intelligence OS, Command Center, gouvernance) hériterait de l’erreur.
- **Résolution proposée :** conserver le registre tel quel (PRESERVE). Obtenir le schéma ASCII original (SRC-X1) ou une validation écrite des 28 `PART_OF`. Tant que ce n’est pas fait, lire `DECIDED` comme « présent dans l’interprétation gelée », sans plus.
- **Mise à jour 2026-10-12 :** le schéma original a été fourni (SRC-31). L’interprétation de l’agent est **fidèle pour 20 rattachements sur 28** ; `REL-0006` est ambigu ; les 7 enfants de Structures & Entités ne figurent pas dans le schéma et proviennent d’une autre source non tracée (EV-P4-01). Le schéma étant déclaré obsolète (DEC-0007), le mandat fait référence.
- **Arbitrage requis :** tranché par défaut (06 §5).

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

- **Constat :** « CVLN Holding — la structure mère qui porte la vision et coordonne l’ensemble de l’écosystème » (`POLES`). Elle disparaît du TREE et du registre. Côté Command Center, l’utilisateur avait demandé un module Entités incluant CVLN Holding (`.emergent/summary.txt:43`) ; l’agent de test Emergent la déclare pré-chargée dans la base de prévisualisation lors du run du 2026-06-26 (`test_reports/iteration_3.json`, non reproduit) ; elle figurait aussi, avec le type `holding`, dans la liste codée en dur de l’API v1.2 retirée le 2026-02-06 (SRC-29). Le dépôt ne contient aucun code de pré-chargement et l’état actuel de la base est inconnu (SRC-X5). Les entités « CIP » (`investment`) et « Umbrella Trust » (`trust`) de cette même liste sont à rapprocher de la question de la structure de tête.
- **Preuves :** SRC-04, SRC-05, SRC-23, SRC-29, EV-P1-07, EV-P1-13.
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

- **Constat :** Foundation porte le registre canonique (29 entités, identifiants `ENT-*`, en code). Command Center possède son propre modèle d’entités : collection MongoDB `entities`, identifiants UUID (`backend/server.py:695`), champ `type` en chaîne libre côté API, sans validation, défaut `other` (`backend/server.py:213`) ; l’interface propose `holding/studio/label/agency/other` (`EntitiesPage.jsx:14–20`, `memory/PRD.md:128`). Une troisième liste, codée en dur, a existé brièvement (SRC-29). Aucun identifiant n’est partagé, aucune synchronisation n’existe.
- **Preuves :** SRC-01, EV-P1-07, OBS-07.
- **Conséquence :** dérive garantie entre les deux référentiels ; les finances et projets de Command Center sont rattachés à des entités hors du référentiel canonique.
- **Résolution proposée :** RESTRUCTURE (proposée) : Command Center référence les `entity_id` du registre canonique (lecture de `/api/registry/export`) au lieu de gérer ses propres entités. Migration douce, sans suppression.
- **Arbitrage requis :** oui (décision d’architecture).

### C-07 — Inscription de Command Center plus permissive que l’exigence · Critique (sécurité)

- **Constat :** le résumé de session Emergent (SRC-23, `.emergent/summary.txt:55` et `:184`) rapporte une demande de l’utilisateur, marquée « Completed », de limiter l’inscription au rôle Viewer ; le PRD (SRC-22) ne formule pas cette exigence. Le code accorde des droits supérieurs à l’inscription publique.
- **Preuves :** SRC-23, EV-P1-04, EV-P6-05.
- **Conséquence :** des tiers peuvent créer ou modifier des données internes (finances, contacts, projets), sous réserve que l’application soit déployée et joignable.
- **Résolution proposée :** CORRECT — aligner le code sur l’exigence. Réalisé sur une branche isolée (`command-center`, `claude/p6-registration-viewer-only`, `3e8d79c`), non fusionné ; voir 08 §1 et PROP-08.
- **Arbitrage requis :** non (l’exigence est déjà décidée). Écriture accordée le 2026-10-12 (DEC-0005) ; reste la fusion sur `main`, qui dépend de P1-1 / P1-2 (R-15).

### C-08 — Résumé de session Emergent obsolète · Faible

- **Constat :** `.emergent/summary.txt` (Command Center) indique « retour à la v1.0 non commencé » et « module Entités à faire ». Le PRD et le code montrent ces travaux réalisés.
- **Preuves :** EV-P1-11.
- **Conséquence :** un agent qui reprendrait le projet depuis ce résumé pourrait refaire ou casser des travaux terminés.
- **Résolution proposée :** CORRECT — marquer `summary.txt` comme historique ; le PRD et le code font foi. SRC-23, obsolète sur l’avancement, reste néanmoins la seule trace écrite de la demande d’inscription limitée au rôle Viewer (C-07).
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

### C-12 — Branchement d’Intelligence OS suggéré, non réalisé · Faible

- **Constat :** dans les actions suivantes proposées par `886ac8c`, l’agent suggère : « **Prêt au branchement** : Quand vous le déciderez, connectez CVLN Intelligence OS en lecture sur /api/registry/export pour consommer la source canonique ». Le même commit déclare « ✅ CVLN Intelligence OS NON branché (comme demandé) ». Il s’agit d’une suggestion conditionnelle, non de l’annonce d’une interface existante. CVLN Intelligence OS ne figure que comme entité déclarée du registre ; aucun système Intelligence OS n’existe dans le périmètre accessible.
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

- **Constat :** registre : `PART_OF KORA` ; historique : pôle Tech & Data ; Command Center : entité autonome, type `studio` dans la liste v1.2 (SRC-29), déclarée pré-chargée par l’agent de test (`iteration_3.json`, base de prévisualisation, 2026-06-26 ; non vérifiable, SRC-X5).
- **Arbitrage requis :** oui.

### C-18 — Académies réparties sur deux branches · Faible

- **Constat :** CVLN Academy est sous Entités Métier ; Factory Maker Academy, KORA Academy et FREK Academy sont sous Structures & Entités. Aucune relation entre CVLN Academy et les trois autres.
- **Résolution proposée :** clarifier si CVLN Academy chapeaute les autres académies (relation à ajouter) ou non.
- **Arbitrage requis :** oui.

### C-19 — Deux journaux de décisions et deux registres de risques en préparation · Moyenne

- **Constat :** tu as demandé à Command Center un journal des décisions et un registre des risques (HIST-07), non réalisés. La mission tient de son côté un journal des décisions (06) et un registre des risques (05) en Markdown dans Foundation-Cvln.
- **Conséquence :** risque de deux sources de vérité pour les décisions et les risques du groupe, comme pour les entités (C-06).
- **Résolution proposée :** EXTEND — faire de Command Center (privé, authentifié) le lieu d’exploitation des décisions, risques et preuves, alimenté par les registres de la mission ; la documentation publique ne garde que la gouvernance non sensible.
- **Arbitrage requis :** oui.

### C-20 — Plusieurs référentiels se présentent comme source centrale · Haute

- **Constat :** le registre de Foundation est le référentiel canonique du groupe (DEC-0010). Or Meta CVLN publie son propre annuaire de 12 entités comme « source unique » de l’écosystème (OBS-15) ; Kiltikonet déclare `kiltikonet_architecture.py` « source normative unique » de sa structure ; la spécification Intelligence OS contient un dossier `registry/`.
- **Preuves :** EV-P6-20, SRC-R7, SRC-R6, SRC-R16.
- **Conséquence :** sans partage des rôles, chaque brique construit sa vérité ; l’interconnexion du groupe se ferait sur des identifiants divergents.
- **Résolution proposée :** Foundation = entités et relations du groupe (`ENT-*`) ; Meta CVLN = **annuaire de services** (URL, contrat, authentification) indexé par `ENT-*` ; Kiltikonet = structure interne d’un produit. À valider.
- **Arbitrage requis :** oui.

### C-21 — Deux « Command Center » · Moyenne

- **Constat :** CVLN Command Center (TECH-02, pilotage privé du groupe) et le Command Center interne de Kiltikonet (`/command`, « pilotage central / gouvernance » de Kiltikonet).
- **Preuves :** SRC-R2, `Kiltikonet-Aout2026/ARCHITECTURE.md` §5.
- **Résolution proposée :** conserver les deux, renommer ou qualifier celui de Kiltikonet (« Kiltikonet Command ») ; le pilotage du groupe reste TECH-02.
- **Arbitrage requis :** oui.

### C-22 — Statuts « documenté uniquement » contredits par le code · Haute

- **Constat :** l’arbitrage par défaut D-02 et le registre (baseline v2) classent Agent Factory, FREKCORE, Laurentia, KORA, Kiltikonet, Academy et Meta CVLN comme sans code. Ces briques ont du code réel (EV-P6-20). FREKCORE est en outre déclaré **autorité d’identité** (FREK-ID) par Academy, Meta CVLN et Laurent.ia.
- **Preuves :** EV-P6-18, EV-P6-20.
- **Conséquence :** la vue Architecture de Command Center affiche un état d’implémentation faux.
- **Résolution proposée :** baseline v3 du registre mettant à jour `implementation_status` et `source_repositories` (PROP-03), sur décision ; la baseline v2 reste gelée en attendant.
- **Arbitrage requis :** oui (modification du registre).

### C-23 — Dépôts en double et dispersés · Moyenne

- **Constat :** Kiltikonet existe en 4 dépôts (SRC-R6, R11, R13, R15, dont 3 avec le même README « CC2026 ») ; Agent Factory en 2 (SRC-R3, R4) ; Meta CVLN en 2 (SRC-R7, R17) ; l’application iOS en 2 au même commit (SRC-R10, R16) ; 2 dépôts vides. 6 comptes GitHub.
- **Preuves :** EV-P6-18, EV-P6-20.
- **Résolution proposée :** désigner un dépôt canonique par brique, archiver les autres (sans suppression), regrouper dans une organisation GitHub du groupe (PROP-13).
- **Arbitrage requis :** oui.

### C-24 — Mise en production de tous les agents contre validation agent par agent · Critique

- **Constat :** Agent Factory exécute au démarrage `production_rollout.py`, décision `DEC-2026-10-22-PROD-ALL` (commits `0582f4b`, 2026-10-22 20:57 UTC, et `553adbb`), qui promeut en Production l'ensemble des agents CVLN (socle, main-d'œuvre FREK, inventaire maître, registres Meta CVLN et Laurent.ia) et déroge explicitement à « jamais de promotion en masse ». Les journaux Render du 2026-10-23 01:47 UTC indiquent « Mise en production DEC-2026-10-22-PROD-ALL déjà appliquée ». DEC-0017, validée le même jour, dispose : « Toute mise en production demeure soumise à mon approbation explicite, agent par agent. » `DEC-2026-10-22-PROD-ALL` ne figure pas dans ce journal (06).
- **Atténuation constatée :** les cycles restent en `dry_run` ; portes de permission et escalade inchangées (docstring du module). Non vérifié en base.
- **Preuves :** EV-P6-28.
- **Résolution proposée :** Laurent indique laquelle des deux fait foi. Si DEC-0017 : ramener les agents promus sans approbation individuelle à leur statut antérieur, par une migration tracée, sans suppression. Si `DEC-2026-10-22-PROD-ALL` : l'inscrire dans 06 et amender DEC-0017.
- **Arbitrage :** tranchée le 2026-10-25 par DEC-0022 (« Tous en production »).

*(C-15 et C-16, envisagés pendant l’analyse, ont été fusionnés dans C-03 et R-17 ; les numéros ne sont pas réattribués.)*

## 2. Registre des risques (consolidé)

Les risques R-01 à R-12 sont décrits dans [00-scope-and-access.md](00-scope-and-access.md) §7.1. Ajouts de la Phase 1–3 :

| ID | Risque | Preuve | Gravité | Traitement |
|---|---|---|---|---|
| R-13 | Informations d’authentification d’un compte à privilèges en clair dans des fichiers suivis du dépôt **public** Command-center (version courante de `main`), et secrets de signature des sessions présents dans l’historique public | EV-P1-05, EV-P1-06, EV-P6-08 | **Critique** | Actions immédiates du propriétaire (voir 08, P0) ; détails transmis hors dépôt |
| R-14 | Inscription publique trop permissive dans Command Center | EV-P1-04 (C-07) | **Critique si déployé** | Correctif de code (P0/P1) |
| R-15 | Deux sources de vérité possibles : l’espace de travail Emergent et GitHub. Un commit poussé sur GitHub peut être écrasé ou entrer en conflit lors d’une prochaine synchronisation depuis Emergent | EV-P0-13, EV-P1-02 | Haute | Décider qui fait foi (proposé : GitHub) avant toute fusion sur `main` |
| R-16 | Données internes sensibles (finances, CRM, documents) gérées par une application dont le dépôt est public, sans CI ni revue | SRC-R2 | Haute | Dépôt privé, CI, revue |
| R-17 | Wallet / JCC / paiements : une activité de paiement ou de monnaie interne peut relever d’une réglementation (monnaie électronique, services de paiement, actifs numériques) quelle que soit la doctrine interne | SRC-01 (doctrine JCC) | Haute (avant toute mise en œuvre) | Analyse juridique préalable ; la doctrine reste inchangée |
| R-18 | Propriété intellectuelle non tracée (marques, noms, logiciels générés par un tiers, conditions d’Emergent sur la propriété du code) | SRC-X6, EXT-01 | Haute | Registre de PI ; revue des conditions Emergent |
| R-19 | Les deux seuls dépôts connus sont hébergés sur un compte GitHub personnel (`kimoune2025-a11y`, créé le 2026-08-31) et non dans une organisation ; aucune organisation du groupe n’a été identifiée dans le périmètre accessible, sans que leur absence ait été vérifiée ; l’emplacement des autres actifs logiciels reste inconnu (D-02) | EV-P0-03 | Moyenne | Organisation GitHub du groupe |
| R-20 | Fichiers d’identifiants ou de clé suivis dans Git : `memory/test_credentials.md` (SRC-R5, SRC-R9, privés) ; `backend/.keys/export_ed25519.key` (SRC-R16, **public**, et son miroir SRC-R10) — **confirmé : clé privée Ed25519 de signature des dossiers de preuve** (EV-P6-24) ; toute signature faite avec elle est falsifiable | EV-P6-20 | **Critique** (dépôt public) | Le propriétaire vérifie ; si la clé est privée : la révoquer et la remplacer, retirer le fichier du suivi (l’historique Git la conserve) |
| R-21 | Dépendance persistante à Emergent dans Kiltikonet (clé LLM, stockage d’objets ; ~50 fichiers) et ses versions antérieures | EV-P6-20 | Moyenne | Plan de sortie, comme pour Command Center et KORA |
| R-22 | Agent Factory : les `scopes` des jetons de service sont stockés mais jamais vérifiés ; tout jeton d’agent peut écrire finances, connaissances, etc. | [audit 2026-10-20](audits/2026-10-20-api-security-audit.md) | Moyenne | Décision sur un contrôle de droit par route (comme `require_scope` de Command Center) |
| R-23 | Portail documentaire iOS : aucune authentification sur l’API (dont `POST /api/docs/anchor/*`, qui écrit sur disque et appelle des calendriers externes) ; CORS `*` avec identifiants | [audit 2026-10-20](audits/2026-10-20-api-security-audit.md) | Moyenne | Décider s’il est exposé publiquement ; sinon jeton d’accès |
| R-24 | Formulaires publics sans limite de débit : `POST /api/contact` (Foundation, importé ensuite dans Command Center), `POST /api/status` hérité du modèle (Laurent.ia, iOS) | [audit 2026-10-20](audits/2026-10-20-api-security-audit.md) | Basse | Limite par IP, retrait des routes de modèle |
| R-25 | KORA : `POST /api/ads/reward` accorde 60 min sans publicité sans preuve de visionnage ; `POST /api/ads/check-gating` révèle le statut premium d’un identifiant | [audit 2026-10-20](audits/2026-10-20-api-security-audit.md) | Basse | Vérification côté régie (SSV) ; statut lu depuis le jeton |
| R-26 | Verrouillage par adresse e-mail (Command Center, Agent Factory, Academy) : un tiers peut bloquer un compte 15 min | [audit 2026-10-20](audits/2026-10-20-api-security-audit.md) | Basse | Accepté en l’état ; à revoir avec une limite par IP fiable |
| R-27 | CVL Academy présentait sur sa page d’accueil la marque **Qualiopi** (« processus certifié — République Française ») sans aucune preuve de certification enregistrée, avec des logos Afdas et France Travail, image hébergée sur le site d’une autre entreprise ; l’API publique et le MCP servaient en outre les références RNCP de calibration, lisibles comme une certification de la formation. Risque d’allégation trompeuse et d’usage non autorisé de marques | [audit 2026-10-20](audits/2026-10-20-api-security-audit.md) (DEC-0018) | **Haute** | Corrigé sur `CVL-ACADEMY` `claude/stoic-babbage-2eimmr` ; réafficher une certification seulement avec une preuve complète (`external_certification`) |
| R-28 | Dépendances avec failles connues dans les backends du groupe (`pip-audit`, 2026-10-23) : FREKCORE 244, Laurent.ia 244, Agent Factory 103, Command Center 22, Meta CVLN 21, Kiltikonet 14, Academy 7, Cvln-ios 7 ; Foundation : Next.js 15.5.18 (critique). Aucun PHP dans le groupe (PHP2Shell, CVE-2026-109618/109619, sans effet) | EV-P6-28 | Haute | Correctifs fusionnés dans les 9 dépôts ; `pip-audit` / `npm audit` désormais en CI ; reste tailwindcss 3 (Foundation, outils de build) |
| R-29 | CI GitHub Actions du compte `cultureconnectorg` sans machine (quota) depuis le 2026-10-22 : DEC-0015 inapplicable sur 6 dépôts ; fusions faites sur vérifications locales par dérogation du fondateur (2026-10-25) | EV-P6-28 | Haute | Rétablir le quota ; relancer les CI sur `main` des dépôts concernés |
