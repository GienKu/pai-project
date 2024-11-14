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
    //payload is added to request obj after it is validated by passport middleware
    const payload = req.jwtPayload;
    if (!payload) {
      throw new Error('No payload attached to request');
    }
    const id = payload.sub;

    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      return res.status(401).redirect(`${BASE_URL}/not-verified`);
    }

    // generate token for setting up new password
    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'new-password',
      exp: '15m',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).redirect(`${BASE_URL}/password-reset`);
  } catch (error: any) {
    next(error);
  }
};
