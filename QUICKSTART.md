# 🚀 Quick Start Guide

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed ([download here](https://nodejs.org/))
2. **TMDB API Key** - Free account required
   - Go to https://www.themoviedb.org/signup
   - Navigate to Settings → API
   - Request an API key (choose "Developer")
3. **Groq API Key** - Free account
   - Go to https://console.groq.com/
   - Sign up and create an API key

## Installation

### Step 1: Clone or Download the Project

```bash
cd "MovieDNA"
```

### Step 2: Run Setup Script

```bash
./setup.sh
```

Or manually:

```bash
npm install
cd client && npm install && cd ..
```

### Step 3: Configure API Keys

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your keys:
   ```
   TMDB_API_KEY=your_actual_tmdb_api_key
   GROQ_API_KEY=your_actual_groq_api_key
   PORT=3001
   ```

### Step 4: Start the Application

```bash
npm run dev
```

This will start both:

- **Backend API** at http://localhost:3001
- **Frontend** at http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Enter a movie title (e.g., "Inception", "The Matrix", "Pulp Fiction")
3. Click "Find DNA"
4. View AI-powered analysis and recommendations based on:
   - Same director
   - Same lead actor
   - Same screenwriter

## Troubleshooting

### "Movie not found" error

- Check spelling of the movie title
- Try a more popular/well-known movie first
- Some movies may have limited crew data in TMDB

### API errors

- Verify your API keys are correct in `.env`
- Check that both TMDB and Groq services are accessible
- Ensure you haven't exceeded API rate limits

### Port already in use

- Change the `PORT` in `.env` to a different number
- Or stop other applications using port 3001 or 5173

## Project Structure

```
MovieDNA/
├── server/                 # Backend (Express + Node.js)
│   ├── index.js           # Main server file
│   └── services/
│       ├── tmdb.js        # TMDB API integration
│       ├── groq.js        # Groq AI integration
│       └── movieDNA.js    # Main logic
├── client/                # Frontend (React + Vite)
│   └── src/
│       ├── App.jsx        # Main React component
│       ├── components/    # UI components
│       └── *.css         # Styling
├── .env                   # Your API keys (not in git)
├── .env.example          # Template for .env
├── package.json          # Backend dependencies
└── README.md             # Full documentation
```

## API Endpoints

### POST /api/movie-dna

Analyze a movie and get recommendations

**Request:**

```json
{
  "movieTitle": "Inception"
}
```

**Response:**

```json
{
  "originalMovie": {
    "title": "Inception",
    "director": "Christopher Nolan",
    "leadActor": "Leonardo DiCaprio",
    "screenwriter": "Christopher Nolan",
    "aiAnalysis": "...",
    ...
  },
  "recommendations": {
    "byDirector": { ... },
    "byActor": { ... },
    "byWriter": { ... }
  }
}
```

## Features

- 🎯 AI-powered movie analysis with Groq
- 🎬 Smart recommendations based on creative DNA
- 🖼️ Beautiful movie posters from TMDB
- ⚡ Fast and responsive React UI
- 🔍 Intelligent movie search
- 🤖 Natural language insights for each recommendation

## Technologies

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **AI**: Groq (Llama 3.1 models)
- **Data**: TMDB API
- **Styling**: Custom CSS with dark theme

## Need Help?

- TMDB API Docs: https://developers.themoviedb.org/3
- Groq API Docs: https://console.groq.com/docs
- React Docs: https://react.dev
