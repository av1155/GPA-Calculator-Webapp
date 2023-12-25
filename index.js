// Adds a new course input group to the DOM
function addCourse(callback) {
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

    // Start with a max-height of 0
    courseDiv.style.maxHeight = "0";

    // Append the new div to the course container
    courseContainer.appendChild(courseDiv);

    // Start the animation
    setTimeout(() => {
        courseDiv.style.maxHeight = "200px"; // Animate to a greater height
    }, 10);

    // Execute the callback function immediately after appending
    if (callback) callback(courseDiv);

    // Add behavior for Enter keypress
    // Add behavior for Enter keypress to both inputs
    addEnterKeyBehavior(courseDiv.querySelector(".course-name"));
    addEnterKeyBehavior(courseDiv.querySelector(".course-credits"));
}

// Calculates and displays the semester GPA
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

    for (let course of courses) {
        let grade = course.querySelector(".course-grade").value.toUpperCase();
        let credits = parseInt(course.querySelector(".course-credits").value);
        let gradePoints = convertGPA[grade] * credits;

        if (!isNaN(gradePoints)) {
            totalCredits += credits;
            totalGradePoints += gradePoints;
        } else {
            alert("Please fill in all fields.");
            return;
        }
    }

    let semesterGpa = (totalGradePoints / totalCredits).toFixed(2);
    if (!isNaN(semesterGpa)) {
        document.getElementById("gpa-output").textContent = `Semester GPA: ${semesterGpa}`;
    }
}

// Calculates and displays the overall GPA
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

        let newTotalCreditsEarned = totalCreditsEarned + semesterCredits;

        document.getElementById("overall-gpa-output").textContent =
            `Overall GPA: ${newOverallGPA} (Total Credits: ${newTotalCreditsEarned})`;
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

// Adds behavior to Enter keypress for course credits input
function addEnterKeyBehavior(creditsInput) {
    creditsInput.addEventListener("keypress", handleEnterKeyPress);
}

// Handles Enter keypress to navigate between inputs or add new course
function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default action
        const currentInput = event.target;
        const parent = currentInput.closest(".course");

        if (currentInput.classList.contains("course-name")) {
            // If the current input is the course name, move to the course credits input
            const creditsInput = parent.querySelector(".course-credits");
            creditsInput && creditsInput.focus();
        } else if (currentInput.classList.contains("course-credits")) {
            const nextParent = parent.nextElementSibling;

            if (nextParent) {
                // Focus the next course name input if it exists
                const nextCourseInput = nextParent.querySelector(".course-name");
                nextCourseInput && nextCourseInput.focus();
            } else {
                // If this is the last course, add a new course and focus on its course name input
                addCourse((newCourseDiv) => {
                    const newCourseInput = newCourseDiv.querySelector(".course-name");
                    newCourseInput && newCourseInput.focus();
                });
            }
        } else {
            // Handle navigation for overall GPA inputs
            if (currentInput.id === "current-overall-gpa") {
                const totalCreditsInput = document.getElementById("total-credits-earned");
                totalCreditsInput && totalCreditsInput.focus();
            }
        }
    }
}

// Removes a course from the DOM with animation
function removeCourse(courseElement) {
    courseElement.classList.add("course-removing"); // Add the class to trigger the animation

    courseElement.addEventListener(
        "animationend",
        () => {
            courseElement.remove(); // Remove the element after the animation ends
        },
        { once: true },
    );
}

// Attach the Enter keypress event listener to the current overall GPA input
window.onload = function() {
    addEnterKeyBehavior(document.getElementById("current-overall-gpa"));
    // Add listeners to any existing course inputs if necessary
    document.querySelectorAll(".course-name, .course-credits").forEach(addEnterKeyBehavior);
};
