document.addEventListener("DOMContentLoaded", () => {
    addCourse(); // Add initial course input fields
});

function addCourse() {
    const courseContainer = document.getElementById("course-container");
    let courseDiv = document.createElement("div");
    courseDiv.className = "course";
    courseDiv.innerHTML = `
<input type="text" placeholder="Course Name" class="course-name" oninput="this.value = this.value.toUpperCase()">
        <select class="course-grade">
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="B-">B-</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="C-">C-</option>
            <option value="D+">D+</option>
            <option value="D">D</option>
            <option value="F">F</option>
        </select>
        <input type="number" placeholder="Credits" class="course-credits" min="0">
        <button type="button" onclick="removeCourse(this.parentElement)" class="remove-course">&#x2715;</button>
    `;
    courseContainer.appendChild(courseDiv);

    // Add the keypress event to the newly added course credit input
    courseDiv.querySelector(".course-credits").addEventListener("keypress", handleEnterKeyPress);
}

function calculateGPA() {
    const courses = document.querySelectorAll(".course");
    let totalCredits = 0;
    let totalGradePoints = 0;
    let convertGPA = {
        "A+": 4.0,
        A: 4.0,
        "A-": 3.7,
        "B+": 3.3,
        B: 3.0,
        "B-": 2.7,
        "C+": 2.3,
        C: 2.0,
        "C-": 1.7,
        "D+": 1.3,
        D: 1.0,
        F: 0.0,
    };

    courses.forEach((course) => {
        let grade = course.querySelector(".course-grade").value.toUpperCase();
        let credits = parseInt(course.querySelector(".course-credits").value);
        let gradePoints = convertGPA[grade] * credits;

        if (!isNaN(gradePoints)) {
            totalCredits += credits;
            totalGradePoints += gradePoints;
        }
    });

    let semesterGpa = (totalGradePoints / totalCredits).toFixed(2);
    document.getElementById("gpa-output").textContent = `Semester GPA: ${semesterGpa}`;
}

// Function to calculate the overall GPA when the button is clicked
function calculateOverallGPA() {
    // Get the semester GPA from the previous calculation
    const semesterGPA = parseFloat(document.getElementById("gpa-output").textContent.split(": ")[1]);

    // Get values from the overall GPA inputs
    const currentOverallGPA = parseFloat(document.getElementById("current-overall-gpa").value);
    const totalCreditsEarned = parseFloat(document.getElementById("total-credits-earned").value);

    // Get the total credits including this semester
    const semesterCredits = Array.from(document.querySelectorAll(".course-credits")).reduce(
        (acc, input) => acc + parseFloat(input.value || 0),
        0,
    );

    if (!isNaN(currentOverallGPA) && !isNaN(totalCreditsEarned) && !isNaN(semesterGPA)) {
        const newOverallGPA = calculateUpdatedOverallGPA(
            currentOverallGPA,
            totalCreditsEarned,
            semesterGPA,
            semesterCredits,
        );
        document.getElementById("overall-gpa-output").textContent = `Overall GPA: ${newOverallGPA}`; // Changed line
    } else {
        alert("Please fill in all fields with valid numbers.");
    }
}

// Function that actually calculates the updated overall GPA
function calculateUpdatedOverallGPA(currentGPA, totalCredits, semesterGPA, semesterCredits) {
    const updatedOverallGPA =
        (currentGPA * totalCredits + semesterGPA * semesterCredits) / (totalCredits + semesterCredits);
    return updatedOverallGPA.toFixed(2);
}

// Updated function to handle Enter keypress
function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // prevent the default action
        const currentInput = event.target;
        const parent = currentInput.closest(".course");
        const nextParent = parent.nextElementSibling;

        if (currentInput.classList.contains("course-credits")) {
            if (nextParent) {
                // Focus the next course name input
                const nextCourseInput = nextParent.querySelector(".course-name");
                nextCourseInput && nextCourseInput.focus();
            } else {
                // If this is the last course, add a new course
                addCourse();
            }
        }
    }
}

// Add event listener for the Enter keypress
document.addEventListener("keypress", handleEnterKeyPress);

function removeCourse(courseElement) {
    document.getElementById("course-container").removeChild(courseElement);
}
