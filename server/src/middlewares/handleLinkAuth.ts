import { Request, Response, NextFunction } from 'express';
// @deno-types="@types/passport"
import passport, { AuthenticateCallback } from 'passport';

const BASE_URL = Deno.env.get('BASE_URL');

/**
 * Middleware to handle link authentication using JWT.
 * 
 * This middleware uses Passport to authenticate requests based on a JWT
 * provided in the URL. If authentication fails, the user is redirected
 * to a "not verified" page. If authentication succeeds, the request is
 * passed to the next middleware.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const linkAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticateCallback: AuthenticateCallback = (
    err,
    data,
    info,
    status
  ) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      return res.status(401).redirect(`${BASE_URL}/not-verified`);
    }
    next();
  };

  const cb = passport.authenticate(
    'jwt-url',
    { session: false },
    authenticateCallback
  );

  cb(req, res, next);
};
