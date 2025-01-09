// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { RegisterSchema } from '../../validation-schemas/validationSchemas.ts';
import { hashPassword } from '../../utils/passwordUtils.ts';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';
import { sendEmailConfirmationLink } from '../../config/nodemailer/nodemailer.ts';

const BASE_URL = Deno.env.get('BASE_URL');

/**
 * Handles user registration.
 *
 * This function performs the following steps:
 * 1. Validates the request body against the `RegisterSchema`.
 * 2. Checks if the email already exists in the database.
 * 3. Creates a new user with the provided username, email, and hashed password.
 * 4. Generates a JWT token for immediate login.
 * 5. Generates a JWT token for email verification.
 * 6. Sends an email confirmation link to the user's email.
 * 7. Sets an HTTP-only cookie with the authentication token.
 * 8. Redirects the user to the `/cloud/user` page.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 *
 * @throws Will throw an error if `BASE_URL` is not defined.
 * @throws Will throw an error if the email already exists.
 */
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!BASE_URL) {
      throw new Error('BASE_URL is not defined');
    }

    const { username, email, password } = vParse(RegisterSchema, req.body);

    const emailExists = !!(await User.findOne({ email: email }));
    if (emailExists) {
      throw new AppError('Email already exists', 400);
    }

    // create user
    const user = await new User({
      username,
      role: 1,
      email,
      password: await hashPassword(password),
    }).save();

    // create token to immediately login user
    const token = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'user-requests',
    });

    // create jwt token for verification
    const emailToken = generateJwtToken({
      id: user.id,
      role: user.role,
      tokenType: 'email-verification',
    });

    // send verification link
    await sendEmailConfirmationLink(
      user.email,
      `${BASE_URL}/api/verify-email?token=${emailToken}`
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    
    return res.redirect('/cloud/user');
  } catch (error: any) {
    next(error);
  }
};
