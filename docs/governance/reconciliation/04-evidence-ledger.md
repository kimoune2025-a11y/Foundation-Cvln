# 04 — Evidence Ledger

- **Mission :** CVLN-GOV-RECON-001
- **Date :** 2026-10-11
- **Statut :** registre vivant ; une ligne ajoutée par preuve collectée, jamais supprimée

Règles :

- Une preuve décrit **ce qui a été observé**, comment, quand et par qui. Elle ne qualifie pas au-delà de ce qu’elle montre.
- Aucune valeur secrète ni donnée personnelle n’est reproduite. Lorsqu’une preuve porte sur un secret, seuls son emplacement générique, sa nature et sa date sont indiqués.
- Les preuves Phase 0 (`EV-P0-01` à `EV-P0-16`) sont détaillées dans [00-scope-and-access.md](00-scope-and-access.md) §4 et restent valides.

## 1. Preuves collectées

| ID | Date | Observateur | Objet | Méthode | Résultat | Reproductible |
|---|---|---|---|---|---|---|
| EV-P0-01 → EV-P0-16 | 2026-10-11 | Claude Code | Phase 0 (Foundation-Cvln) | Voir 00 §4 | Voir 00 §4 | Oui |
| EV-P1-01 | 2026-10-11 | Claude Code | Accès à Command-center | `add_repo` (lecture) ; clone anonyme complet | Dépôt public lisible ; aucun droit d’écriture pour la session ; `main@f9a61cc`, 36 commits, non shallow | Oui |
| EV-P1-02 | 2026-10-11 | Claude Code | Auteurs Git de Command-center | `git log --format='%an <%ae>'` | 36/36 commits par `emergent-agent-e1 <github@emergent.sh>` (2026-02-05 → 2026-08-31) | Oui |
| EV-P1-03 | 2026-10-11 | Claude Code | Fonctions de Command Center | Lecture de `backend/server.py`, `memory/PRD.md`, liste des pages frontend | 10 modules (authentification JWT + RBAC, projets, tâches, finances, contacts, événements, documents, KPI, entités, Board Pack) ; administration | Oui |
| EV-P1-04 | 2026-10-11 | Claude Code | Contrôle d’accès à l’inscription de Command Center | Lecture du module d’authentification (backend et page d’inscription) | Le niveau de droits accordé par l’inscription publique **ne correspond pas** à l’exigence documentée dans le PRD (« Locked registration to Viewer role only »). Détails communiqués directement au propriétaire ; re-vérifiable dans le code de SRC-R2 | Oui |
| EV-P1-05 | 2026-10-11 | Claude Code | Informations d’authentification dans les fichiers suivis de Command-center | Lecture avec valeurs masquées | Des informations d’authentification d’un compte à privilèges sont présentes **en clair** dans des fichiers suivis de ce dépôt public. Emplacements et valeurs non reproduits ici ; communiqués directement au propriétaire | Oui |
| EV-P1-06 | 2026-10-11 | Claude Code | Secrets dans l’historique de Command-center | Analyse de l’historique ; classification sans affichage | Des secrets applicatifs (dont un secret de signature des sessions) ont été suivis dans l’historique public entre 2026-02-06 et 2026-08-31, puis retirés de la version courante, **mais restent dans l’historique**. Détails communiqués directement au propriétaire | Oui |
| EV-P1-07 | 2026-10-11 | Claude Code | Registre d’entités de Command Center | `server.py:693–731` ; `test_reports/iteration_3.json` | CRUD complet ; types `holding/studio/label/agency/other` ; entités pré-chargées « CVLN Holding » et « Factory Maker Studio » (déclaré par l’agent de test) | Code : oui ; données : non (base inaccessible) |
| EV-P1-08 | 2026-10-11 | Claude Code | Intégrations IA | `git grep` (openai, anthropic, llm, agent, emergentintegrations) dans les deux dépôts | Aucun appel LLM ni agent dans le code ; `emergentintegrations==0.1.0` déclaré mais non importé (Command-center) | Oui |
| EV-P1-09 | 2026-10-11 | Claude Code | Origine du TREE fondateur | `git log -1 --format=%B 362a81d` et `561ddf8` | L’auteur (agent Emergent) écrit : « l’arborescence reflète mon interprétation de votre schéma ASCII (liens parent/enfant). À valider — ajustable facilement. » Il demande ensuite deux fois de « confirmer ou corriger les rattachements ». Aucune confirmation n’est tracée dans Git | Oui |
| EV-P1-10 | 2026-10-11 | Claude Code | Décision « Intelligence OS non branché » | `git log -1 --format=%B 886ac8c` | « ✅ CVLN Intelligence OS NON branché (comme demandé) » | Oui |
| EV-P1-11 | 2026-10-11 | Claude Code | Cohérence du résumé de session Emergent de Command Center | Comparaison de `.emergent/summary.txt` avec `memory/PRD.md` et le code | `summary.txt` indique que le retour à la v1.0 n’est pas commencé et que le module Entités est à faire ; le PRD (2026-06-29) et le code montrent le retour à la v1.0, les Entités et le Board Pack réalisés | Oui |
| EV-P1-12 | 2026-10-11 | Claude Code | Prévisualisations Emergent citées | `git grep` | Foundation : `roots-ecosystem-1.preview.emergentagent.com` ; Command Center : `command-center-524.preview.emergentagent.com` (tests) et un second hôte de prévisualisation dans l’historique `.env` | Oui (références) ; joignabilité non testée |

## 2. Preuves attendues mais absentes

| Affirmation | Preuve nécessaire | Détenteur probable |
|---|---|---|
| L’organigramme du registre est l’architecture décidée | Schéma ASCII original, ou validation écrite et datée | Laurent CŒURVOLAN |
| CVLN Foundation est une entité juridique | Statuts, immatriculation | Laurent CŒURVOLAN |
| `BASELINE_DATE = 2025-06-15` | Document daté de cette date | Laurent CŒURVOLAN |
| Les déploiements fonctionnent | Accès aux URL de prévisualisation ou de production, journaux | Emergent / Laurent |
| Les tests « 15/15 » et « 44/44 » sont actuels | Exécution reproductible (CI) | — (CI absente) |
| JCC, Wallet, paiements : cadre légal | Analyse juridique | Conseil juridique |
| Marques (CVLN, COEURVOLAN, FREKCORE, KORA, …) | Certificats de dépôt INPI / EUIPO / OMPI | Laurent CŒURVOLAN |
