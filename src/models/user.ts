import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avater: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    unique: true,
    sparse: true // This allows null values
  },
  bio: {
    type: String,
    maxlength: 160, // Keep this as a basic safeguard
    trim: true,     // Automatically trim whitespace
  },
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }],
});

const User = mongoose.model("User", userSchema);
export default User;