import { Router } from "express";
import {
  createPost,
  getPosts,
  updateLikes,
  getPostImage,
  getPostCount,
  deletePost,
} from "../../application/controllers/postController";
import { check } from "express-validator";
import multer from "multer";

const upload = multer({ dest: "uploads/posts/" });

const router = Router();

router.post("/", upload.single("image"), createPost);

router.get("/", getPosts);

router.put("/likes", updateLikes);

router.get("/:id", getPostImage);

router.get("/count/:user_id", getPostCount);

router.delete("/:post_id", deletePost);

export default router;
