import { db } from "../src/prisma/db.ts";
import type { User} from "../types/user.ts"
import { userFromDBO } from "../types/user.ts";


export class UsersService {
  public static async getUsers() {
    const users = await db.orm.public.User.all();

    return users.map((user) => ({
      id: user.id.toString(),
      name: user.name,
    }));
  }

  static async getById(id: number): Promise<User | null> {
  const userDbo = await db.orm.public.User
    .where({ id })
    .first();

  if (!userDbo) {
    return null;
  }

  return userFromDBO(userDbo);
}
}