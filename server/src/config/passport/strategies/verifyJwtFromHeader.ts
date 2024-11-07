// @deno-types="@types/passport-jwt"
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
const JWT_PUB_KEY = Deno.env.get('JWT_PUB_KEY');

const verifyJwtFromHeader = () => {
  if (!JWT_PUB_KEY) {
    throw new Error('JWT_PUB_KEY is not defined');
  }

  const jwtOptions: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_PUB_KEY,
    algorithms: ['RS256'],
    ignoreExpiration: false,
    passReqToCallback: true,
  };

  const jwtStrategy = new Strategy(
    jwtOptions,
    async (req, jwtPayload, done) => {
      try {
        //TODO: FIND USER IN DATABASE
        // const user = await User.findOne({ _id: jwtPayload.sub });
        // if (!user) {
        //   return done(null, false);
        // }
        // return done(null, user);
      } catch (error: any) {
        return done(error, false);
      }
    }
  );
  return jwtStrategy;
};

export { verifyJwtFromHeader };
