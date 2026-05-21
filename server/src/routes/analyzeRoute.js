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

/* =========================
   MULTER CONFIG
========================= */

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    if (
      !allowedMimeTypes.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Only PDF, DOCX, and TXT files are allowed"
        )
      );
    }

    cb(null, true);
  },
});

/* =========================
   ROUTE
========================= */

router.post("/analyze", (req, res) => {

  upload.single("resume")(req, res, async (err) => {

    /* =========================
       MULTER ERROR
    ========================= */

    if (err) {

      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

    const file = req.file;

    try {

      const {
        jobDescription,
        resumeText,
      } = req.body;

      /* =========================
         VALIDATION
      ========================= */

      if (!file && !resumeText) {

        return res.status(400).json({
          success: false,
          error:
            "Upload resume or paste resume text",
        });
      }

      if (!jobDescription) {

        return res.status(400).json({
          success: false,
          error:
            "Job description required",
        });
      }

      let finalResumeText = "";

      /* =========================
         EXTRACT RESUME
      ========================= */

      if (file) {

        finalResumeText =
          await extractResumeText(file);

      } else {

        finalResumeText =
          resumeText;
      }

      /* =========================
         EMPTY EXTRACTION CHECK
      ========================= */

      if (
        !finalResumeText ||
        finalResumeText.length < 50
      ) {

        return res.status(400).json({
          success: false,
          error:
            "Could not extract readable resume text",
        });
      }

      /* =========================
         AI ANALYSIS
      ========================= */

      const analysis =
        await analyzeResume(
          finalResumeText,
          jobDescription
        );

      return res.json({
        success: true,
        analysis,
      });

    } catch (err) {

      console.error({
        message: err.message,
        stack: err.stack,
      });

      return res.status(500).json({
        success: false,
        error:
          err.message ||
          "Internal Server Error",
      });

    } finally {

      /* =========================
         CLEANUP
      ========================= */

      try {

        if (
          file?.path &&
          fs.existsSync(file.path)
        ) {

          await fs.promises.unlink(
            file.path
          );
        }

      } catch (cleanupErr) {

        console.error(
          "File cleanup error:",
          cleanupErr.message
        );
      }
    }
  });
});

module.exports = router;