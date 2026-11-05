# 10 — CVLN Technology Gap Register

- **Mission :** CVLN-GOV-RECON-001
- **Date :** 2026-11-05
- **Statut :** DRAFT. C'est un constat sur preuves, pas une feuille de route validée : l'ordre de priorité (§5) est une **proposition** à arbitrer.
- **Méthode reproductible :** `python3 scripts/tech-gap-scan.py <dossier des clones> docs/governance/reconciliation/10-technology-gap-scan.json --public`. Le fichier JSON donne, pour chaque technologie et chaque dépôt, le statut et le nombre de fichiers concernés. Ce dépôt est public : `--public` retire les chemins des fichiers de preuve des dépôts privés. Sans cette option, en local, la même commande les liste (jusqu’à trois par case).
- **Dépôts analysés (10) :**

| Dépôt | Brique | Commit analysé |
|---|---|---|
| frekcore/CVLNAgentfactory | Agent Factory | `ad0ed6f` |
| kimoune2025-a11y/Command-center | Command Center | `206ec41` |
| cultureconnectorg/Cvln-ios-v.1 | CVLN Intelligence OS | `035c2c2` |
| kimoune2025-a11y/Foundation-Cvln | Foundation (registre) | `dd67026` |
| cultureconnectorg/Kiltikonet-Aout2026 | Kiltikonet | `05bdbb0eb` |
| cultureconnectorg/Laurent.ia | Laurentia | `843021e` |
| cultureconnectorg/CVL-ACADEMY | CVL Academy | `bdb1913` |
| cultureconnectorg/frekcoreAout2026 | FREKCORE / FREK-ID | `e3901ed` |
| kora2024/Kora-app | KORA | `b7f856e` |
| cultureconnectorg/Metacvln-Sept2026 | Meta CVLN | `04eba55` |

## 1. Échelle des statuts

`ABSENT → IDENTIFIED → PLANNED → IMPLEMENTED → TESTED → INTEGRATED → PRODUCTION → VERIFIED`

| Statut | Ce qui le prouve | Source |
|---|---|---|
| ABSENT | Aucune trace dans le dépôt | Analyse automatique |
| IDENTIFIED | Mention dans la documentation, ou dépendance déclarée **sans aucun usage dans le code** | Analyse automatique |
| PLANNED | Inscrit dans une feuille de route validée (06, DEC) | À la main |
| IMPLEMENTED | Le code source l'utilise | Analyse automatique |
| TESTED | Le code l'utilise **et** un fichier de test l'exerce | Analyse automatique |
| INTEGRATED | Raccordé à une autre brique, liaison vérifiée de bout en bout | À la main, avec un `EV-*` (voir aussi 09) |
| PRODUCTION | En service sur un déploiement réel, preuve dans les journaux | À la main, avec un `EV-*` |
| VERIFIED | Comportement contrôlé en production : test, mesure ou audit externe | À la main, avec un `EV-*` |

**Règle : aucun faux vert.**
- **TESTED** signifie qu'un fichier de test touche la technologie, pas que les tests passent.
- Aucun statut au-dessus de TESTED n'est déduit du code.
- Les technologies qui sont des pratiques (Zero Trust, SLO, modélisation des menaces, WAF, plan de reprise, certifications ISO) sont marquées « — » : une analyse de code ne peut ni les prouver ni les infirmer.

**Limites connues :**
- Les motifs sont volontairement précis : noms de paquets, imports, appels d'API.
- Trois faux positifs détectés pendant la mise au point ont été éliminés :
  - un composant React `AgentCard` compté comme A2A ;
  - la bibliothèque d'icônes `iconoir-react` comptée comme ZKP (« noir ») ;
  - des dépendances génériques comme `cryptography` ou `grpcio` comptées comme implémentation.
- Un résultat inattendu doit être vérifié dans les fichiers de preuve du JSON avant toute décision.

## 2. Constats vérifiés en production (au-delà du code)

Ces constats ne viennent pas de l'analyse : ils sont tirés des journaux Render et des vérifications faites pendant les sessions (EV-P6-26 à EV-P6-29).

| # | Constat | Preuve | Gravité |
|---|---|---|---|
| P-1 | **L'émission de FREK-ID est en échec en production.** `FREK_EMAIL_SALT` n'est pas défini, donc `POST /api/v1/identity/emit` répond 503. | Journal FREKCORE du 2026-11-03 10:55 UTC (« required setting FREK_EMAIL_SALT is NOT set ») | **Critique** |
| P-2 | **Les sauvegardes de FREKCORE ne sont pas configurées.** Le code de sauvegarde chiffrée vers un stockage objet existe (`backend/backup/service.py`, routes `/health/backup*`), mais la clé `FREK_BACKUP_RECIPIENT_PUBLIC_KEY` et le stockage `FREK_STORAGE_BACKEND` sont absents. Les médias ne sont pas conservés non plus. La politique de sauvegarde de MongoDB Atlas n'a pas été vérifiée (UNKNOWN). | Journal FREKCORE du 2026-11-03 (« backups are NOT configured », « FREK_STORAGE_BACKEND non configure ») | **Critique** |
| P-3 | Foundation, Agent Factory, FREKCORE, Laurent.ia, Kiltikonet, Meta CVLN et Academy sont sur l'offre gratuite de Render. Ils s'endorment, et un appel entre services reçoit alors une erreur 502. | EV-P6-26, EV-P6-27 | Haute |
| P-4 | Le compte `cultureconnectorg` n'a plus de CI GitHub (quota). Les fusions se font sur vérification locale (DEC-0019 à DEC-0021). | R-29 | Haute |
| P-5 | Les agents sont en Production (DEC-0022), mais les cycles autonomes restent en `dry_run`. Aucun agent n'agit encore réellement. | DEC-0022, code `autonomous_routes.py` | Information |
| P-6 | L'application du personnel FREKCORE (`frekcore-staff.onrender.com/scan`) est en ligne. Sa connexion à l'API n'a pas encore été observée dans les journaux. | STATUS, 2026-10-26 | Moyenne |

## 3. Lecture par famille

Pour chaque technologie, le statut retenu est le meilleur atteint dans l'ensemble des dépôts. Les chiffres comptent des technologies.

| Famille | TESTED | IMPLEMENTED | IDENTIFIED | ABSENT | Constat |
|---|---|---|---|---|---|
| Protocoles et interopérabilité | 3 | 0 | 1 | 13 | MCP (Kiltikonet, Academy), OpenAPI et WebSocket. **Absents partout :** A2A, ANP, AG-UI, WebMCP, ACP, AP2, x402, AsyncAPI, gRPC, WebRTC, CloudEvents, OpenID Federation, SCIM. Aucune stratégie multi-protocoles : chaque brique a ses propres connecteurs. |
| Identité et souveraineté | 7 | 2 | 3 | 3 | Socle réel : DID `did:frek` et attestations vérifiables (FREKCORE), passkeys (Kiltikonet testé, FREKCORE et Academy implémentés), OAuth/OIDC, droits par périmètre (Command Center testé). **Absents :** SAML, SPIFFE/SPIRE, attestation à distance/TEE. **Déclarés seulement :** HSM, KMS. Multi-tenancy testée dans Kiltikonet, Laurentia et Academy, **absente de FREKCORE**. |
| IA et autonomie | 6 | 2 | 3 | 7 | Orchestration, simulation, validation humaine, routage de modèles, inférence locale (Laurentia, modèle quantifié). **Absents :** découverte d'agents, délégation, fine-tuning/LoRA, distillation, apprentissage fédéré, IA en périphérie, neuro-symbolique. Évaluations d'agents implémentées sans test. Traces LLM : documentation seulement. |
| Infrastructure | 2 | 3 | 5 | 6 | Docker, Compose, stockage S3 (FREKCORE testé, **non configuré en production**), tâches de fond. **Absents :** WASM, libp2p/IPFS, Terraform, Ansible, GitOps, edge workers. Kubernetes, Kafka, NATS, Redis et Temporal : documentation seulement. Aucune infrastructure décrite en code au-delà de `render.yaml`. |
| Données et connaissances | 11 | 2 | 1 | 3 | MongoDB partout, bus d'événements interne au processus, journal d'événements, graphe de relations (FREKCORE, Kiltikonet, Academy), JSON-LD (Kiltikonet), RAG. **Absents :** CQRS, capture de changements, lakehouse. Pas de base vectorielle testée. Pas de courtier de messages : le bus vit dans chaque processus. |
| Cryptographie et preuves | 5 | 1 | 3 | 3 | Signatures Ed25519, arbres de Merkle (FREKCORE, KORA), ancrage OpenTimestamps, chaînage de hachés, chiffrement applicatif (Laurentia testé). **Absents :** ZKP, MPC/chiffrement homomorphe, confidentialité différentielle. Rotation des clés : FREKCORE seulement, sans test. Coffre à secrets, post-quantique, C2PA : documentation seulement. |
| Sécurité de la chaîne logicielle | 4 | 3 | 2 | 1 | `pip-audit`/`npm audit` en CI dans 9 dépôts (KORA : documentation seulement), limitation de débit, en-têtes de sécurité. SAST et détection de secrets : **Academy seule**. SBOM et signature d'artefacts : documentation seulement. **Absent :** DAST. Tests d'intrusion scriptés : Academy. |
| Observabilité et fiabilité | 4 | 2 | 2 | 1 | Sondes de santé, journal d'audit, métriques Prometheus (FREKCORE, Kiltikonet), chaos et tests de charge (FREKCORE, scripts sans exécution prouvée). **OpenTelemetry : déclaré dans 4 dépôts, utilisé dans aucun.** Sentry : documentation seulement. **Absent :** journalisation structurée. SLO : pratique non documentée. |
| Ingénierie | 6 | 1 | 2 | 2 | Tests unitaires partout, tests de contrat (FREKCORE, Kiltikonet, Academy, KORA), Playwright (Kiltikonet, Academy, Cvln-ios), lint, versions d'API `/v1`. **Absents :** tests par propriétés, tests de mutation. Rust et Go : documentation seulement. |
| Économie numérique | 7 | 0 | 1 | 0 | Paiements, abonnements, portefeuille/cashless, partage de revenus, signature électronique (Kiltikonet, Academy), facturation électronique (Academy), droits d'œuvres (KORA). Smart contracts : documentation seulement. |
| Web et expériences | 2 | 4 | 2 | 0 | PWA (FREKCORE testé), Capacitor, design system, JSON-LD/SEO (Kiltikonet). i18n : Kiltikonet, FREKCORE (Command Center a des textes FR/EN maison, non détectés). **Pas de tests d'accessibilité automatisés.** |
| Conformité | 4 | 0 | 0 | 0 | Parcours RGPD (6 dépôts testés), SPDX (FREKCORE), registre de décisions, eIDAS (Kiltikonet, FREKCORE). ISO 27001, ISO 42001, SOC 2, AI Act : aucune procédure ni preuve d'audit. |

## 4. Écarts aux hypothèses de départ

L'audit corrige plusieurs hypothèses de la liste initiale :

- **DID n'est pas absent :** FREKCORE a sa propre méthode `did:frek` et des attestations vérifiables testées (`backend/did/`). L'écart réel, c'est l'**interopérabilité** : aucune autre méthode DID, aucun portefeuille EUDI raccordé.
- **Le bus d'événements existe et il est testé** (Agent Factory, FREKCORE, Laurentia, Academy), mais il est **interne à chaque processus**. Il n'y a pas de courtier entre briques, donc pas de bus d'écosystème.
- **Les sauvegardes de FREKCORE sont codées, testées, mais inactives en production** (P-2). C'est une lacune de configuration, pas de développement.
- **OpenTelemetry n'est pas « à acquérir » :** il est déjà déclaré en dépendance, mais rien ne s'en sert. L'observabilité réelle se limite aux sondes de santé et à Prometheus dans deux dépôts.
- **Le risque le plus grave n'était pas dans la liste :** l'émission de FREK-ID est hors service en production (P-1).

## 5. Plan proposé (P0 à P4) — à arbitrer

| Priorité | Chantier | Brique | État constaté | Prochain statut visé |
|---|---|---|---|---|
| **P0** | Rétablir l'émission de FREK-ID : poser `FREK_EMAIL_SALT`, après avoir vérifié qu'aucune identité n'existe avec un autre sel | FREKCORE | 503 en production | PRODUCTION |
| **P0** | Activer les sauvegardes chiffrées : clé `FREK_BACKUP_RECIPIENT_PUBLIC_KEY`, stockage S3, puis un test de restauration réel. Vérifier les sauvegardes Atlas. | FREKCORE, Atlas | Codé, testé, inactif | VERIFIED |
| **P0** | Services toujours actifs (offre Render payante) pour le cœur : Foundation, Agent Factory, FREKCORE | Plateforme | Endormis (502) | PRODUCTION |
| **P0** | Rétablir la CI de `cultureconnectorg` | Plateforme | Bloquée (quota) | — |
| **P1** | Observabilité réelle : OpenTelemetry branché (traces entre briques), journaux structurés, suivi d'erreurs, puis SLO écrits | Tous | Déclaré, non utilisé | INTEGRATED |
| **P1** | Sécurité de la chaîne logicielle : SAST et détection de secrets étendus de 1 à 10 dépôts, SBOM, signature des images | Tous | Academy seule | TESTED |
| **P1** | Contrôle des droits des jetons de service dans Agent Factory (périmètres stockés mais non vérifiés, R-22) | Agent Factory | Implémenté sans test | TESTED |
| **P1** | Multi-tenancy dans FREKCORE | FREKCORE | Absente | TESTED |
| **P2** | Contrats publiés : OpenAPI pour chaque API, AsyncAPI pour les événements, CloudEvents comme format commun | Meta CVLN (gouvernance des API) | 3 dépôts sur 10 | INTEGRATED |
| **P2** | Courtier d'événements entre briques (NATS ou équivalent) pour remplacer les bus internes | FREKCORE, Agent Factory | Bus interne seulement | INTEGRATED |
| **P2** | A2A et découverte d'agents (carte d'agent publiée) | Agent Factory, Laurentia | Absent | IMPLEMENTED |
| **P2** | Graphe de connaissances commun aux briques, adossé au registre `ENT-*` | Meta CVLN, Foundation | Graphes locaux | INTEGRATED |
| **P2** | Rotation des clés et coffre à secrets | FREK-ID | Rotation sans test, pas de coffre | TESTED |
| **P3** | KMS/HSM et PKI d'écosystème | FREK-ID | Documentation seulement | IMPLEMENTED |
| **P3** | WebMCP et AG-UI (Kiltikonet) | Kiltikonet | Absent | IMPLEMENTED |
| **P3** | Tests de charge et de résilience exécutés et mesurés | FREKCORE puis tous | Scripts sans exécution prouvée | VERIFIED |
| **P3** | Infrastructure décrite en code (au-delà de `render.yaml`) et GitOps | Plateforme | Absent | IMPLEMENTED |
| **P3** | Tests d'accessibilité automatisés (WCAG 2.2) | Interfaces publiques | Absent | TESTED |
| **P4** | Paiements agentiques (AP2, x402), WASM, ZKP, MPC, post-quantique, C2PA, apprentissage fédéré | Selon l'usage | Absent | Veille |
| **P4** | Certifications (ISO 27001, ISO 42001, SOC 2) et conformité AI Act : procédures et preuves | Groupe | Aucune preuve | Veille, puis PLANNED |

## 6. Mise à jour

- Relancer l'analyse après chaque série de fusions, avec la commande de l'en-tête.
- Un passage à INTEGRATED, PRODUCTION ou VERIFIED s'écrit à la main dans ce document, avec l'identifiant `EV-*` de la preuve (04) et, pour une liaison, la ligne de 09.

## 7. Matrice complète (analyse du 2026-11-05)

Légende :
- `T` : TESTED
- `I` : IMPLEMENTED
- `i` : IDENTIFIED (documentation, ou dépendance sans usage dans le code)
- `·` : ABSENT
- `—` : pratique, non mesurable par analyse de code

| Catégorie | Technologie | CVLNAgentfactory | Command-center | Cvln-ios-v.1 | Foundation-Cvln | Kiltikonet-Aout2026 | Laurent.ia | cvl-academy | frekcoreAout2026 | kora-app | metacvln-sept2026 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Protocoles | MCP (Model Context Protocol) | · | · | · | · | T | · | T | i | i | · |
| Protocoles | A2A (Agent2Agent) | · | · | · | · | · | · | · | · | · | · |
| Protocoles | ANP (Agent Network Protocol) | · | · | · | · | · | · | · | · | · | · |
| Protocoles | AG-UI | · | · | · | · | · | · | · | · | · | · |
| Protocoles | WebMCP | · | · | · | · | · | · | · | · | · | · |
| Protocoles | ACP (Agent Commerce/Communication Protocol) | · | · | · | · | · | · | · | · | · | · |
| Protocoles | AP2 (Agent Payments Protocol) | · | · | · | · | · | · | · | · | · | · |
| Protocoles | x402 (paiements HTTP 402) | · | · | · | · | · | · | · | · | · | · |
| Protocoles | OpenAPI 3.x (contrat publie) | · | · | · | · | T | · | T | I | · | · |
| Protocoles | AsyncAPI | · | · | · | · | · | · | · | · | · | · |
| Protocoles | GraphQL / Federation | · | · | · | · | · | · | · | · | i | · |
| Protocoles | gRPC | · | · | · | · | · | · | · | · | · | · |
| Protocoles | WebRTC | · | · | · | · | · | · | · | · | · | · |
| Protocoles | WebSocket | i | · | · | · | T | i | i | i | i | i |
| Protocoles | CloudEvents | · | · | · | · | · | · | · | · | · | · |
| Protocoles | OpenID Federation | · | · | · | · | · | · | · | · | · | · |
| Protocoles | SCIM | · | · | · | · | · | · | · | · | · | · |
| Identite | DID (identifiants decentralises) | · | · | i | · | T | · | i | T | · | I |
| Identite | Verifiable Credentials | · | · | · | · | · | · | i | T | · | · |
| Identite | OpenID Connect | · | · | · | · | · | I | T | T | · | · |
| Identite | OAuth 2.x | · | · | · | · | T | T | T | T | T | · |
| Identite | WebAuthn / FIDO2 / passkeys | · | · | i | · | T | · | I | I | · | · |
| Identite | SAML 2.0 | · | · | · | · | · | · | · | · | · | · |
| Identite | SPIFFE / SPIRE | · | · | · | · | · | · | · | · | · | · |
| Identite | mTLS | I | · | I | · | · | · | i | I | · | I |
| Identite | PKI / certificats X.509 | i | · | · | · | · | · | I | I | · | i |
| Identite | HSM | i | · | · | · | · | · | · | i | · | · |
| Identite | KMS (gestion de cles) | · | · | i | · | · | · | · | i | i | · |
| Identite | Remote attestation / TEE | · | · | · | · | · | · | · | · | · | · |
| Identite | ABAC / ReBAC / policy-as-code | · | · | · | · | i | · | · | · | · | · |
| Identite | Capability-based security (scopes) | I | T | · | · | I | · | I | · | · | · |
| Identite | Multi-tenancy (isolation par organisation) | i | · | i | · | T | T | T | · | · | i |
| Identite | Zero Trust | — | — | — | — | — | — | — | — | — | — |
| IA | Orchestration multi-agents | T | · | · | · | T | T | · | · | · | T |
| IA | Decouverte d'agents (registre) | · | · | · | · | · | · | · | · | · | · |
| IA | Delegation d'agents | · | · | · | · | · | · | · | · | · | · |
| IA | Evaluation d'agents (evals) | · | · | · | · | I | · | I | · | · | · |
| IA | Observabilite des agents (traces LLM) | · | · | · | · | i | · | · | · | · | · |
| IA | Simulation / dry-run | T | · | · | · | T | T | T | I | I | · |
| IA | Sandboxing d'execution | i | i | · | i | · | i | i | · | i | i |
| IA | Memoire d'agent persistante | · | · | · | · | I | · | · | I | · | · |
| IA | Human-in-the-loop (validation humaine) | I | · | I | · | · | T | T | · | I | I |
| IA | Routage de modeles | T | · | · | · | i | · | · | · | i | · |
| IA | Registre de modeles | i | · | · | · | i | i | · | · | i | · |
| IA | Inference locale / modeles embarques | · | · | · | · | · | T | · | · | · | · |
| IA | Quantification | · | · | · | · | I | T | I | i | · | · |
| IA | Fine-tuning / LoRA | · | · | · | · | · | · | · | · | · | · |
| IA | Distillation | · | · | · | · | · | · | · | · | · | · |
| IA | Federated learning | · | · | · | · | · | · | · | · | · | · |
| IA | Edge AI (navigateur/appareil) | · | · | · | · | · | · | · | · | · | · |
| IA | Neuro-symbolique / regles | · | · | · | · | · | · | · | · | · | · |
| Infrastructure | Docker / conteneurs | · | I | · | · | I | i | i | I | · | · |
| Infrastructure | Docker Compose | · | I | · | · | · | I | · | I | · | · |
| Infrastructure | Kubernetes / K3s / Helm | · | · | · | · | i | · | · | i | · | · |
| Infrastructure | WebAssembly / WASI | · | · | · | · | · | · | · | · | · | · |
| Infrastructure | libp2p / IPFS | · | · | · | · | · | · | · | · | · | · |
| Infrastructure | NATS | i | · | · | · | · | · | · | · | · | · |
| Infrastructure | Kafka | i | · | · | · | · | · | · | i | i | · |
| Infrastructure | Redis / file de messages | · | · | i | · | i | i | i | i | i | · |
| Infrastructure | Temporal (workflows durables) | · | · | · | · | i | · | · | · | · | · |
| Infrastructure | Terraform / OpenTofu | · | · | · | · | · | · | · | · | · | · |
| Infrastructure | Ansible | · | · | · | · | · | · | · | · | · | · |
| Infrastructure | GitOps (Argo CD / Flux) | · | · | · | · | · | · | · | · | · | · |
| Infrastructure | Infrastructure declarative (render.yaml / vercel.json) | · | · | · | I | I | · | · | · | I | · |
| Infrastructure | Edge workers (Cloudflare / Vercel Edge) | · | · | · | · | · | · | · | · | · | · |
| Infrastructure | Stockage objet (S3 et compatibles) | i | i | i | · | i | I | · | T | I | i |
| Infrastructure | Planificateur / taches de fond | T | I | · | · | T | I | I | I | I | I |
| Donnees | MongoDB | I | I | I | I | T | T | T | T | T | I |
| Donnees | PostgreSQL / SQL | · | · | · | · | · | · | · | i | i | · |
| Donnees | Graphe de connaissances / graphe de proprietes | · | · | I | · | T | · | T | T | · | · |
| Donnees | RDF / OWL / SPARQL / JSON-LD | · | · | · | · | T | · | · | I | · | · |
| Donnees | Base vectorielle / embeddings | · | · | · | · | I | · | · | I | · | · |
| Donnees | Recherche hybride / plein texte | · | · | · | · | I | · | I | · | · | · |
| Donnees | RAG | T | · | · | · | T | I | i | T | i | · |
| Donnees | Event sourcing / journal d'evenements | · | I | · | · | T | · | T | T | T | I |
| Donnees | Bus d'evenements interne | T | · | I | · | T | T | T | T | · | I |
| Donnees | CQRS | · | · | · | · | · | · | · | · | · | · |
| Donnees | Change Data Capture (change streams) | · | · | · | · | · | · | · | · | · | · |
| Donnees | Lineage / provenance des donnees | I | · | I | I | T | I | T | I | · | I |
| Donnees | Validation de schemas (JSON Schema / Pydantic / Zod) | I | I | I | i | T | I | I | I | I | I |
| Donnees | Contrats de donnees / registre canonique | T | I | · | T | T | T | · | · | T | · |
| Donnees | Lakehouse / Iceberg / Parquet | · | · | · | · | · | · | · | · | · | · |
| Donnees | Migrations de schema versionnees | · | · | I | · | · | · | · | T | · | · |
| Donnees | Sauvegarde / restauration | i | · | · | · | T | · | · | T | i | · |
| Cryptographie | Signatures numeriques (Ed25519 / ECDSA) | · | i | T | · | T | · | I | T | · | I |
| Cryptographie | Arbres de Merkle | · | · | · | · | · | · | · | T | T | · |
| Cryptographie | Horodatage / ancrage (OpenTimestamps, RFC 3161) | · | · | I | · | i | · | i | T | i | · |
| Cryptographie | Journal de transparence (append-only chaine) | I | · | I | · | T | · | T | T | · | · |
| Cryptographie | Preuves a divulgation nulle (ZKP / SNARK / STARK) | · | · | · | · | · | · | · | · | · | · |
| Cryptographie | MPC / chiffrement homomorphe | · | · | · | · | · | · | · | · | · | · |
| Cryptographie | Confidentialite differentielle | · | · | · | · | · | · | · | · | · | · |
| Cryptographie | Chiffrement applicatif des donnees (AES-GCM...) | · | · | · | · | · | T | · | I | I | I |
| Cryptographie | Rotation des cles | · | · | · | · | · | · | · | I | · | · |
| Cryptographie | Gestion des secrets (coffre) | · | · | · | · | · | · | · | i | · | · |
| Cryptographie | Cryptographie post-quantique (ML-KEM / ML-DSA) | · | · | · | · | · | · | · | i | · | · |
| Cryptographie | Provenance de contenus (C2PA) | · | · | · | · | · | · | · | i | · | · |
| Securite | SCA (audit des dependances) | I | I | I | I | I | I | I | I | i | I |
| Securite | SAST | · | · | · | · | · | · | I | · | · | · |
| Securite | Detection de secrets | · | · | · | · | · | · | T | i | · | · |
| Securite | DAST / scan dynamique | · | · | · | · | · | · | · | · | · | · |
| Securite | SBOM | · | · | · | · | · | · | · | i | · | · |
| Securite | Signature d'artefacts / provenance (Sigstore, SLSA) | · | · | · | · | · | · | · | i | · | · |
| Securite | Mises a jour automatiques (Dependabot / Renovate) | I | I | · | · | I | · | · | · | · | · |
| Securite | Limitation de debit | I | I | i | · | T | T | T | T | T | · |
| Securite | En-tetes de securite / CSP | · | I | · | I | T | · | I | · | i | · |
| Securite | WAF / protection DDoS | — | — | — | — | — | — | — | — | — | — |
| Securite | Tests d'intrusion / Red Team | · | · | · | · | · | · | T | i | · | · |
| Securite | Modelisation des menaces | — | — | — | — | — | — | — | — | — | — |
| Securite | Plan de reprise apres sinistre | — | — | — | — | — | — | — | — | — | — |
| Observabilite | OpenTelemetry | · | · | i | · | i | · | · | · | i | i |
| Observabilite | Prometheus / metriques | · | · | · | · | T | · | I | T | · | · |
| Observabilite | Sentry / suivi d'erreurs | · | · | · | · | · | · | · | i | · | · |
| Observabilite | Journalisation structuree | · | · | · | · | · | · | · | · | · | · |
| Observabilite | Sondes de sante (health checks) | T | T | · | · | T | T | T | T | T | I |
| Observabilite | Journal d'audit des actions | T | · | i | · | T | · | I | T | T | I |
| Observabilite | Tests de charge | · | · | · | · | · | · | · | I | · | · |
| Observabilite | SLI / SLO / budgets d'erreur | — | — | — | — | — | — | — | — | — | — |
| Observabilite | Chaos engineering | · | · | · | · | · | · | i | T | · | · |
| Observabilite | FinOps / cout par operation | I | · | i | · | · | · | i | · | · | · |
| Ingenierie | CI (GitHub Actions) | I | I | I | I | I | I | I | I | I | I |
| Ingenierie | TypeScript | I | · | I | · | · | · | · | T | I | · |
| Ingenierie | Rust | · | · | · | · | · | · | i | i | · | · |
| Ingenierie | Go | · | · | · | · | · | i | i | i | i | · |
| Ingenierie | Tests unitaires (pytest / vitest / jest) | T | T | T | T | T | T | T | T | T | T |
| Ingenierie | Tests de bout en bout (Playwright / Cypress) | · | · | T | · | T | · | T | · | · | · |
| Ingenierie | Tests de contrat | I | · | I | · | T | I | T | T | T | I |
| Ingenierie | Tests par proprietes | · | · | · | · | · | · | · | · | · | · |
| Ingenierie | Tests de mutation | · | · | · | · | · | · | · | · | · | · |
| Ingenierie | Lint / format / typage | I | I | i | · | T | I | I | T | I | I |
| Ingenierie | Versionnement d'API (/v1) | · | · | I | · | T | T | T | T | T | · |
| Economie | Paiements (Stripe / SumUp / autres) | i | · | i | · | T | I | T | I | T | · |
| Economie | Abonnements / facturation a l'usage | · | · | · | · | T | I | I | I | T | · |
| Economie | Portefeuille / cashless | · | i | I | · | T | I | T | T | I | T |
| Economie | Partage de revenus / redevances | · | · | I | · | T | · | I | i | T | I |
| Economie | Signature electronique | · | · | · | · | T | · | T | · | · | · |
| Economie | Facturation electronique (e-invoicing / Factur-X) | · | · | · | · | · | · | T | · | · | · |
| Economie | Smart contracts / tokenisation | · | · | · | · | i | · | i | · | · | · |
| Economie | Gestion des droits / licences d'oeuvres | · | · | · | · | · | · | · | · | T | · |
| Web | PWA (service worker / manifest) | I | · | i | · | I | I | I | T | I | · |
| Web | Applications mobiles natives (Capacitor / React Native) | · | i | · | · | I | i | i | i | I | · |
| Web | Internationalisation (i18n) | · | i | · | · | I | · | · | I | · | · |
| Web | Accessibilite (tests automatises) | · | · | · | · | i | · | · | · | · | · |
| Web | Design system (composants partages) | I | I | I | I | I | I | I | i | i | I |
| Web | SEO / donnees structurees (JSON-LD) | i | · | · | · | T | i | i | · | · | · |
| Web | WebGPU / WebXR / 3D | · | · | · | · | I | · | i | · | i | · |
| Web | Micro-frontends / Web Components | · | · | · | · | i | i | i | i | i | · |
| Conformite | RGPD (consentement, export, effacement) | I | i | I | · | T | T | T | T | T | · |
| Conformite | Licences et SPDX | · | · | · | · | · | · | · | T | · | · |
| Conformite | Registre de decisions / gouvernance tracee | T | T | I | I | T | I | T | · | T | I |
| Conformite | AI Act / ISO 42001 / ISO 27001 / SOC 2 | — | — | — | — | — | — | — | — | — | — |
| Conformite | eIDAS 2.0 / portefeuille europeen | · | · | · | · | T | I | i | T | I | · |
