# STATUS — CVLN Ecosystem Reconciliation

- **Mission :** CVLN-GOV-RECON-001 (mandat v0.1.0, DRAFT)
- **Dernière mise à jour :** 2026-10-26 (FREKCORE : secret CVL Brain et comptes du personnel configurés, application du personnel publiée sur `frekcore-staff.onrender.com` ; Academy redéployée ; DEC-0022)
- **Statut global : en cours — Phase 6 (exécution) : Command Center et Agent Factory déployés sur Render ; Foundation non déployée (blueprint prêt) ; X-21 en échec (Agent Factory endormie)** (voir [09](09-integration-matrix.md))

## 1. Avancement par phase

| Phase | Statut | Livrables | Limite principale |
|---|---|---|---|
| 0 — Protection et cadrage | **Terminé avec preuves** (dépôt d’ancrage) | [00](00-scope-and-access.md) | Périmètre de l’écosystème partiel |
| 1 — Inventaire | **Rouvert et étendu** : 18 dépôts, 15 survolés (EV-P6-20), TECH-05 à TECH-12 | [01](01-source-register.md), [02](02-entity-inventory.md) | 2 dépôts sur l’ensemble ; 22 composants nommés (17 entrées du mandat §5) sans dépôt connu ; 12 entités historiques ajoutées (SRC-29) |
| 2 — Relations | **Vérifié** contre le schéma original (EV-P4-01) ; baseline v3 (EV-P6-21) | [03](03-relation-map.md) | — |
| 3 — Contradictions | **Ouverte : C-04** (C-20 à C-23 tranchées : DEC-0011 à DEC-0014) ; risques R-20 (critique) et R-21 | [05](05-contradictions.md), [04](04-evidence-ledger.md) | Résolution = arbitrage |
| 4 — Arbitrage | **Tranché par défaut** (DEC-0007) — 13 arbitrages sur la base du mandat | [06](06-decision-log.md) §5 | Restent C-04 et le statut juridique (pièces nécessaires) |
| 5 — Architecture cible | **Proposé** (non validé) | [07](07-target-architecture.md), [08](08-execution-roadmap.md) | Dépend de la Phase 4 |
| 6 — Exécution contrôlée | **En cours** — correctifs et hub de pilotage fusionnés ; liaisons Command Center ↔ Foundation (X-01 à X-08, dont synchronisation automatique et vue Architecture) fusionnées et testées de bout en bout (EV-P6-14, EV-P6-16) | [08](08-execution-roadmap.md), [09](09-integration-matrix.md) | Déploiement non réalisé ; composants IA sans code |

## 2. Branches

**`main` (2026-10-12) :**

| Dépôt | `main` | Contenu intégré | CI sur `main` |
|---|---|---|---|
| Foundation-Cvln | `9c832bc` | CI d’intégrité (`caa58ff`), baseline v2 (`ba02a44`), `GET /api/contact` protégé (`732e6f9`), documents de mission (`559a459`), retrait de `/api/status` (`9c832bc`, EV-P6-15) | `Registry integrity` : success |
| command-center | `5923b20` | Hub de pilotage (DEC-0009), outil privé (DEC-0006), pile autonome (EV-P6-12), baseline v2 (`e570fec`), CI réparée (`db5c814`, EV-P6-13), liaisons Foundation (`28db5c9`), modèle `.env` (`77295c4`), vue Architecture et synchronisation automatique (`098300f`, `5923b20`, EV-P6-16) | `CI` (backend, frontend, docker, foundation-integration) : success, run 38274711640 |

Fusionner sur `main` ne vaut pas autorisation de déploiement en production.

**Fusions du 2026-10-18 (à la demande du propriétaire, CI verte) :** Foundation `main` = `d5756ea` (kimoune2025-a11y/Foundation-Cvln#1 : baseline v3, DEC-0011 à DEC-0014) ; command-center `main` = `ab629c1` (kimoune2025-a11y/Command-center#1 : instantané v3, guide Render ; `foundation-integration` verte, run 39101003108) ; Metacvln-Sept2026 `main` = `d4e19d2` (cultureconnectorg/Metacvln-Sept2026#6 : `registry_id` sur l’annuaire, tests locaux 5/5 ; pas de CI dans ce dépôt).

Branches restantes, toutes contenues dans `main` (aucun travail non intégré) : Foundation `claude/p6-registry-integrity-ci`, `claude/registry-v2`, `claude/p6-contact-admin-auth`, `claude/foundation-drop-template-status`, `claude/elegant-pascal-b0qe12` (documents) ; command-center `claude/cc-group-hub`, `claude/cc-sovereign`, `claude/p6-registration-viewer-only`, `claude/cc-integration`, `claude/cc-ecosystem-map`.

## 3. Bloquants

| Bloquant | Détenteur | Débloque |
|---|---|---|
| ~~Rotation des identifiants et du secret JWT ; dépôt privé~~ — dépôt privé vérifié, rotation déclarée faite (EV-P6-11) | Laurent CŒURVOLAN | R-13 (réduit) |
| ~~Déploiement de Foundation~~ — `cvln-foundation` en ligne sur Render (Next.js 15.5.28 depuis le 2026-10-23, EV-P6-28) | Laurent CŒURVOLAN | X-21 |
| Agent Factory sur l’offre gratuite : endormie après 15 min, X-21 échoue (EV-P6-26) | Laurent CŒURVOLAN (offre Render) | X-21 fiable |
| Jeton partagé `CONTACT_ADMIN_TOKEN` / `FOUNDATION_CONTACT_TOKEN`, à poser hors Git | Laurent CŒURVOLAN | Import des prospects en production |
| Protection de `main` (2 dépôts) | Laurent CŒURVOLAN | R-01 |
| Couche IA : Agent Factory et Laurent.ia ont du code et des API (EV-P6-20) ; Intelligence OS = spécification ; raccordement au registre sur décision (HIST-01, C-20, C-22) | Laurent CŒURVOLAN | Raccordement de la couche IA |
| Fichiers d’identifiants ou de clé suivis, dont un dans un dépôt public (R-20) | Laurent CŒURVOLAN | Sécurité |
| **R-20 confirmé** : clé privée de signature Ed25519 publique dans `ioscvln/CVLN-ios-v1` (EV-P6-24) — **corrigé** : clé révoquée et remplacée, fusionné sur CI verte (ioscvln/CVLN-ios-v1#1, `5077a04`, EV-P6-25) ; restent : supprimer l’ancien fichier sur le serveur, définir `EXPORT_SIGNING_KEY_PATH`, décider privé / réécriture d’historique ; miroir privé `cultureconnectorg/Cvln-ios-v.1` en attente de CI | Laurent CŒURVOLAN | Intégrité des dossiers de preuve |
| GitHub Actions ne démarre plus sur `cultureconnectorg/CVL-ACADEMY` (jobs terminés en 2 s sans journal, y compris sur `main` depuis le 2026-10-17) : quota GitHub Actions du compte, **retour attendu au prochain cycle mensuel** (propriétaire, 2026-10-18) ; Academy, FREKCORE et Kiltikonet attendent leur CI (DEC-0015) | Laurent CŒURVOLAN (paramètres de facturation GitHub) | CI d’Academy |
| Quota GitHub Actions de `cultureconnectorg` épuisé : 6 dépôts sans CI (R-29) ; correctifs de sécurité fusionnés sans CI (DEC-0019 à DEC-0021) | Laurent CŒURVOLAN | DEC-0015 de nouveau applicable |
| CORS de FREKCORE : ajouter `https://frekcore-staff.onrender.com` à `CORS_ORIGINS` (service Render `frekcoreAout2026`, valeur actuelle non lisible par Claude) pour que l’application du personnel (`/scan`, en ligne depuis le 2026-10-26) puisse appeler l’API | Laurent CŒURVOLAN | Application du personnel CC2026 |
| Pièces juridiques (structure de tête, détention, PI) — ne bloque pas les raccordements techniques | Laurent CŒURVOLAN | C-04, statuts juridiques |

**Audit routes / API / sécurité du 2026-10-20** ([rapport](audits/2026-10-20-api-security-audit.md)) : 12 correctifs sur 8 dépôts, branche `claude/stoic-babbage-2eimmr` de chacun, non fusionnés (DEC-0015) ; risques proposés R-22 à R-26, à reporter dans 05 avec régénération de `backend/data/` de Command Center. **Exception à DEC-0015 (2026-10-25)** : le propriétaire a demandé de fusionner sans GitHub Actions (« fais sans github actions ») pendant le blocage de facturation du compte `cultureconnectorg` ; chaque dépôt concerné n’est fusionné qu’après exécution locale de tous ses jobs de CI sur le commit exact, journaux consignés dans le rapport d’audit. DEC-0018 : autorité canonique, orientation et certification externe séparées.

## 4. Prochaine action autorisée

1. **[Propriétaire]** Render → New → **Blueprint** → `kimoune2025-a11y/Foundation-Cvln` (fichier `render.yaml`) : crée `cvln-foundation`. Puis Command Center → Environment : `FOUNDATION_API_URL = https://<url de Foundation>/api`. Dans Command Center : Admin → Connexions Foundation → « Contrôler les connexions ». Prospects : poser `MONGO_URL` et `CONTACT_ADMIN_TOKEN` (Foundation) = `FOUNDATION_CONTACT_TOKEN` (Command Center).
2. **[Propriétaire]** Passer Foundation et Agent Factory sur une offre Render toujours éveillée : sans elle, aucune liaison entre services ni aucun cycle autonome ne tient (EV-P6-27). Charte d’autonomie validée comme cadre (DEC-0017) : SHADOW et simulation maintenus jusqu’à validation des preuves de fonctionnement, des contrôles de permission, de la traçabilité et du mécanisme d’arrêt ; production agent par agent sur son approbation.
3. **[Claude]** Fusionner sur CI verte : frekcore/CVLNAgentfactory#29 (cycles planifiés), kimoune2025-a11y/Command-center#10 (supervision, après la PR Foundation de PROP-17), cultureconnectorg/Kiltikonet-Aout2026#469 (FREK-ID, CI du compte bloquée) ; puis vérifier X-21 à X-24 dans les journaux.
3. **[Claude]** À chaque changement des documents 00, 05 ou 06 : régénérer `backend/data/` de Command Center (`python scripts/build_data.py`), sinon la CI `foundation-integration` échoue (contrôle voulu).
4. **[Claude]** Les 7 briques de référence sont raccordées au registre (X-14 à X-20, EV-P6-23) : fusionnés sur CI verte : Meta CVLN, Agent Factory, Laurent.ia, KORA ; **en attente** (CI GitHub bloquée sur le compte `cultureconnectorg`, DEC-0015) : Academy, FREKCORE, Kiltikonet. Fusion uniquement sur CI verte observée (DEC-0015). Ensuite : proposer à chaque brique (Academy, Agent Factory, Laurent.ia, Kiltikonet, KORA, FREKCORE) son `registry_id` et la lecture de `/api/registry/export` ; SRC-R4 n’est plus prioritaire (non canonique, DEC-0014) à [01](01-source-register.md) et [02](02-entity-inventory.md), puis à la matrice [09](09-integration-matrix.md).
5. **[Propriétaire]** Archiver si souhaité les dépôts non canoniques (DEC-0014 ; aucune suppression). **[Arbitrage]** disque persistant Render ou stockage objet ; questions ouvertes de [06](06-decision-log.md) §4 et C-04.
