import * as v from 'valibot';

/**
 * Schema for validating login credentials.
 * 
 * This schema validates the following fields:
 * - `email`: A string that must be a valid email address.
 * - `password`: A string that must be at least 8 characters long.
 */
export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

/**
 * Schema for validating user registration data.
 * 
 * This schema ensures that the following fields are present and valid:
 * - `username`: A string with a minimum length of 3 characters.
 * - `email`: A valid email address.
 * - `password`: A string with a minimum length of 8 characters.
 */
export const RegisterSchema = v.object({
  username: v.pipe(v.string(), v.minLength(3)),
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

/**
 * Schema for validating the reset password request.
 * 
 * This schema ensures that the provided email is a valid string and follows the email format.
 * 
 * @constant {Object} ResetPasswordSchema - The validation schema for reset password.
 * @property {string} email - The email address of the user requesting the password reset.
 */
export const ResetPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

/**
 * Schema for validating a new password.
 * 
 * This schema ensures that the password is a string with a minimum length of 8 characters.
 * 
 * @constant {object} NewPasswordSchema - The schema object for password validation.
 * @property {string} password - The password to be validated.
 */
export const NewPasswordSchema = v.object({
  password: v.pipe(v.string(), v.minLength(8)),
});

/**
 * Schema for updating a user.
 * 
 * @property {string} [username] - The username of the user. Must be at least 3 characters long.
 * @property {string} [email] - The email address of the user. Must be a valid email format.
 * @property {number} [role] - The role of the user. Represented as a number.
 * @property {number} [storageLimit] - The storage limit for the user. Represented as a number.
 * @property {number} [maxUploadSize] - The maximum upload size for the user. Represented as a number.
 * @property {boolean} [isBlocked] - Indicates whether the user is blocked. Represented as a boolean.
 */
export const UpdateUserSchema = v.object({
  username: v.optional(v.pipe(v.string(), v.minLength(3))),
  email: v.optional(v.pipe(v.string(), v.email())),
  role: v.optional(v.number()),
  storageLimit: v.optional(v.number()),
  maxUploadSize: v.optional(v.number()),
  isBlocked: v.optional(v.boolean()),
});


/**
 * Schema for validating file identifiers.
 * 
 * This schema allows two types of values:
 * 1. The literal string 'root'.
 * 2. A 24-character hexadecimal string.
 * 
 * The hexadecimal string must match the regular expression /^[0-9a-fA-F]{24}$/.
 * 
 * @example
 * // Valid values
 * 'root'
 * '5f8d0d55b54764421b7156c3'
 * 
 * @example
 * // Invalid values
 * 'invalid-string'
 * '123'
 * 
 * @type {v.Union}
 */
export const GetFilesSchema = v.union([
  v.literal('root'),
  v.pipe(
    v.string(),
    v.regex(
      /^[0-9a-fA-F]{24}$/,
      'Must be a valid 24-character hex string or "root"'
    )
  ),
]);

/**
 * A validation schema for MongoDB ObjectId.
 * 
 * This schema validates that the input is a string and matches the pattern
 * of a 24-character hexadecimal string, which is the format of a MongoDB ObjectId.
 * 
 * @example
 * // Valid ObjectId
 * const validId = "507f1f77bcf86cd799439011";
 * 
 * // Invalid ObjectId
 * const invalidId = "12345";
 * 
 * @remarks
 * This schema uses a regular expression to ensure the input string is exactly
 * 24 characters long and contains only hexadecimal characters (0-9, a-f, A-F).
 * 
 * @throws {ValidationError}
 * Throws a validation error if the input does not match the required format.
 */
export const ObjectIdSchema = v.pipe(
  v.string(),
  v.regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid 24-character hex string')
);

/**
 * Schema for creating a folder.
 * 
 * This schema validates the structure of the data required to create a folder.
 * 
 * - `name`: A string that must have a minimum length of 1 character.
 * - `parentId`: A union type that can either be the literal string 'root' or a valid 24-character hexadecimal string.
 * 
 * The `parentId` field uses a regular expression to ensure that the string is a valid 24-character hex string.
 */
export const CreateFolderSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  parentId: v.union([
    v.literal('root'),
    v.pipe(
      v.string(),
      v.regex(
        /^[0-9a-fA-F]{24}$/,
        'Must be a valid 24-character hex string or "root"'
      )
    ),
  ]),
});

export type LoginData = v.InferOutput<typeof LoginSchema>;
export type RegisterData = v.InferOutput<typeof RegisterSchema>;
export type ResetPasswordData = v.InferOutput<typeof ResetPasswordSchema>;
export type NewPasswordData = v.InferOutput<typeof NewPasswordSchema>;
export type UpdateUserData = v.InferOutput<typeof UpdateUserSchema>;
