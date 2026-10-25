# Audit routes / API / sécurité — 2026-10-20

Périmètre : les 10 dépôts de la session (Command Center, Foundation, Agent Factory, Laurent.ia,
CVL Academy, Kiltikonet, KORA, frekcore, et les deux dépôts iOS). Méthode : recherche de secrets
suivis dans Git, cartographie automatique des ~2 300 routes FastAPI et de leur authentification
(dépendances, alias, contrôles dans le corps de la fonction), puis revue manuelle de toutes les
routes sans protection visible et des points sensibles (connexion, webhooks, OAuth, fichiers).

Aucun secret réel n'a été trouvé dans les fichiers suivis (hors R-20, déjà connu).

## Corrigé (branche `claude/stoic-babbage-2eimmr` de chaque dépôt, non fusionné)

| Dépôt | Gravité | Constat | Correctif |
|---|---|---|---|
| Laurent.ia | Critique | `POST /api/webhook/ovh-sms-reply` : le champ `from` est fourni par l'appelant ; n'importe qui pouvait valider ou bloquer un incident du disjoncteur de l'orchestrateur | Secret partagé `OVH_SMS_WEBHOOK_SECRET` exigé ; webhook fermé sans lui |
| Laurent.ia | Haute | `POST /api/admin/rgpd/purge` sans authentification | Rôle founder/admin |
| Laurent.ia | Haute | `/api/brain/chat-enriched` et `/api/omega/chat-enriched` : inférence publique, hors quotas | Session exigée |
| Cvln-ios-v.1 (privé) | Critique | Même clé Ed25519 révoquée (R-20) encore suivie et utilisée | Correctif d'`ioscvln/CVLN-ios-v1` reporté : clé retirée, révocation, CI |
| Dépôts iOS | Basse | Contrôle de chemin par préfixe de chaîne ; condensat d'URL utilisé comme nom de fichier | `is_relative_to` ; SHA-256 hexadécimal exigé |
| CVL Academy | Haute | `/api/auth/login` sans limite d'essais (mot de passe et code MFA à 6 chiffres) | 10 échecs / 15 min par compte, puis 429 |
| CVL Academy | Haute | `POST /oauth/authorize` (MCP) : mot de passe seul, même avec MFA activée | Code MFA exigé quand actif, même limite |
| CVL Academy | Haute (disponibilité) | `/api/auth/register` : variables indéfinies, chaque inscription réussie finissait en 500 | Journal fautif retiré |
| Kiltikonet | Haute | `GET /api/me/laurentia/status?frek_id=` public : solde JCC et consommation de tout membre | Session du titulaire ou admin exigée |
| Agent Factory | Moyenne | Cookie de session `SameSite=None` (CSRF) ; aucune limite de connexion | `SameSite=Lax` ; 5 échecs / 15 min |
| Command Center | Moyenne | Le dernier admin pouvait se rétrograder ou se supprimer | Refus (400) |
| frekcore | Basse | 13 comparaisons de clé admin non constantes en temps ; clé vide acceptée par un tableau de bord si `SECRET_KEY` absent | `hmac.compare_digest` ; secret vide refusé |

## Risques non corrigés (reportés dans `05-contradictions.md` le 2026-10-22, avec R-27)

Après fusion de cette branche sur Foundation `main`, régénérer `backend/data/` de Command Center
(`python scripts/build_data.py`), dont la CI compare l'instantané à Foundation `main`.

| Proposé | Risque | Gravité | Traitement proposé |
|---|---|---|---|
| R-22 | Agent Factory : les `scopes` des jetons de service sont stockés mais jamais vérifiés ; tout jeton d'agent peut écrire finances, connaissances, etc. | Moyenne | Décision sur un contrôle de droit par route (comme `require_scope` de Command Center) |
| R-23 | Portail documentaire iOS : aucune authentification sur l'API (dont `POST /api/docs/anchor/*`, qui écrit sur disque et appelle des calendriers externes) ; CORS `*` avec identifiants | Moyenne | Décider s'il est exposé publiquement ; sinon jeton d'accès |
| R-24 | Formulaires publics sans limite de débit : `POST /api/contact` (Foundation, importé ensuite dans Command Center), `POST /api/status` hérité du modèle (Laurent.ia, iOS) | Basse | Limite par IP, retrait des routes de modèle |
| R-25 | KORA : `POST /api/ads/reward` accorde 60 min sans publicité sans preuve de visionnage ; `POST /api/ads/check-gating` révèle le statut premium d'un identifiant | Basse | Vérification côté régie (SSV) ; statut lu depuis le jeton |
| R-26 | Verrouillage par adresse e-mail (Command Center, Agent Factory, Academy) : un tiers peut bloquer un compte 15 min | Basse | Accepté en l'état ; à revoir avec une limite par IP fiable |

## Tests exécutés

- Laurent.ia : `backend/contract_tests` — 35 réussis (4 nouveaux).
- Dépôts iOS : `test_signing_key_revocation.py` — 4 réussis chacun.
- Command Center : compilation ; garde du dernier admin vérifiée sur base simulée ; test d'intégration ajouté.
- Agent Factory : verrouillage vérifié sur base simulée (401 ×5 puis 429).
- CVL Academy : 3 nouveaux tests réussis ; suite complète 2 781 réussis, 126 échecs identiques avant/après
  (incompatibilité mongomock/pymongo de l'environnement local, pas du code). CI GitHub bloquée sur ce dépôt (voir STATUS).
- frekcore : 570 tests unitaires réussis.
- Kiltikonet : 4 nouveaux tests réussis, ajoutés à `scripts/ci/backend-tests.txt`.

Aucune fusion : DEC-0015 exige une CI verte sur le commit exact.

## Second tour — pannes, fausses routes, frontières, PWA, responsive

Méthode : table réelle des routes obtenue en important chaque application, confrontée aux appels
des frontends et aux appels serveur à serveur ; pyflakes sur tout le Python ; analyse JSX (Babel)
des boutons et liens ; manifestes, icônes et service workers ; largeurs fixes hors conteneurs défilants ;
parité des traductions ; branches distantes.

### Corrigé

| Catégorie | Dépôt | Constat | Correctif |
|---|---|---|---|
| Panne | Kiltikonet | Import de `spawn_background` glissé dans la docstring de `quality_agent_factory.py` : chaque mission qualité restait `QUEUED`, réponse 500 | Import rétabli, test |
| Panne silencieuse / frontière | Kiltikonet → Laurent.ia | Le widget appelle `GET /api/laurentia/me`, absent de Laurent.ia : 404 lu comme « instance non activée » pour tous | Route implémentée dans Laurent.ia (secret du pont existant), 3 tests |
| Fausse route / cul-de-sac | CVL Academy | `cohort_workspace` importé mais jamais monté : page Cohorte en 404 | Routeur monté, test |
| ~~Fausse route~~ | CVL Academy | **Erreur de l’audit, annulée** (`7c0943f0`) : `ExpertWorkspace` définit son propre `API_BASE` sans `/api` ; l’URL d’origine était correcte et la « correction » avait cassé l’espace Expert (détecté par Playwright) | Rétabli à l’identique de `main` |
| Panne silencieuse | Kiltikonet | `except Exception: pass` autour du journal des événements Stripe | Limité à `DuplicateKeyError` |
| Doublon | Kiltikonet | `_require_admin` défini deux fois dans `cultural_search.py` | Supprimé |
| Mauvais CTA | Kiltikonet | Bouton factice focusable dans l'aperçu du thème CMS | Rendu non interactif |
| Mauvais PWA | Agent Factory | Gestionnaire `fetch` vide dans le service worker | Retiré |
| Incohérence | Agent Factory | Contrôle ART-011 affirmant une journalisation sans utiliser le compte calculé | Compte affiché |
| Code mort | KORA | Variable de tri calculée puis ignorée | Retirée |
| Sécurité (suite) | Kiltikonet | 3 comparaisons de secrets non constantes en temps | `hmac.compare_digest` |

### Vérifié sans anomalie

- Appels frontend → backend : Command Center, Laurent.ia, Agent Factory, KORA, frekcore — toutes les routes existent.
- Liens internes (React Router) : aucun lien vers une page inexistante (8 frontends).
- Routes en double ou masquées par une route paramétrée : aucune (8 backends).
- Traductions : parité FR/EN complète (Command Center, Agent Factory, Kiltikonet) et 4 langues frekcore ; aucune clé `t()` indéfinie.
- Manifestes PWA : JSON valide, icônes présentes aux tailles déclarées (192 et 512) ; service workers de Laurent.ia, Academy et Kiltikonet sans mise en cache d'API authentifiée.
- Responsive : balise viewport partout ; aucune largeur fixe ≥ 420 px hors conteneur défilant (les halos décoratifs de frekcore sont coupés par `overflow-x: hidden`). Aucun rendu réel en navigateur n'a été fait.

### Non corrigé — à arbitrer

| Catégorie | Constat |
|---|---|
| Frontière (corrigée ensuite) | Laurent.ia → frekcore appelait `/api/frek/validate/{id}` et `/api/frek/{id}/profile`, absents de frekcore. Corrigé dans Laurent.ia (`72afee7`) : `GET /api/v1/identity/{id}/status`, profil via le pont Kiltikonet. La connexion par FREK-ID seul reste désactivée en production (pas de preuve de possession) ; étape suivante : passkey frekcore. |
| Branches | **Correction** : le premier comptage (~715) était gonflé par le clone superficiel de la session. Chiffre réel : 507 branches non fusionnées au sens Git, dont 10 branches d'audit de cette session. Causes, croisées avec les 834 PR GitHub : 242 PR **fusionnées en squash** dont la branche n'a jamais été supprimée (`delete_branch_on_merge = false` sur les 8 dépôts vérifiés) ; 133 PR fermées sans fusion (tentatives remplacées par une nouvelle branche, surtout des agents) ; 100 branches sans PR (sauvegardes `backup/`, `archive/`, sessions d'agents non abouties) ; 22 PR ouvertes. |
| Code mort | Mesure stricte : ~70 fonctions Python jamais référencées (~890 lignes sur ~220 000, 0,4 %) ; ~250 imports inutilisés (restes d'éditions successives). Côté frontend, l'essentiel vient du gabarit Emergent : 115 composants `components/ui` (shadcn) copiés d'office et jamais utilisés, ~7 900 lignes dans Command Center, Laurent.ia, Agent Factory et iOS (20 à 37 % de leur frontend), sans effet sur l'application livrée (non importés, donc absents du paquet). |
| Sécurité (suite) | Kiltikonet | 3 comparaisons de secrets non constantes en temps | `hmac.compare_digest` |

### Vérifié sans anomalie

- Appels frontend → backend : Command Center, Laurent.ia, Agent Factory, KORA, frekcore — toutes les routes existent.
- Liens internes (React Router) : aucun lien vers une page inexistante (8 frontends).
- Routes en double ou masquées par une route paramétrée : aucune (8 backends).
- Traductions : parité FR/EN complète (Command Center, Agent Factory, Kiltikonet) et 4 langues frekcore ; aucune clé `t()` indéfinie.
- Manifestes PWA : JSON valide, icônes présentes aux tailles déclarées (192 et 512) ; service workers de Laurent.ia, Academy et Kiltikonet sans mise en cache d'API authentifiée.
- Responsive : balise viewport partout ; aucune largeur fixe ≥ 420 px hors conteneur défilant (les halos décoratifs de frekcore sont coupés par `overflow-x: hidden`). Aucun rendu réel en navigateur n'a été fait.

### Non corrigé — à arbitrer

| Catégorie | Constat |
|---|---|
| Incertitude frontière | Laurent.ia → frekcore appelle `GET /api/frek/validate/{id}` et `/api/frek/{id}/profile`, absents du code de frekcore (qui expose `/api/v1/identity/...` avec jeton client OAuth). Si la production suit le dépôt, la connexion par FREK-ID de Laurent.ia échoue pour tous. Production non joignable depuis la session : **UNKNOWN**. Choisir le contrat cible (comme CVL Academy : `/api/v1/auth/token` puis `/api/v1/identity/...`). |
| Branches | Branches non fusionnées : Kiltikonet 455/504, CVL Academy 165/196, Laurent.ia 52/63 (base `public`), frekcore 16, KORA 9, Agent Factory 6 (base `CVLN-AGENT-FACTORY`), Cvln-ios-v.1 5, Foundation 3, Command Center 2. Rien supprimé ; tri à décider (archiver les branches fusionnées ou abandonnées). |
| Code mort | ~250 imports inutilisés (frekcore 87, Kiltikonet 45, KORA 36…). Non retirés en masse : certains imports enregistrent des routes par effet de bord. |

## Nettoyage (demande du propriétaire, « proprement et minutieusement »)

### Branches

- Inventaire complet (863 branches, nom + SHA + décision) et manifeste de restauration écrits **avant** toute
  suppression, dans Command Center (`docs/branches/`, dépôt privé). Règles : suppression seulement si le contenu
  est un ancêtre de la branche par défaut, ou si la PR est fusionnée et la pointe identique au commit fusionné ;
  jamais la branche par défaut, une branche suivie par Render, une branche avec PR ouverte ou base d’une PR
  ouverte, ni une branche ayant reçu un commit dans les 48 h.
- Résultat : 554 à supprimer, 57 à garder, 252 à décider (80 « archiver », 148 « examiner », 24 « reprendre »).
- **Non exécuté depuis la session** : le proxy GitHub refuse la suppression de références et la modification
  des réglages ; le garde-fou « Git destructif » de Claude Code refuse aussi. Script fourni
  (`docs/branches/supprimer-branches-integrees.sh`, simulation par défaut, conditionné aux SHA inventoriés).
- Réglage à activer par le propriétaire sur chaque dépôt : *Automatically delete head branches*.

### Code mort retiré (branche `claude/stoic-babbage-2eimmr` de chaque dépôt)

- Frontend : 142 fichiers jamais importés (composants `components/ui` du gabarit Emergent, anciennes sections de
  frekcore, types Omega de Kiltikonet), ~9 600 lignes. Conservés car cités par une décision ou un inventaire :
  `lib/spatial/webglEngine.js` (Academy, ADR W5) et `CC2026Dashboard.jsx` (Kiltikonet, inventaire des routes).
- Python : 17 fonctions jamais référencées (anciennes intégrations Baserow/Brevo de CC2026, utilitaires privés
  remplacés) et ~340 lignes d’imports inutilisés (bibliothèque standard et tierces uniquement ; jamais un module
  local ni un `__init__.py`).
- Vérifications : aucun nom indéfini (pyflakes) ; chaque application s’importe avec exactement le même nombre de
  routes qu’avant (+1 attendu dans Laurent.ia et CVL Academy pour les routes ajoutées par l’audit).

### Lacunes : fonctions écrites mais jamais branchées (conservées, à arbitrer)

Ce ne sont pas des déchets : chacune correspond à une règle ou une protection que le code prévoit sans l’appliquer.

| Dépôt | Fonction | Conséquence |
|---|---|---|
| Kiltikonet | `omega.check_plafond_150` | Le plafond DSP2 de 150 € par détenteur n’est vérifié nulle part (lien avec R-17) |
| Kiltikonet | `finance_core.ensure_finance_core_indexes`, `finance_processor_evidence.ensure_processor_evidence_indexes` | Index uniques du grand livre (dont `idempotency_key`, `stripe_event_id`) jamais créés : doublons possibles |
| Kiltikonet | `finance_core.post_entry`, `record_stripe_balance_transaction`, `finance_treasury.record_bank_evidence`, `finance_expense_identity.backfill_expense_ids` | Écritures comptables et preuves bancaires/Stripe jamais enregistrées par ces chemins |
| Kiltikonet | `frek_silent_service.dispatch_to_frekcore` | Les activations FREK ne sont jamais envoyées à frekcore par ce service |
| Kiltikonet | `sovereign_authority.require_sovereign_capability` | Contrôle de capacité souveraine jamais appliqué |
| Kiltikonet | `data_policy.policy_for`, `missing_policies`, `product_data_ownership.owner_for` | Politique de données et propriété des collections jamais contrôlées à l’exécution |
| Kiltikonet | `ses_service.send_admin_alert` | Aucune alerte e-mail admin envoyée |
| frekcore | `security.policies.rate_limit_dep` | La limitation de débit par client n’est appliquée à aucune route |
| frekcore | `offline_transport.legacy_sync_status`, `dedupe_envelope_ids` | Synchronisation hors ligne par lots incomplète |
| CVL Academy | `economy_workbook_runtime.evaluate_offer_unit_economics`, `evaluate_offer_phase`, `set_phase_state` | Garde-fous économiques et de phase des offres jamais appliqués |
| CVL Academy | `collection_agent.register_promise_to_pay` | Promesse de paiement jamais enregistrable |
| CVL Academy | `production_gates.evidence_graph_gate` | Contrôle d’intégrité du graphe de preuves absent des portes de production |
| CVL Academy | `physical_delivery.has_capacity` | Capacité des sessions présentielles jamais vérifiée (surréservation possible) |
| CVL Academy | `db.close_db` | Connexion Mongo jamais fermée à l’arrêt (sans gravité) |
| KORA | `reputation_routes.validate_content_text` | Filtre de mots interdits jamais appliqué au contenu publié |
| Laurent.ia | `tenant_factory.iter_agents_allowed`, `value_estimator.all_ratios` | Filtre d’agents par offre inutilisé ; la docstring de `all_ratios` affirme un usage inexistant |

## CVL Academy : suite de tests remise au vert (demande du propriétaire)

La CI GitHub d’Academy ne démarre plus depuis le 2026-10-17 ; les échecs de `main` sont passés inaperçus.
Reproduction dans un environnement identique à la CI (Python 3.11, `requirements.txt`) : **126 échecs et
4 erreurs sur `main`**, aucun introduit par l’audit (liste identique avant/après).

| Contrôle CI | `main` | Branche `claude/stoic-babbage-2eimmr` |
|---|---|---|
| pytest backend | 126 échecs, 4 erreurs | **2 915 réussis, 0 échec** |
| flake8 | 453 signalements | **0** |
| Détecteur de secrets du dépôt | 2 signalements (fausse clé de test) | **propre** |
| bandit (moyen/haut) | 3 (clés FREK Trust dans `/tmp`) | **0** |
| pip-audit | 4 vulnérabilités `cryptography` 46 | **0** (`cryptography` ≥ 50.0.2) |
| ESLint frontend | 19 erreurs | **0** (18 avertissements) |
| Build frontend | réussi | réussi |

Causes : dérive des dépendances (exigences en `>=`), règles durcies les 17–19 septembre sans mise à jour des
tests, et défauts des tests eux-mêmes. Aucune règle métier n’a été assouplie pour faire passer un test.

Défauts **du produit** trouvés et corrigés en chemin :

- **Sécurité** : `GET /canonical/formations/{code}/delivery-architecture` n’exigeait qu’un compte connecté alors
  que le pare-feu IP (c62626d7) annonçait le droit `academy.admin.read` ; l’outil d’application avait écrit des
  `\n` littéraux et le contrôle n’a jamais été posé.
- **Régression** : depuis #158, une formation 100 % présentielle ne pouvait plus mener à la certification.
- **Pannes** : tableau de bord Fondateur (3 appels API jamais insérés, même corruption `\n`) et tableau de bord Jury
  (plantage dès qu’un dossier attend une décision).
- **Panne silencieuse** : échec de lecture de l’historique des paiements affiché comme « en attente ».
- **Sécurité** : clé privée FREK Trust écrite dans `/tmp` avec des droits par défaut ; `cryptography` vulnérable.
- **MCP** : outil public sans annotation de lecture seule ; fiche canonique sans `name`.

### Branche de sécurité jamais fusionnée : `security/ip-firewall-20260919`

Environ 25 commits de durcissement du 19 septembre, **sans aucune PR** : catalogue externe minimal, formations
internes sur autorisation explicite, lecture directe des modules verrouillés refusée, progression strictement
personnelle, pas de cartes sources en production. Fusion d’essai sur la branche d’audit : 3 conflits mineurs
résolus, flake8 propre, **2 923 tests réussis, 5 échecs**, dont 3 qui relèvent d’un **arbitrage produit** :
`main` a ajouté au catalogue public l’indication d’autorité canonique, la branche réduit ce catalogue au strict
minimum et masque toute formation non commercialisée publiquement. Non intégrée : décision du propriétaire.

### Tests de bout en bout (Playwright) d’Academy

Sur `main` : 26 échecs. Sur la branche, en conditions de CI (`CI=1`, 2 workers, 2 nouvelles tentatives) :
**186 réussis, 0 échec**, 2 tests qui ne passent qu'à la seconde tentative. Build de production réussi. Commits
`dba4d897` et suivant (produit), `657c8320` et suivant (specs).

Six défauts produit réels, révélés par ces tests, sont corrigés :

| Type | Défaut | Correction |
|---|---|---|
| Mauvais CTA / panne | Le bouton d’envoi du Mentor était **impossible à cliquer** : la fenêtre modale, placée dans le contexte d’empilement `z-10` de `SpatialWorldFrame`, passait sous le pied de page légal et sous le centre d’accessibilité | Fenêtre rendue dans `<body>` (portail) ; le centre d’accessibilité s’efface pendant l’ouverture |
| Mauvais responsive | Feuille Mentor mobile coupée de 10,8 px en bas : la profondeur `translateZ(30px)` au repos agrandissait l’overlay plein écran de 2,6 % | Option `depth={false}` de `ContextFrame` pour les overlays plein écran |
| Panne silencieuse | Barre supérieure `sticky` inopérante : `overflow:hidden` sur le cadre spatial en faisait un conteneur de défilement, si bien que la navigation disparaissait dès que l’on défilait | `overflow: clip` (repli `hidden` si non pris en charge) |
| **Panne silencieuse (conversion)** | Un visiteur arrivé par « Commencer » **perdait ses réponses dans le tunnel d’acquisition** (retour à l’étape 1). Pendant l’animation de sortie, l’ancien conteneur affichait déjà le tunnel, qui était ensuite monté une seconde fois ; la télémétrie du tunnel partait aussi deux fois | `RouteTransition` fige la location de chaque conteneur (`<Routes location>`) |
| Accessibilité | Le focus clavier était volé 1,2 s après chaque réponse du tunnel (paramètre d’URL traité comme un changement de page) ; en développement, il l’était aussi dès le premier chargement, au détriment du lien d’évitement | `RouteAccessibility` ne réagit qu’à un vrai changement de page |
| Doublon / régression sémantique | Deux mécanismes de restauration du défilement en concurrence : `Layout` (par chemin, 11 sept.) écrasait ACA-0023 (par entrée d’historique, 17 sept.). Le retour arrière revenait en haut ; une navigation normale réappliquait une position périmée | Appel retiré de `Layout` ; ACA-0023 seul fait foi |

Les autres échecs venaient de specs en retard sur des décisions produit déjà prises :
- `/dashboard` remplacé par `/app` ;
- barre supérieure unique (809b56e2) ;
- espace `super_admin` ;
- contexte de compte du formateur ;
- illustration plein format sur mobile (593c3cb0) ;
- focus sans zoom (f02abcd3) ;
- `POST /api/mentor/context` est une lecture, pas une mutation.

Restent à arbitrer, comme lacunes :
- un troisième mécanisme de retour, `ReturnPositionTracker` (reprise entre sessions, à usage unique), qui ne gêne pas ACA-0023 mais en recouvre une partie ;
- `captureRouteDepth` et `restoreRouteDepth` de `lib/depthMemory.js`, que seuls les tests utilisent désormais ;
- les fichiers `*-mobile.webp`, qui ne sont plus servis depuis 593c3cb0.

## Autorité canonique, orientation, certification externe (DEC-0018, 2026-10-22)

Décision du propriétaire : trois notions strictement séparées, et jamais France compétences ou France Travail
présentés comme une accréditation de CVLN Academy. Constats et corrections (`CVL-ACADEMY`, branche d’audit) :

| Constat | Correction |
|---|---|
| `canonical_authority` mêlait l’autorité (`domain`) et la destination (`route`) ; aucune notion de certification externe | Trois champs : `canonical_authority {domain}`, `orientation {domain, route}`, `external_certification` (null sans preuve complète : autorité, référence, preuve, vérifié par, date) |
| Page d’accueil : marque Qualiopi sans preuve, logos Afdas et France Travail hébergés chez des tiers (R-27) | Logos retirés ; financeurs cités à titre d’information, mention « ni partenariat, ni accréditation, ni certification » |
| API publique et MCP : notes de calibration ROME/RNCP servies sans compte | Réservées au personnel ; le MCP ne les expose plus |
| Rien dans le backend ne revendiquait Qualiopi (`services/quality_advanced.py` l’exclut explicitement) ; la page Documentation était déjà conforme | Inchangés |

Tests : backend 2 927 réussis (dont le contrat des trois notions et le refus d’une certification sans preuve),
flake8 propre ; e2e de la page d’accueil et du catalogue réussis ; build de production réussi.

## Fusions (2026-10-25)

| Dépôt | PR | Commit vérifié | Vérification | Exceptions |
|---|---|---|---|---|
| ioscvln/CVLN-ios-v1 | #2 | `d1984fc3` | CI GitHub verte | — |
| frekcore/CVLNAgentfactory | #28 | `e81f52a1` | CI GitHub verte | — |
| kora2024/Kora-app | #33 | `496278c8` | CI GitHub verte | — |
| kimoune2025-a11y/Foundation-Cvln | #8 | `be85a62a` | CI GitHub verte | — |
| kimoune2025-a11y/Command-center | #9 | `cc4127fe` | CI GitHub verte (9/9), données régénérées depuis Foundation `main` | — |
| cultureconnectorg/Cvln-ios-v.1 | #2 | `48befc01` | 2/2 jobs rejoués localement (DEC-0019) | — |
| cultureconnectorg/frekcoreAout2026 | #27 | `443204ba` | 6/6 jobs bloquants rejoués localement | 3 jobs `continue-on-error` en échec, comme sur `main` ou à cause de l’environnement |
| cultureconnectorg/CVL-ACADEMY | #174 (fusionnée par le propriétaire) et #176 | `9ec06c3f`, puis `13ef4b40` | 14 jobs rejoués localement | mypy (101 erreurs, contre 104 sur `main`) ; passe e2e spatiale (4 échecs, contre 5 sur `main`) |
| cultureconnectorg/Laurent.ia | #57 | `9455d0d0` | 5/6 jobs au vert (dont pip-audit après correction de 8 vulnérabilités) | embedded-inference : modèle non téléchargeable ici (proxy 403) |
| cultureconnectorg/Kiltikonet-Aout2026 | #466 | `a85f650f` | 8/10 groupes au vert (contracts, backend, live, frontend, render) | Prérendu sans API joignable (7 tests) ; WebKit indisponible |

Corrections apportées pendant la vérification :
- black et isort sur trois fichiers d’Academy ;
- 8 vulnérabilités de dépendances corrigées dans Laurent.ia ;
- fonctions Baserow rétablies dans Kiltikonet (exigées par un contrat de `main`, que le nettoyage du code mort avait cassé).

Rejeu local : extraction propre du commit exact, environnements Python recréés depuis les fichiers de dépendances, MongoDB 7 (7.0.14 pour Kiltikonet), Node 20 ou 22 selon le job, `CI=true`.
