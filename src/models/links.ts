import mongoose, { InferSchemaType } from "mongoose";


// Define the Link schema
const LinkSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     name: { type: String, required: true },
     url: { type: String, required: true }
   });
   
   // Create and export the Link model
   const Link = mongoose.model('Link', LinkSchema);
   export default Link;