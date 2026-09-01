/* =========================================================
   A.KOLFE SECONDARY SCHOOL
   REPORT CARDS MODULE
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STUDENTS_KEY = "kolfeStudents";
const RESULTS_KEY = "kolfeResults";


/* =========================================================
   ELEMENTS
========================================================= */

const gradeFilter = document.getElementById("gradeFilter");
const classFilter = document.getElementById("classFilter");
const studentFilter = document.getElementById("studentFilter");
const examFilter = document.getElementById("examFilter");

const printReportBtn = document.getElementById("printReportBtn");


/* =========================================================
   DATA
========================================================= */

let students = [];
let results = {};


/* =========================================================
   SUBJECTS
========================================================= */

const subjects = [
    "Mathematics",
    "Biology",
    "English",
    "Chemistry",
    "Physics",
    "HPE",
    "Citizenship"
];


/* =========================================================
   LOAD DATA
========================================================= */

function loadData() {

    try {

        const savedStudents =
            localStorage.getItem(STUDENTS_KEY);

        const savedResults =
            localStorage.getItem(RESULTS_KEY);

        students = savedStudents
            ? JSON.parse(savedStudents)
            : [];

        results = savedResults
            ? JSON.parse(savedResults)
            : {};

    } catch (error) {

        console.error("Could not load report card data:", error);

        students = [];
        results = {};

    }

}


/* =========================================================
   NORMALIZE GRADE
========================================================= */

function normalizeGrade(value) {

    if (!value) {
        return "";
    }

    const text = String(value).trim();

    if (/^9$/.test(text)) {
        return "Grade 9";
    }

    if (/^10$/.test(text)) {
        return "Grade 10";
    }

    if (/^11$/.test(text)) {
        return "Grade 11";
    }

    if (/^12$/.test(text)) {
        return "Grade 12";
    }

    if (/^grade\s*9$/i.test(text)) {
        return "Grade 9";
    }

    if (/^grade\s*10$/i.test(text)) {
        return "Grade 10";
    }

    if (/^grade\s*11$/i.test(text)) {
        return "Grade 11";
    }

    if (/^grade\s*12$/i.test(text)) {
        return "Grade 12";
    }

    return text;

}


/* =========================================================
   NORMALIZE CLASS
========================================================= */

function getClassNumber(value) {

    if (value === undefined || value === null) {
        return "";
    }

    const text = String(value).trim();

    /*
       Supports:

       1
       "1"
       "Class 1"
       "9-1"
       "Grade 9 - 1"
       "Grade 9 Class 1"
    */

    const classMatch =
        text.match(/(?:class\s*)?(\d+)$/i);

    if (classMatch) {
        return classMatch[1];
    }

    const sectionMatch =
        text.match(/-(\d+)$/);

    if (sectionMatch) {
        return sectionMatch[1];
    }

    return text;

}


/* =========================================================
   GET STUDENT ID
========================================================= */

function getStudentId(student) {

    return String(
        student.studentId ||
        student.id ||
        ""
    ).trim();

}


/* =========================================================
   GET STUDENT CLASS
========================================================= */

function getStudentClass(student) {

    return getClassNumber(
        student.section ||
        student.classNumber ||
        student.class ||
        ""
    );

}


/* =========================================================
   GET RESULT KEY
========================================================= */

function getResultKey(student, subject, exam) {

    const grade =
        normalizeGrade(student.grade);

    const classNumber =
        getStudentClass(student);

    const studentId =
        getStudentId(student);

    return (
        grade +
        "_" +
        classNumber +
        "_" +
        subject +
        "_" +
        exam +
        "_" +
        studentId
    );

}


/* =========================================================
   GET MARK
========================================================= */

function getMark(student, subject, exam) {

    const key =
        getResultKey(
            student,
            subject,
            exam
        );

    const value = results[key];

    if (value === undefined || value === null) {
        return null;
    }

    /*
       Results module may store either:

       85

       or

       { mark: 85 }
    */

    if (
        typeof value === "object" &&
        value !== null
    ) {

        if (
            value.mark !== undefined
        ) {
            const number =
                Number(value.mark);

            return Number.isFinite(number)
                ? number
                : null;
        }

    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;

}


/* =========================================================
   GET LETTER GRADE
========================================================= */

function getGrade(mark) {

    if (
        mark === null ||
        mark === undefined ||
        mark === ""
    ) {
        return "-";
    }

    const number = Number(mark);

    if (number >= 90) {
        return "A+";
    }

    if (number >= 80) {
        return "A";
    }

    if (number >= 70) {
        return "B";
    }

    if (number >= 60) {
        return "C";
    }

    if (number >= 50) {
        return "D";
    }

    return "F";

}


/* =========================================================
   PASS / FAIL
========================================================= */

function isPassed(mark) {

    return Number(mark) >= 50;

}


/* =========================================================
   GET FILTERED STUDENTS
========================================================= */

function getFilteredStudents() {

    const selectedGrade =
        normalizeGrade(gradeFilter.value);

    const selectedClass =
        getClassNumber(classFilter.value);

    return students.filter(student => {

        const studentGrade =
            normalizeGrade(student.grade);

        const studentClass =
            getStudentClass(student);

        return (
            studentGrade === selectedGrade &&
            studentClass === selectedClass
        );

    });

}


/* =========================================================
   POPULATE STUDENT DROPDOWN
========================================================= */

function populateStudents() {

    const filteredStudents =
        getFilteredStudents();

    studentFilter.innerHTML =
        '<option value="">Select Student</option>';


    filteredStudents.forEach(student => {

        const option =
            document.createElement("option");

        option.value =
            getStudentId(student);

        option.textContent =
            `${student.name || "Unnamed Student"} — ${getStudentId(student)}`;

        studentFilter.appendChild(option);

    });


    /*
       Automatically select the first student
       when students exist.
    */

    if (filteredStudents.length > 0) {

        studentFilter.value =
            getStudentId(filteredStudents[0]);

    }

}


/* =========================================================
   FIND SELECTED STUDENT
========================================================= */

function getSelectedStudent() {

    const selectedId =
        String(studentFilter.value).trim();

    if (!selectedId) {
        return null;
    }

    return students.find(student => {

        return (
            getStudentId(student) === selectedId
        );

    }) || null;

}


/* =========================================================
   GENERATE REPORT
========================================================= */

function generateReport() {

    const student =
        getSelectedStudent();

    const exam =
        examFilter.value;


    if (!student) {

        clearReport();

        return;

    }


    const studentId =
        getStudentId(student);

    const grade =
        normalizeGrade(student.grade);

    const classNumber =
        getStudentClass(student);


    /* -----------------------------------------
       Student Information
    ----------------------------------------- */

    document.getElementById(
        "reportStudentName"
    ).textContent =
        student.name || "-";


    document.getElementById(
        "reportStudentId"
    ).textContent =
        studentId || "-";


    document.getElementById(
        "reportGrade"
    ).textContent =
        grade || "-";


    document.getElementById(
        "reportClass"
    ).textContent =
        classNumber
            ? `Class ${classNumber}`
            : "-";


    document.getElementById(
        "reportExamTitle"
    ).textContent =
        `${exam.toUpperCase()} REPORT`;


    /* -----------------------------------------
       Results
    ----------------------------------------- */

    const tableBody =
        document.getElementById(
            "reportTableBody"
        );

    tableBody.innerHTML = "";


    let total = 0;
    let count = 0;
    let passed = 0;
    let failed = 0;
    let highest = 0;


    subjects.forEach(
        (subject, index) => {

            const mark =
                getMark(
                    student,
                    subject,
                    exam
                );


            /*
               Only show subjects that have
               a result.
            */

            if (mark === null) {
                return;
            }


            const letterGrade =
                getGrade(mark);

            const pass =
                isPassed(mark);


            total += mark;

            count++;


            if (pass) {
                passed++;
            } else {
                failed++;
            }


            if (mark > highest) {
                highest = mark;
            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${count}</td>

                <td>
                    <strong>
                        ${escapeHTML(subject)}
                    </strong>
                </td>

                <td>
                    ${Number(mark).toFixed(2)}
                </td>

                <td class="grade-cell">
                    ${letterGrade}
                </td>

                <td class="${
                    pass
                        ? "status-pass"
                        : "status-fail"
                }">

                    ${
                        pass
                            ? "Pass"
                            : "Fail"
                    }

                </td>

            `;


            tableBody.appendChild(row);

        }
    );


    /* -----------------------------------------
       No Results
    ----------------------------------------- */

    if (count === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-report"
                >

                    No results found for
                    ${escapeHTML(exam)}.

                    <br><br>

                    Please enter marks in the
                    Results module first.

                </td>

            </tr>

        `;

    }


    /* -----------------------------------------
       Calculations
    ----------------------------------------- */

    const average =
        count > 0
            ? total / count
            : 0;


    let overallGrade = "-";


    if (count > 0) {

        overallGrade =
            getGrade(average);

    }


    const overallPassed =
        count > 0 &&
        failed === 0;


    /* -----------------------------------------
       Table Footer
    ----------------------------------------- */

    document.getElementById(
        "reportTotal"
    ).textContent =
        total.toFixed(2);


    document.getElementById(
        "reportAverage"
    ).textContent =
        count > 0
            ? average.toFixed(2)
            : "0";


    document.getElementById(
        "reportOverallStatus"
    ).textContent =
        count === 0
            ? "-"
            : overallPassed
                ? "PASS"
                : "FAIL";


    /* -----------------------------------------
       Summary
    ----------------------------------------- */

    document.getElementById(
        "summaryAverage"
    ).textContent =
        count > 0
            ? average.toFixed(2)
            : "0";


    document.getElementById(
        "summaryPassed"
    ).textContent =
        passed;


    document.getElementById(
        "summaryFailed"
    ).textContent =
        failed;


    document.getElementById(
        "summaryGrade"
    ).textContent =
        overallGrade;


    /* -----------------------------------------
       Statistics
    ----------------------------------------- */

    document.getElementById(
        "subjectCount"
    ).textContent =
        count;


    document.getElementById(
        "averageMark"
    ).textContent =
        count > 0
            ? average.toFixed(2)
            : "0";


    document.getElementById(
        "highestMark"
    ).textContent =
        count > 0
            ? highest.toFixed(2)
            : "0";


    document.getElementById(
        "overallResult"
    ).textContent =
        count === 0
            ? "-"
            : overallPassed
                ? "PASS"
                : "FAIL";


    /* -----------------------------------------
       Teacher Remark
    ----------------------------------------- */

    document.getElementById(
        "teacherRemark"
    ).textContent =
        createTeacherRemark(
            average,
            failed,
            count
        );

}


/* =========================================================
   TEACHER REMARK
========================================================= */

function createTeacherRemark(
    average,
    failed,
    count
) {

    if (count === 0) {

        return "No academic results are available for this examination.";

    }


    if (failed > 0) {

        return "The student needs additional support and improvement in the subjects that were not passed.";

    }


    if (average >= 90) {

        return "Excellent performance. Keep up the outstanding work.";

    }


    if (average >= 80) {

        return "Very good performance. Continue working hard.";

    }


    if (average >= 70) {

        return "Good performance. With continued effort, even better results are possible.";

    }


    if (average >= 60) {

        return "Satisfactory performance. More effort is recommended for further improvement.";

    }


    return "The student should work harder and receive additional academic support.";

}


/* =========================================================
   CLEAR REPORT
========================================================= */

function clearReport() {

    document.getElementById(
        "reportStudentName"
    ).textContent = "-";

    document.getElementById(
        "reportStudentId"
    ).textContent = "-";

    document.getElementById(
        "reportGrade"
    ).textContent = "-";

    document.getElementById(
        "reportClass"
    ).textContent = "-";


    document.getElementById(
        "reportExamTitle"
    ).textContent =
        "REPORT CARD";


    document.getElementById(
        "reportTableBody"
    ).innerHTML = `

        <tr>

            <td
                colspan="5"
                class="empty-report"
            >

                Select a student to generate
                the report card.

            </td>

        </tr>

    `;


    document.getElementById(
        "reportTotal"
    ).textContent = "0";


    document.getElementById(
        "reportAverage"
    ).textContent = "0";


    document.getElementById(
        "reportOverallStatus"
    ).textContent = "-";


    document.getElementById(
        "summaryAverage"
    ).textContent = "0";


    document.getElementById(
        "summaryPassed"
    ).textContent = "0";


    document.getElementById(
        "summaryFailed"
    ).textContent = "0";


    document.getElementById(
        "summaryGrade"
    ).textContent = "-";


    document.getElementById(
        "subjectCount"
    ).textContent = "0";


    document.getElementById(
        "averageMark"
    ).textContent = "0";


    document.getElementById(
        "highestMark"
    ).textContent = "0";


    document.getElementById(
        "overallResult"
    ).textContent = "-";


    document.getElementById(
        "teacherRemark"
    ).textContent =
        "Select a student to view the report.";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value === undefined ||
        value === null
            ? ""
            : String(value);

    return div.innerHTML;

}


/* =========================================================
   FILTER EVENTS
========================================================= */

gradeFilter.addEventListener(
    "change",
    function () {

        populateStudents();

        generateReport();

    }
);


classFilter.addEventListener(
    "change",
    function () {

        populateStudents();

        generateReport();

    }
);


studentFilter.addEventListener(
    "change",
    function () {

        generateReport();

    }
);


examFilter.addEventListener(
    "change",
    function () {

        generateReport();

    }
);


/* =========================================================
   PRINT
========================================================= */

printReportBtn.addEventListener(
    "click",
    function () {

        const student =
            getSelectedStudent();

        if (!student) {

            alert(
                "Please select a student first."
            );

            return;

        }

        window.print();

    }
);


/* =========================================================
   START
========================================================= */

loadData();

populateStudents();

generateReport();