# Development Guide

## Project Architecture

### Backend Structure

```
server/
├── index.js              # Express server setup
└── services/
    ├── tmdb.js          # TMDB API client
    ├── groq.js          # Groq AI integration
    └── movieDNA.js      # Core recommendation logic
```

### Frontend Structure

```
client/src/
├── App.jsx              # Main application component
├── components/
│   ├── SearchBar.jsx    # Movie search input
│   ├── MovieCard.jsx    # Display original movie
│   ├── RecommendationCard.jsx  # Display recommendations
│   └── LoadingSpinner.jsx      # Loading state
└── *.css               # Component-specific styles
```

## API Flow

1. **User Input** → User enters movie title in SearchBar
2. **Frontend Request** → POST to `/api/movie-dna` with movie title
3. **Movie Search** → TMDB API searches for movie
4. **Get Credits** → TMDB API fetches movie details + credits
5. **Extract Team** → Extract director, lead actor, screenwriter
6. **AI Analysis** → Groq analyzes the creative team
7. **Find Recommendations** → TMDB discovers movies by each person
8. **AI Insights** → Groq generates recommendation insights
9. **Response** → Return structured data to frontend
10. **Display** → React components render results

## Key Files Explained

### server/index.js

Main Express server. Handles:

- CORS configuration
- Route definitions
- Error handling
- Environment validation

### server/services/tmdb.js

TMDB API integration. Functions:

- `searchMovie()` - Find movie by title
- `getMovieDetails()` - Get full movie data + credits
- `extractDirector()` - Find director from crew
- `extractLeadActor()` - Get first cast member
- `extractScreenwriter()` - Find screenplay writer
- `discoverMoviesByPerson()` - Find other movies by person
- `formatMovieData()` - Format response data

### server/services/groq.js

Groq AI integration. Functions:

- `analyzeMovieWithAI()` - Generate creative team analysis
- `generateRecommendationInsight()` - Create recommendation explanations

### server/services/movieDNA.js

Core logic. Functions:

- `analyzeMovieDNA()` - Main orchestration function
- `getRecommendations()` - Find and format all recommendations

### client/src/App.jsx

Main React component. Manages:

- Application state (loading, error, results)
- API communication
- Component composition
- Layout structure

## Environment Variables

```bash
# Required
TMDB_API_KEY=xxx          # From themoviedb.org
GROQ_API_KEY=xxx          # From console.groq.com

# Optional
PORT=3001                 # Backend port
```

## Development Scripts

```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only (from client/)
cd client && npm run dev

# Build frontend for production
npm run build

# Install all dependencies
npm run install-all

# Test API
node test-api.js
```

## Adding New Features

### 1. Add New AI Analysis

Edit `server/services/groq.js`:

```javascript
export async function analyzeGenre(movieData) {
  const prompt = `Analyze the genre of "${movieData.title}"...`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-70b-versatile",
    temperature: 0.7,
    max_tokens: 200,
  });

  return completion.choices[0]?.message?.content;
}
```

### 2. Add New Recommendation Type

Edit `server/services/movieDNA.js`:

```javascript
// In getRecommendations function
if (composer) {
  const composerMovie = await discoverMoviesByPerson(
    composer.id,
    "composer",
    originalMovieId
  );
  recommendations.byComposer = formatMovieData(composerMovie);
}
```

### 3. Add New UI Component

```bash
cd client/src/components
touch NewComponent.jsx NewComponent.css
```

```javascript
// NewComponent.jsx
import PropTypes from "prop-types";
import "./NewComponent.css";

function NewComponent({ data }) {
  return <div>{data}</div>;
}

NewComponent.propTypes = {
  data: PropTypes.string.isRequired,
};

export default NewComponent;
```

## Debugging Tips

### Backend Debugging

```javascript
// Add console.logs in server files
console.log("🔍 Searching for:", movieTitle);
console.log("📊 Movie data:", movieDetails);
```

### Frontend Debugging

```javascript
// In React components
console.log("State:", { loading, error, result });

// Or use React DevTools browser extension
```

### API Debugging

Use the test script:

```bash
node test-api.js
```

Or use curl:

```bash
curl -X POST http://localhost:3001/api/movie-dna \
  -H "Content-Type: application/json" \
  -d '{"movieTitle":"Inception"}'
```

## Common Issues

### API Rate Limits

- TMDB: 40 requests per 10 seconds
- Groq: Check your plan limits
- Solution: Add caching or request throttling

### Missing Credits

Some movies may not have complete crew data

- Solution: Add fallback logic or handle gracefully

### CORS Errors

Frontend can't connect to backend

- Check backend CORS configuration
- Verify ports match (3001 and 5173)

### Groq Timeouts

AI requests taking too long

- Reduce max_tokens
- Use faster model (llama-3.1-8b-instant)
- Add timeout handling

## Performance Optimization

1. **Cache TMDB Results**

   - Store frequently requested movies
   - Use Redis or in-memory cache

2. **Batch AI Requests**

   - Generate all insights in parallel
   - Use Promise.all()

3. **Optimize Images**

   - Use smaller poster sizes
   - Lazy load images

4. **Add Request Throttling**
   - Debounce search input
   - Rate limit API calls

## Testing

### Manual Testing Checklist

- [ ] Search for a popular movie
- [ ] Verify all three recommendations appear
- [ ] Check AI analysis displays correctly
- [ ] Test with invalid movie title
- [ ] Test with no network connection
- [ ] Verify error messages are helpful
- [ ] Check responsive design on mobile
- [ ] Test loading states

### Automated Testing

Consider adding:

- Jest for backend unit tests
- React Testing Library for frontend
- Playwright for E2E testing

## Deployment

### Backend Deployment (Heroku, Railway, Render)

1. Set environment variables in platform dashboard
2. Ensure PORT is configurable
3. Update CORS origins for production domain

### Frontend Deployment (Vercel, Netlify)

1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder
3. Update API URL to production backend
4. Configure environment variables

### Full Stack (Single Server)

```bash
# Build frontend
cd client && npm run build

# Serve from Express
app.use(express.static('client/dist'));
```

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## Resources

- [TMDB API Docs](https://developers.themoviedb.org/3)
- [Groq API Docs](https://console.groq.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
