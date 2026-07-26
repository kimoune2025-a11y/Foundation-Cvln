#!/usr/bin/env python3
"""
Backend API Test Suite for COEURVOLAN Contact Endpoints
Tests POST /api/contact and GET /api/contact
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://roots-ecosystem-1.preview.emergentagent.com/api"

def test_post_contact_valid_full():
    """Test POST /api/contact with valid full data (email, name, message)"""
    print("\n" + "="*80)
    print("TEST 1: POST /api/contact with valid full data")
    print("="*80)
    
    try:
        payload = {
            "email": "test@example.com",
            "name": "Jean",
            "message": "Bonjour"
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check status code
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False
        
        # Parse JSON
        data = response.json()
        
        # Check success field
        if not data.get('success'):
            print(f"❌ FAILED: Expected success=true, got {data.get('success')}")
            return False
        
        # Check contact object
        contact = data.get('contact')
        if not contact:
            print("❌ FAILED: No contact object in response")
            return False
        
        # Check required fields
        if 'id' not in contact:
            print("❌ FAILED: Missing 'id' field in contact")
            return False
        
        if '_id' in contact:
            print("❌ FAILED: Response contains '_id' field (should be stripped)")
            return False
        
        # Check UUID format (basic check)
        contact_id = contact['id']
        if not isinstance(contact_id, str) or len(contact_id) < 32:
            print(f"❌ FAILED: 'id' does not appear to be a UUID: {contact_id}")
            return False
        
        # Check email, name, message
        if contact.get('email') != payload['email']:
            print(f"❌ FAILED: Email mismatch. Expected {payload['email']}, got {contact.get('email')}")
            return False
        
        if contact.get('name') != payload['name']:
            print(f"❌ FAILED: Name mismatch. Expected {payload['name']}, got {contact.get('name')}")
            return False
        
        if contact.get('message') != payload['message']:
            print(f"❌ FAILED: Message mismatch. Expected {payload['message']}, got {contact.get('message')}")
            return False
        
        # Check created_at exists
        if 'created_at' not in contact:
            print("❌ FAILED: Missing 'created_at' field")
            return False
        
        print("✅ PASSED: POST /api/contact with valid full data works correctly")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_post_contact_email_only():
    """Test POST /api/contact with email only (name and message optional)"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/contact with email only")
    print("="*80)
    
    try:
        payload = {
            "email": "a@b.co"
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check status code
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False
        
        # Parse JSON
        data = response.json()
        
        # Check success field
        if not data.get('success'):
            print(f"❌ FAILED: Expected success=true, got {data.get('success')}")
            return False
        
        # Check contact object
        contact = data.get('contact')
        if not contact:
            print("❌ FAILED: No contact object in response")
            return False
        
        # Check id exists and is UUID
        if 'id' not in contact:
            print("❌ FAILED: Missing 'id' field in contact")
            return False
        
        if '_id' in contact:
            print("❌ FAILED: Response contains '_id' field (should be stripped)")
            return False
        
        # Check email
        if contact.get('email') != payload['email']:
            print(f"❌ FAILED: Email mismatch. Expected {payload['email']}, got {contact.get('email')}")
            return False
        
        print("✅ PASSED: POST /api/contact with email only works correctly")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_post_contact_invalid_email():
    """Test POST /api/contact with invalid email format"""
    print("\n" + "="*80)
    print("TEST 3: POST /api/contact with invalid email")
    print("="*80)
    
    try:
        payload = {
            "email": "not-an-email"
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check status code
        if response.status_code != 400:
            print(f"❌ FAILED: Expected status 400, got {response.status_code}")
            return False
        
        # Parse JSON
        data = response.json()
        
        # Check error field exists
        if 'error' not in data:
            print("❌ FAILED: No error field in response")
            return False
        
        error_msg = data['error']
        print(f"Error message: {error_msg}")
        
        # Check if error message is in French (basic check - contains French characters or keywords)
        # The expected message is "Une adresse e-mail valide est requise."
        if not error_msg or len(error_msg) == 0:
            print("❌ FAILED: Error message is empty")
            return False
        
        print("✅ PASSED: POST /api/contact with invalid email returns 400 with error message")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_post_contact_missing_email():
    """Test POST /api/contact with missing email"""
    print("\n" + "="*80)
    print("TEST 4: POST /api/contact with missing email")
    print("="*80)
    
    try:
        payload = {}
        
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check status code
        if response.status_code != 400:
            print(f"❌ FAILED: Expected status 400, got {response.status_code}")
            return False
        
        # Parse JSON
        data = response.json()
        
        # Check error field exists
        if 'error' not in data:
            print("❌ FAILED: No error field in response")
            return False
        
        print("✅ PASSED: POST /api/contact with missing email returns 400")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def test_get_contact():
    """Test GET /api/contact returns array with inserted records"""
    print("\n" + "="*80)
    print("TEST 5: GET /api/contact")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        # Check status code
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False
        
        # Parse JSON
        data = response.json()
        
        # Check if response is an array
        if not isinstance(data, list):
            print(f"❌ FAILED: Expected array response, got {type(data)}")
            return False
        
        print(f"Number of contacts: {len(data)}")
        
        # Check that we have at least the contacts we inserted
        if len(data) < 2:
            print(f"❌ FAILED: Expected at least 2 contacts (from previous tests), got {len(data)}")
            return False
        
        # Check each contact object
        for i, contact in enumerate(data[:5]):  # Check first 5
            print(f"\nContact {i+1}: {json.dumps(contact, indent=2, default=str)}")
            
            # Check no _id field
            if '_id' in contact:
                print(f"❌ FAILED: Contact {i+1} contains '_id' field (should be stripped)")
                return False
            
            # Check id field exists
            if 'id' not in contact:
                print(f"❌ FAILED: Contact {i+1} missing 'id' field")
                return False
            
            # Check id is UUID format
            contact_id = contact['id']
            if not isinstance(contact_id, str) or len(contact_id) < 32:
                print(f"❌ FAILED: Contact {i+1} 'id' does not appear to be a UUID: {contact_id}")
                return False
            
            # Check email exists
            if 'email' not in contact:
                print(f"❌ FAILED: Contact {i+1} missing 'email' field")
                return False
        
        # Verify our test contacts are present
        emails = [c.get('email') for c in data]
        if 'test@example.com' not in emails:
            print("❌ FAILED: test@example.com not found in contacts list")
            return False
        
        if 'a@b.co' not in emails:
            print("❌ FAILED: a@b.co not found in contacts list")
            return False
        
        print("✅ PASSED: GET /api/contact returns correct array with UUID ids and no _id fields")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("COEURVOLAN CONTACT API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Testing at: {datetime.now().isoformat()}")
    
    results = []
    
    # Run tests in order
    results.append(("POST /api/contact (valid full data)", test_post_contact_valid_full()))
    results.append(("POST /api/contact (email only)", test_post_contact_email_only()))
    results.append(("POST /api/contact (invalid email)", test_post_contact_invalid_email()))
    results.append(("POST /api/contact (missing email)", test_post_contact_missing_email()))
    results.append(("GET /api/contact", test_get_contact()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
