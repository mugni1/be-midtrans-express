import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { RegisterPayload, registerValidate } from "../validations/auth.validation.js";
import { countUserWithEmailService, countUserWithPhoneService, registerService } from "../services/auth.service.js";
import { hashedPassword } from "../utils/bcrypt.js";

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