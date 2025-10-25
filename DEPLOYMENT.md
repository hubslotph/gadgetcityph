# Deployment Instructions

## Vercel Deployment Setup

### 1. Environment Variables
Set these environment variables in your Vercel dashboard:

**Backend Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure JWT secret key
- `FRONTEND_URL`: Your Vercel domain (e.g., https://your-app.vercel.app)
- `UNSPLASH_ACCESS_KEY`: Your Unsplash API key
- `PEXELS_API_KEY`: Your Pexels API key
- `PIXABAY_API_KEY`: Your Pixabay API key
- `NODE_ENV`: production

**Frontend Variables:**
- `REACT_APP_API_URL`: /api (relative path for production)

### 2. Vercel Configuration
The project is configured with:
- Frontend build output: `gadget-city-frontend/build`
- API routes: `/api/*` → `api/index.js` (serverless function)
- Serverless function timeout: 30 seconds
- Backend dependencies included in root package.json

### 3. Build Process
Vercel will automatically:
1. Install frontend dependencies
2. Build the React app
3. Deploy static files and serverless functions

### 4. Local Development Setup
1. Copy `.env.example` to `.env` in both frontend and backend directories
2. Fill in your actual environment values
3. Run `npm run install-all` to install all dependencies
4. Run `npm run dev` to start both frontend and backend

### 5. Security Notes
- Never commit actual environment values to git
- Use Vercel's environment variable dashboard for production secrets
- The `.env` files in this repo are templates only

## Troubleshooting

### Common Issues:
1. **CORS errors**: Ensure `FRONTEND_URL` is set correctly in Vercel
2. **API not found**: Check that API routes start with `/api/`
3. **Build failures**: Ensure all dependencies are listed in package.json
4. **Database connection**: Verify MongoDB URI and network access

### Build Commands:
- Development: `npm run dev`
- Production build: `npm run build`
- Install all deps: `npm run install-all`