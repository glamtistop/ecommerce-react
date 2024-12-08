# Deployment Guide

## Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign up/login
3. Click "New Project" and import your GitHub repository
4. Select the "ecommerce-react" directory as the root directory
5. Configure environment variables in Vercel:
   - VITE_API_URL (set to your Railway backend URL)
   - VITE_SQUARE_APPLICATION_ID
6. Click "Deploy"

## Backend Deployment (Railway)

1. Go to [Railway](https://railway.app) and sign up/login
2. Create a new project
3. Choose "Deploy from GitHub repo"
4. Select your repository and set the root directory to "ecommerce-react/server"
5. Configure environment variables in Railway:
   - PORT=5000
   - SQUARE_ACCESS_TOKEN
   - SQUARE_LOCATION_ID
   - SQUARE_APPLICATION_ID
   - Add any other environment variables from your local .env

6. Set up CORS in server.js:
   ```javascript
   app.use(cors({
     origin: ['your-vercel-frontend-url.vercel.app'],
     credentials: true
   }));
   ```

## Post-Deployment Steps

1. Update frontend API calls:
   - Ensure all API calls use the environment variable for the backend URL
   - Example: `${import.meta.env.VITE_API_URL}/api/catalog`

2. Test the deployment:
   - Test all API endpoints
   - Verify Square integration
   - Test payment processing
   - Check image loading
   - Verify cart functionality

## Monitoring

- Use Railway's built-in logs for backend monitoring
- Use Vercel's analytics for frontend monitoring
- Monitor Square Dashboard for transaction data

## Common Issues

1. CORS errors:
   - Verify CORS configuration in backend
   - Check frontend URL in CORS whitelist

2. Environment Variables:
   - Ensure all required env vars are set in both platforms
   - Check for typos in variable names

3. Build Issues:
   - Check build logs in Vercel
   - Verify build command and output directory settings

## Useful Commands

```bash
# Local testing before deployment
npm run build  # Build frontend
npm run preview  # Preview production build locally

# Backend testing
npm run start  # Run production server
```

## Security Checklist

- [ ] Environment variables are properly set
- [ ] Sensitive data is not exposed in frontend code
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Error handling doesn't expose sensitive information
