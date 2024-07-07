// src/routes/MyLinksRoute.ts
import express from "express";
import MyLinksController from "../controllers/MyLinksController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.post("/",jwtCheck, MyLinksController.createLinks);

router.get("/",jwtCheck, jwtParse, MyLinksController.getLinks);

router.put("/", jwtCheck, jwtParse, MyLinksController.updateLink);


router.get("/:username", MyLinksController.getLinksByUsername); // 

router.delete("/:linkId", jwtCheck, jwtParse, MyLinksController.deleteLink); // Add this line

export default router;
