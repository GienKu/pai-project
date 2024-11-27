// @deno-types="@types/express"
import express from 'express';
import { auth } from '../../middlewares/handleAuth.ts';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';

export const clientRoutes = express.Router();

const ROLE_ADMIN = Number(Deno.env.get('ROLE_ADMIN'));
const ROLE_USER = Number(Deno.env.get('ROLE_USER'));

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

clientRoutes.get('/cloud/files', auth(), async (req, res) => {
  // TODO get files from database
  // now lets use mockFiles till the File model will be present, and we can upload real files

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
        size: '1.24', //? in MB
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

  // sort files by type (dir first)
  const mock = mockFiles.sort((a, b) => {
    if (a.type === 'dir' && b.type !== 'dir') return -1;
    if (a.type !== 'dir' && b.type === 'dir') return 1;
    return 0;
  });

  res.status(200).send(mock);
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
