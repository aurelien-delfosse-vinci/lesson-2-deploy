import express from "express";
import { CategoriesService } from "../services/categories.service.ts";

const categoriesRouter = express.Router();

categoriesRouter.get("/", async (_req, res) => {
  try {
    const categories = await CategoriesService.getCategories();
    return res.json(categories);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default categoriesRouter;