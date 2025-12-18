# Troubleshooting Vercel Deployment

## Error: "Movie not found" even for popular movies

This error means the TMDB API is not returning results. Here's how to fix it:

### Step 1: Verify Your TMDB API Key

1. Go to https://www.themoviedb.org/settings/api
2. Copy your **API Key (v3 auth)**
3. Test it locally:
   ```bash
   curl "https://api.themoviedb.org/3/search/movie?api_key=YOUR_KEY_HERE&query=The%20Matrix"
   ```
4. You should see JSON with movie results

### Step 2: Check Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify these are set:
   - `TMDB_API_KEY` - Should be your v3 API key (NOT the v4 access token)
   - `GROQ_API_KEY` - Your Groq API key
4. **Important**: Click the checkbox for all environments (Production, Preview, Development)

### Step 3: Check Vercel Function Logs

1. Go to your Vercel project dashboard
2. Click on **Deployments**
3. Click on your latest deployment
4. Go to **Functions** tab
5. Click on the `/api/movie-dna` function
6. Check the logs for:
   ```
   API Keys status: { hasTMDB: true, hasGroq: true, ... }
   ```
   - If `hasTMDB: false` → API key not set in Vercel
   - If you see "TMDB API error: 401" → Invalid API key
   - If you see "TMDB API error: 404" → Wrong endpoint

### Step 4: Common Issues

#### Issue: API keys show as "false" in logs
**Solution**: 
- Make sure you added them to Vercel environment variables
- Redeploy after adding variables (they don't apply to existing deployments)

#### Issue: "TMDB API error: 401 Unauthorized"
**Solution**:
- You're using the wrong API key
- Use the **API Key (v3 auth)** from TMDB, NOT the "API Read Access Token (v4 auth)"
- The key should be 32 characters long

#### Issue: "TMDB API error: 429 Too Many Requests"
**Solution**:
- You've hit TMDB's rate limit
- Wait a few seconds and try again
- Consider upgrading your TMDB account if you need more requests

#### Issue: Works locally but not on Vercel
**Solution**:
- Environment variables not set in Vercel
- Check you're not using a `.env` file locally that has different keys
- Verify the keys in Vercel match your local ones

### Step 5: Test Your Deployment

After fixing the issues, test with curl:

```bash
curl -X POST https://your-app.vercel.app/api/movie-dna \
  -H "Content-Type: application/json" \
  -d '{"movieTitle":"Inception"}' \
  -v
```

Look for:
- ✅ Status 200 with movie data
- ❌ Status 500 with error message

### Step 6: Force Redeploy

Sometimes Vercel needs a fresh deployment:

1. Go to your deployment
2. Click the **⋯** menu
3. Select **Redeploy**
4. Or push a new commit to trigger automatic deployment

### Still Not Working?

Check the enhanced error messages:
- They now show TMDB API status codes
- They show which API keys are present
- They log the first 200 characters of TMDB responses

Share these logs for further debugging.
