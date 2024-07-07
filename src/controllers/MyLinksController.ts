// src/controllers/MyLinksController.ts
import { Request, Response } from "express";
import Link from '../models/links';
import User from '../models/user';

const createLinks = async (req: Request, res: Response) => {
  try {
    const { name, url } = req.body;
    const auth0Id = req.auth?.payload.sub; // Extracting user ID from JWT token

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newLink = new Link({ user: user._id, name, url });
    await newLink.save();

    // Add the link to the user's links array
    user.links.push(newLink._id);
    await user.save();

    res.status(201).json(newLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating link" });
  }
};

const getLinks = async (req: Request, res: Response) => {
  try {
    const auth0Id = req.auth?.payload.sub; // Extracting user ID from JWT token

    const user = await User.findOne({ auth0Id }).populate('links');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching links" });
  }
};

// New function to get links by username
const getLinksByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ name: username }).populate('links');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching links" });
  }
};


const updateLink = async (req: Request, res: Response) => {
     try {
       const { linkId, name, url } = req.body;
       const auth0Id = req.auth?.payload.sub;
   
       const user = await User.findOne({ auth0Id });
       if (!user) {
         return res.status(404).json({ message: "User not found" });
       }
   
       const link = await Link.findOneAndUpdate(
         { _id: linkId, user: user._id },
         { name, url },
         { new: true }
       );
   
       if (!link) {
         return res.status(404).json({ message: "Link not found" });
       }
   
       res.json(link);
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Error updating link" });
     }
   };


   const deleteLink = async (req: Request, res: Response) => {
     try {
       const { linkId } = req.params;
       const auth0Id = req.auth?.payload.sub;
   
       const user = await User.findOne({ auth0Id });
       if (!user) {
         return res.status(404).json({ message: "User not found" });
       }
   
       const link = await Link.findById(linkId);
       if (!link) {
         return res.status(404).json({ message: "Link not found" });
       }
   
       if (link.user.toString() !== user._id.toString()) {
         return res.status(403).json({ message: "You do not have permission to delete this link" });
       }
   
       // Changed from findByIdAndRemove to findByIdAndDelete
       await Link.findByIdAndDelete(linkId);
       user.links = user.links.filter(link => link.toString() !== linkId);
       await user.save();
   
       res.status(200).json({ message: "Link deleted successfully" });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Error deleting link" });
     }
   };

export default {
     deleteLink,
     updateLink,
  createLinks,
  getLinks,
  getLinksByUsername
};
