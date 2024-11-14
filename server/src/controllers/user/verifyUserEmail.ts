import { Request, Response, NextFunction } from 'express';
import User from '../../db/models/User.ts';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';

const BASE_URL = Deno.env.get('BASE_URL');

export const verifyUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // after jwt token is valid its payload is added to request
    if (!req.jwtPayload) {
      throw new Error('jwtPayload not attached to request');
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.jwtPayload.sub },
      { verifiedAt: new Date() },
      { new: true }
    ).exec();

    if (!updatedUser) {
      return res.status(401).redirect(`${BASE_URL}/not-verified`);
    }

    const token = generateJwtToken({
      id: updatedUser.id,
      role: updatedUser.role,
      tokenType: 'user-requests',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.redirect(`${BASE_URL}/cloud`);
  } catch (error: any) {
    next(error);
  }
};
