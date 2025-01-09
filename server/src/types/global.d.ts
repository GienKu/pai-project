// @deno-types="@types/jsonwebtoken"
import { JwtPayload } from 'jsonwebtoken';
import { type UserType } from '../db/models/User.ts';


declare global {
  export interface ApiResponse<T> {
    data?: T;
    message: string;
  }

  export type Role = number;

  export interface CustomJwtPayload extends JwtPayload {
    role: Role;
    tokenType: string;
  }

  export namespace Express {
    export interface Request {
      jwtPayload?: CustomJwtPayload;
      parentId: string;
    }

    export interface User extends UserType {}
  }
}
