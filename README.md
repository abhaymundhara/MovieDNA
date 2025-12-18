# Movie DNA

AI-powered movie matcher that links films by creative DNA (director/actor/writer), themes, and genre—plus short AI insights.

## Setup

1. Install deps

```bash
npm install
echo "TMDB_API_KEY=your_tmdb_key
GROQ_API_KEY=your_groq_key
PORT=3001" > .env
cd client && npm install
```

2. Run dev (server + client)

```bash
npm run dev
```

- API: http://localhost:3001
- Client: http://localhost:5173

## Usage

- Enter a movie title; results include creative team, AI analysis, and recommendations by director/actor/writer, similar themes, and genre.

## Repo badge

- Update `REPO_SLUG` in `client/src/App.jsx` to your GitHub repo so the header badge shows live stars.

## Build

```bash
npm run build
```

## Notes

- Requires valid TMDB and Groq API keys in `.env`.
- Vite + React on the client; Express on the server.# 🎬 Movie DNA

Find movies with the same "DNA" as one you love - powered by AI and TMDB.

## How It Works

1. Enter a movie you love
2. AI analyzes the movie's creative team (director, lead actor, screenwriter)
3. Get 3 personalized recommendations:
   - One by the same director
   - One starring the same lead actor
   - One written by the same screenwriter

## Setup

### Prerequisites

- Node.js 18+ installed
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))
- Groq API key ([get one here](https://console.groq.com/))

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm run install-all
   ```

3. Create `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

4. Add your API keys to `.env`:
   ```
   TMDB_API_KEY=your_tmdb_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3001
   ```

### Running the App

Start both backend and frontend:

```bash
npm run dev
```

- Backend runs on: http://localhost:3001
- Frontend runs on: http://localhost:5173

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **AI**: Groq (Llama models)
- **Data**: The Movie Database (TMDB) API

## API Endpoints

- `POST /api/movie-dna` - Analyze a movie and get recommendations
  ```json
  {
    "movieTitle": "Inception"
  }
  ```

## Features

- 🎯 AI-powered movie analysis
- 🎬 Smart recommendations based on creative DNA
- 🖼️ Beautiful movie posters and details
- ⚡ Fast and responsive UI
- 🔍 Intelligent movie search

## License

MIT
