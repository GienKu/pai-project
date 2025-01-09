// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import File from '../../db/models/File.ts';
import { AppError } from '../../errors/AppError.ts';
import { parse as vParse } from 'valibot';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas.ts';
import Link from '../../db/models/Link.ts';

const BASE_URL = Deno.env.get('BASE_URL');

/**
 * Creates a shareable link for a file.
 *
 * @param req - The request object containing user and file information.
 * @param res - The response object used to send the shareable link.
 * @param next - The next middleware function in the stack.
 *
 * @throws {Error} If the user or BASE_URL is not defined.
 * @throws {AppError} If the file could not be found or the link could not be created.
 *
 * @returns {void} Sends a JSON response with the shareable link URI.
 */
export const createLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !BASE_URL) {
      throw new Error('user or BASE_URL is not defined');
    }
    // check if id is in correct format
    const fileId = vParse(ObjectIdSchema, req.params.id);

    //check if file exists
    const file = await File.findOne({
      userId: req.user.id,
      _id: fileId,
    }).exec();

    if (!file) {
      throw new AppError('Could not find the file', 404);
    }

    //check if link with this file already exists
    const existingLink = await Link.findOne({
      fileId: file.id,
      generatedById: req.user.id,
    }).exec();

    if (existingLink) {
      return void res.status(200).json({
        shareUri: `${BASE_URL}/cloud/shared/${existingLink.id}`,
      });
    }

    const link = await (
      await Link.create({
        fileId: file.id,
        generatedById: req.user.id,
        accessLevel: 'read',
        expirationAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      })
    ).save();

    if (!link) {
      throw new AppError('Could not create link', 500);
    }

    return void res.status(200).json({
      shareUri: `${BASE_URL}/cloud/shared/${link.id}`,
    });
  } catch (err) {
    next(err);
  }
};
