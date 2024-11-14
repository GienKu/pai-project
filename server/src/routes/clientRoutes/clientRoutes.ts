// @deno-types="@types/express"
import express from 'express';
import { auth } from '../../middlewares/handleAuth.ts';

export const clientRoutes = express.Router();

clientRoutes.get('/', (req, res) => {
  res.render('index.ejs');
});

clientRoutes.get('/cloud', auth(), (req, res) => {
  res.render('cloud.ejs');
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
