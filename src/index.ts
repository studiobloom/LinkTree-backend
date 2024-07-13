import express, { Express, Request, Response } from 'express';
import "dotenv/config";

import cors from "cors";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import MyLinksRoute from './routes/MyLinksRoute';
import { v2 as cloudinary } from "cloudinary";
import bodyParser from 'body-parser';

//evn variable 


mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"));


  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});




app.use("/api/my/user", myUserRoute)

app.use("/api/my-links", MyLinksRoute)


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});