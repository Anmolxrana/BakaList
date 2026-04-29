import { Request, Response } from "express";
import {
  comparehashedString,
  hashedValues,
} from "../lib/utils";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

/**
 * REGISTER
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken!" });
    }

    const hashedPassword = await hashedValues(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      verified: true, // ✅ disable email verification
    });

    return res.status(201).json({
      message: "User registered successfully!",
      userId: user._id,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * LOGIN
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    const user = await User.findOne({ email });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // ❌ REMOVE verification block completely
    // if (!user.verified) { ... }

    const isMatch = await comparehashedString(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing!");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("BakaList_auth", token, {
      httpOnly: true,
      secure: false, // 🔥 IMPORTANT for localhost
      sameSite: "lax",
      maxAge: 86400000,
    });

    return res.status(200).json({
      message: "Logged in successfully",
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * LOGOUT
 */
export const logout = async (_req: Request, res: Response) => {
  try {
    res.cookie("BakaList_auth", "", {
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
