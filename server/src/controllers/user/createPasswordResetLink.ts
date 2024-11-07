// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { ResetPasswordSchema } from '../../validation-schemas/validationSchemas.ts';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';
import User from '../../db/models/User.ts';
import { AppError } from '../../errors/AppError.ts';

const BASE_URL = Deno.env.get('BASE_URL');

if (!BASE_URL) {
  throw new Error('BASE_URL is not defined');
}

export const passwordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = vParse(ResetPasswordSchema, req.body);

    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError('User with this email does not exist', 404);
    }

    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'password-reset',
      exp: '1h',
    });

    const verificationLink = `${BASE_URL}/api/verify-password-reset?token=${token}`;

    // TODO: Send email with verification
    // await sendResetPasswordLink(
    //   user.email,
    //   verificationLink
    // );

    res.status(200).json({ message: 'Link resetujący został wysłany' });
  } catch (error: any) {
    next(error);
  }
};
