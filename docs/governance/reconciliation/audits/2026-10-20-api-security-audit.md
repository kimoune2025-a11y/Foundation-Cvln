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

## Risques non corrigés (propositions, à reporter dans `05-contradictions.md`)

Non inscrits directement dans 05 : toute modification de 05 doit s'accompagner de la régénération de
`backend/data/` de Command Center, dont la CI compare l'instantané à Foundation `main`.

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
| Fausse route | CVL Academy | `ExpertWorkspace` appelait `/api/api/...` : 404 pour tout expert | Préfixe corrigé, test |
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
