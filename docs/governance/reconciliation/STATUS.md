# STATUS — CVLN Ecosystem Reconciliation

- **Mission :** CVLN-GOV-RECON-001 (mandat v0.1.0, DRAFT)
- **Dernière mise à jour :** 2026-10-12 (intégration globale)
- **Statut global : en cours — Phase 6 (exécution) : Foundation et Command Center raccordés et testés de bout en bout sur `main` ; non déployés** (voir [09](09-integration-matrix.md))

## 1. Avancement par phase

| Phase | Statut | Livrables | Limite principale |
|---|---|---|---|
| 0 — Protection et cadrage | **Terminé avec preuves** (dépôt d’ancrage) | [00](00-scope-and-access.md) | Périmètre de l’écosystème partiel |
| 1 — Inventaire | **Partiellement vérifié** | [01](01-source-register.md), [02](02-entity-inventory.md) | 2 dépôts sur l’ensemble ; 22 composants nommés (17 entrées du mandat §5) sans dépôt connu ; 12 entités historiques ajoutées (SRC-29) |
| 2 — Relations | **Vérifié** contre le schéma original (EV-P4-01) ; baseline v2 | [03](03-relation-map.md) | — |
| 3 — Contradictions | **Résolues sauf C-04** (16/17, DEC-0010 ; 19 risques suivis dans Command Center) | [05](05-contradictions.md), [04](04-evidence-ledger.md) | Résolution = arbitrage |
| 4 — Arbitrage | **Tranché par défaut** (DEC-0007) — 13 arbitrages sur la base du mandat | [06](06-decision-log.md) §5 | Restent C-04 et le statut juridique (pièces nécessaires) |
| 5 — Architecture cible | **Proposé** (non validé) | [07](07-target-architecture.md), [08](08-execution-roadmap.md) | Dépend de la Phase 4 |
| 6 — Exécution contrôlée | **En cours** — correctifs et hub de pilotage fusionnés ; liaisons Command Center ↔ Foundation (X-01 à X-06) fusionnées et testées de bout en bout (EV-P6-14) | [08](08-execution-roadmap.md), [09](09-integration-matrix.md) | Déploiement non réalisé ; composants IA sans code |

## 2. Branches

**`main` (2026-10-12) :**

| Dépôt | `main` | Contenu intégré | CI sur `main` |
|---|---|---|---|
| Foundation-Cvln | `9c832bc` | CI d’intégrité (`caa58ff`), baseline v2 (`ba02a44`), `GET /api/contact` protégé (`732e6f9`), documents de mission (`559a459`), retrait de `/api/status` (`9c832bc`, EV-P6-15) | `Registry integrity` : success |
| command-center | `77295c4` | Hub de pilotage (DEC-0009), outil privé (DEC-0006), pile autonome (EV-P6-12), baseline v2 (`e570fec`), CI réparée (`db5c814`, EV-P6-13), liaisons Foundation (`28db5c9`), modèle `.env` (`77295c4`) | `CI` (backend, frontend, docker, foundation-integration) : success, run 38273302763 |

Fusionner sur `main` ne vaut pas autorisation de déploiement en production.

Branches restantes, toutes contenues dans `main` (aucun travail non intégré) : Foundation `claude/p6-registry-integrity-ci`, `claude/registry-v2`, `claude/p6-contact-admin-auth`, `claude/foundation-drop-template-status`, `claude/elegant-pascal-b0qe12` (documents) ; command-center `claude/cc-group-hub`, `claude/cc-sovereign`, `claude/p6-registration-viewer-only`, `claude/cc-integration`.

## 3. Bloquants

| Bloquant | Détenteur | Débloque |
|---|---|---|
| ~~Rotation des identifiants et du secret JWT ; dépôt privé~~ — dépôt privé vérifié, rotation déclarée faite (EV-P6-11) | Laurent CŒURVOLAN | R-13 (réduit) |
| Infrastructure de déploiement du groupe (Foundation et Command Center) | Laurent CŒURVOLAN | Niveaux « déployé » et « opérationnel » ([09](09-integration-matrix.md) §4) |
| Jeton partagé `CONTACT_ADMIN_TOKEN` / `FOUNDATION_CONTACT_TOKEN`, à poser hors Git | Laurent CŒURVOLAN | Import des prospects en production |
| Protection de `main` (2 dépôts) | Laurent CŒURVOLAN | R-01 |
| Code ou contrat d’API de CVLN Intelligence OS, Brain, Agent Factory, Laurentia | Laurent CŒURVOLAN | Raccordement de la couche IA |
| Pièces juridiques (structure de tête, détention, PI) — ne bloque pas les raccordements techniques | Laurent CŒURVOLAN | C-04, statuts juridiques |

## 4. Prochaine action autorisée

1. **[Propriétaire]** Déployer Foundation puis Command Center selon [09](09-integration-matrix.md) §5 ; dans Command Center : Admin → Connexions Foundation → « Contrôler les connexions », puis synchroniser le registre, importer la gouvernance et les prospects.
2. **[Claude]** À chaque changement des documents 00, 05 ou 06 : régénérer `backend/data/` de Command Center (`python scripts/build_data.py`), sinon la CI `foundation-integration` échoue (contrôle voulu).
3. **[Claude]** Dès qu’un nouveau dépôt est accessible (Intelligence OS, Agent Factory…) : l’ajouter à [01](01-source-register.md) et [02](02-entity-inventory.md), puis à la matrice [09](09-integration-matrix.md).
4. **[Arbitrage]** Questions ouvertes de [06](06-decision-log.md) §4 et C-04.
