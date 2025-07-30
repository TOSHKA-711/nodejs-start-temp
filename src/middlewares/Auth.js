import jwt from "jsonwebtoken";
import { userModel } from "../../DB/models/userModel.js";

export const isAuth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        return next(new Error("Please login first", { cause: 401 }));
      }

      const token = authorization.split(" ")[1];
      if (!token) {
        return next(new Error("Token missing", { cause: 401 }));
      }

      // Verify token
      const decodedData = jwt.verify(token, process.env.TOKEN_KEY);

      // Check user existence
      const userCheck = await userModel
        .findById(decodedData.id)
        .select("email username role");

      if (!userCheck) {
        return next(new Error("User not found!", { cause: 404 }));
      }

      // Attach user data to request (without password)
      req.userData = userCheck;
      next();
    } catch (error) {
      return next(new Error("Invalid or expired token", { cause: 401 }));
    }
  };
};
