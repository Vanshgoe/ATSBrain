const fs = require("fs");

const pdfParse =require("pdf-parse");

const mammoth =
  require("mammoth");

async function extractResumeText(file) {

  let resumeText = "";

  if (
    file.mimetype ===
    "application/pdf"
  ) {

    const dataBuffer =
      fs.readFileSync(file.path);

    const pdfData =
      await pdfParse(dataBuffer);

    resumeText =
      pdfData.text;
  }

  else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {

    const result =
      await mammoth.extractRawText({
        path: file.path,
      });

    resumeText =
      result.value;
  }

  else if (
    file.mimetype ===
    "text/plain"
  ) {

    resumeText =
      fs.readFileSync(
        file.path,
        "utf-8"
      );
  }

  else {

    throw new Error(
      "Unsupported file type"
    );
  }

  return resumeText
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  extractResumeText,
};