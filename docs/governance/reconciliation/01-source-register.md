# 01 — Source Register (Phase 1)

- **Mission :** CVLN-GOV-RECON-001
- **Phase :** 1 — Inventaire exhaustif
- **Date :** 2026-10-11
- **Statut :** DRAFT — périmètre accessible couvert, écosystème partiellement couvert
- **Révision :** 2026-10-12 — contre-vérification adversariale (SRC-R2, SRC-21, SRC-23 à SRC-25, ajout de SRC-29 et SRC-30, §3)

Chaque source est identifiée par un identifiant `SRC-xx` stable, réutilisé dans les autres documents.
Une source n’est **jamais** une preuve de réalité opérationnelle par elle-même : elle prouve seulement ce qu’elle contient.

## 1. Dépôts Git

| ID | Dépôt | URL | Visibilité / accès | Branche par défaut | HEAD audité | Commits | Couverture |
|---|---|---|---|---|---|---|---|
| SRC-R1 | kimoune2025-a11y/Foundation-Cvln | https://github.com/kimoune2025-a11y/Foundation-Cvln | Public ; lecture + écriture (session) | `main` (non protégée) | `main@886ac8c` + `claude/elegant-pascal-b0qe12` | 8 sur `main` (+ commits de mission) | **Complète** (code, historique, configuration) |
| SRC-R2 | kimoune2025-a11y/command-center | https://github.com/kimoune2025-a11y/Command-center | Public ; lecture seule au 2026-10-11 (EV-P1-01) ; écriture autorisée le 2026-10-12 (DEC-0005, EV-P6-01), utilisée uniquement sur la branche isolée `claude/p6-registration-viewer-only`, sans fusion sur `main` | `main` | `main@f9a61cc` | 36 (2026-02-05 → 2026-08-31) | **Complète en lecture** (code, historique, rapports de test), y compris le code v1.2 retiré (`31036ce`, SRC-29) ; protection de branche non inspectée |

Aucun autre dépôt n’est visible depuis la session (`list_repos` : 2 dépôts ; `get_me` : `public_repos: 2`). Cela n’exclut pas des dépôts privés non autorisés pour l’application Claude, ni des dépôts situés sur d’autres comptes ou organisations. Voir [00-scope-and-access.md](00-scope-and-access.md) §6.

## 2. Sources documentaires et techniques

### 2.1 Foundation-Cvln (SRC-R1)

| ID | Source | Référence | Nature | Fiabilité |
|---|---|---|---|---|
| SRC-01 | Registre canonique | `lib/registry/cvlnRegistry.js@886ac8c` | Code — structure déclarée, 29 entités, 35 relations, doctrine JCC | Fidèle au TREE (prouvé) ; validation par Laurent non tracée (C-01) |
| SRC-02 | Snapshot baseline v1 | `lib/registry/baseline/foundation-baseline-v1.json@886ac8c` | Données gelées | Identique à SRC-01 (prouvé) |
| SRC-03 | TREE codé en dur | `app/page.js@4b31821` (introduit en `362a81d`) | Code UI | Source de SRC-01 ; qualifié « interprétation à valider » par son auteur (SRC-06) |
| SRC-04 | Représentation `POLES` (v1) | `app/page.js@124ec63`, `@ec89531` | Code UI historique | Historique ; statut décisionnel inconnu |
| SRC-05 | Représentation `POLES` (v2) | `app/page.js@2b02b2c` | Code UI historique | Historique ; statut décisionnel inconnu |
| SRC-06 | Messages de commit (agent Emergent) | `362a81d`, `561ddf8`, `4b31821`, `886ac8c` | Journal de travail | Déclaratif ; contient des traces de décisions et de demandes de validation |
| SRC-07 | Journal de tests Emergent | `test_result.md@886ac8c` | Déclaratif (agent de test) | Non reproduit |
| SRC-08 | Suite de tests HTTP | `backend_test.py@886ac8c` | Code de test (cible distante) | Non exécutée (écritures + hôte bloqué) |
| SRC-09 | API | `app/api/[[...path]]/route.js@886ac8c` | Code | Lu intégralement |
| SRC-10 | Textes de la vitrine | `app/page.js@886ac8c` (`QUESTIONS`), `app/layout.js` | Contenu éditorial | Déclaratif (vision) |
| SRC-11 | Configuration Emergent | `.emergent/**`, `.gitconfig` | Configuration plateforme | Lu |
| SRC-12 | Mandat directeur | `docs/governance/CVLN-ECOSYSTEM-RECONCILIATION-MASTER-PLAN.md@44db6fb` | Gouvernance (v0.1.0 DRAFT) | Fourni par Laurent CŒURVOLAN |
| SRC-31 | Schéma ASCII de l’organigramme (SRC-X1) | Fourni par Laurent CŒURVOLAN dans la conversation de session, 2026-10-12 | Architecture déclarée (qualifiée d’obsolète par son auteur, DEC-0007) | Source originale du TREE ; comparée au registre (EV-P4-01) |

### 2.2 Command-center (SRC-R2)

| ID | Source | Référence | Nature | Fiabilité |
|---|---|---|---|---|
| SRC-20 | Backend | `backend/server.py@f9a61cc` (875 lignes, FastAPI) | Code | Lu (modèles, routes, authentification) |
| SRC-21 | Frontend | `frontend/src/**@f9a61cc` (React 19, 14 pages : 2 publiques — connexion, inscription — et 12 protégées) | Code | Lu partiellement (API, inscription) |
| SRC-22 | PRD | `memory/PRD.md@abe77c2` | Document produit (agent Emergent) | Déclaratif ; **contient des identifiants en clair** (voir R-13) |
| SRC-23 | Résumé de session Emergent | `.emergent/summary.txt@f9a61cc` | Journal d’agent | Déclaratif ; partiellement obsolète (C-08) ; seule source écrite de l’exigence d’inscription limitée au rôle Viewer (HIST-04) ; contient des informations d’authentification (R-13) |
| SRC-24 | Rapports de test Emergent | `test_reports/iteration_{1,2,3}.json`, `test_reports/pytest/*.xml` | Déclaratif (agent de test) | Non reproduits ; contiennent des informations d’authentification (R-13) |
| SRC-25 | Tests | `backend/tests/test_cvln_api.py`, `backend/tests/test_entities_api.py`, `backend_test.py` | Code de test (cible distante) | Non exécutés ; contiennent des informations d’authentification (R-13) |
| SRC-26 | Lignes directrices de design | `design_guidelines.json` | Document | Lu |
| SRC-27 | Configuration Emergent | `.emergent/emergent.yml` (image `fastapi_react_mongo_shadcn_base_image_cloud_arm:release-05022026-1`), `.gitconfig` | Configuration plateforme | Lu |
| SRC-28 | Historique `.env` | `backend/.env`, `frontend/.env` suivis de `a7957ee` à `f9a61cc^` | Configuration | **Secrets historiques exposés** (voir R-13) — valeurs non reproduites |
| SRC-29 | Liste d’entités codée en dur (Command Center API v1.2 « Conglomerate Mode ») | `backend/server.py@31036ce` l. 42, 46–60 (constante `ENTITIES`, servie par `GET /api/entities`) ; retirée en `7014ae7` (retour à la v1.0), absente de `main` | Code historique | Lu ; 12 entités typées : CVLN Holding (`holding`), Factory Maker Studio (`studio`), Culture Connect (`agency`), CVL Events, CVL Agro, CVL Culinary, CVL Academy, FREK (`brand`), CIP (`investment`), Hospitality, Tokenomics (`blockchain`), Umbrella Trust (`trust`) ; en ligne quelques minutes le 2026-02-06 ; statut décisionnel inconnu |
| SRC-30 | Fichier d’identifiants de test | `memory/test_credentials.md@f9a61cc` (retiré du suivi en `324b56d`, branche non fusionnée) | Configuration de test | Contient des informations d’authentification (R-13) — détails hors dépôt |

### 2.3 Sources externes citées mais non consultables

| ID | Source | Raison |
|---|---|---|
| SRC-X1 | Schéma ASCII original de l’architecture fourni par Laurent à l’agent Emergent (cité dans `362a81d`) | Absent de Git ; conversation Emergent non accessible |
| SRC-X2 | Conversations Emergent (Foundation, Command Center) | Hors Git ; non accessibles |
| SRC-X3 | Prévisualisation `roots-ecosystem-1.preview.emergentagent.com` (Foundation) | Hôte bloqué par la politique réseau de l’environnement |
| SRC-X4 | Prévisualisation Command Center (hôte `*.preview.emergentagent.com` cité dans l’historique `.env`) | Non sollicitée (application authentifiée) |
| SRC-X5 | Bases MongoDB (Foundation : `contacts`, `status_checks` ; Command Center : `users`, `projects`, `entities`, `finance`, …) | Aucun accès |
| SRC-X6 | Documents juridiques, statuts, Kbis, dépôts de marques, contrats | Aucun fourni |
| SRC-X7 | Dépôts éventuels des autres composants (§5 du mandat) | Non trouvés dans le périmètre accessible |

## 3. Couverture

| Périmètre | État |
|---|---|
| Dépôts accessibles | 2/2 examinés |
| Entrées du mandat §5 ayant un dépôt identifié | 2/19 : Foundation-Cvln (vitrine + registre), Command Center ; les 17 autres entrées regroupent 22 composants nommés, sans dépôt accessible |
| Sources historiques Git | 44 commits d’origine examinés (8 + 36) |
| Sources juridiques | 0 |
| Environnements d’exécution | 0 vérifiés |
