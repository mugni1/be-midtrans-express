import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { LoginPayload, loginValidate, RegisterPayload, registerValidate } from "../validations/auth.validation.js";
import { countUserWithEmailService, countUserWithPhoneService, getUserByEmailService, getUserByIdService, registerService } from "../services/auth.service.js";
import { comparePassword, hashedPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import "dotenv/config";

export const register = async (req: Request, res: Response) => {
  const body = req.body as RegisterPayload;
  const { error, success, data } = registerValidate.safeParse(body);

  if (!success) {
    const errors = error.issues.map((issue) => ({ field: issue.path.join("_"), message: issue.message }));
    return response({ res, status: 400, message: "Invalid request", errors });
  }
  data.password = hashedPassword(data.password);

  try {
    const existingUserWithEmail = await countUserWithEmailService(data.email);
    const existingUserWithPhone = await countUserWithPhoneService(data.phone);
    if (existingUserWithEmail > 0 || existingUserWithPhone > 0) {
      return response({ res, status: 400, message: "Email or phone already exists" });
    }

    const result = await registerService(data);
    if (!result) {
      return response({ res, status: 400, message: "Failed to register user" });
    }

    response({ res, status: 201, message: "User registered successfully", data: { ...result, password: null } });
  } catch (errors: unknown) {
    response({ res, status: 500, message: "Internal Server Error", errors });
  }
}

export const login = async (req: Request, res: Response) => {
  const body = req.body as LoginPayload;
  const { error, success, data } = loginValidate.safeParse(body);

  if (!success) {
    const errors = error.issues.map((issue) => ({ field: issue.path.join("_"), message: issue.message }));
    return response({ res, status: 400, message: "Invalid request", errors });
  }

  try {
    const user = await getUserByEmailService(data.email);
    if (!user) {
      return response({ res, status: 400, message: "Email or password is incorrect" });
    }

    const isPasswordValid = await comparePassword(data.password, user.password as string);
    if (!isPasswordValid) {
      return response({ res, status: 401, message: "Email or password is incorrect" });
    }

    const token = generateToken({ id: user.id, name: user.name, role: user.role });
    user.password = null;
    response({ res, status: 200, message: "Login successfully", data: { token, user } });
  } catch (errors: unknown) {
    response({ res, status: 500, message: "Internal Server Error", errors });
  }
}

export const me = async (req: Request, res: Response) => {
  const id = req.userId as string;
  try {
    const user = await getUserByIdService(id);
    if (!user) {
      return response({ res, status: 404, message: "User not found" });
    }
    user.password = null;
    
    response({ res, status: 200, message: "Get user successfully", data: user });
  } catch (errors: unknown) {
    response({ res, status: 500, message: "Internal Server Error", errors });
  }
}
