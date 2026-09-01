// ==========================================
// A.KOLFE SECONDARY SCHOOL
// RESULTS MANAGEMENT
// ==========================================

const STUDENT_STORAGE_KEY = "kolfeStudents";
const RESULT_STORAGE_KEY = "kolfeResults";

// ==========================================
// ELEMENTS
// ==========================================

const gradeFilter = document.getElementById("gradeFilter");
const classFilter = document.getElementById("classFilter");
const subjectFilter = document.getElementById("subjectFilter");
const examType = document.getElementById("examType");
const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("resultsTableBody");
const saveResultsBtn = document.getElementById("saveResultsBtn");

const modal = document.getElementById("markModal");
const closeModalBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const markForm = document.getElementById("markForm");
const markInput = document.getElementById("markInput");
const studentIdInput = document.getElementById("studentId");
const modalStudentName = document.getElementById("modalStudentName");
const gradePreview = document.getElementById("gradePreview");

// ==========================================
// DATA
// ==========================================

let students = [];
let results = {};

// ==========================================
// NORMALIZE GRADE
// ==========================================

function normalizeGrade(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}

// ==========================================
// GET CLASS NUMBER
// ==========================================
// Accepts:
// 1
// Class 1
// 9-1
// Grade 9 - 1
// 10-2
// etc.
// ==========================================

function getClassNumber(value) {

    let text = String(value || "")
        .trim()
        .toLowerCase();

    if (!text) {
        return "";
    }

    // Remove "class"
    text = text.replace(/^class\s*/i, "");

    // Example: "grade 9 - 1"
    text = text.replace(/^grade\s*\d+\s*-\s*/i, "");

    // Example: "9-1", "10-2", "11-3"
    // Take the number after "-"
    const dashMatch = text.match(/-(\d+)$/);

    if (dashMatch) {
        return dashMatch[1];
    }

    // If just "1", "2", etc.
    const numberMatch = text.match(/^(\d+)$/);

    if (numberMatch) {
        return numberMatch[1];
    }

    return text;
}

// ==========================================
// LOAD STUDENTS
// ==========================================

function loadStudents() {

    try {

        const saved =
            localStorage.getItem(STUDENT_STORAGE_KEY);

        if (!saved) {

            students = [];

            console.log("No students found in localStorage.");

            return;
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {

            students = [];

            console.error(
                "kolfeStudents is not an array."
            );

            return;
        }

        students = parsed.map(function(student) {

            return {

                id: String(
                    student.studentId ||
                    student.id ||
                    ""
                ).trim(),

                name: String(
                    student.name ||
                    ""
                ).trim(),

                grade: String(
                    student.grade ||
                    ""
                ).trim(),

                classNumber: String(
                    student.section ||
                    student.classNumber ||
                    ""
                ).trim(),

                gender: String(
                    student.gender ||
                    ""
                ).trim(),

                parent: String(
                    student.parent ||
                    ""
                ).trim(),

                phone: String(
                    student.phone ||
                    ""
                ).trim()

            };

        });

        console.log(
            "KSS students loaded:",
            students
        );

    }

    catch (error) {

        console.error(
            "Error loading students:",
            error
        );

        students = [];

    }

}

// ==========================================
// LOAD RESULTS
// ==========================================

function loadResults() {

    try {

        const saved =
            localStorage.getItem(RESULT_STORAGE_KEY);

        if (!saved) {

            results = {};

            return;
        }

        const parsed =
            JSON.parse(saved);

        if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
        ) {

            results = {};

            return;
        }

        results = parsed;

    }

    catch (error) {

        console.error(
            "Error loading results:",
            error
        );

        results = {};

    }

}

// ==========================================
// SAVE RESULTS
// ==========================================

function saveResultsData() {

    localStorage.setItem(
        RESULT_STORAGE_KEY,
        JSON.stringify(results)
    );

}

// ==========================================
// RESULT KEY
// ==========================================

function getResultKey(studentId) {

    return (
        gradeFilter.value +
        "_" +
        classFilter.value +
        "_" +
        subjectFilter.value +
        "_" +
        examType.value +
        "_" +
        studentId
    );

}

// ==========================================
// GET MARK
// ==========================================

function getMark(studentId) {

    const key =
        getResultKey(studentId);

    if (
        results[key] === undefined ||
        results[key] === null
    ) {

        return "";

    }

    return results[key];

}

// ==========================================
// CALCULATE GRADE
// ==========================================

function calculateGrade(mark) {

    if (
        mark === "" ||
        mark === null ||
        mark === undefined
    ) {

        return "-";

    }

    const number = Number(mark);

    if (Number.isNaN(number)) {

        return "-";

    }

    if (number >= 90) return "A+";
    if (number >= 80) return "A";
    if (number >= 70) return "B";
    if (number >= 60) return "C";
    if (number >= 50) return "D";

    return "F";

}

// ==========================================
// STATUS
// ==========================================

function getStatus(mark) {

    if (
        mark === "" ||
        mark === null ||
        mark === undefined
    ) {

        return "-";

    }

    const number = Number(mark);

    if (Number.isNaN(number)) {

        return "-";

    }

    return number >= 50
        ? "Pass"
        : "Fail";

}

// ==========================================
// GET FILTERED STUDENTS
// ==========================================

function getFilteredStudents() {

    const selectedGrade =
        normalizeGrade(
            gradeFilter.value
        );

    const selectedClass =
        getClassNumber(
            classFilter.value
        );

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    return students.filter(function(student) {

        const studentGrade =
            normalizeGrade(
                student.grade
            );

        // IMPORTANT FIX
        const studentClass =
            getClassNumber(
                student.classNumber
            );

        const gradeMatch =
            selectedGrade === "all" ||
            studentGrade === selectedGrade;

        const classMatch =
            selectedClass === "all" ||
            studentClass === selectedClass;

        const studentName =
            student.name.toLowerCase();

        const studentId =
            student.id.toLowerCase();

        const searchMatch =
            search === "" ||
            studentName.includes(search) ||
            studentId.includes(search);

        return (
            gradeMatch &&
            classMatch &&
            searchMatch
        );

    });

}

// ==========================================
// RENDER RESULTS
// ==========================================

function renderResults() {

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    const filtered =
        getFilteredStudents();

    updateClassTitle();

    // ======================================
    // NO STUDENTS
    // ======================================

    if (filtered.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="6"
                    style="
                        text-align:center;
                        padding:40px;
                    ">

                    <div style="
                        font-size:40px;
                        margin-bottom:10px;
                    ">
                        👨‍🎓
                    </div>

                    <strong>
                        No students found
                    </strong>

                    <p style="
                        margin-top:8px;
                        color:#777;
                    ">
                        No student matches
                        Grade ${escapeHTML(gradeFilter.value)}
                        and Class ${escapeHTML(
                            getClassNumber(classFilter.value)
                        )}.
                    </p>

                </td>

            </tr>

        `;

        updateStatistics();

        return;
    }

    // ======================================
    // STUDENT ROWS
    // ======================================

    filtered.forEach(function(student, index) {

        const mark =
            getMark(student.id);

        const grade =
            calculateGrade(mark);

        const status =
            getStatus(mark);

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                <div class="student-name">
                    ${escapeHTML(student.name)}
                </div>
            </td>

            <td>
                <span class="student-id">
                    ${escapeHTML(student.id)}
                </span>
            </td>

            <td>

                <input
                    type="number"
                    class="mark-input"
                    min="0"
                    max="100"
                    step="0.01"
                    value="${escapeHTML(mark)}"
                    placeholder="Enter mark"
                    data-student-id="${escapeHTML(student.id)}"
                >

            </td>

            <td>

                <span class="grade-badge">
                    ${grade}
                </span>

            </td>

            <td>

                <span class="${
                    status === "Pass"
                        ? "status-pass"
                        : status === "Fail"
                            ? "status-fail"
                            : ""
                }">

                    ${
                        status === "Pass"
                            ? "✅ Pass"
                            : status === "Fail"
                                ? "❌ Fail"
                                : "-"
                    }

                </span>

            </td>

        `;

        tableBody.appendChild(row);

    });

    attachMarkEvents();

    updateStatistics();

}

// ==========================================
// UPDATE TITLE
// ==========================================

function updateClassTitle() {

    const classTitle =
        document.getElementById("classTitle");

    if (!classTitle) {
        return;
    }

    classTitle.textContent =
        gradeFilter.value +
        " — Class " +
        getClassNumber(classFilter.value) +
        " — " +
        subjectFilter.value +
        " — " +
        examType.value;

}

// ==========================================
// MARK EVENTS
// ==========================================

function attachMarkEvents() {

    const inputs =
        tableBody.querySelectorAll(
            ".mark-input"
        );

    inputs.forEach(function(input) {

        input.addEventListener(
            "change",
            function() {

                updateMark(
                    input.dataset.studentId,
                    input.value
                );

            }
        );

        input.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    updateMark(
                        input.dataset.studentId,
                        input.value
                    );

                    input.blur();

                }

            }
        );

    });

}

// ==========================================
// UPDATE MARK
// ==========================================

function updateMark(studentId, value) {

    const key =
        getResultKey(studentId);

    if (value === "") {

        delete results[key];

        saveResultsData();

        renderResults();

        return;
    }

    const mark =
        Number(value);

    if (
        Number.isNaN(mark) ||
        mark < 0 ||
        mark > 100
    ) {

        alert(
            "Mark must be between 0 and 100."
        );

        renderResults();

        return;
    }

    results[key] = mark;

    saveResultsData();

    renderResults();

}

// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const filtered =
        getFilteredStudents();

    const marks = [];

    filtered.forEach(function(student) {

        const mark =
            getMark(student.id);

        if (
            mark !== "" &&
            mark !== null &&
            mark !== undefined
        ) {

            const number =
                Number(mark);

            if (!Number.isNaN(number)) {

                marks.push(number);

            }

        }

    });

    const average =
        marks.length
            ? marks.reduce(
                function(sum, mark) {
                    return sum + mark;
                },
                0
            ) / marks.length
            : 0;

    const highest =
        marks.length
            ? Math.max(...marks)
            : 0;

    const passed =
        marks.filter(
            function(mark) {
                return mark >= 50;
            }
        ).length;

    const totalStudents =
        document.getElementById(
            "totalStudents"
        );

    const classAverage =
        document.getElementById(
            "classAverage"
        );

    const highestMark =
        document.getElementById(
            "highestMark"
        );

    const passedCount =
        document.getElementById(
            "passedCount"
        );

    if (totalStudents) {

        totalStudents.textContent =
            filtered.length;

    }

    if (classAverage) {

        classAverage.textContent =
            marks.length
                ? average.toFixed(2)
                : "0";

    }

    if (highestMark) {

        highestMark.textContent =
            marks.length
                ? highest.toFixed(2)
                : "0";

    }

    if (passedCount) {

        passedCount.textContent =
            passed;

    }

}

// ==========================================
// MODAL
// ==========================================

function openMarkModal(studentId) {

    const student =
        students.find(function(item) {

            return (
                String(item.id) ===
                String(studentId)
            );

        });

    if (!student) {
        return;
    }

    studentIdInput.value =
        student.id;

    modalStudentName.textContent =
        student.name;

    markInput.value =
        getMark(student.id);

    updateGradePreview();

    modal.classList.add("active");

    setTimeout(function() {

        markInput.focus();

    }, 50);

}

function closeMarkModal() {

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    if (markForm) {
        markForm.reset();
    }

    if (studentIdInput) {
        studentIdInput.value = "";
    }

    if (gradePreview) {
        gradePreview.textContent = "-";
    }

}

// ==========================================
// MODAL EVENTS
// ==========================================

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeMarkModal
    );

}

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeMarkModal
    );

}

if (modal) {

    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {

                closeMarkModal();

            }

        }
    );

}

// ==========================================
// FORM SUBMIT
// ==========================================

if (markForm) {

    markForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const studentId =
                studentIdInput.value;

            const value =
                markInput.value;

            if (value === "") {

                alert(
                    "Please enter a mark."
                );

                return;

            }

            updateMark(
                studentId,
                value
            );

            closeMarkModal();

            alert(
                "Mark saved successfully."
            );

        }
    );

}

// ==========================================
// GRADE PREVIEW
// ==========================================

if (markInput) {

    markInput.addEventListener(
        "input",
        updateGradePreview
    );

}

function updateGradePreview() {

    if (
        !markInput ||
        !gradePreview
    ) {

        return;

    }

    const value =
        markInput.value;

    if (value === "") {

        gradePreview.textContent = "-";

        return;

    }

    const number =
        Number(value);

    if (
        Number.isNaN(number) ||
        number < 0 ||
        number > 100
    ) {

        gradePreview.textContent = "-";

        return;

    }

    gradePreview.textContent =
        calculateGrade(number);

}

// ==========================================
// SAVE BUTTON
// ==========================================

if (saveResultsBtn) {

    saveResultsBtn.addEventListener(
        "click",
        function() {

            saveResultsData();

            alert(
                "Results saved successfully!"
            );

        }
    );

}

// ==========================================
// FILTER EVENTS
// ==========================================

if (gradeFilter) {

    gradeFilter.addEventListener(
        "change",
        renderResults
    );

}

if (classFilter) {

    classFilter.addEventListener(
        "change",
        renderResults
    );

}

if (subjectFilter) {

    subjectFilter.addEventListener(
        "change",
        renderResults
    );

}

if (examType) {

    examType.addEventListener(
        "change",
        renderResults
    );

}

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderResults
    );

}

// ==========================================
// DOUBLE CLICK MARK
// ==========================================

if (tableBody) {

    tableBody.addEventListener(
        "dblclick",
        function(event) {

            const input =
                event.target.closest(
                    ".mark-input"
                );

            if (!input) {
                return;
            }

            openMarkModal(
                input.dataset.studentId
            );

        }
    );

}

// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}

// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("active")
        ) {

            closeMarkModal();

        }

    }
);

// ==========================================
// INITIALIZE
// ==========================================

loadStudents();

loadResults();

renderResults();

console.log(
    "A.Kolfe Results Management loaded successfully."
);