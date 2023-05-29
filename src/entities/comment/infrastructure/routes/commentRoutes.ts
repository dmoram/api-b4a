import { Router } from "express";
import {
  createComment,
  getComments,
  updateLikes,
} from "../../application/controllers/commentController";

const router = Router();

router.post("/", createComment);

router.get("/:post_id", getComments);

router.put("/likes", updateLikes);

export default router;
