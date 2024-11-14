import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../errors/AppError.ts';
import { parse as vParse } from 'valibot';
import { NewPasswordSchema } from '../../validation-schemas/validationSchemas.ts';
import User from '../../db/models/User.ts';
import { hashPassword } from '../../utils/passwordUtils.ts';

export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user and jwtPayload is attached to request obj after it is validated by passport middleware
    if (!req.user) {
      throw new Error('User not attached to request');
    }
    if (req.jwtPayload?.type !== 'new-password') {
      throw new AppError('Invalid token type', 400);
    }

    // validate request data
    const { password } = vParse(NewPasswordSchema, req.body);

    await User.findOneAndUpdate(
      {
        id: req.user.id,
      },
      {
        password: await hashPassword(password),
      }
    );

    res.status(200).json({
      message: 'Password updated',
    });
  } catch (error: any) {
    next(error);
  }
};
