// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';


/**
 * Deletes a user from the database.
 * 
 * @param req - The request object containing the user ID in the parameters.
 * @param res - The response object used to send the status of the operation.
 * @param next - The next middleware function in the stack.
 * 
 * @throws {AppError} If the user is not found or if the user is an admin.
 * 
 * @returns {Promise<void>} A promise that resolves when the user is deleted.
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //at this point user is authenticated and authorized to perform deletion
    const userToDelete = await User.findOneAndDelete({
      _id: req.params.id,
    }).exec();

    if (!userToDelete) {
      throw new AppError('User not found', 404);
    }
    if (userToDelete.role === 2) {
      throw new AppError('Cannot delete an admin user', 400);
    }

    const user = await User.findOneAndDelete({
      _id: req.params.id,
    }).exec();

    res.status(200).send();
  } catch (error: any) {
    next(error);
  }
};
