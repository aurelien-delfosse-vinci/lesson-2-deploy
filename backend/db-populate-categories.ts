import "dotenv/config";
import { db } from "./src/prisma/db.ts";

const categories = [
  { name: "Food", colour: "#4CAF50" },
  { name: "Transport", colour: "#2196F3" },
  { name: "Entertainment", colour: "#9C27B0" },
  { name: "Shopping", colour: "#FF9800" },
];

async function main() {
  for (const category of categories) {
    const existingCategory = await db.orm.public.Category.first({
      name: category.name,
    });

    if (!existingCategory) {
      await db.orm.public.Category.create(category);
      console.log(`Category created: ${category.name}`);
    } else {
      console.log(`Category already exists: ${category.name}`);
    }
  }

  console.log("Category population completed.");
}

main().catch((error) => {
  console.error("Category population failed:", error);
  process.exitCode = 1;
});