import { Request, Response, NextFunction } from 'express';
import { multerOnErrorCleanup } from "../../utils/multerOnErrorCleanup.ts";
import { AppError } from "../../errors/AppError.ts";
/*
 *  Files upload controller
 *  Files are uploaded using multer middleware but it used inside the controller instead of route
 *  Files are saved to the disk and their info is saved to the database
 *  If any error occurs during the file upload process, all files are deleted from the disk
 *  File hashes are calculated to check the integrity of the files
 *
 */

const uploadArray = upload.array('files');

//to do test it with client
export const uploadFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // uploadArray is a middleware that uploads files to the disk
  uploadArray(req, res, async (err: any) => {
    try {
      if (err) {
        // Cleanup files in case of an error
        await multerOnErrorCleanup(req);
        return next(err);
    }
        
        
    //   const foundReport = await xprisma.report.findUnique({
    //     where: { id: req.body.reportId, companyId: req.companyData.id },
    //   });

    //   if (!foundReport) {
    //     throw new AppError('Nie znaleziono raportu o podanym id', 404);
    //   }
      // save files info to the database
      const files = req.files as Express.Multer.File[];

//db query to save files paths and structure

      res.status(200).json({
        message: 'Pliki zostały przesłane pomyślnie',
      });
    } catch (error: any) {
      await multerOnErrorCleanup(req);
      next(error);
    }
  });
};
