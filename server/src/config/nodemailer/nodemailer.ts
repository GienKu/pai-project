// @deno-types="@types/nodemailer"
import nodemailer from 'nodemailer';
import { AppError } from '../../errors/AppError.ts';

const SMTP_HOST = Deno.env.get('SMTP_HOST');
const SMTP_PORT = Deno.env.get('SMTP_PORT');
const SMTP_USER = Deno.env.get('SMTP_USER');
const SMTP_PASS = Deno.env.get('SMTP_PASS');

if (!SMTP_HOST || !SMTP_PASS || !SMTP_USER || !SMTP_PORT) {
  throw new Error('.env variables are not defined');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_PORT === '465',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendResetPasswordLink = async (
  userEmail: string,
  link: string
) => {
  try {
    const html = `<p>Click <a href="${link}">here</a> to reset your password.</p>`;
    const text = `Click the following link to reset your password: ${link}`;

    const info = await transporter.sendMail({
      from: `"Cloud Password Reset" ${SMTP_USER}`,
      to: userEmail,
      subject: 'Password Reset',
      html,
      text,
    });

    return info;
  } catch (err) {
    throw new AppError('Error sending email', 500);
  }
};
export const sendEmailConfirmationLink = async (
  userEmail: string,
  link: string
) => {
  try {
    const html = `<p>Click <a href="${link}">here</a> to confirm your email address.</p>`;
    const text = `Click the following link to confirm your email address: ${link}`;

    const info = await transporter.sendMail({
      from: `"Cloud Email Confirmation" ${SMTP_USER}`,
      to: userEmail,
      subject: 'Email Confirmation',
      html,
      text,
    });

    return info;
  } catch (err) {
    throw new AppError('Error sending email', 500);
  }
};