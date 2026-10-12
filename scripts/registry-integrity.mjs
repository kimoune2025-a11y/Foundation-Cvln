/* ==================================================================
 * CVLN GROUP — REGISTRY INTEGRITY CHECK
 * ------------------------------------------------------------------
 * Contrôle d'intégrité du registre canonique, exécutable localement
 * et en CI, sans aucune dépendance :
 *
 *   node scripts/registry-integrity.mjs
 *
 * Ce script ne modifie rien. Il échoue (code 1) si :
 *   1. validateRegistry() signale une erreur ;
 *   2. le registre diffère du snapshot gelé de la baseline
 *      (lib/registry/baseline/foundation-baseline-v2.json) — toute
 *      évolution du registre doit être délibérée et passer par une
 *      nouvelle baseline versionnée ;
 *   3. une entité possède plusieurs parents PART_OF ;
 *   4. une relation inférée n'est pas marquée comme telle ;
 *   5. une entité ou relation revendique une réalité vérifiée sans
 *      source de preuve (evidence_source) ;
 *   6. un identifiant ne respecte pas le format ENT-* / REL-NNNN.
 *
 * Référence : docs/governance/CVLN-ECOSYSTEM-RECONCILIATION-MASTER-PLAN.md
 * ================================================================== */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE_PATH = path.join(ROOT, 'lib/registry/baseline/foundation-baseline-v2.json')

const R = await import(path.join(ROOT, 'lib/registry/cvlnRegistry.js'))
const snapshot = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))

const failures = []
const fail = (code, detail) => failures.push({ code, detail })
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// 1) Validation intégrée au registre
const validation = R.validateRegistry()
if (!validation.ok) fail('REGISTRY_VALIDATION', validation.errors)

// 2) Gel de la baseline
for (const [key, live] of [
  ['schema_version', R.SCHEMA_VERSION],
  ['namespace', R.NAMESPACE],
  ['baseline', R.BASELINE],
  ['doctrine', R.DOCTRINE],
  ['entities', R.ENTITIES],
  ['relations', R.RELATIONS],
]) {
  if (!same(snapshot[key], live)) fail('BASELINE_DRIFT', `"${key}" diffère du snapshot gelé ${path.relative(ROOT, BASELINE_PATH)}`)
}

// 3) Un seul parent PART_OF par entité
const parents = {}
for (const r of R.RELATIONS) if (r.type === 'PART_OF') (parents[r.from] ||= []).push(r.to)
for (const [id, list] of Object.entries(parents)) {
  if (list.length > 1) fail('MULTIPLE_PART_OF_PARENTS', { entity_id: id, parents: list })
}

// 4) Les relations inférées restent identifiées comme telles
for (const r of R.RELATIONS) {
  const inferredByProvenance = String(r.provenance || '').startsWith('inferred')
  if (inferredByProvenance !== (r.confidence === 'INFERRED')) {
    fail('INFERRED_MARKING', { relation_id: r.relation_id, provenance: r.provenance, confidence: r.confidence })
  }
}

// 5) Aucune réalité vérifiée sans preuve
for (const x of [...R.ENTITIES, ...R.RELATIONS]) {
  if (x.verified_reality !== 'UNVERIFIED' && !x.evidence_source) {
    fail('VERIFIED_WITHOUT_EVIDENCE', { id: x.entity_id || x.relation_id, verified_reality: x.verified_reality })
  }
}

// 6) Format des identifiants
for (const e of R.ENTITIES) if (!/^ENT-[A-Z0-9]+(-[A-Z0-9]+)*$/.test(e.entity_id)) fail('ENTITY_ID_FORMAT', e.entity_id)
for (const r of R.RELATIONS) if (!/^REL-\d{4}$/.test(r.relation_id)) fail('RELATION_ID_FORMAT', r.relation_id)

const report = {
  ok: failures.length === 0,
  registry_schema_version: R.SCHEMA_VERSION,
  baseline: `${R.BASELINE.name} ${R.BASELINE.version}`,
  stats: validation.stats,
  failures,
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2))
} else {
  const s = validation.stats
  console.log(`CVLN registry integrity — schema ${report.registry_schema_version}, ${report.baseline}`)
  console.log(`  ${s.entities} entités · ${s.relations} relations (${s.part_of} PART_OF, ${s.inferred} inférées)`)
  if (report.ok) console.log('  OK — aucune anomalie')
  else for (const f of failures) console.log(`  ÉCHEC ${f.code}: ${typeof f.detail === 'string' ? f.detail : JSON.stringify(f.detail)}`)
}

process.exit(report.ok ? 0 : 1)
