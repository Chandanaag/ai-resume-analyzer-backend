const express = require("express");
const multer = require("multer");
const {
  analyzeResume,
  rewriteResume,
} = require("../controllers/resumeController");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("resume"), analyzeResume);
router.post("/rewrite", rewriteResume);

module.exports = router;
