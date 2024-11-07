// @deno-types="@types/jsonwebtoken"
import { JwtPayload } from 'jsonwebtoken';

declare global {
  interface ApiResponse<T> {
    data?: T;
    message: string;
    status: number;
  }

  type Role = Number;

  interface CustomJwtPayload extends JwtPayload {
    role: Role;
    tokenType: string;
  }

  namespace Express {
    interface Request {
      jwtPayload?: CustomJwtPayload;
    }
  }
}
