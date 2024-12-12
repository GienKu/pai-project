// @deno-types="@types/express"
import express from 'express';
import { auth } from '../../middlewares/handleAuth.ts';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';
import Link from '../../db/models/Link.ts';
import File from '../../db/models/File.ts';
import { Buffer } from "node:buffer";

export const clientRoutes = express.Router();

const ROLE_ADMIN = Number(Deno.env.get('ROLE_ADMIN'));
const ROLE_USER = Number(Deno.env.get('ROLE_USER'));
//? admin@admin.com
//? ZAQ!2wsx
//? KONTO ADMINA DO TESTÓW

clientRoutes.get('/', (req, res) => {
  res.render('index.ejs');
});

clientRoutes.get('/cloud/user', auth(), async (req, res) => {
  //req.user should be always defined at this point, if not then there is a bug somewhere in the code
  if (!req.user) {
    throw new AppError('User not defined', 500);
  }

  const user = {
    username: req.user?.username,
    email: req.user?.email,
    role: req.user?.role,
    maxUploadSize: req.user?.maxUploadSize,
    storageLimit: req.user?.storageLimit,
    usedStorage: req.user?.usedStorage,
  };

  res.render('cloud.ejs', {
    user: user,
    users: [],
  });
});

clientRoutes.get('/cloud/admin', auth(), async (req, res) => {
  //req.user should be always defined at this point, if not then there is a bug somewhere in the code
  if (!req.user) {
    throw new AppError('User not defined', 500);
  }

  const user = {
    username: req.user?.username,
    email: req.user?.email,
    role: req.user?.role,
  };

  const users = await User.find({}).exec();

  // admin
  res.render('cloud.ejs', {
    user: user,
    files: [],
    users: users || [],
  });
});

clientRoutes.get('/cloud/shared/:linkId', async (req, res) => {
  const linkId = req.params.linkId;
  
  if (!linkId) {
    return res.render('not-found.ejs'); //TODO: create not-found.ejs
  }
  
  const link = await Link.findOne({ _id: linkId }).exec();
  
  if (!link || link.expirationAt < new Date()) {
    console.log('linkId', linkId);
    return res.render('not-found.ejs');
  }

  const file = await File.findOne({
    _id: link.fileId,
  }).exec();

  if (!file) {
    return res.render('not-found.ejs');
  }

  const filePath = file.path;
  const fileBlob = await Deno.readFile(filePath);
  const fileBase64 = Buffer.from(fileBlob).toString('base64');

  //todo create shared-file.ejs
  res.render('shared-file.ejs', {
    file: {
      name: file.name,
      size: file.size,
      fileBlob: fileBase64,
    },
  });
});

clientRoutes.get('/not-verified', (req, res) => {
  res.render('not-verified.ejs');
});

clientRoutes.get('/unauthorized', (req, res) => {
  res.render('unauthorized.ejs');
});

clientRoutes.get('/password-reset', (req, res) => {
  // TODO: add password reset page
  // res.render('unauthorized.ejs');
});

clientRoutes.get('*', (req, res) => {
  res.render('not-found.ejs');
});
