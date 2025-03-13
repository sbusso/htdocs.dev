---
title: Simple HTTP Basic Authentication for Cloudflare Pages
author:
  - Stephane Busso
description: Adding authentication to your pages deployment requires a programmatic approach.
published: true
tags:
  - cloudflare
  - react
  - auth
updated: 2025-03-14T01:36
created: 2025-03-14T01:35
cover: 
---

When deploying web applications to Cloudflare Pages, you might occasionally need to add a layer of protection to prevent unauthorized access. Whether you're deploying a staging environment, an internal tool, or simply want to limit who can access your React application, HTTP Basic Authentication provides a straightforward solution.

In this post, I'll walk through how to implement a clean, serverless authentication layer for any Cloudflare Pages site using Pages Functions.

## The Problem

Cloudflare Pages makes it incredibly easy to deploy modern web applications. However, unlike some other platforms, there's no built-in toggle or simple configuration for password protection. Adding authentication to your pages deployment requires a programmatic approach.

## The Solution: Pages Functions Middleware

Cloudflare Pages Functions allow you to run code at the edge before your application is served. By implementing a simple middleware function, we can add authentication logic directly to our Pages deployment without:

- Needing a separate Worker
- Requiring a custom domain
- Modifying your application code

## Step-by-Step Implementation

### 1. Create a Functions Directory

First, create a `functions` directory at the root of your project. This is where Cloudflare will look for edge functions to execute.

```
my-react-app/
├── src/
├── public/
├── functions/       <-- Create this folder
└── package.json
```

### 2. Create the Authentication Middleware

Inside the `functions` directory, create a file called `_middleware.js`:

```javascript
export async function onRequest(context) {
  // Get the authorization header from the request
  const auth = context.request.headers.get('Authorization');
  
  // If no authorization header is present, prompt for credentials
  if (!auth) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }
  
  // Split the auth header to get the encoded credentials
  const [scheme, encoded] = auth.split(' ');
  
  // Validate it's using Basic auth
  if (!encoded || scheme !== 'Basic') {
    return new Response('Invalid authentication', { 
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }
  
  // Decode the Base64 credentials
  const decoded = atob(encoded);
  const [username, password] = decoded.split(':');
  
  // Your credentials here
  const VALID_USERNAME = 'your_username';
  const VALID_PASSWORD = 'your_password';
  
  // Check if the credentials match
  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return new Response('Invalid credentials', { 
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    });
  }
  
  // If authentication passes, continue to the requested page
  return context.next();
}
```

Make sure to replace `'your_username'` and `'your_password'` with your desired credentials.

### 3. Deploy Your Application

Deploy your application to Cloudflare Pages as usual. Cloudflare will automatically detect and apply your middleware function.

```bash
# If you're using npm
npm run build

# If you're using Bun
bun run build

# Then deploy however you normally do (usually via GitHub integration)
```

## How It Works

1. When a user visits your site, the `_middleware.js` function runs before serving any content
2. If no valid authorization is provided, the browser shows a login prompt
3. The user enters credentials, which are Base64 encoded and sent with subsequent requests
4. Your middleware validates these credentials before allowing access to your site

## Customizing for React Router

If you're building a React Router application on Cloudflare Pages, you'll also want to make sure client-side routing works correctly. Add a `_redirects` file to your `public` directory:

```
/*    /index.html   200
```

This ensures that all routes are properly handled by your React Router configuration.

## Security Considerations

While HTTP Basic Authentication provides a simple barrier to entry, please note:

1. Credentials are encoded (not encrypted) and sent with every request
2. For more sensitive applications, consider using Cloudflare Access instead
3. Always use HTTPS (which Cloudflare Pages provides by default)

## Troubleshooting

If you're experiencing issues with your authentication:

- Verify your `functions` directory is at the project root (not inside `src` or `public`)
- Make sure your `_middleware.js` file is properly formatted
- Check that your build is completing successfully
- Look for errors in the Cloudflare Pages deployment logs

## Conclusion

Using Cloudflare Pages Functions, you can easily add HTTP Basic Authentication to any site without complex configuration or separate services. This approach is elegant, serverless, and requires minimal setup.

For React applications, Single Page Applications, or any static site, this method provides a clean way to add a simple password gate while leveraging Cloudflare's edge network.

Happy coding!