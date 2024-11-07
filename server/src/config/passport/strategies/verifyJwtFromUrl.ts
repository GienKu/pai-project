// @deno-types="@types/passport-jwt"
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';

const JWT_PUB_KEY = Deno.env.get('JWT_PUB_KEY');

const verifyJwtFromUrl = () => {
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
