// @deno-types="@types/express"
import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/api/userRoutes.ts';
import { passportConfig } from './config/passport/passport.ts';
import path from 'node:path';
import { clientRoutes } from './routes/clientRoutes/clientRoutes.ts';
import './db/connection.ts'

const PORT = Deno.env.get('PORT') || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// passportConfig(app);

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(Deno.cwd(), 'public/views'));

app.use(userRoutes);
app.use(clientRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
