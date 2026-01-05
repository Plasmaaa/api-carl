#!/bin/bash

echo "🧪 Test de l'API Video Game Collection"
echo "======================================"
echo ""

BASE_URL="http://localhost:3000"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}1. Health Check${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ Health check OK (200)${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ Health check failed ($http_code)${NC}"
fi
echo ""

# Test 2: GET all games (vide au début)
echo -e "${BLUE}2. GET /api/v1/games (liste vide)${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/games")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ GET games OK (200)${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ GET games failed ($http_code)${NC}"
fi
echo ""

# Test 3: POST create game
echo -e "${BLUE}3. POST /api/v1/games (créer un jeu)${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/v1/games" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: fr" \
  -d '{
    "title": "The Legend of Zelda: Breath of the Wild",
    "genre": "Action-Adventure",
    "releaseDate": "2017-03-03",
    "platform": "Nintendo Switch"
  }')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "201" ]; then
    echo -e "${GREEN}✓ POST game OK (201)${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    GAME_ID=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null || echo "1")
else
    echo -e "${RED}✗ POST game failed ($http_code)${NC}"
    echo "$body"
    GAME_ID="1"
fi
echo ""

# Test 4: GET single game
echo -e "${BLUE}4. GET /api/v1/games/$GAME_ID${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/games/$GAME_ID")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ GET single game OK (200)${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ GET single game failed ($http_code)${NC}"
fi
echo ""

# Test 5: PATCH update game
echo -e "${BLUE}5. PATCH /api/v1/games/$GAME_ID${NC}"
response=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/api/v1/games/$GAME_ID" \
  -H "Content-Type: application/json" \
  -d '{"genre": "Adventure RPG"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ PATCH game OK (200)${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ PATCH game failed ($http_code)${NC}"
fi
echo ""

# Test 6: GET avec format XML
echo -e "${BLUE}6. GET /api/v1/games (format XML)${NC}"
response=$(curl -s -w "\n%{http_code}" -H "Accept: application/xml" "$BASE_URL/api/v1/games")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ GET games XML OK (200)${NC}"
    echo "$body" | head -10
else
    echo -e "${RED}✗ GET games XML failed ($http_code)${NC}"
fi
echo ""

# Test 7: GET avec format YAML
echo -e "${BLUE}7. GET /api/v1/games (format YAML)${NC}"
response=$(curl -s -w "\n%{http_code}" -H "Accept: application/yaml" "$BASE_URL/api/v1/games")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ GET games YAML OK (200)${NC}"
    echo "$body" | head -10
else
    echo -e "${RED}✗ GET games YAML failed ($http_code)${NC}"
fi
echo ""

# Test 8: DELETE game
echo -e "${BLUE}8. DELETE /api/v1/games/$GAME_ID${NC}"
http_code=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/api/v1/games/$GAME_ID")

if [ "$http_code" == "204" ]; then
    echo -e "${GREEN}✓ DELETE game OK (204)${NC}"
else
    echo -e "${RED}✗ DELETE game failed ($http_code)${NC}"
fi
echo ""

# Test 9: GET non-existent game (404)
echo -e "${BLUE}9. GET /api/v1/games/999 (devrait retourner 404)${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v1/games/999")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "404" ]; then
    echo -e "${GREEN}✓ GET non-existent game OK (404)${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ Expected 404, got $http_code${NC}"
fi
echo ""

# Test 10: API v2
echo -e "${BLUE}10. GET /api/v2/games${NC}"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v2/games")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ GET v2 games OK (200)${NC}"
    echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ GET v2 games failed ($http_code)${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}✓ Tests terminés !${NC}"
