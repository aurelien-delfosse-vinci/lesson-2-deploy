import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userFromDBO, type User } from "../types/user.ts";
import { JWT_SECRET} from "../types/auths.ts";
import type {LoginInput, RegisterInput } from "../types/auths.ts";
import { db } from "../src/prisma/db.ts";

const SALT_ROUNDS = 10;

export class AuthService {
  static async register(input: RegisterInput): Promise<User> {
    // Check if user already exists
    const existingUser = await db.orm.public.User
      .where({ email: input.email })
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(
      input.password,
      SALT_ROUNDS
    );

    // Create user
    const userDbo = await db.orm.public.User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return userFromDBO(userDbo);
  }

  static async login(input: LoginInput): Promise<User> {
    // 1. Find the user by email
    const userDbo = await db.orm.public.User
      .where({ email: input.email })
      .first();

    // 2. Check whether the user exists
    if (!userDbo) {
      throw new Error("Invalid email or password");
    }

    // 3. Compare the password with the stored hash
    const passwordMatches = await bcrypt.compare(
      input.password,
      userDbo.passwordHash
    );

    // 4. Check whether the password is correct
    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    // 5. Return the user without exposing the password hash
    return userFromDBO(userDbo);
  }

  static verifyToken(token: string): { userId: number; email: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
      };
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}