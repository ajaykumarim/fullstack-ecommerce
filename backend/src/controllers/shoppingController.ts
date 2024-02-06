
import { Request, Response } from "express";
import { Product, User, Favourites } from "../models";


const JWTPRIVATEKEY = "72e7b52a5f8c4a9e8d24a1044b0a3d4d9e31257a1e6a58e2a76b2dc00e5a1a27"

const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

export const addUser = async (req: Request, res: Response) => {
    try {
        const { email, user, pass } = req.body;
        const isAdmin = false;
    
        const existingEmail = await User.findOne({ where: { email } });
        const existingUser = await User.findOne({ where: { user } });
    
        if (existingEmail) {
          return res.status(400).json({ message: 'Email already exists' });
        }
    
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        const createdUser = await User.create({ email, user, pass, isAdmin });
    
        res.status(201).json({ message: 'User added successfully', user: createdUser });
      } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, user, pass } = req.body;
        const usersData: any = await User.findOne({ where: { email } });
        const isAdmin = usersData.isAdmin;
    
        if (user === usersData.user && pass === usersData.pass) {
          const accessToken = jwt.sign(usersData.toJSON(), JWTPRIVATEKEY, { expiresIn: "1d" });
          res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000, path: '/', secure: true });
          res.json({ message: 'success', usersData, accessToken, isAdmin });
        } else {
          res.status(400).json({ message: 'Incorrect credentials' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll();
        res.json({ message: 'success', products });
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};


