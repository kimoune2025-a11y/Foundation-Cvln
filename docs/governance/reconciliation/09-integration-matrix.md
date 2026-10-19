# 09 — Integration Matrix

- **Mission :** CVLN-GOV-RECON-001
- **Date :** 2026-10-12 (mise à jour 2026-10-18)
- **Statut :** vivant — décrit les connexions **réellement codées et testées**, pas les connexions souhaitées
- **Architecture de référence :** registre canonique (baseline v2) ; Command Center sous CVLN Intelligence OS (DEC-0010), outil privé de pilotage (DEC-0006), autonome vis-à-vis d’Emergent (EV-P6-12)

Échelle utilisée pour chaque composant et chaque connexion :

| Niveau | Signification | Preuve exigée |
|---|---|---|
| **Présent** | Code dans une branche | Commit |
| **Fusionné** | Code sur `main` | Commit sur `main` |
| **Testé** | Test d’intégration réel exécuté, résultat connu | Exécution locale ou CI |
| **Déployé** | Service en ligne sur une infrastructure du groupe | URL et version observées |
| **Opérationnel** | Déployé, configuré et utilisé | Journaux ou résultat observé en production |

## 1. Inventaire des dépôts accessibles (2026-10-12)

`list_repos` ne renvoie que deux dépôts (compte personnel `kimoune2025-a11y`, R-19). Aucun autre composant de l’écosystème n’a de code connu.

| Dépôt | Visibilité | `main` | CI sur `main` | Pile | Dépendances externes |
|---|---|---|---|---|---|
| Foundation-Cvln (TECH-01) | Public | voir §6 | `Registry integrity` | Next.js 15.5.18, React 18, MongoDB | MongoDB (EXT-02), Google Fonts (EXT-03) |
| command-center (TECH-02) | Privé | voir §6 | `CI` : backend, frontend, docker, foundation-integration | FastAPI, React 19 (CRA/craco), MongoDB, nginx, Docker Compose | MongoDB (auto-hébergé), Google Fonts (EXT-03), API Foundation |

Branches restantes après intégration : voir §6. Aucun fichier de verrouillage n’est suivi dans Foundation (R-06) ; Command Center suit `frontend/yarn.lock`.

## 2. Composants de l’architecture et état technique

| Composant (registre) | Code | Niveau atteint | Commentaire |
|---|---|---|---|
| Registre canonique (`lib/registry`, Foundation) | Foundation | **Fusionné, testé** (CI d’intégrité) | Source unique des 32 entités et 41 relations |
| API du registre `/api/registry/*`, `/api/entities`, `/api/relations` | Foundation | **Fusionné, testé** (consommé par la CI de Command Center) | Lecture publique, sans écriture |
| Formulaire de contact `/api/contact` | Foundation | **Fusionné, testé** | `POST` public borné ; `GET` réservé au jeton `CONTACT_ADMIN_TOKEN` |
| CVLN Command Center (`ENT-CVLN-COMMAND-CENTER`, sous `ENT-CVLN-INTELLIGENCE-OS`) | command-center | **Fusionné, testé** ; **non déployé** à la connaissance de la mission | Pile Docker auto-hébergée prête (`docker compose up -d --build`) |
| CVLN Agent Factory (TECH-05) | SRC-R3 | **Présent** ; mise en ligne Render en échec (EV-P6-19) | API réelle (158 routes) ; **non raccordée au registre** |
| Laurent.ia (TECH-09) | SRC-R8 | **Présent** ; service Render documenté, non observé | API de briefing protégée par clé |
| FREKCORE (TECH-06) | SRC-R5 | **Présent** ; contrat OpenAPI versionné | Autorité d’identité FREK-ID déclarée (C-22) |
| CVLN Academy (TECH-12), Kiltikonet (TECH-07), Meta CVLN (TECH-08), KORA (TECH-10) | SRC-R12, R6, R7, R9 | **Présent** | Voir [02](02-entity-inventory.md) §3 |
| CVLN Intelligence OS (TECH-11), CVLN Brain | SRC-R16 (spécification) | `DOCUMENTED` | Spécification de 161 fichiers, pas d’application. Ne pas brancher Intelligence OS sur le registre sans décision (HIST-01) |
| FREK Chain, FREK Formats, CVLN Wallet | — | Non examiné séparément | Mini-wallet JCC présent dans Kiltikonet et Academy ; analyse juridique préalable (R-17) |
| LabelOS, Factory Maker Studio | — | `DOCUMENTED_ONLY` | Aucun dépôt identifié |
| Structures & Entités (Culture Connect, Good Mood, …) | — | `DOCUMENTED_ONLY` | Entités, pas de logiciel |

## 3. Matrice des connexions

| # | De → vers | Contrat | Authentification / autorisation | Données | Tests | Niveau |
|---|---|---|---|---|---|---|
| X-01 | Command Center → Foundation : registre en direct | `GET {FOUNDATION_API_URL}/registry/export` ; contrôle `namespace = cvln`, `schema_version 1.x`, `validation.ok`, forme des entités et relations | Lecture publique côté Foundation ; déclenchement **admin** côté Command Center (`POST /api/entities/sync-registry`, `source=auto|live|snapshot`) | 32 entités (identifiant, nom, type, rôle, statut, rattachement `PART_OF`) → collection `entities` par `registry_id`. Entités sorties du registre **signalées, jamais supprimées** | `test_live_registry_sync_matches_foundation` (bout en bout, Foundation réelle) ; erreurs : Foundation injoignable → 502 explicite, URL absente → 502 | **Fusionné, testé** |
| X-02 | Command Center → Foundation : prospects du formulaire | `GET {FOUNDATION_API_URL}/contact` (liste JSON) | Jeton Bearer `FOUNDATION_CONTACT_TOKEN` = `CONTACT_ADMIN_TOKEN` de Foundation ; import **admin** (`POST /api/contacts/import-foundation`) | Nom, e-mail, message → contact de type `lead` ; une seule fois par message (registre `foundation_leads`, index unique ; un prospect supprimé n’est pas réimporté) | `test_contact_form_lead_reaches_command_center_once` (message posté sur Foundation → visible dans Command Center, 2ᵉ import sans doublon) ; mauvais jeton → 502 « HTTP 401 » ; jeton absent → 503 | **Fusionné, testé** |
| X-03 | Command Center : état des liaisons | `GET /api/integrations/status` (tout compte authentifié, aucun secret renvoyé) ; `POST /api/integrations/check` (admin) | JWT + RBAC existants | Configuration, dernier résultat de chaque liaison, écart instantané / Foundation | Tests d’API + parcours navigateur (Admin → Connexions Foundation) | **Fusionné, testé** |
| X-04 | Foundation `main` → instantané de Command Center (`backend/data/`) | `scripts/build_data.py` régénère `cvln-registry.json` et `governance-seed.json` depuis la baseline v2 et les documents 00, 05, 06 | — | Registre, 50 décisions, 19 risques | Job CI `foundation-integration`, étape « Snapshots match Foundation main » (`git diff --exit-code`) | **Fusionné, testé** |
| X-05 | Documents de mission → décisions et risques de Command Center | `POST /api/governance/import` (admin) depuis `governance-seed.json` | Admin | Décisions, risques par `ref` | `test_import_mission_governance_is_idempotent` | **Fusionné, testé** |
| X-07 | Registre → vue « Architecture » de Command Center | Chaque synchronisation remplace le miroir en lecture seule des 41 relations (`registry_relations`) ; `GET /api/registry/architecture` | Tout compte authentifié (lecture) ; synchronisation admin | Arborescence des 32 composants, statut d’implémentation et d’architecture, relations `GOVERNS` / `SUPERVISES` / `DEPENDS_ON` / `PROVIDES`, projets rattachés | `test_architecture_mirrors_the_registry` (racine unique Foundation, Command Center sous Intelligence OS, `SUPERVISES` vers le groupe) ; parcours navigateur | **Fusionné, testé** |
| X-08 | Synchronisation automatique Command Center ← Foundation | Au démarrage puis toutes les `FOUNDATION_SYNC_INTERVAL` secondes (3600 par défaut, `0` = désactivée), dès que `FOUNDATION_API_URL` est renseignée : registre puis prospects | Processus serveur (`system:scheduler`), aucun compte humain | Comme X-01 et X-02 ; résultat consigné et affiché | `test_scheduler_syncs_without_anyone_clicking` ; base vide remplie seule au démarrage (32 entités) | **Fusionné, testé** |
| X-06 | Navigateur → Command Center | nginx sert l’interface et relaie `/api` vers le backend (même origine) | JWT ; inscription publique fermée ; documents authentifiés | — | Tests d’API (49) ; parcours Playwright | **Fusionné, testé** ; **non déployé** |

**Connexions entre les autres briques (2026-10-18, survol, EV-P6-20)** — elles existent hors du périmètre testé par la mission :

| # | De → vers | Contrat | Niveau |
|---|---|---|---|
| X-09 | Academy → Command Center | `POST /api/academy/{événement}`, compte de service `events:academy` | **Présent** des deux côtés (Command Center : sur `main`) ; non testé de bout en bout |
| X-10 | Academy → FREKCORE | FREK-ID : `POST /api/v1/auth/token` puis émission du FREK-ID | Présent (code Academy) ; non testé |
| X-11 | Academy → Agent Factory | Orchestration de missions, jeton de service | Présent (code Academy) ; non testé |
| X-12 | Meta CVLN → Laurent.ia | `POST /api/briefing`, `X-API-Key` | Documenté ; non testé |
| X-13 | Laurent.ia → FREKCORE / Kiltikonet | Validation FREK-ID | Présent (variable dans le code) ; non testé |
| X-14 | Annuaire Meta CVLN → registre Foundation | Champ `registry_id` (`ENT-*`) sur chaque entrée de l’annuaire (DEC-0011) | **Présent** (branche `Metacvln-Sept2026@claude/nifty-hopper-b9n258`) ; ancrage par identifiant, sans appel réseau |
| X-15 | Academy → registre Foundation | `GET {CVLN_REGISTRY_URL}/registry/export` ; contrôle namespace, schéma 1.x, validation, présence d’`ENT-CVLN-ACADEMY` ; `GET /api/integrations/registry` (admin) | **Présent, testé** (8 tests simulés) ; branche `claude/nifty-hopper-b9n258`, non fusionnée (CI du compte bloquée) |
| X-16 | Agent Factory → registre Foundation | Même contrat ; `GET /api/cvln-registry` et `/api/cvln-registry/check` ; `registry_id` sur ses entités | **Fusionné, testé** (11 tests simulés ; `a64ccac`) |
| X-17 | Laurent.ia → registre Foundation | `CVLN_REGISTRY_BASE_URL` + `CVLN_REGISTRY_ALLOWED_HOSTS` ; `GET /api/admin/cvln-registry` (founder/admin) | **Fusionné, testé** (CI verte ; `Laurent.ia@25c68d1`, cultureconnectorg/Laurent.ia#45) |
| X-18 | FREKCORE → registre Foundation | `GET /api/v1/ecosystem/group-registry` ; `registry_id` dans `ecosystem/registry.json` | **Présent, testé** (8 tests simulés) ; branche — **CI bloquée** (compte `cultureconnectorg`), non fusionnée |
| X-19 | KORA → registre Foundation | `GET /api/cvln-registry` (admin) | **Fusionné, testé** (KORA CI verte ; `Kora-app@39adfe4`, kora2024/Kora-app#14) |
| X-20 | Kiltikonet → registre Foundation | `GET /api/kiltikonet-code/group-registry` ; annuaire de secours ancré sur `ENT-*` | **Présent, testé** (9 tests simulés) ; branche — **CI bloquée** (cultureconnectorg/Kiltikonet-Aout2026#457), non fusionnée |
| X-21 | KORA Studio (interne) → catalogue public KORA | `/api/studio/*` (admin) → `works` → `/api/streaming/*` (sessions signées, Range, écoutes) ; application Expo branchée | **Présent, testé** (54/54, parcours navigateur ; EV-P6-26) ; kora2024/Kora-app#15, `34aa9c0` — **CI verte** (`backend`, run 39142600481) ; 3 constats de relecture Codex corrigés ; non fusionnée, non déployée |
| X-22 | Écoutes rémunérables KORA → CVE → relevés de redevances (LabelOS) | `plays` → `cve_allocation` (θ publié) → `/api/studio/royalties/runs` → `royalty_statements` + `cve_records` → `/api/creators/royalties` | **Fusionné** (#15, prorata/centré auditeur) ; **CVE fusionnée, testée** (kora2024/Kora-app#16, `05a6766`) ; aucun paiement |
| X-23 | KORA Studio / streaming → KORA Vault → répliques (disque, S3/R2) | `services/vault.py` ; empreinte publique `/api/streaming/works/{id}/fingerprint` (ancrage FREKCORE possible, non branché) | **Fusionné, testé** (EV-P6-28, `05a6766`) ; non déployé ; S3 réel non vérifié |
| X-24 | KORA → FREKCORE (événements d’écoute, score FREK) | Écoute comptée → `frekcore_outbox` → `POST /api/core/ingest` (Bearer `FREKCORE_SECRET_KORA`, `source: "kora"`, actions `PRESENCE_KORA` / `STREAM_KORA`) ; profil créateur ← `GET /api/core/frek/{frek_id}` (DEC-0020) | **Présent, testé** (8 tests simulés contre le contrat lu dans `frekcoreAout2026@5d1d570`, `backend/core/routes.py`) ; kora2024/Kora-app#32 (`48e7331`), non fusionnée ; aucun appel réel : FREKCORE en ligne sur Render (EV-P6-41), `kora-api` non déployé, secret non posé ; points à 0 tant que FREKCORE n’a pas de règle pour ces actions |
| X-25 | KORA (GitHub Actions) → Agent Factory (cycle autonome) | `GET /api/autonomous/mode` puis `POST /api/autonomous/cycle`, jeton `svc_…` de AGT-000 ; cycle sauté sans secrets (DEC-0020) | **Présent** (YAML réparé, étapes vérifiées par `bash -n`) ; kora2024/Kora-app#32, non fusionnée ; non testé contre une instance réelle (Agent Factory non déployé, EV-P6-19) |

Contrat commun (X-15 à X-20) : lecture seule et publique de `/api/registry/export`, sans identifiant ; échec explicite si l’espace de noms n’est pas `cvln`, si le schéma n’est pas 1.x, si la validation échoue ou si l’identifiant attendu manque ; rien n’est appelé au démarrage. Les 7 briques de référence (DEC-0014) parlent le même langage d’identifiants ; la liaison réelle attend le déploiement de Foundation.

Lecture : l’écosystème s’interconnecte déjà **autour de FREK-ID (identité)** et d’Agent Factory (exécution), mais **sans référentiel commun d’entités**.

Aucune connexion de Foundation vers Command Center : Command Center tire les données (sens unique), Foundation n’a besoin d’aucun accès au centre de pilotage, qui reste privé.

## 4. Raccordements absents et blocages

| Raccordement | Blocage | Détenteur | Débloque |
|---|---|---|---|
| Command Center ↔ Intelligence OS / Brain / Agent Factory / Laurentia | Aucun code ni contrat d’API pour ces composants | Laurent CŒURVOLAN (choix de construction) | Toute la couche IA |
| Déploiement de Command Center | Aucune mise en ligne observée (EV-P6-17 attribué à tort, corrigé par EV-P6-19). Guide Render prêt (`deploy/RENDER.md`, branche `claude/nifty-hopper-b9n258`) ; disque Render éphémère pour les documents | Laurent CŒURVOLAN | Niveaux « Déployé » et « Opérationnel » |
| Déploiement de Foundation | URL de production inconnue ; `FOUNDATION_API_URL` ne peut pas être renseignée | Laurent CŒURVOLAN | X-01 et X-02 en production |
| Jeton partagé X-02 | À générer (`openssl rand -hex 32`) et à poser des deux côtés, hors Git | Laurent CŒURVOLAN | Import des prospects |
| Protection de `main` (2 dépôts) | Paramètre du propriétaire | Laurent CŒURVOLAN | R-01 |
| Structure juridique (C-04) | Pièces juridiques | Laurent CŒURVOLAN | Statuts juridiques ; ne bloque pas les raccordements techniques |
| Mise en ligne d’Agent Factory | Échec au démarrage sur Render : identifiants Atlas refusés (EV-P6-19) | Laurent CŒURVOLAN (`MONGO_URL` dans Render) | Couche d’exécution IA |
| Raccordement des autres briques au registre | Aucun client du registre hors Command Center (OBS-16) ; rôles des référentiels à arbitrer (C-20) ; registre à mettre à jour (C-22) | Laurent CŒURVOLAN (arbitrage) | Référentiel commun du groupe |

## 5. Mise en service (ordre)

1. Déployer Foundation ; poser `CONTACT_ADMIN_TOKEN`.
2. Déployer Command Center (`deploy/.env.example` → `.env`) avec `FOUNDATION_API_URL` et `FOUNDATION_CONTACT_TOKEN` ; créer l’admin (`deploy/create_admin.py`).
3. Admin → Connexions Foundation → « Contrôler les connexions » : registre, instantané et contacts doivent être « OK ».
4. Synchroniser le registre, importer la gouvernance et les prospects.

## 6. Références Git

Voir `STATUS.md` §2 (mis à jour à chaque intégration).
