require("dotenv").config();

const cors = require("cors");
const express = require("express");

const analyzeRoute =
  require("./src/routes/analyzeRoute");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", analyzeRoute);

app.get("/", (req, res) => {
  res.send("Resume Analyzer API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});