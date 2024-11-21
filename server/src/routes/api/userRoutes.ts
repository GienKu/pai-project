// @deno-types="@types/express"
import express from 'express';
import { userLoginController } from '../../controllers/user/userLogin.ts';
import { sendPasswordResetLink } from '../../controllers/user/sendPasswordResetLink.ts';
import { verifyPasswordResetToken } from '../../controllers/user/verifyPasswordResetLink.ts';
import { userRegistration } from '../../controllers/user/userRegistration.ts';
import { updateUserPassword } from '../../controllers/user/updateUserPassword.ts';
import { auth } from '../../middlewares/handleAuth.ts';
import { linkAuth } from '../../middlewares/handleLinkAuth.ts';
import { verifyUserEmail } from '../../controllers/user/verifyUserEmail.ts';
import { deleteUser } from '../../controllers/user/deleteUser.ts';
import { updateUser } from '../../controllers/user/updateUser.ts';

export const userRoutes = express.Router();

userRoutes.post('/api/login', userLoginController);

userRoutes.post('/api/register', userRegistration);

userRoutes.patch('/api/admin/update/:id', auth([2]), updateUser);

userRoutes.delete('/api/admin/delete/:id', auth([2]), deleteUser);

userRoutes.post('/api/register', userRegistration);

userRoutes.get('/api/verify-email', linkAuth, verifyUserEmail);

userRoutes.post('/api/send-password-reset-link', sendPasswordResetLink);

userRoutes.get(
  '/api/verify-password-reset-link',
  linkAuth,
  verifyPasswordResetToken
);

userRoutes.patch('/api/update-password', auth(), updateUserPassword);
