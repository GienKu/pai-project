// @deno-types="@types/express"
import express from 'express';
import { auth } from '../../middlewares/handleAuth.ts';
import { uploadFiles } from '../../controllers/file/uploadFiles.ts';
import { getFilesInfo } from '../../controllers/file/getFilesStructure.ts';
import { deleteFile } from "../../controllers/file/deleteFile.ts";
import { getFile } from "../../controllers/file/getFile.ts";
import { createFolder } from "../../controllers/file/createFolder.ts";

export const fileRoutes = express.Router();

fileRoutes.post('/api/cloud/upload', auth([1]), uploadFiles);

fileRoutes.delete('/api/cloud/delete/:id', auth([1]), deleteFile);

fileRoutes.get('/api/cloud/download/:id', auth([1]), getFile);

fileRoutes.get('/api/share/:id', auth([1]));

fileRoutes.get('/api/cloud/files/:parentId', auth(), getFilesInfo);

fileRoutes.get('/api/cloud/directory', auth([1]), createFolder);