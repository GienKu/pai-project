import { pbkdf2, randomBytes } from 'node:crypto';
import { AppError } from "../errors/AppError.ts";

export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex'); // Generate a 16-byte salt
    const iter = 200000; // Number of iterations
    const keylen = 64; // Length of the key
    const digest = 'sha512'; // Digest algorithm

    pbkdf2(password, salt, iter, keylen, digest, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(`${derivedKey.toString('hex')}.${salt}`);
      }
    });
  });
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [key, salt] = hashedPassword.split('.');

    const iter = 200000; // Number of iterations
    const keylen = 64; // Length of the key
    const digest = 'sha512'; // Digest algorithm

    pbkdf2(password, salt, iter, keylen, digest, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        if (key !== derivedKey.toString('hex')) {
          reject(new AppError('Wrong credentials'));
        }
        resolve(key === derivedKey.toString('hex'));
      }
    });
  });
};
