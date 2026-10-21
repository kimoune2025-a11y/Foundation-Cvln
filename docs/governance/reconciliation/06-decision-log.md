# 06 — Decision Log (Phase 4)

- **Mission :** CVLN-GOV-RECON-001
- **Phase :** 4 — Arbitrage architectural
- **Date :** 2026-10-11 (mise à jour 2026-10-12)
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
| DEC-0005 | 2026-10-12 | Autoriser l’écriture sur `command-center` : « Non code dessus fait la config ». Règle d’autorisation locale ajoutée (`.claude/settings.local.json`, non suivie) ; dépôt rattaché en écriture à la session | Laurent CŒURVOLAN | Conversation de session |
| DEC-0006 | 2026-10-12 | Command Center est l’outil de pilotage **interne** du groupe : inscription publique fermée par défaut (réouvrable par `ALLOW_PUBLIC_REGISTRATION=true`) et documents servis uniquement à un utilisateur authentifié. Remplace l’interprétation « inscription libre en Viewer » de HIST-04 | Laurent CŒURVOLAN (« ok alors », après explication) | Conversation de session ; `command-center@132baa7` |
| DEC-0007 | 2026-10-12 | Le schéma ASCII fourni à Emergent est **obsolète**. La référence d’architecture est le mandat directeur (§3, §5) et l’état réel des dépôts. Les questions dont la réponse se déduit de ces sources ne sont plus posées : elles sont tranchées par défaut (§5), contestables à tout moment | Laurent CŒURVOLAN (« ce schéma est obsolète […] tu n’as qu’à lire les repos ») | Conversation de session |
| DEC-0008 | 2026-10-12 | Les 7 entités absentes du schéma original (Culture Connect, Good Mood, Good Mood Fest, Gala Cook & Food, Factory Maker Academy, KORA Academy, FREK Academy sous Structures & Entités) sont des **mises à jour valides** de l’architecture. Priorité : pouvoir travailler depuis Command Center ; le système doit être autonome | Laurent CŒURVOLAN (« ce qui est absent [est] mis à jour, je dois commencer à pouvoir bosser depuis Command Center ») | Conversation de session |
| DEC-0009 | 2026-10-12 | Fusion directe sur `main` de command-center de `claude/cc-group-hub` (hub de pilotage + correctifs de sécurité), en avance rapide `f9a61cc` → `34fbbcc` | Laurent CŒURVOLAN (« Directe sur main ») | `command-center@34fbbcc` |
| DEC-0011 | 2026-10-18 | **C-20 — rôles des référentiels** : Foundation tient les entités et relations du groupe (`ENT-*`) ; Meta CVLN tient l’**annuaire des services** (URL, contrat, authentification), indexé par `ENT-*` ; Kiltikonet garde sa structure interne de produit | Laurent CŒURVOLAN (« 1: oui ») | Conversation de session ; proposition 05 §C-20 |
| DEC-0012 | 2026-10-18 | **C-22 — baseline v3 du registre** autorisée : mise à jour de `implementation_status` et `source_repositories` d’après le code constaté (EV-P6-20). Aucune entité ni relation ajoutée, supprimée ou renommée ; v1 et v2 restent gelées | Laurent CŒURVOLAN (« 2: oui ») | Conversation de session |
| DEC-0013 | 2026-10-18 | **C-21 — deux Command Center** : le Command Center de Kiltikonet (`/command`) est le **panneau interne** du propriétaire pour Kiltikonet ; il est conservé tel quel, sans renommage. CVLN Command Center reste le pilotage privé du groupe | Laurent CŒURVOLAN (« le command center de Kiltikonet c’est mon panneau interne ») | Conversation de session |
| DEC-0014 | 2026-10-18 | **C-23 — dépôts de référence** : Kiltikonet / Culture Connect → `cultureconnectorg/Kiltikonet-Aout2026` ; Agent Factory → `frekcore/CVLNAgentfactory` ; Meta CVLN → `cultureconnectorg/Metacvln-Sept2026` ; KORA → `kora2024/Kora-app` ; Academy → `cultureconnectorg/CVL-ACADEMY` ; FREKCORE → `cultureconnectorg/frekcoreAout2026` ; Laurentia → `cultureconnectorg/Laurent.ia`. Les autres dépôts de ces briques sont des versions antérieures ou des doublons : conservés, archivage éventuel par le propriétaire, aucune suppression | Laurent CŒURVOLAN (« frekcore/CVLNAgentfactory c’est le bon ! Oui je valide ») | Conversation de session |
| DEC-0015 | 2026-10-18 | **Jamais de fusion à l’aveugle** : une branche n’est fusionnée que si la CI GitHub du dépôt a tourné sur le commit exact et qu’elle est verte. Des tests locaux ne suffisent pas ; une CI qui ne démarre pas, absente ou rouge bloque la fusion | Laurent CŒURVOLAN (« jamais de fusion à l’aveugle ») | Conversation de session |
| DEC-0016 | 2026-10-21 | **Licences des dépôts du groupe** : CVLN Controlled-Use License 1.0 (propriétaire) pour Foundation, Command Center, Kiltikonet et CVLN Intelligence OS, comme Agent Factory ; Laurent.ia garde la BSL 1.1. FREKCORE en double licence par couche (`LICENSING.md`, frontière de `docs/OPEN-BOUNDARY.md`) : spécification ouverte FREK en CC BY-SA 4.0, vérificateurs et SDK en AGPL-3.0-only, cœur FREKCORE en CCUL 1.0 ; marques non concédées ; contributions au volet ouvert sous accord de contributeur (CLA). Textes à faire relire par un avocat avant toute distribution externe | Laurent CŒURVOLAN (« CCUL 1.0 partout » ; FREKCORE : « les 2 premiers choix, faut bien faire en sorte que ça soit possible et dans le texte que dans la réalité ») | Conversation de session |
| DEC-0010 | 2026-10-12 | « Règle toutes les incohérences » : application des arbitrages dans la baseline v2 du registre (`Foundation-Cvln@ba02a44`, branche `claude/registry-v2`), dans Command Center et dans les documents. Correction de l’arbitrage par défaut C-05 : Command Center reste sous Intelligence OS, conformément au schéma original (SRC-31) | Laurent CŒURVOLAN | Conversation de session |

## 2. Décisions historiques retrouvées

| ID | Date de trace | Décision | Source | Statut |
|---|---|---|---|---|
| HIST-01 | 2026-08-31 | Ne pas brancher CVLN Intelligence OS sur le registre (« NON branché (comme demandé) ») | `886ac8c` | HISTORICAL — respectée |
| HIST-02 | 2026-08-31 | Ne pas réinterpréter l’architecture fondatrice lors de la formalisation du registre | `886ac8c`, en-tête de SRC-01 | HISTORICAL — respectée (EV-P0-06) |
| HIST-03 | 2026-08-31 | Doctrine JCC : monnaie interne, sans requalification juridique | SRC-01 `DOCTRINE.JCC` | HISTORICAL — respectée |
| HIST-04 | ≤ 2026-06 (trace : `ca773f9`, 2026-06-26) | Command Center : inscription limitée au rôle Viewer ; administrateur non auto-attribuable | SRC-23 (`.emergent/summary.txt:55`, `:184`) ; formulation « admin cannot be self-assigned » : SRC-20 (`backend/server.py:286`). Le PRD (SRC-22) ne formule pas cette exigence | HISTORICAL — **non respectée dans le code** (C-07) ; précisée par DEC-0006 |
| HIST-05 | 2026-06 | Command Center : retour à la v1.0 stable, puis évolutions strictement incrémentales | SRC-22, SRC-23 | HISTORICAL — retour à la v1.0 réalisé |
| HIST-06 | 2026-08-31 | Les rattachements parent/enfant du TREE sont « à valider » | `362a81d`, `561ddf8` | HISTORICAL — **validation non tracée** (C-01) |
| HIST-07 | ≤ 2026-06-26 | Command Center « Conglomerate Mode » (v1.1) : module Entités, Board Pack, journal des décisions, registre des risques, Kanban, CRM enrichi | SRC-23 (`.emergent/summary.txt:181`, `:43–46`) | HISTORICAL — **partiellement réalisé** : Entités et Board Pack livrés (SRC-22) ; journal des décisions et registre des risques **non réalisés** |
| HIST-08 | ≤ 2026-06-26 | Exigences d’automatisation (tâches, CRM, finance, événements, direction, sauvegardes, notifications) | SRC-23 (`:179`) | HISTORICAL — reportées, non réalisées |
| HIST-09 | ≤ 2026-06-26 | Exigences de sécurité et de traçabilité (journal d’audit, chronologie, versionnement, couche sécurité, sauvegardes) | SRC-23 (`:180`) | HISTORICAL — reportées, non réalisées |
| HIST-10 | ≤ 2026-06-26 | Arrêt de la refonte massive v1.2, retour à la v1.0, puis évolutions strictement incrémentales | SRC-23 (`:178`) | HISTORICAL — respectée (retour v1.0 réalisé, SRC-22) |

## 3. Décisions proposées (Phase 4)

| ID | Objet | Classe | Proposition | Dépend de | Statut |
|---|---|---|---|---|---|
| PROP-01 | Registre canonique | PRESERVE | Conserver la baseline v1 gelée, inchangée, comme trace historique de l’interprétation de 2026-08-31 | — | PROPOSED |
| PROP-02 | Validation des 28 `PART_OF` | CORRECT ou KEEP | Laurent valide ou corrige les rattachements sur la base du schéma ASCII ; le résultat ouvre une baseline v2 versionnée | C-01, SRC-X1 | PENDING (information) |
| PROP-03 | Schéma du registre | EXTEND | Schéma v1.1 **additif** : `aliases`, `legal_status`, `ownership_status`, `implementation_status`, `operational_status`, `source_repositories`, `evidence_refs`, `last_verified_at`, `decision_status`. Aucun champ existant n’est modifié ; correspondance documentée | — | PROPOSED |
| PROP-04 | FREKCORE | CORRECT / ADD | Alias historique ou entité distincte | C-02 | PENDING (arbitrage) |
| PROP-05 | Laurentia | CORRECT / ADD | Une ou deux entités ; aligner le rôle déclaré sur le mandat | C-03 | PENDING (arbitrage) |
| PROP-06 | CVLN Holding | ADD / SUPERSEDE | Entité juridique de tête si elle existe ; relations `OWNS` étayées | C-04, pièces juridiques | PENDING (arbitrage + pièces) |
| PROP-07 | Command Center ↔ registre | RESTRUCTURE | Command Center référence les `entity_id` canoniques (lecture seule de `/api/registry/export`) ; ses entités locales deviennent un cache lié, sans suppression | C-06 | PENDING (arbitrage) |
| PROP-08 | Inscription Command Center | CORRECT | Restreindre l’inscription publique au rôle Viewer (exigence HIST-04) | — | **Réalisé sur branche isolée** (`command-center`, `claude/p6-registration-viewer-only`, `3e8d79c`) — fusion en attente |
| PROP-09 | Exposition d’informations d’authentification (R-13) | CORRECT | Rotation des secrets et des mots de passe, dépôt privé, arrêt du suivi des fichiers d’identifiants | — | **Partiellement réalisé** : arrêt du suivi (`324b56d` puis complément, voir 08 §1), sur la même branche que PROP-08 — exception à DEC-0003 (b), les deux correctifs touchant `backend/tests/test_entities_api.py` ; à scinder ou à accepter lors de la revue ; rotation et passage en privé = action du propriétaire (08, P0) |
| PROP-10 | `GET /api/contact` (Foundation, R-04) | CORRECT | Accès réservé par jeton administrateur ; désactivé si aucun jeton n’est configuré | — | **Réalisé sur branche isolée** (`claude/p6-contact-admin-auth`, `9710ded`) — fusion en attente |
| PROP-11 | Contrôle d’intégrité du registre (R-03, C-11) | ADD | Script local sans dépendance + CI GitHub Actions ; il vérifie la validation, le gel de la baseline et les invariants d’audit | — | **Réalisé sur branche isolée** (`claude/p6-registry-integrity-ci`, `caa58ff`) ; CI GitHub verte — fusion en attente |
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
9. Command Center reste-t-il rattaché à Intelligence OS, passe-t-il sous la gouvernance ou devient-il un outil transversal ? (C-05)
10. Command Center doit-il référencer les `entity_id` du registre canonique au lieu de gérer ses propres entités ? (C-06, PROP-07)
11. Les 7 relations inférées `REL-0029` à `REL-0035` sont-elles acceptées, corrigées ou rejetées ? (C-14, PROP-14)
12. Factory Maker Studio relève-t-il de KORA ou de Tech & Data ? (C-17)
13. CVLN Academy chapeaute-t-elle les trois autres académies ? (C-18)
14. Que représentent les entités de la liste v1.2 de Command Center absentes du registre — CVL Events, CVL Agro, CVL Culinary, CIP, Hospitality, Tokenomics, Umbrella Trust (SRC-29, CAND-04, CAND-05, CAND-08 à CAND-12) ?
15. Command Center doit-il devenir le lieu d’exploitation des décisions, risques et preuves du groupe (C-19, HIST-07) ?


## 5. Arbitrages par défaut (DEC-0007)

Statut `DEFAULT` : tranché à partir du mandat et des dépôts, applicable tant que Laurent CŒURVOLAN ne le conteste pas. Aucun ne modifie le registre gelé v1 ; ils s’appliqueront à la baseline v2.

| Réf. | Question | Arbitrage par défaut | Fondement |
|---|---|---|---|
| C-01 | Valeur des 28 `PART_OF` du registre v1 | Le registre v1 reste la trace historique. En v2 : les 20 rattachements confirmés par le schéma original (EV-P4-01) sont repris ; `REL-0006` reste sous Meta CVLN ; les 7 enfants de Structures & Entités sont repris comme mises à jour validées (DEC-0008) ; le rôle d’Agent Factory reçoit « exécution » | DEC-0007 ; SRC-31 ; mandat §3, §5 |
| C-02 | FREKCORE | **Couche d’identité, de provenance et de preuve**, indépendante de Laurentia, KORA et Agent Factory. « La voix créative » est une définition historique abandonnée | Mandat §3 et règles de séparation |
| C-03 | Laurentia | **Opérateur IA et interface de travail personnelle et métier**. La définition « terroir » est historique ; l’agriculture relève de CVL Agro (CAND-09) | Mandat §3 ; SRC-29 |
| C-05 | Rattachement de Command Center | **Sous CVLN Intelligence OS**, comme dans le schéma original (SRC-31) ; rôle : supervision et pilotage privés du groupe. *(Arbitrage initial « hors d’Intelligence OS » corrigé le 2026-10-12, DEC-0010 : il contredisait le schéma)* | SRC-31 ; EV-P4-01 ; DEC-0010 |
| C-06 | Registre unique | Command Center **référence les `entity_id` canoniques** ; un seul référentiel d’entités pour le groupe | Mandat §2, §9 ; 07 §2 |
| C-09 | CVLN Foundation / Cœurvolan | **Une seule entité**, « Cœurvolan » / « Fondation COEURVOLAN » en alias ; statut juridique `UNKNOWN` | Mandat §3 |
| C-10 | `BASELINE_DATE = 2025-06-15` | Conservée, qualifiée « non sourcée » en v2 | Absence de source |
| C-13 | Kiltikonet / Culture Connect / Observatory | **Un même ensemble** : écosystème culturel (réseau, services, observation) ; Observatory ajouté en v2 | Mandat §3 |
| C-14 | 7 relations inférées | Conservées `INFERRED` ; `REL-0032` (Command Center `SUPERVISES` Group) devient cohérente avec C-05 | Mandat §6 |
| C-17 | Factory Maker Studio | Rattachement du registre conservé (sous KORA) faute d’autre source | Registre v1 |
| C-18 | Académies | **CVLN Academy chapeaute** les académies associées | Mandat §5 (« CVLN Academy et les académies associées ») |
| C-19 | Décisions, risques, preuves | **Command Center** (privé) en devient le lieu d’exploitation ; les documents de la mission en sont la source de gouvernance | HIST-07 ; DEC-0006 |
| SRC-29 | Entités de la liste v1.2 | CVLN Hospitality et CVL Culinary Innovations : **activités du groupe** (citées par le mandat). CVL Events, CVL Agro, CIP, Tokenomics, Umbrella Trust : **candidates** jusqu’à source ou usage | Mandat §5 ; SRC-29 |
| D-02 | Autres composants | Seuls 2 dépôts existent. Les autres composants sont **non encore réalisés en code** (`DOCUMENTED_ONLY`), pas « inaccessibles » | `list_repos` du 2026-10-12 (2 dépôts) |

Restent ouverts, faute de source dans les dépôts : **C-04** (existence juridique de CVLN Holding, détention des actifs et de la PI) et le **statut juridique** de toutes les entités. Ils exigent des pièces, pas une déduction.
