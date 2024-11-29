// @deno-types="@types/jsonwebtoken"
import { JwtPayload } from 'jsonwebtoken';
import { type UserType } from '../db/models/User.ts';

declare global {
  interface ApiResponse<T> {
    data?: T;
    message: string;
  }

  type Role = number;

  interface CustomJwtPayload extends JwtPayload {
    role: Role;
    tokenType: string;
  }

  namespace Express {
    interface Request {
      jwtPayload?: CustomJwtPayload;
      parentId: string;
    }

    interface User extends UserType {}
  }
}
