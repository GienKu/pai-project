// @deno-types="@types/passport-jwt"
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import User from '../../../db/models/User.ts';

const JWT_PUB_KEY = Deno.env.get('JWT_PUB_KEY');

const cookieExtractor = (req: Request) => {
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
