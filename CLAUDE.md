# CLAUDE.md — CVLN Foundation

Ce dépôt est le point d’ancrage de la mission **CVLN-GOV-RECON-001** (réconciliation de l’écosystème CVLN).
Toute session Claude Code qui travaille ici reprend cette mission là où elle s’est arrêtée.

## Avant toute action

1. Lire `docs/governance/CVLN-ECOSYSTEM-RECONCILIATION-MASTER-PLAN.md` (mandat directeur), en entier.
2. Lire `docs/governance/reconciliation/STATUS.md` : phase en cours, bloquants, prochaine action autorisée.
3. Vérifier la branche, le HEAD et l’absence de travail non commis (`git status`, `git log -3`).
4. Consulter `docs/governance/reconciliation/06-decision-log.md` : seules les décisions `VALIDATED` font foi.

## Règles non négociables

- Ne jamais pousser sur `main`, réécrire l’historique ni forcer un push. Un changement = une branche isolée.
- Ne pas modifier `lib/registry/cvlnRegistry.js` ni `lib/registry/baseline/**` sans une décision `VALIDATED` et une nouvelle baseline versionnée. La baseline v1 reste gelée.
- Ne jamais présenter une proposition comme une décision, ni une relation inférée comme un fait.
- Ne jamais inventer un dépôt, une API, une preuve, un test, un déploiement ou une intégration. Inconnu reste `UNKNOWN`.
- Ne jamais écrire de secret, de mot de passe ni de donnée personnelle dans un fichier suivi, un commit ou un rapport. Ce dépôt est **public**.
- Ne pas brancher CVLN Intelligence OS sur le registre sans décision (HIST-01). Ne pas requalifier JCC (HIST-03).
- Ne pas supprimer, fusionner ou renommer silencieusement une entité ou un composant.

## Où écrire

| Quoi | Où |
|---|---|
| Nouvelle source (dépôt, document) | `docs/governance/reconciliation/01-source-register.md` |
| Nouvelle entité ou composant | `02-entity-inventory.md` (identifiant `CAND-*` / `TECH-*` / `EXT-*`, jamais `ENT-*` hors registre) |
| Relation observée | `03-relation-map.md` (`OBS-*`) |
| Preuve collectée | `04-evidence-ledger.md` (`EV-*`, ajout uniquement) |
| Contradiction ou risque | `05-contradictions.md` (`C-*`, `R-*`, numéros jamais réattribués) |
| Décision ou proposition | `06-decision-log.md` |
| Connexion technique entre composants | `09-integration-matrix.md` (niveaux présent / fusionné / testé / déployé / opérationnel) |
| Avancement | `STATUS.md` (mis à jour à chaque session, sur preuves uniquement) |

## Contrôles

- Intégrité du registre : `node scripts/registry-integrity.mjs` (aussi en CI, workflow `Registry integrity`). Aucun `npm install` n’est nécessaire.
- Contrat consommé par Command Center : `GET /api/registry/export` et `GET /api/contact` (jeton). Tout changement de forme casse la CI `foundation-integration` de Command Center : la lancer avant de fusionner.
- Compilation de l’application : `npx yarn@1.22.22 install && npx next build` (aucun fichier de verrouillage suivi, voir R-06).

## Fin de session obligatoire (mandat §12)

Terminer par : phase en cours, périmètre examiné, sources consultées, faits vérifiés, hypothèses, contradictions, accès manquants, modifications (références Git), tests exécutés et résultats, risques et décisions à arbitrer, prochaine action autorisée. Mettre `STATUS.md` à jour en conséquence.
