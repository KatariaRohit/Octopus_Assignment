import express from "express";
import { addNewsItem } from "../controllers/news.controller";

import { addItemValidation, CheckValidation } from "../utils/validate";

const router = express.Router();

router.post("/add-item", addItemValidation, CheckValidation, addNewsItem);

export default router;
