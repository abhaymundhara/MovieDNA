#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎬 Movie DNA - Development Starter${NC}"
echo "===================================="
echo ""

# Check if .env exists and has keys configured
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please run: cp .env.example .env"
    echo "Then add your API keys to .env"
    exit 1
fi

if grep -q "your_tmdb_api_key_here" .env || grep -q "your_groq_api_key_here" .env; then
    echo -e "${YELLOW}⚠️  WARNING: API keys not configured in .env${NC}"
    echo ""
    echo "Please edit .env and add:"
    echo "  - TMDB API Key (https://www.themoviedb.org/settings/api)"
    echo "  - Groq API Key (https://console.groq.com/)"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}📦 Dependencies not installed. Running setup...${NC}"
    ./setup.sh
    echo ""
fi

echo -e "${GREEN}🚀 Starting Movie DNA...${NC}"
echo ""
echo "Backend will run on: http://localhost:3001"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Start the application
npm run dev
