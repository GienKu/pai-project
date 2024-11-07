// @deno-types="@types/express"
import express from 'express';
import { userLoginController } from '../../controllers/user/userLogin.ts';
import { passwordResetController } from '../../controllers/user/createPasswordResetLink.ts';
import { verifyPasswordResetToken } from '../../controllers/user/verifyPasswordResetLink.ts';
import { userRegistration } from '../../controllers/user/userRegistration';

export const userRoutes = express.Router();

userRoutes.post('/api/login', userLoginController);

userRoutes.post('/api/register', userRegistration);

userRoutes.post('/api/password-reset-link', passwordResetController);

userRoutes.get('/api/verify-password-reset', verifyPasswordResetToken);

// TODO controller for updating password
