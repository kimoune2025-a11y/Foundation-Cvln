# 09 — Integration Matrix

- **Mission :** CVLN-GOV-RECON-001
- **Date :** 2026-10-12
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
| CVLN Intelligence OS, CVLN Brain, Agent Factory, Laurentia | — | `DOCUMENTED_ONLY` | Aucun dépôt ni API : rien à raccorder. Ne pas brancher Intelligence OS sur le registre sans décision (HIST-01) |
| FREKCORE, FREK ID, FREK Chain, FREK Formats, Proof Layer, CVLN Wallet | — | `DOCUMENTED_ONLY` | Aucun code. Wallet / JCC : analyse juridique préalable (R-17) |
| KORA, LabelOS, Factory Maker Studio, KiltikoNet, CVLN Academy | — | `DOCUMENTED_ONLY` | Aucun code |
| Structures & Entités (Culture Connect, Good Mood, …) | — | `DOCUMENTED_ONLY` | Entités, pas de logiciel |

## 3. Matrice des connexions

| # | De → vers | Contrat | Authentification / autorisation | Données | Tests | Niveau |
|---|---|---|---|---|---|---|
| X-01 | Command Center → Foundation : registre en direct | `GET {FOUNDATION_API_URL}/registry/export` ; contrôle `namespace = cvln`, `schema_version 1.x`, `validation.ok`, forme des entités et relations | Lecture publique côté Foundation ; déclenchement **admin** côté Command Center (`POST /api/entities/sync-registry`, `source=auto|live|snapshot`) | 32 entités (identifiant, nom, type, rôle, statut, rattachement `PART_OF`) → collection `entities` par `registry_id`. Entités sorties du registre **signalées, jamais supprimées** | `test_live_registry_sync_matches_foundation` (bout en bout, Foundation réelle) ; erreurs : Foundation injoignable → 502 explicite, URL absente → 502 | **Fusionné, testé** |
| X-02 | Command Center → Foundation : prospects du formulaire | `GET {FOUNDATION_API_URL}/contact` (liste JSON) | Jeton Bearer `FOUNDATION_CONTACT_TOKEN` = `CONTACT_ADMIN_TOKEN` de Foundation ; import **admin** (`POST /api/contacts/import-foundation`) | Nom, e-mail, message → contact de type `lead` ; une seule fois par message (registre `foundation_leads`, index unique ; un prospect supprimé n’est pas réimporté) | `test_contact_form_lead_reaches_command_center_once` (message posté sur Foundation → visible dans Command Center, 2ᵉ import sans doublon) ; mauvais jeton → 502 « HTTP 401 » ; jeton absent → 503 | **Fusionné, testé** |
| X-03 | Command Center : état des liaisons | `GET /api/integrations/status` (tout compte authentifié, aucun secret renvoyé) ; `POST /api/integrations/check` (admin) | JWT + RBAC existants | Configuration, dernier résultat de chaque liaison, écart instantané / Foundation | Tests d’API + parcours navigateur (Admin → Connexions Foundation) | **Fusionné, testé** |
| X-04 | Foundation `main` → instantané de Command Center (`backend/data/`) | `scripts/build_data.py` régénère `cvln-registry.json` et `governance-seed.json` depuis la baseline v2 et les documents 00, 05, 06 | — | Registre, 50 décisions, 19 risques | Job CI `foundation-integration`, étape « Snapshots match Foundation main » (`git diff --exit-code`) | **Fusionné, testé** |
| X-05 | Documents de mission → décisions et risques de Command Center | `POST /api/governance/import` (admin) depuis `governance-seed.json` | Admin | Décisions, risques par `ref` | `test_import_mission_governance_is_idempotent` | **Fusionné, testé** |
| X-06 | Navigateur → Command Center | nginx sert l’interface et relaie `/api` vers le backend (même origine) | JWT ; inscription publique fermée ; documents authentifiés | — | Tests d’API (49) ; parcours Playwright | **Fusionné, testé** ; **non déployé** |

Aucune connexion de Foundation vers Command Center : Command Center tire les données (sens unique), Foundation n’a besoin d’aucun accès au centre de pilotage, qui reste privé.

## 4. Raccordements absents et blocages

| Raccordement | Blocage | Détenteur | Débloque |
|---|---|---|---|
| Command Center ↔ Intelligence OS / Brain / Agent Factory / Laurentia | Aucun code ni contrat d’API pour ces composants | Laurent CŒURVOLAN (choix de construction) | Toute la couche IA |
| Déploiement de Command Center | Aucune infrastructure du groupe accessible depuis la session ; fusion ≠ déploiement autorisé | Laurent CŒURVOLAN | Niveaux « Déployé » et « Opérationnel » |
| Déploiement de Foundation | URL de production inconnue ; `FOUNDATION_API_URL` ne peut pas être renseignée | Laurent CŒURVOLAN | X-01 et X-02 en production |
| Jeton partagé X-02 | À générer (`openssl rand -hex 32`) et à poser des deux côtés, hors Git | Laurent CŒURVOLAN | Import des prospects |
| Protection de `main` (2 dépôts) | Paramètre du propriétaire | Laurent CŒURVOLAN | R-01 |
| Structure juridique (C-04) | Pièces juridiques | Laurent CŒURVOLAN | Statuts juridiques ; ne bloque pas les raccordements techniques |
| Autres dépôts de l’écosystème | Inexistants ou inaccessibles (R-19, D-02) | Laurent CŒURVOLAN | Phase 1 étendue |

## 5. Mise en service (ordre)

1. Déployer Foundation ; poser `CONTACT_ADMIN_TOKEN`.
2. Déployer Command Center (`deploy/.env.example` → `.env`) avec `FOUNDATION_API_URL` et `FOUNDATION_CONTACT_TOKEN` ; créer l’admin (`deploy/create_admin.py`).
3. Admin → Connexions Foundation → « Contrôler les connexions » : registre, instantané et contacts doivent être « OK ».
4. Synchroniser le registre, importer la gouvernance et les prospects.

## 6. Références Git

Voir `STATUS.md` §2 (mis à jour à chaque intégration).
