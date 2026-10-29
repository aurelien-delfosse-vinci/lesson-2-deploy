import express from "express";
import { UsersService } from "../services/users.service.ts";

const usersRouter = express.Router();

usersRouter.get("/", async (_req, res) => {
  try {
    const users = await UsersService.getUsers();
    return res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default usersRouter;