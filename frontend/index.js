document.addEventListener("DOMContentLoaded", () => {

    const uploadBtn = document.querySelector(".upload-btn");

    const fileInput = document.querySelector("#ats_resume_file");

    uploadBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {

        const file = e.target.files[0];

        if (file) {
            uploadBtn.innerText = file.name;
        }

    });

});