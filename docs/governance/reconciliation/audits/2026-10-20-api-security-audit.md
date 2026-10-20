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
