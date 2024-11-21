// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { LoginSchema } from '../../validation-schemas/validationSchemas.ts';
import { verifyPassword } from '../../utils/passwordUtils.ts';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';

const ROLE_ADMIN = Number(Deno.env.get('ROLE_ADMIN'));
const ROLE_USER = Number(Deno.env.get('ROLE_USER'));

export const userLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ROLE_USER || !ROLE_ADMIN) {
      throw new Error('Missing environment variables');
    }

    const { email, password } = vParse(LoginSchema, req.body);

    // find user in db
    const user = await User.findOne({
      email: email,
    }).exec();

    // if user not found or password is not valid
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new AppError('Email or password is not valid', 401);
    }

    // create access token
    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'user-requests',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    switch (user.role) {
      case ROLE_USER:
        return res.redirect('/cloud/user');
      case ROLE_ADMIN:
        return res.redirect('/cloud/admin');
      default:
        throw new AppError('Role is not valid', 500);
    }
    // res.redirect('/cloud');
  } catch (error: any) {
    next(error);
  }
};
