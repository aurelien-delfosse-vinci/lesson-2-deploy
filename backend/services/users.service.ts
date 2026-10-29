import { db } from "../src/prisma/db.ts";


export class UsersService {
  public static async getUsers() {
    const users = await db.orm.public.User.all();

    return users.map((user) => ({
      id: user.id.toString(),
      name: user.name,
    }));
  }
}