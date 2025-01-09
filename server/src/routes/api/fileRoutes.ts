// @deno-types="@types/express"
import express from 'express';
import { auth } from '../../middlewares/handleAuth.ts';
import { uploadFiles } from '../../controllers/file/uploadFiles.ts';
import { getFilesInfo } from '../../controllers/file/getFilesStructure.ts';
import { deleteFile } from '../../controllers/file/deleteFile.ts';
import { getFile } from '../../controllers/file/getFile.ts';
import { createFolder } from '../../controllers/file/createFolder.ts';
import { createLink } from '../../controllers/file/createLink.ts';

/**
 * Sets up the file-related routes for the Express application.
 * 
 * Routes:
 * - POST /api/cloud/upload: Uploads files to the cloud. Requires authentication with role 1.
 * - DELETE /api/cloud/delete/:id: Deletes a file by its ID. Requires authentication with role 1.
 * - GET /api/cloud/download/:id: Downloads a file by its ID. Requires authentication with role 1.
 * - POST /api/cloud/share/:id: Creates a shareable link for a file by its ID. Requires authentication with role 1.
 * - GET /api/cloud/files/:parentId: Retrieves information about files in a specified directory. Requires authentication.
 * - POST /api/cloud/directory: Creates a new directory in the cloud. Requires authentication with role 1.
 * 
 * Middleware:
 * - `auth`: Middleware to handle authentication. Accepts an optional array of roles.
 * 
 * Controllers:
 * - `uploadFiles`: Handles file upload logic.
 * - `deleteFile`: Handles file deletion logic.
 * - `getFile`: Handles file download logic.
 * - `createLink`: Handles creation of shareable links.
 * - `getFilesInfo`: Handles retrieval of file structure information.
 * - `createFolder`: Handles creation of new directories.
 */
export const fileRoutes = express.Router();

fileRoutes.post('/api/cloud/upload', auth([1]), uploadFiles);

fileRoutes.delete('/api/cloud/delete/:id', auth([1]), deleteFile);

fileRoutes.get('/api/cloud/download/:id', auth([1]), getFile);

fileRoutes.post('/api/cloud/share/:id', auth([1]), createLink);

fileRoutes.get('/api/cloud/files/:parentId', auth(), getFilesInfo);

fileRoutes.post('/api/cloud/directory', auth([1]), createFolder);
