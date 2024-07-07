import express, { Express, Request, Response } from 'express';
import "dotenv/config";

import cors from "cors";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import MyLinksRoute from './routes/MyLinksRoute';


//evn variable 


mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"));

const app: Express = express();
const port = process.env.PORT;


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