#!/bin/bash

# Movie DNA - Environment Validator
# Checks if everything is configured correctly before starting

echo "🔍 Checking Movie DNA Configuration..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check 1: .env file exists
echo -n "Checking .env file... "
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "  → .env file not found. Run: cp .env.example .env"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: TMDB API Key
if [ -f .env ]; then
    echo -n "Checking TMDB API key... "
    if grep -q "your_tmdb_api_key_here" .env; then
        echo -e "${RED}✗${NC}"
        echo "  → TMDB API key not configured"
        echo "  → Get one at: https://www.themoviedb.org/settings/api"
        ERRORS=$((ERRORS + 1))
    elif grep -q "TMDB_API_KEY=" .env; then
        KEY=$(grep "TMDB_API_KEY=" .env | cut -d '=' -f2)
        if [ -z "$KEY" ]; then
            echo -e "${RED}✗${NC}"
            echo "  → TMDB API key is empty"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}✓${NC}"
        fi
    else
        echo -e "${RED}✗${NC}"
        echo "  → TMDB_API_KEY not found in .env"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Check 3: Groq API Key
if [ -f .env ]; then
    echo -n "Checking Groq API key... "
    if grep -q "your_groq_api_key_here" .env; then
        echo -e "${RED}✗${NC}"
        echo "  → Groq API key not configured"
        echo "  → Get one at: https://console.groq.com/"
        ERRORS=$((ERRORS + 1))
    elif grep -q "GROQ_API_KEY=" .env; then
        KEY=$(grep "GROQ_API_KEY=" .env | cut -d '=' -f2)
        if [ -z "$KEY" ]; then
            echo -e "${RED}✗${NC}"
            echo "  → Groq API key is empty"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}✓${NC}"
        fi
    else
        echo -e "${RED}✗${NC}"
        echo "  → GROQ_API_KEY not found in .env"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Check 4: Node modules
echo -n "Checking backend dependencies... "
if [ -d node_modules ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "  → Backend dependencies not installed"
    echo "  → Run: npm install"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 5: Client node modules
echo -n "Checking frontend dependencies... "
if [ -d client/node_modules ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "  → Frontend dependencies not installed"
    echo "  → Run: cd client && npm install"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 6: Port availability
echo -n "Checking if port 3001 is available... "
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC}"
    echo "  → Port 3001 is already in use"
    echo "  → You may need to change PORT in .env or stop the other process"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC}"
fi

echo -n "Checking if port 5173 is available... "
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC}"
    echo "  → Port 5173 is already in use"
    echo "  → The frontend may use a different port"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC}"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! You're ready to go!${NC}"
    echo ""
    echo "Start the app with: ./start.sh or npm run dev"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  ${WARNINGS} warning(s) found${NC}"
    echo ""
    echo "You can still start the app, but you may want to fix the warnings."
    echo "Start with: ./start.sh or npm run dev"
    exit 0
else
    echo -e "${RED}❌ ${ERRORS} error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  ${WARNINGS} warning(s) found${NC}"
    fi
    echo ""
    echo "Please fix the errors above before starting the app."
    echo ""
    echo "Quick fixes:"
    echo "  1. cp .env.example .env"
    echo "  2. Edit .env and add your API keys"
    echo "  3. npm install && cd client && npm install"
    exit 1
fi
