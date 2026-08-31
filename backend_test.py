#!/usr/bin/env python3
"""
CVLN Group Entity Registry API + Contact Endpoints Test Suite
Tests all registry endpoints (read-only) and re-verifies contact endpoints.
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://roots-ecosystem-1.preview.emergentagent.com/api"

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def test_registry_validate():
    """Test 1: GET /api/registry/validate"""
    log("TEST 1: GET /api/registry/validate")
    try:
        resp = requests.get(f"{BASE_URL}/registry/validate", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        # Check structure
        assert "ok" in data, "Missing 'ok' field"
        assert "errors" in data, "Missing 'errors' field"
        assert "stats" in data, "Missing 'stats' field"
        
        # Check validation passed
        if not data["ok"]:
            log(f"❌ FAIL: Validation failed with errors: {data['errors']}")
            return False
        
        if len(data["errors"]) > 0:
            log(f"❌ FAIL: Errors array not empty: {data['errors']}")
            return False
        
        # Check stats
        stats = data["stats"]
        assert stats["entities"] == 29, f"Expected 29 entities, got {stats['entities']}"
        assert stats["relations"] == 35, f"Expected 35 relations, got {stats['relations']}"
        assert stats["part_of"] == 28, f"Expected 28 PART_OF relations, got {stats['part_of']}"
        assert stats["inferred"] == 7, f"Expected 7 inferred relations, got {stats['inferred']}"
        
        log(f"✅ PASS: Validation ok=true, errors=[], stats correct (entities:29, relations:35, part_of:28, inferred:7)")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_entities_list():
    """Test 2: GET /api/entities"""
    log("TEST 2: GET /api/entities")
    try:
        resp = requests.get(f"{BASE_URL}/entities", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "count" in data, "Missing 'count' field"
        assert "entities" in data, "Missing 'entities' field"
        assert data["count"] == 29, f"Expected count 29, got {data['count']}"
        assert len(data["entities"]) == 29, f"Expected 29 entities, got {len(data['entities'])}"
        
        # Verify each entity has required fields
        entity_ids = set()
        for entity in data["entities"]:
            # Check required fields
            assert "entity_id" in entity, f"Entity missing entity_id: {entity}"
            assert entity["entity_id"].startswith("ENT-"), f"entity_id doesn't start with ENT-: {entity['entity_id']}"
            assert "name" in entity, f"Entity {entity['entity_id']} missing name"
            assert "type" in entity, f"Entity {entity['entity_id']} missing type"
            assert "declared_role" in entity, f"Entity {entity['entity_id']} missing declared_role"
            assert "status" in entity, f"Entity {entity['entity_id']} missing status"
            assert "provenance" in entity, f"Entity {entity['entity_id']} missing provenance"
            assert "evidence_source" in entity, f"Entity {entity['entity_id']} missing evidence_source"
            assert entity["evidence_source"] is None, f"Entity {entity['entity_id']} evidence_source should be null"
            assert "confidence" in entity, f"Entity {entity['entity_id']} missing confidence"
            assert "as_of" in entity, f"Entity {entity['entity_id']} missing as_of"
            assert "architectural_status" in entity, f"Entity {entity['entity_id']} missing architectural_status"
            assert entity["architectural_status"] == "DECIDED", f"Entity {entity['entity_id']} architectural_status should be DECIDED"
            assert "verified_reality" in entity, f"Entity {entity['entity_id']} missing verified_reality"
            assert entity["verified_reality"] == "UNVERIFIED", f"Entity {entity['entity_id']} verified_reality should be UNVERIFIED"
            
            # Check for duplicates
            if entity["entity_id"] in entity_ids:
                log(f"❌ FAIL: Duplicate entity_id found: {entity['entity_id']}")
                return False
            entity_ids.add(entity["entity_id"])
        
        log(f"✅ PASS: Got 29 entities, all with correct structure and unique entity_ids")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_entities_filter_by_type():
    """Test 3: GET /api/entities?type=PLATFORM"""
    log("TEST 3: GET /api/entities?type=PLATFORM")
    try:
        resp = requests.get(f"{BASE_URL}/entities?type=PLATFORM", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "count" in data, "Missing 'count' field"
        assert "entities" in data, "Missing 'entities' field"
        
        # Verify all returned entities are PLATFORM type
        for entity in data["entities"]:
            assert entity["type"] == "PLATFORM", f"Entity {entity['entity_id']} has type {entity['type']}, expected PLATFORM"
        
        # Expected PLATFORM entities: KORA, LabelOS, Factory Maker Studio, Kiltikonet, CVLN Wallet, CVLN Agent Factory, CVLN Command Center
        assert data["count"] == 7, f"Expected 7 PLATFORM entities, got {data['count']}"
        
        log(f"✅ PASS: Filter by type=PLATFORM returned {data['count']} entities, all with type PLATFORM")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_entity_by_id():
    """Test 4: GET /api/entities/ENT-KORA"""
    log("TEST 4: GET /api/entities/ENT-KORA")
    try:
        resp = requests.get(f"{BASE_URL}/entities/ENT-KORA", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "entity" in data, "Missing 'entity' field"
        assert "relations" in data, "Missing 'relations' field"
        
        entity = data["entity"]
        assert entity["entity_id"] == "ENT-KORA", f"Expected ENT-KORA, got {entity['entity_id']}"
        assert entity["type"] == "PLATFORM", f"Expected type PLATFORM, got {entity['type']}"
        
        relations = data["relations"]
        assert "incoming" in relations, "Missing 'incoming' relations"
        assert "outgoing" in relations, "Missing 'outgoing' relations"
        
        # Check outgoing PART_OF to ENT-ENTITES-METIER-CVLN
        outgoing_part_of = [r for r in relations["outgoing"] if r["type"] == "PART_OF"]
        assert len(outgoing_part_of) == 1, f"Expected 1 outgoing PART_OF, got {len(outgoing_part_of)}"
        assert outgoing_part_of[0]["to"] == "ENT-ENTITES-METIER-CVLN", f"Expected PART_OF to ENT-ENTITES-METIER-CVLN"
        
        # Check incoming PART_OF from ENT-LABELOS and ENT-FACTORY-MAKER-STUDIO
        incoming_part_of = [r for r in relations["incoming"] if r["type"] == "PART_OF"]
        assert len(incoming_part_of) == 2, f"Expected 2 incoming PART_OF, got {len(incoming_part_of)}"
        incoming_froms = {r["from"] for r in incoming_part_of}
        assert "ENT-LABELOS" in incoming_froms, "Expected incoming PART_OF from ENT-LABELOS"
        assert "ENT-FACTORY-MAKER-STUDIO" in incoming_froms, "Expected incoming PART_OF from ENT-FACTORY-MAKER-STUDIO"
        
        log(f"✅ PASS: ENT-KORA entity retrieved with correct relations (outgoing to ENT-ENTITES-METIER-CVLN, incoming from ENT-LABELOS and ENT-FACTORY-MAKER-STUDIO)")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_entity_not_found():
    """Test 5: GET /api/entities/ENT-DOES-NOT-EXIST"""
    log("TEST 5: GET /api/entities/ENT-DOES-NOT-EXIST")
    try:
        resp = requests.get(f"{BASE_URL}/entities/ENT-DOES-NOT-EXIST", timeout=10)
        assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
        data = resp.json()
        assert "error" in data, "Missing 'error' field in 404 response"
        
        log(f"✅ PASS: Non-existent entity returns 404 with error message: {data['error']}")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_relations_list():
    """Test 6: GET /api/relations"""
    log("TEST 6: GET /api/relations")
    try:
        resp = requests.get(f"{BASE_URL}/relations", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "count" in data, "Missing 'count' field"
        assert "relations" in data, "Missing 'relations' field"
        assert data["count"] == 35, f"Expected count 35, got {data['count']}"
        assert len(data["relations"]) == 35, f"Expected 35 relations, got {len(data['relations'])}"
        
        # Get all entity IDs for validation
        entities_resp = requests.get(f"{BASE_URL}/entities", timeout=10)
        all_entity_ids = {e["entity_id"] for e in entities_resp.json()["entities"]}
        
        # Verify each relation has required fields and no dangling references
        for relation in data["relations"]:
            assert "relation_id" in relation, f"Relation missing relation_id: {relation}"
            assert relation["relation_id"].startswith("REL-"), f"relation_id doesn't start with REL-: {relation['relation_id']}"
            assert "from" in relation, f"Relation {relation['relation_id']} missing from"
            assert "to" in relation, f"Relation {relation['relation_id']} missing to"
            assert "type" in relation, f"Relation {relation['relation_id']} missing type"
            assert "provenance" in relation, f"Relation {relation['relation_id']} missing provenance"
            assert "confidence" in relation, f"Relation {relation['relation_id']} missing confidence"
            assert "verified_reality" in relation, f"Relation {relation['relation_id']} missing verified_reality"
            
            # Check no dangling references
            if relation["from"] not in all_entity_ids:
                log(f"❌ FAIL: Relation {relation['relation_id']} has dangling 'from' reference: {relation['from']}")
                return False
            if relation["to"] not in all_entity_ids:
                log(f"❌ FAIL: Relation {relation['relation_id']} has dangling 'to' reference: {relation['to']}")
                return False
        
        log(f"✅ PASS: Got 35 relations, all with correct structure and no dangling references")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_relations_filter_by_type():
    """Test 7: GET /api/relations?type=PART_OF"""
    log("TEST 7: GET /api/relations?type=PART_OF")
    try:
        resp = requests.get(f"{BASE_URL}/relations?type=PART_OF", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "count" in data, "Missing 'count' field"
        assert data["count"] == 28, f"Expected 28 PART_OF relations, got {data['count']}"
        
        # Verify all returned relations are PART_OF type
        for relation in data["relations"]:
            assert relation["type"] == "PART_OF", f"Relation {relation['relation_id']} has type {relation['type']}, expected PART_OF"
        
        log(f"✅ PASS: Filter by type=PART_OF returned 28 relations")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_relations_filter_by_from():
    """Test 8: GET /api/relations?from=ENT-CVLN-FOUNDATION"""
    log("TEST 8: GET /api/relations?from=ENT-CVLN-FOUNDATION")
    try:
        resp = requests.get(f"{BASE_URL}/relations?from=ENT-CVLN-FOUNDATION", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "relations" in data, "Missing 'relations' field"
        
        # Should include at least a GOVERNS relation to ENT-CVLN-GROUP
        governs_relations = [r for r in data["relations"] if r["type"] == "GOVERNS" and r["to"] == "ENT-CVLN-GROUP"]
        assert len(governs_relations) >= 1, "Expected at least one GOVERNS relation to ENT-CVLN-GROUP"
        
        governs = governs_relations[0]
        assert governs["provenance"] == "inferred_from_declared_role", f"Expected provenance 'inferred_from_declared_role', got {governs['provenance']}"
        assert governs["confidence"] == "INFERRED", f"Expected confidence 'INFERRED', got {governs['confidence']}"
        
        log(f"✅ PASS: Relations from ENT-CVLN-FOUNDATION include GOVERNS to ENT-CVLN-GROUP (inferred)")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_registry_export():
    """Test 9: GET /api/registry/export"""
    log("TEST 9: GET /api/registry/export")
    try:
        resp = requests.get(f"{BASE_URL}/registry/export", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        # Check top-level structure
        assert "registry" in data, "Missing 'registry' field"
        assert "schema_version" in data, "Missing 'schema_version' field"
        assert "baseline" in data, "Missing 'baseline' field"
        assert "doctrine" in data, "Missing 'doctrine' field"
        assert "counts" in data, "Missing 'counts' field"
        assert "validation" in data, "Missing 'validation' field"
        assert "entities" in data, "Missing 'entities' field"
        assert "relations" in data, "Missing 'relations' field"
        
        # Check baseline
        baseline = data["baseline"]
        assert baseline["version"] == "v1", f"Expected baseline version 'v1', got {baseline['version']}"
        assert baseline["frozen"] == True, f"Expected baseline frozen=true, got {baseline['frozen']}"
        assert "changelog" in baseline, "Missing 'changelog' in baseline"
        assert isinstance(baseline["changelog"], list), "changelog should be an array"
        
        # Check doctrine.JCC
        assert "JCC" in data["doctrine"], "Missing 'JCC' in doctrine"
        jcc = data["doctrine"]["JCC"]
        assert jcc["declared_classification"] == "INTERNAL_CURRENCY", f"Expected JCC declared_classification 'INTERNAL_CURRENCY', got {jcc['declared_classification']}"
        assert jcc["verified_reality"] == "UNVERIFIED", f"Expected JCC verified_reality 'UNVERIFIED', got {jcc['verified_reality']}"
        assert "do_not_requalify_as" in jcc, "Missing 'do_not_requalify_as' in JCC"
        assert isinstance(jcc["do_not_requalify_as"], list), "do_not_requalify_as should be an array"
        assert "legal_tender" in jcc["do_not_requalify_as"], "Expected 'legal_tender' in do_not_requalify_as"
        assert "crypto_asset" in jcc["do_not_requalify_as"], "Expected 'crypto_asset' in do_not_requalify_as"
        
        # Check counts
        counts = data["counts"]
        assert counts["entities"] == 29, f"Expected 29 entities, got {counts['entities']}"
        assert counts["relations"] == 35, f"Expected 35 relations, got {counts['relations']}"
        
        # Check validation
        validation = data["validation"]
        assert validation["ok"] == True, f"Expected validation ok=true, got {validation['ok']}"
        
        # Check entities and relations arrays
        assert len(data["entities"]) == 29, f"Expected 29 entities in export, got {len(data['entities'])}"
        assert len(data["relations"]) == 35, f"Expected 35 relations in export, got {len(data['relations'])}"
        
        log(f"✅ PASS: Registry export contains all required fields with correct values")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_registry_baseline():
    """Test 10: GET /api/registry/baseline"""
    log("TEST 10: GET /api/registry/baseline")
    try:
        resp = requests.get(f"{BASE_URL}/registry/baseline", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "baseline" in data, "Missing 'baseline' field"
        assert "doctrine" in data, "Missing 'doctrine' field"
        
        baseline = data["baseline"]
        assert baseline["version"] == "v1", f"Expected baseline version 'v1', got {baseline['version']}"
        assert baseline["frozen"] == True, f"Expected baseline frozen=true, got {baseline['frozen']}"
        
        assert "JCC" in data["doctrine"], "Missing 'JCC' in doctrine"
        
        log(f"✅ PASS: Baseline endpoint returns baseline v1 (frozen) and doctrine")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_registry_tree():
    """Test 11: GET /api/registry/tree"""
    log("TEST 11: GET /api/registry/tree")
    try:
        resp = requests.get(f"{BASE_URL}/registry/tree", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "tree" in data, "Missing 'tree' field"
        tree = data["tree"]
        
        # Check root
        assert "name" in tree, "Tree root missing 'name' field"
        assert tree["name"] == "CVLN Foundation", f"Expected root name 'CVLN Foundation', got {tree['name']}"
        
        # Count all nodes in tree
        def count_nodes(node):
            count = 1
            if "children" in node:
                for child in node["children"]:
                    count += count_nodes(child)
            return count
        
        total_nodes = count_nodes(tree)
        assert total_nodes == 29, f"Expected 29 nodes in tree, got {total_nodes}"
        
        log(f"✅ PASS: Tree has single root 'CVLN Foundation' with 29 total nodes")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_contact_post_valid():
    """Test 12: POST /api/contact with valid data"""
    log("TEST 12: POST /api/contact with valid data")
    try:
        payload = {
            "email": "registry-test@example.com",
            "name": "Test User",
            "message": "hi"
        }
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert "success" in data, "Missing 'success' field"
        assert data["success"] == True, f"Expected success=true, got {data['success']}"
        assert "contact" in data, "Missing 'contact' field"
        
        contact = data["contact"]
        assert "id" in contact, "Contact missing 'id' field"
        assert "_id" not in contact, "Contact should not have '_id' field"
        assert contact["email"] == payload["email"], f"Email mismatch"
        assert contact["name"] == payload["name"], f"Name mismatch"
        assert contact["message"] == payload["message"], f"Message mismatch"
        assert "created_at" in contact, "Contact missing 'created_at' field"
        
        # Verify id is UUID format (contains hyphens)
        assert "-" in contact["id"], f"Expected UUID format for id, got {contact['id']}"
        
        log(f"✅ PASS: Contact created successfully with UUID id, no _id field")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_contact_post_invalid_email():
    """Test 13: POST /api/contact with invalid email"""
    log("TEST 13: POST /api/contact with invalid email")
    try:
        payload = {"email": "bad"}
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
        data = resp.json()
        
        assert "error" in data, "Missing 'error' field"
        # Check for French error message
        assert "e-mail" in data["error"].lower() or "email" in data["error"].lower(), f"Expected email error message, got: {data['error']}"
        
        log(f"✅ PASS: Invalid email returns 400 with French error: {data['error']}")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_contact_post_missing_email():
    """Test 14: POST /api/contact with missing email"""
    log("TEST 14: POST /api/contact with missing email")
    try:
        payload = {}
        resp = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
        data = resp.json()
        
        assert "error" in data, "Missing 'error' field"
        
        log(f"✅ PASS: Missing email returns 400 with error: {data['error']}")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def test_contact_get():
    """Test 15: GET /api/contact"""
    log("TEST 15: GET /api/contact")
    try:
        resp = requests.get(f"{BASE_URL}/contact", timeout=10)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
        data = resp.json()
        
        assert isinstance(data, list), f"Expected array response, got {type(data)}"
        
        # If there are contacts, verify structure
        if len(data) > 0:
            for contact in data:
                assert "id" in contact, f"Contact missing 'id' field: {contact}"
                assert "_id" not in contact, f"Contact should not have '_id' field: {contact}"
                assert "-" in contact["id"], f"Expected UUID format for id, got {contact['id']}"
        
        log(f"✅ PASS: GET /api/contact returns array with {len(data)} contacts, all with UUID id and no _id")
        return True
    except Exception as e:
        log(f"❌ FAIL: {e}")
        return False

def main():
    log("=" * 80)
    log("CVLN GROUP ENTITY REGISTRY API + CONTACT ENDPOINTS TEST SUITE")
    log("=" * 80)
    log(f"Base URL: {BASE_URL}")
    log("")
    
    results = []
    
    # Registry tests
    log("REGISTRY TESTS (READ-ONLY)")
    log("-" * 80)
    results.append(("Registry Validate", test_registry_validate()))
    results.append(("Entities List", test_entities_list()))
    results.append(("Entities Filter by Type", test_entities_filter_by_type()))
    results.append(("Entity by ID (ENT-KORA)", test_entity_by_id()))
    results.append(("Entity Not Found", test_entity_not_found()))
    results.append(("Relations List", test_relations_list()))
    results.append(("Relations Filter by Type", test_relations_filter_by_type()))
    results.append(("Relations Filter by From", test_relations_filter_by_from()))
    results.append(("Registry Export", test_registry_export()))
    results.append(("Registry Baseline", test_registry_baseline()))
    results.append(("Registry Tree", test_registry_tree()))
    
    log("")
    log("CONTACT ENDPOINTS RE-TEST")
    log("-" * 80)
    results.append(("Contact POST Valid", test_contact_post_valid()))
    results.append(("Contact POST Invalid Email", test_contact_post_invalid_email()))
    results.append(("Contact POST Missing Email", test_contact_post_missing_email()))
    results.append(("Contact GET", test_contact_get()))
    
    # Summary
    log("")
    log("=" * 80)
    log("TEST SUMMARY")
    log("=" * 80)
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        log(f"{status}: {name}")
    
    log("")
    log(f"Total: {passed}/{total} tests passed")
    log("=" * 80)
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())
