import { Request } from 'express';
import fs from 'fs';

/*
 *  This function is used to clean up the files uploaded by multer in case of an error
 */

export const multerOnErrorCleanup = async (req: Request) => {
  if (req.files) {
    const files = req.files as Express.Multer.File[];
    // remove files
    for (const file of files) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    //remove directory
    fs.rmdir(files[0].destination, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  //delete db entries
//   if (req.body.reportId) {
//     try {
//       await xprisma.file.deleteMany({
//         where: {
//           reportId: req.body.reportId,
//         },
//       });
//     } catch (err: any) {
//       console.log(err);
//     }
//   }
};
