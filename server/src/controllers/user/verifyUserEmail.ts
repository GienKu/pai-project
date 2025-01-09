import { Request, Response, NextFunction } from 'express';
import User from '../../db/models/User.ts';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';

const BASE_URL = Deno.env.get('BASE_URL');

/**
 * Verifies the user's email by updating the `verifiedAt` field in the user's record.
 * 
 * @param req - The request object, which should contain a valid JWT payload.
 * @param res - The response object used to send the response back to the client.
 * @param next - The next middleware function in the stack.
 * 
 * @throws Will throw an error if the JWT payload is not attached to the request.
 * 
 * @returns Redirects the user to the appropriate URL based on the verification status.
 * 
 * - If the user is successfully verified, a new JWT token is generated and set as a cookie,
 *   and the user is redirected to the cloud page.
 * - If the user is not verified, the user is redirected to the not-verified page.
 */
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
