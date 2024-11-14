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

    const response: ApiResponse<void> = {
      message: 'Successful registration',
    };

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};
