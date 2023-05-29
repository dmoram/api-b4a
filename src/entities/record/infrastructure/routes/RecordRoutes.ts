import { Router } from "express";
import {
  createRecord,
  getRecords,
  getRecordImage,
  updateLikes,
  getRecordCount,
  deleteRecord,
} from "../../application/controllers/RecordController";
import multer from "multer";

const upload = multer({ dest: "uploads/records" });

const router = Router();

router.post("/", upload.single("image"), createRecord);

router.get("/", getRecords);

router.get("/:id", getRecordImage);

router.put("/likes", updateLikes);

router.get("/count/:user_id", getRecordCount);

router.delete("/:record_id", deleteRecord);

export default router;
