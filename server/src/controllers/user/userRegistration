// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { RegisterSchema } from '../../validation-schemas/validationSchemas.ts';
import { hashPassword } from '../../utils/passwordUtils.ts';
import { generateJwtToken } from '../../utils/generateJwtToken.ts';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = vParse(RegisterSchema, req.body);

    const hashedPassword = await hashPassword(password);

    await new User({
      username,
      email,
      password: hashedPassword,
    }).save();

    // TODO SEND EMAIL CONFIRMATION

    const response: ApiResponse<void> = {
      message: 'Successful registration',
      status: 200,
    };

    res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};
