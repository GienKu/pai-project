import { Request, Response, NextFunction } from 'express';
// @deno-types="@types/passport"
import passport, { AuthenticateCallback } from 'passport';

const BASE_URL = Deno.env.get('BASE_URL');

/**
 * Middleware to handle authentication and authorization.
 * 
 * @param {Role[]} [rolesWithAccess=[]] - An array of roles that have access to the route. If empty, all roles have access.
 * @returns {Function} - An Express middleware function.
 * 
 * @example
 * // Usage in an Express route
 * app.get('/protected-route', auth(['admin', 'user']), (req, res) => {
 *   res.send('This is a protected route');
 * });
 * 
 * @description
 * This middleware uses Passport.js to authenticate the user using the 'jwt-header' strategy.
 * If authentication fails, the user is redirected to the unauthorized page.
 * If the user does not have the required role or is blocked, a 403 Forbidden response is sent.
 * Otherwise, the user object is attached to the request and the next middleware is called.
 * 
 * @throws {Error} - If an error occurs during authentication or authorization.
 */
export const auth = (rolesWithAccess: Role[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authenticateCallback: AuthenticateCallback = async (
      err,
      user,
      info,
      status
    ) => {
      try {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(401).redirect(`${BASE_URL}/unauthorized`);
        }

        // check if user has required roles if rolesWithAccess is empty then all roles have access
        const hasRole =
          rolesWithAccess.length === 0 || rolesWithAccess.includes(user.role);

        if (!hasRole || user.isBlocked) {
          return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user;
        next();
      } catch (err: any) {
        next(err);
      }
    };

    const cb = passport.authenticate(
      'jwt-header',
      { session: false },
      authenticateCallback
    );

    await cb(req, res, next);
  };
};
