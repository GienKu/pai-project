import * as v from 'valibot';

export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

export const RegisterSchema = v.object({
  username: v.pipe(v.string(), v.minLength(3)),
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

export const ResetPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

export const NewPasswordSchema = v.object({
  password: v.pipe(v.string(), v.minLength(8)),
});

export const UpdateUserSchema = v.object({
  username: v.optional(v.pipe(v.string(), v.minLength(3))),
  email: v.optional(v.pipe(v.string(), v.email())),
  role: v.optional(v.number()),
  storageLimit: v.optional(v.number()),
  maxUploadSize: v.optional(v.number()),
  isBlocked: v.optional(v.boolean()),
});

// Regex for 24-character hex string (MongoDB ObjectId format)

// Schema that allows either 'root' or a valid MongoDB-like ObjectId
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

export const ObjectIdSchema = v.pipe(
  v.string(),
  v.regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid 24-character hex string')
);

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
