import { db } from "../src/prisma/db.ts";


export class CategoriesService {
  public static async getCategories() {
    const categories = await db.orm.public.Category.all();

    return categories.map((category) => ({
      id: category.id.toString(),
      name: category.name,
      colour: category.colour,
    }));
  }
}