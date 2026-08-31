/* ==================================================================
 * CVLN GROUP — CANONICAL ENTITY REGISTRY
 * ------------------------------------------------------------------
 * Source canonique, machine-readable, de la structure de CVLN Group.
 *
 * RÈGLE ABSOLUE (mission CVLN Foundation v1) :
 *   L'architecture fondatrice (le TREE) est PRÉSERVÉE à l'identique.
 *   Ce fichier ne fait que la FORMALISER (ids stables, types, relations,
 *   métadonnées). Aucune entité n'est renommée, supprimée, simplifiée
 *   ou réinterprétée. Les noms / rôles / descriptions sont copiés mot
 *   pour mot depuis le TREE fondateur.
 *
 *   Distinction stricte :
 *     - architectural_status: "DECIDED"   -> présent dans l'architecture décidée
 *     - verified_reality:     "UNVERIFIED"-> aucune preuve juridique/technique
 *   Aucune preuve n'est inventée. evidence_source reste null tant qu'aucune
 *   preuve n'est fournie.
 * ================================================================== */

export const SCHEMA_VERSION = '1.0.0'
export const BASELINE_DATE = '2025-06-15'
export const NAMESPACE = 'cvln'

/* ---- Enums (référence) ---- */
export const ENTITY_TYPES = [
  'LEGAL_ENTITY', 'BUSINESS_ENTITY', 'PLATFORM', 'INFRASTRUCTURE',
  'PROTOCOL', 'SERVICE', 'BRAND', 'PROGRAM', 'PROJECT', 'AGENT',
  'STANDARD', 'FORMAT',
]
export const RELATION_TYPES = [
  'PART_OF', 'GOVERNS', 'OWNS', 'OPERATES', 'USES', 'SUPERVISES',
  'DEPENDS_ON', 'PROVIDES',
]

/* ---- Factory: chaque entité provient du TREE fondateur ---- */
const E = (entity_id, name, type, declared_role, description) => ({
  entity_id,
  name,                              // exact, préservé du TREE
  type,                              // classification (rôle architecturé)
  declared_role,                     // "tag" du TREE (provenance)
  description,                       // exact, préservé du TREE
  status: 'DECLARED',                // cycle de vie au registre (honnête)
  architectural_status: 'DECIDED',   // fait partie de l'architecture décidée
  verified_reality: 'UNVERIFIED',    // pas de preuve juridique/technique
  provenance: 'founding_architecture_tree',
  evidence_source: null,             // jamais inventé
  confidence: 'DECLARED',            // DECLARED (décidé) — pas PROVEN
  as_of: BASELINE_DATE,
})

/* =========================== ENTITÉS =========================== */
/* 29 entités — miroir exact du TREE fondateur (ordre préservé)    */
export const ENTITIES = [
  E('ENT-CVLN-FOUNDATION', 'CVLN Foundation', 'LEGAL_ENTITY', 'Gouvernance · vision · racine',
    'La racine de tout : la gouvernance, la vision et la raison d’être de l’écosystème.'),
  E('ENT-CVLN-GROUP', 'CVLN Group', 'BUSINESS_ENTITY', 'Écosystème global · portefeuille',
    'L’écosystème dans son ensemble : le portefeuille vivant des entités du groupe.'),
  E('ENT-META-CVLN', 'Meta CVLN', 'BUSINESS_ENTITY', 'Gouvernance groupe · portefeuille',
    'La gouvernance du groupe et la coordination de son portefeuille d’activités.'),
  E('ENT-INFRASTRUCTURES-CVLN', 'Infrastructures CVLN', 'INFRASTRUCTURE', 'Fondations techniques',
    'Les fondations techniques sur lesquelles tout l’écosystème s’appuie.'),
  E('ENT-FREKCORE', 'FREKCORE', 'INFRASTRUCTURE', 'Identité · provenance · preuve',
    'Le socle d’identité, de provenance et de preuve. La confiance par la traçabilité.'),
  E('ENT-FREK-ID', 'FREK-ID', 'SERVICE', 'Identité',
    'L’identité vérifiable des personnes et des œuvres.'),
  E('ENT-FREK-CHAIN', 'FREK-CHAIN', 'PROTOCOL', 'Provenance',
    'La chaîne qui atteste l’origine et le parcours de chaque création.'),
  E('ENT-FREK-FORMATS', '.FK · FREKANSLA · FREKRAW · Verified', 'FORMAT', 'Formats · preuve',
    'Les formats et labels de preuve : du fichier brut à l’œuvre vérifiée.'),
  E('ENT-PROOF-LAYER', 'Proof Layer', 'INFRASTRUCTURE', 'Evidence · notarial',
    'La couche de preuve : une valeur notariale au service de la confiance.'),
  E('ENT-CVLN-WALLET', 'CVLN Wallet', 'PLATFORM', 'Économie · JCC · paiements',
    'L’économie de l’écosystème : la monnaie JCC et les paiements.'),
  E('ENT-ENTITES-METIER-CVLN', 'Entités Métier CVLN', 'BUSINESS_ENTITY', 'Activités opérationnelles',
    'Les activités qui font vivre la culture au quotidien.'),
  E('ENT-KORA', 'KORA', 'PLATFORM', 'Streaming · média',
    'La plateforme de streaming et de média. Le fil des histoires.'),
  E('ENT-LABELOS', 'LabelOS', 'PLATFORM', 'Label · droits',
    'Le système qui gère les labels, les droits et les identités créatives.'),
  E('ENT-FACTORY-MAKER-STUDIO', 'Factory Maker Studio', 'PLATFORM', 'Création · studio',
    'Le studio où naissent les créations, les produits et les prototypes.'),
  E('ENT-KILTIKONET', 'Kiltikonet', 'PLATFORM', 'Réseau culturel',
    'Le réseau culturel qui relie les communautés et les talents.'),
  E('ENT-CVLN-ACADEMY', 'CVLN Academy', 'PROGRAM', 'Formation · skills',
    'La formation et la transmission des savoir-faire.'),
  E('ENT-CVLN-INTELLIGENCE-OS', 'CVLN Intelligence OS', 'INFRASTRUCTURE', 'Système commun d’intelligence',
    'Le système d’intelligence partagé par tout l’écosystème.'),
  E('ENT-CVLN-BRAIN', 'CVLN Brain', 'SERVICE', 'Intelligence · LLM',
    'Le cerveau : les modèles de langage et l’intelligence au service de l’humain.'),
  E('ENT-CVLN-AGENT-FACTORY', 'CVLN Agent Factory', 'PLATFORM', 'Système nerveux · agents',
    'Le système nerveux : la fabrique d’agents qui exécutent et automatisent.'),
  E('ENT-LAURENTIA', 'Laurentia', 'AGENT', 'Agent · interface métier',
    'L’agent et l’interface métier au contact des usages concrets.'),
  E('ENT-CVLN-COMMAND-CENTER', 'CVLN Command Center', 'PLATFORM', 'Supervision · pilotage',
    'La tour de contrôle : supervision et pilotage de l’ensemble.'),
  E('ENT-STRUCTURES-ENTITES', 'Structures & Entités', 'BUSINESS_ENTITY', 'Opérationnelles · programmes',
    'Les structures opérationnelles, marques et programmes du groupe.'),
  E('ENT-CULTURE-CONNECT', 'Culture Connect', 'PROGRAM', 'Programme',
    'Un programme de rencontres et de liens culturels.'),
  E('ENT-GOOD-MOOD', 'Good Mood', 'PROGRAM', 'Programme',
    'Des expériences qui rassemblent et célèbrent le vivant.'),
  E('ENT-GOOD-MOOD-FEST', 'Good Mood Fest', 'PROGRAM', 'Événement',
    'Le festival : l’énergie de la fête et de la communauté.'),
  E('ENT-GALA-COOK-FOOD', 'Gala Cook & Food', 'PROGRAM', 'Gastronomie',
    'La table comme lieu de partage : une gastronomie de terroir.'),
  E('ENT-FACTORY-MAKER-ACADEMY', 'Factory Maker Academy', 'PROGRAM', 'Formation',
    'La formation des créateurs et des makers.'),
  E('ENT-KORA-ACADEMY', 'KORA Academy', 'PROGRAM', 'Formation',
    'La formation aux métiers du média et du streaming.'),
  E('ENT-FREK-ACADEMY', 'FREK Academy', 'PROGRAM', 'Formation',
    'La formation à l’identité, la preuve et la provenance.'),
]

/* =========================== RELATIONS =========================== */
// PART_OF : miroir EXACT du TREE fondateur (parent/enfant, ordre préservé).
const PART = (from, to) => ({
  type: 'PART_OF', from, to,
  provenance: 'founding_architecture_tree',
  confidence: 'DECLARED',
  verified_reality: 'UNVERIFIED',
  evidence_source: null,
  as_of: BASELINE_DATE,
})
// Relations sémantiques INFÉRÉES à partir du rôle déclaré (tag) de chaque
// entité. Elles n'altèrent PAS le TREE (additives) et sont clairement
// marquées confidence=INFERRED / provenance=inferred_from_declared_role.
const INF = (from, type, to) => ({
  type, from, to,
  provenance: 'inferred_from_declared_role',
  confidence: 'INFERRED',
  verified_reality: 'UNVERIFIED',
  evidence_source: null,
  as_of: BASELINE_DATE,
})

const _RELATIONS = [
  /* ---- PART_OF (28) : structure fondatrice, ordre = ordre du TREE ---- */
  PART('ENT-CVLN-GROUP', 'ENT-CVLN-FOUNDATION'),
  PART('ENT-META-CVLN', 'ENT-CVLN-GROUP'),
  PART('ENT-CVLN-INTELLIGENCE-OS', 'ENT-CVLN-GROUP'),
  PART('ENT-STRUCTURES-ENTITES', 'ENT-CVLN-GROUP'),
  PART('ENT-INFRASTRUCTURES-CVLN', 'ENT-META-CVLN'),
  PART('ENT-ENTITES-METIER-CVLN', 'ENT-META-CVLN'),
  PART('ENT-FREKCORE', 'ENT-INFRASTRUCTURES-CVLN'),
  PART('ENT-PROOF-LAYER', 'ENT-INFRASTRUCTURES-CVLN'),
  PART('ENT-CVLN-WALLET', 'ENT-INFRASTRUCTURES-CVLN'),
  PART('ENT-FREK-ID', 'ENT-FREKCORE'),
  PART('ENT-FREK-CHAIN', 'ENT-FREKCORE'),
  PART('ENT-FREK-FORMATS', 'ENT-FREKCORE'),
  PART('ENT-KORA', 'ENT-ENTITES-METIER-CVLN'),
  PART('ENT-KILTIKONET', 'ENT-ENTITES-METIER-CVLN'),
  PART('ENT-CVLN-ACADEMY', 'ENT-ENTITES-METIER-CVLN'),
  PART('ENT-LABELOS', 'ENT-KORA'),
  PART('ENT-FACTORY-MAKER-STUDIO', 'ENT-KORA'),
  PART('ENT-CVLN-BRAIN', 'ENT-CVLN-INTELLIGENCE-OS'),
  PART('ENT-CVLN-COMMAND-CENTER', 'ENT-CVLN-INTELLIGENCE-OS'),
  PART('ENT-CVLN-AGENT-FACTORY', 'ENT-CVLN-BRAIN'),
  PART('ENT-LAURENTIA', 'ENT-CVLN-AGENT-FACTORY'),
  PART('ENT-CULTURE-CONNECT', 'ENT-STRUCTURES-ENTITES'),
  PART('ENT-GOOD-MOOD', 'ENT-STRUCTURES-ENTITES'),
  PART('ENT-GOOD-MOOD-FEST', 'ENT-STRUCTURES-ENTITES'),
  PART('ENT-GALA-COOK-FOOD', 'ENT-STRUCTURES-ENTITES'),
  PART('ENT-FACTORY-MAKER-ACADEMY', 'ENT-STRUCTURES-ENTITES'),
  PART('ENT-KORA-ACADEMY', 'ENT-STRUCTURES-ENTITES'),
  PART('ENT-FREK-ACADEMY', 'ENT-STRUCTURES-ENTITES'),

  /* ---- INFERRED (7) : sémantique dérivée des rôles déclarés ---- */
  INF('ENT-CVLN-FOUNDATION', 'GOVERNS', 'ENT-CVLN-GROUP'),
  INF('ENT-META-CVLN', 'GOVERNS', 'ENT-INFRASTRUCTURES-CVLN'),
  INF('ENT-META-CVLN', 'GOVERNS', 'ENT-ENTITES-METIER-CVLN'),
  INF('ENT-CVLN-COMMAND-CENTER', 'SUPERVISES', 'ENT-CVLN-GROUP'),
  INF('ENT-CVLN-AGENT-FACTORY', 'DEPENDS_ON', 'ENT-CVLN-BRAIN'),
  INF('ENT-PROOF-LAYER', 'DEPENDS_ON', 'ENT-FREKCORE'),
  INF('ENT-CVLN-WALLET', 'PROVIDES', 'ENT-CVLN-GROUP'),
]

export const RELATIONS = _RELATIONS.map((r, i) => ({
  relation_id: 'REL-' + String(i + 1).padStart(4, '0'),
  ...r,
}))

/* =========================== DOCTRINE =========================== */
export const DOCTRINE = {
  JCC: {
    name: 'JCC',
    statement: 'JCC est la monnaie interne de CVLN Group.',
    declared_classification: 'INTERNAL_CURRENCY',
    verified_reality: 'UNVERIFIED',
    do_not_requalify_as: [
      'legal_tender',
      'regulated_electronic_money',
      'crypto_asset',
      'financial_security',
      'bank_deposit',
    ],
    requalification_requires: 'preuve documentaire ou décision explicite',
    related_entity: 'ENT-CVLN-WALLET',
    provenance: 'founding_doctrine',
  },
}

/* =========================== BASELINE =========================== */
export const BASELINE = {
  name: 'CVLN Foundation Baseline',
  version: 'v1',
  frozen: true,
  date: BASELINE_DATE,
  registry_schema_version: SCHEMA_VERSION,
  description:
    'Snapshot canonique et gelé de l’architecture fondatrice de CVLN Group, ' +
    'extraite du TREE fondateur (app/page.js) sans réinterprétation.',
  changelog: [
    {
      version: 'v1',
      date: BASELINE_DATE,
      changes: [
        'Extraction du TREE fondateur en Entity Registry canonique et machine-readable.',
        'Attribution d’un entity_id stable, unique et persistant à chaque entité.',
        'Attribution d’un type explicite (LEGAL_ENTITY / BUSINESS_ENTITY / PLATFORM / INFRASTRUCTURE / PROTOCOL / SERVICE / FORMAT / PROGRAM / AGENT).',
        'Formalisation des relations : 28 PART_OF (miroir exact du TREE) + 7 relations inférées, flaggées INFERRED.',
        'Ajout des métadonnées : status, provenance, evidence_source, confidence, as_of, verified_reality.',
        'Distinction explicite architecture DÉCIDÉE (DECIDED) vs réalité VÉRIFIÉE (UNVERIFIED à ce stade).',
        'Doctrine JCC préservée, sans requalification juridique.',
        'Aucune architecture fondatrice modifiée, simplifiée ou réinterprétée.',
      ],
    },
  ],
}

/* =========================== HELPERS =========================== */
export const getEntity = (id) => ENTITIES.find((e) => e.entity_id === id) || null

export const getRelationsFor = (id) => ({
  outgoing: RELATIONS.filter((r) => r.from === id),
  incoming: RELATIONS.filter((r) => r.to === id),
})

const countBy = (arr, key) =>
  arr.reduce((acc, x) => {
    acc[x[key]] = (acc[x[key]] || 0) + 1
    return acc
  }, {})

/* ---- Dérivation du TREE (UI) depuis le Registry (source unique) ---- */
export function buildTree() {
  const byId = Object.fromEntries(ENTITIES.map((e) => [e.entity_id, e]))
  const childrenMap = {}
  const parentOf = {}
  for (const r of RELATIONS) {
    if (r.type !== 'PART_OF') continue
    ;(childrenMap[r.to] || (childrenMap[r.to] = [])).push(r.from)
    parentOf[r.from] = r.to
  }
  const make = (id) => {
    const e = byId[id]
    const kids = (childrenMap[id] || []).map(make)
    const node = { entity_id: e.entity_id, name: e.name, tag: e.declared_role, desc: e.description, type: e.type }
    if (kids.length) node.children = kids
    return node
  }
  const roots = ENTITIES.filter((e) => !parentOf[e.entity_id]).map((e) => e.entity_id)
  return make(roots[0])
}
export const getUiTree = () => buildTree()

/* ---- Validation & contrôle d'intégrité ---- */
export function validateRegistry() {
  const errors = []

  // 1) entity_id dupliqués
  const seen = new Set()
  const dup = []
  for (const e of ENTITIES) {
    if (seen.has(e.entity_id)) dup.push(e.entity_id)
    seen.add(e.entity_id)
  }
  if (dup.length) errors.push({ code: 'DUPLICATE_ENTITY_ID', ids: dup })

  // 2) relation_id dupliqués
  const seenR = new Set()
  const dupR = []
  for (const r of RELATIONS) {
    if (seenR.has(r.relation_id)) dupR.push(r.relation_id)
    seenR.add(r.relation_id)
  }
  if (dupR.length) errors.push({ code: 'DUPLICATE_RELATION_ID', ids: dupR })

  // 3) relations vers entités inexistantes
  for (const r of RELATIONS) {
    if (!seen.has(r.from)) errors.push({ code: 'DANGLING_RELATION_FROM', relation_id: r.relation_id, missing: r.from })
    if (!seen.has(r.to)) errors.push({ code: 'DANGLING_RELATION_TO', relation_id: r.relation_id, missing: r.to })
  }

  // 4) racine unique (exactement une entité sans PART_OF sortant)
  const parentOf = {}
  for (const r of RELATIONS) if (r.type === 'PART_OF') parentOf[r.from] = r.to
  const roots = ENTITIES.filter((e) => !parentOf[e.entity_id]).map((e) => e.entity_id)
  if (roots.length !== 1) errors.push({ code: 'ROOT_COUNT', expected: 1, got: roots.length, roots })

  // 5) pas de cycle PART_OF
  for (const e of ENTITIES) {
    let cur = e.entity_id
    let steps = 0
    const path = new Set([cur])
    while (parentOf[cur]) {
      cur = parentOf[cur]
      if (path.has(cur)) { errors.push({ code: 'CYCLE', at: e.entity_id }); break }
      path.add(cur)
      if (++steps > 1000) { errors.push({ code: 'CYCLE_DEPTH', at: e.entity_id }); break }
    }
  }

  // 6) types valides
  for (const e of ENTITIES) {
    if (!ENTITY_TYPES.includes(e.type)) errors.push({ code: 'UNKNOWN_ENTITY_TYPE', entity_id: e.entity_id, type: e.type })
  }
  for (const r of RELATIONS) {
    if (!RELATION_TYPES.includes(r.type)) errors.push({ code: 'UNKNOWN_RELATION_TYPE', relation_id: r.relation_id, type: r.type })
  }

  // 7) cohérence Registry <-> représentation UI (le TREE dérivé doit
  //    contenir exactement toutes les entités, une seule fois)
  const treeIds = []
  const walk = (n) => { treeIds.push(n.entity_id); (n.children || []).forEach(walk) }
  try { walk(buildTree()) } catch (err) { errors.push({ code: 'TREE_BUILD_FAILED', message: String(err) }) }
  const treeSet = new Set(treeIds)
  if (treeIds.length !== ENTITIES.length || treeSet.size !== ENTITIES.length) {
    errors.push({ code: 'UI_TREE_MISMATCH', tree_nodes: treeIds.length, entities: ENTITIES.length })
  }

  const partOf = RELATIONS.filter((r) => r.type === 'PART_OF').length
  return {
    ok: errors.length === 0,
    checked_at: new Date().toISOString(),
    errors,
    stats: {
      entities: ENTITIES.length,
      relations: RELATIONS.length,
      part_of: partOf,
      inferred: RELATIONS.length - partOf,
      entity_types: countBy(ENTITIES, 'type'),
      relation_types: countBy(RELATIONS, 'type'),
      verified_reality: countBy(ENTITIES, 'verified_reality'),
      architectural_status: countBy(ENTITIES, 'architectural_status'),
    },
  }
}

/* ---- Export JSON versionné du Registry ---- */
export function exportRegistry() {
  const validation = validateRegistry()
  return {
    registry: 'CVLN Group Entity Registry',
    namespace: NAMESPACE,
    schema_version: SCHEMA_VERSION,
    baseline: BASELINE,
    doctrine: DOCTRINE,
    generated_at: new Date().toISOString(),
    counts: {
      entities: ENTITIES.length,
      relations: RELATIONS.length,
      part_of: RELATIONS.filter((r) => r.type === 'PART_OF').length,
      inferred: RELATIONS.filter((r) => r.provenance === 'inferred_from_declared_role').length,
    },
    validation,
    entities: ENTITIES,
    relations: RELATIONS,
  }
}
