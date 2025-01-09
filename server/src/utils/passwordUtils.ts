import { pbkdf2, randomBytes } from 'node:crypto';
import { AppError } from "../errors/AppError.ts";

/**
 * Hashes a password using the PBKDF2 algorithm with a randomly generated salt.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password in the format `derivedKey.salt`.
 *
 * The hashing process involves:
 * - Generating a 16-byte salt.
 * - Using 200,000 iterations.
 * - Producing a 64-byte key.
 * - Using the SHA-512 digest algorithm.
 *
 * If an error occurs during the hashing process, the promise is rejected with the error.
 */
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

/**
 * Verifies if the provided password matches the hashed password.
 *
 * @param password - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against, in the format `key.salt`.
 * @returns A promise that resolves to `true` if the password matches, otherwise rejects with an error.
 * @throws {AppError} If the password does not match the hashed password.
 */
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
