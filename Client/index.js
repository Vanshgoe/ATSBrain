
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/analyze"
    : "https://atsbrain.onrender.com/analyze";

/* INPUTS */

const fileInput =
  document.getElementById(
    "ats_resume_file"
  );

const fileLabel =
  document.getElementById(
    "fileLabel"
  );

const resumeTextEl =
  document.getElementById(
    "ats_resume_text"
  );

const jobDesc =
  document.getElementById(
    "ats_job_desc"
  );

const checkBtn =
  document.querySelector(
    ".check-btn"
  );

const resetBtn =
  document.querySelector(
    ".reset-btn"
  );

/* MODAL */

const modal =
  document.getElementById(
    "modal"
  );

const closeBtn =
  document.getElementById(
    "closeBtn"
  );

/* RESULT ELEMENTS */

const scoreEl =
  document.getElementById(
    "score"
  );

const feedbackEl =
  document.getElementById(
    "feedback"
  );

const keywordsEl =
  document.getElementById(
    "keywords"
  );

const strengthsEl =
  document.getElementById(
    "strengths"
  );

const improvementsEl =
  document.getElementById(
    "improvements"
  );

/* SECTION BARS*/

const formattingBar =
  document.getElementById(
    "formattingBar"
  );

const keywordsBar =
  document.getElementById(
    "keywordsBar"
  );

const experienceBar =
  document.getElementById(
    "experienceBar"
  );

const skillsBar =
  document.getElementById(
    "skillsBar"
  );

/*  SECTION SCORES */

const formattingScore =
  document.getElementById(
    "formattingScore"
  );

const keywordsScore =
  document.getElementById(
    "keywordsScore"
  );

const experienceScore =
  document.getElementById(
    "experienceScore"
  );

const skillsScore =
  document.getElementById(
    "skillsScore"
  );

/* PROGRESS RING */

const progressRing =
  document.querySelector(
    ".progress-ring"
  );

/*  SHOW FILE NAME */

fileInput.addEventListener(
  "change",
  () => {

    if (
      fileInput.files.length > 0
    ) {

      fileLabel.innerText =
        fileInput.files[0].name;

    } else {

      fileLabel.innerText =
        "Choose File";
    }
  }
);

/* OPEN MODAL*/

function openModal() {

  modal.style.display =
    "flex";
}

/* CLOSE MODAL */

function closeModal() {

  modal.style.display =
    "none";
}

/* SCORE CIRCLE */

function animateScoreCircle(
  score
) {

  const radius =
    progressRing.r.baseVal.value;

  const circumference =
    2 * Math.PI * radius;

  progressRing.style.strokeDasharray =
    circumference;

  const offset =
    circumference -
    (score / 100) *
    circumference;

  progressRing.style.strokeDashoffset =
    offset;
}

/* PROGRESS BARS */

function setProgress(
  bar,
  label,
  value
) {

  bar.style.width =
    `${value}%`;

  label.innerText =
    `${value}/100`;
}

/* GRADE */

function getGrade(score) {

  if (score >= 90) {
    return "A+";
  }

  if (score >= 80) {
    return "A";
  }

  if (score >= 70) {
    return "B";
  }

  if (score >= 60) {
    return "C";
  }

  return "D";
}

/* CLOSE BUTTON */

closeBtn.addEventListener(
  "click",
  closeModal
);

/* RESET */

resetBtn.addEventListener(
  "click",
  () => {

    fileInput.value = "";

    fileLabel.innerText =
      "Choose File";

    resumeTextEl.value = "";

    jobDesc.value = "";

    scoreEl.innerText = "0";

    feedbackEl.innerText = "";

    keywordsEl.innerHTML = "";

    strengthsEl.innerHTML = "";

    improvementsEl.innerHTML = "";

    /* RESET BARS */

    setProgress(
      formattingBar,
      formattingScore,
      0
    );

    setProgress(
      keywordsBar,
      keywordsScore,
      0
    );

    setProgress(
      experienceBar,
      experienceScore,
      0
    );

    setProgress(
      skillsBar,
      skillsScore,
      0
    );

    /* RESET CIRCLE */

    animateScoreCircle(0);

    /* RESET GRADE */

    document.querySelector(
      ".grade"
    ).innerText =
      "Grade: -";

    closeModal();
  }
);

/* ANALYZE RESUME */

checkBtn.addEventListener(
  "click",
  async () => {

    const file =
      fileInput.files[0];

    const resumeText =
      resumeTextEl.value;

    const jd =
      jobDesc.value;

    /* VALIDATION */

    if (
      !file &&
      !resumeText
    ) {

      alert(
        "Upload resume or paste text"
      );

      return;
    }

    if (!jd) {

      alert(
        "Job description required"
      );

      return;
    }

    try {

      /* LOADING */

      checkBtn.innerText =
        "Analyzing...";

      checkBtn.disabled =
        true;

      const formData =
        new FormData();

      /* FILE */

      if (file) {

        formData.append(
          "resume",
          file
        );
      }

      /* RESUME TEXT */

      formData.append(
        "resumeText",
        resumeText
      );

      /* JOB DESCRIPTION */

      formData.append(
        "jobDescription",
        jd
      );

      /* API CALL */

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      /* API ERROR */

      if (!data.success) {

        alert(
          data.error ||
          "Analysis failed"
        );

        return;
      }

      const analysis =
        data.analysis;

      /* FINAL SCORE */

      const finalScore =
        analysis.score ?? 0;

      scoreEl.innerText =
        finalScore;

      animateScoreCircle(
        finalScore
      );

      /* GRADE */

      document.querySelector(
        ".grade"
      ).innerText =
        `Grade: ${getGrade(
          finalScore
        )}`;

      /* SUMMARY */

      feedbackEl.innerText =
        analysis.summary ||
        "Analysis completed successfully.";

      /* SECTION SCORES */

      const formatting =
        analysis.sectionScores
          ?.formatting
            ?? finalScore;

      const keywords =
        analysis.sectionScores
          ?.keywords
            ?? finalScore;

      const experience =
        analysis.sectionScores
          ?.experience
            ?? finalScore;

      const skills =
        analysis.sectionScores
          ?.skills
            ?? finalScore;

      /*  ANIMATE PROGRESS */

      setTimeout(() => {

        setProgress(
          formattingBar,
          formattingScore,
          formatting
        );

        setProgress(
          keywordsBar,
          keywordsScore,
          keywords
        );

        setProgress(
          experienceBar,
          experienceScore,
          experience
        );

        setProgress(
          skillsBar,
          skillsScore,
          skills
        );

      }, 100);

      /* MISSING KEYWORDS */

      keywordsEl.innerHTML =
        Array.isArray(
          analysis.missingKeywords
        )
          ? analysis.missingKeywords
              .map(
                item =>
                  `<li>${item}</li>`
              )
              .join("")
          : "";

      /* STRENGTHS */

      strengthsEl.innerHTML =
        Array.isArray(
          analysis.strengths
        )
          ? analysis.strengths
              .map(
                item =>
                  `<li>${item}</li>`
              )
              .join("")
          : "";

      /*  IMPROVEMENTS*/

      improvementsEl.innerHTML =
        Array.isArray(
          analysis.improvements
        )
          ? analysis.improvements
              .map(
                item =>
                  `<li>${item}</li>`
              )
              .join("")
          : "";

      /* OPEN MODAL*/

      openModal();

    } catch (err) {

      console.error(err);

      alert(
        "Something went wrong"
      );

    } finally {

      checkBtn.innerText =
        "Check ATS Score";

      checkBtn.disabled =
        false;
    }
  }
);