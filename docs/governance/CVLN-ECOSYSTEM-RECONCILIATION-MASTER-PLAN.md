# CVLN ECOSYSTEM RECONCILIATION — MASTER PLAN

- **Document ID:** CVLN-GOV-RECON-001
- **Version:** 0.1.0
- **Status:** DRAFT — FOR REVIEW
- **Repository d’ancrage :** kimoune2025-a11y/Foundation-Cvln
- **Mode initial :** AUDIT ONLY — READ ONLY
- **Autorité de validation finale :** Laurent CŒURVOLAN
- **Principe directeur :** Evidence First — Preserve Before Change

---

## 1. Mission

Réconcilier l’intégralité de l’écosystème CVLN afin d’obtenir une représentation cohérente, traçable et vérifiable de ses entités, actifs, produits, infrastructures, dépôts Git, dépendances, relations, décisions et travaux en cours.

La mission doit établir une distinction stricte entre :

1. L’architecture décidée : ce que Laurent CŒURVOLAN a défini comme vision, doctrine ou intention.
2. L’état documentaire : ce qui est décrit dans les documents, spécifications, décisions et plans.
3. L’état technique réel : ce qui existe effectivement dans le code, les dépôts, les environnements et les services.
4. L’état opérationnel vérifié : ce qui a été testé et dont le fonctionnement est démontré par des preuves.
5. L’état juridique et économique : ce qui est effectivement constitué, détenu, autorisé, commercialisé ou exploité, sur la base de pièces appropriées.
6. L’état cible recommandé : ce qui devrait évoluer après analyse, arbitrage et autorisation.

Le résultat attendu est une vision consolidée de CVLN, sans effacement de son histoire, sans invention de capacités et sans confusion entre ambition, conception, réalisation et exploitation.

Cette mission concerne l’ensemble de l’écosystème, pas uniquement le dépôt Foundation-Cvln ni les projets actuellement les plus avancés.

## 2. Objectifs stratégiques

La mission doit permettre de :

- Recenser toutes les entités, marques, projets, produits, programmes, plateformes, infrastructures, agents, protocoles et actifs connus.
- Identifier leurs dépôts Git et leurs sources documentaires.
- Déterminer les relations de gouvernance, de propriété, d’exploitation, d’utilisation et de dépendance.
- Préserver les architectures et décisions fondatrices, même lorsqu’elles doivent être confrontées à la réalité technique.
- Détecter les incohérences, doublons, contradictions, dépendances cachées, interfaces fictives et zones non documentées.
- Identifier les composants opérationnels, partiellement opérationnels, documentés uniquement, en cours, bloqués ou inconnus.
- Vérifier les dépendances envers des prestataires, plateformes ou composants externes, notamment les dépendances historiques à Emergent.
- Distinguer les composants souverains des composants encore dépendants de services tiers.
- Établir une trajectoire réaliste de réconciliation, d’intégration, de sécurisation et de mise en exploitation.
- Donner à Claude Code un cadre persistant pour poursuivre les travaux d’une session à l’autre sans perdre le contexte ni recommencer inutilement les audits.

## 3. Gouvernance et séparation des responsabilités

Les rôles ci-dessous constituent des hypothèses d’architecture à vérifier et à préserver dans leur intention. Ils ne prouvent pas, à eux seuls, que les interfaces ou intégrations correspondantes sont opérationnelles.

| Composant | Rôle de référence à examiner |
|---|---|
| CVLN Foundation / Cœurvolan | Racine de vision, principes fondateurs et gouvernance structurelle |
| CVLN Group | Ensemble des activités, actifs et entités du groupe |
| Meta CVLN | Gouvernance du portefeuille et coordination des activités |
| CVLN Intelligence OS | Infrastructure d’intelligence partagée |
| CVLN Brain | Couche de raisonnement et d’intelligence |
| CVLN Agent Factory | Création, orchestration et exécution des agents |
| Laurentia | Opérateur IA et interface de travail personnelle et métier |
| Command Center | Supervision opérationnelle privée et pilotage |
| FREKCORE / FREK-ID | Couche indépendante d’identité, de provenance et de preuve |
| Kiltikonet / Culture Connect / Observatory | Écosystème culturel, réseau, services et observation |
| KORA, LabelOS, Wallet/JCC et autres produits | Composants à cartographier selon leurs fonctions et leur état réel |

Cette liste est un point de départ, non un inventaire exhaustif.

Règles de séparation :

- Ne pas confondre la Fondation avec le groupe, le portefeuille, l’infrastructure d’intelligence ou le centre de supervision.
- Ne pas placer FREKCORE sous Laurentia, KORA ou Agent Factory sans preuve et décision explicite.
- Ne pas supposer qu’une relation `PART_OF` implique automatiquement une propriété juridique.
- Ne pas assimiler une dépendance technique à une relation de gouvernance.
- Ne pas fusionner des composants distincts uniquement parce que leurs fonctions se ressemblent.
- Préserver les systèmes, produits et travaux existants dont la valeur doit être établie avant toute restructuration.

## 4. Source d’ancrage et état initial

Le dépôt Foundation-Cvln constitue le premier point d’entrée de la mission, sous réserve de l’audit.

Le registre existant se trouve dans :

```
lib/registry/cvlnRegistry.js
```

La page `app/page.js` utilise `getUiTree()` pour afficher l’architecture à partir du registre.

Le registre comporte notamment des identifiants d’entités, des types, des relations, des métadonnées de provenance et des statuts distinguant l’architecture déclarée de la réalité vérifiée.

Ces éléments doivent être inspectés avant toute proposition d’évolution.

### Consignes impératives

1. Examiner le registre existant et ses tests avant toute modification.
2. Vérifier les identifiants, relations, conventions de nommage, dates de référence et règles de validation.
3. Vérifier les directions et la sémantique des relations.
4. Distinguer les relations fondatrices des relations inférées.
5. Vérifier si la structure actuelle couvre réellement le périmètre de l’écosystème.
6. Identifier les éventuelles contradictions entre les décisions historiques et la représentation actuelle.
7. Ne jamais remplacer le registre existant par un nouveau modèle sans comparaison documentée et autorisation.
8. Ne jamais déclarer ce dépôt source de vérité complet avant d’avoir démontré qu’il peut remplir ce rôle.

## 5. Périmètre de découverte

L’audit doit couvrir les dépôts et projets accessibles associés à CVLN, notamment, sans se limiter à ceux-ci :

- Foundation-Cvln
- CVLN Group et Meta CVLN
- CVLN Intelligence OS
- CVLN Brain
- Command Center
- Laurentia
- CVLN Agent Factory
- FREKCORE, FREK-ID et les composants FREK associés
- Kiltikonet et ses composants
- Culture Connect et Observatory
- KORA
- LabelOS
- CVLN Wallet et JCC
- CVLN Academy et les académies associées
- Factory Maker Studio
- Good Mood et Good Mood Fest
- Gala Cook & Food
- CVLN Hospitality
- CVL Culinary Innovations
- Les autres produits, programmes, actifs, projets et structures découverts au cours de l’audit.

Pour chaque dépôt découvert, établir :

- Nom complet et URL.
- Propriétaire GitHub et permissions observées.
- Branche par défaut et état de la branche de référence.
- Objectif apparent et rôle architectural déclaré.
- Documents de référence et historique de décisions.
- Composants et interfaces principales.
- Dépendances entrantes et sortantes identifiées.
- Tests, CI, déploiements et preuves accessibles.
- Dépendances externes et éléments hérités.
- État de couverture de l’audit.
- Questions ouvertes et accès manquants.

Ne pas inventer les URL, dépôts, propriétaires, services, statuts ou intégrations. Signaler explicitement toute ressource inaccessible.

## 6. Modèle de vérité et qualification des preuves

Chaque affirmation importante doit être associée à une catégorie de preuve.

### Statuts d’existence et de fonctionnement

Utiliser les statuts suivants :

- `VERIFIED_OPERATIONAL` : fonctionnement démontré par des preuves actuelles et reproductibles.
- `PARTIALLY_VERIFIED` : une partie seulement du fonctionnement est démontrée.
- `DOCUMENTED_ONLY` : décrit dans les documents, sans preuve suffisante de réalisation.
- `IN_PROGRESS` : réalisation commencée et état corroboré.
- `BLOCKED` : obstacle identifié et documenté.
- `UNKNOWN` : données insuffisantes pour conclure.
- `DEPRECATED` : retrait explicitement décidé et tracé ; jamais déduit de l’inactivité seule.

Ne pas transformer une intention en réalisation, un commit en preuve de déploiement, un test unitaire en preuve d’intégration complète ou une interface graphique en preuve d’un backend fonctionnel.

### Qualification des relations

Pour chaque relation, enregistrer si possible :

- Un identifiant stable.
- L’entité source et l’entité cible.
- Le type de relation.
- La source documentaire ou technique.
- La provenance : décision explicite, observation directe ou inférence.
- Le niveau de confiance.
- La date de vérification.
- Le statut de vérification.
- Les contradictions éventuelles.
- Le validateur et la décision d’arbitrage, si nécessaire.

Les relations inférées doivent rester identifiées comme telles. Elles ne deviennent pas des décisions fondatrices par simple répétition dans plusieurs documents.

### Preuves attendues

Selon la nature de l’affirmation, rechercher notamment :

- Fichiers et chemins exacts.
- Commits et historique Git.
- Tests exécutés et résultats reproductibles.
- Journaux de CI et de déploiement.
- Contrats d’API et appels réellement exécutés.
- Configurations et déclarations de dépendances.
- Documents juridiques ou contractuels accessibles et pertinents.
- Décisions écrites explicitement attribuables.
- Traces opérationnelles datées.

Ne jamais publier de secrets, jetons, mots de passe, clés privées ou données personnelles inutiles dans les rapports.

## 7. Protocole d’exécution par phases

### Phase 0 — Protection et cadrage

Mode : lecture seule.

- Examiner la branche et le commit de référence.
- Vérifier l’état Git et les éventuels travaux en cours.
- Identifier les documents et conventions existants.
- Définir le périmètre réellement accessible.
- Établir les limites de l’audit.
- Identifier les risques de perte de données ou de confusion des sources.

Livrable : rapport de cadrage et état de référence.

Condition de sortie : le périmètre, les accès, les limites et les règles de protection sont documentés.

### Phase 1 — Inventaire exhaustif

- Recenser les dépôts connus et découverts.
- Extraire les entités et projets présents dans les documents et registres.
- Recenser les produits, programmes, marques, infrastructures, agents et actifs.
- Identifier les éléments cités sans source vérifiable.
- Rechercher les doublons, alias et changements de nom.
- Distinguer les entités juridiques des composants techniques et des concepts.

Livrables : inventaire initial, registre des sources, liste des éléments manquants.

Condition de sortie : chaque élément découvert possède une source et un statut de couverture ; les zones non auditées sont explicites.

### Phase 2 — Cartographie des relations

- Cartographier la gouvernance et les responsabilités déclarées.
- Cartographier les dépendances techniques et les interfaces.
- Identifier les relations de propriété, d’exploitation, d’utilisation et de fourniture.
- Vérifier les relations déjà inscrites dans le registre Foundation.
- Identifier les cycles, références pendantes et dépendances implicites.
- Distinguer les relations conceptuelles des relations réellement implémentées.

Livrables : graphe des relations, registre des dépendances, liste des relations à confirmer.

### Phase 3 — Réconciliation et détection des contradictions

Rechercher notamment :

- Des noms différents pour un même composant.
- Des composants distincts confondus sous un seul nom.
- Des rôles contradictoires entre les dépôts.
- Des relations de gouvernance incompatibles.
- Des dépendances externes non déclarées.
- Des fonctions promises mais absentes.
- Des fonctions implémentées mais non documentées.
- Des tests qui ne correspondent plus au fonctionnement réel.
- Des décisions historiques non prises en compte.
- Des éléments abandonnés en apparence mais potentiellement réutilisables.

Chaque contradiction reçoit un identifiant, les preuves concernées, les conséquences possibles, une proposition de résolution et, lorsque nécessaire, une demande d’arbitrage.

Livrable : registre des contradictions et des risques.

### Phase 4 — Arbitrage architectural

Classer chaque élément ou problème selon une décision proposée :

- `KEEP`
- `CORRECT`
- `EXTEND`
- `RESTRUCTURE`
- `ADD`
- `DEPRECATE`
- `PRESERVE`
- `DEFER`
- `SUPERSEDE`
- `REJECT`

Ces décisions sont des propositions tant qu’elles n’ont pas été autorisées par le responsable compétent.

Aucune décision ne doit entraîner la suppression ou la fusion implicite d’un composant existant.

Livrable : registre des décisions proposées, décisions validées et points en attente.

### Phase 5 — Architecture cible et plan d’intégration

À partir des éléments vérifiés et des arbitrages autorisés :

- Définir l’architecture cible.
- Décrire les responsabilités de chaque composant.
- Définir les contrats entre systèmes.
- Identifier les intégrations réellement manquantes.
- Séparer les dépendances acceptées, remplaçables et à éliminer.
- Identifier les prérequis de sécurité, de tests et d’exploitation.
- Prioriser les travaux selon leur valeur, leur risque et leurs dépendances.
- Préserver les actifs existants et leurs historiques.

Livrables : architecture cible, plan de migration éventuel, feuille de route et critères de validation.

### Phase 6 — Exécution contrôlée

Cette phase ne commence qu’après validation explicite du plan et du périmètre de modification.

Pour chaque changement :

1. Établir l’état initial.
2. Créer une branche isolée.
3. Définir les fichiers concernés et les risques.
4. Écrire ou actualiser les tests pertinents.
5. Appliquer un changement limité.
6. Exécuter les tests et contrôles nécessaires.
7. Comparer le résultat à l’état initial.
8. Documenter les preuves et les éventuelles régressions.
9. Présenter la modification pour revue.
10. Ne fusionner ou déployer qu’après les validations requises.

Aucune migration globale, suppression, rotation de secrets, modification d’infrastructure ou rupture de compatibilité ne doit être réalisée implicitement.

## 8. Organisation documentaire cible

Après vérification des conventions du dépôt, proposer la structure suivante sans écraser les documents existants :

- `docs/governance/CVLN-ECOSYSTEM-RECONCILIATION-MASTER-PLAN.md` — mandat directeur.
- `docs/governance/reconciliation/00-scope-and-access.md` — périmètre et accès.
- `docs/governance/reconciliation/01-source-register.md` — registre des sources.
- `docs/governance/reconciliation/02-entity-inventory.md` — inventaire des entités.
- `docs/governance/reconciliation/03-relation-map.md` — relations et dépendances.
- `docs/governance/reconciliation/04-evidence-ledger.md` — preuves et qualifications.
- `docs/governance/reconciliation/05-contradictions.md` — contradictions et risques.
- `docs/governance/reconciliation/06-decision-log.md` — décisions et arbitrages.
- `docs/governance/reconciliation/07-target-architecture.md` — architecture cible proposée.
- `docs/governance/reconciliation/08-execution-roadmap.md` — feuille de route.
- `docs/governance/reconciliation/STATUS.md` — progression réelle et prochaine action.

Cette structure est une proposition. Vérifier d’abord si des documents équivalents existent déjà. Réutiliser les documents existants lorsque cela est cohérent et traçable.

## 9. Registre maître : exigences minimales

Le registre maître doit permettre de distinguer les entités sans les confondre.

Champs recommandés :

- `entity_id`
- `canonical_name`
- `aliases`
- `entity_type`
- `declared_role`
- `actual_role`
- `source_repositories`
- `source_documents`
- `architectural_status`
- `implementation_status`
- `operational_status`
- `legal_status`
- `ownership_status`
- `dependencies`
- `evidence_refs`
- `confidence`
- `last_verified_at`
- `known_contradictions`
- `decision_status`
- `next_action`

Ne pas remplacer les champs et conventions du registre existant avant d’avoir établi une correspondance et vérifié la compatibilité.

Les statuts inconnus doivent rester inconnus. Une absence de preuve n’est pas une preuve d’absence.

## 10. Critères d’acceptation

La mission ne peut pas être déclarée achevée simplement parce que les documents ont été créés.

### Couverture

- Les dépôts connus sont recensés.
- Les ressources inaccessibles sont signalées.
- Les entités découvertes sont traçables.
- Les lacunes et zones non auditées sont visibles.

### Cohérence

- Les contradictions sont documentées.
- Les rôles et relations sont distingués.
- Les décisions historiques sont préservées.
- Les relations inférées ne sont pas présentées comme des faits établis.

### Intégration

- Les interfaces et dépendances sont identifiées.
- Les intégrations opérationnelles sont étayées par des preuves.
- Les dépendances externes sont inventoriées.
- Les composants isolés et les points de rupture sont explicités.

### Exploitation

- Les prérequis de déploiement et de sécurité sont identifiés.
- Les responsabilités opérationnelles sont définies ou signalées comme inconnues.
- Les risques de disponibilité, de perte de données et de dépendance sont documentés.
- La feuille de route est ordonnée par prérequis et risques, pas par effet de présentation.

### Traçabilité

- Chaque conclusion importante renvoie à une source.
- Chaque décision possède un statut et un historique.
- Les tests sont associés à leurs résultats réels.
- Le rapport permet à un autre intervenant de reprendre la mission sans dépendre de suppositions orales.

## 11. Règles absolues pour Claude Code

1. Commencer par lire ce plan intégralement.
2. Vérifier le commit de référence, la branche et les éventuels travaux non commis.
3. Consulter les documents et registres existants avant de créer des doublons.
4. Respecter les décisions explicites et préserver les travaux historiques.
5. Ne jamais déclarer un audit exhaustif si des sources importantes restent inaccessibles.
6. Ne jamais inventer un dépôt, une API, une preuve, un test, un déploiement ou une intégration.
7. Ne jamais présenter une proposition comme une décision validée.
8. Ne pas modifier de code durant les phases d’audit.
9. Ne pas supprimer, renommer, fusionner ou déplacer silencieusement un composant.
10. Ne pas révéler de secrets ou d’informations sensibles dans les rapports.
11. Demander une autorisation avant toute modification structurelle ou irréversible.
12. En cas de contradiction entre ce plan et une décision fondatrice documentée, signaler le conflit et demander un arbitrage.
13. Mettre à jour l’état d’avancement uniquement sur la base de travaux et de preuves réellement observés.
14. Terminer chaque session avec un état de progression, les preuves collectées, les limites, les risques et la prochaine action précise.

## 12. Rapport de fin de session obligatoire

Chaque session doit fournir :

- Phase en cours
- Périmètre réellement examiné
- Sources consultées
- Faits vérifiés
- Hypothèses et inférences
- Contradictions découvertes
- Accès ou preuves manquants
- Modifications réalisées, le cas échéant, avec références Git
- Tests exécutés et résultats observés
- Risques et décisions à arbitrer
- Prochaine action autorisée

Le statut doit rester honnête : « non commencé », « en cours », « bloqué », « partiellement vérifié » ou « terminé avec preuves », selon le cas.

## 13. Première action autorisée

À la première exécution de ce plan :

1. Lire le registre `lib/registry/cvlnRegistry.js`.
2. Lire `app/page.js` et les autres fichiers qui déterminent la structure et sa validation.
3. Examiner l’arborescence, les tests, la documentation, les conventions et l’historique Git pertinents.
4. Vérifier si des documents de gouvernance ou d’inventaire existent déjà.
5. Déterminer ce que le dépôt peut effectivement garantir et ce qui relève encore de déclarations.
6. Préparer le protocole de découverte des autres dépôts.
7. Produire un rapport initial avec preuves, limites et questions ouvertes.

Aucune modification du code applicatif, aucun changement de registre canonique et aucune migration ne sont autorisés pendant cette première phase.

Le premier jalon est atteint lorsque Laurent CŒURVOLAN peut examiner un rapport factuel et décider si le dépôt Foundation-Cvln est prêt à servir de point d’ancrage pour la réconciliation globale.

---

*Fin du mandat directeur — version 0.1.0 — en attente de validation.*
