// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';

export const createFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(400).send(req.body);
    } catch (err) {
        next(err);
    }
};