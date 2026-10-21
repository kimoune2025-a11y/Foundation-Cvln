# CVLN Foundation

Racine du groupe CVLN. Ce dépôt porte deux choses :

- le **registre canonique du groupe** : la liste unique des entités (`ENT-*`) et de leurs relations, que les
  autres briques lisent au lieu de tenir chacune leur propre liste ;
- la **mission de réconciliation CVLN-GOV-RECON-001** : mandat, inventaire, preuves, décisions et état
  d'avancement, dans [`docs/governance/`](docs/governance/).

Identifiant au registre : `ENT-CVLN-FOUNDATION`.

## En ligne

| | |
|---|---|
| Service | `cvln-foundation` sur Render, branche `main`, déploiement automatique |
| Adresse | https://cvln-foundation.onrender.com |
| Configuration | [`render.yaml`](render.yaml) (Blueprint Render) |

Sur l'offre gratuite, le service s'endort après 15 minutes sans visite ; les appels d'un autre service
reçoivent alors une erreur 502. Pour que les autres briques puissent toujours lire le registre, le service doit
passer sur une offre payante (voir [09](docs/governance/reconciliation/09-integration-matrix.md) §4).

## API

Lecture publique, sans identifiant :

| Route | Contenu |
|---|---|
| `GET /api/registry/export` | Instantané versionné du registre (contrat lu par les autres briques) |
| `GET /api/registry/validate` | Rapport d'intégrité du registre |
| `GET /api/registry/baseline` | Baseline en vigueur et doctrine |
| `GET /api/registry/tree` | Arborescence du groupe |
| `GET /api/entities`, `GET /api/entities/{id}`, `GET /api/relations` | Entités et relations |

Formulaire de contact :

- `POST /api/contact` : public, borné ;
- `GET /api/contact` : réservé au jeton `CONTACT_ADMIN_TOKEN` (lu par Command Center).

Toute modification de la forme de `/api/registry/export` ou de `/api/contact` casse la CI
`foundation-integration` de Command Center : la lancer avant de fusionner.

## Qui lit le registre

| Brique | Comment | État |
|---|---|---|
| CVLN Command Center | `FOUNDATION_API_URL` ; synchronisation au démarrage puis périodique | Configuré en ligne ; en échec tant que Foundation dort |
| CVLN Agent Factory | `CVLN_REGISTRY_URL` ; `GET /api/cvln-registry` | Fusionné, testé |
| Laurent.ia | `CVLN_REGISTRY_BASE_URL` et `CVLN_REGISTRY_ALLOWED_HOSTS` | Fusionné, testé |
| KORA | `GET /api/cvln-registry` | Fusionné, testé |
| CVLN Academy, FREKCORE, Kiltikonet | Clients prêts sur des branches | En attente de CI |

Foundation n'appelle aucune autre brique.

## Variables

| Variable | Rôle |
|---|---|
| `MONGO_URL`, `DB_NAME` | Base du formulaire de contact (le registre n'en a pas besoin) |
| `CONTACT_ADMIN_TOKEN` | Jeton de lecture des messages, partagé avec Command Center (`FOUNDATION_CONTACT_TOKEN`) |
| `CORS_ORIGINS` | Origines autorisées (`*` par défaut) |

Aucun secret dans Git : ce dépôt est public.

## Développement

```bash
npx yarn@1.22.22 install
npx next dev            # http://localhost:3000
npx next build          # vérification de compilation
node scripts/registry-integrity.mjs   # intégrité du registre (aussi en CI)
```

Le registre vit dans `lib/registry/cvlnRegistry.js` ; les baselines versionnées dans `lib/registry/baseline/`.
Ne pas les modifier sans décision `VALIDATED` et nouvelle baseline (voir [`CLAUDE.md`](CLAUDE.md)).

## Gouvernance

Commencer par [`docs/governance/reconciliation/STATUS.md`](docs/governance/reconciliation/STATUS.md) :
phase en cours, bloquants et prochaine action. La carte des liaisons entre briques est dans
[`09-integration-matrix.md`](docs/governance/reconciliation/09-integration-matrix.md).
