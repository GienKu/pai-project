// @deno-types="@types/express"
import express from 'express';
import { auth } from '../../middlewares/handleAuth.ts';

export const clientRoutes = express.Router();

clientRoutes.get('/', (req, res) => {
  res.render('index.ejs');
});

clientRoutes.get('/cloud', auth(), (req, res) => {
  const user = {
    username: req.user?.username || 'Guest',
    email: req.user?.email || null,
    role: req.user?.role || process.env.ROLE_GUEST
  }

  // TODO get files from database
  const files: {
    id: number,
    name: string,
    path: string,
    size: string,
    date: string,
    type: string
  }[] = [{
    id: 1, //? _id from database
    name: 'file1',
    path: '/path/to/file1.pdf',
    size: '1MB',
    date: '2021-03-01', //? Last modified date
    type: 'pdf'
  }, {
    id: 2,
    name: 'dir1',
    path: '/path/to/dir1',
    size: '0',
    date: '2021-03-01',
    type: 'dir'
  }];


  res.render('cloud.ejs', {
    user: user,
    files: files || []
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
