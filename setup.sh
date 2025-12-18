#!/bin/bash

echo "🎬 Movie DNA - Setup Script"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and add your API keys:"
    echo "   - TMDB API Key (https://www.themoviedb.org/settings/api)"
    echo "   - Groq API Key (https://console.groq.com/)"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if API keys are configured
if grep -q "your_tmdb_api_key_here" .env || grep -q "your_groq_api_key_here" .env; then
    echo "⚠️  WARNING: Please configure your API keys in .env file before running the app!"
    echo ""
fi

echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
echo "Installing backend dependencies..."
npm install

# Install client dependencies
echo "Installing frontend dependencies..."
cd client && npm install && cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Make sure you've added your API keys to .env"
echo "  2. Run: npm run dev"
echo ""
echo "The app will be available at:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:3001"
