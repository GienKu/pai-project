// @deno-types="@types/express"
import express from 'express';
import { auth } from '../../middlewares/handleAuth.ts';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';

export const clientRoutes = express.Router();

const mockFiles: {
  id: number;
  name: string;
  path: string;
  size: string;
  date: string;
  type: string;
}[] = [
  {
    id: 1, //? _id from database
    name: 'file1',
    path: '/path/to/file1.pdf',
    size: '1MB',
    date: '2021-03-01', //? Last modified date
    type: 'pdf',
  },
  {
    id: 2,
    name: 'dir1',
    path: '/path/to/dir1',
    size: '0',
    date: '2021-03-01',
    type: 'dir',
  },
];

const ROLE_ADMIN = Number(Deno.env.get('ROLE_ADMIN'));
const ROLE_USER = Number(Deno.env.get('ROLE_USER'));
//? admin@admin.com
//? ZAQ!2wsx
//? KONTO ADMINA DO TESTÓW
//! TODO `/cloud` route for user / admin dashboard <<< FIRST PRIORITY
// - DONE -  added /cloud/user, /cloud/admin
// TODO route for block / unblock user UPDATE `/admin/block/:id` { blocked: boolean } :id = user id
// TODO route for change user space UPDATE `/admin/space/:id` { space: number } :id = user id
// - DONE /admin/update/:id to update fields like isBlocked and maxUploadSize (space) etc.
// TODO route for delete user DELETE `/admin/delete/:id` :id = user id
// - DONE /admin/delete/:id for deleting user
// TODO logout route POST `/logout`
// - DONE there is nothing to do on the server side to perform logout as sessions are not stored here, client should delete auth_token from cookies

clientRoutes.get('/', (req, res) => {
  res.render('index.ejs');
});

clientRoutes.get('/cloud/guest', auth(), async (req, res) => {
  // FRONT TODO
  // guest view
  // guest view should be different from user view. For example after uploading files on main page
  // guest should be redirected to this route where uploaded files and link for sharing will be present
  // res.render('guest.ejs');
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
  };

  // TODO get files from database
  // now lets use mockFiles till the File model will be present, and we can upload real files

  res.render('cloud.ejs', {
    user: user,
    files: mockFiles || [],
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
