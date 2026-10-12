# 00 — Scope and Access (Phase 0 : Protection et cadrage)

- **Mission :** CVLN-GOV-RECON-001 — voir [`../CVLN-ECOSYSTEM-RECONCILIATION-MASTER-PLAN.md`](../CVLN-ECOSYSTEM-RECONCILIATION-MASTER-PLAN.md) (v0.1.0, DRAFT)
- **Phase :** 0 — Protection et cadrage
- **Mode :** lecture seule (aucune modification de code, de registre, de configuration ou de déploiement)
- **Date d’exécution :** 2026-10-11
- **Exécutant :** Claude Code (session cloud)
- **Autorité de validation :** Laurent CŒURVOLAN
- **Statut du rapport :** DRAFT — EN ATTENTE D’ARBITRAGE
- **Révision :** 2026-10-12 — corrections issues de la contre-vérification adversariale (R-02, R-10, §5.1.6, §5.2.4, §6, §7.2, §8) ; voir 04, EV-P6-07

> Convention de ce rapport : chaque fait renvoie à une preuve `EV-P0-xx` (section 4).
> « Établi » = observé directement dans cette session. « Hypothèse » = interprétation non prouvée.
> « Inconnu » = non vérifiable avec les accès disponibles. Une absence de preuve n’est pas une preuve d’absence.

---

## 1. Référence Git réellement observée

| Élément | Annoncé | Observé | Écart |
|---|---|---|---|
| Dépôt | kimoune2025-a11y/Foundation-Cvln | `origin = https://github.com/kimoune2025-a11y/Foundation-Cvln` | Aucun |
| Branche de travail | `claude/elegant-pascal-b0qe12` | `claude/elegant-pascal-b0qe12` (locale et distante) | Aucun |
| Commit du mandat | `44db6fb690cae3934ad27d58d8f129219114896e` | HEAD local = `origin/claude/elegant-pascal-b0qe12` = `44db6fb690cae3934ad27d58d8f129219114896e` | Aucun |
| Référence de départ | `886ac8c` | `886ac8c3e51fd8eec663365e8e874efa19be5299` = `main` = `origin/main` = parent de `44db6fb` | Aucun |
| Branche par défaut (distante) | — | `main` (`git ls-remote --symref origin HEAD`) | — |

Branches distantes observées (GitHub API) : `main` et `claude/elegant-pascal-b0qe12` uniquement, **toutes deux `protected: false`**. Aucune pull request (ouverte ou fermée). Aucun workflow GitHub Actions. Aucun tag. *(EV-P0-01, EV-P0-02)*

Le présent rapport est ajouté **par-dessus** `44db6fb` sur la même branche ; `main` n’est pas modifiée.

## 2. État initial de l’arbre de travail

- `git status --porcelain -uall` : vide — aucun changement non commis, aucun fichier non suivi.
- `git stash list` : vide.
- Dépôt complet (non shallow), **9 commits** sur la branche de travail.
- `docs/governance/reconciliation/` n’existait pas avant ce rapport : aucun travail existant n’a pu être remplacé.

Aucun travail préexistant n’était en cours ; rien n’a été écrasé. *(EV-P0-01)*

## 3. Périmètre examiné et méthodes

### 3.1 Examiné

| Domaine | Méthode |
|---|---|
| État Git, historique, branches, remote | `git status/log/rev-parse/for-each-ref/ls-remote`, `git fetch origin` |
| Paramètres GitHub du dépôt d’ancrage | GitHub MCP : `list_branches`, `list_pull_requests`, `actions_list(list_workflows)`, `get_me` |
| Dépôts accessibles au compte | `list_repos` (claude-code-remote) |
| Structure et conventions du dépôt | lecture de `package.json`, `next.config.js`, `jsconfig.json`, `.gitignore`, `.gitconfig`, `.emergent/**`, `test_result.md`, `backend_test.py`, `app/layout.js`, `app/providers.js`, `app/api/[[...path]]/route.js` |
| Registre canonique | lecture intégrale de `lib/registry/cvlnRegistry.js` ; lecture structurée de `lib/registry/baseline/foundation-baseline-v1.json` |
| Usage du registre par l’UI | `app/page.js` (import, dérivation du TREE, rendu) |
| Fidélité registre ↔ architecture fondatrice | comparaison mécanique entre le `TREE` codé en dur dans `app/page.js@4b31821` et `buildTree()` du registre actuel |
| Mécanismes de validation | exécution locale de `validateRegistry()` + contrôles complémentaires en lecture seule |
| Représentations historiques | `git show <commit>:app/page.js` sur les 9 commits |
| Dépendances externes | recherche des hôtes, variables d’environnement et références Emergent dans les fichiers suivis |
| Exposition de secrets | recherche par motifs (clés AWS, clés privées, jetons GitHub/OpenAI/Slack, URI MongoDB avec identifiants, mots de passe littéraux) dans les fichiers suivis et dans tout l’historique |
| Joignabilité du déploiement de prévisualisation | une seule requête `GET` vers l’endpoint de validation (lecture seule) |

Tous les scripts de contrôle ont été exécutés depuis un répertoire temporaire hors dépôt, sur une **copie** du registre (empreinte SHA-256 identique à l’original : `bfdc7623…485d`). Aucun fichier du dépôt n’a été modifié.

### 3.2 Non examiné (volontairement ou faute d’accès)

- Le dépôt `kimoune2025-a11y/Command-center` : détecté mais **non rattaché à la session et non lu** (hors périmètre de la session ; nécessite une autorisation).
- Tout autre dépôt cité au §5 du mandat : aucun n’a été trouvé parmi les dépôts accessibles (voir §6).
- Le rendu visuel de `app/page.js` (animations, WebGL, textes non architecturaux) : hors objet de la Phase 0.
- La compilation (`next build`) et l’exécution locale de l’application : non réalisées (dépendances non installées, aucun fichier de verrouillage suivi).
- `backend_test.py` : **non exécuté** — il cible un environnement externe Emergent et effectue des `POST /api/contact` (écritures en base) ; son exécution sortirait du mode lecture seule.
- Paramètres GitHub avancés (rulesets, collaborateurs, secrets de dépôt, Pages, webhooks) : non inspectés.
- Documents juridiques, contractuels ou économiques : aucun n’est présent dans le dépôt ni accessible dans cette session.

## 4. Sources consultées et preuves

| ID | Source | Référence vérifiable | Constat |
|---|---|---|---|
| EV-P0-01 | État Git local | `git rev-parse`, `git status --porcelain -uall`, `git stash list`, `git rev-list --count HEAD` (= 9), `git rev-parse --is-shallow-repository` (= false) | Voir §1–§2 |
| EV-P0-02 | GitHub API (dépôt d’ancrage) | `list_branches` ; `list_pull_requests(state=all)` = `[]` ; `actions_list(list_workflows)` = `total_count: 0` | 2 branches non protégées, 0 PR, 0 workflow |
| EV-P0-03 | Accès du compte | `list_repos` : 2 dépôts ; `get_me` : login `kimoune2025-a11y`, compte créé le 2026-08-31T15:06:17Z, `public_repos: 2` | Voir §6 |
| EV-P0-04 | Registre canonique | `lib/registry/cvlnRegistry.js@44db6fb` (369 lignes) | 29 entités, 35 relations (28 `PART_OF` + 7 inférées), doctrine JCC, baseline v1 |
| EV-P0-05 | Snapshot baseline | `lib/registry/baseline/foundation-baseline-v1.json@44db6fb` (`generated_at: 2026-08-31T15:52:59.279Z`) | Identique au registre pour `entities`, `relations`, `baseline`, `doctrine` |
| EV-P0-06 | TREE fondateur | `app/page.js@4b31821` (bloc `const TREE`, 82 lignes, empreinte identique dans `362a81d`, `561ddf8`, `4b31821`) | Comparé au registre : **identique** (noms, tags, descriptions, ordre, hiérarchie) ; 29 nœuds de part et d’autre |
| EV-P0-07 | Validation exécutée | `validateRegistry()` exécutée localement sur copie | `ok: true`, `errors: []` |
| EV-P0-08 | Consommation par l’UI | `app/page.js:7` (import `getUiTree`), `:325` (`const TREE = getUiTree()`), `:639` (rendu) | L’UI dérive l’arbre du registre ; aucune copie indépendante |
| EV-P0-09 | API | `app/api/[[...path]]/route.js@44db6fb` | Endpoints registre en lecture : `/api/entities`, `/api/entities/{id}`, `/api/relations`, `/api/registry/{export,validate,baseline,tree}` ; plus `/api/contact` et `/api/status` (MongoDB) |
| EV-P0-10 | Journal de tests | `test_result.md@44db6fb` | Déclare 11 tests registre + 4 tests contact réussis par un « testing agent » Emergent ; frontend `working: "NA"` |
| EV-P0-11 | Suite de tests | `backend_test.py@44db6fb:13` | `BASE_URL = https://roots-ecosystem-1.preview.emergentagent.com/api` ; contient des `requests.post` (l. 379, 409, 428) |
| EV-P0-12 | Représentations antérieures | `app/page.js@124ec63`, `@ec89531`, `@2b02b2c` (constante `POLES`) | Architecture antérieure différente (voir §5.3) |
| EV-P0-13 | Dépendances Emergent | `.emergent/emergent.yml`, `.emergent/cron/*`, `.gitconfig`, auteurs Git, `package.json` (`name`), `backend_test.py`, `components/ui/chart.jsx:5,66`, `lib/constants/testIds/*` | Voir §5.4 |
| EV-P0-14 | Recherche de secrets | `git grep` (fichiers suivis) et `git log -p --all` (historique) par motifs | 0 correspondance (portée limitée aux motifs listés au §3.1) |
| EV-P0-15 | Joignabilité de la prévisualisation | `GET https://roots-ecosystem-1.preview.emergentagent.com/api/registry/validate` | `curl: (56) CONNECT tunnel failed, response 403` — bloqué par le proxy de cet environnement ; **état du déploiement inconnu** |
| EV-P0-16 | Mandat directeur | `docs/governance/CVLN-ECOSYSTEM-RECONCILIATION-MASTER-PLAN.md@44db6fb` | Comparé au registre (voir §5.5) |

## 5. Faits, hypothèses et inconnues

### 5.1 Faits établis — dépôt et conventions

1. Application Next.js `15.5.18` / React `18.3.1`, `output: 'standalone'`, dépendance `mongodb 6.6.0` ; nom de paquet `nextjs-mongo-template`. *(EV-P0-13)*
2. Aucun fichier de verrouillage (`yarn.lock`, `package-lock.json`) n’est suivi, alors que `packageManager` déclare `yarn@1.22.22`. Les versions effectivement installées lors d’un déploiement ne sont donc pas reproductibles à partir du dépôt seul.
3. Avant `44db6fb`, le dépôt ne contenait **aucun** dossier `docs/` ni document de gouvernance ; le seul fichier Markdown était `test_result.md` (protocole de test Emergent). La structure `docs/governance/` est donc une convention nouvelle introduite par cette mission.
4. Aucun test exécutable localement : `tests/` ne contient que `__init__.py` ; `test_reports/` ne contient que des `.gitkeep` ; `backend_test.py` teste uniquement un déploiement distant via HTTP. *(EV-P0-11)*
5. Aucune CI : 0 workflow GitHub Actions. *(EV-P0-02)*
6. Les 8 commits antérieurs au mandat ont pour auteur et committer `emergent-agent-e1 <github@emergent.sh>` (du 2026-07-25 au 2026-08-31) ; aucun ne porte de signature cryptographique (absence d’en-tête `gpgsig`, contrairement aux commits de la mission, signés SSH). Le commit initial (2026-07-25) est antérieur à la création du compte GitHub `kimoune2025-a11y` (2026-08-31). *(EV-P0-01, EV-P0-03)*

### 5.2 Faits établis — registre canonique

1. **Fidélité** : la structure dérivée du registre (`buildTree()`) est strictement identique au `TREE` codé en dur dans `app/page.js` avant l’extraction (`4b31821`) : 29 nœuds, mêmes noms, tags, descriptions, ordre et hiérarchie. L’affirmation « aucune entité renommée, supprimée, simplifiée ou réinterprétée » est **vérifiée** par rapport à ce TREE. *(EV-P0-06)*
2. **Intégrité** : `validateRegistry()` retourne `ok: true`, aucune erreur ; contrôles couverts : identifiants dupliqués (entités, relations), relations pendantes, racine unique, absence de cycle `PART_OF`, types valides, correspondance registre ↔ arbre UI. *(EV-P0-07)*
3. **Snapshot** : le JSON de baseline est identique au registre pour entités, relations, baseline et doctrine. *(EV-P0-05)*
4. **Statuts** : les 29 entités sont `architectural_status: DECIDED`, `verified_reality: UNVERIFIED`, `evidence_source: null`, `confidence: DECLARED`. Les 35 relations sont `verified_reality: UNVERIFIED`. Le registre ne revendique aucune réalité vérifiée. Le statut `DECIDED` n’est toutefois adossé à aucune validation tracée du TREE (voir 05, C-01). *(EV-P0-04)*
5. **Relations inférées** : 7 relations sont marquées `confidence: INFERRED`, `provenance: inferred_from_declared_role` (conforme à la règle du mandat §6 « les relations inférées restent identifiées comme telles »). *(EV-P0-04)*
6. **Doctrine JCC** : « JCC est la monnaie interne de CVLN Group », avec interdiction de requalification (`legal_tender`, `regulated_electronic_money`, `crypto_asset`, `financial_security`, `bank_deposit`) sans preuve ou décision explicite. JCC n’est pas une entité du registre ; elle est rattachée à `ENT-CVLN-WALLET`. *(EV-P0-04)*
7. Le type de relation `OWNS` est défini mais **inutilisé** ; aucune relation de propriété n’est déclarée. *(EV-P0-04)*

### 5.3 Faits établis — représentations antérieures de l’architecture

Avant le `TREE` (introduit le 2026-08-31 dans `362a81d`, message « mise à jour architecture »), `app/page.js` présentait une autre organisation, la constante `POLES` *(EV-P0-12)* :

| Commit | Pôles et plateformes |
|---|---|
| `124ec63`, `ec89531` (2026-07-26/29) | Gouvernance (CVLN Holding, CVLN Command Center) · Tech & Data (CVLN Agent Factory, Factory Maker Studio) · Fintech (CVLN Wallet) · Events (Good Mood) · Média & Content (FREKCORE, KORA) · Éducation (CVLN Academy) · Impact & Normes |
| `2b02b2c` (2026-07-29) | Gouvernance (CVLN Holding) · Fintech (CVLN Wallet) · Tech & Data (Factory Maker Studio) · Média & Content (FREKCORE, KORA, LabelOS) · Éducation (CVLN Academy) · Events & Art de vivre (Good Mood, Gala Cook & Food) · Agriculture & Terroir (Laurentia) |

Différences factuelles avec le registre actuel, **sans interprétation** :

- **CVLN Holding** (« la structure mère qui porte la vision et coordonne l’ensemble de l’écosystème ») et **Impact & Normes** n’existent ni dans le registre ni dans le mandat.
- **FREKCORE** était décrit comme « La voix créative — sons, images et récits qui font vibrer la culture » (pôle Média & Content) ; il est aujourd’hui « Identité · provenance · preuve ».
- **Laurentia** était décrite comme « La terre au cœur du projet. Cultiver, préserver et transmettre un patrimoine vivant » (pôle Agriculture & Terroir) ; elle est aujourd’hui « Agent · interface métier ».
- **CVLN Command Center** était rattaché au pôle Gouvernance ; il est aujourd’hui `PART_OF` CVLN Intelligence OS.

Ces états sont conservés comme **sources historiques**. Les éléments disponibles ne permettent pas de déterminer s’il s’agit d’une évolution décidée, d’homonymes désignant des réalités différentes, ou de textes provisoires.

### 5.4 Faits établis — dépendances externes observées *(EV-P0-13)*

- **Emergent (plateforme d’hébergement/génération)** :
  - `.emergent/emergent.yml` : image d’environnement `nextjs_mongo_shadcn_base_image_cloud_arm:release-25072026-1`, `job_id`, `created_at: 2026-08-31`.
  - `.emergent/cron/*` : service cron interne au pod, appel vers `https://ea.int.apis.emergentagent.com/internal/crons/reconcile`, lecture d’un secret `WEBHOOK_CRON_SECRET` depuis `/app/backend/.env` **à l’exécution** (la valeur n’est pas dans le dépôt). Référence à `/app/.emergent/crons.yml`, **absent du dépôt**.
  - `.gitconfig` : identité Git `emergent-agent-e1`.
  - `backend_test.py` : cible `roots-ecosystem-1.preview.emergentagent.com`.
  - `test_result.md` : protocole d’agents Emergent (main agent / testing agent).
  - Règles de lint `emergent/...` (`components/ui/chart.jsx`) et identifiant de test `home-emergent-link`.
- **MongoDB** : `MONGO_URL`, `DB_NAME` (collections `contacts`, `status_checks`) ; instance et hébergeur **inconnus**.
- **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) chargées depuis `app/layout.js` et `app/globals.css`.
- Variables d’environnement utilisées par le code : `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`.

### 5.5 Cohérence mandat ↔ registre *(EV-P0-16, EV-P0-04)*

| Point | Mandat | Registre | Qualification |
|---|---|---|---|
| Composants présents dans les deux | Foundation, Group, Meta CVLN, Intelligence OS, Brain, Agent Factory, Laurentia, Command Center, FREKCORE, FREK-ID, Kiltikonet, Culture Connect, KORA, LabelOS, Wallet, Academy, Factory Maker Studio, Good Mood, Good Mood Fest, Gala Cook & Food | présents | Cohérent |
| Absents du registre | Observatory, CVLN Hospitality, CVL Culinary Innovations, JCC (comme entité) | — | À inventorier en Phase 1 |
| Présents uniquement au registre | — | Infrastructures CVLN, Entités Métier CVLN, Structures & Entités, FREK-CHAIN, formats `.FK · FREKANSLA · FREKRAW · Verified`, Proof Layer, Factory Maker Academy, KORA Academy, FREK Academy | Couverts par « académies associées » / « composants FREK associés » ; à confirmer |
| « Cœurvolan » | « CVLN Foundation / Cœurvolan » | entité `CVLN Foundation` ; l’UI utilise « Fondation COEURVOLAN » ; pas de champ `aliases` | Alias non formalisé |
| Laurentia | « Opérateur IA et interface de travail **personnelle** et métier » | « Agent · interface métier » | Écart de périmètre (« personnelle ») + homonymie historique (§5.3) |
| Kiltikonet / Culture Connect / Observatory | regroupés | Kiltikonet `PLATFORM` sous Entités Métier ; Culture Connect `PROGRAM` sous Structures & Entités ; Observatory absent | Regroupement non reflété ; à examiner |
| FREKCORE indépendant de Laurentia / KORA / Agent Factory | règle explicite | sous Infrastructures CVLN ← Meta CVLN ; aucune relation avec ces trois composants | Cohérent |
| `PART_OF` ≠ propriété | règle explicite | `OWNS` inutilisé ; aucune propriété déclarée | Cohérent |
| Modèle de statuts | `VERIFIED_OPERATIONAL`, `PARTIALLY_VERIFIED`, `DOCUMENTED_ONLY`, `IN_PROGRESS`, `BLOCKED`, `UNKNOWN`, `DEPRECATED` | `DECLARED` / `DECIDED` / `UNVERIFIED` / `INFERRED` | Vocabulaires distincts ; correspondance à établir, sans remplacement (mandat §9) |
| Champs du registre maître (§9) | 20 champs | présents ou équivalents : `entity_id`, `name`, `type`, `declared_role`, `architectural_status`, `confidence`, `evidence_source` ; absents : `aliases`, `actual_role`, `source_repositories`, `source_documents`, `implementation_status`, `operational_status`, `legal_status`, `ownership_status`, `dependencies`, `known_contradictions`, `decision_status`, `next_action`, `last_verified_at` (`as_of` est une date de baseline, pas de vérification) | Écart de modèle documenté ; aucune modification proposée en Phase 0 |
| « Examiner le registre et ses tests » (§4) | — | seuls tests existants : HTTP contre un déploiement distant non joignable d’ici | Tests du registre non reproductibles localement |

### 5.6 Hypothèses (non prouvées)

- H-01 : `CVLN Holding` (historique) pourrait correspondre à `CVLN Group`, `Meta CVLN` ou à une entité juridique distincte. *Aucune preuve.*
- H-02 : les descriptions historiques de FREKCORE et Laurentia pourraient refléter une évolution volontaire de doctrine plutôt que des homonymes. *Aucune décision écrite trouvée.*
- H-03 : le dépôt `Command-center` pourrait correspondre à l’entité `ENT-CVLN-COMMAND-CENTER`. *Son contenu n’a pas été lu ; la correspondance n’est pas établie.*
- H-04 : le déploiement `roots-ecosystem-1.preview.emergentagent.com` pourrait encore servir le code de `886ac8c`. *Non joignable depuis cet environnement.*

### 5.7 Inconnues

- U-01 : origine de `BASELINE_DATE = '2025-06-15'`. Dans Git, le `TREE` apparaît pour la première fois le 2026-08-31 (`362a81d`) et le dépôt commence le 2026-07-25. La date peut renvoyer à une décision antérieure à Git, mais aucune source ne l’atteste dans le dépôt.
- U-02 : réalité juridique de toutes les entités, y compris `ENT-CVLN-FOUNDATION`, typée `LEGAL_ENTITY` sans pièce justificative (`verified_reality: UNVERIFIED`).
- U-03 : état réel de tout déploiement (prévisualisation ou production), de la base MongoDB et des données qu’elle contient.
- U-04 : existence, emplacement et propriétaire des dépôts des autres composants cités au §5 du mandat.
- U-05 : nature et durée des engagements envers Emergent (abonnement, propriété du code, hébergement, export des données).
- U-06 : règles de protection effectives au-delà du drapeau `protected` (rulesets, collaborateurs).

## 6. Dépôts et ressources

| Ressource | Statut d’accès | Couverture Phase 0 |
|---|---|---|
| `kimoune2025-a11y/Foundation-Cvln` — https://github.com/kimoune2025-a11y/Foundation-Cvln | Accessible ; public ; `can_push: true` | Examiné (périmètre §3.1) |
| `kimoune2025-a11y/Command-center` — https://github.com/kimoune2025-a11y/Command-center | Listé par `list_repos` ; public ; `can_push: true` ; dernier push 2026-08-31T15:11:20Z ; **non rattaché à la session** | **Non examiné** — autorisation requise (D-01) |
| Déploiement de prévisualisation `roots-ecosystem-1.preview.emergentagent.com` | Bloqué par le proxy réseau de l’environnement (403) | Non vérifié |
| API Emergent `ea.int.apis.emergentagent.com` | Non sollicitée (interne Emergent) | Non vérifié |
| Base MongoDB | Aucune information d’accès | Non vérifié |
| Dépôts pour : CVLN Group, Meta CVLN, CVLN Intelligence OS, CVLN Brain, Laurentia, CVLN Agent Factory, FREKCORE, FREK-ID, Kiltikonet, Culture Connect, Observatory, KORA, LabelOS, CVLN Wallet, JCC, CVLN Academy, Factory Maker Studio, Good Mood, Good Mood Fest, Gala Cook & Food, CVLN Hospitality, CVL Culinary Innovations (22 composants, 17 entrées du mandat §5) | **Non recensés** : aucun dépôt correspondant parmi les 2 dépôts accessibles au compte | Non examinés |

Le compte GitHub accessible n’expose que **2 dépôts publics**. Cela ne prouve pas que les autres composants n’ont pas de dépôt. Ils peuvent se trouver sur d’autres comptes ou organisations, dans des dépôts privés non autorisés pour l’application Claude, uniquement chez Emergent ou ailleurs, ou ne pas encore exister sous forme de code.

**L’audit ne peut pas être déclaré exhaustif** à ce stade (mandat §11, règle 5).

## 7. Risques, limites et décisions nécessaires

### 7.1 Risques identifiés (constatés, non corrigés : Phase 0 = lecture seule)

| ID | Risque | Preuve | Gravité estimée |
|---|---|---|---|
| R-01 | `main` n’est pas protégée : un push direct ou une réécriture d’historique reste possible | EV-P0-02 | Élevée (préservation) |
| R-02 | Dépendance forte à Emergent (identité Git, image, cron, tests, prévisualisation) : la seule suite de tests existante (`backend_test.py:13`) cible une prévisualisation Emergent et aucun test n’est outillé pour s’exécuter localement. Le code lui-même (registre, build Next.js) reste exécutable hors d’Emergent (EV-P0-07) | EV-P0-07, EV-P0-11, EV-P0-13 | Élevée (souveraineté) |
| R-03 | Aucun test local, aucune CI : la validation du registre n’est garantie par aucun contrôle automatique à chaque changement | EV-P0-02, §5.1 | Élevée (intégrité) |
| R-04 | `GET /api/contact` renvoie jusqu’à 1 000 contacts (e-mail, nom, message) **sans authentification** dans le code, avec `Access-Control-Allow-Origin: *` par défaut. Exposition effective inconnue (déploiement non vérifié) | `route.js` (handler `/contact` GET), EV-P0-15 | Élevée **si déployé** (données personnelles) |
| R-05 | `X-Frame-Options: ALLOWALL` et `frame-ancestors *` : la page peut être intégrée dans n’importe quel site | `next.config.js` | Moyenne |
| R-06 | Absence de fichier de verrouillage : builds non reproductibles | §5.1 | Moyenne |
| R-07 | Homonymies et redéfinitions historiques (FREKCORE, Laurentia, CVLN Holding, Command Center) : risque de confusion de sources pendant l’inventaire | EV-P0-12 | Moyenne |
| R-08 | `BASELINE_DATE` non sourcée : risque d’antidatage involontaire de la baseline | U-01 | Faible à moyenne |
| R-09 | Typage `LEGAL_ENTITY` de la Fondation sans pièce : le type peut être lu comme une affirmation juridique | U-02 | Moyenne |
| R-10 | `validateRegistry()` n’a pas de contrôle explicite « un seul parent `PART_OF` » : `cvlnRegistry.js:295–296` écrase le parent dans `parentOf`. Un second parent fait néanmoins échouer la validation, mais de façon indirecte et avec un diagnostic trompeur (`UI_TREE_MISMATCH`, l’entité apparaissant deux fois dans l’arbre dérivé par `buildTree()`) ; aucun cas actuellement | `cvlnRegistry.js:249–253, 295–296, 321–329` | Faible (latent) |
| R-11 | 4 relations inférées portent sur la même paire d’entités qu’une relation `PART_OF` : 3 en sens inverse (`REL-0029` Foundation `GOVERNS` Group alors que Group `PART_OF` Foundation ; `REL-0030`, `REL-0031` Meta CVLN `GOVERNS` ses deux enfants) et 1 dans le même sens (`REL-0033` Agent Factory `DEPENDS_ON` Brain alors qu’Agent Factory `PART_OF` Brain). La structure, la gouvernance et la dépendance pourraient être confondues | EV-P0-07 (contrôle complémentaire) | Faible (à qualifier en Phase 2) |
| R-12 | Le dépôt est **public** : tout document de gouvernance ajouté ici, y compris ce rapport, est visible publiquement | EV-P0-03 | À arbitrer (D-05) |

### 7.2 Limites de la Phase 0

- La recherche de secrets repose sur des motifs ; elle n’est pas un audit de sécurité exhaustif.
- Aucun test applicatif n’a été exécuté contre un environnement réel ; les résultats « working: true » de `test_result.md` sont **déclaratifs** (produits par un agent de test Emergent ; le fichier n’est pas daté : le résultat « contact » (5 tests) figure déjà dans le commit `124ec63` du 2026-07-26, tandis que les 11 tests du registre et la re-vérification des 4 tests « contact » ont été ajoutés dans `886ac8c` le 2026-08-31) et n’ont pas été reproduits.
- Le §5 du mandat n’a pu être confronté qu’à un seul dépôt.

### 7.3 Décisions nécessaires (arbitrage Laurent CŒURVOLAN)

| ID | Décision demandée |
|---|---|
| D-01 | Autoriser le rattachement **en lecture seule** de `kimoune2025-a11y/Command-center` à la session pour l’inventaire de Phase 1. |
| D-02 | Indiquer où se trouvent les autres composants (autres comptes ou organisations GitHub, dépôts privés, projets Emergent, documents hors Git), ou confirmer qu’ils n’existent pas encore sous forme de code. |
| D-03 | Statut des représentations historiques (`POLES`) : les traiter comme sources historiques à inventorier (recommandé), sans arbitrage avant la Phase 3. |
| D-04 | Fournir la source de `BASELINE_DATE = 2025-06-15`, ou la laisser qualifiée « non sourcée ». |
| D-05 | Confirmer que les documents de réconciliation peuvent résider dans ce dépôt **public**, ou désigner un emplacement privé. |
| D-06 | Décider s’il faut protéger `main` (R-01) et traiter en priorité R-04. Ces actions relèvent d’une autorisation explicite hors audit ; aucune n’a été réalisée. |

## 8. Conditions de sortie de la Phase 0

Condition fixée par le mandat (§7, Phase 0) : *le périmètre, les accès, les limites et les règles de protection sont documentés.*

| Condition | État |
|---|---|
| Référence Git vérifiée et documentée | Rempli (§1) |
| État initial et absence de travail en cours documentés | Rempli (§2) |
| Conventions et documents existants identifiés | Rempli (§5.1, §5.5) |
| Périmètre accessible défini | Rempli pour le dépôt d’ancrage ; **partiel** pour l’écosystème (D-01, D-02) |
| Limites de l’audit établies | Rempli (§3.2, §7.2) |
| Risques de perte de données ou de confusion des sources identifiés | Rempli (§7.1) |
| Règles de protection documentées | Rempli (ci-dessous) |

Règles de protection appliquées et proposées pour la suite :

1. Travail exclusivement sur des branches dédiées ; jamais de push sur `main`, de réécriture d’historique ni de force-push.
2. Aucune modification de `lib/registry/**`, `app/**`, de la configuration ou de `.emergent/**` hors Phase 6 autorisée.
3. Aucun appel en écriture vers un service externe (MongoDB, `/api/contact`, API Emergent).
4. Les contrôles s’exécutent sur des copies, hors du dépôt.
5. Aucune valeur secrète ni donnée personnelle n’est reproduite dans les rapports.

**Statut de la Phase 0 : terminé avec preuves pour le dépôt d’ancrage ; périmètre de l’écosystème partiellement établi. Clôture soumise à validation.**

Constat sur le premier jalon du mandat (§13) : pour la **structure fondatrice qu’il formalise**, Foundation-Cvln est un point d’ancrage techniquement fiable (fidélité au TREE prouvée, validation sans erreur, statuts prudents sur la réalité : `verified_reality: UNVERIFIED`). En revanche, le statut `DECIDED` des 29 entités et la provenance `founding_architecture_tree` des 28 `PART_OF` reposent sur un TREE que son auteur qualifiait d’« interprétation […] à valider » (`362a81d`, `561ddf8`) ; aucune validation n’est tracée dans Git (voir 05, C-01). Il **ne peut pas encore** servir de source de vérité de l’écosystème : il ne couvre pas tous les composants cités par le mandat, ne relie aucune entité à un dépôt ou à une preuve, ignore les représentations historiques et ne dispose d’aucun test local ni d’aucune CI. La décision appartient à Laurent CŒURVOLAN.

## 9. Prochaine action recommandée (Phase 1 — non commencée)

Sous réserve d’autorisation et des décisions D-01 à D-05 :

1. Créer `docs/governance/reconciliation/01-source-register.md` : recenser chaque source (registre, baseline JSON, TREE `4b31821`, `POLES` des commits `124ec63`/`ec89531`/`2b02b2c`, mandat, `Command-center` si autorisé), avec chemin, commit, date et statut de couverture.
2. Créer `docs/governance/reconciliation/02-entity-inventory.md` : une ligne par élément découvert (29 entités du registre, éléments historiques, composants cités par le mandat et absents), avec source, alias candidats, statut `UNKNOWN` par défaut, sans fusion ni renommage.
3. Créer `docs/governance/reconciliation/STATUS.md` : progression réelle et prochaine action.
4. Ne modifier ni le registre, ni le code, ni la configuration.

---

*Fin du rapport Phase 0 — en attente d’arbitrage.*
