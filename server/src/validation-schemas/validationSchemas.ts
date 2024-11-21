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

export type LoginData = v.InferOutput<typeof LoginSchema>;
export type RegisterData = v.InferOutput<typeof RegisterSchema>;
export type ResetPasswordData = v.InferOutput<typeof ResetPasswordSchema>;
export type NewPasswordData = v.InferOutput<typeof NewPasswordSchema>;
export type UpdateUserData = v.InferOutput<typeof UpdateUserSchema>;
