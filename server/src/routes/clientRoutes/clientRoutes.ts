// @deno-types="@types/express"
import express from 'express';

export const clientRoutes = express.Router();

clientRoutes.get('/', (req, res) => {
  res.render('index.ejs');
});

clientRoutes.get('/cloud', (req, res) => {
  res.render('cloud.ejs');
});
