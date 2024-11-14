import { Request, Response, NextFunction } from 'express';
// @deno-types="@types/passport"
import passport, { AuthenticateCallback } from 'passport';

const BASE_URL = Deno.env.get('BASE_URL');

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