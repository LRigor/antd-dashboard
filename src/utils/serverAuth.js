import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify token and return decoded payload
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get token from request headers
export const getTokenFromHeaders = (request) => {
  const headersList = headers();
  const authorization = headersList.get('authorization');
  
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.substring(7);
  }
  
  return null;
};

// Get token from cookies
export const getTokenFromCookies = () => {
  const cookieStore = cookies();
  return cookieStore.get('auth-token')?.value;
};

// Get user from request (tries headers first, then cookies)
export const getUserFromRequest = async (request) => {
  // Try to get token from headers first
  let token = getTokenFromHeaders(request);
  
  // If no token in headers, try cookies
  if (!token) {
    token = getTokenFromCookies();
  }
  
  if (!token) {
    return null;
  }
  
  const decoded = verifyToken(token);
  return decoded;
};

// Middleware function to protect API routes
export const withAuth = (handler) => {
  return async (request) => {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Add user to request context
    request.user = user;
    
    return handler(request);
  };
};

// Middleware function to check specific roles
export const withRole = (requiredRoles) => {
  return (handler) => {
    return async (request) => {
      const user = await getUserFromRequest(request);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Check if user has required role
      const hasRole = Array.isArray(requiredRoles) 
        ? requiredRoles.some(role => user.roles?.includes(role))
        : user.roles?.includes(requiredRoles);
      
      if (!hasRole) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      request.user = user;
      return handler(request);
    };
  };
};

// Middleware function to check specific permissions
export const withPermission = (requiredPermissions) => {
  return (handler) => {
    return async (request) => {
      const user = await getUserFromRequest(request);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Check if user has required permission
      const hasPermission = Array.isArray(requiredPermissions)
        ? requiredPermissions.some(permission => user.permissions?.includes(permission))
        : user.permissions?.includes(requiredPermissions);
      
      if (!hasPermission) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      request.user = user;
      return handler(request);
    };
  };
}; 