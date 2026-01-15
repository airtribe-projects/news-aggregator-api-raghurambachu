import { NextFunction, Response, Request } from "express";
import { IUserDocument } from "../types";
import jwt from "jsonwebtoken";
import User from "../model/User";

export interface AuthRequest extends Request {
  user: IUserDocument;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_secret"
    ) as { id: string };
    req.user = (await User.findById(decoded.id)) as IUserDocument;
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists." });
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token is invalid or expired" });
  }
};
