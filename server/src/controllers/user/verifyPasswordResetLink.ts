// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';
import User from '../../db/models/User.ts';

const BASE_URL = Deno.env.get('BASE_URL');

export const verifyPasswordResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.jwtPayload;
    if (!payload) {
      throw new Error('No payload attached to request');
    }
    const id = payload.sub;

    const user = await User.findOne({ id }).exec();

    if (!user) {
      return res.status(401).redirect(`${BASE_URL}/not-verified`);
    }

    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'new-password',
      exp: '15m',
    });

    res.status(200).redirect(`${BASE_URL}/password-reset?token=${token}`);
  } catch (error: any) {
    next(error);
  }
};
