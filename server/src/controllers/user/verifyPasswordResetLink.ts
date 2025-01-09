// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';
import User from '../../db/models/User.ts';

const BASE_URL = Deno.env.get('BASE_URL');

/**
 * Verifies the password reset token and redirects the user to the appropriate page.
 *
 * @param req - The request object, which should contain the JWT payload.
 * @param res - The response object used to send the response.
 * @param next - The next middleware function in the stack.
 *
 * @throws Will throw an error if the JWT payload is not attached to the request.
 * @throws Will throw an error if the user is not found in the database.
 *
 * @remarks
 * This function expects the JWT payload to be attached to the request object by a preceding middleware.
 * If the user is found, a new JWT token for setting up a new password is generated and set as an HTTP-only cookie.
 * The user is then redirected to the password reset page.
 * If the user is not found, the user is redirected to a "not verified" page.
 */
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
