# 08 — Execution Roadmap

- **Mission :** CVLN-GOV-RECON-001
- **Date :** 2026-10-11 (mise à jour 2026-10-12)
- **Statut :** vivant — ordonné par prérequis et par risque (mandat §10), pas par effet de présentation

Légende : **[Propriétaire]** = action que seul Laurent CŒURVOLAN (ou un détenteur d’accès) peut faire · **[Claude]** = action exécutable par une session Claude Code · **[Arbitrage]** = décision requise.

## 1. Déjà réalisé (Phase 6, branches isolées, non fusionnées)

| Réf. | Dépôt | Branche | Commit | Contenu | Vérification |
|---|---|---|---|---|---|
| PROP-11 | Foundation-Cvln | `claude/p6-registry-integrity-ci` | `caa58ff` | `scripts/registry-integrity.mjs` + workflow `Registry integrity` | Local : OK sur le registre réel ; échec (code 1) sur 4 altérations simulées. **GitHub Actions : run 38182686798 = success** |
| PROP-10 | Foundation-Cvln | `claude/p6-contact-admin-auth` | `9710ded` | `GET /api/contact` désactivé sans `CONTACT_ADMIN_TOKEN`, sinon jeton Bearer obligatoire | `next build` OK ; serveur local : 404 sans variable, 401 sans jeton ou avec un mauvais jeton, passage du contrôle avec le bon jeton ; `POST` inchangé |
| PROP-08 | command-center | `claude/p6-registration-viewer-only` | `3e8d79c` | Inscription publique limitée au rôle Viewer ; option Manager retirée de l’UI ; fixture de test adaptée | FastAPI TestClient + MongoDB simulée : avant correctif, l’inscription publique accordait des droits supérieurs à l’exigence HIST-04 ; après correctif, elle n’accorde que le rôle Viewer, et un compte promu par un administrateur conserve ses droits (détails hors dépôt ; harnais non versionné) |
| PROP-09 (partiel) | command-center | `claude/p6-registration-viewer-only` | `324b56d`, `3d18675` | Informations d’authentification et ancien secret par défaut retirés des fichiers suivis (tests via `CC_ADMIN_EMAIL` / `CC_ADMIN_PASSWORD`) ; fichier d’identifiants non suivi. Même branche que PROP-08 (exception à DEC-0003 (b)) | Aucun fichier suivi ne contient plus de valeur sensible connue (EV-P6-08). **L’historique Git les contient toujours** |
| DEC-0006 | command-center | `claude/p6-registration-viewer-only` | `132baa7` | Inscription fermée par défaut (`ALLOW_PUBLIC_REGISTRATION`) ; documents servis uniquement via `/api/documents/{id}/download` authentifié, en pièce jointe ; envois plafonnés (`MAX_UPLOAD_BYTES`, 25 Mo) ; `backend/uploads/` ignoré par Git | EV-P6-10 |
| Audit | Foundation-Cvln | `claude/p6-contact-admin-auth` | `6d45f28` | Formulaire de contact : corps ≤ 16 Ko, champs bornés avant l’expression régulière (blocage du serveur par une seule requête) | EV-P6-09 |

Liens de comparaison (création de PR en un clic) :

- https://github.com/kimoune2025-a11y/Foundation-Cvln/compare/main...claude/elegant-pascal-b0qe12 (documents de mission)
- https://github.com/kimoune2025-a11y/Foundation-Cvln/compare/main...claude/p6-registry-integrity-ci
- https://github.com/kimoune2025-a11y/Foundation-Cvln/compare/main...claude/p6-contact-admin-auth
- https://github.com/kimoune2025-a11y/command-center/compare/main...claude/p6-registration-viewer-only

## 2. P0 — Immédiat (sécurité)

| # | Action | Qui | Comment |
|---|---|---|---|
| P0-1 | Changer le mot de passe du compte administrateur de Command Center (rotation préventive, R-13) | [Propriétaire] | Dans l’environnement Emergent du Command Center, ou directement en base — déclaré fait le 2026-10-12 (non vérifiable) |
| P0-2 | Remplacer le secret de signature des sessions (`JWT_SECRET`) de Command Center | [Propriétaire] | Variables d’environnement du backend dans Emergent ; invalide toutes les sessions existantes — déclaré fait le 2026-10-12 (non vérifiable) |
| P0-3 | Passer `command-center` en **privé** | [Propriétaire] | GitHub → `command-center` → Settings → General → Danger Zone → Change visibility → Private — **fait** — vérifié le 2026-10-12 (EV-P6-11) |
| P0-4 | Passer en revue les comptes de Command Center | [Propriétaire] | Page Admin de l’application ; rétrograder ou supprimer tout compte inconnu |
| P0-5 | Protéger `main` sur les deux dépôts | [Propriétaire] | GitHub → Settings → Rules → Rulesets → New branch ruleset → cible `main` : *Restrict deletions*, *Block force pushes*, *Require a pull request before merging*. Pour Foundation-Cvln, ne pas encore cocher *Require status checks to pass* : le workflow `registry-integrity` n’existe que sur `claude/p6-registry-integrity-ci` ; il sera exigé après sa fusion (P1-6) |

## 3. P1 — Intégration des correctifs

| # | Action | Qui | Prérequis |
|---|---|---|---|
| P1-1 | Décider qui fait foi entre GitHub et l’espace Emergent (proposé : GitHub — PROP-12) | [Arbitrage] | — |
| P1-2 | Ouvrir les PR, relire et fusionner les 4 branches ; ordre : `claude/p6-registry-integrity-ci` d’abord, puis les autres après mise à jour sur `main` | [Propriétaire] / [Claude] sur demande | P1-1 (sinon risque d’écrasement par une synchronisation Emergent, R-15) |
| P1-3 | Récupérer `main` à jour dans les espaces Emergent avant toute nouvelle génération | [Propriétaire] | P1-2 |
| P1-4 | Définir `CONTACT_ADMIN_TOKEN` (Foundation) si la liste des contacts doit rester consultable | [Propriétaire] | P1-2 |
| P1-5 | Définir `CC_ADMIN_EMAIL` / `CC_ADMIN_PASSWORD` pour les tests de Command Center ; pour les tests qui créent des comptes, activer temporairement `ALLOW_PUBLIC_REGISTRATION=true` (sinon ils sont ignorés) | [Propriétaire] | P0-1 |
| P1-6 | Exiger `registry-integrity` (*Require status checks to pass*) dans la règle de `main` de Foundation-Cvln | [Propriétaire] | P1-2 (CI fusionnée en premier) |

## 4. P2 — Arbitrages d’architecture (bloquants pour la réconciliation)

Questions détaillées dans [06-decision-log.md](06-decision-log.md) §4 (15 questions) : C-01 (schéma ASCII), C-02 (FREKCORE), C-03 (Laurentia), C-04 (CVLN Holding), C-05 (rattachement de Command Center), C-06 (registre unique, PROP-07), C-09 (dénomination légale), C-10, C-13, C-14 (relations inférées), C-17, C-18, D-02, et les entités historiques de SRC-29.

## 5. P3 — Extension du périmètre

| # | Action | Qui | Comment |
|---|---|---|---|
| P3-1 | Donner accès aux autres dépôts du groupe (autres comptes, organisations, dépôts privés) | [Propriétaire] | https://claude.ai/connect-github puis installer l’application Claude GitHub sur chaque compte ou organisation : https://github.com/apps/claude/installations/select_target ; ensuite, dans une session, demander le rattachement des dépôts |
| P3-2 | Autoriser l’accès réseau aux prévisualisations Emergent pour vérifier les déploiements | [Propriétaire] | Environnement cloud Claude → Edit → Network access → ajouter `*.preview.emergentagent.com` aux domaines autorisés (https://code.claude.com/docs/en/cloud-environments#network-access) |
| P3-3 | Fournir les pièces juridiques et de PI | [Propriétaire] | Statuts, immatriculations, marques |
| P3-4 | Inventorier les dépôts nouvellement accessibles (Phase 1 étendue) | [Claude] | Après P3-1 |

## 6. P4 — Évolution du référentiel (après P2)

| # | Action | Qui | Prérequis |
|---|---|---|---|
| P4-1 | Schéma registre v1.1 additif (PROP-03) + baseline v2 versionnée | [Claude] | C-01 tranché ; CI d’intégrité fusionnée |
| P4-2 | Command Center consomme le registre canonique (PROP-07) | [Claude] | P4-1, C-06 arbitré |
| P4-3 | Organisation GitHub du groupe et transfert des dépôts (PROP-13) | [Propriétaire] | — |
| P4-4 | Sortie progressive d’Emergent comme source de vérité : CI propre, fichiers de verrouillage, hébergement maîtrisé | [Claude] + [Propriétaire] | P1-1 |

## 7. Critères de validation

- Chaque PR : CI verte, diff limité à son objet, aucune modification du registre sans baseline versionnée.
- Sécurité : aucune donnée personnelle accessible sans authentification ; aucun secret dans les fichiers suivis (contrôle automatisé).
- Réconciliation : chaque entité du registre a un statut d’implémentation, un statut juridique et au moins une source.
