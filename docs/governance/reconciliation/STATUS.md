# STATUS — CVLN Ecosystem Reconciliation

- **Mission :** CVLN-GOV-RECON-001 (mandat v0.1.0, DRAFT)
- **Dernière mise à jour :** 2026-10-12
- **Statut global : en cours — Phase 5 (architecture cible v2) à partir des arbitrages par défaut** (voir §3)

## 1. Avancement par phase

| Phase | Statut | Livrables | Limite principale |
|---|---|---|---|
| 0 — Protection et cadrage | **Terminé avec preuves** (dépôt d’ancrage) | [00](00-scope-and-access.md) | Périmètre de l’écosystème partiel |
| 1 — Inventaire | **Partiellement vérifié** | [01](01-source-register.md), [02](02-entity-inventory.md) | 2 dépôts sur l’ensemble ; 22 composants nommés (17 entrées du mandat §5) sans dépôt connu ; 12 entités historiques ajoutées (SRC-29) |
| 2 — Relations | **Partiellement vérifié** | [03](03-relation-map.md) | Relations déclarées non validées (C-01) |
| 3 — Contradictions | **En cours** (17 contradictions, 19 risques) | [05](05-contradictions.md), [04](04-evidence-ledger.md) | Résolution = arbitrage |
| 4 — Arbitrage | **Tranché par défaut** (DEC-0007) — 13 arbitrages sur la base du mandat | [06](06-decision-log.md) §5 | Restent C-04 et le statut juridique (pièces nécessaires) |
| 5 — Architecture cible | **Proposé** (non validé) | [07](07-target-architecture.md), [08](08-execution-roadmap.md) | Dépend de la Phase 4 |
| 6 — Exécution contrôlée | **En cours** — 6 correctifs réalisés sur 3 branches isolées (dont 2 issus de l’audit adversarial) (PROP-08 et PROP-09 partagent `claude/p6-registration-viewer-only`), non fusionnés | [08](08-execution-roadmap.md) §1 | Fusion soumise à P1-1 / P1-2 |

## 2. Branches

**Fusionné :** command-center `main` = `34fbbcc` (DEC-0009) — hub de pilotage et correctifs de sécurité en production dès le prochain déploiement Emergent.

Ouvertes :

- command-center `claude/cc-sovereign` (`05a4ce1`) : **autonomie vis-à-vis d’Emergent** — suppression des scripts Emergent et du traceur PostHog, déploiement Docker auto-hébergé, premier admin, CI (EV-P6-12).


| Dépôt | Branche | HEAD | Objet |
|---|---|---|---|
| Foundation-Cvln | `claude/elegant-pascal-b0qe12` | voir `git log` | Mandat + documents de réconciliation + `CLAUDE.md` |
| Foundation-Cvln | `claude/p6-registry-integrity-ci` | `caa58ff` | Contrôle d’intégrité + CI (verte) |
| Foundation-Cvln | `claude/p6-contact-admin-auth` | `6d45f28` | `GET /api/contact` protégé + saisie du formulaire bornée |
| command-center | `claude/cc-group-hub` | `34fbbcc` | **Hub de pilotage** (DEC-0008) : registre du groupe synchronisé, journal des décisions, registre des risques, import de la gouvernance, `CLAUDE.md` — construit sur la branche ci-dessous |
| command-center | `claude/p6-registration-viewer-only` | `132baa7` | Outil privé par défaut (inscription fermée, documents authentifiés) + identifiants retirés des fichiers suivis |

## 3. Bloquants

| Bloquant | Détenteur | Débloque |
|---|---|---|
| ~~Rotation des identifiants et du secret JWT ; dépôt privé~~ — dépôt privé vérifié, rotation déclarée faite (EV-P6-11) | Laurent CŒURVOLAN | R-13 (réduit) |
| Protection de `main` (2 dépôts) | Laurent CŒURVOLAN | R-01 |
| Choix de la source de vérité GitHub / Emergent | Laurent CŒURVOLAN | Fusion des branches (R-15) |
| ~~Schéma ASCII~~ — obsolète (DEC-0007), référence = mandat | — | C-01 tranché par défaut |
| Pièces juridiques (structure de tête, détention, PI) | Laurent CŒURVOLAN | C-04, statuts juridiques |
| Accès réseau aux prévisualisations Emergent | Laurent CŒURVOLAN (paramètres de l’environnement) | Preuves opérationnelles |

## 4. Prochaine action autorisée

0. Mettre Command Center en service : `main` fusionné (DEC-0009) ; déployer avec `docker compose up -d --build` sur l’infrastructure du groupe (branche `claude/cc-sovereign`), créer le premier admin (`deploy/create_admin.py`), puis en admin : « Synchroniser le registre du groupe » (Entités) et « Importer la gouvernance de la mission » (Décisions).

1. Sur réponse aux questions de [06](06-decision-log.md) §4 : consigner les décisions (`VALIDATED`) ; puis, une fois C-01 tranché et la CI d’intégrité (`claude/p6-registry-integrity-ci`, `caa58ff`) fusionnée sur `main` (P1-2), préparer la baseline v2 et le schéma v1.1 (P4-1) sur une branche isolée.
2. Sur demande : ouvrir les 4 pull requests ; relancer la partie de l’audit de code interrompue (secrets de l’historique, relecture des correctifs). Balayage de l’historique des 2 dépôts : fait le 2026-10-12 (HIST-07 à HIST-10, TECH-04, C-19) (liens dans [08](08-execution-roadmap.md) §1).
3. Dès qu’un nouveau dépôt est accessible : l’ajouter à [01](01-source-register.md) et [02](02-entity-inventory.md) (Phase 1 étendue).
