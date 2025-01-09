// @deno-types="@types/passport-jwt"
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';

const JWT_PUB_KEY = Deno.env.get('JWT_PUB_KEY');

/**
 * Creates a JWT verification strategy that extracts the JWT from a URL query parameter.
 * 
 * This function configures a Passport strategy to verify JWT tokens passed via a URL query parameter.
 * It uses the public key specified in the `JWT_PUB_KEY` environment variable to verify the token.
 * 
 * @throws {Error} If the `JWT_PUB_KEY` environment variable is not set.
 * 
 * @returns {Strategy} A Passport strategy configured to verify JWT tokens.
 */
export const verifyJwtFromUrl = () => {
  if (!JWT_PUB_KEY) {
    throw new Error('No JWT_PUB_KEY in .env file');
  }

  const jwtOptions: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
    secretOrKey: JWT_PUB_KEY,
    algorithms: ['RS256'],
    ignoreExpiration: false,
    passReqToCallback: true,
  };

  const registrationJwtStrategy = new Strategy(
    jwtOptions,
    (req, jwtPayload, done) => {
      try {
        req.jwtPayload = jwtPayload;
        return done(null, jwtPayload);
      } catch (error) {
        return done(error, false);
      }
    }
  );
  return registrationJwtStrategy;
};

export default verifyJwtFromUrl;
