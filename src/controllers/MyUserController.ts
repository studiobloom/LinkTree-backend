

import { Request, Response } from "express";
import cloudinary from "cloudinary";


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

  console.log("Received request body:", req.body);
  try {
    const { username, bio } = req.body;
    const { file } = req; // Multer middleware will populate this if there's a file
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the username already exists
    if (username) {
      const existingUser = await User.findOne({ name: username.trim() });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Username already exists" });
      }
      user.name = username.trim();
    }

    // Update bio if provided
    if (bio !== undefined) {
      // Validate bio
      if (bio.length > 160) {
        return res.status(400).json({ message: "Bio must be 160 characters or less" });
      }
      if (!/^[a-zA-Z0-9 ,.!?'"-]*$/.test(bio)) {
        return res.status(400).json({ message: "Bio contains invalid characters" });
      }
      user.bio = bio.trim();
    }

    // Upload image to Cloudinary if there's a file
    if (file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      user.avater = imageUrl;
    }

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


const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};


const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Only send public information
    const publicUserInfo = {
      name: user.name,
      avater: user.avater,
      bio: user.bio
    };
    res.json(publicUserInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  createCurrentUser,
  getCurrentUser,
  updateCurrentUser,
  getUserByUsername  // Add this new method
};