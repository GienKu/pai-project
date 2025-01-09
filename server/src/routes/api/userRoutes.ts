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

/**
 * Defines the user-related routes for the application.
 * 
 * Routes:
 * - POST /api/login: Authenticates a user and logs them in.
 * - POST /api/register: Registers a new user.
 * - PATCH /api/admin/update/:id: Updates user information for a specific user (admin only).
 * - DELETE /api/admin/delete/:id: Deletes a specific user (admin only).
 * - POST /api/logout: Logs out the current user and clears the authentication token.
 * - GET /api/verify-email: Verifies a user's email address.
 * - POST /api/send-password-reset-link: Sends a password reset link to the user's email.
 * - GET /api/verify-password-reset-link: Verifies the password reset link.
 * - PATCH /api/update-password: Updates the user's password.
 * 
 * Middleware:
 * - `auth([2])`: Ensures the user is authenticated and has the required role (e.g., admin).
 * - `linkAuth`: Ensures the link used for verification is valid.
 * 
 * Controllers:
 * - `userLoginController`: Handles user login.
 * - `userRegistration`: Handles user registration.
 * - `updateUser`: Handles updating user information.
 * - `deleteUser`: Handles deleting a user.
 * - `verifyUserEmail`: Handles email verification.
 * - `sendPasswordResetLink`: Handles sending password reset links.
 * - `verifyPasswordResetToken`: Handles verifying password reset links.
 * - `updateUserPassword`: Handles updating user passwords.
 */
export const userRoutes = express.Router();

userRoutes.post('/api/login', userLoginController);

userRoutes.post('/api/register', userRegistration);

userRoutes.patch('/api/admin/update/:id', auth([2]), updateUser);

userRoutes.delete('/api/admin/delete/:id', auth([2]), deleteUser);

userRoutes.post('/api/register', userRegistration);

userRoutes.post('/api/logout', auth(), (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/');
});

userRoutes.get('/api/verify-email', linkAuth, verifyUserEmail);

userRoutes.post('/api/send-password-reset-link', sendPasswordResetLink);

userRoutes.get(
  '/api/verify-password-reset-link',
  linkAuth,
  verifyPasswordResetToken
);

userRoutes.patch('/api/update-password', auth(), updateUserPassword);
