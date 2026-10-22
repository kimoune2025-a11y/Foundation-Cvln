# Charte d'autonomie du système CVLN

- **Statut : PROPOSÉ** (PROP-17, [06](reconciliation/06-decision-log.md) §3). Ce n'est pas une décision tant que Laurent CŒURVOLAN ne l'a pas validée.
- **Date :** 2026-10-22
- **Méthode :** rien n'est inventé. Chaque règle reprend ce qui existe déjà dans le code ou les documents des dépôts du groupe, avec sa source.

## 1. Pourquoi l'autonomie

L'objectif n'est pas nouveau. Il traverse les dépôts depuis le début :

| Source | Ce qu'elle dit |
|---|---|
| Agent Factory, `memory/PRD.md` (Vision) | « Infrastructure cognitive opérationnelle **souveraine** du groupe CVLN : mémoire, doctrine, gouvernance, orchestration, agents, objectifs, journaux, runtime et continuité propriétaires. Les LLM sont des **accélérateurs interchangeables**, jamais le cœur. Capable de piloter plusieurs entités. » |
| Agent Factory, `autonomous_routes.py` | « Cycle autonome gouverné 9 étapes. Pas une IA libre : un runtime déterministe, interne, traçable. » |
| Laurent.ia, `memory/PRD.md` | Chantier 7 « Autonomie & Apprentissage continu » ; chantier 9 « Orchestrateur 20 agents » (mode SHADOW). |
| CVLN Intelligence OS, `specifications/AUTONOMY.md` | « L'autonomie est bornée par les niveaux de la porte ; un niveau d'autonomie plus élevé n'augmente pas l'autorité. » |
| FREKCORE, `docs/decisions/0001-founder-decisions-2026-08-31.md` §28 | « Autonomy boundary » : ce qui peut avancer sans nouvelle validation, et ce qui s'arrête pour une décision du fondateur. |
| Command Center (registre) | « La tour de contrôle : supervision et pilotage de l'ensemble. » |

Le sens commun de ces sources : **un système qui travaille seul pour le groupe, sous l'autorité de son fondateur**, où les modèles d'IA sont des outils interchangeables et où chaque action est tracée.

## 2. Principe directeur

**Autonomie n'est pas autorité.** Le système peut observer, analyser, proposer et préparer seul. Il n'engage jamais le groupe à la place de Laurent.

## 3. Les six niveaux d'action

Les niveaux sont ceux de la porte de permission d'Agent Factory (`gate_routes.py`, `GATE_LEVELS`) :

| Niveau | Action | Le système peut-il agir seul ? |
|---|---|---|
| 1 | Observer | Oui, tracé |
| 2 | Analyser | Oui, tracé |
| 3 | Proposer | Oui, tracé |
| 4 | Préparer (réveiller un agent, créer une tâche interne) | Oui, tracé |
| 5 | Exécuter | Seulement après validation humaine |
| 6 | Interdit | Jamais |

## 4. Ce qui exige toujours la validation de Laurent

Ces actions ne peuvent pas être rendues automatiques par une règle :

- **Agent Factory** (`CRITICAL_ACTIONS`) : dépense, publication externe, changement de gouvernance, suppression de données, changement de permission, activation critique en production.
- **Agent Factory** (conditions permanentes du PRD) : dépenses, contrats, publication externe, suppression, stratégie, recrutement, doctrine, activation en production.
- **FREKCORE** (§28) : tout ce qui retirerait un concept historique FREK, redéfinirait le FREK-ID, casserait un identifiant, fusionnerait des identités incompatibles, changerait la sémantique `.fk`, retirerait une preuve ou le cycle de vie, changerait un sens économique ou juridique, créerait une API publique incompatible ou supprimerait définitivement des données historiques.
- **Laurent.ia** : `SOCIAL_MANUAL_APPROVAL=true` par défaut, donc aucune publication sur les réseaux sans approbation explicite.

## 5. Passage progressif à l'action

Ces règles existent déjà dans le code ou les PRD :

1. **Simulation d'abord.** Le cycle autonome d'Agent Factory est en `dry_run` par défaut. Le mode `live` exige au moins un cycle simulé terminé et l'action d'un admin.
2. **Un agent à la fois.** Chaque agent suit Draft → Prototype → Beta → Production individuellement. La validation en production est réservée à Laurent, depuis la console. Il n'y a jamais de promotion en masse.
3. **Observation avant action.** L'orchestrateur de Laurent.ia tourne en mode SHADOW, et les 38 agents de la main-d'œuvre FREK sont en PROTOTYPE / dry_run.
4. **Escalade automatique.** Une intention critique détectée dans un objectif arrête l'exécution et crée une demande de validation pour Laurent, avec une notification.

## 6. Conditions pour que le système travaille vraiment seul

| Condition | État au 2026-10-22 |
|---|---|
| Un déclencheur automatique des cycles | Planificateur proposé : frekcore/CVLNAgentfactory#29 (désactivé par défaut) |
| Un cœur toujours éveillé | **Non** : Foundation et Agent Factory sont sur l'offre gratuite de Render et s'endorment (EV-P6-26) |
| Des liaisons qui fonctionnent | Identité de service de Laurentia prête sur Agent Factory (2026-10-22) ; émission FREK-ID de Kiltikonet corrigée (cultureconnectorg/Kiltikonet-Aout2026#469) |
| Une supervision visible | Panneau « Services du groupe » proposé : kimoune2025-a11y/Command-center#10 |
| Des cycles auditables pas à pas | Écart connu (`G-014`, Intelligence OS) |

## 7. Mise en route proposée

1. **Laurent** valide cette charte, ou la corrige.
2. **Laurent** passe Foundation et Agent Factory sur une offre toujours éveillée.
3. Le planificateur d'Agent Factory est activé en **simulation** (`AUTONOMOUS_CYCLE_INTERVAL_SECONDS`, par exemple toutes les heures). Pendant une semaine, Laurent lit les cycles sur `/runtime` et dans Command Center.
4. **Laurent** choisit un premier agent et un premier usage concret, puis le promeut seul en production.
5. Le mode `live` n'est activé qu'après cette semaine d'observation, par Laurent.
6. Le système s'étend ensuite agent par agent, toujours dans les limites des §3 et §4.

## 8. Ce que cette charte ne fait pas

- Elle n'active rien : aucun mode, aucun agent, aucune variable.
- Elle ne change ni les niveaux ni les actions critiques existants.
- Elle ne raccorde pas CVLN Intelligence OS au registre (HIST-01).
