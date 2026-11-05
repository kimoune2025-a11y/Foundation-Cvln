#!/usr/bin/env python3
"""CVLN Technology Gap Register: evidence scan of the group's repositories.

Usage:  python3 scripts/tech-gap-scan.py <dir containing the repository clones> [out.json | out.md] [--public]

--public drops the evidence file paths (Foundation is a public repository); run without it
locally to see the files behind each status.

For each technology of the catalogue below and each repository, the scan looks for
evidence in four places and assigns the highest status the evidence supports:

  ABSENT       no trace at all
  IDENTIFIED   mentioned in documentation only (Markdown)
  IMPLEMENTED  source code uses it (a declared dependency alone stays IDENTIFIED,
               except for manifest-only technologies such as Docker)
  TESTED       source code uses it and a test file exercises it too

INTEGRATED, PRODUCTION and VERIFIED cannot be read from code: they need runtime
evidence (deployments, logs, end-to-end tests) and are recorded by hand in the
register, with the evidence identifier. Patterns are deliberately specific (package
names, imports, API calls) so that a word in a comment does not count as code.
Technologies that are practices rather than artefacts (Zero Trust, DDD, SLO...) are
marked "practice": a scan cannot prove them either way.
"""
import json
import os
import re
import sys

EXCLUDED_DIRS = {
    ".git", "node_modules", "dist", "build", ".next", "venv", ".venv", "__pycache__",
    "archive", "vendor", "coverage", ".expo", "android", "ios", "Pods",
}
MANIFESTS = re.compile(r"(^requirements[^/]*\.txt$|^package\.json$|^pyproject\.toml$|^go\.mod$|^Cargo\.toml$|^Dockerfile[^/]*$|^docker-compose[^/]*\.ya?ml$)")
CODE_EXT = (".py", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".go", ".rs", ".yml", ".yaml", ".toml", ".sh")
TEST_FILE = re.compile(r"(^|/)(tests?|__tests__|e2e|contract_tests)/|(^|/)test_[^/]+\.py$|_test\.py$|\.(test|spec)\.[jt]sx?$")
MAX_BYTES = 600_000
TEST_TECH = ("Tests unitaires", "Tests de bout en bout", "Tests de contrat", "Tests par proprietes", "Tests de mutation", "Tests de charge")

# (category, technology, dependency regex, code regex)  — None means "practice".
CATALOGUE = [
    # 1. Protocoles et interoperabilite
    ("Protocoles", "MCP (Model Context Protocol)", r"\bmcp\b|modelcontextprotocol|fastmcp", r"from mcp\b|import mcp\b|@modelcontextprotocol|FastMCP|\"jsonrpc\"\s*:\s*\"2\.0\""),
    ("Protocoles", "A2A (Agent2Agent)", r"a2a-sdk|python-a2a|@a2a-js", r"agent-card\.json|\.well-known/agent\.json|from a2a\b|a2a\.types"),
    ("Protocoles", "ANP (Agent Network Protocol)", r"agent-network-protocol|agentconnect", r"\bANP\b.*(did:wba|agent)"),
    ("Protocoles", "AG-UI", r"@ag-ui/|ag-ui-protocol", r"from ag_ui\b|@ag-ui/"),
    ("Protocoles", "WebMCP", r"webmcp", r"navigator\.modelContext|webmcp"),
    ("Protocoles", "ACP (Agent Commerce/Communication Protocol)", r"acp-sdk|agentic-commerce", r"from acp_sdk\b|agentic_commerce"),
    ("Protocoles", "AP2 (Agent Payments Protocol)", r"\bap2\b", r"from ap2\b|IntentMandate|CartMandate"),
    ("Protocoles", "x402 (paiements HTTP 402)", r"\bx402\b", r"x402|X-PAYMENT\b"),
    ("Protocoles", "OpenAPI 3.x (contrat publie)", r"openapi-spec-validator|@redocly|swagger-ui", r"\"openapi\"\s*:\s*\"3\.|^openapi:\s*['\"]?3\.|openapi_url|get_openapi\("),
    ("Protocoles", "AsyncAPI", r"asyncapi", r"^asyncapi:\s*['\"]?[23]\."),
    ("Protocoles", "GraphQL / Federation", r"graphql|strawberry|apollo", r"from strawberry\b|import graphene|@apollo/|ApolloServer|buildSubgraphSchema"),
    ("Protocoles", "gRPC", r"@grpc/grpc-js", r"import grpc\b|from grpc\b|@grpc/grpc-js"),
    ("Protocoles", "WebRTC", r"aiortc|simple-peer|peerjs|mediasoup", r"RTCPeerConnection|from aiortc\b"),
    ("Protocoles", "WebSocket", r"websockets|socket\.io|\bws\b", r"WebSocket\(|@\w+\.websocket\(|websocket_route|from fastapi import .*WebSocket|socket\.io"),
    ("Protocoles", "CloudEvents", r"cloudevents", r"from cloudevents\b|specversion['\"]?\s*:\s*['\"]1\.0"),
    ("Protocoles", "OpenID Federation", r"openid-federation|fedservice", r"entity_statement|openid-federation|\.well-known/openid-federation"),
    ("Protocoles", "SCIM", r"scim2|scim-server", r"/scim/v2|urn:ietf:params:scim"),
    # 2. Identite, authentification, souverainete
    ("Identite", "DID (identifiants decentralises)", r"didkit|did-resolver|did-jwt|\bpydid\b", r"did:(key|web|wba|ion|peer|frek)\b"),
    ("Identite", "Verifiable Credentials", r"vc-js|@digitalbazaar/vc|didkit|veramo", r"VerifiableCredential|credentialSubject|w3\.org/2018/credentials|w3\.org/ns/credentials"),
    ("Identite", "OpenID Connect", r"openid-client|next-auth|oidc-provider", r"openid-configuration|id_token|\bOIDC\b|authlib\.integrations"),
    ("Identite", "OAuth 2.x", r"simple-oauth2|@react-oauth/google", r"OAuth2PasswordBearer|grant_type|authorization_code|client_credentials"),
    ("Identite", "WebAuthn / FIDO2 / passkeys", r"\bwebauthn\b|@simplewebauthn|fido2|py_webauthn", r"from webauthn\b|navigator\.credentials\.(create|get)|@simplewebauthn|generate_registration_options"),
    ("Identite", "SAML 2.0", r"python3-saml|pysaml2|samlify|passport-saml", r"from onelogin\.saml2|import saml2\b|SAMLResponse"),
    ("Identite", "SPIFFE / SPIRE", r"spiffe|spire", r"spiffe://"),
    ("Identite", "mTLS", r"", r"ssl\.CERT_REQUIRED|verify_mode\s*=\s*ssl|--ssl-ca-certs|client_cert|mTLS"),
    ("Identite", "PKI / certificats X.509", r"node-forge", r"x509\.|CertificateBuilder|CertificateSigningRequest|load_pem_x509"),
    ("Identite", "HSM", r"python-pkcs11|pkcs11|pykcs11", r"pkcs11|\bHSM\b.*(sign|key)"),
    ("Identite", "KMS (gestion de cles)", r"google-cloud-kms|aws-kms|@aws-sdk/client-kms|hvac|azure-keyvault", r"kms_client|KMSClient|KeyManagementService|hvac\.Client|key_vault"),
    ("Identite", "Remote attestation / TEE", r"", r"remote_attestation|attestation_report|sgx_|nitro_enclave|tdx_quote"),
    ("Identite", "ABAC / ReBAC / policy-as-code", r"casbin|oso|openfga|permit|cerbos|cedar", r"casbin|OpenFga|cedarpolicy|import oso\b|Cerbos"),
    ("Identite", "Capability-based security (scopes)", r"", r"require_scope\(|has_scope\(|scopes\s*=\s*\[|\"scopes\"\s*:"),
    ("Identite", "Multi-tenancy (isolation par organisation)", r"", r"tenant_id|TenantContext|X-Tenant|current_tenant"),
    ("Identite", "Zero Trust", None, None),
    # 3. IA et autonomie
    ("IA", "Orchestration multi-agents", r"langgraph|crewai|autogen|semantic-kernel|langchain", r"orchestrat\w*\(|class \w*Orchestrator\b|from langgraph\b|from crewai\b"),
    ("IA", "Decouverte d'agents (registre)", r"", r"agent_registry|AgentRegistry|/agents/discover|agent_card"),
    ("IA", "Delegation d'agents", r"", r"delegat\w*_(task|mission|agent)|delegation_token|on_behalf_of"),
    ("IA", "Evaluation d'agents (evals)", r"ragas|deepeval|promptfoo|langsmith|openai-evals", r"def (run_)?eval\w*\(|eval_dataset|golden_set|from ragas\b|from deepeval\b"),
    ("IA", "Observabilite des agents (traces LLM)", r"langfuse|langsmith|arize|phoenix|helicone|openllmetry", r"langfuse|LangSmith|trace_llm|llm_trace"),
    ("IA", "Simulation / dry-run", r"", r"dry_run|DRY_RUN|simulation_mode|shadow_mode|SHADOW"),
    ("IA", "Sandboxing d'execution", r"e2b|firecracker|gvisor|nsjail|pyodide", r"from e2b\b|sandbox\.(run|exec)|Sandbox\("),
    ("IA", "Memoire d'agent persistante", r"mem0|letta|zep|memgpt", r"agent_memory|long_term_memory|memory_store|from mem0\b"),
    ("IA", "Human-in-the-loop (validation humaine)", r"", r"require_human|human_approval|pending_approval|validation_humaine|escalat\w*_to_laurent|awaiting_validation"),
    ("IA", "Routage de modeles", r"litellm|openrouter", r"model_router|route_model|select_model|MODEL_ROUTING|sovereign_routing"),
    ("IA", "Registre de modeles", r"mlflow|wandb|huggingface_hub", r"model_registry|ModelRegistry|mlflow\.register_model"),
    ("IA", "Inference locale / modeles embarques", r"llama-cpp|llama_cpp|ollama|vllm|onnxruntime|ctransformers|gguf", r"from llama_cpp\b|Llama\(model_path|\.gguf|ollama\.|onnxruntime"),
    ("IA", "Quantification", r"bitsandbytes|auto-gptq|optimum", r"q2_k|q4_k|q8_0|load_in_4bit|load_in_8bit|quantiz"),
    ("IA", "Fine-tuning / LoRA", r"\bpeft\b|trl|unsloth|axolotl", r"LoraConfig|get_peft_model|SFTTrainer|lora_r\b"),
    ("IA", "Distillation", r"", r"distill\w*\(|teacher_model|student_model"),
    ("IA", "Federated learning", r"flwr|flower|syft|fedml", r"import flwr\b|fl\.server|FederatedAveraging"),
    ("IA", "Edge AI (navigateur/appareil)", r"onnxruntime-web|@xenova/transformers|transformers\.js|tensorflow/tfjs|webllm|@mlc-ai", r"onnxruntime-web|@xenova/transformers|@mlc-ai/web-llm|tf\.loadGraphModel"),
    ("IA", "Neuro-symbolique / regles", r"pyke|clingo|owlready2", r"rule_engine|RuleEngine|from owlready2\b"),
    # 4. Infrastructure
    ("Infrastructure", "Docker / conteneurs", r"^FROM\s+\S+", r""),
    ("Infrastructure", "Docker Compose", r"^services:\s*$", r""),
    ("Infrastructure", "Kubernetes / K3s / Helm", r"", r"^apiVersion:\s*(apps/v1|v1|batch/v1)\s*$|^kind:\s*(Deployment|StatefulSet|Service)\s*$|Chart\.yaml"),
    ("Infrastructure", "WebAssembly / WASI", r"wasmtime|wasmer|wasm-bindgen|@bytecodealliance", r"WebAssembly\.instantiate|wasmtime|\.wasm['\"]"),
    ("Infrastructure", "libp2p / IPFS", r"libp2p|ipfs|helia", r"libp2p|ipfs\.add|create(Helia|Libp2p)"),
    ("Infrastructure", "NATS", r"nats-py|\bnats\b", r"import nats\b|nats\.connect"),
    ("Infrastructure", "Kafka", r"kafka|aiokafka|kafkajs", r"KafkaProducer|AIOKafka|new Kafka\("),
    ("Infrastructure", "Redis / file de messages", r"\bredis\b|ioredis|celery|rq\b|bullmq|arq", r"import redis\b|Redis\(|from celery\b|new Queue\("),
    ("Infrastructure", "Temporal (workflows durables)", r"temporalio|@temporalio", r"from temporalio\b|@workflow\.defn"),
    ("Infrastructure", "Terraform / OpenTofu", r"", r"^\s*resource\s+\"\w+\"\s+\"\w+\"|^\s*provider\s+\"\w+\""),
    ("Infrastructure", "Ansible", r"", r"^\s*- hosts:\s|ansible\.builtin"),
    ("Infrastructure", "GitOps (Argo CD / Flux)", r"", r"argoproj\.io|fluxcd\.io"),
    ("Infrastructure", "Infrastructure declarative (render.yaml / vercel.json)", r"", r"^services:\s*\n\s*- type:\s*(web|static)|\"buildCommand\"\s*:"),
    ("Infrastructure", "Edge workers (Cloudflare / Vercel Edge)", r"wrangler|@cloudflare/workers", r"export const runtime\s*=\s*['\"]edge['\"]"),
    ("Infrastructure", "Stockage objet (S3 et compatibles)", r"boto3|@aws-sdk/client-s3|minio", r"s3\.put_object|upload_fileobj|PutObjectCommand|boto3\.client\(['\"]s3"),
    ("Infrastructure", "Planificateur / taches de fond", r"apscheduler|node-cron", r"asyncio\.create_task\(|AsyncIOScheduler|cron\.schedule|create_task\(\w*(scheduler|loop|watch)"),
    # 5. Donnees et connaissances
    ("Donnees", "MongoDB", r"motor|pymongo|mongodb|mongoose", r"AsyncIOMotorClient|MongoClient|mongoose\.connect"),
    ("Donnees", "PostgreSQL / SQL", r"psycopg|asyncpg|sqlalchemy|prisma|\bpg\b", r"create_engine\(|asyncpg\.connect|new Pool\(|PrismaClient"),
    ("Donnees", "Graphe de connaissances / graphe de proprietes", r"neo4j|networkx|rdflib|graphology", r"from neo4j\b|import networkx|from rdflib\b|nodes.*edges|relationship_graph"),
    ("Donnees", "RDF / OWL / SPARQL / JSON-LD", r"rdflib|owlready2|jsonld|pyld", r"SPARQL|@context['\"]?\s*:|application/ld\+json|owl:Class"),
    ("Donnees", "Base vectorielle / embeddings", r"qdrant|chroma|pinecone|weaviate|faiss|pgvector|milvus|sentence-transformers|lancedb", r"embedding\w*\(|cosine_similarity|QdrantClient|chromadb|faiss\.|\$vectorSearch"),
    ("Donnees", "Recherche hybride / plein texte", r"elasticsearch|opensearch|meilisearch|typesense|whoosh|rank-bm25", r"\$text\s*:|BM25|create_index\(\[\(.*TEXT|\"\$search\""),
    ("Donnees", "RAG", r"llama-index|langchain|haystack", r"retriev\w*\(|rag_\w+|build_context\(|top_k"),
    ("Donnees", "Event sourcing / journal d'evenements", r"eventstore|esdbclient", r"event_store|append_event|EventStore|event_log|events\.insert_one"),
    ("Donnees", "Bus d'evenements interne", r"", r"event_bus|EventBus|publish\(\s*['\"][\w.]+['\"]|subscribe\(\s*['\"][\w.]+['\"]"),
    ("Donnees", "CQRS", r"", r"CommandHandler|QueryHandler|\bcqrs\b"),
    ("Donnees", "Change Data Capture (change streams)", r"debezium", r"\.watch\(\s*\)|change_stream|changeStream"),
    ("Donnees", "Lineage / provenance des donnees", r"openlineage|marquez", r"lineage|provenance\w*\s*[:=]"),
    ("Donnees", "Validation de schemas (JSON Schema / Pydantic / Zod)", r"jsonschema|ajv|zod|pydantic", r"jsonschema\.validate|Draft20\d\dValidator|new Ajv|z\.object\(|BaseModel\)"),
    ("Donnees", "Contrats de donnees / registre canonique", r"", r"registry/export|cvlnRegistry|canonical_registry|data_contract"),
    ("Donnees", "Lakehouse / Iceberg / Parquet", r"pyiceberg|pyarrow|duckdb|deltalake", r"to_parquet\(|import duckdb|pyiceberg"),
    ("Donnees", "Migrations de schema versionnees", r"alembic|mongomigrate|knex|prisma", r"alembic|def upgrade\(|migrations?/\d+|run_migrations"),
    ("Donnees", "Sauvegarde / restauration", r"", r"mongodump|mongorestore|backup_\w+\(|restore_\w+\(|def (backup|restore)\b"),
    # 6. Cryptographie et preuves
    ("Cryptographie", "Signatures numeriques (Ed25519 / ECDSA)", r"pynacl|tweetnacl|@noble/ed25519", r"Ed25519PrivateKey|ed25519|ECDSA|SigningKey|\.sign\(.*(private|key)"),
    ("Cryptographie", "Arbres de Merkle", r"merkletools|merkletreejs", r"merkle"),
    ("Cryptographie", "Horodatage / ancrage (OpenTimestamps, RFC 3161)", r"opentimestamps|rfc3161", r"opentimestamps|\.ots\b|rfc3161|TimeStampReq"),
    ("Cryptographie", "Journal de transparence (append-only chaine)", r"trillian|rekor", r"prev_hash|previous_hash|hash_chain|append_only"),
    ("Cryptographie", "Preuves a divulgation nulle (ZKP / SNARK / STARK)", r"snarkjs|circomlib|py_ecc|arkworks|halo2|@noir-lang", r"groth16|plonk|zk_proof|snarkjs|circom"),
    ("Cryptographie", "MPC / chiffrement homomorphe", r"tenseal|concrete-ml|openfhe|mpyc|pyfhel", r"tenseal|homomorphic|import mpyc"),
    ("Cryptographie", "Confidentialite differentielle", r"opendp|diffprivlib|pydp", r"laplace_mechanism|epsilon_budget|differential_privacy"),
    ("Cryptographie", "Chiffrement applicatif des donnees (AES-GCM...)", r"pycryptodome", r"AESGCM|Fernet\(|ChaCha20Poly1305"),
    ("Cryptographie", "Rotation des cles", r"", r"rotate_key|key_rotation|rotation des cl"),
    ("Cryptographie", "Gestion des secrets (coffre)", r"hvac|infisical|doppler|@aws-sdk/client-secrets-manager", r"hvac\.Client|SecretsManager|infisical"),
    ("Cryptographie", "Cryptographie post-quantique (ML-KEM / ML-DSA)", r"liboqs|oqs|pqcrypto|kyber|dilithium", r"ML-KEM|ML-DSA|kyber|dilithium|oqs\."),
    ("Cryptographie", "Provenance de contenus (C2PA)", r"c2pa", r"c2pa|content_credentials"),
    # 7. Securite chaine logicielle
    ("Securite", "SCA (audit des dependances)", r"pip-audit|safety", r"pip-audit|npm audit|safety check|dependabot|osv-scanner"),
    ("Securite", "SAST", r"bandit|semgrep", r"bandit\s+-|semgrep|codeql|github/codeql-action"),
    ("Securite", "Detection de secrets", r"gitleaks|trufflehog|detect-secrets", r"gitleaks|trufflehog|detect-secrets|check_secrets"),
    ("Securite", "DAST / scan dynamique", r"zap|nuclei", r"zaproxy|owasp-zap|nuclei"),
    ("Securite", "SBOM", r"cyclonedx|syft", r"cyclonedx|syft\s|sbom|spdx-sbom"),
    ("Securite", "Signature d'artefacts / provenance (Sigstore, SLSA)", r"sigstore|cosign", r"cosign|sigstore|slsa-github-generator|attest-build-provenance"),
    ("Securite", "Mises a jour automatiques (Dependabot / Renovate)", r"", r"package-ecosystem:|renovate"),
    ("Securite", "Limitation de debit", r"slowapi|express-rate-limit|limits", r"rate_limit|RateLimit|Limiter\(|429"),
    ("Securite", "En-tetes de securite / CSP", r"helmet|secure", r"Content-Security-Policy|Strict-Transport-Security|X-Frame-Options"),
    ("Securite", "WAF / protection DDoS", None, None),
    ("Securite", "Tests d'intrusion / Red Team", r"", r"red_team|redteam|pentest|attack_scenario"),
    ("Securite", "Modelisation des menaces", None, None),
    ("Securite", "Plan de reprise apres sinistre", None, None),
    # 8. Observabilite
    ("Observabilite", "OpenTelemetry", r"opentelemetry|@opentelemetry", r"from opentelemetry\b|@opentelemetry/|TracerProvider"),
    ("Observabilite", "Prometheus / metriques", r"prometheus-client|prometheus_client|prom-client|prometheus-fastapi", r"prometheus_client|Counter\(['\"]\w+|/metrics['\"]"),
    ("Observabilite", "Sentry / suivi d'erreurs", r"sentry-sdk|@sentry/", r"sentry_sdk\.init|Sentry\.init"),
    ("Observabilite", "Journalisation structuree", r"structlog|python-json-logger|pino|winston", r"structlog|JsonFormatter|pino\(|winston\.createLogger"),
    ("Observabilite", "Sondes de sante (health checks)", r"", r"/health['\"]|/healthz|healthcheck|/api/health"),
    ("Observabilite", "Journal d'audit des actions", r"", r"audit_log|audit_trail|log_authz|AuditLog|activity_journal"),
    ("Observabilite", "Tests de charge", r"locust|k6|artillery", r"from locust\b|HttpUser|import http from 'k6'|artillery"),
    ("Observabilite", "SLI / SLO / budgets d'erreur", None, None),
    ("Observabilite", "Chaos engineering", r"chaostoolkit|toxiproxy", r"chaos|toxiproxy"),
    ("Observabilite", "FinOps / cout par operation", r"", r"cost_per|token_cost|usage_cost|billing_usage"),
    # 9. Ingenierie
    ("Ingenierie", "CI (GitHub Actions)", r"", r"^on:\s*$|^\s*runs-on:"),
    ("Ingenierie", "TypeScript", r"typescript", r"interface \w+ \{|: string\b.*=>"),
    ("Ingenierie", "Rust", r"", r"^fn main\(\)|\[package\]"),
    ("Ingenierie", "Go", r"", r"^package main$"),
    ("Ingenierie", "Tests unitaires (pytest / vitest / jest)", r"pytest|vitest|jest|mocha", r"def test_\w+\(|\bdescribe\(|\bit\(['\"]|\btest\(['\"]"),
    ("Ingenierie", "Tests de bout en bout (Playwright / Cypress)", r"playwright|cypress|@playwright/test", r"from playwright\b|@playwright/test|cy\.visit"),
    ("Ingenierie", "Tests de contrat", r"pact|schemathesis", r"contract_tests|pact|schemathesis|golden snapshot|api_contract"),
    ("Ingenierie", "Tests par proprietes", r"hypothesis|fast-check", r"from hypothesis\b|fc\.assert"),
    ("Ingenierie", "Tests de mutation", r"mutmut|cosmic-ray|stryker", r"mutmut|stryker"),
    ("Ingenierie", "Lint / format / typage", r"flake8|ruff|black|eslint|mypy|prettier", r"flake8|ruff|black --check|eslint|mypy"),
    ("Ingenierie", "Versionnement d'API (/v1)", r"", r"/api/v\d/|prefix=['\"]/v\d"),
    # 10. Economie numerique
    ("Economie", "Paiements (Stripe / SumUp / autres)", r"stripe|sumup|mollie|adyen|paypal|lemonsqueezy", r"stripe\.|Stripe\(|checkout\.Session|PaymentIntent|sumup"),
    ("Economie", "Abonnements / facturation a l'usage", r"", r"stripe\.Subscription|subscription_plan|billing_cycle|usage_record|metered|abonnement"),
    ("Economie", "Portefeuille / cashless", r"", r"wallet|cashless|solde|balance_cents"),
    ("Economie", "Partage de revenus / redevances", r"", r"royalt|revenue_share|split_payment|ayants?_droit"),
    ("Economie", "Signature electronique", r"docusign|yousign|pyhanko|endesive", r"yousign|docusign|pyhanko|signature_request"),
    ("Economie", "Facturation electronique (e-invoicing / Factur-X)", r"factur-x|facturx|zugferd", r"facturx|factur-x|zugferd|\bUBL\b"),
    ("Economie", "Smart contracts / tokenisation", r"web3|ethers|viem|solana|hardhat", r"from web3\b|ethers\.|pragma solidity"),
    ("Economie", "Gestion des droits / licences d'oeuvres", r"", r"license_terms|rights_holder|droits_d_auteur|usage_rights"),
    # 11. Web et experiences
    ("Web", "PWA (service worker / manifest)", r"vite-plugin-pwa|workbox", r"serviceWorker\.register|\.webmanifest|workbox"),
    ("Web", "Applications mobiles natives (Capacitor / React Native)", r"@capacitor/|react-native|expo", r"@capacitor/core|from 'react-native'"),
    ("Web", "Internationalisation (i18n)", r"i18next|react-intl|next-intl", r"useTranslation\(|i18next|translations\.(js|json)|gettext\("),
    ("Web", "Accessibilite (tests automatises)", r"axe-core|@axe-core|pa11y|jest-axe", r"axe\.run|toHaveNoViolations|pa11y"),
    ("Web", "Design system (composants partages)", r"@radix-ui|shadcn|tailwindcss|@mui|chakra", r"components/ui/"),
    ("Web", "SEO / donnees structurees (JSON-LD)", r"", r"application/ld\+json|schema\.org|sitemap\.xml|llms\.txt"),
    ("Web", "WebGPU / WebXR / 3D", r"three|@react-three|babylonjs|aframe", r"navigator\.gpu|navigator\.xr|from 'three'|@react-three/fiber"),
    ("Web", "Micro-frontends / Web Components", r"single-spa|module-federation|lit", r"customElements\.define|ModuleFederationPlugin"),
    # 12. Gouvernance et conformite
    ("Conformite", "RGPD (consentement, export, effacement)", r"", r"consent|right_to_erasure|delete_my_data|export_my_data|rgpd|gdpr"),
    ("Conformite", "Licences et SPDX", r"", r"SPDX-License-Identifier"),
    ("Conformite", "Registre de decisions / gouvernance tracee", r"", r"decision_log|DEC-\d{4}|decisions\.insert"),
    ("Conformite", "AI Act / ISO 42001 / ISO 27001 / SOC 2", None, None),
    ("Conformite", "eIDAS 2.0 / portefeuille europeen", r"", r"eudi|eidas|EUDI"),
]


def walk(repo):
    for root, dirs, files in os.walk(repo):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS and not d.startswith(".") or d == ".github"]
        for name in files:
            if name == "tech-gap-scan.py":
                continue
            path = os.path.join(root, name)
            rel = os.path.relpath(path, repo)
            try:
                if os.path.getsize(path) > MAX_BYTES:
                    continue
                with open(path, encoding="utf-8", errors="ignore") as fh:
                    text = fh.read()
            except OSError:
                continue
            yield rel, name, text


def classify(rel, name):
    if MANIFESTS.search(name):
        return "dep"
    if name.endswith((".md", ".mdx", ".txt", ".rst")):
        return "doc"
    if name.endswith(CODE_EXT) or name.startswith("Dockerfile"):
        return "test" if TEST_FILE.search(rel) else "code"
    return None


def scan(base):
    repos = sorted(d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d, ".git")))
    compiled = []
    for cat, tech, dep, code in CATALOGUE:
        if dep is None:
            compiled.append((cat, tech, None, None, None))
            continue
        word = re.compile(r"\b" + re.escape(tech.split(" (")[0].split(" /")[0]) + r"\b")
        compiled.append((cat, tech,
                         re.compile(dep, re.I | re.M) if dep else None,
                         re.compile(code, re.M) if code else None,
                         word))
    hits = {(t[1], r): {"dep": [], "code": [], "test": [], "doc": []} for t in compiled for r in repos}
    for repo in repos:
        for rel, name, text in walk(os.path.join(base, repo)):
            kind = classify(rel, name)
            if not kind:
                continue
            for cat, tech, dep, code, word in compiled:
                if word is None:
                    continue
                h = hits[(tech, repo)]
                if kind == "dep":
                    if dep and dep.search(text):
                        h["dep"].append(rel)
                    elif code and code.search(text):
                        h["code"].append(rel)
                elif kind == "doc":
                    if (code and code.search(text)) or word.search(text):
                        h["doc"].append(rel)
                elif code and code.search(text):
                    h[kind].append(rel)
    out = {"repositories": repos, "technologies": []}
    for cat, tech, dep, code, word in compiled:
        row = {"category": cat, "technology": tech, "repos": {}}
        if word is None:
            row["practice"] = True
        for repo in repos:
            h = hits[(tech, repo)]
            if word is None:
                status = "PRACTICE"
            elif tech.startswith(TEST_TECH) and h["test"]:
                status = "TESTED"
            elif h["code"] and h["test"]:
                status = "TESTED"
            elif h["code"] or (h["dep"] and code is None):
                status = "IMPLEMENTED"
            elif h["dep"]:
                status = "IDENTIFIED"  # declared dependency, no use in the code
            elif h["doc"]:
                status = "IDENTIFIED"
            else:
                status = "ABSENT"
            row["repos"][repo] = {
                "status": status,
                "files": {k: len(v) for k, v in h.items()},
                "evidence": (h["code"] or h["dep"] or h["test"] or h["doc"])[:3],
            }
        out["technologies"].append(row)
    return out


SYMBOL = {"ABSENT": "·", "IDENTIFIED": "i", "IMPLEMENTED": "I", "TESTED": "T", "PRACTICE": "—"}


def to_markdown(result):
    repos = result["repositories"]
    lines = ["| Catégorie | Technologie | " + " | ".join(repos) + " |",
             "|---|---|" + "---|" * len(repos)]
    for row in result["technologies"]:
        cells = [SYMBOL[row["repos"][r]["status"]] for r in repos]
        lines.append(f"| {row['category']} | {row['technology']} | " + " | ".join(cells) + " |")
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    if len([a for a in sys.argv[1:] if a != "--public"]) < 1:
        sys.exit(__doc__)
    args = [a for a in sys.argv[1:] if a != "--public"]
    result = scan(args[0])
    if "--public" in sys.argv:
        # Foundation is public: keep statuses and counts, drop file paths of private repositories.
        for row in result["technologies"]:
            for cell in row["repos"].values():
                cell.pop("evidence", None)
    target = args[1] if len(args) > 1 else None
    text = json.dumps(result, ensure_ascii=False, indent=1)
    if target and target.endswith(".md"):
        text = to_markdown(result)
    if target:
        with open(target, "w", encoding="utf-8") as fh:
            fh.write(text)
    else:
        print(text)
