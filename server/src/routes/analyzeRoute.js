const express = require("express");
const multer = require("multer");
const fs = require("fs");

const {
  extractResumeText,
} = require("../services/parserService");

const {
  analyzeResume,
} = require("../services/aiService");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/analyze",
  upload.single("resume"),

  async (req, res) => {

    const file = req.file;

    try {

      const {
        jobDescription,
        resumeText,
      } = req.body;

      if (!file && !resumeText) {

        return res.status(400).json({
          error:
            "Upload resume or paste resume text",
        });
      }

      if (!jobDescription) {

        return res.status(400).json({
          error:
            "Job description required",
        });
      }

      let finalResumeText = "";

      if (file) {

        finalResumeText =
          await extractResumeText(file);

      } else {

        finalResumeText =
          resumeText;
      }

      const analysis =
        await analyzeResume(
          finalResumeText,
          jobDescription
        );

      res.json({
        success: true,
        analysis,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error:
          err.message ||
          "Server Error",
      });

    } finally {

      if (
        file?.path &&
        fs.existsSync(file.path)
      ) {

        fs.unlinkSync(file.path);
      }
    }
  }
);

module.exports = router;