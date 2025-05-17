# Authentication Middleware

This directory contains middleware for authenticating requests using Supabase.

## Supabase Authentication

The `auth.middleware.js` file provides authentication for the backend API using Supabase's authentication service.

### Setup

1. Add the required environment variables to your `.env` file:

   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. The middleware uses the Supabase anon key (public key) to validate tokens and get user information.

### How it works

1. The middleware extracts the JWT token from the Authorization header.
2. It validates the token with Supabase's authentication service.
3. If valid, it fetches the corresponding user from the database.
4. It attaches the user object to the request for use in route handlers.

### Usage

```javascript
import { authenticate } from '../middleware/auth.middleware.js';

// Apply to a specific route
router.get('/protected-route', authenticate, (req, res) => {
  // Access authenticated user
  const user = req.user;
  // ...
});

// Apply to all routes in a router
router.use(authenticate);
router.get('/route1', ...);
router.post('/route2', ...);
```
