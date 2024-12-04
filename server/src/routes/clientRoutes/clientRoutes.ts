// @deno-types="@types/express"
import express from 'express';
import { auth } from '../../middlewares/handleAuth.ts';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';

export const clientRoutes = express.Router();

const ROLE_ADMIN = Number(Deno.env.get('ROLE_ADMIN'));
const ROLE_USER = Number(Deno.env.get('ROLE_USER'));
//? admin@admin.com
//? ZAQ!2wsx
//? KONTO ADMINA DO TESTÓW


clientRoutes.get('/', (req, res) => {
  res.render('index.ejs');
});

// TODO ROUTE FOR UPLOADING FILES (at least one file)
// body = { files[] }
// clientRoutes.post('/cloud/upload');

// TODO ROUTE FOR DELETING FILES
// cloud/delete/:id {void}

// TODO ROUTE FOR DOWNLOADING FILES
// cloud/download/:id {void}

// TODO ROUTE FOR SHARING FILES
// cloud/share/:id {shareUri}


// - get cloud/files moved to routes/api/fileRoutes and now it should be sent
// with :parentId param - if :parentId == 'root' then root folder is returned
// - check File model 

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
