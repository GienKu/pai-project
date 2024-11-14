import { Request, Response, NextFunction } from 'express';
// @deno-types="@types/passport"
import passport, { AuthenticateCallback } from 'passport';

const BASE_URL = Deno.env.get('BASE_URL');

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

        if (!hasRole) {
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
