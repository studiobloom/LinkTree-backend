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

     avatar :{
          type:String,
          required: false,
     },
    name: {
  type: String,
  unique: true,
  sparse: true // This allows null values
},

links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }], // Array of link IDs as ObjectIds

});

const User = mongoose.model("User", userSchema);

export default User;