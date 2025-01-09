// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';
import { parse as vParse } from 'valibot';
import { UpdateUserSchema } from '../../validation-schemas/validationSchemas.ts';

/**
 * Updates a user's information based on the provided request body.
 * This function currently supports blocking/unblocking a user and can be extended in the future.
 * Assumes that the admin is authenticated and authorized to perform the block operation.
 *
 * @param req - The request object containing the user ID in the params and the fields to update in the body.
 * @param res - The response object used to send the status code.
 * @param next - The next middleware function in the stack.
 *
 * @throws {AppError} If the user is not found.
 *
 * @returns {Promise<void>} Sends a 200 status code if the update is successful.
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // function to update user, for now it only block/unblock user, can be extended in the future
    // at this point admin is authenticated and authorized to perform block op.

    // req.body property names that are going to be changed should match those in the database
    // validation schema overview:
    // username: v.optional(v.pipe(v.string(), v.minLength(3))),
    // email: v.optional(v.pipe(v.string(), v.email())),
    // role: v.optional(v.number()),
    // storageLimit: v.optional(v.number()),
    // maxUploadSize: v.optional(v.number()),
    // isBlocked: v.optional(v.boolean()), 

    const fieldsToUpdate = vParse(UpdateUserSchema, req.body);

    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: fieldsToUpdate },
      { new: true }
    ).exec();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).send();
  } catch (error: any) {
    next(error);
  }
};
