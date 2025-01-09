// @deno-types="@types/passport-jwt"
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import User from '../../../db/models/User.ts';

const JWT_PUB_KEY = Deno.env.get('JWT_PUB_KEY');

/**
 * Extracts the value of the 'auth_token' cookie from the request headers.
 *
 * @param req - The HTTP request object.
 * @returns The value of the 'auth_token' cookie if present, otherwise null.
 */
export const cookieExtractor = (req: Request) => {
  if (req && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token') {
        return value;
      }
    }
  }
  return null;
};

/**
 * Creates a JWT verification strategy using the public key defined in the environment variable `JWT_PUB_KEY`.
 * 
 * @throws {Error} If `JWT_PUB_KEY` is not defined.
 * 
 * @returns {Strategy} A configured JWT strategy for passport.
 * 
 * The strategy extracts the JWT from a cookie, verifies it using the RS256 algorithm, and checks its expiration.
 * If the JWT is valid, it attempts to find the corresponding user in the database.
 * 
 * @example
 * import passport from 'passport';
 * import { verifyJwtFromHeader } from './path/to/verifyJwtFromHeader';
 * 
 * passport.use(verifyJwtFromHeader());
 */
const verifyJwtFromHeader = () => {
  if (!JWT_PUB_KEY) {
    throw new Error('JWT_PUB_KEY is not defined');
  }

  const jwtOptions: StrategyOptionsWithRequest = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: JWT_PUB_KEY,
    algorithms: ['RS256'],
    ignoreExpiration: false,
    passReqToCallback: true,
  };

  const jwtStrategy = new Strategy(
    jwtOptions,
    async (req, jwtPayload, done) => {
      try {
        const user = await User.findOne({ _id: jwtPayload.sub }).exec();
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error: any) {
        return done(error, false);
      }
    }
  );
  return jwtStrategy;
};

export { verifyJwtFromHeader };
