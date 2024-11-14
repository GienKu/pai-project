// @deno-types="@types/jsonwebtoken"
import jwt from 'jsonwebtoken';

const JWT_PRIV_KEY = Deno.env.get('JWT_PRIV_KEY');

interface JwtClaims {
  id: string;
  role: Role;
  tokenType: string;
  exp?: string;
}

export const generateJwtToken = ({ id, role, tokenType, exp }: JwtClaims) => {
  if (!JWT_PRIV_KEY) {
    throw new Error('JWT_PRIV_KEY is not defined');
  }

  const expiresIn = exp ?? '1h';
  const now = Date.now();
  const iat = Math.floor(now / 1000);

  const jwtPayload: CustomJwtPayload = {
    sub: id,
    role,
    tokenType,
    iat: iat,
  };

  
  const token = jwt.sign(jwtPayload, JWT_PRIV_KEY, {
    algorithm: 'RS256',
    expiresIn: expiresIn,
  });

  return token;
};
