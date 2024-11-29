// @deno-types="@types/express"
import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/api/userRoutes.ts';
import { passportConfig } from './config/passport/passport.ts';
import { errorHandler } from './middlewares/handleErrors.ts';
import path from 'node:path';
import { clientRoutes } from './routes/clientRoutes/clientRoutes.ts';
import './db/connection.ts';
import { fileRoutes } from './routes/api/fileRoutes.ts';

const PORT = Deno.env.get('PORT') || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

passportConfig(app);

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(Deno.cwd(), 'public/views'));
app.use(express.static(path.join(Deno.cwd(), 'public')));

app.use(userRoutes);
app.use(fileRoutes);
app.use(clientRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
