import { z } from "zod";
import jwt from "jsonwebtoken";
import type { User } from "./user.ts";


export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  password: z.string().min(8).max(200),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

function parseWithSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): T | false {
  const result = schema.safeParse(data);
  return result.success ? result.data : false;
}

export function parseRegisterInput(data: unknown): RegisterInput | false {
  return parseWithSchema(registerSchema, data);
}

export function parseLoginInput(data: unknown): LoginInput | false {
  return parseWithSchema(loginSchema, data);
}

// --------------------
// JWT
// --------------------

export interface UserJWT {
  userId: number;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-do-not-use";

const TOKEN_LIFETIME = "7d";

export function authResponseFromUser(user: User): AuthResponse {
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: TOKEN_LIFETIME,
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}