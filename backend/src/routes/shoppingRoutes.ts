
import express from "express";
import { addUser, login, getProducts } from "../controllers/shoppingController";

const router = express.Router();

router.post("/api/shopping/username", addUser);
router.post("/api/shopping/login", login);
router.get("/api/shopping", getProducts);


export default router;
