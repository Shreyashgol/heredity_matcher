#!/bin/bash

# Test script for Heredity API
BASE_URL="http://localhost:3000/api"

echo "🧪 Testing Heredity API..."
echo ""

# Test 1: Add Grandpa
echo "1️⃣ Adding Grandpa (Mike)..."
GRANDPA=$(curl -s -X POST "$BASE_URL/person" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mike (Grandpa)", "birth_date": "1950-01-15", "gender": "Male"}')
GRANDPA_ID=$(echo $GRANDPA | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "✅ Grandpa ID: $GRANDPA_ID"
echo ""

# Test 2: Add Father
echo "2️⃣ Adding Father (John)..."
FATHER=$(curl -s -X POST "$BASE_URL/person" \
  -H "Content-Type: application/json" \
  -d '{"name": "John (Father)", "birth_date": "1975-05-20", "gender": "Male"}')
FATHER_ID=$(echo $FATHER | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "✅ Father ID: $FATHER_ID"
echo ""

# Test 3: Add Son
echo "3️⃣ Adding Son (Alex)..."
SON=$(curl -s -X POST "$BASE_URL/person" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alex (Son)", "birth_date": "2000-08-10", "gender": "Male"}')
SON_ID=$(echo $SON | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "✅ Son ID: $SON_ID"
echo ""

# Test 4: Link Grandpa -> Father
echo "4️⃣ Linking Grandpa -> Father..."
curl -s -X POST "$BASE_URL/relationship" \
  -H "Content-Type: application/json" \
  -d "{\"parent_id\": $GRANDPA_ID, \"child_id\": $FATHER_ID, \"type\": \"Father\"}" > /dev/null
echo "✅ Relationship created"
echo ""

# Test 5: Link Father -> Son
echo "5️⃣ Linking Father -> Son..."
curl -s -X POST "$BASE_URL/relationship" \
  -H "Content-Type: application/json" \
  -d "{\"parent_id\": $FATHER_ID, \"child_id\": $SON_ID, \"type\": \"Father\"}" > /dev/null
echo "✅ Relationship created"
echo ""

# Test 6: Add Diabetes to Grandpa
echo "6️⃣ Adding Diabetes to Grandpa..."
curl -s -X POST "$BASE_URL/condition" \
  -H "Content-Type: application/json" \
  -d "{\"person_id\": $GRANDPA_ID, \"condition_name\": \"Diabetes\", \"diagnosed_date\": \"2010-03-15\"}" > /dev/null
echo "✅ Condition added"
echo ""

# Test 7: Get Family Tree for Son
echo "7️⃣ Getting Family Tree for Son..."
TREE=$(curl -s "$BASE_URL/tree/$SON_ID")
echo "$TREE" | python3 -m json.tool
echo ""

# Test 8: Calculate Risk for Son
echo "8️⃣ Calculating Diabetes Risk for Son..."
RISK=$(curl -s "$BASE_URL/risk/$SON_ID/Diabetes")
echo "$RISK" | python3 -m json.tool
echo ""

echo "✅ All tests completed!"
