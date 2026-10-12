# STATUS — CVLN Ecosystem Reconciliation

- **Mission :** CVLN-GOV-RECON-001 (mandat v0.1.0, DRAFT)
- **Dernière mise à jour :** 2026-10-12
- **Statut global : en cours — bloqué sur arbitrages et accès** (voir §3)

## 1. Avancement par phase

| Phase | Statut | Livrables | Limite principale |
|---|---|---|---|
| 0 — Protection et cadrage | **Terminé avec preuves** (dépôt d’ancrage) | [00](00-scope-and-access.md) | Périmètre de l’écosystème partiel |
| 1 — Inventaire | **Partiellement vérifié** | [01](01-source-register.md), [02](02-entity-inventory.md) | 2 dépôts sur l’ensemble ; 22 composants nommés (17 entrées du mandat §5) sans dépôt connu ; 12 entités historiques ajoutées (SRC-29) |
| 2 — Relations | **Partiellement vérifié** | [03](03-relation-map.md) | Relations déclarées non validées (C-01) |
| 3 — Contradictions | **En cours** (16 contradictions, 19 risques) | [05](05-contradictions.md), [04](04-evidence-ledger.md) | Résolution = arbitrage |
| 4 — Arbitrage | **Bloqué** — en attente de Laurent CŒURVOLAN | [06](06-decision-log.md) §4 (14 questions) | — |
| 5 — Architecture cible | **Proposé** (non validé) | [07](07-target-architecture.md), [08](08-execution-roadmap.md) | Dépend de la Phase 4 |
| 6 — Exécution contrôlée | **En cours** — 4 correctifs indépendants réalisés sur 3 branches isolées (PROP-08 et PROP-09 partagent `claude/p6-registration-viewer-only`), non fusionnés | [08](08-execution-roadmap.md) §1 | Fusion soumise à P1-1 / P1-2 |

## 2. Branches ouvertes (aucune fusionnée sur `main`)

| Dépôt | Branche | HEAD | Objet |
|---|---|---|---|
| Foundation-Cvln | `claude/elegant-pascal-b0qe12` | voir `git log` | Mandat + documents de réconciliation + `CLAUDE.md` |
| Foundation-Cvln | `claude/p6-registry-integrity-ci` | `caa58ff` | Contrôle d’intégrité + CI (verte) |
| Foundation-Cvln | `claude/p6-contact-admin-auth` | `9710ded` | `GET /api/contact` protégé |
| command-center | `claude/p6-registration-viewer-only` | `324b56d` | Inscription Viewer uniquement + identifiants retirés des fichiers suivis |

## 3. Bloquants

| Bloquant | Détenteur | Débloque |
|---|---|---|
| Rotation des identifiants et du secret JWT de Command Center ; dépôt privé | Laurent CŒURVOLAN | R-13 (critique) |
| Protection de `main` (2 dépôts) | Laurent CŒURVOLAN | R-01 |
| Choix de la source de vérité GitHub / Emergent | Laurent CŒURVOLAN | Fusion des branches (R-15) |
| Schéma ASCII original / validation des 28 `PART_OF` | Laurent CŒURVOLAN | C-01, Phase 4 |
| Accès aux autres dépôts | Laurent CŒURVOLAN | Phase 1 complète |
| Accès réseau aux prévisualisations Emergent | Laurent CŒURVOLAN (paramètres de l’environnement) | Preuves opérationnelles |

## 4. Prochaine action autorisée

1. Sur réponse aux questions de [06](06-decision-log.md) §4 : consigner les décisions (`VALIDATED`) ; puis, une fois C-01 tranché et la CI d’intégrité (`claude/p6-registry-integrity-ci`, `caa58ff`) fusionnée sur `main` (P1-2), préparer la baseline v2 et le schéma v1.1 (P4-1) sur une branche isolée.
2. Sur demande : ouvrir les 4 pull requests (liens dans [08](08-execution-roadmap.md) §1).
3. Dès qu’un nouveau dépôt est accessible : l’ajouter à [01](01-source-register.md) et [02](02-entity-inventory.md) (Phase 1 étendue).
