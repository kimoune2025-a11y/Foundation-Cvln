# 06 — Decision Log (Phase 4)

- **Mission :** CVLN-GOV-RECON-001
- **Phase :** 4 — Arbitrage architectural
- **Date :** 2026-10-11
- **Statut :** registre vivant

Statuts possibles : `VALIDATED` (décision explicite et attribuable), `HISTORICAL` (décision tracée dans les sources, à confirmer), `PROPOSED` (proposition d’audit, **sans valeur de décision**), `PENDING` (en attente d’information), `REJECTED`.

Une proposition ne devient décision qu’après validation explicite de Laurent CŒURVOLAN (mandat §11, règle 7). L’autorisation générale du 2026-10-11 couvre l’exécution de la mission. Elle **ne remplace pas** les arbitrages d’architecture, qui exigent une connaissance que seul le fondateur détient.

## 1. Décisions validées

| ID | Date | Décision | Décideur | Trace |
|---|---|---|---|---|
| DEC-0001 | 2026-10-11 | Adoption du mandat CVLN-GOV-RECON-001 v0.1.0 (DRAFT) et intégration dans `docs/governance/` | Laurent CŒURVOLAN | Conversation de session ; commit `44db6fb` |
| DEC-0002 | 2026-10-11 | Autorisation de la Phase 0 en lecture seule | Laurent CŒURVOLAN | Conversation de session ; commit `ca60cb2` |
| DEC-0003 | 2026-10-11 | Autorisation générale : « Tu as toutes les autorisations […] le système doit être autonome et pouvoir travailler seul ». Interprétation appliquée : (a) poursuite des Phases 1 à 5 sans arrêt intermédiaire ; (b) Phase 6 limitée aux correctifs **indépendants des arbitrages d’architecture** (sécurité, intégrité, reproductibilité), chacun sur une branche isolée, **sans fusion sur `main`** (R-15) ; (c) les arbitrages d’architecture restent des propositions | Laurent CŒURVOLAN | Conversation de session |
| DEC-0004 | 2026-10-11 | Réponses implicites à D-01 (lecture de Command-center : accordée), D-03 (pôles historiques traités comme sources : appliqué), D-05 (documents dans ce dépôt public : accepté, sans détail exploitable des vulnérabilités) | Laurent CŒURVOLAN (via DEC-0003) | Ce registre |

## 2. Décisions historiques retrouvées

| ID | Date de trace | Décision | Source | Statut |
|---|---|---|---|---|
| HIST-01 | 2026-08-31 | Ne pas brancher CVLN Intelligence OS sur le registre (« NON branché (comme demandé) ») | `886ac8c` | HISTORICAL — respectée |
| HIST-02 | 2026-08-31 | Ne pas réinterpréter l’architecture fondatrice lors de la formalisation du registre | `886ac8c`, en-tête de SRC-01 | HISTORICAL — respectée (EV-P0-06) |
| HIST-03 | 2026-08-31 | Doctrine JCC : monnaie interne, sans requalification juridique | SRC-01 `DOCTRINE.JCC` | HISTORICAL — respectée |
| HIST-04 | ≤ 2026-06 | Command Center : inscription limitée au rôle Viewer ; administrateur non auto-attribuable | SRC-22, SRC-23 | HISTORICAL — **non respectée dans le code** (C-07) |
| HIST-05 | 2026-06 | Command Center : retour à la v1.0 stable, puis évolutions strictement incrémentales | SRC-22, SRC-23 | HISTORICAL — retour à la v1.0 réalisé |
| HIST-06 | 2026-08-31 | Les rattachements parent/enfant du TREE sont « à valider » | `362a81d`, `561ddf8` | HISTORICAL — **validation non tracée** (C-01) |

## 3. Décisions proposées (Phase 4)

| ID | Objet | Classe | Proposition | Dépend de | Statut |
|---|---|---|---|---|---|
| PROP-01 | Registre canonique | PRESERVE | Conserver la baseline v1 gelée, inchangée, comme trace historique de l’interprétation de 2026-08-31 | — | PROPOSED |
| PROP-02 | Validation des 28 `PART_OF` | CORRECT ou KEEP | Laurent valide ou corrige les rattachements sur la base du schéma ASCII ; le résultat ouvre une baseline v2 versionnée | C-01, SRC-X1 | PENDING (information) |
| PROP-03 | Schéma du registre | EXTEND | Schéma v1.1 **additif** : `aliases`, `legal_status`, `ownership_status`, `implementation_status`, `operational_status`, `source_repositories`, `evidence_refs`, `last_verified_at`, `decision_status`. Aucun champ existant n’est modifié ; correspondance documentée | — | PROPOSED |
| PROP-04 | FREKCORE | CORRECT / ADD | Alias historique ou entité distincte | C-02 | PENDING (arbitrage) |
| PROP-05 | Laurentia | CORRECT / ADD | Une ou deux entités ; aligner le rôle déclaré sur le mandat | C-03 | PENDING (arbitrage) |
| PROP-06 | CVLN Holding | ADD / SUPERSEDE | Entité juridique de tête si elle existe ; relations `OWNS` étayées | C-04, pièces juridiques | PENDING (arbitrage + pièces) |
| PROP-07 | Command Center ↔ registre | RESTRUCTURE | Command Center référence les `entity_id` canoniques (lecture seule de `/api/registry/export`) ; ses entités locales deviennent un cache lié, sans suppression | C-06 | PROPOSED |
| PROP-08 | Inscription Command Center | CORRECT | Restreindre l’inscription publique au rôle Viewer (exigence HIST-04) | — | **Prêt** (patch préparé ; accès en écriture requis) |
| PROP-09 | Exposition d’informations d’authentification (R-13) | CORRECT | Rotation des secrets et des mots de passe, dépôt privé, arrêt du suivi des fichiers d’identifiants | — | **Action du propriétaire requise** |
| PROP-10 | `GET /api/contact` (Foundation, R-04) | CORRECT | Accès réservé par jeton administrateur ; désactivé si aucun jeton n’est configuré | — | Réalisé sur branche isolée (voir 08) |
| PROP-11 | Contrôle d’intégrité du registre (R-03, C-11) | ADD | Script local sans dépendance + CI GitHub Actions ; il vérifie la validation, le gel de la baseline et les invariants d’audit | — | Réalisé sur branche isolée (voir 08) |
| PROP-12 | Source de vérité du code (R-15) | DECIDE | GitHub fait foi ; Emergent devient un outil de production de code qui passe par des branches et des revues | — | PROPOSED |
| PROP-13 | Organisation GitHub (R-19) | ADD | Organisation GitHub du groupe ; transfert des dépôts ; dépôts internes privés | — | PROPOSED |
| PROP-14 | Relations inférées | KEEP / REJECT | Validation une à une des 7 relations inférées | C-14 | PENDING (arbitrage) |
| PROP-15 | Résumé Emergent obsolète | CORRECT | Marquer `.emergent/summary.txt` (Command Center) comme historique | C-08 | PROPOSED |
| PROP-16 | Candidats CAND-02 à CAND-05 | DEFER | Inventorier sans les ajouter au registre jusqu’à preuve ou décision | — | PROPOSED |

## 4. Questions d’arbitrage ouvertes (pour Laurent CŒURVOLAN)

1. Peux-tu fournir le schéma ASCII original de l’architecture, ou confirmer ligne à ligne les 28 rattachements du registre ? (C-01)
2. FREKCORE « voix créative » et FREKCORE « identité · preuve » : même chose ou deux choses ? (C-02)
3. Laurentia « terroir » et Laurentia « opérateur IA » : même chose ou deux choses ? (C-03)
4. CVLN Holding existe-t-elle juridiquement ? Qui détient quoi (Foundation, Holding, Group) ? (C-04)
5. Dénomination légale de la racine : « CVLN Foundation », « Fondation COEURVOLAN » ou autre ? (C-09)
6. Origine de la date 2025-06-15 ? (C-10)
7. Kiltikonet, Culture Connect et Observatory forment-ils un même ensemble ? (C-13)
8. Où se trouvent les autres composants (autres comptes GitHub, Emergent, ailleurs) ? (D-02)
