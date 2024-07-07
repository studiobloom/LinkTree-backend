

import { Request, Response } from "express";


import User from '../models/user'
import { error } from "console";

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};


const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const username = req.body.username.trim();
    console.log('Received username:', username);
    console.log('User ID:', req.userId);
   
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   
    // Check if the username already exists
    const existingUser = await User.findOne({ name: username });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: "Username already exists" });
    }
   
    // Update the user
    user.name = username;
    await user.save();
    res.send(user);
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    
    if (error instanceof Error) {
      if ('code' in error && error.code === 11000) {
        // This is a MongoDB duplicate key error
        return res.status(400).json({ message: "Username already exists" });
      }
      res.status(500).json({ message: "Error updating user", error: error.message });
    } else {
      // If it's not an Error object, send a generic error message
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
export default {
 
  createCurrentUser,
  getCurrentUser,
  updateCurrentUser
};