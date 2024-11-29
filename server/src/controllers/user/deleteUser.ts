// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';

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
