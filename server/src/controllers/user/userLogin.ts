// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { LoginSchema } from '../../validation-schemas/validationSchemas.ts';
import { verifyPassword } from '../../utils/passwordUtils.ts';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';

export const userLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = vParse(LoginSchema, req.body);

    // TODO FINDING USER IN DATABASE

    const user = await User.findOne({
      email: email,
    }).exec();

    if (!user) {
      throw new AppError('Nieprawidłowe dane logowania', 401);
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!(await verifyPassword(password, user.password))) {
      throw new AppError('Nieprawidłowe dane logowania', 401);
    }

    // CREATING TOKEN
    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'user-requests',
    });

    res.cookie('auth_token', token, { httpOnly: true, secure: true });
    res.status(200).redirect('/cloud');
  } catch (error: any) {
    next(error);
  }
};
