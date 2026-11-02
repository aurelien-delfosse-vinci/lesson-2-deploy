import { Router, type Request, type Response } from "express";
import type { AuthResponse} from "../types/auths.ts"
import {authResponseFromUser, parseLoginInput, parseRegisterInput } from "../types/auths.ts";
import { AuthService } from "../services/auths.service.ts";

const authRouter = Router();

// REGISTER
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const input = parseRegisterInput(req.body);

    if (input === false) {
      return res.status(400).json({
        error: "Invalid registration details",
      });
    }

    const user = await AuthService.register(input);
    const authResponse: AuthResponse = authResponseFromUser(user);

    return res.status(201).json(authResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    return res.status(409).json({ error: message });
  }
});

// LOGIN
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const input = parseLoginInput(req.body);

    if (input === false) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = await AuthService.login(input);
    const authResponse: AuthResponse = authResponseFromUser(user);

    return res.status(200).json(authResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    return res.status(401).json({ error: message });
  }
});

export default authRouter;