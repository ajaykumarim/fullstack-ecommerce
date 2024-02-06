
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
const JWTPRIVATEKEY = "72e7b52a5f8c4a9e8d24a1044b0a3d4d9e31257a1e6a58e2a76b2dc00e5a1a27";

const authenticationToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.cookies['accessToken'];

  if (!req.cookies || !req.cookies["accessToken"]) {
    return res.status(401).json({ message: "unauthorized" });
  }

  const token = req.cookies["accessToken"];

  jwt.verify(token, JWTPRIVATEKEY, (err: any) => {
    if (err) {
      return res.status(401).json({ message: "unauthorized" });
    }
    next();
  });
};

export default authenticationToken;
